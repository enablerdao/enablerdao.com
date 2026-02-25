"use client";

import { useEffect, useState } from "react";

interface TokenData {
  totalSupply: number;
  holders: number;
  price: number | null;
  marketCap: number | null;
  topHolders: Array<{
    address: string;
    balance: number;
    percentage: number;
  }>;
}

function makeAsciiBar(percentage: number, width: number = 30): string {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  return "█".repeat(filled) + "░".repeat(empty);
}

const EBR_TOKEN_ADDRESS = "E1JxwaWRd8nw8vDdWMdqwdbXGBshqDcnTcinHzNMqg2Y";

export default function TokenStats() {
  const [tokenData, setTokenData] = useState<TokenData>({
    totalSupply: 7021100, // 7.02M from contract
    holders: 0,
    price: null,
    marketCap: null,
    topHolders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        // Fetch from Solscan API (public endpoint)
        const response = await fetch(
          `https://public-api.solscan.io/token/meta?tokenAddress=${EBR_TOKEN_ADDRESS}`
        );

        let supply = 7021100; // Default value

        if (response.ok) {
          const data = await response.json();
          supply = data.supply ? data.supply / 1e9 : supply;

          setTokenData(prev => ({
            ...prev,
            holders: data.holder || prev.holders,
            totalSupply: supply
          }));
        }

        // Fetch top holders
        const holdersResponse = await fetch(
          `https://public-api.solscan.io/token/holders?tokenAddress=${EBR_TOKEN_ADDRESS}&offset=0&limit=10`
        );

        if (holdersResponse.ok) {
          const holdersData = await holdersResponse.json();

          if (holdersData && Array.isArray(holdersData)) {
            const topHolders = holdersData.slice(0, 6).map((holder: { owner?: string; address?: string; amount?: number }) => ({
              address: holder.owner || holder.address || "Unknown",
              balance: holder.amount ? holder.amount / 1e9 : 0,
              percentage: holder.amount && supply
                ? (holder.amount / (supply * 1e9)) * 100
                : 0
            }));

            setTokenData(prev => ({
              ...prev,
              topHolders
            }));
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch token data:", err);
        setLoading(false);
      }
    };

    fetchTokenData();
  }, []);

  return (
    <div className="space-y-4">
      {/* Token Stats */}
      <div className="terminal-box p-4">
        <h3 className="text-[#00ffff] font-bold mb-4">📊 トークン統計 (リアルタイム)</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-[#555] mb-1">総発行数</p>
            <p className="text-xl font-bold text-[#00ff00] font-mono">
              {loading ? "..." : tokenData.totalSupply.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#555] mb-1">ホルダー数</p>
            <p className="text-xl font-bold text-[#00ffff] font-mono">
              {loading ? "..." : tokenData.holders > 0 ? tokenData.holders.toLocaleString() : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#555] mb-1">価格</p>
            <p className="text-xl font-bold text-[#ffaa00] font-mono">
              {tokenData.price ? `$${tokenData.price.toFixed(4)}` : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#555] mb-1">時価総額</p>
            <p className="text-xl font-bold text-[#aa66ff] font-mono">
              {tokenData.marketCap ? `$${(tokenData.marketCap / 1000).toFixed(1)}K` : "N/A"}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#1a3a1a]">
          <a
            href={`https://solscan.io/token/${EBR_TOKEN_ADDRESS}`}
            target="_blank"
            rel="noopener"
            className="text-xs text-[#00ffff] hover:text-[#33ffff]"
          >
            Solscanで確認 →
          </a>
        </div>
      </div>

      {/* Actual Token Distribution - ASCII Bars */}
      {tokenData.topHolders.length > 0 && (
        <div className="terminal-box p-4">
          <h3 className="text-[#00ffff] font-bold mb-2">📊 実際のトークン配分</h3>
          <p className="text-[#555] text-[10px] mb-4">
            {/* リアルタイムのオンチェーンデータ */}
            リアルタイムのオンチェーンデータ - 総発行量: {tokenData.totalSupply.toLocaleString()} EBR
          </p>

          <div className="space-y-3">
            {tokenData.topHolders.map((holder, i) => {
              const colors = ["#00ff00", "#00ffff", "#aa66ff", "#4488ff", "#ffaa00", "#ff6688"];
              const color = colors[i % colors.length];

              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[#888] text-xs font-mono">
                      {holder.address.slice(0, 6)}...{holder.address.slice(-6)}
                    </span>
                    <span className="text-xs flex items-center gap-2">
                      <span className="text-[#555]">
                        {holder.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })} EBR
                      </span>
                      <span style={{ color }}>{holder.percentage.toFixed(2)}%</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="ascii-progress font-mono" style={{ color }}>
                      {makeAsciiBar(holder.percentage, 25)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Calculate "Others" percentage */}
          {(() => {
            const topHoldersTotal = tokenData.topHolders.reduce((sum, h) => sum + h.percentage, 0);
            const othersPercentage = 100 - topHoldersTotal;

            if (othersPercentage > 0) {
              return (
                <div className="mt-3 pt-3 border-t border-[#1a3a1a]">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[#888] text-xs">その他のホルダー</span>
                    <span className="text-xs text-[#555]">{othersPercentage.toFixed(2)}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="ascii-progress font-mono text-[#333]">
                      {makeAsciiBar(othersPercentage, 25)}
                    </span>
                  </div>
                </div>
              );
            }
          })()}

          <p className="text-xs text-[#555] mt-3">
            💡 リアルタイムでSolanaブロックチェーンから取得
          </p>
        </div>
      )}

      {/* Top Holders List */}
      {tokenData.topHolders.length > 0 && (
        <div className="terminal-box p-4">
          <h3 className="text-[#00ffff] font-bold mb-4">🏆 トップホルダー詳細</h3>

          <div className="space-y-2">
            {tokenData.topHolders.map((holder, i) => (
              <div key={i} className="flex items-center gap-3 p-2 bg-[#0d0d0d] border border-[#1a3a1a] rounded">
                <div className="flex-shrink-0 w-6 h-6 bg-[#00ff00]/20 rounded-full flex items-center justify-center text-[#00ff00] text-xs font-bold">
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#e0e0e0] font-mono truncate">
                    {holder.address.slice(0, 8)}...{holder.address.slice(-8)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#00ff00] font-mono">
                    {holder.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-[#555]">{holder.percentage.toFixed(2)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
