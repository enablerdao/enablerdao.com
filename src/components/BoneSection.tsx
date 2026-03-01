"use client";

import { useState, useEffect } from "react";

const BONE_MINT = "GoM5XaF8fqdCypMGd3ULF7ynjkjQ7rv5kai2dD88aPSM";
const KIBBLE_MINT = "FmMrLHLiVATvUQJRehgxzEnU8UZiJ92SNx1Ub36zMF3o";
const POOP_MINT = "DtWFmcc6s71oUGmNB7ritiPwEVnXYTCRzedq3FfqVPie";
const DOG_PACK_WALLET = "HceVvNPDroeDY1Tvb4GFkBSN15KLVdWPuXEYhZY1w4gG";
const SOLANA_RPC = "https://api.mainnet-beta.solana.com";

const dogs = [
  {
    name: "Bossdog",
    emoji: "\u{1F415}",
    role: "プロジェクト統括",
    desc: "全プロダクトの品質管理・デプロイ統括",
    url: "https://rustdog-spin.fly.dev/",
    color: "#00ff00",
  },
  {
    name: "Motherdog",
    emoji: "\u{1F9AE}",
    role: "コミュニティケア",
    desc: "新メンバーの歓迎・質問対応・温かいDAO作り",
    url: "https://motherdog-spin.fly.dev/",
    color: "#ff88cc",
  },
  {
    name: "Guarddog",
    emoji: "\u{1F6E1}\u{FE0F}",
    role: "セキュリティ番犬",
    desc: "脆弱性チェック・OWASP対策・シークレット漏洩検出",
    url: "https://guarddog-spin.fly.dev/",
    color: "#ff4444",
  },
  {
    name: "Guidedog",
    emoji: "\u{1F9AE}",
    role: "学習ガイド",
    desc: "OSS貢献ガイド・Rust/TS入門・初心者支援",
    url: "https://guidedog-spin.fly.dev/",
    color: "#4488ff",
  },
  {
    name: "Debugdog",
    emoji: "\u{1F50D}",
    role: "バグハンター",
    desc: "バグ追跡・スタックトレース解析・根本原因分析",
    url: "https://debugdog-spin.fly.dev/",
    color: "#aa66ff",
  },
];

interface BoneStats {
  totalSupply: number;
  dogPackSol: number;
  loading: boolean;
}

async function solanaRpc(method: string, params: unknown[]) {
  const res = await fetch(SOLANA_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  if (!res.ok) throw new Error(`RPC ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  return json.result;
}

export default function BoneSection() {
  const [stats, setStats] = useState<BoneStats>({
    totalSupply: 0,
    dogPackSol: 0,
    loading: true,
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [supplyResult, balanceResult] = await Promise.allSettled([
          solanaRpc("getTokenSupply", [BONE_MINT]),
          solanaRpc("getBalance", [DOG_PACK_WALLET]),
        ]);

        const supply =
          supplyResult.status === "fulfilled"
            ? Number(supplyResult.value?.value?.uiAmount ?? 0)
            : 0;

        const sol =
          balanceResult.status === "fulfilled"
            ? (balanceResult.value?.value ?? 0) / 1e9
            : 0;

        setStats({ totalSupply: supply, dogPackSol: sol, loading: false });
      } catch {
        setStats((s) => ({ ...s, loading: false }));
      }
    }
    fetchStats();
  }, []);

  const copyAddress = () => {
    navigator.clipboard.writeText(DOG_PACK_WALLET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* BONE Token Info */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#555] text-xs mb-4">
            <span className="text-[#00aa00]">$ </span>
            cat BONE_TOKEN.json
          </p>

          <div className="terminal-box p-4 sm:p-6">
            <h2 className="text-[#ffaa00] text-sm mb-4 flex items-center gap-2">
              <span>&#x1F9B4;</span> BONE Token — 犬の大好物
            </h2>

            <pre className="text-[10px] sm:text-xs leading-relaxed overflow-x-auto break-all mb-4">
              <span className="text-[#555]">{"{"}</span>{"\n"}
              {"  "}<span className="text-[#00ffff]">&quot;name&quot;</span><span className="text-[#555]">: </span><span className="text-[#ffaa00]">&quot;BONE&quot;</span><span className="text-[#555]">,</span>{"\n"}
              {"  "}<span className="text-[#00ffff]">&quot;description&quot;</span><span className="text-[#555]">: </span><span className="text-[#ffaa00]">&quot;Dog Pack Fuel Token&quot;</span><span className="text-[#555]">,</span>{"\n"}
              {"  "}<span className="text-[#00ffff]">&quot;network&quot;</span><span className="text-[#555]">: </span><span className="text-[#00ff00]">&quot;Solana&quot;</span><span className="text-[#555]">,</span>{"\n"}
              {"  "}<span className="text-[#00ffff]">&quot;mint&quot;</span><span className="text-[#555]">: </span><span className="text-[#00ff00]">&quot;{BONE_MINT}&quot;</span><span className="text-[#555]">,</span>{"\n"}
              {"  "}<span className="text-[#00ffff]">&quot;decimals&quot;</span><span className="text-[#555]">: </span><span className="text-[#ffaa00]">9</span><span className="text-[#555]">,</span>{"\n"}
              {"  "}<span className="text-[#00ffff]">&quot;total_supply&quot;</span><span className="text-[#555]">: </span><span className="text-[#ffaa00]">{stats.loading ? "..." : stats.totalSupply.toLocaleString()}</span><span className="text-[#555]">,</span>{"\n"}
              {"  "}<span className="text-[#00ffff]">&quot;purpose&quot;</span><span className="text-[#555]">: </span><span className="text-[#00ff00]">&quot;ai_dog_evolution_fuel&quot;</span><span className="text-[#555]">,</span>{"\n"}
              {"  "}<span className="text-[#00ffff]">&quot;mechanism&quot;</span><span className="text-[#555]">: </span><span className="text-[#00ff00]">&quot;burn_on_heartbeat&quot;</span>{"\n"}
              <span className="text-[#555]">{"}"}</span>
            </pre>

            {/* On-chain stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 p-2 sm:p-3 bg-[#0d0d0d] border border-[#1a3a1a]">
              <div>
                <p className="text-[10px] text-[#555]">BONE Supply</p>
                <p className="text-sm font-bold text-[#ffaa00] font-mono">
                  {stats.loading ? "..." : stats.totalSupply.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-[#555]">Dog Pack SOL</p>
                <p className="text-sm font-bold text-[#00ffff] font-mono">
                  {stats.loading ? "..." : stats.dogPackSol.toFixed(4)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-[#555]">Dogs Active</p>
                <p className="text-sm font-bold text-[#00ff00] font-mono">5</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#1a3a1a]">
              <a
                href={`https://solscan.io/token/${BONE_MINT}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#00ffff] text-xs hover:text-[#00ff00] transition-colors"
              >
                <span className="text-[#555]">{`>`}</span> Solscanで確認
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How BONE Works — The Burn Cycle */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#555] text-xs mb-4">
            <span className="text-[#00aa00]">$ </span>
            cat BONE_MECHANISM.md
          </p>

          <div className="terminal-box p-4 sm:p-6">
            <h2 className="text-[#ffaa00] text-sm mb-2"># BONEの仕組み — 犬が骨を食べて進化する</h2>
            <p className="text-[#555] text-xs mb-4">
              {`// BONE = 犬の燃料。食べた分だけ永久に消滅（デフレーション）`}
            </p>

            {/* Flow diagram */}
            <div className="space-y-0">
              {[
                {
                  step: "1",
                  icon: "\u{1F4B0}",
                  title: "EBRを獲得",
                  desc: "プロジェクトに貢献してEBRトークンを受け取る",
                  arrow: true,
                },
                {
                  step: "2",
                  icon: "\u{1F504}",
                  title: "EBR → BONE 交換",
                  desc: "EBRをDog Packウォレットに送信してBONEに交換（1 EBR = 100 BONE）",
                  arrow: true,
                },
                {
                  step: "3",
                  icon: "\u{1F9B4}",
                  title: "BONEを犬に送る",
                  desc: "BONEをDog Packウォレットに送信。犬がBONEを検知",
                  arrow: true,
                },
                {
                  step: "4",
                  icon: "\u{1F525}",
                  title: "犬がBONEを食べる (Burn)",
                  desc: "ハートビート時に自動バーン。食べたBONEは永久に消滅",
                  arrow: true,
                },
                {
                  step: "5",
                  icon: "\u{1F9EC}",
                  title: "自己進化",
                  desc: "BONEを消費して犬がコードを書き換え。GitHub経由で自己進化",
                  arrow: false,
                },
              ].map((item) => (
                <div key={item.step}>
                  <div className="flex items-start gap-3 p-3 hover:bg-[#ffaa00]/5 transition-colors -mx-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-[#ffaa00]/20 flex items-center justify-center text-[10px] text-[#ffaa00] font-bold">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span>{item.icon}</span>
                        <span className="text-[#ffaa00] text-xs font-bold">{item.title}</span>
                      </div>
                      <p className="text-[#888] text-xs mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                  {item.arrow && (
                    <div className="flex justify-start ml-6 text-[#333] text-xs">|</div>
                  )}
                </div>
              ))}
            </div>

            {/* Key numbers */}
            <div className="mt-4 pt-4 border-t border-[#1a3a1a] grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "交換レート", value: "1 EBR = 100 BONE", color: "#00ff00" },
                { label: "進化コスト", value: "100 BONE / 回", color: "#ffaa00" },
                { label: "ロイヤリティ", value: "10,000+ BONE", color: "#00ffff" },
                { label: "日次上限", value: "3 進化 / 日", color: "#aa66ff" },
              ].map((item) => (
                <div key={item.label} className="text-center p-2 border border-[#1a3a1a]">
                  <p className="text-[10px] text-[#555]">{item.label}</p>
                  <p className="text-xs font-bold font-mono" style={{ color: item.color }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dog Pack */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#555] text-xs mb-4">
            <span className="text-[#00aa00]">$ </span>
            curl https://rustdog-spin.fly.dev/bots | jq
          </p>

          <div className="terminal-box p-4 sm:p-6">
            <h2 className="text-[#00ff00] text-sm mb-2"># Dog Pack — 5匹のAI犬</h2>
            <p className="text-[#555] text-xs mb-4">
              {`// Rust + WebAssembly (Fermyon Spin) で動作。BONEを食べて自己進化するAIエージェント`}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {dogs.map((dog) => (
                <a
                  key={dog.name}
                  href={dog.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 border border-[#1a3a1a] hover:border-opacity-50 transition-colors group"
                  style={{ borderColor: `${dog.color}30` }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{dog.emoji}</span>
                    <span className="text-xs font-bold" style={{ color: dog.color }}>
                      {dog.name}
                    </span>
                    <span className="text-[10px] text-[#555]">{dog.role}</span>
                  </div>
                  <p className="text-[#888] text-[10px]">{dog.desc}</p>
                  <p className="text-[#555] text-[10px] mt-1 group-hover:text-[#00ffff] transition-colors">
                    {dog.url.replace("https://", "")} {`>`}
                  </p>
                </a>
              ))}

              {/* Shared wallet */}
              <div className="p-3 border border-[#ffaa00]/20 bg-[#ffaa00]/5 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">&#x1F4B3;</span>
                  <span className="text-xs font-bold text-[#ffaa00]">共有ウォレット</span>
                </div>
                <p className="text-[#888] text-[10px] mb-1">
                  5匹全員が同じウォレットでBONEを受け取り&バーン
                </p>
                <button
                  onClick={copyAddress}
                  className="text-[10px] text-[#ffaa00] font-mono break-all text-left hover:text-[#ffcc44] transition-colors cursor-pointer"
                >
                  {DOG_PACK_WALLET}
                  <span className="ml-1 text-[#555]">
                    {copied ? "[copied!]" : "[click to copy]"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EBR → BONE Exchange */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#555] text-xs mb-4">
            <span className="text-[#00aa00]">$ </span>
            cat EXCHANGE.md
          </p>

          <div className="terminal-box p-4 sm:p-6">
            <h2 className="text-[#ffaa00] text-sm mb-2 flex items-center gap-2">
              <span>&#x1F504;</span> EBR → BONE 交換
            </h2>
            <p className="text-[#555] text-xs mb-4">
              {`// EBRをBONEに交換して犬の進化に使おう（レート: 1 EBR = 100 BONE）`}
            </p>

            <div className="space-y-3">
              {/* Step 1 */}
              <div className="p-3 bg-[#0d0d0d] border border-[#1a3a1a]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#00ff00] text-xs font-bold">Step 1:</span>
                  <span className="text-[#888] text-xs">EBRをDog Packウォレットに送信</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#555] text-[10px]">送信先:</span>
                  <button
                    onClick={copyAddress}
                    className="text-[10px] text-[#ffaa00] font-mono break-all text-left hover:text-[#ffcc44] transition-colors cursor-pointer"
                  >
                    {DOG_PACK_WALLET}
                    <span className="ml-1 text-[#555]">
                      {copied ? "[copied!]" : "[copy]"}
                    </span>
                  </button>
                </div>
                <p className="text-[#555] text-[10px] mt-1">
                  Phantom / Solflare / CLI から EBR トークンを上記アドレスに送信してください
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-3 bg-[#0d0d0d] border border-[#1a3a1a]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#00ff00] text-xs font-bold">Step 2:</span>
                  <span className="text-[#888] text-xs">犬にウォレットを登録</span>
                </div>
                <pre className="text-[9px] sm:text-[10px] text-[#00ffff] font-mono overflow-x-auto whitespace-pre-wrap break-all">
{`curl -X POST https://rustdog-spin.fly.dev/wallet \\
  -H "Content-Type: application/json" \\
  -d '{"address":"YOUR_WALLET"}'`}
                </pre>
              </div>

              {/* Step 3 */}
              <div className="p-3 bg-[#0d0d0d] border border-[#1a3a1a]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#00ff00] text-xs font-bold">Step 3:</span>
                  <span className="text-[#888] text-xs">BONEが届くのを待つ</span>
                </div>
                <p className="text-[#555] text-[10px]">
                  犬がEBRの受領を確認後、100倍のBONEをあなたのウォレットにmintします。
                  例: 100 EBR → 10,000 BONE
                </p>
              </div>
            </div>

            {/* Exchange rate table */}
            <div className="mt-4 pt-4 border-t border-[#1a3a1a]">
              <p className="text-[#555] text-[10px] mb-2"># 交換レート早見表</p>
              <div className="grid grid-cols-3 gap-1 text-[10px] font-mono">
                <span className="text-[#555] p-1 border-b border-[#1a3a1a]">EBR</span>
                <span className="text-[#555] p-1 border-b border-[#1a3a1a]">→</span>
                <span className="text-[#555] p-1 border-b border-[#1a3a1a]">BONE</span>
                {[
                  [1, 100],
                  [10, 1000],
                  [100, 10000],
                  [1000, 100000],
                ].map(([ebr, bone]) => (
                  <>
                    <span key={`e${ebr}`} className="text-[#00ff00] p-1">
                      {ebr.toLocaleString()} EBR
                    </span>
                    <span key={`a${ebr}`} className="text-[#333] p-1">=</span>
                    <span key={`b${ebr}`} className="text-[#ffaa00] p-1">
                      {bone.toLocaleString()} BONE
                    </span>
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KIBBLE → POOP Economy */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#555] text-xs mb-4">
            <span className="text-[#00aa00]">$ </span>
            cat DOGFOOD_ECONOMY.md
          </p>

          <div className="terminal-box p-4 sm:p-6">
            <h2 className="text-[#ff8844] text-sm mb-2 flex items-center gap-2">
              <span>&#x1F35B;</span> KIBBLE → POOP サイクル
            </h2>
            <p className="text-[#555] text-xs mb-4">
              {`// ドッグフードを食べて、うんちトークンを生み出す。自然のサイクル！`}
            </p>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
              <div className="p-2 sm:p-3 border border-[#ff8844]/30 bg-[#ff8844]/5 text-center">
                <span className="text-xl sm:text-2xl">&#x1F35B;</span>
                <p className="text-[#ff8844] text-[10px] sm:text-xs font-bold mt-1">KIBBLE</p>
                <p className="text-[9px] sm:text-[10px] text-[#888] mt-1">ドッグフード</p>
              </div>
              <div className="p-2 sm:p-3 border border-[#333] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[#888] text-[10px] sm:text-xs">犬が食べる</p>
                  <p className="text-lg sm:text-2xl">&#x1F436;&#x27A1;&#x1F4A9;</p>
                  <p className="text-[#555] text-[9px] sm:text-[10px]">稼働量×食べた量</p>
                </div>
              </div>
              <div className="p-2 sm:p-3 border border-[#aa8844]/30 bg-[#aa8844]/5 text-center">
                <span className="text-xl sm:text-2xl">&#x1F4A9;</span>
                <p className="text-[#aa8844] text-[10px] sm:text-xs font-bold mt-1">POOP</p>
                <p className="text-[9px] sm:text-[10px] text-[#888] mt-1">うんちトークン</p>
              </div>
            </div>

            <div className="space-y-2 text-[10px] sm:text-xs">
              <div className="p-2 bg-[#0d0d0d] border border-[#1a3a1a]">
                <span className="text-[#ff8844] block sm:inline">KIBBLE入手:</span>
                <span className="text-[#888] sm:ml-2">EBRで購入 or Dog Packウォレットに送信</span>
              </div>
              <div className="p-2 bg-[#0d0d0d] border border-[#1a3a1a]">
                <span className="text-[#aa8844] block sm:inline">POOP生成式:</span>
                <span className="text-[#888] sm:ml-2 font-mono break-all">(1 + KIBBLE/10) x activity_multiplier</span>
              </div>
              <div className="p-2 bg-[#0d0d0d] border border-[#1a3a1a]">
                <span className="text-[#00ffff] block sm:inline">POOP取得:</span>
                <span className="text-[#888] sm:ml-2">POST /dogfood/claim でユーザーが拾える（ガス代はユーザー負担）</span>
              </div>
              <div className="p-2 bg-[#0d0d0d] border border-[#1a3a1a]">
                <span className="text-[#00ff00] block sm:inline">稼働率ボーナス:</span>
                <span className="text-[#888] sm:ml-2">ハートビート +10%/10回、ブログ +20%/記事 (最大3x)</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#1a3a1a] flex flex-wrap gap-3">
              <a
                href={`https://solscan.io/token/${KIBBLE_MINT}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-[#ff8844] hover:text-[#ffaa66] transition-colors"
              >
                KIBBLE on Solscan {`>`}
              </a>
              <a
                href={`https://solscan.io/token/${POOP_MINT}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-[#aa8844] hover:text-[#ccaa66] transition-colors"
              >
                POOP on Solscan {`>`}
              </a>
              <a
                href="https://rustdog-spin.fly.dev/dogfood/status"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-[#00ffff] hover:text-[#33ffff] transition-colors"
              >
                Live Status {`>`}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Architecture */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#555] text-xs mb-4">
            <span className="text-[#00aa00]">$ </span>
            cat ARCHITECTURE.md
          </p>

          <div className="terminal-box p-4 sm:p-6">
            <h2 className="text-[#00ffff] text-sm mb-4"># 技術アーキテクチャ</h2>

            {/* Desktop: full ASCII diagram */}
            <pre className="hidden sm:block text-[10px] text-[#888] font-mono leading-relaxed overflow-x-auto">
{`┌─────────────────────────────────────────────────────┐
│                  EnablerDAO Token Economy             │
├──────────────────────┬──────────────────────────────┤
│   EBR (Governance)   │      BONE (Dog Fuel)          │
│   E1Jxwa...Mqg2Y     │      GoM5Xa...aPSM            │
│   7,021,100 supply   │      Deflationary (burn)       │
│                      │                               │
│   ┌──────────┐       │      ┌──────────────┐         │
│   │ Contribute│──EBR──┼──→──│ Dog Pack     │         │
│   │ to DAO    │       │      │ Wallet       │         │
│   └──────────┘       │      └──────┬───────┘         │
│                      │      ┌──────▼───────┐         │
│                      │      │ Auto-Burn    │         │
│                      │      │ (Heartbeat)  │         │
│                      │      └──────┬───────┘         │
│                      │      ┌──────▼───────┐         │
│                      │      │ Self-Evolve  │         │
│                      │      │ (GitHub API) │         │
│                      │      └──────────────┘         │
├──────────────────────┴──────────────────────────────┤
│  Runtime: Rust + WebAssembly (Fermyon Spin)           │
│  Deploy:  Fly.io (Tokyo nrt) × 5 dogs                │
│  Chain:   Solana Mainnet                              │
└─────────────────────────────────────────────────────┘`}
            </pre>

            {/* Mobile: simplified flow */}
            <div className="sm:hidden space-y-2 text-[10px]">
              <div className="p-2 border border-[#00ff00]/20 bg-[#00ff00]/5">
                <span className="text-[#00ff00] font-bold">EBR</span>
                <span className="text-[#555] ml-1">Governance Token</span>
              </div>
              <div className="text-center text-[#555]">&#x2193; 交換 (1:100)</div>
              <div className="p-2 border border-[#ffaa00]/20 bg-[#ffaa00]/5">
                <span className="text-[#ffaa00] font-bold">BONE</span>
                <span className="text-[#555] ml-1">Dog Pack Wallet</span>
              </div>
              <div className="text-center text-[#555]">&#x2193; Auto-Burn</div>
              <div className="p-2 border border-[#00ffff]/20 bg-[#00ffff]/5">
                <span className="text-[#00ffff] font-bold">Self-Evolve</span>
                <span className="text-[#555] ml-1">GitHub API</span>
              </div>
              <div className="mt-2 p-2 border border-[#333] text-[#555]">
                Rust + WASM (Fermyon Spin) | Fly.io nrt x5 | Solana
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {[
                { key: "Language", value: "Rust (edition 2024)", color: "#00ff00" },
                { key: "Target", value: "wasm32-wasip2 (WebAssembly)", color: "#00ffff" },
                { key: "Framework", value: "Fermyon Spin 3", color: "#aa66ff" },
                { key: "Signing", value: "ed25519-dalek (Solana TX)", color: "#ffaa00" },
                { key: "Heartbeat", value: "GitHub Actions cron (10分)", color: "#ff6688" },
                { key: "Source", value: "github.com/yukihamada/rustydog", color: "#4488ff" },
              ].map((item) => (
                <div key={item.key} className="flex items-start gap-2 sm:gap-3 text-[10px] sm:text-xs">
                  <span className="text-[#555] w-20 sm:w-24 flex-shrink-0">{item.key}:</span>
                  <span className="break-all" style={{ color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
