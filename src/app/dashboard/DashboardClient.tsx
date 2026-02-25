"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const EBR_MINT = "E1JxwaWRd8nw8vDdWMdqwdbXGBshqDcnTcinHzNMqg2Y";
const SOLANA_RPC = "https://api.mainnet-beta.solana.com";

// --- Types ---

interface StripeSubscription {
  product_name: string;
  currency: string;
  unit_amount: number;
  active_count: number;
  mrr_contribution: number;
}

interface DashboardData {
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

type AuthState = "disconnected" | "connecting" | "no_token" | "authenticated";

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

// --- Component ---

export default function DashboardClient() {
  const [authState, setAuthState] = useState<AuthState>("disconnected");
  const [walletAddress, setWalletAddress] = useState("");
  const [ebrBalance, setEbrBalance] = useState(0);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check EBR token balance via Solana JSON RPC (no npm deps)
  const checkEBRBalance = useCallback(
    async (address: string): Promise<number> => {
      const res = await fetch(SOLANA_RPC, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getTokenAccountsByOwner",
          params: [
            address,
            { mint: EBR_MINT },
            { encoding: "jsonParsed" },
          ],
        }),
      });
      const data = await res.json();
      if (data.result?.value?.length > 0) {
        const info =
          data.result.value[0].account.data.parsed.info.tokenAmount;
        return parseFloat(info.uiAmountString || "0");
      }
      return 0;
    },
    []
  );

  // Connect Phantom wallet
  const connectWallet = useCallback(async () => {
    try {
      setError("");
      setAuthState("connecting");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const solana = (window as any).solana;
      if (!solana?.isPhantom) {
        setError("Phantom Walletが見つかりません。インストールしてください。");
        setAuthState("disconnected");
        return;
      }

      const resp = await solana.connect();
      const address: string = resp.publicKey.toString();
      setWalletAddress(address);

      const balance = await checkEBRBalance(address);
      setEbrBalance(balance);

      if (balance > 0) {
        setAuthState("authenticated");
      } else {
        setAuthState("no_token");
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "ウォレット接続に失敗しました";
      setError(msg);
      setAuthState("disconnected");
    }
  }, [checkEBRBalance]);

  // Fetch dashboard data from API
  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/dashboard/analytics");
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `API error: ${res.status}`);
      }
      const data: DashboardData = await res.json();
      setDashboard(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "データの取得に失敗しました"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Export JSON
  const exportJSON = useCallback(() => {
    if (!dashboard) return;
    const blob = new Blob([JSON.stringify(dashboard, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dashboard-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [dashboard]);

  // Auto-fetch when authenticated
  useEffect(() => {
    if (authState === "authenticated") {
      fetchDashboard();
    }
  }, [authState, fetchDashboard]);

  return (
    <div className="grid-bg">
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Terminal header box */}
          <div className="terminal-box p-4 sm:p-6 mb-6">
            <div className="flex items-center gap-2 pb-3 border-b border-[#1a3a1a]">
              <span className="text-[#555] text-xs">
                enablerdao@web3:~/dashboard$
              </span>
              <span className="text-[#00ff00] text-xs">
                metrics --business-kpi
              </span>
              <span className="cursor-blink text-[#00ff00] text-xs" />
            </div>

            {/* State: disconnected */}
            {authState === "disconnected" && (
              <div className="text-center py-12">
                <p className="text-[#555] text-xs mb-2">
                  {`// EBRトークンホルダー専用ダッシュボード`}
                </p>
                <p className="text-[#888] text-xs mb-6">
                  Phantom
                  Walletを接続してEBRトークンの保有を確認してください
                </p>
                <button
                  onClick={connectWallet}
                  className="px-6 py-2 bg-[#00ff00]/10 border border-[#00ff00]/30 text-[#00ff00] text-xs hover:bg-[#00ff00]/20 transition-colors"
                >
                  $ connect --wallet phantom
                </button>
                {error && (
                  <p className="text-[#ff4444] text-xs mt-4">
                    <span className="text-[#555]">[</span>ERROR
                    <span className="text-[#555]">]</span> {error}
                  </p>
                )}
              </div>
            )}

            {/* State: connecting */}
            {authState === "connecting" && (
              <div className="text-center py-12">
                <p className="text-[#ffaa00] text-xs animate-pulse">
                  Connecting to Phantom Wallet...
                </p>
              </div>
            )}

            {/* State: no EBR tokens */}
            {authState === "no_token" && (
              <div className="text-center py-12">
                <p className="text-[#ff4444] text-xs mb-2">
                  <span className="text-[#555]">[</span>ACCESS DENIED
                  <span className="text-[#555]">]</span>
                </p>
                <p className="text-[#888] text-xs mb-4">
                  EBRトークンが検出されませんでした
                </p>
                <div className="inline-block text-left p-3 border border-[#1a3a1a] mb-4">
                  <p className="text-[#555] text-xs">
                    wallet:{" "}
                    <span className="text-[#ffaa00]">
                      {walletAddress.slice(0, 8)}...{walletAddress.slice(-4)}
                    </span>
                  </p>
                  <p className="text-[#555] text-xs">
                    EBR balance: <span className="text-[#ff4444]">0</span>
                  </p>
                </div>
                <p className="text-[#555] text-xs">
                  EBRトークンの取得方法は{" "}
                  <Link
                    href="/token"
                    className="text-[#00ffff] hover:text-[#00ff00] transition-colors"
                  >
                    ~/token
                  </Link>{" "}
                  を参照してください
                </p>
              </div>
            )}

            {/* State: authenticated — wallet info bar */}
            {authState === "authenticated" && (
              <div className="flex items-center justify-between mt-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff00] animate-pulse" />
                  <span className="text-[#555]">
                    {walletAddress.slice(0, 8)}...{walletAddress.slice(-4)}
                  </span>
                  <span className="text-[#333]">|</span>
                  <span className="text-[#00ff00]">
                    {ebrBalance.toLocaleString()} EBR
                  </span>
                </div>
                {dashboard && (
                  <span className="text-[#333]">
                    updated:{" "}
                    {new Date(dashboard.fetchedAt).toLocaleTimeString("ja-JP")}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Loading state */}
          {authState === "authenticated" && loading && !dashboard && (
            <div className="terminal-box p-4 text-center">
              <p className="text-[#00ff00] text-xs animate-pulse">
                $ fetching business metrics...
              </p>
            </div>
          )}

          {/* Dashboard content */}
          {authState === "authenticated" && dashboard && (
            <>
              {/* KPI Cards — 4 columns */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  {
                    label: "Total Users",
                    value: dashboard.chatweb
                      ? formatNumber(dashboard.kpi.total_users)
                      : "--",
                    color: "#00ff00",
                  },
                  {
                    label: "Paid Subscribers",
                    value: formatNumber(dashboard.kpi.paid_subscribers),
                    color: "#00ffff",
                  },
                  {
                    label: "MRR (USD)",
                    value: formatUSD(dashboard.kpi.mrr_usd_cents),
                    color: "#ffaa00",
                  },
                  {
                    label: "MRR (JPY)",
                    value: formatJPY(dashboard.kpi.mrr_jpy),
                    color: "#ff88ff",
                  },
                ].map((kpi) => (
                  <div key={kpi.label} className="terminal-box p-4">
                    <p className="text-[#555] text-xs mb-1">
                      {`// ${kpi.label}`}
                    </p>
                    <p
                      className="text-2xl font-bold text-glow"
                      style={{ color: kpi.color }}
                    >
                      {kpi.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Revenue Breakdown (Stripe) */}
              <div className="terminal-box p-4 sm:p-6 mb-6">
                <p className="text-[#555] text-xs mb-3">
                  # Revenue Breakdown (Stripe)
                </p>
                {dashboard.stripe.subscriptions.length > 0 ? (
                  <div className="space-y-2">
                    {(() => {
                      const maxSubs = Math.max(
                        ...dashboard.stripe.subscriptions.map((s) => s.active_count),
                        1
                      );
                      return dashboard.stripe.subscriptions.map((sub) => (
                        <div
                          key={sub.product_name}
                          className="flex items-center gap-3 text-xs"
                        >
                          <span
                            className="text-[#00ffff] ascii-progress flex-shrink-0"
                            style={{ fontSize: "8px" }}
                          >
                            {makeAsciiBar(sub.active_count, maxSubs, 10)}
                          </span>
                          <span className="text-[#00ff00] flex-shrink-0 w-40 truncate">
                            {sub.product_name}
                          </span>
                          <span className="text-[#888] flex-shrink-0 w-12 text-right">
                            x{sub.active_count}
                          </span>
                          <span className="text-[#ffaa00] flex-shrink-0 w-20 text-right">
                            {sub.currency === "jpy"
                              ? formatJPY(sub.unit_amount)
                              : formatUSD(sub.unit_amount)}
                          </span>
                          <span className="text-[#555] flex-shrink-0">=</span>
                          <span className="text-[#ff88ff] flex-shrink-0 w-24 text-right">
                            {sub.currency === "jpy"
                              ? formatJPY(sub.mrr_contribution)
                              : formatUSD(sub.mrr_contribution)}
                            /mo
                          </span>
                        </div>
                      ));
                    })()}
                  </div>
                ) : (
                  <p className="text-[#555] text-xs">[NO ACTIVE SUBSCRIPTIONS]</p>
                )}
              </div>

              {/* Chatweb.ai Stats */}
              <div className="terminal-box p-4 sm:p-6 mb-6">
                <p className="text-[#555] text-xs mb-3"># Chatweb.ai</p>
                {dashboard.chatweb ? (
                  <>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <p className="text-[#555] text-[10px]">total users</p>
                        <p className="text-[#00ff00] text-xs">
                          {formatNumber(dashboard.chatweb.total_users)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#555] text-[10px]">today usage</p>
                        <p className="text-[#00ffff] text-xs">
                          {formatNumber(dashboard.chatweb.today_usage)}
                        </p>
                      </div>
                    </div>
                    <p className="text-[#555] text-[10px] mb-1">
                      # channel sessions
                    </p>
                    {(() => {
                      const sessions = dashboard.chatweb!.sessions;
                      const channels = [
                        { name: "webchat", value: sessions.webchat },
                        { name: "line", value: sessions.line },
                        { name: "telegram", value: sessions.telegram },
                      ];
                      const maxSessions = Math.max(
                        ...channels.map((c) => c.value),
                        1
                      );
                      return channels.map((ch) => (
                        <div
                          key={ch.name}
                          className="flex items-center gap-2 leading-relaxed"
                          style={{ fontSize: "10px" }}
                        >
                          <span
                            className="text-[#00ffff] ascii-progress flex-shrink-0"
                            style={{ fontSize: "8px" }}
                          >
                            {makeAsciiBar(ch.value, maxSessions, 10)}
                          </span>
                          <span className="text-[#555] w-16">{ch.name}</span>
                          <span className="text-[#888]">
                            {formatNumber(ch.value)}
                          </span>
                        </div>
                      ));
                    })()}
                    <div className="mt-1 text-[10px]">
                      <span className="text-[#555]">total: </span>
                      <span className="text-[#ffaa00]">
                        {formatNumber(dashboard.chatweb.sessions.total)}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-[#555] text-xs">[OFFLINE]</p>
                )}
              </div>

              {/* Community */}
              <div className="terminal-box p-4 sm:p-6 mb-6">
                <p className="text-[#555] text-xs mb-3"># Community</p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-[#555] text-[10px]">EBR holders</p>
                    <p className="text-[#00ff00] text-xs">
                      {formatNumber(dashboard.community.ebr_holders)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#555] text-[10px]">GitHub stars</p>
                    <p className="text-[#ffaa00] text-xs">
                      {formatNumber(dashboard.community.github_stars)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#555] text-[10px]">GitHub repos</p>
                    <p className="text-[#00ffff] text-xs">
                      {formatNumber(dashboard.community.github_repos)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions: Refresh + Export */}
              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  onClick={fetchDashboard}
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
              </div>
            </>
          )}

          {/* Error (shown when authenticated) */}
          {authState === "authenticated" && error && (
            <p className="text-[#ff4444] text-xs mt-4 text-center">
              <span className="text-[#555]">[</span>ERROR
              <span className="text-[#555]">]</span> {error}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
