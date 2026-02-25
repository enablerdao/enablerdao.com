"use client";

import Link from "next/link";
import { useEffect, useState, useCallback, useRef } from "react";

// --- Types ---

interface SiteCheck {
  name: string;
  url: string;
  description: string;
  status: "checking" | "online" | "slow" | "down";
  latency: number | null;
  lastChecked: number | null;
}

interface HistoryEntry {
  timestamp: number;
  results: { name: string; status: "online" | "slow" | "down"; latency: number | null }[];
}

interface UptimeRecord {
  total: number;
  online: number;
  slow: number;
  down: number;
}

// --- Constants ---

const REFRESH_INTERVAL = 60_000; // 60 seconds
const HISTORY_KEY = "enablerdao-status-history";
const HISTORY_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours
const HISTORY_MAX_ENTRIES = 1440; // 24h at 1-min intervals

const ALL_SITES: { name: string; url: string; description: string }[] = [
  { name: "enablerdao.com", url: "https://enablerdao.com", description: "DAO Portal" },
  { name: "chatweb.ai", url: "https://chatweb.ai", description: "AI Chat Platform" },
  { name: "teai.io", url: "https://teai.io", description: "AI Assistant" },
  { name: "stayflowapp.com", url: "https://stayflowapp.com", description: "Property Management" },
  { name: "jiuflow.art", url: "https://jiuflow.art", description: "BJJ Training App" },
  { name: "misebanai.com", url: "https://misebanai.com", description: "Store AI Assistant" },
  { name: "banto.work", url: "https://banto.work", description: "Business Management" },
  { name: "enabler.fun", url: "https://enabler.fun", description: "Lifestyle Services" },
  { name: "elio.love", url: "https://elio.love", description: "AI Companion" },
  { name: "solun.art", url: "https://solun.art", description: "Event Platform" },
  { name: "enabler.cc", url: "https://enabler.cc", description: "Security Scanner" },
];

// --- localStorage helpers ---

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const entries: HistoryEntry[] = JSON.parse(raw);
    const cutoff = Date.now() - HISTORY_MAX_AGE;
    return entries.filter((e) => e.timestamp > cutoff);
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]): void {
  try {
    // Keep only recent entries within max age and count
    const cutoff = Date.now() - HISTORY_MAX_AGE;
    const trimmed = entries.filter((e) => e.timestamp > cutoff).slice(-HISTORY_MAX_ENTRIES);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage full or unavailable - silently fail
  }
}

function computeUptime(history: HistoryEntry[], siteName: string): UptimeRecord {
  let total = 0;
  let online = 0;
  let slow = 0;
  let down = 0;

  for (const entry of history) {
    const site = entry.results.find((r) => r.name === siteName);
    if (site) {
      total++;
      if (site.status === "online") online++;
      else if (site.status === "slow") slow++;
      else down++;
    }
  }

  return { total, online, slow, down };
}

function uptimePercent(record: UptimeRecord): number {
  if (record.total === 0) return 100;
  return Math.round(((record.online + record.slow) / record.total) * 1000) / 10;
}

// --- ASCII bar for latency ---

function latencyBar(latency: number | null, maxMs: number = 2000): string {
  if (latency === null) return "\u2591".repeat(12);
  const clamped = Math.min(latency, maxMs);
  const filled = Math.round((clamped / maxMs) * 12);
  return "\u2588".repeat(filled) + "\u2591".repeat(12 - filled);
}

// --- Format countdown ---

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// --- Sparkline for uptime history (last 60 checks) ---

function UptimeSpark({ history, siteName }: { history: HistoryEntry[]; siteName: string }) {
  // Take last 60 entries
  const recent = history.slice(-60);
  if (recent.length === 0) {
    return <span className="text-[#333] text-[10px]">No history yet</span>;
  }

  return (
    <div className="flex items-end gap-px h-3">
      {recent.map((entry, i) => {
        const site = entry.results.find((r) => r.name === siteName);
        const color =
          !site || site.status === "down"
            ? "#ff4444"
            : site.status === "slow"
            ? "#ffaa00"
            : "#00ff00";
        return (
          <div
            key={i}
            className="flex-shrink-0"
            style={{
              width: "2px",
              height: "100%",
              backgroundColor: color,
              opacity: 0.7,
            }}
            title={`${new Date(entry.timestamp).toLocaleTimeString("ja-JP")} - ${
              site ? `${site.status}${site.latency ? ` (${site.latency}ms)` : ""}` : "no data"
            }`}
          />
        );
      })}
    </div>
  );
}

// --- Main Component ---

export default function StatusPage() {
  const [sites, setSites] = useState<SiteCheck[]>(
    ALL_SITES.map((s) => ({ ...s, status: "checking", latency: null, lastChecked: null }))
  );
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [nextRefreshIn, setNextRefreshIn] = useState(REFRESH_INTERVAL / 1000);
  const [isChecking, setIsChecking] = useState(false);
  const refreshTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  // Check all sites
  const checkAllSites = useCallback(async () => {
    setIsChecking(true);

    const results = await Promise.all(
      ALL_SITES.map(async (site) => {
        const startTime = performance.now();
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 10000);

          // Use no-cors HEAD request - opaque response means site is reachable
          // We measure time from request start to response for approximate latency
          await fetch(site.url, {
            method: "HEAD",
            mode: "no-cors",
            cache: "no-cache",
            signal: controller.signal,
          });
          clearTimeout(timeout);

          const elapsed = Math.round(performance.now() - startTime);
          const resolvedStatus: SiteCheck["status"] =
            elapsed > 2000 ? "slow" : elapsed > 500 ? "slow" : "online";

          return {
            ...site,
            status: resolvedStatus,
            latency: elapsed,
            lastChecked: Date.now(),
          } satisfies SiteCheck;
        } catch {
          const elapsed = Math.round(performance.now() - startTime);
          return {
            ...site,
            status: "down" as const,
            latency: elapsed > 9500 ? null : elapsed, // timeout = no latency
            lastChecked: Date.now(),
          } satisfies SiteCheck;
        }
      })
    );

    setSites(results);
    setLastRefresh(new Date());
    setNextRefreshIn(REFRESH_INTERVAL / 1000);
    setIsChecking(false);

    // Save to history
    const entry: HistoryEntry = {
      timestamp: Date.now(),
      results: results.map((r) => ({
        name: r.name,
        status: r.status as "online" | "slow" | "down",
        latency: r.latency,
      })),
    };

    setHistory((prev) => {
      const updated = [...prev, entry];
      saveHistory(updated);
      return updated;
    });
  }, []);

  // Initial check + auto-refresh
  useEffect(() => {
    checkAllSites();

    refreshTimer.current = setInterval(() => {
      checkAllSites();
    }, REFRESH_INTERVAL);

    return () => {
      if (refreshTimer.current) clearInterval(refreshTimer.current);
    };
  }, [checkAllSites]);

  // Countdown timer
  useEffect(() => {
    countdownTimer.current = setInterval(() => {
      setNextRefreshIn((prev) => (prev <= 1 ? REFRESH_INTERVAL / 1000 : prev - 1));
    }, 1000);

    return () => {
      if (countdownTimer.current) clearInterval(countdownTimer.current);
    };
  }, []);

  // Derived stats
  const onlineCount = sites.filter((s) => s.status === "online").length;
  const slowCount = sites.filter((s) => s.status === "slow").length;
  const downCount = sites.filter((s) => s.status === "down").length;
  const checkingCount = sites.filter((s) => s.status === "checking").length;
  const allOperational = downCount === 0 && checkingCount === 0 && slowCount === 0;
  const hasIssues = downCount > 0;
  const avgLatency =
    sites.filter((s) => s.latency !== null).length > 0
      ? Math.round(
          sites.filter((s) => s.latency !== null).reduce((sum, s) => sum + (s.latency || 0), 0) /
            sites.filter((s) => s.latency !== null).length
        )
      : null;

  // Overall uptime from history
  const overallUptime = (() => {
    if (history.length === 0) return 100;
    let totalChecks = 0;
    let upChecks = 0;
    for (const entry of history) {
      for (const r of entry.results) {
        totalChecks++;
        if (r.status === "online" || r.status === "slow") upChecks++;
      }
    }
    return totalChecks > 0 ? Math.round((upChecks / totalChecks) * 1000) / 10 : 100;
  })();

  // Status color helper
  const statusColor = (status: SiteCheck["status"]) => {
    switch (status) {
      case "checking":
        return "#555";
      case "online":
        return "#00ff00";
      case "slow":
        return "#ffaa00";
      case "down":
        return "#ff4444";
    }
  };

  const statusLabel = (status: SiteCheck["status"]) => {
    switch (status) {
      case "checking":
        return "CHECKING";
      case "online":
        return "OPERATIONAL";
      case "slow":
        return "DEGRADED";
      case "down":
        return "DOWN";
    }
  };

  // Overall status text
  const overallStatus = checkingCount > 0
    ? { text: "CHECKING SYSTEMS...", color: "#ffaa00" }
    : allOperational
    ? { text: "ALL SYSTEMS OPERATIONAL", color: "#00ff00" }
    : hasIssues
    ? { text: `${downCount} SYSTEM${downCount > 1 ? "S" : ""} DOWN`, color: "#ff4444" }
    : { text: `${slowCount} SYSTEM${slowCount > 1 ? "S" : ""} DEGRADED`, color: "#ffaa00" };

  return (
    <div className="grid-bg min-h-screen">
      {/* Header */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="terminal-box p-6">
            <div className="flex items-center gap-2 pb-3 border-b border-[#1a3a1a]">
              <span className="text-[#555] text-xs">enablerdao@status:~$</span>
              <span className="text-[#00ff00] text-xs">./monitor --all --live</span>
              <span className="cursor-blink text-[#00ff00] text-xs" />
            </div>

            <div className="flex items-center justify-between mt-3">
              <div>
                <h1 className="text-[#00ff00] text-2xl font-bold text-glow">
                  System Status
                </h1>
                <p className="text-[#555] text-xs mt-1">
                  {`// Live health monitoring for all EnablerDAO services`}
                </p>
              </div>

              {/* Live indicator + countdown */}
              <div className="text-right">
                <div className="flex items-center gap-2 text-xs justify-end">
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ backgroundColor: overallStatus.color }}
                  />
                  <span className="text-[#555]">LIVE</span>
                </div>
                <p className="text-[#333] text-[10px] mt-0.5">
                  next check: {formatCountdown(nextRefreshIn)}
                </p>
                {lastRefresh && (
                  <p className="text-[#333] text-[10px]">
                    updated: {lastRefresh.toLocaleTimeString("ja-JP")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overall Status Banner */}
      <section className="pb-6">
        <div className="max-w-6xl mx-auto px-4">
          <div
            className="terminal-box p-4 border-l-2"
            style={{ borderLeftColor: overallStatus.color }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: overallStatus.color,
                    boxShadow: `0 0 12px ${overallStatus.color}60`,
                  }}
                />
                <span
                  className="text-sm font-bold text-glow"
                  style={{ color: overallStatus.color }}
                >
                  {overallStatus.text}
                </span>
              </div>
              <span className="text-[#555] text-xs">
                {new Date().toLocaleDateString("ja-JP")} {new Date().toLocaleTimeString("ja-JP")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Summary Stats */}
      <section className="pb-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="terminal-box p-4">
              <p className="text-[#555] text-[10px] mb-1">{`// Online`}</p>
              <p className="text-[#00ff00] text-2xl font-bold text-glow">
                {onlineCount}
                <span className="text-[#555] text-sm">/{ALL_SITES.length}</span>
              </p>
            </div>
            <div className="terminal-box p-4">
              <p className="text-[#555] text-[10px] mb-1">{`// Avg Response`}</p>
              <p className="text-[#00ffff] text-2xl font-bold text-glow-cyan">
                {avgLatency !== null ? `${avgLatency}ms` : "--"}
              </p>
            </div>
            <div className="terminal-box p-4">
              <p className="text-[#555] text-[10px] mb-1">{`// 24h Uptime`}</p>
              <p
                className="text-2xl font-bold text-glow"
                style={{ color: overallUptime >= 99 ? "#00ff00" : overallUptime >= 95 ? "#ffaa00" : "#ff4444" }}
              >
                {overallUptime}%
              </p>
            </div>
            <div className="terminal-box p-4">
              <p className="text-[#555] text-[10px] mb-1">{`// Incidents`}</p>
              <p
                className="text-2xl font-bold text-glow"
                style={{ color: downCount > 0 ? "#ff4444" : "#00ff00" }}
              >
                {downCount}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Site Status Grid */}
      <section className="pb-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="terminal-box p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[#555] text-xs"># Service Health</p>
              <button
                onClick={checkAllSites}
                disabled={isChecking}
                className="px-3 py-1 border border-[#1a3a1a] text-[#555] text-[10px] hover:text-[#00ff00] hover:border-[#00ff00]/30 transition-colors disabled:opacity-50"
              >
                {isChecking ? "$ checking..." : "$ check --now"}
              </button>
            </div>

            {/* Table header */}
            <div className="hidden sm:flex items-center gap-3 text-[10px] text-[#555] pb-2 border-b border-[#1a3a1a] mb-1">
              <span className="w-5 flex-shrink-0">st</span>
              <span className="w-40 flex-shrink-0">service</span>
              <span className="w-24 flex-shrink-0">status</span>
              <span className="w-16 flex-shrink-0 text-right">latency</span>
              <span className="w-[100px] flex-shrink-0 text-center">response bar</span>
              <span className="w-16 flex-shrink-0 text-right">uptime</span>
              <span className="flex-1 text-center">24h history</span>
            </div>

            <div className="space-y-0.5">
              {sites.map((site) => {
                const upRecord = computeUptime(history, site.name);
                const pct = uptimePercent(upRecord);

                return (
                  <div
                    key={site.name}
                    className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 p-2 bg-[#0d0d0d] border border-[#1a3a1a] hover:border-[#333] transition-colors group"
                  >
                    {/* Status dot */}
                    <div className="flex items-center gap-3 sm:contents">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0 sm:w-5"
                        style={{
                          width: "8px",
                          height: "8px",
                          backgroundColor: statusColor(site.status),
                          boxShadow:
                            site.status !== "checking"
                              ? `0 0 8px ${statusColor(site.status)}50`
                              : undefined,
                          animation: site.status === "checking" ? "pulse 1.5s infinite" : undefined,
                        }}
                      />

                      {/* Name + description */}
                      <div className="w-40 flex-shrink-0">
                        <a
                          href={site.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#00ff00] text-xs hover:text-[#33ff33] transition-colors"
                        >
                          {site.name}
                        </a>
                        <p className="text-[#333] text-[10px]">{site.description}</p>
                      </div>

                      {/* Status label (always visible on mobile) */}
                      <span
                        className="w-24 flex-shrink-0 text-[10px] font-bold sm:block"
                        style={{ color: statusColor(site.status) }}
                      >
                        {statusLabel(site.status)}
                      </span>
                    </div>

                    {/* Desktop-only columns */}
                    <div className="hidden sm:flex items-center gap-3 flex-1">
                      {/* Latency */}
                      <span
                        className="w-16 flex-shrink-0 text-right text-xs"
                        style={{ color: statusColor(site.status) }}
                      >
                        {site.latency !== null ? `${site.latency}ms` : "--"}
                      </span>

                      {/* ASCII bar */}
                      <span
                        className="w-[100px] flex-shrink-0 text-center ascii-progress text-[10px]"
                        style={{ color: statusColor(site.status) }}
                      >
                        {latencyBar(site.latency)}
                      </span>

                      {/* Uptime % */}
                      <span
                        className="w-16 flex-shrink-0 text-right text-xs"
                        style={{
                          color:
                            upRecord.total === 0
                              ? "#555"
                              : pct >= 99
                              ? "#00ff00"
                              : pct >= 95
                              ? "#ffaa00"
                              : "#ff4444",
                        }}
                      >
                        {upRecord.total > 0 ? `${pct}%` : "--"}
                      </span>

                      {/* Sparkline */}
                      <div className="flex-1">
                        <UptimeSpark history={history} siteName={site.name} />
                      </div>
                    </div>

                    {/* Mobile-only extra info */}
                    <div className="flex items-center justify-between sm:hidden text-[10px] pl-5">
                      <span style={{ color: statusColor(site.status) }}>
                        {site.latency !== null ? `${site.latency}ms` : "--"}
                      </span>
                      <span
                        className="ascii-progress"
                        style={{ color: statusColor(site.status), fontSize: "8px" }}
                      >
                        {latencyBar(site.latency)}
                      </span>
                      <span
                        style={{
                          color:
                            upRecord.total === 0
                              ? "#555"
                              : pct >= 99
                              ? "#00ff00"
                              : pct >= 95
                              ? "#ffaa00"
                              : "#ff4444",
                        }}
                      >
                        {upRecord.total > 0 ? `${pct}% uptime` : "no data"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-[#1a3a1a]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00ff00]" />
                <span className="text-[#555] text-[10px]">Online (&lt;500ms)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ffaa00]" />
                <span className="text-[#555] text-[10px]">Degraded (500-2000ms)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ff4444]" />
                <span className="text-[#555] text-[10px]">Down / Unreachable</span>
              </div>
              <span className="text-[#333] text-[10px] ml-auto">
                Checked via no-cors HEAD | Auto-refresh: 60s
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Response Time Chart */}
      <section className="pb-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="terminal-box p-4 sm:p-6">
            <p className="text-[#555] text-xs mb-3"># Response Time Overview</p>
            <div className="space-y-1.5">
              {sites
                .filter((s) => s.status !== "checking")
                .sort((a, b) => (a.latency || 99999) - (b.latency || 99999))
                .map((site) => {
                  const maxBar = 2000;
                  const barWidth =
                    site.latency !== null
                      ? Math.max(2, Math.min(100, (site.latency / maxBar) * 100))
                      : 0;

                  return (
                    <div key={site.name} className="flex items-center gap-3">
                      <span className="text-[#888] text-[10px] w-28 flex-shrink-0 text-right truncate">
                        {site.name}
                      </span>
                      <div className="flex-1 h-3 bg-[#111] border border-[#1a3a1a] relative overflow-hidden">
                        {site.latency !== null && (
                          <div
                            className="h-full transition-all duration-500"
                            style={{
                              width: `${barWidth}%`,
                              backgroundColor: statusColor(site.status),
                              boxShadow: `0 0 4px ${statusColor(site.status)}40`,
                            }}
                          />
                        )}
                        {site.status === "down" && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[#ff4444] text-[8px]">TIMEOUT</span>
                          </div>
                        )}
                      </div>
                      <span
                        className="text-[10px] w-14 text-right flex-shrink-0"
                        style={{ color: statusColor(site.status) }}
                      >
                        {site.latency !== null ? `${site.latency}ms` : "DOWN"}
                      </span>
                    </div>
                  );
                })}
            </div>
            <div className="flex items-center justify-between mt-2 text-[10px] text-[#333]">
              <span>0ms</span>
              <span>500ms</span>
              <span>1000ms</span>
              <span>2000ms+</span>
            </div>
          </div>
        </div>
      </section>

      {/* Uptime History Summary */}
      <section className="pb-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="terminal-box p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[#555] text-xs"># 24-Hour Uptime History</p>
              <p className="text-[#333] text-[10px]">
                {history.length} check{history.length !== 1 ? "s" : ""} recorded
              </p>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-[#555] text-xs">
                  No history data yet. Checks are recorded every 60 seconds.
                </p>
                <p className="text-[#333] text-[10px] mt-1">
                  Keep this page open to build up a history of uptime data.
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {ALL_SITES.map((site) => {
                  const record = computeUptime(history, site.name);
                  const pct = uptimePercent(record);

                  return (
                    <div key={site.name} className="flex items-center gap-3">
                      <span className="text-[#888] text-[10px] w-28 flex-shrink-0 text-right truncate">
                        {site.name}
                      </span>
                      <div className="flex-1">
                        <UptimeSpark history={history} siteName={site.name} />
                      </div>
                      <span
                        className="text-[10px] w-14 text-right flex-shrink-0 font-bold"
                        style={{
                          color:
                            record.total === 0
                              ? "#555"
                              : pct >= 99
                              ? "#00ff00"
                              : pct >= 95
                              ? "#ffaa00"
                              : "#ff4444",
                        }}
                      >
                        {record.total > 0 ? `${pct}%` : "--"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-[#1a3a1a] text-[10px] text-[#333]">
              <p>
                History is stored locally in your browser (localStorage). Each colored bar
                represents one check: <span className="text-[#00ff00]">green</span> = OK,{" "}
                <span className="text-[#ffaa00]">amber</span> = slow,{" "}
                <span className="text-[#ff4444]">red</span> = down.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure Info */}
      <section className="pb-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="terminal-box p-4 sm:p-6">
            <p className="text-[#555] text-xs mb-3"># Infrastructure</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-[#0d0d0d] border border-[#1a3a1a]">
                <p className="text-[#00ffff] text-xs font-bold mb-1">AWS Lambda</p>
                <p className="text-[#555] text-[10px]">chatweb.ai, teai.io</p>
                <p className="text-[#333] text-[10px]">ARM64, ap-northeast-1</p>
              </div>
              <div className="p-3 bg-[#0d0d0d] border border-[#1a3a1a]">
                <p className="text-[#00ffff] text-xs font-bold mb-1">Fly.io</p>
                <p className="text-[#555] text-[10px]">enablerdao.com, misebanai.com, banto.work, jiuflow.art</p>
                <p className="text-[#333] text-[10px]">Tokyo (nrt) region</p>
              </div>
              <div className="p-3 bg-[#0d0d0d] border border-[#1a3a1a]">
                <p className="text-[#00ffff] text-xs font-bold mb-1">Cloudflare / Lovable</p>
                <p className="text-[#555] text-[10px]">stayflowapp.com, enabler.fun, solun.art</p>
                <p className="text-[#333] text-[10px]">Global CDN</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="terminal-box p-6">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/metrics"
                className="px-4 py-1.5 border border-[#1a3a1a] text-[#555] text-xs hover:text-[#00ffff] hover:border-[#00ffff]/30 transition-colors"
              >
                $ cd ~/metrics
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-1.5 border border-[#1a3a1a] text-[#555] text-xs hover:text-[#ff88ff] hover:border-[#ff88ff]/30 transition-colors"
              >
                $ cd ~/dashboard
              </Link>
              <Link
                href="/"
                className="px-4 py-1.5 border border-[#1a3a1a] text-[#555] text-xs hover:text-[#00ff00] hover:border-[#00ff00]/30 transition-colors"
              >
                $ cd ~/
              </Link>
            </div>
            <p className="text-[#333] text-[10px] mt-4">
              Monitoring interval: 60s | Data retention: 24h (localStorage) | All checks run
              client-side
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
