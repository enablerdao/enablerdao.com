pub fn render() -> String {
    r#"<section class="section">
  <div class="container">
    <div class="page-header">
      <h1 class="page-title prompt">$ dao --status</h1>
      <div class="quick-stats">
        <span class="stat-badge">Treasury: $142/月</span>
        <span class="stat-badge">Net Revenue: ¥57,150</span>
        <span class="stat-badge">82 EBRホルダー</span>
      </div>
    </div>

    <div class="dao-tabs">
      <button class="tab-btn active" data-tab="advisory">Advisory Board</button>
      <button class="tab-btn" data-tab="proposals">Proposals</button>
      <button class="tab-btn" data-tab="treasury">Treasury</button>
      <button class="tab-btn" data-tab="contributors">Contributors</button>
    </div>

    <div class="tab-content active" id="tab-advisory">
      <h2 class="section-title">Virtual Advisory Board</h2>
      <div class="advisory-sessions">
        <div class="advisory-card">
          <h3>Session 1 — Strategy Review</h3>
          <p class="advisory-members">Vitalik Buterin, Elon Musk, Jack Dorsey</p>
          <div class="advisory-consensus">
            <h4>3つの合意点:</h4>
            <ol>
              <li><strong>フォーカス</strong> — StayFlowに集中してPMFを証明</li>
              <li><strong>段階的分散化</strong> — 有料顧客10人超えてからガバナンス設計</li>
              <li><strong>プロトコル思考</strong> — 共通レイヤーをオープンプロトコルに</li>
            </ol>
          </div>
          <a href="/blog/virtual-advisory-board-2026-03-18" class="btn btn-secondary">議事録を読む →</a>
        </div>
        <div class="advisory-card">
          <h3>Session 2 — AI Autonomy</h3>
          <p class="advisory-members">Andrej Karpathy, Dario Amodei, George Hotz</p>
          <div class="advisory-consensus">
            <h4>決定事項:</h4>
            <ol>
              <li><strong>AI Orchestrator</strong> — タスク分解+優先順位のAIエージェント構築</li>
              <li><strong>3層Trust Hierarchy</strong> — AI自律/非同期承認/リアルタイム承認</li>
              <li><strong>StayFlow集中</strong> — 他プロダクトはAI自律メンテナンスモード</li>
            </ol>
          </div>
          <a href="/blog/ai-autonomy-advisory-board-2026-03-25" class="btn btn-secondary">議事録を読む →</a>
        </div>
      </div>
    </div>

    <div class="tab-content" id="tab-proposals">
      <h2 class="section-title">Proposals</h2>
      <div class="proposals-list">
        <div class="proposal-card">
          <div class="proposal-header">
            <span class="proposal-id">EDP-001</span>
            <span class="proposal-status status-active">Active</span>
          </div>
          <h3>全プロダクト Rust + Fly.io + SQLite 統一アーキテクチャ移行</h3>
          <p>Lovable/Supabase依存からRust統一基盤へ移行。axum 0.7 + rusqlite + Fly.io nrt。</p>
          <div class="proposal-votes">
            <span class="vote-for">賛成: 89</span>
            <span class="vote-against">反対: 3</span>
            <span class="vote-abstain">棄権: 8</span>
          </div>
          <p class="proposal-meta">投票資格: EBR保有者 | 期限: 2026-03-31</p>
        </div>
        <div class="proposal-card">
          <div class="proposal-header">
            <span class="proposal-id">EDP-002</span>
            <span class="proposal-status status-pending">Pending</span>
          </div>
          <h3>EBR トークン配布ルールの改定</h3>
          <p>Quadratic Voting導入。貢献ベースの公平なガバナンス配分を実現。</p>
          <div class="proposal-votes">
            <span class="vote-for">賛成: 45</span>
            <span class="vote-against">反対: 12</span>
            <span class="vote-abstain">棄権: 20</span>
          </div>
          <p class="proposal-meta">投票資格: EBR保有者 | 期限: 2026-04-30</p>
        </div>
        <div class="proposal-card">
          <div class="proposal-header">
            <span class="proposal-id">EDP-003</span>
            <span class="proposal-status status-active">Active</span>
          </div>
          <h3>StayFlow / Chatweb.ai / JiuFlow 3スター集中戦略</h3>
          <p>開発リソースをFlagship 3プロダクトに集中。他プロダクトはAI自律メンテナンスモード。</p>
          <div class="proposal-votes">
            <span class="vote-for">賛成: 72</span>
            <span class="vote-against">反対: 15</span>
            <span class="vote-abstain">棄権: 13</span>
          </div>
          <p class="proposal-meta">投票資格: EBR保有者 | 期限: 2026-03-31</p>
        </div>
      </div>
    </div>

    <div class="tab-content" id="tab-treasury">
      <h2 class="section-title">Treasury</h2>
      <div class="treasury-overview">
        <h3>月次コスト構造</h3>
        <table class="data-table">
          <thead>
            <tr><th>カテゴリ</th><th>月額</th></tr>
          </thead>
          <tbody>
            <tr><td>AWS (Lambda, API Gateway, DynamoDB)</td><td>$45</td></tr>
            <tr><td>Fly.io (5 apps)</td><td>$25</td></tr>
            <tr><td>Domains (5)</td><td>$8</td></tr>
            <tr><td>Stripe fees</td><td>$12</td></tr>
            <tr><td>LLM API costs</td><td>$52</td></tr>
            <tr class="total-row"><td><strong>合計</strong></td><td><strong>$142/月</strong></td></tr>
          </tbody>
        </table>
      </div>
      <div class="treasury-revenue">
        <h3>月間収益</h3>
        <table class="data-table">
          <thead>
            <tr><th>ソース</th><th>月額</th></tr>
          </thead>
          <tbody>
            <tr><td>Chatweb.ai サブスクリプション</td><td>¥57,150</td></tr>
            <tr><td>物件予約手数料</td><td>変動</td></tr>
            <tr class="total-row"><td><strong>MRR</strong></td><td><strong>¥57,150</strong></td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="tab-content" id="tab-contributors">
      <h2 class="section-title">Contributors</h2>
      <div class="contributors-list">
        <table class="data-table">
          <thead>
            <tr><th>Rank</th><th>Address</th><th>Contributions</th><th>EBR（ガバナンス）</th></tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>yuki.sol</td><td>1,247</td><td>4,600,000</td></tr>
            <tr><td>2</td><td>contributor-1</td><td>156</td><td>500,000</td></tr>
            <tr><td>3</td><td>contributor-2</td><td>89</td><td>200,000</td></tr>
            <tr><td>4-82</td><td>その他 79ホルダー</td><td>—</td><td>1,721,100</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</section>"#
        .to_string()
}
