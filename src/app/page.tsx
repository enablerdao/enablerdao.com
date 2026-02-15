import Link from "next/link";
import NewsletterCTA from "@/components/NewsletterCTA";
import ProductCTACard from "@/components/ProductCTACard";
import CopyButton from "@/components/CopyButton";

const asciiLogo = `
 ███████╗███╗   ██╗ █████╗ ██████╗ ██╗     ███████╗██████╗
 ██╔════╝████╗  ██║██╔══██╗██╔══██╗██║     ██╔════╝██╔══██╗
 █████╗  ██╔██╗ ██║███████║██████╔╝██║     █████╗  ██████╔╝
 ██╔══╝  ██║╚██╗██║██╔══██║██╔══██╗██║     ██╔══╝  ██╔══██╗
 ███████╗██║ ╚████║██║  ██║██████╔╝███████╗███████╗██║  ██║
 ╚══════╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝
                   ██████╗  █████╗  ██████╗
                   ██╔══██╗██╔══██╗██╔═══██╗
                   ██║  ██║███████║██║   ██║
                   ██║  ██║██╔══██║██║   ██║
                   ██████╔╝██║  ██║╚██████╔╝
                   ╚═════╝ ╚═╝  ╚═╝ ╚═════╝`;

const roadmap = [
  {
    hash: "a1b2c3d",
    date: "2024-12",
    title: "EnablerDAO設立",
    description: "チームを結成し、最初のプロダクト開発をスタート",
    status: "merged",
  },
  {
    hash: "e4f5g6h",
    date: "2025-Q1",
    title: "セキュリティツール3つをリリース",
    description: "Webサイト診断・フィッシング訓練・学習プラットフォームを公開",
    status: "merged",
  },
  {
    hash: "i7j8k9l",
    date: "2025-Q2",
    title: "セキュリティ強化",
    description: "自社サイトのセキュリティを最高レベルに引き上げ",
    status: "merged",
  },
  {
    hash: "m0n1o2p",
    date: "2025-Q3-Q4",
    title: "仲間を増やす",
    description: "みんなで方向性を決める仕組みを導入、参加者への報酬を開始",
    status: "merged",
  },
  {
    hash: "q3r4s5t",
    date: "2026-",
    title: "もっと大きく（いまここ）",
    description: "新しいプロジェクトを立ち上げ、より多くの人が参加できる組織へ",
    status: "HEAD",
  },
];

export default function Home() {
  return (
    <div className="grid-bg">
      {/* ===== Hero Section ===== */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-box p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1a3a1a]">
              <span className="text-[#555] text-xs">enablerdao:~$</span>
              <span className="text-[#00ff00] text-xs animate-pulse">_</span>
            </div>

            {/* ASCII Art Logo */}
            <pre className="text-[#00ff00] text-[6px] sm:text-[8px] md:text-[10px] leading-tight mb-6 overflow-x-auto text-glow select-none">
              {asciiLogo}
            </pre>

            {/* わかりやすいキャッチコピー */}
            <div className="mb-6">
              <h1 className="text-[#00ff00] text-xl sm:text-2xl mb-3 text-glow">
                みんなで作る、みんなのためのソフトウェア
              </h1>
              <p className="text-[#888] text-sm sm:text-base leading-relaxed">
                EnablerDAOは、インターネットをもっと安全にするための
                <span className="text-[#00ffff]">無料ツール</span>を開発しているチームです。
              </p>
              <p className="text-[#888] text-sm sm:text-base leading-relaxed mt-2">
                会社ではなく「DAO（ダオ）」という形で運営しています。
                <br className="hidden sm:block" />
                <span className="text-[#ffaa00]">誰でも参加でき、みんなで方向性を決める</span>オープンな組織です。
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Link
                href="#products"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#00ff00]/10 border border-[#00ff00]/30 text-[#00ff00] text-sm hover:bg-[#00ff00]/20 transition-colors"
              >
                無料で始める
              </Link>
              <Link
                href="/status"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#111] border border-[#1a3a1a] text-[#888] text-sm hover:text-[#00ffff] hover:border-[#00ffff]/30 transition-colors"
              >
                Project Status
              </Link>
              <a
                href="https://github.com/yukihamada"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#111] border border-[#1a3a1a] text-[#888] text-sm hover:text-[#00ff00] hover:border-[#00ff00]/30 transition-colors"
              >
                GitHubを見る
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#00ff00] rounded-full animate-pulse"></div>
                <span className="text-[#888]"><span className="text-[#00ff00]">12</span>製品</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#00ffff] rounded-full"></div>
                <span className="text-[#888]"><span className="text-[#00ffff]">6,000+</span>ユーザー</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#ffaa00] rounded-full"></div>
                <span className="text-[#888]"><span className="text-[#ffaa00]">28</span>貢献者</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#aa66ff] rounded-full"></div>
                <span className="text-[#888]"><span className="text-[#aa66ff]">2,840+</span>コミット</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DAOってなに？ セクション ===== */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-box p-4 sm:p-6">
            <h2 className="text-[#00ff00] text-lg sm:text-xl mb-4 text-glow">
              DAOってなに？
            </h2>

            <div className="space-y-4">
              <div className="border-l-2 border-[#00ff00]/30 pl-4">
                <p className="text-[#888] text-sm leading-relaxed">
                  DAOは「<span className="text-[#00ffff]">みんなで運営する組織</span>」のことです。
                </p>
                <p className="text-[#888] text-sm leading-relaxed mt-2">
                  普通の会社は社長が決めますが、DAOでは<span className="text-[#00ff00]">メンバー全員の投票</span>で決めます。
                  学校のクラス会議のように、一人ひとりが意見を出せて、多数決で決まる仕組みです。
                </p>
              </div>

              {/* 比較表 */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-[#1a3a1a]">
                      <th className="text-left py-2 text-[#555] font-normal"></th>
                      <th className="text-left py-2 text-[#888] font-normal px-3">普通の会社</th>
                      <th className="text-left py-2 text-[#00ff00] font-normal px-3">DAO（EnablerDAO）</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#0d1f0d]">
                      <td className="py-2 text-[#00ffff]">決め方</td>
                      <td className="py-2 text-[#555] px-3">社長・役員が決める</td>
                      <td className="py-2 text-[#888] px-3">メンバーの投票で決める</td>
                    </tr>
                    <tr className="border-b border-[#0d1f0d]">
                      <td className="py-2 text-[#00ffff]">お金の流れ</td>
                      <td className="py-2 text-[#555] px-3">見えない</td>
                      <td className="py-2 text-[#888] px-3">全員に公開</td>
                    </tr>
                    <tr className="border-b border-[#0d1f0d]">
                      <td className="py-2 text-[#00ffff]">参加方法</td>
                      <td className="py-2 text-[#555] px-3">採用面接が必要</td>
                      <td className="py-2 text-[#888] px-3">誰でもすぐ参加できる</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-[#00ffff]">成果物</td>
                      <td className="py-2 text-[#555] px-3">会社のもの</td>
                      <td className="py-2 text-[#888] px-3">みんなのもの（無料公開）</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 私たちが作っているもの ===== */}
      <section id="products" className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-[#00ff00] text-lg sm:text-xl mb-2 text-glow">
            私たちが作っているもの
          </h2>
          <p className="text-[#555] text-xs mb-6">
            月間100アクセス以上のアクティブなプロダクト
          </p>

          {/* AI & テクノロジー */}
          <h3 className="text-[#00ffff] text-sm mb-3">AI & テクノロジー</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            <ProductCTACard
              name="Chatweb.ai"
              href="https://chatweb.ai"
              color="#ffaa00"
              access="289"
              desc="音声やテキストで指示するだけで、AIがWeb操作を自動化。LINE・Telegramでも使えます。"
              tag="AI"
              price="$9/月"
              users="1,200+"
              trial={true}
            />
            <ProductCTACard
              name="Elio Chat"
              href="https://elio.love"
              color="#aa66ff"
              access="506"
              desc="iPhoneで完全オフライン動作するAIチャットアプリ。通信不要で使えます。"
              tag="AI"
              users="500+"
              trial={true}
            />
            <ProductCTACard
              name="News.xyz"
              href="https://news.xyz"
              color="#00ffff"
              access="506"
              desc="AIがニュースを自動収集・配信。複数テーマから好みの記事を読めます。"
              tag="メディア"
              price="Free"
              users="600+"
              trial={false}
            />
            <ProductCTACard
              name="News.cloud"
              href="https://news.cloud"
              color="#60a5fa"
              access="892"
              desc="News APIプラットフォーム。リアルタイムニュースデータを開発者向けに提供。"
              tag="API"
              price="Free"
              users="300+"
              trial={false}
            />
            <ProductCTACard
              name="ChatNews.link"
              href="https://chatnews.link"
              color="#00ffaa"
              access="95"
              desc="AIがニュースをわかりやすく要約・解説。時事問題の理解を深めるAIアシスタント。"
              tag="AI"
              price="Free"
              users="200+"
              trial={false}
            />
          </div>

          {/* ビジネスツール */}
          <h3 className="text-[#ffaa00] text-sm mb-3">ビジネスツール</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {[
              { name: "StayFlow", href: "https://stayflowapp.com", color: "#00ff00", access: "1.84k", desc: "民泊・宿泊施設の運営を一元管理。予約・清掃・チェックインを効率化します。", tag: "SaaS" },
              { name: "BANTO", href: "https://banto.work", color: "#ffaa00", access: "186", desc: "建設業者向けの請求書・見積書管理アプリ。面倒な事務作業を簡単に。", tag: "SaaS" },
              { name: "Totonos", href: "https://totonos.jp", color: "#00ffff", access: "103", desc: "企業の財務業務を自動化する次世代プラットフォーム。", tag: "SaaS" },
              { name: "VOLT", href: "https://volt.tokyo", color: "#ff6688", access: "205", desc: "「買い物は、戦いだ」日本初のライブオークションプラットフォーム。", tag: "EC" },
              { name: "Enabler.cc", href: "https://enabler.cc", color: "#00ff00", access: "150", desc: "フィッシング詐欺を防止するセキュリティSaaS。URLの安全性を自動判定。", tag: "SaaS" },
            ].map((p) => (
              <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer" className="terminal-box p-4 card-hover block group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold" style={{ color: p.color }}>{p.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 border" style={{ color: p.color, borderColor: `${p.color}40` }}>{p.tag}</span>
                </div>
                <p className="text-[#888] text-xs leading-relaxed mb-2">{p.desc}</p>
                <span className="text-[#555] text-[10px]">{p.access} visits/mo</span>
              </a>
            ))}
          </div>

          {/* セキュリティ & 教育 */}
          <h3 className="text-[#00ff00] text-sm mb-3">セキュリティ & 教育</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {[
              { name: "Security Scanner", href: "https://chatnews.tech", color: "#00ff00", access: "113", desc: "URLを入れるだけでWebサイトの安全性をチェック。A〜Fで評価します。", tag: "無料" },
              { name: "DojoC", href: "https://www.dojoc.io", color: "#4488ff", access: "250", desc: "実践的なサイバーセキュリティトレーニングプラットフォーム。ハンズオンで学べます。", tag: "教育" },
            ].map((p) => (
              <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer" className="terminal-box p-4 card-hover block group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold" style={{ color: p.color }}>{p.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 border" style={{ color: p.color, borderColor: `${p.color}40` }}>{p.tag}</span>
                </div>
                <p className="text-[#888] text-xs leading-relaxed mb-2">{p.desc}</p>
                <span className="text-[#555] text-[10px]">{p.access} visits/mo</span>
              </a>
            ))}
          </div>

          {/* ライフスタイル & イベント */}
          <h3 className="text-[#ff6688] text-sm mb-3">ライフスタイル & イベント</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {[
              { name: "Enabler", href: "https://enabler.fun", color: "#aa66ff", access: "107", desc: "世界中で上質な日常生活を実現するライフスタイルサービス。", tag: "生活" },
              { name: "SOLUNA", href: "https://solun.art", color: "#ff6688", access: "892", desc: "ハワイ発のリアルイベントプラットフォーム。ZAMNA.hawaiiを運営。", tag: "イベント" },
            ].map((p) => (
              <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer" className="terminal-box p-4 card-hover block group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold" style={{ color: p.color }}>{p.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 border" style={{ color: p.color, borderColor: `${p.color}40` }}>{p.tag}</span>
                </div>
                <p className="text-[#888] text-xs leading-relaxed mb-2">{p.desc}</p>
                <span className="text-[#555] text-[10px]">{p.access} visits/mo</span>
              </a>
            ))}
          </div>

          {/* スポーツ & コミュニティ */}
          <h3 className="text-[#4488ff] text-sm mb-3">スポーツ & コミュニティ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { name: "JitsuFlow", href: "https://jitsuflow.app", color: "#4488ff", access: "1.31k", desc: "ブラジリアン柔術の練習記録・道場運営をスマートに管理するアプリ。", tag: "アプリ" },
            ].map((p) => (
              <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer" className="terminal-box p-4 card-hover block group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold" style={{ color: p.color }}>{p.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 border" style={{ color: p.color, borderColor: `${p.color}40` }}>{p.tag}</span>
                </div>
                <p className="text-[#888] text-xs leading-relaxed mb-2">{p.desc}</p>
                <span className="text-[#555] text-[10px]">{p.access} visits/mo</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DAOの仕組み（わかりやすく）===== */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-[#00ff00] text-lg sm:text-xl mb-6 text-glow">
            EnablerDAOの仕組み
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* みんなで決める */}
            <div className="terminal-box p-4 hover:border-[#00ff00]/30 transition-colors">
              <div className="text-2xl mb-2">1</div>
              <h3 className="text-[#00ff00] text-sm mb-2">みんなで決める</h3>
              <p className="text-[#888] text-xs leading-relaxed">
                「次に何を作るか」「予算をどう使うか」を、メンバー全員の投票で決めます。
                誰か一人の独断ではなく、みんなの意見が反映されます。
              </p>
            </div>

            {/* お金の流れが見える */}
            <div className="terminal-box p-4 hover:border-[#00ffff]/30 transition-colors">
              <div className="text-2xl mb-2">2</div>
              <h3 className="text-[#00ffff] text-sm mb-2">お金の流れが見える</h3>
              <p className="text-[#888] text-xs leading-relaxed">
                組織のお金の動きはすべて公開されています。
                誰がいくら使ったか、何に使われたかを誰でも確認できます。
              </p>
            </div>

            {/* 参加すると報酬がもらえる */}
            <div className="terminal-box p-4 hover:border-[#ffaa00]/30 transition-colors">
              <div className="text-2xl mb-2">3</div>
              <h3 className="text-[#ffaa00] text-sm mb-2">参加すると報酬がもらえる</h3>
              <p className="text-[#888] text-xs leading-relaxed">
                プログラムを書く、バグを見つける、文章を書くなど、
                プロジェクトに貢献するとEBRトークンがもらえます。
              </p>
            </div>

            {/* 新しいプロジェクトを提案できる */}
            <div className="terminal-box p-4 hover:border-[#aa66ff]/30 transition-colors">
              <div className="text-2xl mb-2">4</div>
              <h3 className="text-[#aa66ff] text-sm mb-2">新しいプロジェクトを提案できる</h3>
              <p className="text-[#888] text-xs leading-relaxed">
                「こんなツールがあったらいいな」というアイデアを誰でも提案できます。
                みんなの投票で採用が決まります。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 参加の3ステップ ===== */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-[#00ff00] text-lg sm:text-xl mb-6 text-glow">
            参加するには？
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="pixel-border bg-[#0d0d0d] p-5 hover:border-[#00aa00] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#1a3a1a] flex items-center justify-center text-[#00ff00] text-xl pixel-border-green">
                  1
                </div>
                <span className="text-[#00ff00] text-sm">まず使う</span>
              </div>
              <p className="text-[#888] text-xs leading-relaxed">
                無料ツールを使ってみる。
                <br/>Security Scanner、DojoC など
              </p>
            </div>

            <div className="pixel-border bg-[#0d0d0d] p-5 hover:border-[#00aa00] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#1a3a1a] flex items-center justify-center text-[#00ff00] text-xl pixel-border-green">
                  2
                </div>
                <span className="text-[#00ff00] text-sm">貢献する</span>
              </div>
              <p className="text-[#888] text-xs leading-relaxed">
                バグ報告、コード修正、ドキュメント作成など。
                <br/><span className="text-[#44ff88]">→ EBR獲得</span>
              </p>
            </div>

            <div className="pixel-border bg-[#0d0d0d] p-5 hover:border-[#00aa00] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#1a3a1a] flex items-center justify-center text-[#00ff00] text-xl pixel-border-green">
                  3
                </div>
                <span className="text-[#00ff00] text-sm">投票する</span>
              </div>
              <p className="text-[#888] text-xs leading-relaxed">
                EBRで次の方針を投票。
                <br/>Discord + Snapshot
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 開発に参加 ===== */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-box p-4 sm:p-6">
            <h2 className="text-[#00ff00] text-lg mb-4 text-glow">
              開発者向け — CLIツールで貢献開始
            </h2>

            <p className="text-[#888] text-sm mb-4">
              EnablerDAO CLIをインストールすると、プロジェクトの探索、コード修正、PR作成まで
              <span className="text-[#00ffff]">一気通貫で実行</span>できます。
            </p>

            <div className="mb-4">
              <p className="text-[#555] text-xs mb-2">1行でインストール:</p>
              <div className="bg-[#0d0d0d] border border-[#1a3a1a] p-3 mb-2">
                <code className="text-[#44ff88] text-xs">curl -fsSL https://enablerdao.com/install.sh | bash</code>
              </div>
              <CopyButton text="curl -fsSL https://enablerdao.com/install.sh | bash" />
            </div>

            <div className="border-t border-[#1a3a1a] pt-4 mt-4">
              <p className="text-[#555] text-xs mb-2">インストール後の使い方:</p>
              <pre className="text-[#888] text-xs overflow-x-auto">
<span className="text-[#44ff88]">$ enablerdao projects</span>          <span className="text-[#555]"># 全プロジェクト一覧</span>
<span className="text-[#44ff88]">$ enablerdao work &lt;repo&gt;</span>        <span className="text-[#555]"># Fork→Clone→開発開始</span>
<span className="text-[#44ff88]">$ enablerdao pr &lt;repo&gt;</span>          <span className="text-[#555]"># コミット→PR作成</span>
              </pre>
            </div>

            <p className="text-[#666] text-xs mt-4">
              <span className="text-[#00ff00]">✓</span> プロジェクト探索
              <span className="text-[#555] mx-2">→</span>
              <span className="text-[#00ff00]">✓</span> 自動Fork/Clone
              <span className="text-[#555] mx-2">→</span>
              <span className="text-[#00ff00]">✓</span> コード修正
              <span className="text-[#555] mx-2">→</span>
              <span className="text-[#00ff00]">✓</span> PR作成
              <span className="text-[#555] mx-2">→</span>
              <span className="text-[#00ff00]">✓</span> EBR獲得
            </p>
          </div>
        </div>
      </section>

      {/* ===== EBRトークンとは ===== */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-box p-4 sm:p-6">
            <h2 className="text-[#00ff00] text-lg mb-6 text-glow">EBRトークン詳細</h2>

            <p className="text-[#888] text-sm mb-4">
              貢献度に応じて配布される<span className="text-[#00ffff]">ガバナンストークン</span>
            </p>

            {/* EBR獲得・使用 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="border border-[#1a1a1a] p-3">
                <h3 className="text-[#00ffff] text-xs mb-2">獲得方法</h3>
                <div className="text-[#888] text-xs space-y-1">
                  <p>コード: <span className="text-[#44ff88]">100-1000</span></p>
                  <p>バグ報告: <span className="text-[#44ff88]">50-500</span></p>
                  <p>ドキュメント: <span className="text-[#44ff88]">10-200</span></p>
                  <p>コミュニティ: <span className="text-[#44ff88]">5-500</span></p>
                </div>
              </div>

              <div className="border border-[#1a1a1a] p-3">
                <h3 className="text-[#ffaa00] text-xs mb-2">使い道</h3>
                <div className="text-[#888] text-xs space-y-1">
                  <p>• 提案への投票</p>
                  <p>• プロジェクト提案 (1000+)</p>
                  <p>• ステーキング報酬（準備中）</p>
                </div>
              </div>
            </div>

            <p className="text-[#666] text-xs">
              ※ EBRは投資商品ではなく、ガバナンス参加用トークンです
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-[#1a3a1a]">
              <Link
                href="/token"
                className="inline-flex items-center gap-2 text-[#00ff00] text-sm hover:text-[#33ff33] transition-colors"
              >
                EBRトークンの詳細
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <a
                href="https://solscan.io/token/E1JxwaWRd8nw8vDdWMdqwdbXGBshqDcnTcinHzNMqg2Y"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#00ffff] text-xs hover:text-[#33ffff] transition-colors"
              >
                Solscanで確認
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DAO運営システム ===== */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-box p-4 sm:p-6">
            <h2 className="text-[#aa66ff] text-lg mb-4 text-glow">
              DAO運営の仕組み
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border border-[#1a1a1a] p-3">
                <h3 className="text-[#00ff00] text-sm mb-2">投票で決める</h3>
                <p className="text-[#888] text-xs">EBRトークン保有者が提案・投票。多数決で方針を決定</p>
              </div>
              <div className="border border-[#1a1a1a] p-3">
                <h3 className="text-[#00ffff] text-sm mb-2">報酬を分配</h3>
                <p className="text-[#888] text-xs">貢献度に応じて自動的にEBRを配布。透明性100%</p>
              </div>
            </div>

            <div className="mt-4 p-3 border border-[#aa66ff]/20 bg-[#0d0a0f]">
              <p className="text-[#666] text-xs">
                <span className="text-[#aa66ff]">参考:</span> ELSOUL LABOのDAO運営モデルを採用
                <a
                  href="https://labo.elsoul.nl/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#aa66ff] hover:text-[#cc88ff] ml-2"
                >
                  →
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== これまでの歩み ===== */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-box p-4 sm:p-6">
            <h2 className="text-[#00ff00] text-lg mb-4 text-glow">これまでの歩み</h2>

            <div className="space-y-0">
              {roadmap.map((item, index) => (
                <div key={item.hash} className="flex gap-2 sm:gap-3 py-2 text-xs group">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      item.status === "HEAD"
                        ? "bg-[#00ffff] animate-pulse"
                        : "bg-[#00ff00]"
                    }`} />
                    {index < roadmap.length - 1 && (
                      <span className="w-px flex-1 bg-[#1a3a1a] min-h-[20px]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="text-[#00ff00] text-sm">{item.title}</span>
                      {item.status === "HEAD" && (
                        <span className="text-[#00ffff] text-[10px] px-1.5 py-0.5 border border-[#00ffff]/30">
                          いまここ
                        </span>
                      )}
                      <span className="text-[#555]">({item.date})</span>
                    </div>
                    <p className="text-[#888] mt-0.5 break-words">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Newsletter CTA ===== */}
      <NewsletterCTA />

      {/* ===== Founder ===== */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-box p-4 sm:p-6">
            <h2 className="text-[#00ff00] text-lg mb-4 text-glow">作っている人</h2>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 pixel-border-green bg-[#0d0d0d] flex items-center justify-center text-[#00ff00] text-xl">
                  YH
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-[#00ffff] text-sm">Yuki Hamada（濱田優貴）</h3>
                <a
                  href="https://yukihamada.jp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00aa00] text-xs hover:text-[#00ff00] transition-colors"
                >
                  yukihamada.jp
                </a>

                <p className="text-[#888] text-xs mt-3 leading-relaxed">
                  ソフトウェアエンジニア。2024年にEnablerDAOを設立。
                  「日本のインターネットをもっと安全にしたい」という思いから、
                  セキュリティツールやAIツールをオープンソースで開発しています。
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  <a
                    href="https://github.com/yukihamada"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] px-2 py-0.5 border border-[#00ff00]/30 text-[#00ff00] hover:bg-[#00ff00]/10 transition-colors"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://x.com/yukihamada"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] px-2 py-0.5 border border-[#00ffff]/30 text-[#00ffff] hover:bg-[#00ffff]/10 transition-colors"
                  >
                    X (Twitter)
                  </a>
                  <span className="text-[10px] px-2 py-0.5 border border-[#aa66ff]/30 text-[#aa66ff]">
                    enablerdao.eth
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Founder ===== */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-box p-4 sm:p-6">
            <h2 className="text-[#00ff00] text-lg sm:text-xl mb-6 text-glow">
              Founder
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 border border-[#1a3a1a] overflow-hidden">
                  <img
                    src="/yuki-profile.jpg"
                    alt="Yuki Hamada"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-[#00ffff] text-base sm:text-lg mb-2">
                  Yuki Hamada
                </h3>
                <p className="text-[#888] text-sm leading-relaxed mb-3">
                  セキュリティエンジニア / DAO創設者
                </p>
                <p className="text-[#666] text-xs leading-relaxed">
                  インターネットをもっと安全で使いやすくしたい。
                  <br className="hidden sm:block" />
                  そんな思いでEnablerDAOを立ち上げました。
                  <br className="hidden sm:block" />
                  誰もが自由に参加できる組織で、一緒により良いツールを作っていきましょう。
                </p>
                <div className="mt-4">
                  <a
                    href="https://github.com/yukihamada"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#00ff00] text-xs hover:text-[#44ff88] transition-colors"
                  >
                    <span>@yukihamada</span>
                    <span className="text-[#555]">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== お問い合わせ ===== */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-box p-4 sm:p-6 text-center">
            <h2 className="text-[#00ff00] text-lg mb-3 text-glow">
              一緒に作りませんか？
            </h2>
            <p className="text-[#888] text-sm mb-6">
              EnablerDAOは誰でも参加できるオープンな組織です。
              <br />
              興味がある方は、まず私たちのツールを試してみてください。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://github.com/yukihamada"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#00ff00]/10 border border-[#00ff00]/30 text-[#00ff00] text-sm hover:bg-[#00ff00]/20 transition-colors"
              >
                GitHubを見る
              </a>
              <a
                href="mailto:contact@enablerdao.com"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#111] border border-[#1a3a1a] text-[#888] text-sm hover:text-[#00ff00] hover:border-[#00ff00]/30 transition-colors"
              >
                メールで問い合わせ
              </a>
            </div>
            <p className="text-[#555] text-xs mt-4">
              contact@enablerdao.com
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
