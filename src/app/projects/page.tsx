import type { Metadata } from "next";
import Link from "next/link";
import NewsletterCTA from "@/components/NewsletterCTA";

export const metadata: Metadata = {
  title: "プロジェクト一覧",
  description:
    "EnablerDAOが展開するプロジェクト一覧。StayFlow、Chatweb.ai、JitsuFlowなど、SaaS・AI・データベースでイノベーションを加速。",
  openGraph: {
    title: "プロジェクト一覧 | EnablerDAO",
    description:
      "StayFlow、Chatweb.ai、JitsuFlowなど、EnablerDAOのプロジェクト群。すべてオープンソース。",
  },
};

const flagshipProjects = [
  {
    name: "StayFlow",
    tagline: "民泊・宿泊施設の運営管理SaaS",
    description:
      "宿泊施設の予約・清掃・チェックインを一元管理。日本唯一の「無料 x AI x 日本語」民泊管理ソリューション。Stripe連携で決済も対応。Supabase + React + Viteで構築。",
    href: "https://stayflowapp.com",
    github: "",
    badge: "ACTIVE" as const,
    status: "passing" as const,
    lastUpdate: "2026-02-24",
    color: "#00ff00",
    metrics: [
      { label: "UV/月", value: "1,860" },
      { label: "導入施設", value: "500+" },
      { label: "Edge Functions", value: "43" },
      { label: "満足度", value: "4.9/5" },
    ],
    features: [
      "予約・清掃・チェックイン自動化",
      "AI自動返信・多言語対応",
      "Stripe決済連携",
      "42 Supabase Edge Functions",
    ],
  },
  {
    name: "Chatweb.ai",
    tagline: "マルチモデルAIエージェント",
    description:
      "LINE・Telegram・Webから使えるAIチャットエージェント。Web検索、コード実行、ファイル操作などのツールを統合。Rust製AWS Lambda、14+チャネル統合。",
    href: "https://chatweb.ai",
    github: "https://github.com/yukihamada/nanobot",
    badge: "ACTIVE" as const,
    status: "passing" as const,
    lastUpdate: "2026-02-24",
    color: "#ffaa00",
    metrics: [
      { label: "req/日", value: "30K+" },
      { label: "ユーザー", value: "210" },
      { label: "uptime", value: "99.99%" },
      { label: "Lambda ver", value: "v275" },
    ],
    features: [
      "マルチモデル (Claude, GPT-4o, Gemini)",
      "Web検索・コード実行・ファイル操作",
      "LINE / Telegram / Web対応",
      "STT/TTS 音声認識・合成",
    ],
  },
  {
    name: "JitsuFlow",
    tagline: "ブラジリアン柔術 総合プラットフォーム",
    description:
      "世界最大級のBJJ(ブラジリアン柔術)データベース。選手・道場・大会・会場のデータを一元管理。Rust SSRで高速レスポンス。",
    href: "https://jiuflow.art",
    github: "",
    badge: "ACTIVE" as const,
    status: "passing" as const,
    lastUpdate: "2026-02-24",
    color: "#4488ff",
    metrics: [
      { label: "選手", value: "355" },
      { label: "道場", value: "227" },
      { label: "大会", value: "229" },
      { label: "会場", value: "130" },
    ],
    features: [
      "選手データベース (355人)",
      "道場検索 (227件)",
      "大会カレンダー",
      "Rust SSR / Fly.io",
    ],
  },
];

const otherProjects = [
  {
    name: "Elio Chat",
    tagline: "完全オフラインAIチャット（iOS）",
    description:
      "iPhoneで完全オフライン動作するAIチャットアプリ。通信不要でプライバシーを完全保護。Core MLを活用した高速な応答を実現。",
    href: "https://elio.love",
    github: "",
    badge: "ACTIVE" as const,
    status: "beta" as const,
    lastUpdate: "2026-02-12",
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
      "開発者向けリアルタイムニュースAPIプラットフォーム。215+ RSS feedsからAIが自動収集・配信。高速Rust実装。",
    href: "https://news.cloud",
    github: "https://github.com/yukihamada/hypernews",
    badge: "ACTIVE" as const,
    status: "passing" as const,
    lastUpdate: "2026-02-15",
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
      "AIがニュースを要約・解説するプラットフォーム。複雑なニュースをわかりやすく解説し、背景情報を自動補足。",
    href: "https://chatnews.link",
    github: "https://github.com/yukihamada",
    badge: "ACTIVE" as const,
    status: "beta" as const,
    lastUpdate: "2026-02-15",
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
      "ハワイ発のリアルイベントプラットフォーム。ZAMNA.hawaiiを運営し、音楽・アート・カルチャーを融合した体験型イベントを提供。",
    href: "https://solun.art",
    github: "",
    badge: "ACTIVE" as const,
    status: "passing" as const,
    lastUpdate: "2026-02-15",
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
      "世界中で上質な日常生活を実現するライフスタイルサービス。宿泊・移動・体験を統合し、シームレスな旅行体験を提供。",
    href: "https://enabler.fun",
    github: "",
    badge: "ACTIVE" as const,
    status: "beta" as const,
    lastUpdate: "2026-02-13",
    features: [
      "統合ライフスタイルサービス",
      "シームレスな旅行体験",
      "会員制コミュニティ",
      "特別な体験共有",
    ],
  },
];

const securityProducts = [
  {
    name: "Security Scanner",
    tagline: "無料Webセキュリティ診断ツール",
    description:
      "Webサイトのセキュリティを無料で自動スキャン。8種類以上のセキュリティヘッダー、HTTPS/SSL証明書、DNS設定を包括的にチェック。A-Fのグレードで評価。",
    href: "https://chatnews.tech",
    github: "https://github.com/yukihamada",
    status: "passing" as const,
    lastUpdate: "2026-02-09",
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
      "組織向けのフィッシング訓練プラットフォーム。リアルなフィッシングシミュレーションを通じて従業員のセキュリティ意識を向上。",
    href: "https://enabler.cc",
    github: "https://github.com/yukihamada",
    status: "passing" as const,
    lastUpdate: "2026-02-07",
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
      "専門家監修のサイバーセキュリティ学習プラットフォーム。基礎から実践まで段階的に学べるコースとCTFチャレンジを提供。",
    href: "https://www.dojoc.io",
    github: "https://github.com/yukihamada",
    status: "passing" as const,
    lastUpdate: "2026-02-11",
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

            <h1 className="text-[#00ff00] text-xl sm:text-2xl mb-3 text-glow">
              プロジェクト一覧
            </h1>
            <p className="text-[#888] text-sm leading-relaxed mb-4">
              EnablerDAOが展開するすべてのプロジェクト。
              <span className="text-[#00ffff]">すべてオープンソース</span>で、
              誰でも利用・貢献できます。
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-[#00ff00] rounded-full"></div>
                <span className="text-[#888]"><span className="text-[#00ff00]">3</span> Flagship</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-[#00ffff] rounded-full"></div>
                <span className="text-[#888]"><span className="text-[#00ffff]">5</span> Other Products</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-[#aa66ff] rounded-full"></div>
                <span className="text-[#888]"><span className="text-[#aa66ff]">3</span> Security Suite</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flagship Projects */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#555] text-xs mb-1">
            <span className="text-[#00aa00]">$ </span>
            cat ./flagship/*/README.md
          </p>
          <h2 className="text-[#00ff00] text-sm mb-4">
            Flagship Products -- 収益化フェーズ
          </h2>

          <div className="space-y-4">
            {flagshipProjects.map((project) => (
              <div
                key={project.name}
                className="terminal-box p-4 sm:p-6 card-hover"
                style={{ borderColor: `${project.color}20` }}
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-sm font-bold" style={{ color: project.color }}>
                        # {project.name}
                      </span>
                      <span
                        className="text-[10px] px-2 py-0.5 border"
                        style={{
                          borderColor: `${project.color}40`,
                          color: project.color,
                          backgroundColor: `${project.color}10`,
                        }}
                      >
                        FLAGSHIP
                      </span>
                      <CIBadge status={project.status} />
                    </div>
                    <p className="text-[#00ffff] text-xs mb-2">{project.tagline}</p>
                    <p className="text-[#666] text-xs leading-relaxed mb-4">
                      {project.description}
                    </p>

                    {/* Metrics grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                      {project.metrics.map((m) => (
                        <div key={m.label} className="border border-[#1a3a1a] p-2 text-center">
                          <div className="font-bold text-sm" style={{ color: project.color }}>
                            {m.value}
                          </div>
                          <div className="text-[10px] text-[#555]">{m.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Stats as key-value */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4 text-xs">
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
                          className="inline-flex items-center gap-2 px-4 py-1.5 border text-xs hover:opacity-80 transition-colors"
                          style={{
                            backgroundColor: `${project.color}10`,
                            borderColor: `${project.color}30`,
                            color: project.color,
                          }}
                        >
                          $ open {project.href.replace("https://", "")}
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
                          <span className="flex-shrink-0" style={{ color: project.color }}>[x]</span>
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

      {/* Other Projects */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#555] text-xs mb-1">
            <span className="text-[#00aa00]">$ </span>
            cat ./other/*/README.md
          </p>
          <h2 className="text-[#00ffff] text-sm mb-4">
            Other Products
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {otherProjects.map((project) => (
              <div
                key={project.name}
                className="terminal-box p-4 card-hover"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[#00ffff] text-xs font-bold">
                      {project.name}
                    </span>
                    <CIBadge status={project.status} />
                  </div>
                </div>
                <p className="text-[#888] text-[10px] mb-2">{project.tagline}</p>
                <p className="text-[#555] text-xs mb-3 leading-relaxed line-clamp-2">{project.description}</p>

                <ul className="space-y-1 mb-3">
                  {project.features.slice(0, 3).map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-[10px]">
                      <span className="text-[#00ffff] flex-shrink-0">[x]</span>
                      <span className="text-[#666]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#1a3a1a] text-[10px]">
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00ff00] hover:text-[#33ff33] transition-colors"
                  >
                    {`>`} open
                  </a>
                  {project.github && (
                    <>
                      <span className="text-[#333]">|</span>
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#888] hover:text-[#00ff00] transition-colors"
                      >
                        GitHub
                      </a>
                    </>
                  )}
                  <span className="text-[#333]">|</span>
                  <span className="text-[#555]">updated: {project.lastUpdate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Suite */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#555] text-xs mb-1">
            <span className="text-[#00aa00]">$ </span>
            ls -la ./security-suite/
          </p>
          <p className="text-[#aa66ff] text-xs mb-4">
            <span className="text-[#555]">[</span>
            <span className="text-[#aa66ff]">SUITE</span>
            <span className="text-[#555]">]</span>
            <span className="text-[#888]"> Security Suite -- サイバーセキュリティツール群</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {securityProducts.map((product) => (
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

                <div className="space-y-1 mb-3">
                  {product.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2 text-[10px]">
                      <span className="text-[#aa66ff] flex-shrink-0">[+]</span>
                      <span className="text-[#666]">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#1a3a1a] text-[10px]">
                  <a
                    href={product.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00ff00] hover:text-[#33ff33] transition-colors"
                  >
                    {`>`} open
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

      {/* Newsletter */}
      <NewsletterCTA />

      {/* Contribute CTA */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-box p-4 sm:p-6 text-center">
            <h2 className="text-[#00ff00] text-lg mb-3 text-glow">
              一緒に作りませんか？
            </h2>
            <p className="text-[#666] text-xs mb-4">
              {`// すべてのプロジェクトはオープンソースです`}
              <br />
              {`// コード、バグ報告、機能リクエスト、アイデア、なんでも歓迎`}
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
                href="/ideas"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2 bg-[#00ffff]/10 border border-[#00ffff]/30 text-[#00ffff] text-xs hover:bg-[#00ffff]/20 transition-colors"
              >
                $ submit --idea
              </Link>
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
