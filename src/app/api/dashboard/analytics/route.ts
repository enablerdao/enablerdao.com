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

async function fetchStripePriceLookup(key: string): Promise<Record<string, { name: string; currency: string; amount: number }>> {
  try {
    const res = await fetch(
      "https://api.stripe.com/v1/prices?active=true&limit=100&expand[]=data.product",
      { headers: { Authorization: `Bearer ${key}` } }
    );
    if (!res.ok) return {};
    const data = await res.json();
    const lookup: Record<string, { name: string; currency: string; amount: number }> = {};
    for (const price of data.data || []) {
      const productName = typeof price.product === "object" ? price.product?.name : null;
      const name = productName || price.nickname || `Plan (${price.id.slice(-8)})`;
      lookup[price.id] = { name, currency: price.currency || "usd", amount: price.unit_amount || 0 };
    }
    return lookup;
  } catch {
    return {};
  }
}

async function fetchStripeData(): Promise<StripeData> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return { subscriptions: [], total_active: 0 };

  // Fetch subscriptions and price details in parallel
  const [subsRes, priceLookup] = await Promise.all([
    fetch("https://api.stripe.com/v1/subscriptions?status=active&limit=100", {
      headers: { Authorization: `Bearer ${key}` },
    }),
    fetchStripePriceLookup(key),
  ]);

  if (!subsRes.ok) {
    console.error(`[analytics] Stripe error: ${subsRes.status}`);
    return { subscriptions: [], total_active: 0 };
  }

  const data = await subsRes.json();
  const subs = data.data || [];

  // Merge PRICE_MAP with dynamic lookup (PRICE_MAP takes precedence)
  const fullLookup = { ...priceLookup, ...PRICE_MAP };

  // Count active subscriptions per price ID
  const priceCounts: Record<string, number> = {};
  for (const sub of subs) {
    const items = sub.items?.data || [];
    for (const item of items) {
      const priceId = item.price?.id;
      if (priceId) {
        priceCounts[priceId] = (priceCounts[priceId] || 0) + 1;
      }
    }
  }

  // Build subscription breakdown
  const subscriptions: StripeSubscription[] = [];
  for (const [priceId, count] of Object.entries(priceCounts)) {
    const info = fullLookup[priceId];
    const name = info?.name ?? `Plan (${priceId.slice(-8)})`;
    const currency = info?.currency ?? "usd";
    const amount = info?.amount ?? 0;
    subscriptions.push({
      product_name: name,
      currency,
      unit_amount: amount,
      active_count: count,
      mrr_contribution: amount * count,
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

const EBR_MINT = "E1JxwaWRd8nw8vDdWMdqwdbXGBshqDcnTcinHzNMqg2Y";
const SOLANA_RPC = "https://api.mainnet-beta.solana.com";

async function fetchEBRHolders(): Promise<number> {
  try {
    // Use Solana RPC getProgramAccounts to count token accounts for EBR mint.
    // Solscan API v2 is deprecated/unreachable; this queries the chain directly.
    const res = await fetch(SOLANA_RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getProgramAccounts",
        params: [
          "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          {
            filters: [
              { dataSize: 165 },
              { memcmp: { offset: 0, bytes: EBR_MINT } },
            ],
            encoding: "base64",
            dataSlice: { offset: 0, length: 0 },
          },
        ],
      }),
    });

    if (!res.ok) return 0;

    const data = await res.json();
    if (data.error) {
      console.error("[analytics] Solana RPC error:", data.error);
      return 0;
    }
    return Array.isArray(data.result) ? data.result.length : 0;
  } catch (err) {
    console.error("[analytics] EBR holder count fetch failed:", err);
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
