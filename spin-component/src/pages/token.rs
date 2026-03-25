use crate::layout::NEWSLETTER_CTA_HTML;

pub fn render() -> String {
    format!(
        r##"<!-- Hero -->
<section class="hero" style="padding: 80px 0 40px;">
  <div class="container">
    <div class="hero-box animate-fade-in-up">
      <div class="hero-badge"><span class="pulse-dot"></span> Solana Mainnet</div>
      <h1 class="hero-title">EnablerDAO<br><span class="gradient-text">Token Economy</span></h1>
      <p class="hero-desc">3つのトークンが、それぞれ異なる役割を担う。<br>ガバナンス・AI犬の進化・AIユーティリティ。</p>
    </div>
  </div>
</section>

<!-- 3 Token Cards -->
<section class="section reveal">
  <div class="container">
    <div class="token-cards-3">
      <div class="token-card-main" style="border-color: rgba(74, 222, 128, 0.25);">
        <div class="token-card-badge" style="background: rgba(74, 222, 128, 0.1); color: var(--green);">Governance</div>
        <h2 class="token-card-name" style="color: var(--green);">EBR</h2>
        <p class="token-card-supply">供給: 7,021,100</p>
        <p class="token-card-purpose">DAOの意思決定に使うガバナンストークン。貢献者に配布される。</p>
        <a href="https://solscan.io/token/E1JxwaWRd8nw8vDdWMdqwdbXGBshqDcnTcinHzNMqg2Y" target="_blank" class="token-card-link" style="color: var(--green);">Solscan →</a>
      </div>
      <div class="token-card-main" style="border-color: rgba(251, 191, 36, 0.25);">
        <div class="token-card-badge" style="background: rgba(251, 191, 36, 0.1); color: var(--amber);">AI Dog Fuel</div>
        <h2 class="token-card-name" style="color: var(--amber);">BONE</h2>
        <p class="token-card-supply">供給: 1,000,000（バーンで減少）</p>
        <p class="token-card-purpose">AI犬の進化燃料。消費されると永久バーン。保有量でチャットTierが決まる。</p>
        <a href="https://solscan.io/token/GoM5XaF8fqdCypMGd3ULF7ynjkjQ7rv5kai2dD88aPSM" target="_blank" class="token-card-link" style="color: var(--amber);">Solscan →</a>
      </div>
      <div class="token-card-main" style="border-color: rgba(68, 136, 255, 0.25);">
        <div class="token-card-badge" style="background: rgba(68, 136, 255, 0.1); color: #4488ff;">AI Utility</div>
        <h2 class="token-card-name" style="color: #4488ff;">ENAI</h2>
        <p class="token-card-supply">供給: 1,000,000,000</p>
        <p class="token-card-purpose">AIサービスの利用・決済に特化。プラットフォーム内ユーティリティとして実装予定。</p>
        <a href="https://solscan.io/token/8CeusiVAeibuBGv5xcf7kt7JQZzqwTS5pD7u2CfyoWnL" target="_blank" class="token-card-link" style="color: #4488ff;">Solscan →</a>
      </div>
    </div>

    <div class="terminal-box" style="border-color: rgba(251, 191, 36, 0.2); background: rgba(251, 191, 36, 0.02); margin-top: 20px; text-align: center;">
      <p style="color: var(--dim); font-size: 13px;">&#9888;&#65039; これらはDAOの運営・AIシステム内で使用されるユーティリティトークンです。投資商品ではなく、価値の保証はありません。EnablerDAOはトークンの売買・交換サービスを提供しません。Mint Authorityは初期配布完了後に無効化予定です。</p>
    </div>
  </div>
</section>

<!-- Token Role Map -->
<section class="section section-alt reveal">
  <div class="container">
    <p class="section-label">Role Separation</p>
    <h2 class="section-title">各トークンの役割</h2>
    <p class="section-subtitle">3つのトークンは明確に役割が分離されています</p>

    <div class="terminal-box" style="margin-bottom: 24px;">
      <table class="data-table">
        <thead>
          <tr><th>トークン</th><th>目的</th><th>供給</th><th>供給変動</th></tr>
        </thead>
        <tbody>
          <tr>
            <td style="color: var(--green); font-weight: 600;">EBR</td>
            <td>ガバナンス・投票</td>
            <td style="font-family: var(--mono);">7,021,100</td>
            <td>配布中（Mint有効）</td>
          </tr>
          <tr>
            <td style="color: var(--amber); font-weight: 600;">BONE</td>
            <td>AI犬の進化・チャットTier</td>
            <td style="font-family: var(--mono);">1,000,000</td>
            <td>バーンで減少予定</td>
          </tr>
          <tr>
            <td style="color: #4488ff; font-weight: 600;">ENAI</td>
            <td>AIサービス利用・Agent決済（予定）</td>
            <td style="font-family: var(--mono);">1,000,000,000</td>
            <td>固定供給目標</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</section>

<!-- EBR Detail -->
<section class="section reveal">
  <div class="container">
    <p class="section-label">EBR Token</p>
    <h2 class="section-title">EBRの獲得方法</h2>
    <p class="section-subtitle">プロダクトを使う・作る・広めることでEBRを獲得できます</p>

    <div class="terminal-box" style="margin-bottom: 24px;">
      <table class="data-table">
        <thead>
          <tr><th>Chatweb.ai プラン</th><th>月額</th><th>EBR/月</th><th>クレジット</th></tr>
        </thead>
        <tbody>
          <tr><td>Free</td><td>$0</td><td style="color: var(--dim);">—</td><td>100</td></tr>
          <tr><td>Starter</td><td>$9</td><td style="color: var(--green); font-weight: 600;">50 EBR</td><td>5,000</td></tr>
          <tr><td>Pro</td><td>$29</td><td style="color: var(--green); font-weight: 600;">200 EBR</td><td>20,000</td></tr>
        </tbody>
      </table>
    </div>

    <div class="earn-methods">
      <div class="earn-item"><span class="earn-icon">&#128221;</span><span>コード貢献 — GitHub PRでEBR付与</span></div>
      <div class="earn-item"><span class="earn-icon">&#128161;</span><span>アイデア投稿 — 採用時にボーナス</span></div>
      <div class="earn-item"><span class="earn-icon">&#128027;</span><span>バグ報告 — 発見・修正に報酬</span></div>
      <div class="earn-item"><span class="earn-icon">&#128214;</span><span>ドキュメント — 翻訳・改善に報酬</span></div>
    </div>

    <h3 style="color: var(--bright); margin: 32px 0 16px; font-size: 17px;">EBR配分目標</h3>
    <p style="color: var(--dim); font-size: 13px; margin-bottom: 16px;">※ 現在配布進行中。Mint Authority有効のため供給量は変動します。初期配布完了後にMint Authorityを無効化し、供給を確定させます。</p>
    <div class="allocation-bars">
      <div class="alloc-row">
        <span class="alloc-label">コミュニティ報酬</span>
        <div class="alloc-bar"><div class="alloc-fill" style="width: 40%; background: var(--green);"></div></div>
        <span class="alloc-pct" style="color: var(--green);">40%</span>
      </div>
      <div class="alloc-row">
        <span class="alloc-label">開発チーム</span>
        <div class="alloc-bar"><div class="alloc-fill" style="width: 25%; background: var(--cyan);"></div></div>
        <span class="alloc-pct" style="color: var(--cyan);">25%</span>
      </div>
      <div class="alloc-row">
        <span class="alloc-label">エコシステム基金</span>
        <div class="alloc-bar"><div class="alloc-fill" style="width: 20%; background: var(--amber);"></div></div>
        <span class="alloc-pct" style="color: var(--amber);">20%</span>
      </div>
      <div class="alloc-row">
        <span class="alloc-label">パートナー・アドバイザー</span>
        <div class="alloc-bar"><div class="alloc-fill" style="width: 15%; background: var(--violet);"></div></div>
        <span class="alloc-pct" style="color: var(--violet);">15%</span>
      </div>
    </div>

    <div style="margin-top: 16px;">
      <p class="mono-text" style="font-size: 11px; color: var(--dim);">Mint: E1JxwaWRd8nw8vDdWMdqwdbXGBshqDcnTcinHzNMqg2Y</p>
    </div>
  </div>
</section>

<!-- BONE & Dog Pack -->
<section class="section section-alt reveal">
  <div class="container">
    <p class="section-label">BONE &amp; Dog Pack</p>
    <h2 class="section-title">AI犬がBONEを食べて進化する</h2>
    <p class="section-subtitle">BONEは消費されるとバーンされ、供給が減少していくデフレ設計です</p>

    <!-- Dog Pack Visual -->
    <div class="dog-pack-row">
      <div class="dog-card">
        <span class="dog-avatar">&#128021;</span>
        <span class="dog-name" style="color: var(--green);">Bossdog</span>
        <span class="dog-role">統括</span>
      </div>
      <div class="dog-card">
        <span class="dog-avatar">&#129454;</span>
        <span class="dog-name" style="color: #ff88cc;">Motherdog</span>
        <span class="dog-role">ケア</span>
      </div>
      <div class="dog-card">
        <span class="dog-avatar">&#128737;&#65039;</span>
        <span class="dog-name" style="color: var(--red);">Guarddog</span>
        <span class="dog-role">警備</span>
      </div>
      <div class="dog-card">
        <span class="dog-avatar">&#129454;</span>
        <span class="dog-name" style="color: #4488ff;">Guidedog</span>
        <span class="dog-role">ガイド</span>
      </div>
      <div class="dog-card">
        <span class="dog-avatar">&#128269;</span>
        <span class="dog-name" style="color: var(--violet);">Debugdog</span>
        <span class="dog-role">デバッグ</span>
      </div>
    </div>

    <!-- BONE Flow -->
    <h3 style="color: var(--bright); margin: 0 0 16px; font-size: 17px; text-align: center;">BONEのライフサイクル</h3>
    <div class="bone-flow">
      <div class="bone-flow-step">
        <div class="bone-flow-icon">&#129460;</div>
        <div class="bone-flow-text">
          <strong>BONEを入手</strong>
          <span>DEXで購入 or 報酬</span>
        </div>
      </div>
      <div class="bone-flow-arrow">→</div>
      <div class="bone-flow-step">
        <div class="bone-flow-icon">&#128021;</div>
        <div class="bone-flow-text">
          <strong>犬にあげる</strong>
          <span>Dog Packウォレットへ</span>
        </div>
      </div>
      <div class="bone-flow-arrow">→</div>
      <div class="bone-flow-step">
        <div class="bone-flow-icon">&#128293;</div>
        <div class="bone-flow-text">
          <strong>Burn</strong>
          <span>永久に消滅</span>
        </div>
      </div>
      <div class="bone-flow-arrow">→</div>
      <div class="bone-flow-step">
        <div class="bone-flow-icon">&#129516;</div>
        <div class="bone-flow-text">
          <strong>犬が進化</strong>
          <span>コードを自己改善</span>
        </div>
      </div>
    </div>

    <div class="terminal-box" style="margin-top: 24px;">
      <table class="data-table">
        <thead>
          <tr><th>パラメータ</th><th>値</th></tr>
        </thead>
        <tbody>
          <tr><td>初期供給</td><td style="font-family: var(--mono);">1,000,000 BONE</td></tr>
          <tr><td>進化コスト</td><td style="font-family: var(--mono);">10 BONE / 回</td></tr>
          <tr><td>進化上限</td><td style="font-family: var(--mono);">3回 / 日 / 犬</td></tr>
          <tr><td>最大日次バーン</td><td style="font-family: var(--mono);">150 BONE（5犬 × 3回 × 10）</td></tr>
          <tr><td>入手方法</td><td>Jupiter DEX / Dog Packアクティビティ報酬</td></tr>
        </tbody>
      </table>
    </div>

    <div style="text-align: center; margin-top: 16px;">
      <p class="mono-text" style="font-size: 11px; color: var(--dim);">Dog Pack Wallet: HceVvNPDroeDY1Tvb4GFkBSN15KLVdWPuXEYhZY1w4gG</p>
      <p class="mono-text" style="font-size: 11px; color: var(--dim);">BONE Mint: GoM5XaF8fqdCypMGd3ULF7ynjkjQ7rv5kai2dD88aPSM</p>
    </div>
  </div>
</section>

<!-- Chat Tier -->
<section class="section reveal">
  <div class="container">
    <p class="section-label">Chat Tiers</p>
    <h2 class="section-title">BONE保有でチャットをアンロック</h2>
    <p class="section-subtitle">BONEの保有量に応じて、AI犬とのチャット機能が解放されます</p>

    <div class="tier-grid">
      <div class="terminal-box tier-box">
        <div class="tier-header">
          <span style="font-size: 28px;">&#128062;</span>
          <h3 style="color: var(--dim);">Guest</h3>
          <span class="tier-req">BONE 不要</span>
        </div>
        <ul class="tier-features">
          <li class="tier-yes">5メッセージ/日</li>
          <li class="tier-yes">Nemotron-9B</li>
          <li class="tier-no">モデル選択</li>
          <li class="tier-no">自己進化</li>
        </ul>
      </div>
      <div class="terminal-box tier-box tier-recommended">
        <div class="tier-badge-rec">おすすめ</div>
        <div class="tier-header">
          <span style="font-size: 28px;">&#129460;</span>
          <h3 style="color: var(--green);">Holder</h3>
          <span class="tier-req" style="color: var(--green);">100+ BONE</span>
        </div>
        <ul class="tier-features">
          <li class="tier-yes"><strong>無制限</strong>メッセージ</li>
          <li class="tier-yes"><strong>全モデル</strong> Claude/GPT/Gemini</li>
          <li class="tier-yes">メモリ &amp; セッション</li>
          <li class="tier-no">自己進化</li>
        </ul>
      </div>
      <div class="terminal-box tier-box">
        <div class="tier-header">
          <span style="font-size: 28px;">&#128081;</span>
          <h3 style="color: var(--violet);">Loyal</h3>
          <span class="tier-req" style="color: var(--violet);">10,000+ BONE</span>
        </div>
        <ul class="tier-features">
          <li class="tier-yes">Holder全機能</li>
          <li class="tier-yes"><strong>自己進化</strong>（コード変更）</li>
          <li class="tier-yes"><strong>優先</strong>処理</li>
          <li class="tier-yes">ロイヤリティモード</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- ENAI -->
<section class="section section-alt reveal">
  <div class="container">
    <p class="section-label">ENAI Token</p>
    <h2 class="section-title">ENAI — AIサービスのユーティリティ</h2>
    <p class="section-subtitle">AIサービスの利用・決済に特化したユーティリティトークン</p>

    <div class="about-grid" style="grid-template-columns: repeat(2, 1fr);">
      <div class="about-card">
        <h3>&#9889; プラットフォーム内利用</h3>
        <p>chatweb.ai内での機能アクセスやサービス利用のためのユーティリティトークンとして設計中です。（実装予定）</p>
      </div>
      <div class="about-card">
        <h3>&#129302; Agent間シグナル</h3>
        <p>AIエージェント同士がタスクの優先度やリソース配分をENAIで表現する仕組みを構築中です。</p>
      </div>
      <div class="about-card">
        <h3>&#128225; ノード運営の対価</h3>
        <p>分散推論インフラのノード運営という労務に対する対価として付与を予定しています。投資リターンではありません。</p>
      </div>
      <div class="about-card">
        <h3>&#128274; オープン設計</h3>
        <p>SPLトークン標準準拠。Solana上のDEXやウォレットで自由に移転可能です。EnablerDAOは売買を仲介しません。</p>
      </div>
    </div>

    <div style="text-align: center; margin-top: 16px;">
      <p class="mono-text" style="font-size: 11px; color: var(--dim);">ENAI Mint: 8CeusiVAeibuBGv5xcf7kt7JQZzqwTS5pD7u2CfyoWnL</p>
      <p class="mono-text" style="font-size: 11px; color: var(--dim);">Treasury: DK29rBGCvP83LUNjUGVM6xt6qPy6rycBFopXbFkg9XvQ</p>
    </div>
  </div>
</section>

<!-- Transparency -->
<section class="section reveal">
  <div class="container">
    <p class="section-label">Transparency</p>
    <h2 class="section-title">オンチェーンの現状</h2>
    <p class="section-subtitle">すべてのデータはSolanaブロックチェーン上で検証可能です</p>

    <div class="terminal-box">
      <table class="data-table">
        <thead>
          <tr><th>項目</th><th>EBR</th><th>BONE</th><th>ENAI</th></tr>
        </thead>
        <tbody>
          <tr><td>現在の供給量</td><td style="font-family: var(--mono);">7,021,100</td><td style="font-family: var(--mono);">1,000,000</td><td style="font-family: var(--mono);">1,000,000,000</td></tr>
          <tr><td>Decimals</td><td style="font-family: var(--mono);">9</td><td style="font-family: var(--mono);">9</td><td style="font-family: var(--mono);">6</td></tr>
          <tr><td>Mint Authority</td><td style="color: var(--amber);">有効（配布中）</td><td style="color: var(--amber);">有効（配布中）</td><td style="color: var(--amber);">有効（配布中）</td></tr>
          <tr><td>Freeze Authority</td><td style="color: var(--amber);">有効</td><td style="color: var(--amber);">有効</td><td style="color: var(--amber);">有効</td></tr>
          <tr><td>累計バーン</td><td>—</td><td style="font-family: var(--mono);">0</td><td>—</td></tr>
        </tbody>
      </table>
    </div>

    <div class="terminal-box" style="margin-top: 16px; border-color: rgba(74, 222, 128, 0.15); background: rgba(74, 222, 128, 0.02);">
      <h4 style="color: var(--green); font-size: 15px; margin-bottom: 8px;">ロードマップ</h4>
      <ul style="list-style: none; padding: 0;">
        <li style="color: var(--dim); font-size: 14px; padding: 4px 0;"><span style="color: var(--amber);">&#9723;</span> EBRの初期配布完了 → Mint Authority無効化</li>
        <li style="color: var(--dim); font-size: 14px; padding: 4px 0;"><span style="color: var(--amber);">&#9723;</span> Freeze Authority全トークン無効化</li>
        <li style="color: var(--dim); font-size: 14px; padding: 4px 0;"><span style="color: var(--amber);">&#9723;</span> Dog PackバーンメカニズムをSolanaプログラムで実装</li>
        <li style="color: var(--dim); font-size: 14px; padding: 4px 0;"><span style="color: var(--amber);">&#9723;</span> BONE Tier自動検証（ウォレット接続 → チャット解放）</li>
        <li style="color: var(--dim); font-size: 14px; padding: 4px 0;"><span style="color: var(--amber);">&#9723;</span> ENAI のプラットフォーム内ユーティリティ実装</li>
      </ul>
    </div>
  </div>
</section>

<!-- How to Start -->
<section class="cta-band reveal">
  <div class="container">
    <p class="cta-band-text">トークンエコノミーに参加する</p>
    <div class="start-steps">
      <div class="start-step">
        <span class="start-num">1</span>
        <span><a href="https://chatweb.ai" target="_blank">Chatweb.ai</a> を使ってEBRを獲得</span>
      </div>
      <div class="start-step">
        <span class="start-num">2</span>
        <span><a href="https://solscan.io/token/GoM5XaF8fqdCypMGd3ULF7ynjkjQ7rv5kai2dD88aPSM" target="_blank">BONE</a> を入手してチャットTierを解放</span>
      </div>
      <div class="start-step">
        <span class="start-num">3</span>
        <span><a href="https://rustdog-spin.fly.dev/" target="_blank">Dog Pack</a> でAI犬と対話</span>
      </div>
    </div>
    <div class="cta-band-actions" style="margin-top: 24px;">
      <a href="https://chatweb.ai" target="_blank" class="btn btn-primary">Chatweb.ai を試す</a>
      <a href="https://github.com/yukihamada" target="_blank" class="btn btn-secondary">GitHub で貢献</a>
    </div>
  </div>
</section>

{newsletter}"##,
        newsletter = NEWSLETTER_CTA_HTML,
    )
}
