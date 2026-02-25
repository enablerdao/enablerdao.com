import Link from "next/link";
import Image from "next/image";
import NewsletterCTA from "@/components/NewsletterCTA";

// --- Product Data ---

interface Product {
  name: string;
  tagline: string;
  url: string;
  href: string;
  color: string;
  pcImage: string;
  spImage: string;
  stats?: string;
  price?: string;
  badge?: string;
}

interface AppProduct {
  name: string;
  tagline: string;
  href: string;
  color: string;
  appStoreUrl: string;
  stats?: string;
}

const flagships: Product[] = [
  {
    name: "StayFlow",
    tagline: "民泊・宿泊施設の運営を一元管理するSaaS",
    url: "stayflowapp.com",
    href: "https://stayflowapp.com",
    color: "#00ff00",
    pcImage: "/screenshots/stayflow-pc.webp",
    spImage: "/screenshots/stayflow-sp.webp",
    stats: "500+ 施設導入 · 1,860 UV/月",
    price: "無料〜¥7,900/月",
    badge: "Revenue Ready",
  },
  {
    name: "Chatweb.ai",
    tagline: "LINE・Telegram・WebでAIアシスタントを即導入",
    url: "chatweb.ai",
    href: "https://chatweb.ai",
    color: "#ffaa00",
    pcImage: "/screenshots/chatweb-pc.webp",
    spImage: "/screenshots/chatweb-sp.webp",
    stats: "210 ユーザー · 30K+ req/日",
    price: "無料〜$29/月",
    badge: "100クレジット無料",
  },
  {
    name: "JiuFlow",
    tagline: "柔術を体系的に学べるオンラインプラットフォーム",
    url: "jiuflow.art",
    href: "https://jiuflow.art",
    color: "#4488ff",
    pcImage: "/screenshots/jiuflow-pc.webp",
    spImage: "/screenshots/jiuflow-sp.webp",
    stats: "256 ユーザー · 200+ テクニック動画",
    price: "無料体験 → ¥2,900/月",
    badge: "有料化開始",
  },
];

const otherProducts: Product[] = [
  {
    name: "ミセバンAI",
    tagline: "防犯カメラをAI店長に。リアルタイム人物検出",
    url: "misebanai.com",
    href: "https://misebanai.com",
    color: "#ff6688",
    pcImage: "/screenshots/miseban-pc.webp",
    spImage: "/screenshots/miseban-sp.webp",
    stats: "YOLOv8搭載 · Docker対応",
  },
  {
    name: "enabler.fun",
    tagline: "民泊の直接予約。手数料を大幅カット",
    url: "enabler.fun",
    href: "https://enabler.fun",
    color: "#00ffcc",
    pcImage: "/screenshots/enabler-fun-pc.webp",
    spImage: "/screenshots/enabler-fun-sp.webp",
    stats: "直接予約で手数料削減",
  },
  {
    name: "BANTO",
    tagline: "建設業向けAI請求書管理",
    url: "banto.work",
    href: "https://banto.work",
    color: "#ffaa00",
    pcImage: "/screenshots/banto-pc.webp",
    spImage: "/screenshots/banto-sp.webp",
    stats: "見積〜請求を自動化",
  },
  {
    name: "SOLUNA",
    tagline: "ZAMNA Hawaii 2026 音楽イベント",
    url: "solun.art",
    href: "https://solun.art",
    color: "#ff6688",
    pcImage: "/screenshots/soluna-pc.webp",
    spImage: "/screenshots/soluna-sp.webp",
    stats: "2026年9月4日開催",
  },
  {
    name: "DojoC",
    tagline: "ハンズオンで学べるセキュリティ教育",
    url: "dojoc.io",
    href: "https://www.dojoc.io",
    color: "#4488ff",
    pcImage: "/screenshots/dojoc-pc.webp",
    spImage: "/screenshots/dojoc-sp.webp",
    stats: "セキュリティ学習プラットフォーム",
  },
];

const appProduct: AppProduct = {
  name: "Elio Chat",
  tagline: "完全オフラインで動くAIチャット。30+ LLMモデル搭載、プライバシー最優先。",
  href: "https://apps.apple.com/app/elio-chat/id6757635481",
  color: "#aa66ff",
  appStoreUrl: "https://apps.apple.com/app/elio-chat/id6757635481",
  stats: "iOS/macOS · 30+ LLMモデル · P2P推論",
};

// --- Device Frame: PC + スマホ並列表示 ---

function DevicePreview({ product }: { product: Product }) {
  return (
    <div className="relative">
      {/* PC Frame */}
      <div className="rounded-lg overflow-hidden border border-[#222] bg-[#111] shadow-lg">
        {/* PC Browser Bar */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] border-b border-[#222]">
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
            <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
            <span className="w-2 h-2 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-[9px] text-[#555] bg-[#0d0d0d] px-2 py-0.5 rounded-sm">{product.url}</span>
          </div>
        </div>
        {/* PC Screenshot */}
        <Image
          src={product.pcImage}
          alt={`${product.name} PC`}
          width={800}
          height={500}
          className="w-full aspect-[16/10] object-cover object-top"
          loading="lazy"
        />
      </div>

      {/* スマホ Frame（右下にオーバーラップ） */}
      <div className="absolute -bottom-4 -right-2 sm:right-2 w-[72px] sm:w-[88px] rounded-xl overflow-hidden border-2 border-[#333] bg-[#000] shadow-2xl">
        {/* Notch */}
        <div className="h-3 bg-[#000] flex justify-center items-end">
          <div className="w-10 h-1.5 bg-[#1a1a1a] rounded-full" />
        </div>
        {/* SP Screenshot */}
        <Image
          src={product.spImage}
          alt={`${product.name} Mobile`}
          width={180}
          height={320}
          className="w-full aspect-[9/16] object-cover object-top"
          loading="lazy"
        />
        {/* Home bar */}
        <div className="h-2 bg-[#000] flex justify-center items-center">
          <div className="w-8 h-0.5 bg-[#333] rounded-full" />
        </div>
      </div>
    </div>
  );
}

// --- Page ---

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* ===== Hero ===== */}
      <section className="pt-20 pb-8 sm:pt-24 sm:pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-4xl font-bold text-[#e0e0e0] mb-3">
            みんなで作る、<span className="text-[#00ff00]">みんなのためのソフトウェア</span>
          </h1>
          <p className="text-sm sm:text-base text-[#888] max-w-2xl mx-auto mb-6">
            EnablerDAOは、AIとオープンソースでプロダクトを開発・運営するDAO。
            基本無料で始められて、誰でも参加できます。
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <Link href="#products" className="px-6 py-2.5 bg-[#00ff00] text-[#000] font-bold text-sm hover:bg-[#33ff33] transition-colors rounded">
              サービスを見る
            </Link>
            <Link href="/ideas" className="px-6 py-2.5 border border-[#00ff00]/30 text-[#00ff00] text-sm hover:bg-[#00ff00]/10 transition-colors rounded">
              アイデアを投稿
            </Link>
            <Link href="/dao" className="px-6 py-2.5 border border-[#333] text-[#888] text-sm hover:text-[#e0e0e0] transition-colors rounded">
              DAO Governance
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#555]">
            <span><span className="text-[#00ff00] font-bold">500+</span> 施設導入</span>
            <span><span className="text-[#ffaa00] font-bold">30K+</span> req/日</span>
            <span><span className="text-[#00ffff] font-bold">99.99%</span> uptime</span>
            <span><span className="text-[#aa66ff] font-bold">OSS</span> 全コード公開</span>
          </div>
        </div>
      </section>

      {/* ===== Flagship Products ===== */}
      <section id="products" className="py-10 sm:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg text-[#00ff00] font-bold mb-8">主力サービス</h2>

          <div className="space-y-16 mb-16">
            {flagships.map((p, i) => (
              <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer" className="block group">
                <div className={`flex flex-col ${i % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} gap-6 lg:gap-10 items-center`}>
                  {/* Device Preview */}
                  <div className="w-full lg:w-3/5 pb-6">
                    <DevicePreview product={p} />
                  </div>

                  {/* Info */}
                  <div className="w-full lg:w-2/5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl font-bold" style={{ color: p.color }}>{p.name}</span>
                      {p.badge && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full" style={{
                          backgroundColor: `${p.color}20`,
                          color: p.color,
                          border: `1px solid ${p.color}40`,
                        }}>
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#ccc] mb-3">{p.tagline}</p>
                    <p className="text-xs text-[#555] mb-3">{p.stats}</p>
                    {p.price && (
                      <p className="text-xs text-[#00ffff] mb-4">{p.price}</p>
                    )}
                    <span className="inline-block text-xs px-4 py-2 rounded group-hover:opacity-80 transition-opacity" style={{
                      backgroundColor: `${p.color}15`,
                      color: p.color,
                      border: `1px solid ${p.color}40`,
                    }}>
                      {p.url} を開く →
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* ===== Native App (Elio) ===== */}
          <div className="mb-16">
            <h2 className="text-lg text-[#888] font-bold mb-6">ネイティブアプリ</h2>
            <a href={appProduct.appStoreUrl} target="_blank" rel="noopener noreferrer"
               className="flex flex-col sm:flex-row gap-5 p-5 border border-[#aa66ff]/30 rounded-xl hover:border-[#aa66ff]/60 transition-colors group">
              {/* App Icon + badge */}
              <div className="flex-shrink-0 flex flex-col items-center gap-3">
                <Image
                  src="/screenshots/elio-icon.webp"
                  alt="Elio Chat"
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-2xl"
                />
                <Image
                  src="/screenshots/appstore-badge.svg"
                  alt="Download on the App Store"
                  width={120}
                  height={40}
                  className="h-10 w-auto group-hover:opacity-80 transition-opacity"
                />
              </div>
              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-bold" style={{ color: appProduct.color }}>{appProduct.name}</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#aa66ff]/20 text-[#aa66ff] border border-[#aa66ff]/40">
                    iOS/macOS App
                  </span>
                </div>
                <p className="text-sm text-[#ccc] mb-2">{appProduct.tagline}</p>
                <p className="text-xs text-[#555] mb-2">{appProduct.stats}</p>
                <div className="flex flex-wrap gap-2 text-[10px]">
                  <span className="px-2 py-0.5 bg-[#1a1a1a] border border-[#333] rounded text-[#888]">完全無料</span>
                  <span className="px-2 py-0.5 bg-[#1a1a1a] border border-[#333] rounded text-[#888]">オフライン動作</span>
                  <span className="px-2 py-0.5 bg-[#1a1a1a] border border-[#333] rounded text-[#888]">P2P推論</span>
                  <span className="px-2 py-0.5 bg-[#1a1a1a] border border-[#333] rounded text-[#888]">MCP対応</span>
                </div>
              </div>
            </a>
          </div>

          {/* ===== Other Products (PC+SP thumbnail grid) ===== */}
          <h2 className="text-lg text-[#888] font-bold mb-6">その他のサービス</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherProducts.map((p) => (
              <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer"
                 className="border border-[#1a3a1a] rounded-lg overflow-hidden hover:border-[#333] transition-colors group">
                {/* Screenshots side by side */}
                <div className="relative bg-[#111] h-36 overflow-hidden">
                  {/* PC screenshot (background) */}
                  <Image src={p.pcImage} alt={`${p.name} PC`}
                       fill
                       className="object-cover object-top opacity-60 group-hover:opacity-80 transition-opacity" loading="lazy" />
                  {/* SP screenshot (foreground right) */}
                  <div className="absolute bottom-1 right-2 w-14 h-28 z-10">
                    <div className="relative w-full h-full rounded-md overflow-hidden border border-[#333] shadow-lg bg-black">
                      <Image src={p.spImage} alt={`${p.name} Mobile`}
                           fill
                           className="object-cover object-top" loading="lazy" />
                    </div>
                  </div>
                </div>
                {/* Info */}
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold" style={{ color: p.color }}>{p.name}</span>
                    <span className="text-[9px] text-[#555]">{p.url}</span>
                  </div>
                  <p className="text-[10px] text-[#888]">{p.tagline}</p>
                  <p className="text-[9px] text-[#555] mt-1">{p.stats}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Property Highlights ===== */}
      <section className="py-10 sm:py-14 border-t border-[#1a3a1a]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg text-[#00ff00] font-bold mb-2">
            <span className="text-[#555]">#</span> 運用中の物件
          </h2>
          <p className="text-xs text-[#555] mb-6 font-mono">
            $ stayflow list --status=active --format=summary
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "WHITE HOUSE Atami", loc: "静岡県熱海市", img: "/properties/atami.jpg", features: ["オーシャンビュー", "プライベートヴィラ"], url: "https://www.airbnb.jp/rooms/53223988" },
              { name: "THE LODGE Teshikaga", loc: "北海道弟子屈町", img: "/properties/teshikaga.jpg", features: ["天然温泉", "薪ストーブ", "BBQ"], url: "https://www.airbnb.jp/rooms/597239384272621732" },
              { name: "THE NEST Teshikaga", loc: "北海道弟子屈町", img: "/properties/nest.jpg", features: ["天然温泉", "高断熱", "デジタルデザイン"], url: "https://www.airbnb.jp/rooms/911857804615412559" },
              { name: "BEACH HOUSE Honolulu", loc: "ハワイ州ホノルル", img: "/properties/honolulu.jpg", features: ["ビーチフロント", "サンセットビュー"], url: "https://www.airbnb.jp/rooms/1226550388535476490" },
              { name: "GARAGE HOUSE Honolulu", loc: "ハワイ州ホノルル", img: "/properties/garage.jpg", features: ["オーシャンビュー", "BBQ", "ココヘッド"], url: "https://www.airbnb.jp/rooms/936009273046846679" },
            ].map((p) => (
              <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
                 className="border border-[#1a3a1a] rounded-lg overflow-hidden hover:border-[#00ff00]/30 transition-colors group">
                <div className="relative h-36 bg-[#111] overflow-hidden">
                  <Image src={p.img} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  <div className="absolute top-2 right-2">
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-[#00ff00]/20 text-[#00ff00] border border-[#00ff00]/30 backdrop-blur-sm">稼働中</span>
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-sm font-bold text-[#e0e0e0] mb-1">{p.name}</div>
                  <div className="text-[10px] text-[#888] font-mono mb-2">{p.loc}</div>
                  <div className="flex flex-wrap gap-1">
                    {p.features.map((f) => (
                      <span key={f} className="text-[9px] px-1.5 py-0.5 rounded bg-[#1a1a1a] border border-[#333] text-[#888]">{f}</span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Summary + CTA */}
          <div className="mt-6 p-4 border border-[#1a3a1a] rounded-lg bg-[#0d0d0d]">
            <div className="font-mono text-xs text-[#888] space-y-1">
              <div><span className="text-[#555]">$</span> enabler.fun stats --summary</div>
              <div className="pl-2">
                total_properties: <span className="text-[#00ffff]">5</span> | locations: <span className="text-[#00ff00]">熱海・弟子屈・ホノルル</span> | managed_by: <span className="text-[#ffaa00]">StayFlow</span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a
                href="https://enabler.fun"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs px-4 py-2 bg-[#00ffcc]/10 text-[#00ffcc] border border-[#00ffcc]/30 rounded hover:bg-[#00ffcc]/20 transition-colors"
              >
                enabler.fun で物件を見る →
              </a>
              <a
                href="https://stayflowapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs px-4 py-2 bg-[#00ff00]/10 text-[#00ff00] border border-[#00ff00]/30 rounded hover:bg-[#00ff00]/20 transition-colors"
              >
                StayFlowで物件管理を始める →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== EnablerDAOとは (super compact) ===== */}
      <section className="py-10 sm:py-14 border-t border-[#1a3a1a]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg text-[#00ff00] font-bold mb-6">EnablerDAOとは</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 border border-[#1a3a1a] rounded-lg">
              <h3 className="text-sm text-[#00ff00] mb-1">DAO = みんなで運営</h3>
              <p className="text-xs text-[#888]">メンバー全員の投票で方向性を決めるオープンな組織</p>
            </div>
            <div className="p-4 border border-[#1a3a1a] rounded-lg">
              <h3 className="text-sm text-[#00ffff] mb-1">基本無料で始められる</h3>
              <p className="text-xs text-[#888]">基本機能は無料で使えて、有料プランで高度な機能を解放</p>
            </div>
            <div className="p-4 border border-[#1a3a1a] rounded-lg">
              <h3 className="text-sm text-[#ffaa00] mb-1">貢献で報酬を獲得</h3>
              <p className="text-xs text-[#888]">コード・バグ報告などの貢献でEBRトークンを獲得</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Founder ===== */}
      <section className="py-10 sm:py-14 border-t border-[#1a3a1a]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="flex-shrink-0 w-16 h-16 border border-[#1a3a1a] overflow-hidden rounded-lg relative">
              <Image src="/yuki-profile.jpg" alt="Yuki Hamada" fill className="object-cover" sizes="64px" />
            </div>
            <div>
              <h3 className="text-sm text-[#e0e0e0]">
                Yuki Hamada（濱田優貴）
                <a href="https://yukihamada.jp" target="_blank" rel="noopener noreferrer" className="text-[#00aa00] text-xs ml-2 hover:text-[#00ff00]">yukihamada.jp</a>
              </h3>
              <p className="text-xs text-[#888] mt-1 max-w-xl">ソフトウェアエンジニア。1人+AIで複数プロダクトを開発・運営中。</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <a href="https://github.com/yukihamada" target="_blank" rel="noopener noreferrer" className="text-[10px] px-2 py-0.5 border border-[#333] text-[#888] hover:text-[#00ff00] rounded transition-colors">GitHub</a>
                <a href="https://x.com/yukihamada" target="_blank" rel="noopener noreferrer" className="text-[10px] px-2 py-0.5 border border-[#333] text-[#888] hover:text-[#00ffff] rounded transition-colors">X</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Footer Links ===== */}
      <section className="py-8 border-t border-[#1a3a1a]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <Link href="/blog" className="text-[#888] hover:text-[#00ff00] transition-colors">Blog</Link>
            <Link href="/projects" className="text-[#888] hover:text-[#00ff00] transition-colors">Projects</Link>
            <Link href="/dao" className="text-[#888] hover:text-[#00ff00] transition-colors">DAO</Link>
            <Link href="/token" className="text-[#888] hover:text-[#00ff00] transition-colors">EBR Token</Link>
            <Link href="/status" className="text-[#888] hover:text-[#00ff00] transition-colors">Status</Link>
            <Link href="/security" className="text-[#888] hover:text-[#00ff00] transition-colors">Security</Link>
            <a href="mailto:contact@enablerdao.com" className="text-[#888] hover:text-[#00ff00] transition-colors">Contact</a>
          </div>
        </div>
      </section>

      <NewsletterCTA />
    </div>
  );
}
