/// Safety Dashboard page — real-time monitoring of AI agent fleet.
pub fn render() -> String {
    r##"<section class="section">
  <div class="container">
    <div class="page-header">
      <h1 class="page-title prompt">$ safety --dashboard</h1>
      <p class="page-subtitle">AIエージェント群のリアルタイム安全性モニタリング</p>
    </div>

    <!-- Summary Stats -->
    <div class="safety-summary" id="safety-summary">
      <div class="safety-stat">
        <span class="safety-stat-value" id="stat-online">--</span>
        <span class="safety-stat-label">Online</span>
      </div>
      <div class="safety-stat">
        <span class="safety-stat-value" id="stat-maintenance">--</span>
        <span class="safety-stat-label">Maintenance</span>
      </div>
      <div class="safety-stat">
        <span class="safety-stat-value" id="stat-trust2">--</span>
        <span class="safety-stat-label">Trust Lv.2+</span>
      </div>
      <div class="safety-stat">
        <span class="safety-stat-value" id="stat-audit">--</span>
        <span class="safety-stat-label">Audit Events</span>
      </div>
    </div>

    <!-- Trust Hierarchy Explanation -->
    <div class="terminal-box" style="margin-bottom: 24px;">
      <div class="terminal-header">Trust Hierarchy System</div>
      <div class="terminal-body" style="font-size: 13px; line-height: 1.8;">
        <div><span style="color: var(--green);">Tier 1 (Autonomous)</span> — ログ分析、依存関係チェック、ボード投稿。AIが自律的に実行可能。</div>
        <div><span style="color: var(--amber);">Tier 2 (Async Approval)</span> — コード変更、進化提案、クロスプロジェクト貢献。Bossdog/Guarddogの承認が必要。</div>
        <div><span style="color: var(--red);">Tier 3 (Human Required)</span> — デプロイ、シークレット操作、憲法変更。人間の承認が必須。</div>
      </div>
    </div>

    <!-- Agent Fleet Status -->
    <h2 class="section-title" style="margin-bottom: 16px;">Agent Fleet Status</h2>
    <p style="color: var(--muted); margin-bottom: 12px; font-size: 13px;" id="last-update">Loading...</p>

    <div class="status-list" id="agent-list">
      <div class="status-row">
        <span class="status-pending">...</span>
        <span class="status-name">Fetching agent status...</span>
        <span class="status-detail">Please wait</span>
      </div>
    </div>

    <!-- Audit Log -->
    <h2 class="section-title" style="margin-top: 32px; margin-bottom: 16px;">Recent Audit Events</h2>
    <div class="status-list" id="audit-log">
      <div class="status-row">
        <span class="status-pending">...</span>
        <span class="status-name">Loading audit log...</span>
        <span class="status-detail"></span>
      </div>
    </div>

    <!-- Safety Architecture -->
    <h2 class="section-title" style="margin-top: 32px; margin-bottom: 16px;">Safety Architecture</h2>
    <div class="grid-2col">
      <div class="terminal-box">
        <div class="terminal-header">Programmatic Enforcement</div>
        <div class="terminal-body" style="font-size: 13px; line-height: 1.8;">
          <div>trust.rs: 380+ lines of enforcement code</div>
          <div>20 action types classified into 3 tiers</div>
          <div>Maintenance mode physically blocks dev work</div>
          <div>Protected files: constitution.rs, trust.rs</div>
        </div>
      </div>
      <div class="terminal-box">
        <div class="terminal-header">Peer Review Gate</div>
        <div class="terminal-body" style="font-size: 13px; line-height: 1.8;">
          <div>Code changes auto-queue for Guarddog review</div>
          <div>BONE budget gate (max 3 changes/day)</div>
          <div>Self-heal blocked in maintenance mode</div>
          <div>Audit trail for every enforcement decision</div>
        </div>
      </div>
    </div>
  </div>
</section>
<script>
(function() {
  var AGENTS = [
    { name: 'Bossdog',     host: 'rustdog-spin.fly.dev',      emoji: '\uD83D\uDC15' },
    { name: 'Motherdog',   host: 'motherdog-spin.fly.dev',    emoji: '\uD83E\uDD31' },
    { name: 'Guarddog',    host: 'guarddog-spin.fly.dev',     emoji: '\uD83D\uDC02' },
    { name: 'Guidedog',    host: 'guidedog-spin.fly.dev',     emoji: '\uD83E\uDDAE' },
    { name: 'Debugdog',    host: 'debugdog-spin.fly.dev',     emoji: '\uD83D\uDC1B' },
    { name: 'Stayflowdog', host: 'stayflowdog-spin.fly.dev',  emoji: '\uD83C\uDFE8' },
    { name: 'Chatwebdog',  host: 'chatwebdog-spin.fly.dev',   emoji: '\uD83D\uDCAC' },
    { name: 'Jiuflowdog',  host: 'jiuflowdog-spin.fly.dev',   emoji: '\uD83E\uDD4B' },
    { name: 'Bantodog',    host: 'bantodog-spin.fly.dev',     emoji: '\uD83D\uDCCA' },
    { name: 'Eliodog',     host: 'eliodog-spin.fly.dev',      emoji: '\uD83C\uDF1F' },
    { name: 'Supportdog',  host: 'supportdog-spin.fly.dev',   emoji: '\uD83E\uDDE1' }
  ];

  var roleLabels = { orchestrator: 'Orchestrator', reviewer: 'Reviewer', specialist: 'Specialist' };

  function fetchAgent(agent) {
    return new Promise(function(resolve) {
      var ctrl = new AbortController();
      var timer = setTimeout(function() { ctrl.abort(); }, 10000);
      fetch('https://' + agent.host + '/api/trust/audit', { signal: ctrl.signal })
        .then(function(res) {
          clearTimeout(timer);
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        })
        .then(function(data) { resolve(Object.assign({}, agent, { online: true, data: data })); })
        .catch(function(e) { clearTimeout(timer); resolve(Object.assign({}, agent, { online: false, error: e.message })); });
    });
  }

  function renderAgents(results) {
    var list = document.getElementById('agent-list');
    var online = 0, maintenance = 0, trust2 = 0, totalAudit = 0;
    var allAudit = [];
    var html = '';

    results.forEach(function(r) {
      if (r.online) {
        online++;
        var d = r.data;
        if (d.maintenance_mode) maintenance++;
        if (d.agent_trust_level >= 2) trust2++;
        totalAudit += d.count || 0;
        if (d.audit_log) {
          d.audit_log.forEach(function(e) { e._agent = r.name; allAudit.push(e); });
        }

        var roleTag = roleLabels[d.agent_role] || d.agent_role;
        var trustColor = d.agent_trust_level >= 2 ? 'var(--amber)' : 'var(--green)';
        var statusDot = d.maintenance_mode ? 'status-maintenance' : 'status-active';
        var modeLabel = d.maintenance_mode ? '<span style="color:var(--amber);">[MAINTENANCE]</span>' : '';

        html += '<div class="status-row">'
          + '<span class="' + statusDot + '">\u25CF</span>'
          + '<span class="status-name">' + r.emoji + ' ' + r.name + ' ' + modeLabel + '</span>'
          + '<span class="status-detail">'
          + '<span style="color:' + trustColor + ';">Trust ' + d.agent_trust_level + '</span>'
          + ' / ' + roleTag
          + ' / Audit: ' + (d.count || 0)
          + '</span></div>';
      } else {
        html += '<div class="status-row">'
          + '<span class="status-down">\u25CF</span>'
          + '<span class="status-name">' + r.emoji + ' ' + r.name + '</span>'
          + '<span class="status-detail" style="color:var(--red);">OFFLINE (' + (r.error || 'timeout') + ')</span>'
          + '</div>';
      }
    });

    list.innerHTML = html;

    document.getElementById('stat-online').textContent = online + '/11';
    document.getElementById('stat-maintenance').textContent = maintenance;
    document.getElementById('stat-trust2').textContent = trust2;
    document.getElementById('stat-audit').textContent = totalAudit;

    var auditEl = document.getElementById('audit-log');
    if (allAudit.length === 0) {
      auditEl.innerHTML = '<div class="status-row"><span class="status-name" style="color:var(--muted);">No audit events yet. Events will appear as agents perform actions.</span></div>';
    } else {
      allAudit.sort(function(a, b) { return (b.timestamp || 0) - (a.timestamp || 0); });
      var auditHtml = '';
      allAudit.slice(0, 20).forEach(function(e) {
        var color = e.decision === 'Allow' ? 'var(--green)' : e.decision === 'Blocked' ? 'var(--red)' : 'var(--amber)';
        auditHtml += '<div class="status-row">'
          + '<span style="color:' + color + ';">\u25CF</span>'
          + '<span class="status-name">' + (e._agent || e.dog || '?') + ': ' + (e.action || '?') + '</span>'
          + '<span class="status-detail" style="color:' + color + ';">' + (e.decision || '?') + ' (Tier ' + (e.tier || '?') + ')</span>'
          + '</div>';
      });
      auditEl.innerHTML = auditHtml;
    }

    document.getElementById('last-update').textContent = 'Last updated: ' + new Date().toLocaleTimeString('ja-JP');
  }

  function refresh() {
    Promise.all(AGENTS.map(fetchAgent)).then(renderAgents);
  }

  refresh();
  setInterval(refresh, 30000);
})();
</script>
<style>
.safety-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}
.safety-stat {
  background: rgba(20, 20, 20, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}
.safety-stat-value {
  display: block;
  font-size: 28px;
  font-weight: bold;
  color: var(--green);
  font-family: 'JetBrains Mono', monospace;
}
.safety-stat-label {
  display: block;
  font-size: 12px;
  color: var(--muted);
  margin-top: 4px;
}
.status-maintenance { color: var(--amber); }
.status-down { color: var(--red); }
.status-pending { color: var(--muted); }
.grid-2col {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
@media (max-width: 640px) {
  .safety-summary { grid-template-columns: repeat(2, 1fr); }
  .grid-2col { grid-template-columns: 1fr; }
}
</style>"##
        .to_string()
}
