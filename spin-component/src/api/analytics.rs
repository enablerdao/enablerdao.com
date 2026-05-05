/// Analytics: log page views and serve a simple dashboard.
///
/// Storage: KV key `analytics:log` — newline-delimited TSV
///   timestamp \t path \t referrer \t ua \t duration_secs

use spin_sdk::http::{Request, Response};
use spin_sdk::key_value::Store;

const KEY: &str = "analytics:log";
const DASHBOARD_PASSWORD: &str = "enabler2026"; // override via env if needed

pub fn log(req: Request) -> Response {
    let body = req.body();
    let Ok(json): Result<serde_json::Value, _> = serde_json::from_slice(body) else {
        return cors_ok();
    };
    let path = json["path"].as_str().unwrap_or("").to_string();
    let referrer = json["referrer"].as_str().unwrap_or("").to_string();
    let ua = json["ua"].as_str().unwrap_or("").to_string();
    let duration = json["duration"].as_u64().unwrap_or(0);

    if path.is_empty() {
        return cors_ok();
    }

    // Sanitize tabs
    let path = path.replace('\t', "");
    let referrer = referrer.replace('\t', "");
    let ua = ua.replace('\t', "");

    let ts = chrono_now();
    let line = format!("{ts}\t{path}\t{referrer}\t{ua}\t{duration}\n");

    let Ok(store) = Store::open_default() else { return cors_ok(); };

    // Append to existing log (cap at ~500KB to avoid OOM)
    let existing = store.get(KEY).ok().flatten()
        .and_then(|b| String::from_utf8(b).ok())
        .unwrap_or_default();
    let combined = if existing.len() > 450_000 {
        // Keep last ~400KB
        let trimmed = &existing[existing.len() - 400_000..];
        let first_newline = trimmed.find('\n').map(|i| i + 1).unwrap_or(0);
        format!("{}{}", &trimmed[first_newline..], line)
    } else {
        format!("{existing}{line}")
    };

    let _ = store.set(KEY, combined.as_bytes());
    cors_ok()
}

pub fn dashboard(_full_path: &str, req: Request) -> Response {
    // req.query() returns the query string e.g. "pw=xxx"
    let query = req.query().to_string();
    let pw = query.split("pw=").nth(1).unwrap_or("").split('&').next().unwrap_or("");
    let env_pw = spin_sdk::variables::get("dashboard_password").unwrap_or_else(|_| DASHBOARD_PASSWORD.to_string());

    // Check cookie
    let cookie_ok = req.header("cookie")
        .and_then(|v| v.as_str())
        .map(|c| c.split(';').any(|part| {
            part.trim().strip_prefix("dash_auth=").map(|v| v == env_pw).unwrap_or(false)
        }))
        .unwrap_or(false);

    if pw == env_pw {
        // First login via ?pw= — set cookie and redirect
        let cookie = format!("dash_auth={env_pw}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800");
        return Response::builder()
            .status(302)
            .header("set-cookie", cookie)
            .header("location", "/analytics")
            .body(())
            .build();
    }

    if !cookie_ok {
        return login_page();
    }

    let log_data = Store::open_default().ok()
        .and_then(|s| s.get(KEY).ok().flatten())
        .and_then(|b| String::from_utf8(b).ok())
        .unwrap_or_default();

    let html = render_dashboard(&log_data);
    Response::builder()
        .status(200)
        .header("content-type", "text/html; charset=utf-8")
        .body(html)
        .build()
}

fn render_dashboard(log: &str) -> String {
    struct Row { path: String, referrer: String, ua: String }
    let mut rows: Vec<Row> = Vec::new();
    for line in log.lines() {
        let parts: Vec<&str> = line.splitn(5, '\t').collect();
        if parts.len() >= 4 {
            rows.push(Row {
                path: parts[1].to_string(),
                referrer: parts[2].to_string(),
                ua: parts[3].to_string(),
            });
        }
    }

    let total = rows.len();

    // Page counts
    let mut page_counts: std::collections::HashMap<&str, usize> = std::collections::HashMap::new();
    for r in &rows { *page_counts.entry(r.path.as_str()).or_default() += 1; }
    let mut pages: Vec<(&&str, &usize)> = page_counts.iter().collect();
    pages.sort_by(|a, b| b.1.cmp(a.1));

    // Referrer counts
    let mut ref_counts: std::collections::HashMap<&str, usize> = std::collections::HashMap::new();
    for r in &rows {
        let ref_key = if r.referrer.is_empty() { "direct" } else { r.referrer.as_str() };
        *ref_counts.entry(ref_key).or_default() += 1;
    }
    let mut refs: Vec<(&&str, &usize)> = ref_counts.iter().collect();
    refs.sort_by(|a, b| b.1.cmp(a.1));

    // Device breakdown
    let mobile = rows.iter().filter(|r| r.ua.contains("iPhone") || (r.ua.contains("Android") && r.ua.contains("Mobile"))).count();
    let tablet = rows.iter().filter(|r| r.ua.contains("iPad") || (r.ua.contains("Android") && !r.ua.contains("Mobile"))).count();
    let desktop = total.saturating_sub(mobile + tablet);

    let pages_html: String = pages.iter().take(20).map(|(path, count)| {
        let pct = if total > 0 { **count * 100 / total } else { 0 };
        format!(r#"<tr><td>{path}</td><td style="text-align:right">{count}</td><td style="text-align:right">{pct}%</td></tr>"#)
    }).collect();

    let refs_html: String = refs.iter().take(10).map(|(r, count)| {
        format!(r#"<tr><td style="max-width:300px;overflow:hidden;text-overflow:ellipsis;">{r}</td><td style="text-align:right">{count}</td></tr>"#)
    }).collect();

    format!(r#"<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Analytics — enablerdao.com</title>
<style>
*{{margin:0;padding:0;box-sizing:border-box;}}
body{{background:#080808;color:#e0e0e0;font-family:system-ui;padding:24px;}}
h1{{color:#44ff88;font-size:1.3rem;margin-bottom:4px;}}
.sub{{color:#666;font-size:.75rem;margin-bottom:24px;}}
.kpis{{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:24px;}}
.kpi{{background:#111;border:1px solid #1a1a1a;border-radius:12px;padding:16px 20px;min-width:120px;}}
.kpi .val{{font-size:1.8rem;font-weight:700;color:#44ff88;}}
.kpi .label{{font-size:.7rem;color:#888;margin-top:2px;}}
.panel{{background:#111;border:1px solid #1a1a1a;border-radius:12px;padding:20px;margin-bottom:16px;}}
.panel h2{{font-size:.85rem;color:#888;margin-bottom:12px;text-transform:uppercase;letter-spacing:.05em;}}
table{{width:100%;border-collapse:collapse;font-size:.8rem;}}
td,th{{padding:6px 8px;border-bottom:1px solid #1a1a1a;}}
th{{color:#666;font-weight:400;text-align:left;}}
</style>
</head>
<body>
<h1>Analytics Dashboard</h1>
<p class="sub">enablerdao.com — 全期間累計</p>
<div class="kpis">
  <div class="kpi"><div class="val">{total}</div><div class="label">Total PV</div></div>
  <div class="kpi"><div class="val">{desktop}</div><div class="label">Desktop</div></div>
  <div class="kpi"><div class="val">{mobile}</div><div class="label">Mobile</div></div>
  <div class="kpi"><div class="val">{tablet}</div><div class="label">Tablet</div></div>
</div>
<div class="panel">
  <h2>ページ別PV</h2>
  <table><thead><tr><th>Page</th><th style="text-align:right">PV</th><th style="text-align:right">%</th></tr></thead>
  <tbody>{pages_html}</tbody></table>
</div>
<div class="panel">
  <h2>流入元</h2>
  <table><thead><tr><th>Referrer</th><th style="text-align:right">PV</th></tr></thead>
  <tbody>{refs_html}</tbody></table>
</div>
</body></html>"#,
        total = total,
        desktop = desktop,
        mobile = mobile,
        tablet = tablet,
        pages_html = pages_html,
        refs_html = refs_html,
    )
}

fn login_page() -> Response {
    let html = r#"<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Login</title>
<style>*{margin:0;padding:0;box-sizing:border-box;}body{background:#080808;color:#e0e0e0;font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;}
.c{background:#111;border:1px solid #1a1a1a;border-radius:16px;padding:40px;max-width:320px;width:90%;text-align:center;}
h1{color:#44ff88;font-size:1.1rem;margin-bottom:20px;}
input{width:100%;padding:12px;background:#0a0a0a;border:1px solid #222;border-radius:8px;color:#e0e0e0;margin-bottom:12px;outline:none;}
input:focus{border-color:#44ff88;}
button{width:100%;padding:12px;background:#44ff88;color:#080808;border:none;border-radius:8px;font-weight:600;cursor:pointer;}
</style></head><body>
<div class="c"><h1>Analytics</h1>
<form method="GET" action="/analytics">
<input type="password" name="pw" placeholder="Password" autofocus>
<button type="submit">Login</button>
</form></div></body></html>"#;
    Response::builder()
        .status(200)
        .header("content-type", "text/html; charset=utf-8")
        .body(html)
        .build()
}

fn cors_ok() -> Response {
    Response::builder()
        .status(200)
        .header("content-type", "application/json")
        .header("access-control-allow-origin", "*")
        .body(r#"{"ok":true}"#)
        .build()
}

fn chrono_now() -> String {
    // WASI supports SystemTime
    use std::time::{SystemTime, UNIX_EPOCH};
    let secs = SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_secs()).unwrap_or(0);
    // Format as simple ISO-like: seconds since epoch (easy to parse)
    format!("{secs}")
}
