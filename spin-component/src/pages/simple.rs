/// Dashboard KPI page with inline JavaScript for fetching metrics.
pub fn render_dashboard() -> String {
    r##"<section class="section">
  <div class="container">
    <div class="page-header">
      <h1 class="page-title prompt">$ dashboard --kpi</h1>
    </div>

    <div class="kpi-grid" id="kpi-grid">
      <div class="kpi-card">
        <span class="kpi-label">Total Users</span>
        <span class="kpi-value" id="kpi-users">--</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Paid Subs</span>
        <span class="kpi-value" id="kpi-paid">--</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">MRR (JPY)</span>
        <span class="kpi-value" id="kpi-mrr-jpy">--</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Monthly Cost</span>
        <span class="kpi-value" id="kpi-cost">--</span>
      </div>
    </div>

    <div class="dashboard-sections">
      <div class="terminal-box">
        <h3>Infrastructure</h3>
        <div id="infra-breakdown"></div>
      </div>

      <div class="terminal-box">
        <h3>Community</h3>
        <div id="community-stats"></div>
      </div>
    </div>
  </div>
</section>
<script>
fetch('/api/metrics').then(r=>r.json()).then(d=>{
  document.getElementById('kpi-users').textContent=d.users.total;
  document.getElementById('kpi-paid').textContent=d.users.paid;
  document.getElementById('kpi-mrr-jpy').textContent='\u00a5'+d.revenue.mrr_jpy.toLocaleString();
  document.getElementById('kpi-cost').textContent='$'+d.infrastructure.monthly_cost_usd;

  const infra=d.infrastructure.services;
  let html='<table class="data-table"><tbody>';
  Object.entries(infra).forEach(([k,v])=>{html+='<tr><td>'+k+'</td><td>$'+v+'</td></tr>';});
  html+='</tbody></table>';
  document.getElementById('infra-breakdown').innerHTML=html;

  const comm=d.community;
  document.getElementById('community-stats').innerHTML=
    '<table class="data-table"><tbody>'+
    '<tr><td>EBR Holders</td><td>'+comm.ebr_holders+'</td></tr>'+
    '<tr><td>GitHub Stars</td><td>'+comm.github_stars+'</td></tr>'+
    '<tr><td>Repositories</td><td>'+comm.github_repos+'</td></tr>'+
    '</tbody></table>';
}).catch(()=>{});
</script>"##
        .to_string()
}

/// Q&A form and list page.
pub fn render_qa() -> String {
    r#"<section class="section">
  <div class="container">
    <div class="page-header">
      <h1 class="page-title prompt">$ qa --list</h1>
      <p class="page-subtitle">EnablerDAOに関する質問をお気軽にどうぞ</p>
    </div>

    <div class="terminal-box">
      <h3 class="form-title">$ qa new</h3>
      <form id="qa-form" class="idea-form">
        <div class="form-group">
          <label for="qa-question">質問</label>
          <textarea id="qa-question" name="question" rows="3" required placeholder="聞きたいことを入力..."></textarea>
        </div>
        <div class="form-group">
          <label for="qa-asker">ニックネーム</label>
          <input type="text" id="qa-asker" name="asker" placeholder="匿名">
        </div>
        <button type="submit" class="btn btn-primary">質問する</button>
      </form>
      <p class="form-status" id="qa-status"></p>
    </div>

    <div class="qa-list" id="qa-list">
      <p class="loading-text">読み込み中...</p>
    </div>
  </div>
</section>"#
        .to_string()
}

/// Metrics tables page showing revenue, users, properties, and infrastructure.
pub fn render_metrics() -> String {
    r#"<section class="section">
  <div class="container">
    <div class="page-header">
      <h1 class="page-title prompt">$ metrics --all</h1>
    </div>

    <div class="metrics-grid">
      <div class="terminal-box">
        <h3>Revenue</h3>
        <table class="data-table">
          <tbody>
            <tr><td>MRR</td><td>¥57,150</td></tr>
            <tr><td>有料会員</td><td>18人</td></tr>
            <tr><td>転換率</td><td>4.2%</td></tr>
          </tbody>
        </table>
      </div>

      <div class="terminal-box">
        <h3>Users</h3>
        <table class="data-table">
          <tbody>
            <tr><td>総ユーザー</td><td>424人</td></tr>
            <tr><td>Chatweb.ai</td><td>424人</td></tr>
            <tr><td>StayFlow UV</td><td>1,860/月</td></tr>
          </tbody>
        </table>
      </div>

      <div class="terminal-box">
        <h3>Properties</h3>
        <table class="data-table">
          <tbody>
            <tr><td>運用物件</td><td>4棟</td></tr>
            <tr><td>累計予約</td><td>58件</td></tr>
            <tr><td>平均稼働率</td><td>86%</td></tr>
          </tbody>
        </table>
      </div>

      <div class="terminal-box">
        <h3>Infrastructure</h3>
        <table class="data-table">
          <tbody>
            <tr><td>月額コスト</td><td>$142</td></tr>
            <tr><td>LLMコスト</td><td>$52/月</td></tr>
            <tr><td>稼働率</td><td>99.9%</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</section>"#
        .to_string()
}

/// Service status page showing uptime for all services.
pub fn render_status() -> String {
    r#"<section class="section">
  <div class="container">
    <div class="page-header">
      <h1 class="page-title prompt">$ status --all</h1>
      <p class="page-subtitle">全システム正常稼働中</p>
    </div>

    <div class="status-list">
      <div class="status-row">
        <span class="status-active">●</span>
        <span class="status-name">chatweb.ai</span>
        <span class="status-detail">Lambda v150 / 9 providers</span>
      </div>
      <div class="status-row">
        <span class="status-active">●</span>
        <span class="status-name">enablerdao.com</span>
        <span class="status-detail">Fly.io / nrt region</span>
      </div>
      <div class="status-row">
        <span class="status-active">●</span>
        <span class="status-name">stayflowapp.com</span>
        <span class="status-detail">Lovable / Cloudflare</span>
      </div>
      <div class="status-row">
        <span class="status-active">●</span>
        <span class="status-name">jiuflow.art</span>
        <span class="status-detail">Fly.io / Rust SSR</span>
      </div>
      <div class="status-row">
        <span class="status-active">●</span>
        <span class="status-name">API Gateway</span>
        <span class="status-detail">4 domains connected</span>
      </div>
      <div class="status-row">
        <span class="status-active">●</span>
        <span class="status-name">DynamoDB</span>
        <span class="status-detail">122,598 records</span>
      </div>
      <div class="status-row">
        <span class="status-active">●</span>
        <span class="status-name">Stripe</span>
        <span class="status-detail">Live / Webhook active</span>
      </div>
      <div class="status-row">
        <span class="status-active">●</span>
        <span class="status-name">Beds24 API</span>
        <span class="status-detail">7 properties accessible</span>
      </div>
      <div class="status-row">
        <span class="status-active">●</span>
        <span class="status-name">Nemotron Pod</span>
        <span class="status-detail">RunPod / 8K context</span>
      </div>
    </div>
  </div>
</section>"#
        .to_string()
}
