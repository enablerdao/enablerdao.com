import { NextResponse } from "next/server";

// --- Types ---

interface StripeSubscription {
  product_name: string;
  currency: string;
  unit_amount: number;
  active_count: number;
  mrr_contribution: number;
}

interface StripeData {
  subscriptions: StripeSubscription[];
  total_active: number;
}

interface ChatwebData {
  total_users: number;
  today_usage: number;
  sessions: { webchat: number; line: number; telegram: number; total: number };
}

interface CommunityData {
  ebr_holders: number;
  github_stars: number;
  github_repos: number;
}

interface KPI {
  total_users: number;
  paid_subscribers: number;
  mrr_usd_cents: number;
  mrr_jpy: number;
  ebr_holders: number;
  github_stars: number;
}

interface DashboardResponse {
  kpi: KPI;
  stripe: StripeData;
  chatweb: ChatwebData | null;
  community: CommunityData;
  fetchedAt: string;
}

// --- In-memory cache (5 min) ---

let cache: { data: DashboardResponse; expiresAt: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000;

// --- Known price → product mapping ---

const PRICE_MAP: Record<string, { name: string; currency: string; amount: number }> = {
  "price_1Sy5ncDqLakc8NxkXJ1CdfIs": { name: "Chatweb.ai Starter", currency: "usd", amount: 900 },
  "price_1Sy5ndDqLakc8NxkI40BhY1c": { name: "Chatweb.ai Pro", currency: "usd", amount: 2900 },
  "price_1T1T9qDqLakc8NxkijNuxAZt": { name: "StayFlow Starter", currency: "jpy", amount: 2900 },
  "price_1T1T9rDqLakc8NxkkHfdn6Zr": { name: "StayFlow Pro", currency: "jpy", amount: 7900 },
};

// --- Fetch functions ---

async function fetchStripeData(): Promise<StripeData> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return { subscriptions: [], total_active: 0 };

  const res = await fetch(
    "https://api.stripe.com/v1/subscriptions?status=active&limit=100&expand[]=data.items.data.price&expand[]=data.items.data.price.product",
    {
      headers: { Authorization: `Bearer ${key}` },
    }
  );

  if (!res.ok) {
    console.error(`[analytics] Stripe error: ${res.status}`);
    return { subscriptions: [], total_active: 0 };
  }

  const data = await res.json();
  const subs = data.data || [];

  // Count active subscriptions per price ID, capture actual price data
  const priceInfo: Record<string, { count: number; unit_amount: number; currency: string; product_name?: string }> = {};
  for (const sub of subs) {
    const items = sub.items?.data || [];
    for (const item of items) {
      const priceId = item.price?.id;
      if (priceId) {
        if (!priceInfo[priceId]) {
          priceInfo[priceId] = {
            count: 0,
            unit_amount: item.price?.unit_amount ?? 0,
            currency: item.price?.currency ?? "usd",
            product_name: typeof item.price?.product === "object" ? item.price.product?.name : undefined,
          };
        }
        priceInfo[priceId].count += 1;
      }
    }
  }

  // Build subscription breakdown
  const subscriptions: StripeSubscription[] = [];
  for (const [priceId, info] of Object.entries(priceInfo)) {
    const known = PRICE_MAP[priceId];
    const name = known?.name ?? info.product_name ?? `Plan (${priceId.slice(-8)})`;
    const currency = known?.currency ?? info.currency;
    const amount = known?.amount ?? info.unit_amount;
    subscriptions.push({
      product_name: name,
      currency,
      unit_amount: amount,
      active_count: info.count,
      mrr_contribution: amount * info.count,
    });
  }

  return {
    subscriptions,
    total_active: subs.length,
  };
}

async function fetchChatwebStats(): Promise<ChatwebData | null> {
  const key = process.env.CHATWEB_ADMIN_KEY;
  if (!key) return null;

  try {
    const res = await fetch("https://api.chatweb.ai/api/v1/admin/stats", {
      headers: { Authorization: `Bearer ${key}` },
    });

    if (!res.ok) {
      console.error(`[analytics] Chatweb error: ${res.status}`);
      return null;
    }

    const data = await res.json();
    return {
      total_users: data.total_users ?? 0,
      today_usage: data.today_usage ?? 0,
      sessions: {
        webchat: data.sessions?.webchat ?? 0,
        line: data.sessions?.line ?? 0,
        telegram: data.sessions?.telegram ?? 0,
        total: data.sessions?.total ?? 0,
      },
    };
  } catch (err) {
    console.error("[analytics] Chatweb fetch failed:", err);
    return null;
  }
}

async function fetchEBRHolders(): Promise<number> {
  try {
    const res = await fetch(
      "https://api.solscan.io/v2/token/holders?token=E1JxwaWRd8nw8vDdWMdqwdbXGBshqDcnTcinHzNMqg2Y&page=1&page_size=1",
      { headers: { Accept: "application/json" } }
    );

    if (!res.ok) return 0;

    const data = await res.json();
    return data.data?.total ?? data.total ?? 0;
  } catch (err) {
    console.error("[analytics] Solscan fetch failed:", err);
    return 0;
  }
}

async function fetchGitHubStats(): Promise<{ stars: number; repos: number }> {
  try {
    const res = await fetch(
      "https://api.github.com/users/yukihamada/repos?per_page=100&sort=updated",
      { headers: { Accept: "application/vnd.github.v3+json", "User-Agent": "enablerdao-dashboard" } }
    );

    if (!res.ok) return { stars: 0, repos: 0 };

    const repos = await res.json();
    const stars = repos.reduce(
      (sum: number, r: { stargazers_count?: number }) => sum + (r.stargazers_count || 0),
      0
    );
    return { stars, repos: repos.length };
  } catch (err) {
    console.error("[analytics] GitHub fetch failed:", err);
    return { stars: 0, repos: 0 };
  }
}

// --- Route handler ---

export async function GET() {
  try {
    // Return cached data if fresh
    if (cache && Date.now() < cache.expiresAt) {
      return NextResponse.json(cache.data);
    }

    // Fetch all sources in parallel (resilient to individual failures)
    const [stripeResult, chatwebResult, ebrResult, githubResult] =
      await Promise.allSettled([
        fetchStripeData(),
        fetchChatwebStats(),
        fetchEBRHolders(),
        fetchGitHubStats(),
      ]);

    const stripe = stripeResult.status === "fulfilled" ? stripeResult.value : { subscriptions: [], total_active: 0 };
    const chatweb = chatwebResult.status === "fulfilled" ? chatwebResult.value : null;
    const ebrHolders = ebrResult.status === "fulfilled" ? ebrResult.value : 0;
    const github = githubResult.status === "fulfilled" ? githubResult.value : { stars: 0, repos: 0 };

    // Calculate MRR by currency
    const mrrUsdCents = stripe.subscriptions
      .filter((s) => s.currency === "usd")
      .reduce((sum, s) => sum + s.mrr_contribution, 0);
    const mrrJpy = stripe.subscriptions
      .filter((s) => s.currency === "jpy")
      .reduce((sum, s) => sum + s.mrr_contribution, 0);

    const responseData: DashboardResponse = {
      kpi: {
        total_users: chatweb?.total_users ?? 0,
        paid_subscribers: stripe.total_active,
        mrr_usd_cents: mrrUsdCents,
        mrr_jpy: mrrJpy,
        ebr_holders: ebrHolders,
        github_stars: github.stars,
      },
      stripe,
      chatweb,
      community: {
        ebr_holders: ebrHolders,
        github_stars: github.stars,
        github_repos: github.repos,
      },
      fetchedAt: new Date().toISOString(),
    };

    // Update cache
    cache = { data: responseData, expiresAt: Date.now() + CACHE_TTL };

    return NextResponse.json(responseData);
  } catch (err) {
    console.error("[api/dashboard/analytics] Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
