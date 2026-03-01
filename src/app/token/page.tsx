import type { Metadata } from "next";
import Link from "next/link";
import TokenStats from "@/components/TokenStats";
import BoneSection from "@/components/BoneSection";
import TokenSwap from "@/components/TokenSwap";

export const metadata: Metadata = {
  title: "EBR & BONE Token - EnablerDAO トークンエコノミー",
  description:
    "EBR（ガバナンス）とBONE（Dog Pack燃料）— EnablerDAOの2つのSolanaトークン。AIドッグパックがBONEを食べて自己進化します。",
};

const tokenAllocation = [
  { label: "コミュニティ報酬", percentage: 40, amount: "2,808,440", color: "#00ff00" },
  { label: "開発チーム", percentage: 20, amount: "1,404,220", color: "#00ffff" },
  { label: "エコシステム基金", percentage: 15, amount: "1,053,165", color: "#aa66ff" },
  { label: "パートナーシップ", percentage: 10, amount: "702,110", color: "#4488ff" },
  { label: "リザーブ", percentage: 10, amount: "702,110", color: "#ffaa00" },
  { label: "アドバイザー", percentage: 5, amount: "351,055", color: "#ff6688" },
];

function makeAsciiBar(percentage: number, width: number = 20): string {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  return "\u2588".repeat(filled) + "\u2591".repeat(empty);
}

const hamaDaoExperience = [
  {
    hash: "h1a2m3a",
    date: "2024-06",
    message: "feat: HamaDAO設立 (NounsDAO派生, Nouns Builder)",
    author: "yukihamada.eth",
  },
  {
    hash: "d4a5o6",
    date: "2024-08",
    message: "feat: NFTオークション型ガバナンス実装",
    author: "yukihamada.eth",
  },
  {
    hash: "n7o8u9",
    date: "2024-10",
    message: "feat: Nouns Builder活用 - 提案/投票/トレジャリー",
    author: "yukihamada.eth",
  },
  {
    hash: "e1n2s3",
    date: "2025-01",
    message: "feat: enablerdao.eth - マルチチェーン体制へ移行",
    author: "enablerdao.eth",
  },
];

const tokenRoadmap = [
  {
    phase: "Phase 1",
    title: "トークン発行",
    description: "Solanaネットワーク上でEBRトークンを発行。初期コントリビューターへの配布開始。",
    status: "done" as const,
  },
  {
    phase: "Phase 2",
    title: "ガバナンス開始",
    description: "オンチェーン投票システムの実装。提案・投票・実行のフローを確立。",
    status: "done" as const,
  },
  {
    phase: "Phase 3",
    title: "BONE Token & Dog Pack",
    description: "AI犬パック稼働開始。BONEトークン発行。犬がBONEを食べて自己進化するトークンエコノミー確立。",
    status: "done" as const,
  },
  {
    phase: "Phase 4",
    title: "エコシステム拡大",
    description: "パートナーDAOとのトークン連携。EBR↔BONE交換。クロスチェーンブリッジ。",
    status: "wip" as const,
  },
];

export default function TokenPage() {
  return (
    <div className="grid-bg">
      {/* Hero */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-box p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1a3a1a]">
              <span className="text-[#555] text-xs">enablerdao@web3:~/token$</span>
              <span className="text-[#00ff00] text-xs">cat TOKEN_ECOSYSTEM.json</span>
            </div>

            {/* Four-token system overview */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
              <div className="p-2 sm:p-3 border border-[#00ff00]/30 bg-[#00ff00]/5">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                  <span>&#x1F4B0;</span>
                  <span className="text-[#00ff00] text-[10px] sm:text-xs font-bold">EBR</span>
                </div>
                <p className="text-[#888] text-[9px] sm:text-[10px]">ガバナンス。DAO参加権</p>
              </div>
              <div className="p-2 sm:p-3 border border-[#ffaa00]/30 bg-[#ffaa00]/5">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                  <span>&#x1F9B4;</span>
                  <span className="text-[#ffaa00] text-[10px] sm:text-xs font-bold">BONE</span>
                </div>
                <p className="text-[#888] text-[9px] sm:text-[10px]">進化燃料。犬がバーン</p>
              </div>
              <div className="p-2 sm:p-3 border border-[#ff8844]/30 bg-[#ff8844]/5">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                  <span>&#x1F35B;</span>
                  <span className="text-[#ff8844] text-[10px] sm:text-xs font-bold">KIBBLE</span>
                </div>
                <p className="text-[#888] text-[9px] sm:text-[10px]">ドッグフード。食べると…</p>
              </div>
              <div className="p-2 sm:p-3 border border-[#aa8844]/30 bg-[#aa8844]/5">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                  <span>&#x1F4A9;</span>
                  <span className="text-[#aa8844] text-[10px] sm:text-xs font-bold">POOP</span>
                </div>
                <p className="text-[#888] text-[9px] sm:text-[10px]">うんち。ユーザーが拾える</p>
              </div>
            </div>

            {/* Important notice */}
            <div className="p-3 border border-[#ffaa00]/30 bg-[#ffaa00]/5">
              <p className="text-[#ffaa00] text-xs mb-1">
                <span className="text-[#555]">[</span>
                <span className="text-[#ffaa00]">IMPORTANT</span>
                <span className="text-[#555]">]</span>
                {" "}EBR/BONEは投資商品ではありません
              </p>
              <p className="text-[#666] text-[10px] leading-relaxed">
                これらのトークンはEnablerDAOのガバナンスとAIシステム運用のみを目的としたユーティリティトークンです。
                金銭的価値の上昇を期待して取得するものではありません。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* BONE Token — Dog Pack Section                                  */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      <BoneSection />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* Chatweb.ai — EBR Earning Section                               */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#555] text-xs mb-4">
            <span className="text-[#00aa00]">$ </span>
            cat CHATWEB_EBR_REWARDS.md
          </p>

          <div className="terminal-box p-4 sm:p-6">
            <h2 className="text-[#ffaa00] text-sm mb-2 flex items-center gap-2">
              <span>&#x2B50;</span> Chatweb.ai で EBR を獲得
            </h2>
            <p className="text-[#555] text-[10px] sm:text-xs mb-4">
              {`// Chatweb.aiの有料プランに加入すると、毎月EBRトークンが自動付与されます`}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {/* Free */}
              <div className="p-3 border border-[#333] bg-[#0d0d0d]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#888] text-xs font-bold">Free</span>
                  <span className="text-[#555] text-[10px]">$0/月</span>
                </div>
                <div className="text-center py-2">
                  <p className="text-xl sm:text-2xl font-bold text-[#555]">0</p>
                  <p className="text-[9px] sm:text-[10px] text-[#555]">EBR/月</p>
                </div>
                <ul className="text-[9px] sm:text-[10px] text-[#666] space-y-1 mt-2">
                  <li>&#x2022; AIチャット 100クレジット</li>
                  <li>&#x2022; Nemotronモデル</li>
                </ul>
              </div>

              {/* Starter */}
              <div className="p-3 border border-[#00ffff]/30 bg-[#00ffff]/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#00ffff] text-xs font-bold">Starter</span>
                  <span className="text-[#00ffff] text-[10px]">$9/月</span>
                </div>
                <div className="text-center py-2">
                  <p className="text-xl sm:text-2xl font-bold text-[#00ffff]">50</p>
                  <p className="text-[9px] sm:text-[10px] text-[#00ffff]">EBR/月</p>
                </div>
                <ul className="text-[9px] sm:text-[10px] text-[#888] space-y-1 mt-2">
                  <li>&#x2022; 5,000クレジット/月</li>
                  <li>&#x2022; 全モデルアクセス</li>
                  <li>&#x2022; ツール呼び出し 3回/会話</li>
                </ul>
              </div>

              {/* Pro */}
              <div className="p-3 border border-[#ffaa00]/30 bg-[#ffaa00]/5 relative">
                <div className="absolute -top-2 right-2">
                  <span className="text-[8px] px-1.5 py-0.5 bg-[#ffaa00] text-[#000] font-bold">BEST</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#ffaa00] text-xs font-bold">Pro</span>
                  <span className="text-[#ffaa00] text-[10px]">$29/月</span>
                </div>
                <div className="text-center py-2">
                  <p className="text-xl sm:text-2xl font-bold text-[#ffaa00]">200</p>
                  <p className="text-[9px] sm:text-[10px] text-[#ffaa00]">EBR/月</p>
                </div>
                <ul className="text-[9px] sm:text-[10px] text-[#888] space-y-1 mt-2">
                  <li>&#x2022; 20,000クレジット/月</li>
                  <li>&#x2022; 全モデル + Claude/GPT</li>
                  <li>&#x2022; ツール呼び出し 5回/会話</li>
                  <li>&#x2022; 音声合成(TTS)</li>
                </ul>
              </div>
            </div>

            <div className="p-3 bg-[#0d0d0d] border border-[#1a3a1a] text-[10px] sm:text-xs">
              <p className="text-[#888] mb-2">
                <span className="text-[#ffaa00]">&#x2139; </span>
                EBRはユーティリティトークンです。Chatweb.aiのサブスク特典として毎月自動付与されます。
                獲得したEBRはDAO投票権として使用したり、BONEに交換してDog Packの進化に使えます。
              </p>
              <p className="text-[#555]">
                ※ EBRは投資商品ではありません。金銭的リターンを目的としたものではなく、ガバナンス参加のためのユーティリティトークンです。
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#1a3a1a]">
              <a
                href="https://chatweb.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#ffaa00] text-xs hover:text-[#ffcc44] transition-colors"
              >
                <span className="text-[#555]">{`>`}</span> chatweb.ai でプランを確認
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* EBR Token — Governance Section                                 */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      {/* EBR Hero */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#555] text-xs mb-4">
            <span className="text-[#00aa00]">$ </span>
            cat EBR_TOKEN_INFO.json
          </p>

          <div className="terminal-box p-4 sm:p-6">
            <h2 className="text-[#00ff00] text-sm mb-4"># EBR — ガバナンストークン</h2>

            {/* JSON display */}
            <pre className="text-[10px] sm:text-xs leading-relaxed overflow-x-auto break-all">
              <span className="text-[#555]">{"{"}</span>{"\n"}
              {"  "}<span className="text-[#00ffff]">&quot;name&quot;</span><span className="text-[#555]">: </span><span className="text-[#00ff00]">&quot;Enabler&quot;</span><span className="text-[#555]">,</span>{"\n"}
              {"  "}<span className="text-[#00ffff]">&quot;symbol&quot;</span><span className="text-[#555]">: </span><span className="text-[#00ff00]">&quot;EBR&quot;</span><span className="text-[#555]">,</span>{"\n"}
              {"  "}<span className="text-[#00ffff]">&quot;network&quot;</span><span className="text-[#555]">: </span><span className="text-[#00ff00]">&quot;Solana&quot;</span><span className="text-[#555]">,</span>{"\n"}
              {"  "}<span className="text-[#00ffff]">&quot;mint&quot;</span><span className="text-[#555]">: </span><span className="text-[#00ff00]">&quot;E1JxwaWRd8nw8vDdWMdqwdbXGBshqDcnTcinHzNMqg2Y&quot;</span><span className="text-[#555]">,</span>{"\n"}
              {"  "}<span className="text-[#00ffff]">&quot;total_supply&quot;</span><span className="text-[#555]">: </span><span className="text-[#ffaa00]">7021100</span><span className="text-[#555]">,</span>{"\n"}
              {"  "}<span className="text-[#00ffff]">&quot;purpose&quot;</span><span className="text-[#555]">: </span><span className="text-[#00ff00]">&quot;governance_only&quot;</span>{"\n"}
              <span className="text-[#555]">{"}"}</span>
            </pre>

            <div className="mt-4 pt-3 border-t border-[#1a3a1a]">
              <a
                href="https://solscan.io/token/E1JxwaWRd8nw8vDdWMdqwdbXGBshqDcnTcinHzNMqg2Y"
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

      {/* Real-time Token Stats */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#555] text-xs mb-4">
            <span className="text-[#00aa00]">$ </span>
            solana spl-token accounts --owner EBR
          </p>
          <TokenStats />
        </div>
      </section>

      {/* Token Allocation - ASCII Progress Bars */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#555] text-xs mb-4">
            <span className="text-[#00aa00]">$ </span>
            cat ALLOCATION_PLAN.md
          </p>

          <div className="terminal-box p-4 sm:p-6">
            <h2 className="text-[#00ff00] text-sm mb-2"># EBRトークン配分計画</h2>
            <p className="text-[#555] text-[10px] mb-4">
              {`// 計画段階の配分 - 実際の配分は上記「実際のトークン配分」セクションを参照`}
            </p>

            <div className="space-y-3">
              {tokenAllocation.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[#888] text-[10px] sm:text-xs">{item.label}</span>
                    <span className="text-[10px] sm:text-xs flex items-center gap-1 sm:gap-2">
                      <span className="text-[#555] hidden sm:inline">{item.amount} EBR</span>
                      <span style={{ color: item.color }}>{item.percentage}%</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="ascii-progress text-[9px] sm:text-xs" style={{ color: item.color }}>
                      {makeAsciiBar(item.percentage, 20)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-[#1a3a1a]">
              {tokenAllocation.map((item) => (
                <span key={item.label} className="flex items-center gap-1 text-[9px] sm:text-[10px] text-[#555]">
                  <span className="w-2 h-2 flex-shrink-0" style={{ backgroundColor: item.color }} />
                  {item.label} ({item.percentage}%)
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Distribution Model */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#555] text-xs mb-4">
            <span className="text-[#00aa00]">$ </span>
            cat DISTRIBUTION.md
          </p>

          <div className="terminal-box p-4 sm:p-6">
            <h2 className="text-[#00ff00] text-sm mb-2"># EBRトークンの受け取り方</h2>
            <p className="text-[#555] text-xs mb-4">
              {`// EBRは購入ではなく、プロジェクトへの実際の貢献に応じて配布されます`}
            </p>

            <div className="space-y-2">
              {[
                { cmd: "chatweb.ai", label: "Chatweb.ai 有料プラン", desc: "Starter($9/月)で毎月50 EBR、Pro($29/月)で毎月200 EBR付与", highlight: true },
                { cmd: "git commit", label: "プロジェクトへの貢献", desc: "コードの提出、バグ修正、機能追加" },
                { cmd: "npm start", label: "プロダクトの利用", desc: "Chatweb.ai、Elio Chat、JiuFlow の活用" },
                { cmd: "gh issue", label: "フィードバック提供", desc: "バグ報告、機能リクエスト、改善提案" },
                { cmd: "vim docs/", label: "コンテンツ作成", desc: "ドキュメント、チュートリアル、翻訳" },
              ].map((item) => (
                <div key={item.cmd} className={`flex items-start gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-[#00ff00]/5 transition-colors -mx-2 sm:-mx-3 ${"highlight" in item && item.highlight ? "border border-[#ffaa00]/20 bg-[#ffaa00]/5 mx-0 sm:mx-0 rounded" : ""}`}>
                  <span className={`text-[10px] sm:text-xs flex-shrink-0 w-20 sm:w-24 ${"highlight" in item && item.highlight ? "text-[#ffaa00]" : "text-[#00ffff]"}`}>{item.cmd}</span>
                  <div className="min-w-0">
                    <span className={`text-[10px] sm:text-xs ${"highlight" in item && item.highlight ? "text-[#ffaa00] font-bold" : "text-[#00ff00]"}`}>{item.label}</span>
                    <p className="text-[#555] text-[10px] sm:text-xs break-words">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Token Roadmap */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#555] text-xs mb-4">
            <span className="text-[#00aa00]">$ </span>
            cat ROADMAP.md
          </p>

          <div className="terminal-box p-4 sm:p-6">
            <h2 className="text-[#00ff00] text-sm mb-4"># トークンエコノミーの発展計画</h2>

            <div className="space-y-3">
              {tokenRoadmap.map((item) => (
                <div key={item.phase} className="flex items-start gap-2 sm:gap-3">
                  <span className={`text-[10px] sm:text-xs flex-shrink-0 w-12 sm:w-14 ${
                    item.status === "done" ? "text-[#00ff00]" : "text-[#ffaa00]"
                  }`}>
                    {item.status === "done" ? "[DONE]" : "[WIP]"}
                  </span>
                  <div className="min-w-0">
                    <span className="text-[#00ffff] text-[10px] sm:text-xs">{item.phase}: </span>
                    <span className="text-[#888] text-[10px] sm:text-xs">{item.title}</span>
                    <p className="text-[#555] text-[10px] sm:text-xs mt-0.5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HamaDAO Experience */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#555] text-xs mb-4">
            <span className="text-[#00aa00]">$ </span>
            git log --oneline ./hamadao/
          </p>

          <div className="terminal-box p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-[#aa66ff] text-sm"># HamaDAO (NounsDAO派生) の経験</h2>
            </div>
            <p className="text-[#555] text-xs mb-4">
              {`// 創始者のDAO運営実績をEnablerDAOの設計に活用`}
            </p>

            <div className="space-y-1">
              {hamaDaoExperience.map((item, index) => (
                <div key={item.hash} className="flex gap-2 sm:gap-3 text-[10px] sm:text-xs group">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#aa66ff]" />
                    {index < hamaDaoExperience.length - 1 && (
                      <span className="w-px flex-1 bg-[#1a3a1a] min-h-[16px]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 py-0.5">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="text-[#ffaa00]">{item.hash}</span>
                      <span className="text-[#888]">{item.message}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#555]">
                      <span className="truncate">{item.author}</span>
                      <span className="text-[#333]">({item.date})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-[#1a3a1a]">
              <a
                href="https://nouns.build/dao/ethereum/0x4016eec42a764cb2d5e6bbdeb9ce69a473252e7b/6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#aa66ff] text-xs hover:text-[#cc88ff] transition-colors"
              >
                <span className="text-[#555]">{`>`}</span> open nouns.build/dao/.../hamadao
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Governance */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-box p-4 sm:p-6">
            <h2 className="text-[#00ff00] text-sm mb-4 text-center"># ガバナンスへの参加</h2>
            <p className="text-[#666] text-xs text-center mb-6">
              {`// EBRトークン保有者は、EnablerDAOの運営方針や新プロジェクトの採択に投票できます`}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { title: "PROPOSE", desc: "新しいプロジェクトやイニシアチブを提案", icon: ">" },
                { title: "VOTE", desc: "重要な意思決定に投票で参加", icon: "#" },
                { title: "EXECUTE", desc: "承認された提案を共同で実行", icon: "$" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-3 border border-[#1a3a1a] hover:border-[#00ff00]/30 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#00ff00] text-lg">{item.icon}</span>
                    <span className="text-[#00ffff] text-xs">{item.title}</span>
                  </div>
                  <p className="text-[#555] text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* Token Swap — DEX Section                                       */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      <TokenSwap />

      {/* Disclaimer */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-box p-4 border-[#ffaa00]/30">
            <p className="text-[#ffaa00] text-xs mb-2">
              <span className="text-[#555]">[</span>
              <span className="text-[#ffaa00]">WARN</span>
              <span className="text-[#555]">]</span>
              {" "}重要な免責事項
            </p>
            <div className="text-[#666] text-xs leading-relaxed space-y-2">
              <p>
                EBR/BONEトークンは投資商品ではありません。金銭的リターンや価値の上昇を期待して取得すべきものではなく、
                ガバナンスおよびAIシステム運用のみを目的としたユーティリティトークンです。
              </p>
              <p>
                EnablerDAOはオープンソースプロジェクトの開発を目的とした分散型組織であり、
                投資プラットフォームではありません。参加にあたっては、ご自身の判断と責任でお願いいたします。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#00ff00] text-sm mb-2 text-glow">
            {`// Dog Pack に参加しよう`}
          </p>
          <p className="text-[#555] text-xs mb-6">
            プロジェクトに貢献してEBRを獲得 → BONEに交換 → 犬が食べて進化
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://chatweb.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#ffaa00]/10 border border-[#ffaa00]/30 text-[#ffaa00] text-xs hover:bg-[#ffaa00]/20 transition-colors"
            >
              $ Chatweb.ai -- EBRをもらう
            </a>
            <a
              href="https://github.com/yukihamada"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#00ff00]/10 border border-[#00ff00]/30 text-[#00ff00] text-xs hover:bg-[#00ff00]/20 transition-colors"
            >
              $ GitHub -- 貢献を始める
            </a>
            <a
              href="https://rustdog-spin.fly.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#111] border border-[#1a3a1a] text-[#888] text-xs hover:text-[#00ff00] hover:border-[#00ff00]/30 transition-colors"
            >
              $ Bossdog -- 犬パックに会う
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
