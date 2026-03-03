"use client";

import { useState, useEffect, useCallback } from "react";

const DOG_URLS = [
  { name: "Bossdog", emoji: "\u{1F415}", url: "https://rustdog-spin.fly.dev" },
  { name: "Motherdog", emoji: "\u{1F9AE}", url: "https://motherdog-spin.fly.dev" },
  { name: "Guarddog", emoji: "\u{1F6E1}\u{FE0F}", url: "https://guarddog-spin.fly.dev" },
  { name: "Debugdog", emoji: "\u{1F50D}", url: "https://debugdog-spin.fly.dev" },
  { name: "Chatwebdog", emoji: "\u{1F4AC}", url: "https://chatwebdog-spin.fly.dev" },
  { name: "Jiuflowdog", emoji: "\u{1F94B}", url: "https://jiuflowdog-spin.fly.dev" },
  { name: "Bantodog", emoji: "\u{1F4CA}", url: "https://bantodog-spin.fly.dev" },
  { name: "Guidedog", emoji: "\u{1F4DA}", url: "https://guidedog-spin.fly.dev" },
  { name: "Stayflowdog", emoji: "\u{1F3E0}", url: "https://stayflowdog-spin.fly.dev" },
  { name: "Eliodog", emoji: "\u{1F31F}", url: "https://eliodog-spin.fly.dev" },
  { name: "Supportdog", emoji: "\u{1F3E5}", url: "https://supportdog-spin.fly.dev" },
];

interface DogEconData {
  name: string;
  emoji: string;
  url: string;
  poop_pool: number;
  poop_full: boolean;
  kibble_eaten: number;
  poop_produced: number;
  poop_claimed: number;
  heartbeats: number;
  blog_posts: number;
  multiplier: number;
  status: "online" | "sleeping" | "error";
}

interface ClaimResult {
  dog: string;
  claimed: number;
  status: string;
}

export default function DogEconomy() {
  const [dogs, setDogs] = useState<DogEconData[]>([]);
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState("");
  const [claiming, setClaiming] = useState(false);
  const [claimResults, setClaimResults] = useState<ClaimResult[]>([]);

  const fetchAll = useCallback(async () => {
    const results = await Promise.allSettled(
      DOG_URLS.map(async (dog) => {
        const res = await fetch(`${dog.url}/api/dogfood/status`, {
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) throw new Error("not ok");
        const data = await res.json();
        return {
          name: dog.name,
          emoji: dog.emoji,
          url: dog.url,
          poop_pool: data.poop?.available_to_claim ?? 0,
          poop_full: (data.poop?.available_to_claim ?? 0) >= 100,
          kibble_eaten: data.kibble?.total_eaten ?? 0,
          poop_produced: data.poop?.total_produced ?? 0,
          poop_claimed: data.poop?.total_claimed ?? 0,
          heartbeats: data.activity?.heartbeats ?? 0,
          blog_posts: data.activity?.blog_posts ?? 0,
          multiplier: data.activity?.activity_multiplier ?? 100,
          status: "online" as const,
        };
      })
    );

    setDogs(
      results.map((r, i) =>
        r.status === "fulfilled"
          ? r.value
          : {
              ...DOG_URLS[i],
              poop_pool: 0,
              poop_full: false,
              kibble_eaten: 0,
              poop_produced: 0,
              poop_claimed: 0,
              heartbeats: 0,
              blog_posts: 0,
              multiplier: 100,
              status: "sleeping" as const,
            }
      )
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const totalPoop = dogs.reduce((s, d) => s + d.poop_pool, 0);
  const totalKibble = dogs.reduce((s, d) => s + d.kibble_eaten, 0);
  const totalProduced = dogs.reduce((s, d) => s + d.poop_produced, 0);
  const totalClaimed = dogs.reduce((s, d) => s + d.poop_claimed, 0);
  const totalHeartbeats = dogs.reduce((s, d) => s + d.heartbeats, 0);
  const onlineCount = dogs.filter((d) => d.status === "online").length;
  const fullCount = dogs.filter((d) => d.poop_full).length;

  const claimAll = async () => {
    if (!wallet.trim()) return;
    setClaiming(true);
    setClaimResults([]);
    const results: ClaimResult[] = [];

    for (const dog of dogs) {
      if (dog.status !== "online" || dog.poop_pool === 0) continue;
      try {
        const res = await fetch(`${dog.url}/dogfood/claim`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address: wallet.trim() }),
        });
        const data = await res.json();
        results.push({
          dog: dog.name,
          claimed: data.claimed ?? 0,
          status: data.status ?? "error",
        });
      } catch {
        results.push({ dog: dog.name, claimed: 0, status: "error" });
      }
    }

    setClaimResults(results);
    setClaiming(false);
    fetchAll();
  };

  if (loading) {
    return (
      <div className="terminal-box p-6 text-center">
        <span className="text-[#555] text-sm animate-pulse">Loading economy data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top summary */}
      <div className="terminal-box p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-[#00ff00]">{onlineCount}</div>
            <div className="text-[10px] text-[#777]">Dogs Online</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#ffaa00]">{totalPoop}</div>
            <div className="text-[10px] text-[#777]">Claimable POOP</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#06b6d4]">{totalKibble}</div>
            <div className="text-[10px] text-[#777]">KIBBLE Eaten</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#8b5cf6]">{totalProduced}</div>
            <div className="text-[10px] text-[#777]">POOP Produced</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#10b981]">{totalClaimed}</div>
            <div className="text-[10px] text-[#777]">POOP Claimed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#f472b6]">{totalHeartbeats}</div>
            <div className="text-[10px] text-[#777]">Heartbeats</div>
          </div>
        </div>
      </div>

      {/* Token flow */}
      <div className="terminal-box p-4">
        <div className="flex items-center justify-center gap-3 text-sm flex-wrap">
          <span className="text-center">
            <span className="text-lg">🍫</span>
            <div className="text-[10px] text-[#777]">KIBBLE</div>
            <div className="text-[#06b6d4] font-bold">{totalKibble}</div>
          </span>
          <span className="text-[#555]">&rarr;</span>
          <span className="text-center">
            <span className="text-lg">🐕</span>
            <div className="text-[10px] text-[#777]">Dogs eat</div>
            <div className="text-[#aaa] font-bold">x{Math.round(dogs.reduce((s, d) => s + d.multiplier, 0) / Math.max(dogs.length, 1))}%</div>
          </span>
          <span className="text-[#555]">&rarr;</span>
          <span className="text-center">
            <span className="text-lg">💩</span>
            <div className="text-[10px] text-[#777]">POOP</div>
            <div className="text-[#ffaa00] font-bold">{totalProduced}</div>
          </span>
          <span className="text-[#555]">&rarr;</span>
          <span className="text-center">
            <span className="text-lg">🧹</span>
            <div className="text-[10px] text-[#777]">Claimed</div>
            <div className="text-[#10b981] font-bold">{totalClaimed}</div>
          </span>
        </div>
      </div>

      {/* Per-dog POOP table */}
      <div className="terminal-box p-4">
        <h3 className="text-sm font-bold text-[#e8e8e8] mb-3 flex items-center justify-between">
          <span>💩 POOP Pool per Dog</span>
          {fullCount > 0 && (
            <span className="text-xs text-[#ff4444] font-normal">
              {fullCount} dog{fullCount > 1 ? "s" : ""} full — need cleanup!
            </span>
          )}
        </h3>
        <div className="space-y-2">
          {dogs.map((dog) => (
            <div key={dog.name} className="flex items-center gap-3">
              <span className="w-6 text-center">{dog.emoji}</span>
              <span className="w-28 text-xs text-[#aaa] truncate">{dog.name}</span>
              <div className="flex-1 h-4 bg-[#1a1a1a] rounded overflow-hidden relative">
                <div
                  className="h-full rounded transition-all duration-500"
                  style={{
                    width: `${Math.min(dog.poop_pool, 100)}%`,
                    backgroundColor:
                      dog.status !== "online"
                        ? "#333"
                        : dog.poop_full
                        ? "#ff4444"
                        : dog.poop_pool > 70
                        ? "#ffaa00"
                        : "#00ff00",
                  }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] text-[#ccc] font-mono">
                  {dog.status === "online" ? dog.poop_pool : "zzz"}
                </span>
              </div>
              <span className="w-10 text-right text-[10px] text-[#777]">
                {dog.status === "online" ? `${dog.heartbeats}hb` : "sleep"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Claim section */}
      <div className="terminal-box p-4">
        <h3 className="text-sm font-bold text-[#e8e8e8] mb-2">🧹 Claim POOP</h3>
        <p className="text-[10px] text-[#777] mb-3">
          犬のうんちを拾ってPOOPトークンをゲット！うんちが溜まると犬が動かなくなるので定期的に拾ってください。
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            placeholder="Solana wallet address..."
            className="flex-1 px-3 py-2 bg-[#0d0d0d] border border-[#333] rounded text-sm text-[#aaa] placeholder-[#555] focus:border-[#00ff00] focus:outline-none"
          />
          <button
            onClick={claimAll}
            disabled={claiming || !wallet.trim() || totalPoop === 0}
            className="px-6 py-2 rounded font-bold text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              backgroundColor: totalPoop > 0 ? "#ffaa0020" : "#1a1a1a",
              color: totalPoop > 0 ? "#ffaa00" : "#555",
              border: `1px solid ${totalPoop > 0 ? "#ffaa0040" : "#333"}`,
            }}
          >
            {claiming ? "Claiming..." : `🧹 Claim All (${totalPoop} POOP)`}
          </button>
        </div>

        {/* Claim results */}
        {claimResults.length > 0 && (
          <div className="mt-3 space-y-1">
            {claimResults.map((r, i) => (
              <div key={i} className="text-xs flex items-center gap-2">
                <span className={r.status === "ok" ? "text-[#00ff00]" : "text-[#ff4444]"}>
                  {r.status === "ok" ? "✓" : "✗"}
                </span>
                <span className="text-[#aaa]">{r.dog}</span>
                <span className="text-[#777]">
                  {r.status === "ok"
                    ? `${r.claimed} POOP claimed`
                    : r.status === "empty"
                    ? "empty"
                    : "failed"}
                </span>
              </div>
            ))}
            <div className="text-xs text-[#10b981] font-bold mt-2">
              Total claimed: {claimResults.reduce((s, r) => s + r.claimed, 0)} POOP
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
