use axum::{
    extract::Json,
    http::StatusCode,
    routing::{get, post},
    Router,
};
use serde::{Deserialize, Serialize};
use tower_http::{
    compression::CompressionLayer,
    cors::{AllowOrigin, CorsLayer},
    services::ServeDir,
};
use tracing::info;

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Project {
    name: String,
    repo: String,
    description: String,
    language: String,
    stars: u32,
    forks: u32,
    issues: u32,
    traffic: u32,
    reward: String,
    url: String,
    service_url: String,
}

#[derive(Deserialize)]
struct SubscribeRequest {
    email: String,
}

#[derive(Serialize)]
struct SubscribeResponse {
    ok: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    error: Option<String>,
}

#[derive(Serialize)]
struct ResendEmail {
    from: String,
    to: Vec<String>,
    subject: String,
    html: String,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| tracing_subscriber::EnvFilter::new("info")),
        )
        .init();

    let static_dir = std::env::var("STATIC_DIR").unwrap_or_else(|_| "../frontend".into());
    let port: u16 = std::env::var("PORT")
        .ok()
        .and_then(|p| p.parse().ok())
        .unwrap_or(8080);

    let cors = CorsLayer::new()
        .allow_origin(AllowOrigin::any())
        .allow_methods([
            axum::http::Method::GET,
            axum::http::Method::POST,
            axum::http::Method::OPTIONS,
        ])
        .allow_headers([axum::http::header::CONTENT_TYPE]);

    let app = Router::new()
        .route("/api/projects", get(get_projects))
        .route("/api/subscribe", post(subscribe))
        .route("/health", get(health))
        .fallback_service(ServeDir::new(&static_dir).append_index_html_on_directories(true))
        .layer(CompressionLayer::new())
        .layer(cors);

    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{port}"))
        .await
        .expect("Failed to bind");

    info!(port, "EnablerDAO server starting");

    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await
        .expect("Server error");
}

async fn subscribe(
    Json(body): Json<SubscribeRequest>,
) -> (StatusCode, Json<SubscribeResponse>) {
    let email = body.email.trim().to_string();

    // Basic validation
    if email.is_empty() || !email.contains('@') {
        return (
            StatusCode::BAD_REQUEST,
            Json(SubscribeResponse { ok: false, error: Some("invalid email".into()) }),
        );
    }

    info!(email = %email, "New subscriber");

    let api_key = std::env::var("RESEND_API_KEY").unwrap_or_default();
    if api_key.is_empty() {
        info!("RESEND_API_KEY not set — skipping email send");
        return (StatusCode::OK, Json(SubscribeResponse { ok: true, error: None }));
    }

    let payload = ResendEmail {
        from: "EnablerDAO <noreply@enablerdao.com>".into(),
        to: vec![email.clone()],
        subject: "EnablerDAOへようこそ — コードでEBRトークンを稼ごう".into(),
        html: welcome_email_html(&email),
    };

    let client = reqwest::Client::new();
    match client
        .post("https://api.resend.com/emails")
        .bearer_auth(&api_key)
        .json(&payload)
        .send()
        .await
    {
        Ok(res) if res.status().is_success() => {
            info!(email = %email, "Welcome email sent");
            (StatusCode::OK, Json(SubscribeResponse { ok: true, error: None }))
        }
        Ok(res) => {
            let status = res.status();
            tracing::error!(email = %email, status = %status, "Resend API error");
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(SubscribeResponse { ok: false, error: Some("email send failed".into()) }),
            )
        }
        Err(e) => {
            tracing::error!(email = %email, err = %e, "Resend request failed");
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(SubscribeResponse { ok: false, error: Some("email send failed".into()) }),
            )
        }
    }
}

fn welcome_email_html(email: &str) -> String {
    format!(r#"<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{ background: #0a0a0a; color: #ccc; font-family: 'SF Mono','Fira Code','Cascadia Code',monospace; font-size: 14px; line-height: 1.8; }}
  .wrap {{ max-width: 600px; margin: 0 auto; padding: 40px 24px; }}
  .logo {{ color: #00ff00; font-size: 22px; font-weight: 700; text-shadow: 0 0 12px rgba(0,255,0,0.5); margin-bottom: 8px; }}
  .subtitle {{ color: #555; font-size: 12px; margin-bottom: 40px; }}
  h2 {{ color: #00ffff; font-size: 13px; letter-spacing: 0.1em; margin: 32px 0 16px; }}
  .step {{ border-left: 2px solid rgba(0,255,0,0.3); padding: 12px 16px; margin-bottom: 16px; background: #0f0f0f; }}
  .step-num {{ color: #00ff00; font-size: 11px; margin-bottom: 6px; }}
  .step-title {{ color: #fff; font-size: 15px; font-weight: 700; margin-bottom: 8px; }}
  .step-desc {{ color: #888; font-size: 13px; }}
  .code-block {{ background: #111; border: 1px solid #1a3a1a; border-radius: 3px; padding: 14px 16px; margin: 10px 0; color: #00ff00; font-size: 13px; word-break: break-all; }}
  .tag {{ display: inline-block; border: 1px solid rgba(255,170,0,0.4); color: #ffaa00; font-size: 11px; padding: 2px 8px; margin: 2px; }}
  .reward-box {{ border: 1px solid rgba(0,255,0,0.2); border-left: 2px solid #00ff00; padding: 16px; margin: 24px 0; background: rgba(0,255,0,0.03); }}
  .reward-title {{ color: #00ff00; font-size: 12px; margin-bottom: 8px; }}
  .reward-amounts {{ display: flex; gap: 16px; flex-wrap: wrap; }}
  .reward-item {{ color: #ffaa00; font-size: 13px; }}
  a {{ color: #00ffff; text-decoration: none; }}
  a:hover {{ text-decoration: underline; }}
  .footer {{ border-top: 1px solid #1a1a1a; margin-top: 40px; padding-top: 20px; color: #444; font-size: 11px; }}
  .btn {{ display: inline-block; background: #00ff00; color: #000 !important; font-weight: 700; padding: 12px 24px; border-radius: 3px; text-decoration: none; margin: 8px 0; }}
</style>
</head>
<body>
<div class="wrap">

  <div class="logo">$ enablerdao welcome</div>
  <div class="subtitle">// {email} — EnablerDAOへようこそ</div>

  <p style="color:#aaa;font-size:14px;">
    OSSを一緒に進化させましょう。<br>
    AIを使ってコードを改善し、PRが採用されれば<strong style="color:#ffaa00;">EBRトークン</strong>を獲得できます。
  </p>

  <h2>// はじめ方 — 3ステップ</h2>

  <div class="step">
    <div class="step-num">[1/3] AIアカウントを作成</div>
    <div class="step-title">chatweb.ai でアカウント登録</div>
    <div class="step-desc">
      enabler-cli はAIエージェントを使ってコードを自動改善します。<br>
      まず <a href="https://chatweb.ai">chatweb.ai</a> または <a href="https://teai.io">teai.io</a> でアカウントを作成してください。
    </div>
    <div style="margin-top:10px;">
      <a class="btn" href="https://chatweb.ai">chatweb.ai を開く →</a>
    </div>
  </div>

  <div class="step">
    <div class="step-num">[2/3] enabler-cli をインストール</div>
    <div class="step-title">ワンライナーで完了</div>
    <div class="step-desc">ターミナルで以下を実行してください：</div>
    <div class="code-block">curl -fsSL https://enablerdao.com/install.sh | bash</div>
    <div class="step-desc">git と curl があれば動作します（macOS / Linux / WSL2 対応）</div>
  </div>

  <div class="step">
    <div class="step-num">[3/3] OSSを改善してEBRを稼ぐ</div>
    <div class="step-title">AIエージェントを起動</div>
    <div class="step-desc">改善したいリポジトリを指定して実行：</div>
    <div class="code-block">enablerdao improve yukihamada/hypernews</div>
    <div class="step-desc" style="margin-top:8px;">
      AIが自動でバグ修正・セキュリティ改善・パフォーマンス最適化を行い、PRを作成します。<br>
      <strong style="color:#fff;">PRが採用されるとEBRトークンが付与されます。</strong>
    </div>
  </div>

  <div class="reward-box">
    <div class="reward-title">// 報酬の目安 (EBR tokens per PR)</div>
    <div class="reward-amounts">
      <span class="reward-item">chatweb.ai — 50〜150 EBR</span>
      <span class="reward-item">hypernews — 30〜100 EBR</span>
      <span class="reward-item">enabler-cli — 20〜80 EBR</span>
      <span class="reward-item">openclaw — 80〜200 EBR</span>
    </div>
  </div>

  <h2>// 参考リンク</h2>
  <p style="color:#888;">
    <a href="https://enablerdao.com/install">enablerdao.com/install</a> — 詳細インストール手順<br>
    <a href="https://github.com/enablerdao">github.com/enablerdao</a> — 全リポジトリ一覧<br>
    <a href="https://chatweb.ai">chatweb.ai</a> — AIモデル比較プラットフォーム
  </p>

  <h2>// 主要コマンド</h2>
  <div class="code-block">enablerdao projects       # プロジェクト一覧
enablerdao improve [repo] # 自動改善エージェント起動
enablerdao pr [repo]      # 改善をPRとして提出
enablerdao status         # サービス稼働状況確認</div>

  <div class="footer">
    <p>このメールは <a href="https://enablerdao.com">enablerdao.com</a> から送信されました。</p>
    <p style="margin-top:6px;">登録メールアドレス: {email}</p>
  </div>

</div>
</body>
</html>"#, email = email)
}

async fn get_projects() -> Json<Vec<Project>> {
    let projects = vec![
        Project {
            name: "chatweb.ai".into(),
            repo: "yukihamada/nanobot".into(),
            description: "複数のAIモデルを同時比較できるプラットフォーム。Rust製で高速・軽量。".into(),
            language: "Rust".into(),
            stars: 342,
            forks: 67,
            issues: 12,
            traffic: 8542,
            reward: "50-150 EBR".into(),
            url: "https://github.com/yukihamada/nanobot".into(),
            service_url: "https://chatweb.ai".into(),
        },
        Project {
            name: "hypernews".into(),
            repo: "yukihamada/hypernews".into(),
            description: "AI駆動の超高速ニュースアグリゲーター。215以上のRSSフィード、AI要約、音声ニュース対応。".into(),
            language: "Rust".into(),
            stars: 128,
            forks: 23,
            issues: 8,
            traffic: 5231,
            reward: "30-100 EBR".into(),
            url: "https://github.com/yukihamada/hypernews".into(),
            service_url: "https://hypernews.enablerdao.com".into(),
        },
        Project {
            name: "enabler-cli".into(),
            repo: "enablerdao/enabler-cli".into(),
            description: "OSS自動コントリビューションエージェント。AIでプロジェクトを改善しPRを作成、EBRトークンを獲得。".into(),
            language: "Rust".into(),
            stars: 89,
            forks: 15,
            issues: 5,
            traffic: 3421,
            reward: "20-80 EBR".into(),
            url: "https://github.com/enablerdao/enabler-cli".into(),
            service_url: "https://github.com/enablerdao/enabler-cli#installation".into(),
        },
        Project {
            name: "openclaw".into(),
            repo: "openclaw/openclaw".into(),
            description: "安全でスケーラブルなWebアプリを最小限のコードで構築できる高性能Rustフレームワーク。".into(),
            language: "Rust".into(),
            stars: 756,
            forks: 142,
            issues: 34,
            traffic: 12453,
            reward: "80-200 EBR".into(),
            url: "https://github.com/openclaw/openclaw".into(),
            service_url: "https://github.com/openclaw/openclaw#getting-started".into(),
        },
    ];

    Json(projects)
}

async fn health() -> &'static str {
    "OK"
}

async fn shutdown_signal() {
    tokio::signal::ctrl_c()
        .await
        .expect("Failed to install CTRL+C handler");
    info!("Shutdown signal received");
}
