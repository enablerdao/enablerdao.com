"use client";

import { useState } from "react";

const EBR_MINT = "E1JxwaWRd8nw8vDdWMdqwdbXGBshqDcnTcinHzNMqg2Y";
const BONE_MINT = "GoM5XaF8fqdCypMGd3ULF7ynjkjQ7rv5kai2dD88aPSM";
const KIBBLE_MINT = "FmMrLHLiVATvUQJRehgxzEnU8UZiJ92SNx1Ub36zMF3o";

type Token = "EBR" | "BONE" | "KIBBLE";

const tokens: Record<Token, { mint: string; color: string; emoji: string; poolId?: string }> = {
  EBR: { mint: EBR_MINT, color: "#00ff00", emoji: "\u{1F4B0}" },
  BONE: { mint: BONE_MINT, color: "#ffaa00", emoji: "\u{1F9B4}", poolId: "GMRAPdzYApjq1dgD9joczN1NzCshSapkoKMG9Acq39Xd" },
  KIBBLE: { mint: KIBBLE_MINT, color: "#ff8844", emoji: "\u{1F35B}", poolId: "AE1M5tKKRP4GUqF17mwJ29PfQXWtrjRqEGZFgxqstfkr" },
};

const fromOptions = [
  { symbol: "SOL", name: "Solana", icon: "\u{25C9}", mint: "So11111111111111111111111111111111111111112" },
  { symbol: "USDC", name: "USD Coin", icon: "\u{24}", mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" },
];

export default function TokenSwap() {
  const [selectedToken, setSelectedToken] = useState<Token>("EBR");
  const [fromToken, setFromToken] = useState(fromOptions[0]);

  const jupiterUrl = `https://jup.ag/swap/${fromToken.mint}-${tokens[selectedToken].mint}`;
  const raydiumUrl = `https://raydium.io/swap/?inputMint=${fromToken.mint}&outputMint=${tokens[selectedToken].mint}`;

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-[#555] text-xs mb-4">
          <span className="text-[#00aa00]">$ </span>
          cat TOKEN_SWAP.md
        </p>

        <div className="terminal-box p-4 sm:p-6">
          <h2 className="text-[#00ffff] text-sm mb-2 flex items-center gap-2">
            <span>&#x1F504;</span> トークンスワップ
          </h2>
          <p className="text-[#555] text-[10px] sm:text-xs mb-4">
            {`// Solana DEX（Jupiter / Raydium）でEBR・BONEを購入できます`}
          </p>

          {/* Token selector */}
          <div className="mb-4">
            <p className="text-[#555] text-[10px] mb-2">購入するトークン:</p>
            <div className="flex gap-2">
              {(Object.keys(tokens) as Token[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedToken(t)}
                  className={`px-3 py-2 text-xs border transition-colors ${
                    selectedToken === t
                      ? "bg-opacity-10"
                      : "border-[#1a3a1a] text-[#555] hover:text-[#888]"
                  }`}
                  style={{
                    borderColor: selectedToken === t ? `${tokens[t].color}60` : undefined,
                    color: selectedToken === t ? tokens[t].color : undefined,
                    backgroundColor: selectedToken === t ? `${tokens[t].color}15` : undefined,
                  }}
                >
                  {tokens[t].emoji} {t}
                </button>
              ))}
            </div>
          </div>

          {/* From token selector */}
          <div className="mb-4">
            <p className="text-[#555] text-[10px] mb-2">支払い通貨:</p>
            <div className="flex gap-2">
              {fromOptions.map((opt) => (
                <button
                  key={opt.symbol}
                  onClick={() => setFromToken(opt)}
                  className={`px-3 py-2 text-xs border transition-colors ${
                    fromToken.symbol === opt.symbol
                      ? "border-[#00ffff]/50 text-[#00ffff] bg-[#00ffff]/10"
                      : "border-[#1a3a1a] text-[#555] hover:text-[#888]"
                  }`}
                >
                  {opt.icon} {opt.symbol}
                </button>
              ))}
            </div>
          </div>

          {/* Swap preview */}
          <div className="p-3 sm:p-4 bg-[#0d0d0d] border border-[#1a3a1a] mb-4">
            <div className="flex items-center justify-center gap-3 sm:gap-4 text-sm sm:text-base">
              <div className="text-center">
                <p className="text-xl sm:text-2xl">{fromToken.icon}</p>
                <p className="text-[10px] sm:text-xs text-[#888]">{fromToken.symbol}</p>
              </div>
              <span className="text-[#555] text-lg">&#x2192;</span>
              <div className="text-center">
                <p className="text-xl sm:text-2xl">{tokens[selectedToken].emoji}</p>
                <p className="text-[10px] sm:text-xs" style={{ color: tokens[selectedToken].color }}>
                  {selectedToken}
                </p>
              </div>
            </div>
          </div>

          {/* Swap buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <a
              href={jupiterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#00ffff]/10 border border-[#00ffff]/30 text-[#00ffff] text-xs hover:bg-[#00ffff]/20 transition-colors"
            >
              Jupiter でスワップ &#x2197;
            </a>
            <a
              href={raydiumUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#aa66ff]/10 border border-[#aa66ff]/30 text-[#aa66ff] text-xs hover:bg-[#aa66ff]/20 transition-colors"
            >
              Raydium でスワップ &#x2197;
            </a>
          </div>

          {/* How to buy with BTC/ETH */}
          <div className="p-3 bg-[#0d0d0d] border border-[#1a3a1a] mb-4">
            <p className="text-[#ffaa00] text-[10px] sm:text-xs font-bold mb-2">
              BTC / ETH から購入する場合
            </p>
            <div className="space-y-1.5 text-[10px] sm:text-xs text-[#888]">
              <div className="flex items-start gap-2">
                <span className="text-[#00ffff] flex-shrink-0">1.</span>
                <span>BTC/ETH を SOL にスワップ（<a href="https://changenow.io" target="_blank" rel="noopener noreferrer" className="text-[#00ffff] hover:underline">ChangeNow</a> / <a href="https://www.sideshift.ai" target="_blank" rel="noopener noreferrer" className="text-[#00ffff] hover:underline">SideShift</a> / 取引所）</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#00ffff] flex-shrink-0">2.</span>
                <span>SOL を Phantom / Solflare ウォレットに送金</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#00ffff] flex-shrink-0">3.</span>
                <span>Jupiter / Raydium で SOL → {selectedToken} にスワップ</span>
              </div>
            </div>
          </div>

          {/* Liquidity pool info */}
          <div className="p-3 bg-[#0d0d0d] border border-[#1a3a1a] mb-4">
            <p className="text-[#555] text-[10px] mb-2"># 流動性プール（Raydium CPMM）</p>
            <div className="space-y-1 text-[9px] sm:text-[10px] font-mono">
              <div className="flex items-start gap-2">
                <span className="text-[#ffaa00] flex-shrink-0">BONE/SOL:</span>
                <span className="text-[#888]">100,000 BONE + 0.5 SOL</span>
                <span className="text-[#00ff00]">LIVE</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#ff8844] flex-shrink-0">KIBBLE/SOL:</span>
                <span className="text-[#888]">100,000 KIBBLE + 0.5 SOL</span>
                <span className="text-[#00ff00]">LIVE</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#00ff00] flex-shrink-0">EBR/SOL:</span>
                <span className="text-[#555]">Coming soon</span>
              </div>
            </div>
          </div>

          {/* Token contract info */}
          <div className="p-3 bg-[#0d0d0d] border border-[#1a3a1a]">
            <p className="text-[#555] text-[10px] mb-2"># コントラクトアドレス（Solana Mainnet）</p>
            <div className="space-y-1 text-[9px] sm:text-[10px] font-mono">
              <div className="flex items-start gap-2">
                <span className="text-[#00ff00] flex-shrink-0 w-12">EBR:</span>
                <span className="text-[#888] break-all">{EBR_MINT}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#ffaa00] flex-shrink-0 w-12">BONE:</span>
                <span className="text-[#888] break-all">{BONE_MINT}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#ff8844] flex-shrink-0 w-12">KIBBLE:</span>
                <span className="text-[#888] break-all">{KIBBLE_MINT}</span>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-4 pt-3 border-t border-[#1a3a1a]">
            <p className="text-[#555] text-[9px] sm:text-[10px] leading-relaxed">
              &#x26A0; DEX上の流動性はコミュニティ提供です。スワップ時のスリッページにご注意ください。
              トークンは投資商品ではなく、ガバナンスおよびAIシステム運用のためのユーティリティトークンです。
              スワップはご自身の判断と責任で行ってください。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
