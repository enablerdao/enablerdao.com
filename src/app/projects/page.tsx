import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "プロジェクト一覧",
  description:
    "EnablerDAOが展開するプロジェクト一覧。Chatweb.ai、EnablerDAO Securityなど、AIとセキュリティでイノベーションを加速。",
};

const projects = [
  {
    name: "Chatweb.ai",
    tagline: "AI駆動のWeb自動化エージェント",
    description:
      "AIエージェントがWebブラウザを操作する自動化プラットフォーム。自然言語で指示を出すだけで、フォーム入力やデータ収集などの複雑なWeb操作を自動化できます。ノーコードでワークフローを構築可能。Next.js + TypeScriptで構築。",
    href: "https://chatweb.ai",
    github: "https://github.com/yukihamada/chatweb-ai",
    badge: "ACTIVE",
    status: "passing" as const,
    lastUpdate: "2025-02-10",
    features: [
      "自然言語によるブラウザ操作",
      "AIエージェントによるWeb自動化",
      "データ収集・フォーム入力の自動化",
      "ノーコードでのワークフロー構築",
    ],
  },
  {
    name: "Elio Chat",
    tagline: "完全オフラインAIチャット（iOS）",
    description:
      "iPhoneで完全オフライン動作するAIチャットアプリ。通信不要でプライバシーを完全保護。Core MLを活用した高速な応答を実現。Swift + SwiftUIで構築。",
    href: "https://elio.love",
    github: "",
    badge: "ACTIVE",
    status: "beta" as const,
    lastUpdate: "2025-02-12",
    features: [
      "完全オフライン動作",
      "プライバシー完全保護",
      "Core ML高速処理",
      "音声認識対応",
    ],
  },
  {
    name: "News.cloud",
    tagline: "News APIプラットフォーム",
    description:
      "開発者向けリアルタイムニュースAPIプラットフォーム。215+ RSS feedsからAIが自動収集・配信。高速Rust実装で低レイテンシーを実現。",
    href: "https://news.cloud",
    github: "https://github.com/yukihamada/hypernews",
    badge: "ACTIVE",
    status: "passing" as const,
    lastUpdate: "2025-02-15",
    features: [
      "リアルタイムニュースAPI",
      "215+ RSS feeds対応",
      "AI自動分類・要約",
      "Rust高速実装",
    ],
  },
  {
    name: "ChatNews.link",
    tagline: "AIニュース解説プラットフォーム",
    description:
      "AIがニュースを要約・解説するプラットフォーム。複雑なニュースをわかりやすく解説し、背景情報や関連情報を自動で補足。時事問題の理解を深めるための学習ツールとしても活用可能。",
    href: "https://chatnews.link",
    github: "https://github.com/yukihamada",
    badge: "ACTIVE",
    status: "beta" as const,
    lastUpdate: "2025-02-15",
    features: [
      "AIによるニュース要約",
      "わかりやすい解説",
      "背景情報の自動補足",
      "時事問題学習ツール",
    ],
  },
  {
    name: "SOLUNA",
    tagline: "リアルイベントプラットフォーム",
    description:
      "ハワイ発のリアルイベントプラットフォーム。ZAMNA.hawaiiを運営し、音楽・アート・カルチャーを融合した体験型イベントを提供。コミュニティ主導の持続可能なイベント運営を実現。",
    href: "https://solun.art",
    github: "",
    badge: "ACTIVE",
    status: "passing" as const,
    lastUpdate: "2025-02-15",
    features: [
      "ZAMNA.hawaii運営",
      "音楽・アート・カルチャー融合",
      "体験型イベント",
      "コミュニティ主導",
    ],
  },
  {
    name: "Enabler",
    tagline: "プレミアムライフスタイルサービス",
    description:
      "世界中で上質な日常生活を実現するライフスタイルサービス。宿泊・移動・体験を統合し、シームレスな旅行体験を提供。会員制コミュニティで特別な体験を共有。",
    href: "https://enabler.fun",
    github: "",
    badge: "ACTIVE",
    status: "beta" as const,
    lastUpdate: "2025-02-13",
    features: [
      "統合ライフスタイルサービス",
      "シームレスな旅行体験",
      "会員制コミュニティ",
      "特別な体験共有",
    ],
  },
];

const saveJapanProducts = [
  {
    name: "Security Scanner",
    tagline: "無料Webセキュリティ診断ツール",
    description:
      "Webサイトのセキュリティを無料で自動スキャンするツール。8種類以上のセキュリティヘッダー（CSP, HSTS, X-Frame-Options等）、HTTPS/SSL証明書、DNS設定を包括的にチェック。A-Fのグレードで評価し、具体的な改善提案を提供します。Proプランでは継続的モニタリングにも対応。",
    href: "https://chatnews.tech",
    github: "https://github.com/yukihamada",
    status: "passing" as const,
    lastUpdate: "2025-02-09",
    features: [
      "8種類以上のセキュリティヘッダーチェック",
      "HTTPS / SSL証明書の検証",
      "A-Fグレードによる評価",
      "Proプランで継続的モニタリング",
    ],
  },
  {
    name: "PhishGuard",
    tagline: "従業員フィッシング訓練プラットフォーム",
    description:
      "組織向けのフィッシング訓練プラットフォーム。リアルなフィッシングシミュレーションを通じて従業員のセキュリティ意識を向上させます。クリック率・報告率の分析レポート、コンプライアンス対応の文書生成機能を搭載。",
    href: "https://enabler.cc",
    github: "https://github.com/yukihamada",
    status: "passing" as const,
    lastUpdate: "2025-02-07",
    features: [
      "リアルなフィッシングシミュレーション",
      "クリック率・報告率の分析",
      "コンプライアンス文書の生成",
      "組織全体のセキュリティ意識向上",
    ],
  },
  {
    name: "DojoC",
    tagline: "サイバーセキュリティ学習プラットフォーム",
    description:
      "専門家監修のサイバーセキュリティ学習プラットフォーム。基礎から実践まで段階的に学べるコース、ハンズオンのCTF（Capture The Flag）チャレンジ、プロフェッショナル認定証の発行を提供。実践的なスキルを身につけたい方に最適。",
    href: "https://www.dojoc.io",
    github: "https://github.com/yukihamada",
    status: "passing" as const,
    lastUpdate: "2025-02-11",
    features: [
      "専門家監修のセキュリティコース",
      "実践的なCTFチャレンジ",
      "ハンズオン技術演習",
      "プロフェッショナル認定証",
    ],
  },
];

function CIBadge({ status }: { status: "passing" | "beta" | "failing" }) {
  const styles = {
    passing: { bg: "bg-[#00ff00]/10", text: "text-[#00ff00]", border: "border-[#00ff00]/30", label: "passing" },
    beta: { bg: "bg-[#ffaa00]/10", text: "text-[#ffaa00]", border: "border-[#ffaa00]/30", label: "beta" },
    failing: { bg: "bg-[#ff3333]/10", text: "text-[#ff3333]", border: "border-[#ff3333]/30", label: "failing" },
  };
  const s = styles[status];
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 ${s.bg} ${s.text} border ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === "passing" ? "bg-[#00ff00]" : status === "beta" ? "bg-[#ffaa00] animate-pulse" : "bg-[#ff3333]"}`} />
      build: {s.label}
    </span>
  );
}

export default function ProjectsPage() {
  return (
    <div className="grid-bg">
      {/* Hero */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-box p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1a3a1a]">
              <span className="text-[#555] text-xs">enablerdao@web3:~/projects$</span>
              <span className="text-[#00ff00] text-xs">tree -L 2</span>
            </div>

            {/* Tree output */}
            <pre className="text-xs leading-relaxed">
              <span className="text-[#00ff00]">.</span>
              {"\n"}
              <span className="text-[#555]">{"├── "}</span>
              <span className="text-[#00ffff]">README.md</span>
              <span className="text-[#555]">  # EnablerDAO プロジェクト一覧</span>
              {"\n"}
              <span className="text-[#555]">{"├── "}</span>
              <span className="text-[#00ffff]">chatweb.ai/</span>
              <span className="text-[#555]">  # AI駆動のWeb自動化</span>
              {"\n"}
              <span className="text-[#555]">{"│   ├── "}</span>
              <span className="text-[#888]">src/</span>
              {"\n"}
              <span className="text-[#555]">{"│   └── "}</span>
              <span className="text-[#888]">package.json</span>
              {"\n"}
              <span className="text-[#555]">{"├── "}</span>
              <span className="text-[#00ffff]">eliochat/</span>
              <span className="text-[#555]">  # 完全オフラインAIチャット</span>
              {"\n"}
              <span className="text-[#555]">{"│   ├── "}</span>
              <span className="text-[#888]">src/</span>
              {"\n"}
              <span className="text-[#555]">{"│   └── "}</span>
              <span className="text-[#888]">Elio.xcodeproj</span>
              {"\n"}
              <span className="text-[#555]">{"├── "}</span>
              <span className="text-[#00ffff]">news.cloud/</span>
              <span className="text-[#555]">  # News APIプラットフォーム</span>
              {"\n"}
              <span className="text-[#555]">{"│   ├── "}</span>
              <span className="text-[#888]">src/</span>
              {"\n"}
              <span className="text-[#555]">{"│   └── "}</span>
              <span className="text-[#888]">Cargo.toml</span>
              {"\n"}
              <span className="text-[#555]">{"└── "}</span>
              <span className="text-[#00ffff]">savejapan/</span>
              <span className="text-[#555]">  # サイバーセキュリティスイート</span>
              {"\n"}
              <span className="text-[#555]">{"    ├── "}</span>
              <span className="text-[#888]">security-scanner/</span>
              {"\n"}
              <span className="text-[#555]">{"    ├── "}</span>
              <span className="text-[#888]">phishguard/</span>
              {"\n"}
              <span className="text-[#555]">{"    └── "}</span>
              <span className="text-[#888]">dojoc/</span>
            </pre>
            <p className="text-[#555] text-xs mt-2">
              3 directories, 5 projects
            </p>
          </div>
        </div>
      </section>

      {/* Main Projects */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#555] text-xs mb-4">
            <span className="text-[#00aa00]">$ </span>
            cat ./*/README.md
          </p>

          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.name}
                className="terminal-box p-4 sm:p-6 card-hover"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-[#00ff00] text-sm">
                        # {project.name}
                      </span>
                      {project.badge === "ACTIVE" && (
                        <span className="text-[10px] px-2 py-0.5 bg-[#00ff00]/10 text-[#00ff00] border border-[#00ff00]/30">
                          ACTIVE
                        </span>
                      )}
                      {project.badge === "DEV" && (
                        <span className="text-[10px] px-2 py-0.5 bg-[#ffaa00]/10 text-[#ffaa00] border border-[#ffaa00]/30">
                          DEV
                        </span>
                      )}
                      <CIBadge status={project.status} />
                    </div>
                    <p className="text-[#00ffff] text-xs mb-2">{project.tagline}</p>
                    <p className="text-[#666] text-xs leading-relaxed mb-4">
                      {project.description}
                    </p>

                    {/* Stats as key-value */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4 text-xs">
                      <span>
                        <span className="text-[#555]">status:</span>{" "}
                        <span className="text-[#00ffff]">{project.badge === "ACTIVE" ? "active" : "development"}</span>
                      </span>
                      <span>
                        <span className="text-[#555]">updated:</span>{" "}
                        <span className="text-[#888]">{project.lastUpdate}</span>
                      </span>
                      <span>
                        <span className="text-[#555]">license:</span>{" "}
                        <span className="text-[#888]">MIT</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {project.href !== "#" && (
                        <a
                          href={project.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#00ff00]/10 border border-[#00ff00]/30 text-[#00ff00] text-xs hover:bg-[#00ff00]/20 transition-colors"
                        >
                          $ open {project.href}
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#111] border border-[#1a3a1a] text-[#888] text-xs hover:text-[#00ff00] hover:border-[#00ff00]/30 transition-colors"
                        >
                          $ git clone -- GitHub
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Features as checklist */}
                  <div className="lg:w-64 flex-shrink-0">
                    <p className="text-[#555] text-[10px] uppercase tracking-wider mb-2">
                      ## Features
                    </p>
                    <ul className="space-y-1">
                      {project.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-xs">
                          <span className="text-[#00ff00] flex-shrink-0">[x]</span>
                          <span className="text-[#888]">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EnablerDAO Security Suite */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#555] text-xs mb-1">
            <span className="text-[#00aa00]">$ </span>
            ls -la ./savejapan/
          </p>
          <p className="text-[#aa66ff] text-xs mb-4">
            <span className="text-[#555]">[</span>
            <span className="text-[#aa66ff]">SUITE</span>
            <span className="text-[#555]">]</span>
            <span className="text-[#888]"> EnablerDAO Security Security Suite -- サイバーセキュリティツール群</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {saveJapanProducts.map((product) => (
              <div
                key={product.name}
                className="terminal-box p-4 card-hover"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#aa66ff] text-xs">
                    {product.name}
                  </span>
                  <CIBadge status={product.status} />
                </div>
                <p className="text-[#00ffff] text-[10px] mb-2">{product.tagline}</p>
                <p className="text-[#555] text-xs mb-3 leading-relaxed">{product.description}</p>

                {/* Features */}
                {product.features && (
                  <div className="space-y-1 mb-3">
                    {product.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2 text-[10px]">
                        <span className="text-[#aa66ff] flex-shrink-0">[+]</span>
                        <span className="text-[#666]">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Links */}
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#1a3a1a] text-[10px]">
                  <a
                    href={product.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00ff00] hover:text-[#33ff33] transition-colors"
                  >
                    {`>`} サイトを開く
                  </a>
                  {product.github && (
                    <>
                      <span className="text-[#333]">|</span>
                      <a
                        href={product.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#888] hover:text-[#00ff00] transition-colors"
                      >
                        GitHub
                      </a>
                    </>
                  )}
                  <span className="text-[#333]">|</span>
                  <span className="text-[#555]">updated: {product.lastUpdate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contribute CTA */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-box p-4 sm:p-6 text-center">
            <pre className="text-[#00ff00] text-xs mb-4 text-glow">
{`  +--------------------------+
  |  git commit -m "contrib" |
  |  git push origin main    |
  +--------------------------+`}
            </pre>
            <p className="text-[#666] text-xs mb-4">
              {`// すべてのプロジェクトはオープンソースです`}
              <br />
              {`// コード、バグ報告、機能リクエスト、なんでも歓迎`}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://github.com/yukihamada"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2 bg-[#00ff00]/10 border border-[#00ff00]/30 text-[#00ff00] text-xs hover:bg-[#00ff00]/20 transition-colors"
              >
                $ git clone enablerdao && make contribute
              </a>
              <Link
                href="/token"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2 bg-[#111] border border-[#1a3a1a] text-[#888] text-xs hover:text-[#00ff00] hover:border-[#00ff00]/30 transition-colors"
              >
                $ cat REWARDS.md
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
