use crate::layout::NEWSLETTER_CTA_HTML;

pub fn render() -> String {
    format!(
        r#"<section class="section">
  <div class="container">
    <div class="page-header">
      <h1 class="page-title prompt">$ ls ~/projects/</h1>
      <div class="quick-stats">
        <span class="stat-badge">3 Flagship</span>
        <span class="stat-badge">5 Other</span>
        <span class="stat-badge">1 Native App</span>
      </div>
    </div>

    <h2 class="section-title">Flagship Products</h2>
    <div class="products-detail-grid">
      <div class="product-detail-card">
        <div class="product-header">
          <h3>StayFlow</h3>
          <span class="product-badge badge-green">Revenue Ready</span>
        </div>
        <p>無料×AI×日本語の民泊管理SaaS。ゲスト対応、予約管理、清掃手配をAIが自動化。</p>
        <ul class="product-features">
          <li>500+ 施設が導入</li>
          <li>Beds24 API直結</li>
          <li>多言語ゲスト対応AI</li>
          <li>Stripe決済連携</li>
        </ul>
        <div class="product-links">
          <a href="https://stayflowapp.com" target="_blank">stayflowapp.com →</a>
          <a href="https://github.com/enablerdao/stayflow" target="_blank">GitHub</a>
        </div>
      </div>

      <div class="product-detail-card">
        <div class="product-header">
          <h3>Chatweb.ai</h3>
          <span class="product-badge badge-green">Revenue Ready</span>
        </div>
        <p>日本発AIエージェント。50+ツール統合、9 LLMプロバイダー、Rust + AWS Lambda。</p>
        <ul class="product-features">
          <li>424 ユーザー / 18 有料会員</li>
          <li>OpenAI互換API</li>
          <li>音声入出力 (STT/TTS)</li>
          <li>マルチチャネル (Web/LINE/Telegram)</li>
        </ul>
        <div class="product-links">
          <a href="https://chatweb.ai" target="_blank">chatweb.ai →</a>
          <a href="https://github.com/yukihamada/nanobot" target="_blank">GitHub</a>
        </div>
      </div>

      <div class="product-detail-card">
        <div class="product-header">
          <h3>JiuFlow</h3>
          <span class="product-badge badge-cyan">Active</span>
        </div>
        <p>柔術を体系で学ぶ。4K俯瞰撮影、プロ監修のテクニック動画ライブラリ。</p>
        <ul class="product-features">
          <li>200+ テクニック動画</li>
          <li>村田良蔵師範 監修</li>
          <li>4K 俯瞰撮影</li>
          <li>帯レベル別カリキュラム</li>
        </ul>
        <div class="product-links">
          <a href="https://jiuflow.art" target="_blank">jiuflow.art →</a>
          <a href="https://github.com/enablerdao/jiuflow" target="_blank">GitHub</a>
        </div>
      </div>
    </div>

    <h2 class="section-title">Native App</h2>
    <div class="products-detail-grid">
      <div class="product-detail-card">
        <div class="product-header">
          <h3>Elio Chat</h3>
          <span class="product-badge badge-cyan">Active</span>
        </div>
        <p>完全オフラインAIチャット。30+モデル対応、P2P分散推論、プライバシーファースト。</p>
        <ul class="product-features">
          <li>iOS / macOS ネイティブ (Swift)</li>
          <li>30+ LLMモデル内蔵</li>
          <li>P2P分散推論ネットワーク</li>
          <li>インターネット不要で動作</li>
        </ul>
        <div class="product-links">
          <a href="https://elio.love" target="_blank">elio.love →</a>
        </div>
      </div>
    </div>

    <h2 class="section-title">Other Products</h2>
    <div class="other-products-list">
      <div class="other-product-row">
        <span class="other-product-name">ミセバンAI</span>
        <span class="other-product-desc">防犯カメラをAI店長に</span>
        <a href="https://misebanai.com" target="_blank">misebanai.com</a>
      </div>
      <div class="other-product-row">
        <span class="other-product-name">BANTO</span>
        <span class="other-product-desc">建設業向け請求書AI</span>
        <a href="https://banto.work" target="_blank">banto.work</a>
      </div>
      <div class="other-product-row">
        <span class="other-product-name">SOLUNA</span>
        <span class="other-product-desc">リアルイベントプラットフォーム</span>
        <a href="https://solun.art" target="_blank">solun.art</a>
      </div>
      <div class="other-product-row">
        <span class="other-product-name">enabler.fun</span>
        <span class="other-product-desc">直接予約プラットフォーム</span>
        <a href="https://enabler.fun" target="_blank">enabler.fun</a>
      </div>
      <div class="other-product-row">
        <span class="other-product-name">EnablerDAO</span>
        <span class="other-product-desc">DAOハブサイト (このサイト)</span>
        <a href="https://enablerdao.com">enablerdao.com</a>
      </div>
    </div>

    {newsletter}
  </div>
</section>"#,
        newsletter = NEWSLETTER_CTA_HTML,
    )
}
