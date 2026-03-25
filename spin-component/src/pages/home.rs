use crate::layout::NEWSLETTER_CTA_HTML;

pub fn render() -> String {
    format!(
        r#"<section class="hero">
  <div class="container">
    <div class="hero-box animate-fade-in-up">
      <div class="hero-badge"><span class="pulse-dot"></span> 8つのプロダクトが稼働中</div>
      <h1 class="hero-title gradient-text">テクノロジーで、<br>社会をEnableする</h1>
      <p class="hero-desc">AIとオープンソースの力で、誰もが使えるソフトウェアを作るDAO。<br>コードを書いても、書かなくても参加できます。</p>
      <div class="hero-actions">
        <a href="/projects" class="btn btn-primary btn-lg">プロダクトを見る</a>
        <a href="/ideas" class="btn btn-secondary btn-lg">アイデアを投稿</a>
      </div>
    </div>
  </div>
</section>

<!-- Elio: 最前面フィーチャー -->
<section class="section elio-feature reveal">
  <div class="container">
    <div class="elio-feature-card">
      <div class="elio-feature-content">
        <span class="product-badge badge-violet" style="margin-bottom:12px;display:inline-block;">Featured App</span>
        <h2 class="elio-feature-title">Elio — 完全オフラインAIチャット</h2>
        <p class="elio-feature-desc">インターネット不要。データは端末から一切出ない。<br>あなたのiPhoneの中だけで完結する、100%プライベートなAI。<br>広告なし、サブスクなし、完全無料。</p>
        <ul class="elio-feature-list">
          <li>オフラインで動作 — 機内モードでもOK</li>
          <li>データ送信ゼロ — 会話は端末内に完結</li>
          <li>完全無料 — 広告もサブスクもなし</li>
        </ul>
        <div class="elio-feature-actions">
          <a href="https://apps.apple.com/jp/app/elio-chat/id6757635481" target="_blank" class="appstore-badge-link">
            <img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/ja-jp?size=250x83" alt="App Storeからダウンロード" class="appstore-badge-lg" loading="lazy">
          </a>
          <a href="https://elio.love" class="btn btn-secondary btn-sm" target="_blank">elio.love →</a>
        </div>
      </div>
      <div class="elio-feature-icon">
        <img src="https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/ff/75/a6/ff75a6f1-bbc6-0f37-8020-ee6c44d1855e/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg" alt="Elio" class="elio-app-icon" loading="lazy">
      </div>
    </div>
  </div>
</section>

<section class="stats-band reveal">
  <div class="container">
    <div class="stats-row">
      <div class="stat-item">
        <span class="stat-highlight" style="color: var(--green);">8+</span>
        <span class="stat-label">プロダクト</span>
      </div>
      <div class="stat-item">
        <span class="stat-highlight" style="color: var(--cyan);">500+</span>
        <span class="stat-label">施設導入</span>
      </div>
      <div class="stat-item">
        <span class="stat-highlight" style="color: var(--amber);">424</span>
        <span class="stat-label">AIユーザー</span>
      </div>
      <div class="stat-item">
        <span class="stat-highlight" style="color: var(--violet);">$142</span>
        <span class="stat-label">月額インフラ</span>
      </div>
    </div>
  </div>
</section>

<!-- AI Agents -->
<section class="section reveal">
  <div class="container">
    <p class="section-label">AI Agents</p>
    <h2 class="section-title">11匹のAI犬が、3分ごとに自律行動</h2>
    <p class="section-subtitle">単一WASMバイナリから生まれた11のエージェント。コード改善・セキュリティ監査・サポートを自動実行。</p>
    <div class="agents-grid">
      <div class="agent-card">
        <div class="agent-header">
          <span class="agent-emoji">🐕</span>
          <h3>Bossdog</h3>
          <span class="status-active">● online</span>
        </div>
        <p class="agent-role">統括 / 戦略立案</p>
        <p class="agent-model">Claude Opus</p>
        <div class="agent-skills">
          <span class="skill-badge">strategy</span>
          <span class="skill-badge">code_review</span>
          <span class="skill-badge">deploy</span>
        </div>
      </div>
      <div class="agent-card">
        <div class="agent-header">
          <span class="agent-emoji">🛡️</span>
          <h3>Guarddog</h3>
          <span class="status-active">● online</span>
        </div>
        <p class="agent-role">セキュリティ監査</p>
        <p class="agent-model">Gemini 2.5 Pro</p>
        <div class="agent-skills">
          <span class="skill-badge">security</span>
          <span class="skill-badge">owasp</span>
          <span class="skill-badge">audit</span>
        </div>
      </div>
      <div class="agent-card">
        <div class="agent-header">
          <span class="agent-emoji">🔍</span>
          <h3>Debugdog</h3>
          <span class="status-active">● online</span>
        </div>
        <p class="agent-role">バグハンター</p>
        <p class="agent-model">Qwen3 Coder 480B</p>
        <div class="agent-skills">
          <span class="skill-badge">debugging</span>
          <span class="skill-badge">testing</span>
          <span class="skill-badge">trace</span>
        </div>
      </div>
      <div class="agent-card">
        <div class="agent-header">
          <span class="agent-emoji">💬</span>
          <h3>Chatwebdog</h3>
          <span class="status-active">● online</span>
        </div>
        <p class="agent-role">Chatweb.ai 基盤</p>
        <p class="agent-model">Qwen3 Coder 480B</p>
        <div class="agent-skills">
          <span class="skill-badge">rust_lambda</span>
          <span class="skill-badge">streaming</span>
          <span class="skill-badge">llm</span>
        </div>
      </div>
    </div>
    <div style="text-align:center;margin-top:24px;">
      <a href="/agents" class="btn btn-secondary">全11エージェントを見る →</a>
    </div>
  </div>
</section>

<section class="cta-band reveal">
  <div class="container">
    <p class="cta-band-text">アイデアがあれば、すぐにプロダクトに。</p>
    <a href="/ideas" class="btn btn-primary">アイデアを投稿する</a>
  </div>
</section>

<!-- Flagship Products -->
<section class="section reveal">
  <div class="container">
    <p class="section-label">Flagship Products</p>
    <h2 class="section-title">メインプロダクト</h2>
    <p class="section-subtitle">収益化済み・アクティブユーザーのいるプロダクト</p>
    <div class="products-grid">
      <div class="product-card">
        <div class="product-header">
          <img src="https://stayflowapp.com/favicon.svg" alt="StayFlow" class="product-logo" loading="lazy">
          <div class="product-header-text">
            <h3 class="product-name">StayFlow</h3>
            <span class="product-badge badge-green">Revenue Ready</span>
          </div>
        </div>
        <p class="product-desc">無料から使える民泊管理SaaS。500+施設が導入、満足度4.9/5。予約管理からゲスト対応まで一括自動化。</p>
        <div class="product-stats">
          <span>1,860 UV/月</span>
          <span>500+ 施設</span>
        </div>
        <a href="https://stayflowapp.com" class="product-link" target="_blank">stayflowapp.com →</a>
      </div>

      <div class="product-card">
        <div class="product-header">
          <img src="https://chatweb.ai/og.svg" alt="Chatweb.ai" class="product-logo" loading="lazy">
          <div class="product-header-text">
            <h3 class="product-name">Chatweb.ai</h3>
            <span class="product-badge badge-green">Revenue Ready</span>
          </div>
        </div>
        <p class="product-desc">日本発AIエージェント。50+ツール内蔵、Web/LINE/Telegram対応。Rust Lambda で高速レスポンス。</p>
        <div class="product-stats">
          <span>424 ユーザー</span>
          <span>18 有料会員</span>
        </div>
        <a href="https://chatweb.ai" class="product-link" target="_blank">chatweb.ai →</a>
      </div>

      <div class="product-card">
        <div class="product-header">
          <img src="https://jiuflow.art/favicon.png" alt="JiuFlow" class="product-logo" loading="lazy">
          <div class="product-header-text">
            <h3 class="product-name">JiuFlow</h3>
            <span class="product-badge badge-cyan">Active</span>
          </div>
        </div>
        <p class="product-desc">柔術テクニックを体系で学ぶ。4K俯瞰撮影、200+動画。村田良蔵師範監修。</p>
        <div class="product-stats">
          <span>200+ 動画</span>
          <span>村田良蔵 監修</span>
        </div>
        <a href="https://jiuflow.art" class="product-link" target="_blank">jiuflow.art →</a>
      </div>
    </div>
  </div>
</section>

<!-- 物件紹介 -->
<section class="section section-alt reveal">
  <div class="container">
    <p class="section-label">Properties</p>
    <h2 class="section-title">運用中の物件</h2>
    <p class="section-subtitle">StayFlowで管理・運用しているリアル物件</p>
    <div class="properties-grid">
      <a href="https://www.airbnb.jp/rooms/53223988" target="_blank" class="property-card">
        <img src="/static/properties/atami.jpg" alt="WHITE HOUSE" class="property-photo" loading="lazy">
        <div class="property-info">
          <h4>WHITE HOUSE</h4>
          <p class="property-location">静岡県熱海市 — オーシャンビュー・サウナ付き</p>
          <div class="property-bar"><span class="bar-fill" style="width: 85%"></span></div>
          <span class="property-rate">稼働率 85%</span>
        </div>
      </a>
      <a href="https://www.airbnb.jp/rooms/597239384272621732" target="_blank" class="property-card">
        <img src="/static/properties/teshikaga.jpg" alt="THE LODGE" class="property-photo" loading="lazy">
        <div class="property-info">
          <h4>THE LODGE</h4>
          <p class="property-location">北海道弟子屈町 — 天然温泉・薪ストーブ</p>
          <div class="property-bar"><span class="bar-fill" style="width: 92%"></span></div>
          <span class="property-rate">稼働率 92%</span>
        </div>
      </a>
      <a href="https://www.airbnb.jp/rooms/911857804615412559" target="_blank" class="property-card">
        <img src="/static/properties/nest.jpg" alt="THE NEST" class="property-photo" loading="lazy">
        <div class="property-info">
          <h4>THE NEST</h4>
          <p class="property-location">北海道弟子屈町 — 天然温泉・デジタルデザイン</p>
          <div class="property-bar"><span class="bar-fill" style="width: 88%"></span></div>
          <span class="property-rate">稼働率 88%</span>
        </div>
      </a>
      <a href="https://www.airbnb.jp/rooms/1226550388535476490" target="_blank" class="property-card">
        <img src="/static/properties/honolulu.jpg" alt="BEACH HOUSE" class="property-photo" loading="lazy">
        <div class="property-info">
          <h4>BEACH HOUSE</h4>
          <p class="property-location">ハワイ・ホノルル — ビーチフロント</p>
          <div class="property-bar"><span class="bar-fill" style="width: 78%"></span></div>
          <span class="property-rate">稼働率 78%</span>
        </div>
      </a>
    </div>
  </div>
</section>

<!-- Other Products -->
<section class="section reveal">
  <div class="container">
    <p class="section-label">All Products</p>
    <h2 class="section-title">その他のプロダクト</h2>
    <div class="other-products-grid">
      <div class="other-product-card">
        <img src="https://misebanai.com/favicon-180.png" alt="MisebanAI" class="other-product-logo" loading="lazy">
        <h4>ミセバンAI</h4>
        <p>防犯カメラをAI店長に</p>
        <a href="https://misebanai.com" target="_blank">misebanai.com →</a>
      </div>
      <div class="other-product-card">
        <img src="https://banto.work/pwa-192x192.png" alt="BANTO" class="other-product-logo" loading="lazy">
        <h4>BANTO</h4>
        <p>チャットで見積もりがすぐ作れる</p>
        <a href="https://banto.work" target="_blank">banto.work →</a>
      </div>
      <div class="other-product-card">
        <div class="product-icon icon-soluna" style="width:40px;height:40px;font-size:16px;margin:0 auto;border-radius:10px;">S</div>
        <h4>SOLUNA</h4>
        <p>リアルイベントプラットフォーム</p>
        <a href="https://solun.art" target="_blank">solun.art →</a>
      </div>
      <div class="other-product-card">
        <div class="product-icon icon-enabler" style="width:40px;height:40px;font-size:16px;margin:0 auto;border-radius:10px;">e</div>
        <h4>enabler.fun</h4>
        <p>直接予約プラットフォーム</p>
        <a href="https://enabler.fun" target="_blank">enabler.fun →</a>
      </div>
    </div>
  </div>
</section>

<!-- Why DAO -->
<section class="section section-alt reveal">
  <div class="container">
    <p class="section-label">Why EnablerDAO</p>
    <h2 class="section-title">「会社の利益」ではなく、「みんなの便利」のために。</h2>
    <p class="section-subtitle">特定の企業が利益を独占したり、密室で方針を決めたりすることはありません。<br>実際に使う人、アイデアを出した人全員で意思決定を行うため、<br>ユーザーの声を無視した改悪がなく、どこまでも透明でフェアな運営が可能です。</p>
    <div class="about-grid">
      <div class="about-card">
        <h3>全員で意思決定</h3>
        <p>経営会議も取締役会もありません。プロダクトの方向性は、使う人・作る人・アイデアを出した人がオープンに議論して決めます。</p>
      </div>
      <div class="about-card">
        <h3>月$142で8プロダクト</h3>
        <p>株主への配当もオフィス賃料もゼロ。Rust + Fly.io + SQLiteの超効率インフラで、浮いたコストはすべてプロダクト改善に還元します。</p>
      </div>
      <div class="about-card">
        <h3>貢献 = 認定</h3>
        <p>コード、アイデア、フィードバック、翻訳、バグ報告。どんな小さな貢献もEBRトークンで記録・認定。ガバナンス参加権として正当に還元されます。</p>
      </div>
    </div>
  </div>
</section>

<section class="cta-band reveal">
  <div class="container">
    <p class="cta-band-text">コードを書いても、書かなくても。すべての貢献がDAOの力に。</p>
    <div class="cta-band-actions">
      <a href="/dao" class="btn btn-primary">コミュニティに参加する</a>
      <a href="/token" class="btn btn-secondary">EBRトークンを見る</a>
    </div>
  </div>
</section>

<section class="section reveal">
  <div class="container">
    <p class="section-label">Founder</p>
    <div class="founder-card">
      <img src="https://avatars.githubusercontent.com/yukihamada" alt="Yuki Hamada" class="founder-avatar" loading="lazy">
      <div class="founder-info">
        <h3>Yuki Hamada</h3>
        <p>EnablerDAO創設者。1人+AIで8つのプロダクトを運営するエンジニア。テクノロジーで社会を良くすることを信じて。</p>
        <div class="founder-links">
          <a href="https://github.com/yukihamada" target="_blank">GitHub</a>
          <a href="https://x.com/yukihamada" target="_blank">X</a>
          <a href="https://yukihamada.jp" target="_blank">Web</a>
        </div>
      </div>
    </div>
  </div>
</section>

{newsletter}"#,
        newsletter = NEWSLETTER_CTA_HTML,
    )
}
