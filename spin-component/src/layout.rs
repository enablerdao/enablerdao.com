/// Common HTML layout for all pages.
/// Wraps page content in the full document shell (nav + footer).

const NAV_HTML: &str = r#"<header class="site-header">
  <div class="header-inner">
    <div class="header-left">
      <div class="traffic-lights">
        <span class="dot dot-red"></span>
        <span class="dot dot-yellow"></span>
        <span class="dot dot-green"></span>
      </div>
      <a href="/" class="header-title">enablerdao@web3:~</a>
    </div>
    <nav class="header-nav" id="main-nav">
      <a href="/" class="nav-link">~/</a>
      <a href="/projects" class="nav-link">~/projects</a>
      <a href="/blog" class="nav-link">~/blog</a>
      <a href="/ideas" class="nav-link">~/ideas</a>
      <a href="/agents" class="nav-link">~/agents</a>
      <div class="nav-dropdown">
        <button class="nav-link dropdown-toggle" id="more-btn">more +</button>
        <div class="dropdown-menu" id="more-menu">
          <a href="/dao" class="dropdown-item">~/dao</a>
          <a href="/token" class="dropdown-item">~/token</a>
          <a href="/qa" class="dropdown-item">~/qa</a>
          <a href="/dashboard" class="dropdown-item">~/dashboard</a>
          <a href="/metrics" class="dropdown-item">~/metrics</a>
          <a href="/status" class="dropdown-item">~/status</a>
        </div>
      </div>
    </nav>
    <div class="header-right">
      <a href="https://github.com/enablerdao" class="nav-link git-link" target="_blank" rel="noopener">git</a>
      <span class="wallet-badge">enablerdao.eth <span class="pulse-dot"></span></span>
      <a href="/ideas" class="nav-cta">Contribute →</a>
      <button class="mobile-menu-btn" id="mobile-menu-btn">[=]</button>
    </div>
  </div>
  <div class="mobile-menu" id="mobile-menu">
    <a href="/" class="mobile-link">~/</a>
    <a href="/projects" class="mobile-link">~/projects</a>
    <a href="/blog" class="mobile-link">~/blog</a>
    <a href="/ideas" class="mobile-link">~/ideas</a>
    <a href="/agents" class="mobile-link">~/agents</a>
    <div class="mobile-separator"># more...</div>
    <a href="/dao" class="mobile-link">~/dao</a>
    <a href="/token" class="mobile-link">~/token</a>
    <a href="/qa" class="mobile-link">~/qa</a>
    <a href="/dashboard" class="mobile-link">~/dashboard</a>
    <a href="/metrics" class="mobile-link">~/metrics</a>
    <a href="/status" class="mobile-link">~/status</a>
  </div>
</header>"#;

const FOOTER_HTML: &str = r#"<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-cta">
      <p class="footer-cta-text">EnablerDAOのプロダクトを試してみませんか？</p>
      <div class="footer-cta-actions">
        <a href="/projects" class="btn btn-primary">プロダクトを見る</a>
        <a href="/ideas" class="btn btn-secondary">アイデアを投稿</a>
      </div>
    </div>
    <div class="footer-grid">
      <div class="footer-col">
        <h4 class="footer-heading">Products</h4>
        <a href="https://chatweb.ai" class="footer-link" target="_blank">Chatweb.ai</a>
        <a href="https://stayflowapp.com" class="footer-link" target="_blank">StayFlow</a>
        <a href="https://jiuflow.art" class="footer-link" target="_blank">JiuFlow</a>
        <a href="https://elio.love" class="footer-link" target="_blank">Elio</a>
        <a href="https://misebanai.com" class="footer-link" target="_blank">MisebanAI</a>
      </div>
      <div class="footer-col">
        <h4 class="footer-heading">Community</h4>
        <a href="/blog" class="footer-link">Blog</a>
        <a href="/ideas" class="footer-link">Ideas</a>
        <a href="/dao" class="footer-link">DAO</a>
        <a href="/agents" class="footer-link">Agents</a>
        <a href="/token" class="footer-link">EBR Token</a>
      </div>
      <div class="footer-col">
        <h4 class="footer-heading">Links</h4>
        <a href="https://github.com/enablerdao" class="footer-link" target="_blank">GitHub</a>
        <a href="https://t.me/enablerdao" class="footer-link" target="_blank">Telegram</a>
        <a href="/feed.xml" class="footer-link">RSS Feed</a>
        <a href="/sitemap.xml" class="footer-link">Sitemap</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p class="footer-copy">&copy; 2026 EnablerDAO. Built with Rust + Spin WASM</p>
      <p class="footer-founder">
        Founded by <a href="https://yukihamada.jp" class="footer-link" target="_blank">Yuki Hamada</a>
      </p>
    </div>
  </div>
</footer>"#;

pub const NEWSLETTER_CTA_HTML: &str = r#"<section class="newsletter-section reveal">
  <div class="container">
    <div class="newsletter-box">
      <h3 class="newsletter-title">最新情報をお届け</h3>
      <p class="newsletter-desc">新プロダクト、技術記事、コミュニティの動きを週1回お届けします。</p>
      <form class="newsletter-form" id="newsletter-form">
        <input type="email" name="email" placeholder="you@example.com" required class="newsletter-input">
        <button type="submit" class="btn btn-primary">無料で参加する</button>
      </form>
      <p class="newsletter-status" id="newsletter-status"></p>
      <div class="newsletter-benefits">
        <span>&#10003; 週1回のみ</span>
        <span>&#10003; いつでも解除可</span>
        <span>&#10003; スパムなし</span>
      </div>
    </div>
  </div>
</section>"#;

/// Wraps page-specific `content` in the full HTML document shell.
///
/// Includes meta tags, OG / Twitter card, JSON-LD structured data, nav, footer, and script tag.
pub fn page_shell(title: &str, description: &str, canonical: &str, content: &str) -> String {
    let og_image = "https://enablerdao.com/static/og-default.png";
    let json_ld = format!(
        r#"{{"@context":"https://schema.org","@type":"Organization","name":"EnablerDAO","url":"https://enablerdao.com","logo":"https://enablerdao.com/static/favicon.svg","description":"{description}","sameAs":["https://github.com/enablerdao","https://t.me/enablerdao"]}}"#,
        description = description.replace('"', "&quot;"),
    );
    format!(
        r#"<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <meta name="description" content="{description}">
  <meta name="keywords" content="EnablerDAO, Web3, DAO, DeFi, AI, Rust, decentralized, blockchain, ENAI token, chatweb, jiuflow">
  <meta name="author" content="EnablerDAO">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="{canonical}">
  <link rel="icon" href="/static/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/static/styles.css">
  <link rel="alternate" type="application/rss+xml" title="EnablerDAO Blog" href="https://enablerdao.com/feed.xml">
  <!-- Open Graph -->
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{description}">
  <meta property="og:url" content="{canonical}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="EnablerDAO">
  <meta property="og:image" content="{og_image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="ja_JP">
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{title}">
  <meta name="twitter:description" content="{description}">
  <meta name="twitter:image" content="{og_image}">
  <meta name="twitter:site" content="@enablerdao">
  <!-- JSON-LD Structured Data -->
  <script type="application/ld+json">{json_ld}</script>
</head>
<body>
{nav}
<main class="main-content">
{content}
</main>
{footer}
<script src="/static/app.js" defer></script>
</body>
</html>"#,
        title = title,
        description = description,
        canonical = canonical,
        og_image = og_image,
        json_ld = json_ld,
        nav = NAV_HTML,
        content = content,
        footer = FOOTER_HTML,
    )
}
