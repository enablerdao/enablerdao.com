import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "EBR Token - ガバナンストークン",
  description:
    "EBR（Enabler）トークンはEnablerDAOのガバナンストークンです。投資商品ではなく、DAOの意思決定に参加するためのツールです。",
};

const tokenAllocation = [
  { label: "コミュニティ報酬", percentage: 40, amount: "2,808,440", color: "#00ff00" },
  { label: "開発チーム", percentage: 20, amount: "1,404,220", color: "#00ffff" },
  { label: "エコシステム基金", percentage: 15, amount: "1,053,165", color: "#aa66ff" },
  { label: "パートナーシップ", percentage: 10, amount: "702,110", color: "#4488ff" },
  { label: "リザーブ", percentage: 10, amount: "702,110", color: "#ffaa00" },
  { label: "アドバイザー", percentage: 5, amount: "351,055", color: "#ff6688" },
];

function makeAsciiBar(percentage: number, width: number = 30): string {
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
    title: "報酬自動化",
    description: "スマートコントラクトによる貢献報酬の自動配布。GitHubコミット連動。",
    status: "wip" as const,
  },
  {
    phase: "Phase 4",
    title: "エコシステム拡大",
    description: "パートナーDAOとのトークン連携。クロスチェーンブリッジ。enablerdao.ethとの統合。",
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
              <span className="text-[#00ff00] text-xs">cat TOKEN_INFO.json</span>
            </div>

            {/* Important notice */}
            <div className="p-3 mb-4 border border-[#ffaa00]/30 bg-[#ffaa00]/5">
              <p className="text-[#ffaa00] text-xs mb-1">
                <span className="text-[#555]">[</span>
                <span className="text-[#ffaa00]">IMPORTANT</span>
                <span className="text-[#555]">]</span>
                {" "}EBRは投資商品ではありません
              </p>
              <p className="text-[#666] text-[10px] leading-relaxed">
                EBRトークンはEnablerDAOのガバナンス（意思決定への参加）のみを目的としたトークンです。
                金銭的価値の上昇を期待して取得するものではありません。投資対象ではなく、
                リターンを保証するものでもありません。
              </p>
            </div>

            {/* JSON display */}
            <pre className="text-xs leading-relaxed overflow-x-auto">
              <span className="text-[#555]">{"{"}</span>{"\n"}
              {"  "}<span className="text-[#00ffff]">&quot;name&quot;</span><span className="text-[#555]">: </span><span className="text-[#00ff00]">&quot;Enabler&quot;</span><span className="text-[#555]">,</span>{"\n"}
              {"  "}<span className="text-[#00ffff]">&quot;symbol&quot;</span><span className="text-[#555]">: </span><span className="text-[#00ff00]">&quot;EBR&quot;</span><span className="text-[#555]">,</span>{"\n"}
              {"  "}<span className="text-[#00ffff]">&quot;network&quot;</span><span className="text-[#555]">: </span><span className="text-[#00ff00]">&quot;Solana&quot;</span><span className="text-[#555]">,</span>{"\n"}
              {"  "}<span className="text-[#00ffff]">&quot;standard&quot;</span><span className="text-[#555]">: </span><span className="text-[#00ff00]">&quot;SPL Token&quot;</span><span className="text-[#555]">,</span>{"\n"}
              {"  "}<span className="text-[#00ffff]">&quot;mint&quot;</span><span className="text-[#555]">: </span><span className="text-[#00ff00]">&quot;E1JxwaWRd8nw8vDdWMdqwdbXGBshqDcnTcinHzNMqg2Y&quot;</span><span className="text-[#555]">,</span>{"\n"}
              {"  "}<span className="text-[#00ffff]">&quot;decimals&quot;</span><span className="text-[#555]">: </span><span className="text-[#ffaa00]">9</span><span className="text-[#555]">,</span>{"\n"}
              {"  "}<span className="text-[#00ffff]">&quot;total_supply&quot;</span><span className="text-[#555]">: </span><span className="text-[#ffaa00]">7021100</span><span className="text-[#555]">,</span>{"\n"}
              {"  "}<span className="text-[#00ffff]">&quot;mint_authority&quot;</span><span className="text-[#555]">: </span><span className="text-[#00ff00]">&quot;H9S5dBLtFQ6ah6yoJheH57Wy1WuVhCfEa8hHC6ofSBcW&quot;</span><span className="text-[#555]">,</span>{"\n"}
              {"  "}<span className="text-[#00ffff]">&quot;freeze_authority&quot;</span><span className="text-[#555]">: </span><span className="text-[#00ff00]">&quot;H9S5dBLtFQ6ah6yoJheH57Wy1WuVhCfEa8hHC6ofSBcW&quot;</span><span className="text-[#555]">,</span>{"\n"}
              {"  "}<span className="text-[#00ffff]">&quot;purpose&quot;</span><span className="text-[#555]">: </span><span className="text-[#00ff00]">&quot;governance_only&quot;</span><span className="text-[#555]">,</span>{"\n"}
              {"  "}<span className="text-[#00ffff]">&quot;distribution&quot;</span><span className="text-[#555]">: </span><span className="text-[#00ff00]">&quot;contribution_based&quot;</span><span className="text-[#555]">,</span>{"\n"}
              {"  "}<span className="text-[#00ffff]">&quot;ens&quot;</span><span className="text-[#555]">: </span><span className="text-[#00ff00]">&quot;enablerdao.eth&quot;</span>{"\n"}
              <span className="text-[#555]">{"}"}</span>
            </pre>

            <div className="mt-4 pt-3 border-t border-[#1a3a1a]">
              <a
                href="https://solscan.io/token/E1JxwaWRd8nw8vDdWMdqwdbXGBshqDcnTcinHzNMqg2Y"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#00ffff] text-xs hover:text-[#00ff00] transition-colors"
              >
                <span className="text-[#555]">{`>`}</span> Solscanでトークン情報を確認
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* On-Chain Verification */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#555] text-xs mb-4">
            <span className="text-[#00aa00]">$ </span>
            solana spl-token display E1JxwaWRd8nw8vDdWMdqwdbXGBshqDcnTcinHzNMqg2Y
          </p>

          <div className="terminal-box p-4 sm:p-6">
            <h2 className="text-[#00ff00] text-sm mb-4"># オンチェーンデータ（Solana RPC検証済み）</h2>

            <div className="space-y-2">
              {[
                { key: "Mint Address", value: "E1JxwaWRd8nw8vDdWMdqwdbXGBshqDcnTcinHzNMqg2Y", color: "#00ff00" },
                { key: "Total Supply", value: "7,021,100 EBR", color: "#ffaa00" },
                { key: "Decimals", value: "9", color: "#00ffff" },
                { key: "Standard", value: "SPL Token", color: "#00ffff" },
                { key: "Mint Authority", value: "H9S5dBLtFQ6ah6yoJheH57Wy1WuVhCfEa8hHC6ofSBcW", color: "#aa66ff" },
                { key: "Freeze Authority", value: "H9S5dBLtFQ6ah6yoJheH57Wy1WuVhCfEa8hHC6ofSBcW", color: "#aa66ff" },
              ].map((item) => (
                <div key={item.key} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs">
                  <span className="text-[#555] sm:min-w-[140px] flex-shrink-0">{item.key}:</span>
                  <span className="break-all" style={{ color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-[#1a3a1a] flex flex-wrap gap-3">
              <a
                href="https://solscan.io/token/E1JxwaWRd8nw8vDdWMdqwdbXGBshqDcnTcinHzNMqg2Y"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#00ffff] text-xs hover:text-[#00ff00] transition-colors"
              >
                <span className="text-[#555]">{`>`}</span> Solscanで検証
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
              <span className="text-[#333] text-xs">|</span>
              <span className="text-[#555] text-[10px]">
                上記データはSolana RPCから取得した実際のオンチェーン情報です
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Token Allocation - ASCII Progress Bars */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#555] text-xs mb-4">
            <span className="text-[#00aa00]">$ </span>
            cat ALLOCATION.md
          </p>

          <div className="terminal-box p-4 sm:p-6">
            <h2 className="text-[#00ff00] text-sm mb-2"># EBRトークン配分</h2>
            <p className="text-[#555] text-[10px] mb-4">
              {`// 総発行量: 7,021,100 EBR`}
            </p>

            <div className="space-y-3">
              {tokenAllocation.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[#888] text-xs">{item.label}</span>
                    <span className="text-xs flex items-center gap-2">
                      <span className="text-[#555]">{item.amount} EBR</span>
                      <span style={{ color: item.color }}>{item.percentage}%</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="ascii-progress" style={{ color: item.color }}>
                      {makeAsciiBar(item.percentage, 25)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-[#1a3a1a]">
              {tokenAllocation.map((item) => (
                <span key={item.label} className="flex items-center gap-1 text-[10px] text-[#555]">
                  <span className="w-2 h-2" style={{ backgroundColor: item.color }} />
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
            <h2 className="text-[#00ff00] text-sm mb-2"># トークンの受け取り方</h2>
            <p className="text-[#555] text-xs mb-4">
              {`// EBRは購入ではなく、プロジェクトへの実際の貢献に応じて配布されます`}
              <br />
              {`// トークンはガバナンス参加権であり、金銭的価値を保証するものではありません`}
            </p>

            <div className="space-y-2">
              {[
                { cmd: "git commit", label: "プロジェクトへの貢献", desc: "コードの提出、バグ修正、機能追加" },
                { cmd: "npm start", label: "プロダクトの利用", desc: "Chatweb.ai、Elio Chat、News.cloud、SaveJapanの活用" },
                { cmd: "gh issue", label: "フィードバック提供", desc: "バグ報告、機能リクエスト、改善提案" },
                { cmd: "vim docs/", label: "コンテンツ作成", desc: "ドキュメント、チュートリアル、翻訳" },
              ].map((item) => (
                <div key={item.cmd} className="flex items-start gap-3 p-3 hover:bg-[#00ff00]/5 transition-colors -mx-3">
                  <span className="text-[#00ffff] text-xs flex-shrink-0 w-24">{item.cmd}</span>
                  <div>
                    <span className="text-[#00ff00] text-xs">{item.label}</span>
                    <p className="text-[#555] text-xs">{item.desc}</p>
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
                <div key={item.phase} className="flex items-start gap-3">
                  <span className={`text-xs flex-shrink-0 w-14 ${
                    item.status === "done" ? "text-[#00ff00]" : "text-[#ffaa00]"
                  }`}>
                    {item.status === "done" ? "[DONE]" : "[WIP]"}
                  </span>
                  <div>
                    <span className="text-[#00ffff] text-xs">{item.phase}: </span>
                    <span className="text-[#888] text-xs">{item.title}</span>
                    <p className="text-[#555] text-xs mt-0.5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HamaDAO Experience - Git commit history */}
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
                <div key={item.hash} className="flex gap-2 sm:gap-3 text-xs group">
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
                      <span>{item.author}</span>
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
                EBRトークンは投資商品ではありません。金銭的リターンや価値の上昇を期待して取得すべきものではなく、
                EnablerDAOのガバナンス（意思決定プロセスへの参加）のみを目的としたユーティリティトークンです。
              </p>
              <p>
                本ページの内容は金融アドバイスを構成するものではありません。
                EBRトークンの価値が上がることを保証するものではなく、流動性も保証されません。
                トークンの取得は、DAOの活動に貢献した対価としてのみ行われます。
              </p>
              <p>
                EnablerDAOはオープンソースプロジェクトの開発を目的とした非営利的な分散型組織であり、
                投資プラットフォームではありません。参加にあたっては、ご自身の判断と責任でお願いいたします。
              </p>
              <p className="text-[#555]">
                お問い合わせ: contact@enablerdao.com
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#00ff00] text-sm mb-2 text-glow">
            {`// オープンソースプロジェクトに貢献しよう`}
          </p>
          <p className="text-[#555] text-xs mb-6">
            プロジェクトへの貢献を通じてEBRトークンを受け取り、DAOの意思決定に参加できます。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://github.com/yukihamada"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2 bg-[#00ff00]/10 border border-[#00ff00]/30 text-[#00ff00] text-xs hover:bg-[#00ff00]/20 transition-colors"
            >
              $ GitHub -- 貢献を始める
            </a>
            <Link
              href="/projects"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2 bg-[#111] border border-[#1a3a1a] text-[#888] text-xs hover:text-[#00ff00] hover:border-[#00ff00]/30 transition-colors"
            >
              $ ls ./projects/ -- プロジェクト一覧
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
