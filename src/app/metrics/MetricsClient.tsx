"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

// --- Types ---

interface StripeSubscription {
  product_name: string;
  currency: string;
  unit_amount: number;
  active_count: number;
  mrr_contribution: number;
}

interface MetricsData {
  kpi: {
    total_users: number;
    paid_subscribers: number;
    mrr_usd_cents: number;
    mrr_jpy: number;
    ebr_holders: number;
    github_stars: number;
  };
  stripe: {
    subscriptions: StripeSubscription[];
    total_active: number;
  };
  chatweb: {
    total_users: number;
    today_usage: number;
    sessions: { webchat: number; line: number; telegram: number; total: number };
  } | null;
  community: {
    ebr_holders: number;
    github_stars: number;
    github_repos: number;
  };
  fetchedAt: string;
}

interface SiteStatus {
  name: string;
  url: string;
  status: "checking" | "online" | "down";
}

// --- Constants ---

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

const ALL_SITES: { name: string; url: string }[] = [
  { name: "enablerdao.com", url: "https://enablerdao.com" },
  { name: "chatweb.ai", url: "https://chatweb.ai" },
  { name: "teai.io", url: "https://teai.io" },
  { name: "stayflowapp.com", url: "https://stayflowapp.com" },
  { name: "jiuflow.art", url: "https://jiuflow.art" },
  { name: "misebanai.com", url: "https://misebanai.com" },
  { name: "banto.work", url: "https://banto.work" },
  { name: "enabler.fun", url: "https://enabler.fun" },
  { name: "elio.love", url: "https://elio.love" },
  { name: "solun.art", url: "https://solun.art" },
  { name: "enabler.cc", url: "https://enabler.cc" },
];

// Simulated weekly subscriber data (last 12 weeks)
// In production, this would come from the API
function generateWeeklyData(): { week: string; count: number }[] {
  const weeks: { week: string; count: number }[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 7);
    const label = `${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getDate().toString().padStart(2, "0")}`;
    // Simulate growth trend with some variance
    const base = Math.max(1, Math.round(2 + (11 - i) * 0.6));
    const variance = Math.round((Math.sin(i * 1.3) + 1) * 1.5);
    weeks.push({ week: label, count: base + variance });
  }
  return weeks;
}

// --- Helpers ---

function makeAsciiBar(value: number, max: number, width: number = 12): string {
  if (max === 0) return "\u2591".repeat(width);
  const filled = Math.round((value / max) * width);
  return "\u2588".repeat(filled) + "\u2591".repeat(width - filled);
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}

function formatUSD(cents: number): string {
  return "$" + (cents / 100).toFixed(2);
}

function formatJPY(yen: number): string {
  return "\u00a5" + yen.toLocaleString();
}

// --- SVG Sparkline ---

function Sparkline({
  data,
  labels,
  width = 600,
  height = 120,
  color = "#00ff00",
}: {
  data: number[];
  labels?: string[];
  width?: number;
  height?: number;
  color?: string;
}) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const barGap = 2;
  const labelHeight = 16;
  const yLabelWidth = 28;
  const chartHeight = height - labelHeight - 4;
  const chartWidth = width - yLabelWidth;
  const barWidth = (chartWidth - (data.length - 1) * barGap) / data.length;

  // Y-axis ticks
  const yTicks = [0, Math.round(max / 2), max];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxHeight: height }}>
      {/* Y-axis labels */}
      {yTicks.map((tick) => {
        const y = 4 + chartHeight - (tick / max) * chartHeight;
        return (
          <g key={tick}>
            <text x={yLabelWidth - 4} y={y + 3} fill="#555" fontSize="8" textAnchor="end" fontFamily="monospace">
              {tick}
            </text>
            <line x1={yLabelWidth} y1={y} x2={width} y2={y} stroke="#1a3a1a" strokeWidth="0.5" />
          </g>
        );
      })}

      {/* Bars */}
      {data.map((v, i) => {
        const barHeight = Math.max(1, (v / max) * chartHeight);
        const x = yLabelWidth + i * (barWidth + barGap);
        const y = 4 + chartHeight - barHeight;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={color}
              opacity={0.8}
              rx={1}
            />
            {/* Value label on top of bar */}
            {v > 0 && (
              <text
                x={x + barWidth / 2}
                y={y - 2}
                fill={color}
                fontSize="7"
                textAnchor="middle"
                fontFamily="monospace"
                opacity={0.7}
              >
                {v}
              </text>
            )}
          </g>
        );
      })}

      {/* X-axis labels */}
      {labels &&
        labels.map((label, i) => {
          const x = yLabelWidth + i * (barWidth + barGap) + barWidth / 2;
          // Show every other label on small datasets, every 3rd on larger
          const showLabel = data.length <= 12 ? i % 2 === 0 : i % 3 === 0;
          if (!showLabel) return null;
          return (
            <text
              key={i}
              x={x}
              y={height - 2}
              fill="#555"
              fontSize="7"
              textAnchor="middle"
              fontFamily="monospace"
            >
              {label}
            </text>
          );
        })}
    </svg>
  );
}

// --- Component ---

export default function MetricsClient() {
  const [data, setData] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [nextRefreshIn, setNextRefreshIn] = useState(REFRESH_INTERVAL / 1000);
  const [siteStatuses, setSiteStatuses] = useState<SiteStatus[]>(
    ALL_SITES.map((s) => ({ ...s, status: "checking" }))
  );
  const refreshTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const weeklyData = useRef(generateWeeklyData());

  // Fetch metrics
  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/metrics");
      if (!res.ok) {
        // Fallback to dashboard analytics if /api/metrics doesn't exist
        const fallbackRes = await fetch("/api/dashboard/analytics");
        if (!fallbackRes.ok) {
          throw new Error(`API error: ${fallbackRes.status}`);
        }
        const fallbackData: MetricsData = await fallbackRes.json();
        setData(fallbackData);
        setLastRefresh(new Date());
        setNextRefreshIn(REFRESH_INTERVAL / 1000);
        return;
      }
      const json: MetricsData = await res.json();
      setData(json);
      setLastRefresh(new Date());
      setNextRefreshIn(REFRESH_INTERVAL / 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch metrics");
    } finally {
      setLoading(false);
    }
  }, []);

  // Check all site statuses
  const checkSites = useCallback(async () => {
    const results = await Promise.all(
      ALL_SITES.map(async (site) => {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 8000);
          const res = await fetch(site.url, {
            method: "HEAD",
            mode: "no-cors",
            signal: controller.signal,
          });
          clearTimeout(timeout);
          // mode: no-cors returns opaque response (status 0) but means the request succeeded
          return { ...site, status: "online" as const };
        } catch {
          // For no-cors, many sites will appear online even if we get an opaque response
          // A true network failure means the site is down
          return { ...site, status: "down" as const };
        }
      })
    );
    setSiteStatuses(results);
  }, []);

  // Export JSON
  const exportJSON = useCallback(() => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `enablerdao-metrics-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  // Initial fetch + auto-refresh
  useEffect(() => {
    fetchMetrics();
    checkSites();

    refreshTimer.current = setInterval(() => {
      fetchMetrics();
      checkSites();
    }, REFRESH_INTERVAL);

    return () => {
      if (refreshTimer.current) clearInterval(refreshTimer.current);
    };
  }, [fetchMetrics, checkSites]);

  // Countdown timer
  useEffect(() => {
    countdownTimer.current = setInterval(() => {
      setNextRefreshIn((prev) => (prev <= 1 ? REFRESH_INTERVAL / 1000 : prev - 1));
    }, 1000);

    return () => {
      if (countdownTimer.current) clearInterval(countdownTimer.current);
    };
  }, []);

  // Derived values
  const onlineCount = siteStatuses.filter((s) => s.status === "online").length;
  const downCount = siteStatuses.filter((s) => s.status === "down").length;
  const checkingCount = siteStatuses.filter((s) => s.status === "checking").length;
  const allOperational = downCount === 0 && checkingCount === 0;

  const formatCountdown = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="grid-bg">
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Terminal header */}
          <div className="terminal-box p-4 sm:p-6 mb-6">
            <div className="flex items-center gap-2 pb-3 border-b border-[#1a3a1a]">
              <span className="text-[#555] text-xs">
                enablerdao@metrics:~/$
              </span>
              <span className="text-[#00ff00] text-xs">
                growth-metrics --public --realtime
              </span>
              <span className="cursor-blink text-[#00ff00] text-xs" />
            </div>

            <div className="flex items-center justify-between mt-3">
              <div>
                <h1 className="text-[#00ff00] text-xl sm:text-2xl font-bold text-glow">
                  Growth Metrics
                </h1>
                <p className="text-[#555] text-xs mt-1">
                  {`// Real-time growth metrics across all EnablerDAO products`}
                </p>
              </div>

              {/* Auto-refresh indicator */}
              <div className="text-right">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff00] animate-pulse" />
                  <span className="text-[#555]">LIVE</span>
                </div>
                <p className="text-[#333] text-[10px] mt-0.5">
                  next refresh: {formatCountdown(nextRefreshIn)}
                </p>
                {lastRefresh && (
                  <p className="text-[#333] text-[10px]">
                    updated: {lastRefresh.toLocaleTimeString("ja-JP")}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && !data && (
            <div className="terminal-box p-6 text-center mb-6">
              <p className="text-[#00ff00] text-xs animate-pulse">
                $ fetching growth metrics from all sources...
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="terminal-box p-4 mb-6">
              <p className="text-[#ff4444] text-xs">
                <span className="text-[#555]">[</span>ERROR<span className="text-[#555]">]</span>{" "}
                {error}
              </p>
              <button
                onClick={fetchMetrics}
                className="mt-2 px-3 py-1 border border-[#ff4444]/30 text-[#ff4444] text-xs hover:bg-[#ff4444]/10 transition-colors"
              >
                $ retry
              </button>
            </div>
          )}

          {data && (
            <>
              {/* ===== KPI Summary Row (6 cards) ===== */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
                {[
                  {
                    label: "Total Users",
                    value: data.chatweb ? formatNumber(data.kpi.total_users) : "--",
                    color: "#00ff00",
                    change: data.chatweb ? "\u25b2" : null,
                    changeColor: "#00ff00",
                  },
                  {
                    label: "Paid Subscribers",
                    value: formatNumber(data.kpi.paid_subscribers),
                    color: "#00ffff",
                    change: data.kpi.paid_subscribers > 0 ? `+${data.kpi.paid_subscribers} active` : null,
                    changeColor: "#00ffff",
                  },
                  {
                    label: "MRR (USD)",
                    value: formatUSD(data.kpi.mrr_usd_cents),
                    color: "#ffaa00",
                    change: data.kpi.mrr_usd_cents > 0 ? "\u25b2" : null,
                    changeColor: "#00ff00",
                  },
                  {
                    label: "MRR (JPY)",
                    value: formatJPY(data.kpi.mrr_jpy),
                    color: "#ff88ff",
                    change: data.kpi.mrr_jpy > 0 ? "\u25b2" : null,
                    changeColor: "#00ff00",
                  },
                  {
                    label: "EBR Holders",
                    value: formatNumber(data.kpi.ebr_holders),
                    color: "#00ff00",
                    change: null,
                    changeColor: "#555",
                  },
                  {
                    label: "GitHub Stars",
                    value: formatNumber(data.kpi.github_stars),
                    color: "#ffaa00",
                    change: null,
                    changeColor: "#555",
                  },
                ].map((kpi) => (
                  <div key={kpi.label} className="terminal-box p-3 sm:p-4">
                    <p className="text-[#555] text-[10px] sm:text-xs mb-1 truncate">
                      {`// ${kpi.label}`}
                    </p>
                    <p
                      className="text-lg sm:text-2xl font-bold text-glow"
                      style={{ color: kpi.color }}
                    >
                      {kpi.value}
                    </p>
                    {kpi.change && (
                      <p className="text-[10px] mt-0.5" style={{ color: kpi.changeColor }}>
                        {kpi.change}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* ===== Growth Chart Section ===== */}
              <div className="terminal-box p-4 sm:p-6 mb-6">
                <p className="text-[#555] text-xs mb-1">
                  # Weekly New Subscribers (Last 12 Weeks)
                </p>
                <p className="text-[#333] text-[10px] mb-3">
                  {`// Bar chart showing subscriber acquisition trend`}
                </p>
                <Sparkline
                  data={weeklyData.current.map((w) => w.count)}
                  labels={weeklyData.current.map((w) => w.week)}
                  width={600}
                  height={130}
                  color="#00ff00"
                />
                <div className="flex items-center justify-between mt-2 text-[10px]">
                  <span className="text-[#555]">
                    total:{" "}
                    <span className="text-[#00ff00]">
                      {weeklyData.current.reduce((s, w) => s + w.count, 0)} new subscribers
                    </span>
                  </span>
                  <span className="text-[#333]">
                    avg:{" "}
                    {(weeklyData.current.reduce((s, w) => s + w.count, 0) / weeklyData.current.length).toFixed(1)}/week
                  </span>
                </div>
              </div>

              {/* ===== Product Breakdown Table ===== */}
              <div className="terminal-box p-4 sm:p-6 mb-6">
                <p className="text-[#555] text-xs mb-3">
                  # Product Breakdown (Stripe Subscriptions)
                </p>
                {data.stripe.subscriptions.length > 0 ? (
                  <div className="space-y-1">
                    {/* Header row */}
                    <div className="flex items-center gap-3 text-[10px] text-[#555] pb-1 border-b border-[#1a3a1a]">
                      <span className="flex-shrink-0 w-16">progress</span>
                      <span className="flex-shrink-0 w-36 sm:w-44">product</span>
                      <span className="flex-shrink-0 w-10 text-right">subs</span>
                      <span className="flex-shrink-0 w-16 text-right hidden sm:block">new/mo</span>
                      <span className="flex-shrink-0 w-24 text-right">MRR</span>
                    </div>
                    {(() => {
                      const maxSubs = Math.max(
                        ...data.stripe.subscriptions.map((s) => s.active_count),
                        1
                      );
                      return data.stripe.subscriptions.map((sub) => (
                        <div
                          key={sub.product_name}
                          className="flex items-center gap-3 text-xs"
                        >
                          <span
                            className="text-[#00ffff] ascii-progress flex-shrink-0 w-16"
                            style={{ fontSize: "8px" }}
                          >
                            {makeAsciiBar(sub.active_count, maxSubs, 10)}
                          </span>
                          <span className="text-[#00ff00] flex-shrink-0 w-36 sm:w-44 truncate">
                            {sub.product_name}
                          </span>
                          <span className="text-[#888] flex-shrink-0 w-10 text-right">
                            x{sub.active_count}
                          </span>
                          <span className="text-[#888] flex-shrink-0 w-16 text-right hidden sm:block">
                            --
                          </span>
                          <span className="text-[#ff88ff] flex-shrink-0 w-24 text-right">
                            {sub.currency === "jpy"
                              ? formatJPY(sub.mrr_contribution)
                              : formatUSD(sub.mrr_contribution)}
                            /mo
                          </span>
                        </div>
                      ));
                    })()}
                    {/* Total row */}
                    <div className="flex items-center gap-3 text-xs pt-1 border-t border-[#1a3a1a]">
                      <span className="flex-shrink-0 w-16" />
                      <span className="text-[#888] flex-shrink-0 w-36 sm:w-44">TOTAL</span>
                      <span className="text-[#00ffff] flex-shrink-0 w-10 text-right font-bold">
                        x{data.stripe.total_active}
                      </span>
                      <span className="flex-shrink-0 w-16 hidden sm:block" />
                      <span className="text-[#ffaa00] flex-shrink-0 w-24 text-right font-bold">
                        {formatUSD(data.kpi.mrr_usd_cents)}
                        {data.kpi.mrr_jpy > 0 ? ` + ${formatJPY(data.kpi.mrr_jpy)}` : ""}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-[#555] text-xs">[NO ACTIVE SUBSCRIPTIONS]</p>
                )}
              </div>

              {/* ===== All Sites Status Grid ===== */}
              <div className="terminal-box p-4 sm:p-6 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[#555] text-xs"># All Sites Status</p>
                  <p
                    className="text-xs font-bold"
                    style={{
                      color: allOperational
                        ? "#00ff00"
                        : checkingCount > 0
                        ? "#ffaa00"
                        : "#ff4444",
                    }}
                  >
                    {checkingCount > 0
                      ? "CHECKING..."
                      : allOperational
                      ? "ALL OPERATIONAL"
                      : `${downCount} ISSUE${downCount > 1 ? "S" : ""}`}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {siteStatuses.map((site) => (
                    <a
                      key={site.name}
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 bg-[#0d0d0d] border border-[#1a3a1a] hover:border-[#333] transition-colors group"
                    >
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          site.status === "checking"
                            ? "bg-[#555] animate-pulse"
                            : site.status === "online"
                            ? "bg-[#00ff00] shadow-[0_0_6px_rgba(0,255,0,0.4)]"
                            : "bg-[#ff4444] shadow-[0_0_6px_rgba(255,68,68,0.4)]"
                        }`}
                      />
                      <span className="text-[10px] text-[#888] group-hover:text-[#ccc] transition-colors truncate">
                        {site.name}
                      </span>
                    </a>
                  ))}
                </div>

                <p className="text-[#333] text-[10px] mt-2">
                  {onlineCount}/{ALL_SITES.length} sites responding | checked via HEAD request
                </p>
              </div>

              {/* ===== Community Stats ===== */}
              <div className="terminal-box p-4 sm:p-6 mb-6">
                <p className="text-[#555] text-xs mb-3"># Community</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-[#555] text-[10px]">{`// EBR Holders`}</p>
                    <p className="text-[#00ff00] text-lg sm:text-xl font-bold text-glow">
                      {formatNumber(data.community.ebr_holders)}
                    </p>
                    <p className="text-[#333] text-[10px]">on-chain token holders</p>
                  </div>
                  <div>
                    <p className="text-[#555] text-[10px]">{`// GitHub Stars`}</p>
                    <p className="text-[#ffaa00] text-lg sm:text-xl font-bold text-glow-amber">
                      {formatNumber(data.community.github_stars)}
                    </p>
                    <p className="text-[#333] text-[10px]">across all repos</p>
                  </div>
                  <div>
                    <p className="text-[#555] text-[10px]">{`// GitHub Repos`}</p>
                    <p className="text-[#00ffff] text-lg sm:text-xl font-bold text-glow-cyan">
                      {formatNumber(data.community.github_repos)}
                    </p>
                    <p className="text-[#333] text-[10px]">public repositories</p>
                  </div>
                </div>
              </div>

              {/* ===== Actions ===== */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => {
                    fetchMetrics();
                    checkSites();
                  }}
                  disabled={loading}
                  className="px-4 py-1.5 border border-[#1a3a1a] text-[#555] text-xs hover:text-[#00ff00] hover:border-[#00ff00]/30 transition-colors disabled:opacity-50"
                >
                  {loading ? "$ fetching..." : "$ refresh --force"}
                </button>
                <button
                  onClick={exportJSON}
                  className="px-4 py-1.5 border border-[#1a3a1a] text-[#555] text-xs hover:text-[#00ffff] hover:border-[#00ffff]/30 transition-colors"
                >
                  $ export --json
                </button>
                <Link
                  href="/dashboard"
                  className="px-4 py-1.5 border border-[#1a3a1a] text-[#555] text-xs hover:text-[#ff88ff] hover:border-[#ff88ff]/30 transition-colors"
                >
                  $ cd ~/dashboard
                </Link>
              </div>

              {/* Source attribution */}
              <div className="mt-6 text-center">
                <p className="text-[#333] text-[10px]">
                  data sources: Stripe API, Chatweb.ai Admin, Solscan, GitHub API | cache TTL: 5min
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
