use axum::{
    extract::{Json, State},
    http::StatusCode,
    routing::{get, post},
    Router,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::RwLock;
use tower_http::{
    compression::CompressionLayer,
    cors::{AllowOrigin, CorsLayer},
    services::ServeDir,
};
use tracing::info;

// ── Models ──────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Project {
    pub name: String,
    pub repo: String,
    pub description: String,
    pub language: String,
    pub stars: u32,
    pub forks: u32,
    pub issues: u32,
    pub traffic: u32,
    pub reward: String,
    pub url: String,
    pub service_url: String,
}

#[derive(Deserialize)]
pub struct SubscribeRequest {
    pub email: String,
}

#[derive(Serialize, Deserialize)]
pub struct SubscribeResponse {
    pub ok: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}

#[derive(Serialize)]
struct ResendEmail {
    from: String,
    to: Vec<String>,
    subject: String,
    html: String,
}

// ── GitHub API types ────────────────────────────────

#[derive(Deserialize)]
struct GitHubRepo {
    stargazers_count: u32,
    forks_count: u32,
    open_issues_count: u32,
    language: Option<String>,
}

// ── Project definitions ─────────────────────────────

struct ProjectDef {
    name: &'static str,
    repo: &'static str,
    description: &'static str,
    reward: &'static str,
    service_url: &'static str,
    default_language: &'static str,
    default_stars: u32,
    default_forks: u32,
    default_issues: u32,
}

const PROJECT_DEFS: &[ProjectDef] = &[
    ProjectDef {
        name: "chatweb.ai",
        repo: "yukihamada/nanobot",
        description: "複数のAIモデルを同時比較できるプラットフォーム。Rust製で高速・軽量。",
        reward: "50-150 EBR",
        service_url: "https://chatweb.ai",
        default_language: "Rust",
        default_stars: 342,
        default_forks: 67,
        default_issues: 12,
    },
    ProjectDef {
        name: "hypernews",
        repo: "yukihamada/hypernews",
        description: "AI駆動の超高速ニュースアグリゲーター。215以上のRSSフィード、AI要約、音声ニュース対応。",
        reward: "30-100 EBR",
        service_url: "https://hypernews.enablerdao.com",
        default_language: "Rust",
        default_stars: 128,
        default_forks: 23,
        default_issues: 8,
    },
    ProjectDef {
        name: "enabler-cli",
        repo: "enablerdao/enabler-cli",
        description: "OSS自動コントリビューションエージェント。AIでプロジェクトを改善しPRを作成、EBRトークンを獲得。",
        reward: "20-80 EBR",
        service_url: "https://github.com/enablerdao/enabler-cli#installation",
        default_language: "Rust",
        default_stars: 89,
        default_forks: 15,
        default_issues: 5,
    },
    ProjectDef {
        name: "openclaw",
        repo: "openclaw/openclaw",
        description: "安全でスケーラブルなWebアプリを最小限のコードで構築できる高性能Rustフレームワーク。",
        reward: "80-200 EBR",
        service_url: "https://github.com/openclaw/openclaw#getting-started",
        default_language: "Rust",
        default_stars: 756,
        default_forks: 142,
        default_issues: 34,
    },
];

// ── Cache ───────────────────────────────────────────

struct ProjectCache {
    projects: Vec<Project>,
    updated_at: std::time::Instant,
}

type SharedCache = Arc<RwLock<Option<ProjectCache>>>;

const CACHE_TTL: std::time::Duration = std::time::Duration::from_secs(300); // 5 min

// ── App state ───────────────────────────────────────

#[derive(Clone)]
struct AppState {
    cache: SharedCache,
    http_client: reqwest::Client,
}

// ── Main ────────────────────────────────────────────

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

    let state = AppState {
        cache: Arc::new(RwLock::new(None)),
        http_client: reqwest::Client::builder()
            .user_agent("enablerdao-server/0.1")
            .timeout(std::time::Duration::from_secs(10))
            .build()
            .expect("Failed to build HTTP client"),
    };

    let app = build_router(state, &static_dir);

    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{port}"))
        .await
        .expect("Failed to bind");

    info!(port, "EnablerDAO server starting");

    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await
        .expect("Server error");
}

fn build_router(state: AppState, static_dir: &str) -> Router {
    let cors = CorsLayer::new()
        .allow_origin(AllowOrigin::any())
        .allow_methods([
            axum::http::Method::GET,
            axum::http::Method::POST,
            axum::http::Method::OPTIONS,
        ])
        .allow_headers([axum::http::header::CONTENT_TYPE]);

    Router::new()
        .route("/api/projects", get(get_projects))
        .route("/api/subscribe", post(subscribe))
        .route("/health", get(health))
        .fallback_service(ServeDir::new(static_dir).append_index_html_on_directories(true))
        .with_state(state)
        .layer(CompressionLayer::new())
        .layer(cors)
}

// ── Handlers ────────────────────────────────────────

async fn get_projects(State(state): State<AppState>) -> Json<Vec<Project>> {
    // Check cache
    {
        let cache = state.cache.read().await;
        if let Some(ref c) = *cache {
            if c.updated_at.elapsed() < CACHE_TTL {
                return Json(c.projects.clone());
            }
        }
    }

    // Fetch from GitHub API (best-effort)
    let projects = fetch_projects_with_github(&state.http_client).await;

    // Update cache
    {
        let mut cache = state.cache.write().await;
        *cache = Some(ProjectCache {
            projects: projects.clone(),
            updated_at: std::time::Instant::now(),
        });
    }

    Json(projects)
}

async fn fetch_projects_with_github(client: &reqwest::Client) -> Vec<Project> {
    let mut projects = Vec::with_capacity(PROJECT_DEFS.len());

    for def in PROJECT_DEFS {
        let (stars, forks, issues, language) = fetch_github_stats(client, def.repo)
            .await
            .unwrap_or((def.default_stars, def.default_forks, def.default_issues, def.default_language.to_string()));

        projects.push(Project {
            name: def.name.into(),
            repo: def.repo.into(),
            description: def.description.into(),
            language,
            stars,
            forks,
            issues,
            traffic: 0,
            reward: def.reward.into(),
            url: format!("https://github.com/{}", def.repo),
            service_url: def.service_url.into(),
        });
    }

    projects
}

async fn fetch_github_stats(
    client: &reqwest::Client,
    repo: &str,
) -> Result<(u32, u32, u32, String), reqwest::Error> {
    let url = format!("https://api.github.com/repos/{}", repo);

    let mut req = client.get(&url);

    // Use token if available (higher rate limit: 5000/hr vs 60/hr)
    if let Ok(token) = std::env::var("GITHUB_TOKEN") {
        if !token.is_empty() {
            req = req.bearer_auth(token);
        }
    }

    let resp: GitHubRepo = req.send().await?.json().await?;

    Ok((
        resp.stargazers_count,
        resp.forks_count,
        resp.open_issues_count,
        resp.language.unwrap_or_else(|| "Rust".into()),
    ))
}

async fn subscribe(
    State(state): State<AppState>,
    Json(body): Json<SubscribeRequest>,
) -> (StatusCode, Json<SubscribeResponse>) {
    let email = body.email.trim().to_string();

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

    match state.http_client
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

async fn health() -> &'static str {
    "OK"
}

async fn shutdown_signal() {
    tokio::signal::ctrl_c()
        .await
        .expect("Failed to install CTRL+C handler");
    info!("Shutdown signal received");
}

// ── Email template ──────────────────────────────────

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

// ── Tests ───────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;
    use axum::http::Request;
    use tower::util::ServiceExt;

    fn test_state() -> AppState {
        AppState {
            cache: Arc::new(RwLock::new(None)),
            http_client: reqwest::Client::builder()
                .user_agent("enablerdao-test/0.1")
                .timeout(std::time::Duration::from_secs(5))
                .build()
                .unwrap(),
        }
    }

    fn test_app() -> Router {
        let state = test_state();
        Router::new()
            .route("/api/projects", get(get_projects))
            .route("/api/subscribe", post(subscribe))
            .route("/health", get(health))
            .with_state(state)
    }

    #[tokio::test]
    async fn test_health() {
        let app = test_app();
        let resp = app
            .oneshot(Request::get("/health").body(Body::empty()).unwrap())
            .await
            .unwrap();

        assert_eq!(resp.status(), StatusCode::OK);
        let body = axum::body::to_bytes(resp.into_body(), 1024).await.unwrap();
        assert_eq!(&body[..], b"OK");
    }

    #[tokio::test]
    async fn test_get_projects_returns_list() {
        let app = test_app();
        let resp = app
            .oneshot(Request::get("/api/projects").body(Body::empty()).unwrap())
            .await
            .unwrap();

        assert_eq!(resp.status(), StatusCode::OK);
        let body = axum::body::to_bytes(resp.into_body(), 65536).await.unwrap();
        let projects: Vec<Project> = serde_json::from_slice(&body).unwrap();

        assert_eq!(projects.len(), 4);
        assert_eq!(projects[0].name, "chatweb.ai");
        assert_eq!(projects[1].name, "hypernews");
        assert_eq!(projects[2].name, "enabler-cli");
        assert_eq!(projects[3].name, "openclaw");

        // Each project should have required fields
        for p in &projects {
            assert!(!p.repo.is_empty());
            assert!(!p.description.is_empty());
            assert!(!p.reward.is_empty());
            assert!(p.url.starts_with("https://github.com/"));
        }
    }

    #[tokio::test]
    async fn test_subscribe_valid_email() {
        let app = test_app();
        let resp = app
            .oneshot(
                Request::post("/api/subscribe")
                    .header("content-type", "application/json")
                    .body(Body::from(r#"{"email":"test@example.com"}"#))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(resp.status(), StatusCode::OK);
        let body = axum::body::to_bytes(resp.into_body(), 1024).await.unwrap();
        let res: SubscribeResponse = serde_json::from_slice(&body).unwrap();
        assert!(res.ok);
        assert!(res.error.is_none());
    }

    #[tokio::test]
    async fn test_subscribe_invalid_email_empty() {
        let app = test_app();
        let resp = app
            .oneshot(
                Request::post("/api/subscribe")
                    .header("content-type", "application/json")
                    .body(Body::from(r#"{"email":""}"#))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(resp.status(), StatusCode::BAD_REQUEST);
        let body = axum::body::to_bytes(resp.into_body(), 1024).await.unwrap();
        let res: SubscribeResponse = serde_json::from_slice(&body).unwrap();
        assert!(!res.ok);
        assert_eq!(res.error.as_deref(), Some("invalid email"));
    }

    #[tokio::test]
    async fn test_subscribe_invalid_email_no_at() {
        let app = test_app();
        let resp = app
            .oneshot(
                Request::post("/api/subscribe")
                    .header("content-type", "application/json")
                    .body(Body::from(r#"{"email":"notanemail"}"#))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(resp.status(), StatusCode::BAD_REQUEST);
    }

    #[tokio::test]
    async fn test_subscribe_trims_whitespace() {
        let app = test_app();
        let resp = app
            .oneshot(
                Request::post("/api/subscribe")
                    .header("content-type", "application/json")
                    .body(Body::from(r#"{"email":"  user@example.com  "}"#))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(resp.status(), StatusCode::OK);
        let body = axum::body::to_bytes(resp.into_body(), 1024).await.unwrap();
        let res: SubscribeResponse = serde_json::from_slice(&body).unwrap();
        assert!(res.ok);
    }

    #[tokio::test]
    async fn test_subscribe_bad_json() {
        let app = test_app();
        let resp = app
            .oneshot(
                Request::post("/api/subscribe")
                    .header("content-type", "application/json")
                    .body(Body::from(r#"not json"#))
                    .unwrap(),
            )
            .await
            .unwrap();

        // Axum returns 400 for malformed JSON
        assert_eq!(resp.status(), StatusCode::BAD_REQUEST);
    }

    #[tokio::test]
    async fn test_project_cache_is_reused() {
        let state = test_state();
        let app = Router::new()
            .route("/api/projects", get(get_projects))
            .with_state(state.clone());

        // First request populates cache
        let resp1 = app
            .clone()
            .oneshot(Request::get("/api/projects").body(Body::empty()).unwrap())
            .await
            .unwrap();
        assert_eq!(resp1.status(), StatusCode::OK);

        // Cache should now be populated
        let cache = state.cache.read().await;
        assert!(cache.is_some());
    }

    #[test]
    fn test_welcome_email_contains_email() {
        let html = welcome_email_html("user@test.com");
        assert!(html.contains("user@test.com"));
        assert!(html.contains("enablerdao"));
        assert!(html.contains("chatweb.ai"));
    }

    #[test]
    fn test_project_defs_are_valid() {
        for def in PROJECT_DEFS {
            assert!(!def.name.is_empty());
            assert!(def.repo.contains('/'), "repo should be owner/name format");
            assert!(!def.description.is_empty());
            assert!(!def.reward.is_empty());
        }
    }
}
