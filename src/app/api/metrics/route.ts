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

interface WeeklyBucket {
  week: string; // ISO date string for the Monday of that week
  new_subs: number;
  cumulative: number;
}

interface ProductGrowth {
  product_name: string;
  active: number;
  new_this_month: number;
}

interface GrowthData {
  weekly: WeeklyBucket[];
  by_product: ProductGrowth[];
}

interface SiteStatus {
  name: string;
  url: string;
  status: number;
  ok: boolean;
}

interface KPI {
  total_users: number;
  paid_subscribers: number;
  mrr_usd_cents: number;
  mrr_jpy: number;
  ebr_holders: number;
  github_stars: number;
  new_subscribers_week: number;
  new_subscribers_month: number;
  growth_rate_percent: number;
}

interface MetricsResponse {
  kpi: KPI;
  growth: GrowthData;
  sites: SiteStatus[];
  stripe: StripeData;
  chatweb: ChatwebData | null;
  community: CommunityData;
  fetchedAt: string;
}

// --- In-memory cache (5 min) ---

let cache: { data: MetricsResponse; expiresAt: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000;

// --- Known price -> product mapping ---

const PRICE_MAP: Record<string, { name: string; currency: string; amount: number }> = {
  "price_1Sy5ncDqLakc8NxkXJ1CdfIs": { name: "Chatweb.ai Starter", currency: "usd", amount: 900 },
  "price_1Sy5ndDqLakc8NxkI40BhY1c": { name: "Chatweb.ai Pro", currency: "usd", amount: 2900 },
  "price_1T1T9qDqLakc8NxkijNuxAZt": { name: "StayFlow Starter", currency: "jpy", amount: 2900 },
  "price_1T1T9rDqLakc8NxkkHfdn6Zr": { name: "StayFlow Pro", currency: "jpy", amount: 7900 },
};

// --- Production sites ---

const PRODUCTION_SITES: { name: string; url: string }[] = [
  { name: "Chatweb.ai", url: "https://chatweb.ai" },
  { name: "StayFlow", url: "https://stayflowapp.com" },
  { name: "BANTO", url: "https://banto.work" },
  { name: "MisebanAI", url: "https://misebanai.com" },
  { name: "EnablerDAO", url: "https://enablerdao.com" },
  { name: "DojoC", url: "https://dojoc.io" },
  { name: "Elio", url: "https://elio.love" },
  { name: "JiuFlow", url: "https://jiuflow.art" },
  { name: "teai.io", url: "https://teai.io" },
  { name: "SOLUNA", url: "https://solun.art" },
  { name: "enabler.fun", url: "https://enabler.fun" },
];

// --- Utility: get Monday of a given date's week ---

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday = 1
  date.setUTCDate(date.getUTCDate() + diff);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

function formatWeek(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// --- Fetch functions ---

interface RawStripeSub {
  id: string;
  status: string;
  created: number;
  items?: { data?: Array<{ price?: { id?: string } }> };
}

async function fetchStripeActive(): Promise<{ subs: RawStripeSub[]; data: StripeData }> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return { subs: [], data: { subscriptions: [], total_active: 0 } };

  const res = await fetch(
    "https://api.stripe.com/v1/subscriptions?status=active&limit=100&expand[]=data.items.data.price",
    { headers: { Authorization: `Bearer ${key}` } }
  );

  if (!res.ok) {
    console.error(`[metrics] Stripe active subs error: ${res.status}`);
    return { subs: [], data: { subscriptions: [], total_active: 0 } };
  }

  const json = await res.json();
  const subs: RawStripeSub[] = json.data || [];

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
    const known = PRICE_MAP[priceId];
    if (known) {
      subscriptions.push({
        product_name: known.name,
        currency: known.currency,
        unit_amount: known.amount,
        active_count: count,
        mrr_contribution: known.amount * count,
      });
    } else {
      subscriptions.push({
        product_name: `Unknown (${priceId.slice(-8)})`,
        currency: "usd",
        unit_amount: 0,
        active_count: count,
        mrr_contribution: 0,
      });
    }
  }

  return {
    subs,
    data: { subscriptions, total_active: subs.length },
  };
}

async function fetchStripeRecent(sinceUnix: number): Promise<RawStripeSub[]> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return [];

  const res = await fetch(
    `https://api.stripe.com/v1/subscriptions?status=all&limit=100&created[gte]=${sinceUnix}&expand[]=data.items.data.price`,
    { headers: { Authorization: `Bearer ${key}` } }
  );

  if (!res.ok) {
    console.error(`[metrics] Stripe recent subs error: ${res.status}`);
    return [];
  }

  const json = await res.json();
  return json.data || [];
}

function buildGrowthData(
  activeSubs: RawStripeSub[],
  recentSubs: RawStripeSub[],
  now: Date
): { growth: GrowthData; newWeek: number; newMonth: number; growthRate: number } {
  // --- Weekly timeline (last 12 weeks) ---
  const WEEKS = 12;
  const currentMonday = getMonday(now);
  const weekStarts: Date[] = [];
  for (let i = WEEKS - 1; i >= 0; i--) {
    const d = new Date(currentMonday);
    d.setUTCDate(d.getUTCDate() - i * 7);
    weekStarts.push(d);
  }

  // Merge active + recent (deduplicate by id)
  const allSubsMap = new Map<string, RawStripeSub>();
  for (const sub of activeSubs) allSubsMap.set(sub.id, sub);
  for (const sub of recentSubs) allSubsMap.set(sub.id, sub);
  const allSubs = Array.from(allSubsMap.values());

  // Sort all subs by created ascending
  allSubs.sort((a, b) => a.created - b.created);

  // Build weekly buckets
  const weeklyBuckets: WeeklyBucket[] = [];
  const twelveWeeksAgoUnix = Math.floor(weekStarts[0].getTime() / 1000);

  // Count subs created before the 12-week window (baseline)
  let cumulative = allSubs.filter((s) => s.created < twelveWeeksAgoUnix).length;

  for (let i = 0; i < weekStarts.length; i++) {
    const weekStart = Math.floor(weekStarts[i].getTime() / 1000);
    const weekEnd =
      i < weekStarts.length - 1
        ? Math.floor(weekStarts[i + 1].getTime() / 1000)
        : Math.floor(now.getTime() / 1000) + 1;

    const newInWeek = allSubs.filter(
      (s) => s.created >= weekStart && s.created < weekEnd
    ).length;

    cumulative += newInWeek;

    weeklyBuckets.push({
      week: formatWeek(weekStarts[i]),
      new_subs: newInWeek,
      cumulative,
    });
  }

  // --- By product (active subs only) ---
  const nowUnix = Math.floor(now.getTime() / 1000);
  const monthAgoUnix = nowUnix - 30 * 24 * 60 * 60;

  const productMap = new Map<string, { active: number; new_this_month: number }>();

  for (const sub of activeSubs) {
    const items = sub.items?.data || [];
    for (const item of items) {
      const priceId = item.price?.id;
      const known = priceId ? PRICE_MAP[priceId] : undefined;
      const name = known?.name ?? `Unknown (${priceId?.slice(-8) ?? "?"})`;

      const entry = productMap.get(name) || { active: 0, new_this_month: 0 };
      entry.active += 1;
      if (sub.created >= monthAgoUnix) {
        entry.new_this_month += 1;
      }
      productMap.set(name, entry);
    }
  }

  const byProduct: ProductGrowth[] = Array.from(productMap.entries()).map(
    ([product_name, data]) => ({ product_name, ...data })
  );

  // --- New subscribers this week / this month ---
  const weekAgoUnix = nowUnix - 7 * 24 * 60 * 60;
  const newWeek = allSubs.filter(
    (s) => s.created >= weekAgoUnix && s.created <= nowUnix
  ).length;
  const newMonth = allSubs.filter(
    (s) => s.created >= monthAgoUnix && s.created <= nowUnix
  ).length;

  // --- Growth rate: month-over-month (compare last 30 days vs prior 30 days) ---
  const twoMonthsAgoUnix = nowUnix - 60 * 24 * 60 * 60;
  const prevMonthNew = allSubs.filter(
    (s) => s.created >= twoMonthsAgoUnix && s.created < monthAgoUnix
  ).length;
  const growthRate =
    prevMonthNew > 0
      ? Math.round(((newMonth - prevMonthNew) / prevMonthNew) * 100)
      : newMonth > 0
        ? 100
        : 0;

  return {
    growth: { weekly: weeklyBuckets, by_product: byProduct },
    newWeek,
    newMonth,
    growthRate,
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
      console.error(`[metrics] Chatweb error: ${res.status}`);
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
    console.error("[metrics] Chatweb fetch failed:", err);
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
    console.error("[metrics] Solscan fetch failed:", err);
    return 0;
  }
}

async function fetchGitHubStats(): Promise<{ stars: number; repos: number }> {
  try {
    const res = await fetch(
      "https://api.github.com/users/yukihamada/repos?per_page=100&sort=updated",
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "enablerdao-dashboard",
        },
      }
    );

    if (!res.ok) return { stars: 0, repos: 0 };

    const repos = await res.json();
    const stars = repos.reduce(
      (sum: number, r: { stargazers_count?: number }) =>
        sum + (r.stargazers_count || 0),
      0
    );
    return { stars, repos: repos.length };
  } catch (err) {
    console.error("[metrics] GitHub fetch failed:", err);
    return { stars: 0, repos: 0 };
  }
}

async function checkSiteHealth(
  site: { name: string; url: string },
  signal: AbortSignal
): Promise<SiteStatus> {
  try {
    const res = await fetch(site.url, {
      method: "HEAD",
      redirect: "follow",
      signal,
    });
    return { name: site.name, url: site.url, status: res.status, ok: res.ok };
  } catch {
    return { name: site.name, url: site.url, status: 0, ok: false };
  }
}

async function fetchAllSiteHealth(): Promise<SiteStatus[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000); // 10s overall timeout

  try {
    const results = await Promise.allSettled(
      PRODUCTION_SITES.map((site) => checkSiteHealth(site, controller.signal))
    );

    return results.map((r, i) =>
      r.status === "fulfilled"
        ? r.value
        : { name: PRODUCTION_SITES[i].name, url: PRODUCTION_SITES[i].url, status: 0, ok: false }
    );
  } finally {
    clearTimeout(timeout);
  }
}

// --- Route handler ---

export async function GET() {
  try {
    // Return cached data if fresh
    if (cache && Date.now() < cache.expiresAt) {
      return NextResponse.json(cache.data);
    }

    const now = new Date();
    const twelveWeeksAgoUnix = Math.floor(
      (now.getTime() - 12 * 7 * 24 * 60 * 60 * 1000) / 1000
    );

    // Fetch all sources in parallel (resilient to individual failures)
    const [
      stripeActiveResult,
      stripeRecentResult,
      chatwebResult,
      ebrResult,
      githubResult,
      sitesResult,
    ] = await Promise.allSettled([
      fetchStripeActive(),
      fetchStripeRecent(twelveWeeksAgoUnix),
      fetchChatwebStats(),
      fetchEBRHolders(),
      fetchGitHubStats(),
      fetchAllSiteHealth(),
    ]);

    const stripeActive =
      stripeActiveResult.status === "fulfilled"
        ? stripeActiveResult.value
        : { subs: [], data: { subscriptions: [], total_active: 0 } as StripeData };
    const stripeRecent =
      stripeRecentResult.status === "fulfilled" ? stripeRecentResult.value : [];
    const chatweb =
      chatwebResult.status === "fulfilled" ? chatwebResult.value : null;
    const ebrHolders =
      ebrResult.status === "fulfilled" ? ebrResult.value : 0;
    const github =
      githubResult.status === "fulfilled"
        ? githubResult.value
        : { stars: 0, repos: 0 };
    const sites =
      sitesResult.status === "fulfilled" ? sitesResult.value : [];

    // Build growth data from subscription timestamps
    const { growth, newWeek, newMonth, growthRate } = buildGrowthData(
      stripeActive.subs,
      stripeRecent,
      now
    );

    // Calculate MRR by currency
    const mrrUsdCents = stripeActive.data.subscriptions
      .filter((s) => s.currency === "usd")
      .reduce((sum, s) => sum + s.mrr_contribution, 0);
    const mrrJpy = stripeActive.data.subscriptions
      .filter((s) => s.currency === "jpy")
      .reduce((sum, s) => sum + s.mrr_contribution, 0);

    const responseData: MetricsResponse = {
      kpi: {
        total_users: chatweb?.total_users ?? 0,
        paid_subscribers: stripeActive.data.total_active,
        mrr_usd_cents: mrrUsdCents,
        mrr_jpy: mrrJpy,
        ebr_holders: ebrHolders,
        github_stars: github.stars,
        new_subscribers_week: newWeek,
        new_subscribers_month: newMonth,
        growth_rate_percent: growthRate,
      },
      growth,
      sites,
      stripe: stripeActive.data,
      chatweb,
      community: {
        ebr_holders: ebrHolders,
        github_stars: github.stars,
        github_repos: github.repos,
      },
      fetchedAt: now.toISOString(),
    };

    // Update cache
    cache = { data: responseData, expiresAt: Date.now() + CACHE_TTL };

    return NextResponse.json(responseData);
  } catch (err) {
    console.error("[api/metrics] Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
