use axum::{
    extract::{Json, Path, State},
    http::{HeaderMap, StatusCode},
    routing::{get, post},
    Router,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
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

// ── Auth models ────────────────────────────────────

#[derive(Deserialize)]
pub struct AuthVerifyRequest {
    pub wallet_address: String,
    pub signature: String,
    pub message: String,
}

#[derive(Serialize, Deserialize)]
pub struct AuthVerifyResponse {
    pub ok: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub token: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}

struct Session {
    #[allow(dead_code)]
    wallet_address: String,
    expires_at: std::time::Instant,
}

type SessionStore = Arc<RwLock<HashMap<String, Session>>>;

const SESSION_TTL: std::time::Duration = std::time::Duration::from_secs(86400); // 24h
const MESSAGE_MAX_AGE_SECS: i64 = 300; // 5 min

const EBR_MINT: &str = "E1JxwaWRd8nw8vDdWMdqwdbXGBshqDcnTcinHzNMqg2Y";
const EBR_MIN_BALANCE: u64 = 1000;

// ── NOT A HOTEL property definitions ───────────────

struct MemberPropertyDef {
    id: &'static str,
    name: &'static str,
    location: &'static str,
}

// Fallback definitions used when NAH API is unavailable
const MEMBER_PROPERTY_DEFS: &[MemberPropertyDef] = &[
    MemberPropertyDef {
        id: "nah_aoshima",
        name: "NOT A HOTEL AOSHIMA",
        location: "宮崎県宮崎市",
    },
    MemberPropertyDef {
        id: "nah_asakusa",
        name: "NOT A HOTEL CLUB HOUSE ASAKUSA",
        location: "東京都台東区",
    },
    MemberPropertyDef {
        id: "nah_harumi",
        name: "NOT A HOTEL CLUB HOUSE HARUMI",
        location: "東京都中央区",
    },
];

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

// ── Availability ────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PropertyAvailability {
    pub property_id: String,
    pub property_name: String,
    #[serde(default)]
    pub location: String,
    #[serde(default)]
    pub property_type: String, // "villa" | "club_house"
    #[serde(default)]
    pub house_group_id: String,
    pub booked_ranges: Vec<DateRange>,
    #[serde(default)]
    pub days: Vec<DayInfo>,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DayInfo {
    pub date: String, // "YYYY-MM-DD"
    pub vacant: bool,
    pub price_type: String, // "standard" | "high"
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DateRange {
    pub start: String, // YYYY-MM-DD
    pub end: String,   // YYYY-MM-DD
}

#[allow(dead_code)]
struct PropertyDef {
    id: &'static str,
    name: &'static str,
    airbnb_id: &'static str, // Used for reference / future Airbnb link generation
    // Set iCal URL here once available.
    // Format: https://www.airbnb.com/calendar/ical/{ID}.ics?s={SECRET}
    ical_url: Option<&'static str>,
}

const PROPERTY_DEFS: &[PropertyDef] = &[
    PropertyDef {
        id: "property01",
        name: "ホワイトハウス 熱海",
        airbnb_id: "53223988",
        ical_url: Some("https://calendar.google.com/calendar/ical/c_e1a1c1b79db230e0c59c5e2d5e1e85a78e629153363db144669e5ce5cd64daeb%40group.calendar.google.com/private-41fe6327a33720ae918c65a3837a1a68/basic.ics"),
    },
    PropertyDef {
        id: "property02",
        name: "ザ・ロッジ 弟子屈",
        airbnb_id: "597239384272621732",
        ical_url: Some("https://calendar.google.com/calendar/ical/c_f952ccb017d44055413db2e30fd354e4690a9e1859debdad7bebd40fa05fd6d4%40group.calendar.google.com/private-426e5fcfae90bea4fc81a10fab9b902c/basic.ics"),
    },
    PropertyDef {
        id: "property03",
        name: "ザ・ネスト 弟子屈",
        airbnb_id: "911857804615412559",
        ical_url: Some("https://calendar.google.com/calendar/ical/c_6422e9e75accb74badf8648c2620e2922cbd7ac3d9e3a050c98fc38c09038dd2%40group.calendar.google.com/private-d71e78b5346301cd0030facdf39025d7/basic.ics"),
    },
    PropertyDef {
        id: "property04",
        name: "ビーチハウス ホノルル",
        airbnb_id: "1226550388535476490",
        ical_url: Some("https://calendar.google.com/calendar/ical/c_8abd7a86aa57cd0f923f9442b135ff0b1801d6afe1baa50c7c00633291248824%40group.calendar.google.com/private-e5e80721bd5601c5eb08049d6743c4c0/basic.ics"),
    },
    // property05 ガレージハウス ホノルル — 「お問い合わせください」表示のため除外
];

struct AvailabilityCache {
    data: Vec<PropertyAvailability>,
    updated_at: std::time::Instant,
}

type SharedAvailCache = Arc<RwLock<Option<AvailabilityCache>>>;

const AVAIL_CACHE_TTL: std::time::Duration = std::time::Duration::from_secs(1800); // 30 min

// ── NOT A HOTEL API types ────────────────────────────

const NAH_API_BASE: &str = "https://app-gateway.notahotel.com/app/v1";
const NAH_TOKEN_TTL: std::time::Duration = std::time::Duration::from_secs(3300); // 55 min
const NAH_CACHE_TTL: std::time::Duration = std::time::Duration::from_secs(1800); // 30 min

#[derive(Deserialize)]
struct FirebaseTokenResponse {
    id_token: String,
    #[allow(dead_code)]
    expires_in: String,
}

struct NahTokenCache {
    id_token: String,
    expires_at: std::time::Instant,
}

type SharedNahToken = Arc<RwLock<Option<NahTokenCache>>>;

#[derive(Deserialize)]
struct NahVacancyResponse {
    calendar: Option<NahCalendar>,
}

#[derive(Deserialize)]
struct NahCalendar {
    months: Vec<NahMonth>,
}

#[derive(Deserialize)]
#[allow(dead_code)]
struct NahMonth {
    year: i32,
    month: i32,
    days: Vec<NahDay>,
}

#[derive(Deserialize)]
struct NahDay {
    date: NahDate,
    vacant: bool,
    #[serde(default, rename = "priceType")]
    price_type: Option<String>,
}

#[derive(Deserialize)]
struct NahDate {
    year: i32,
    month: i32,
    day: i32,
}

// get_owner_home_data response types
#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct NahOwnerHomeData {
    #[serde(default)]
    available_properties: Vec<NahAvailableProperty>,
    #[serde(default)]
    club_houses: Vec<NahClubHouse>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct NahAvailableProperty {
    owned_house_bundle: Option<NahOwnedBundle>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct NahOwnedBundle {
    bundle: Option<NahBundle>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct NahBundle {
    #[serde(default)]
    house_group_ids: Vec<String>,
    parent_name: Option<String>,
    name: Option<String>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct NahClubHouse {
    house_group: Option<NahHouseGroupInfo>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct NahHouseGroupInfo {
    id: String,
    place_name: Option<String>,
    name: Option<String>,
}

struct NahMemberCache {
    data: Vec<PropertyAvailability>,
    updated_at: std::time::Instant,
}

type SharedNahMemberCache = Arc<RwLock<Option<NahMemberCache>>>;

// ── Beds24 API ─────────────────────────────────────

const BEDS24_API_BASE: &str = "https://beds24.com/api/v2";
const BEDS24_TOKEN_TTL: std::time::Duration = std::time::Duration::from_secs(82800); // 23h

struct Beds24TokenCache {
    access_token: String,
    expires_at: std::time::Instant,
}

type SharedBeds24Token = Arc<RwLock<Option<Beds24TokenCache>>>;

fn parse_beds24_property_map() -> HashMap<String, u64> {
    let map_str = std::env::var("BEDS24_PROPERTY_MAP").unwrap_or_default();
    let mut map = HashMap::new();
    for pair in map_str.split(',') {
        let parts: Vec<&str> = pair.splitn(2, '=').collect();
        if parts.len() == 2 {
            if let Ok(id) = parts[1].parse::<u64>() {
                map.insert(parts[0].to_string(), id);
            }
        }
    }
    map
}

// ── App state ───────────────────────────────────────

#[derive(Clone)]
struct AppState {
    cache: SharedCache,
    avail_cache: SharedAvailCache,
    http_client: reqwest::Client,
    sessions: SessionStore,
    nah_token: SharedNahToken,
    nah_member_cache: SharedNahMemberCache,
    beds24_token: SharedBeds24Token,
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
        avail_cache: Arc::new(RwLock::new(None)),
        http_client: reqwest::Client::builder()
            .user_agent("enablerdao-server/0.1")
            .timeout(std::time::Duration::from_secs(10))
            .build()
            .expect("Failed to build HTTP client"),
        sessions: Arc::new(RwLock::new(HashMap::new())),
        nah_token: Arc::new(RwLock::new(None)),
        nah_member_cache: Arc::new(RwLock::new(None)),
        beds24_token: Arc::new(RwLock::new(None)),
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
        .allow_headers([
            axum::http::header::CONTENT_TYPE,
            axum::http::header::AUTHORIZATION,
        ]);

    Router::new()
        .route("/api/projects", get(get_projects))
        .route("/api/projects/:name", get(get_project_by_name))
        .route("/api/availability", get(get_all_availability))
        .route("/api/availability/:property_id", get(get_availability))
        .route("/api/subscribe", post(subscribe))
        .route("/api/auth/verify", post(auth_verify))
        .route("/api/members/availability", get(get_member_availability))
        .route("/api/members/inquiry", post(member_inquiry))
        .route("/api/chat", post(chat_handler))
        .route("/api/chat/checkout", post(chat_checkout))
        .route("/api/book", post(beds24_book))
        .route("/api/line/webhook", post(line_webhook))
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
        let (stars, forks, issues, language) =
            fetch_github_stats(client, def.repo).await.unwrap_or((
                def.default_stars,
                def.default_forks,
                def.default_issues,
                def.default_language.to_string(),
            ));

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
            Json(SubscribeResponse {
                ok: false,
                error: Some("invalid email".into()),
            }),
        );
    }

    info!(email = %email, "New subscriber");

    spawn_line_notification(
        state.http_client.clone(),
        format!("[Newsletter] 新規登録: {}", email),
    );

    let api_key = std::env::var("RESEND_API_KEY").unwrap_or_default();
    if api_key.is_empty() {
        info!("RESEND_API_KEY not set — skipping email send");
        return (
            StatusCode::OK,
            Json(SubscribeResponse {
                ok: true,
                error: None,
            }),
        );
    }

    let payload = ResendEmail {
        from: "EnablerDAO <noreply@enablerdao.com>".into(),
        to: vec![email.clone()],
        subject: "EnablerDAOへようこそ — コードでEBRトークンを稼ごう".into(),
        html: welcome_email_html(&email),
    };

    match state
        .http_client
        .post("https://api.resend.com/emails")
        .bearer_auth(&api_key)
        .json(&payload)
        .send()
        .await
    {
        Ok(res) if res.status().is_success() => {
            info!(email = %email, "Welcome email sent");
            (
                StatusCode::OK,
                Json(SubscribeResponse {
                    ok: true,
                    error: None,
                }),
            )
        }
        Ok(res) => {
            let status = res.status();
            tracing::error!(email = %email, status = %status, "Resend API error");
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(SubscribeResponse {
                    ok: false,
                    error: Some("email send failed".into()),
                }),
            )
        }
        Err(e) => {
            tracing::error!(email = %email, err = %e, "Resend request failed");
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(SubscribeResponse {
                    ok: false,
                    error: Some("email send failed".into()),
                }),
            )
        }
    }
}

async fn get_project_by_name(
    State(state): State<AppState>,
    Path(name): Path<String>,
) -> Result<Json<Project>, StatusCode> {
    // Reuse cached projects
    let projects = {
        let cache = state.cache.read().await;
        if let Some(ref c) = *cache {
            if c.updated_at.elapsed() < CACHE_TTL {
                c.projects.clone()
            } else {
                drop(cache);
                fetch_projects_with_github(&state.http_client).await
            }
        } else {
            drop(cache);
            fetch_projects_with_github(&state.http_client).await
        }
    };

    let name_lower = name.to_lowercase();
    projects
        .into_iter()
        .find(|p| {
            p.name.to_lowercase() == name_lower
                || p.repo.to_lowercase().ends_with(&format!("/{}", name_lower))
        })
        .map(Json)
        .ok_or(StatusCode::NOT_FOUND)
}

// ── Availability handlers ───────────────────────────

async fn get_all_availability(State(state): State<AppState>) -> Json<Vec<PropertyAvailability>> {
    let avail = fetch_all_availability(&state).await;
    Json(avail)
}

async fn get_availability(
    State(state): State<AppState>,
    Path(property_id): Path<String>,
) -> Result<Json<PropertyAvailability>, StatusCode> {
    let avail = fetch_all_availability(&state).await;
    let id_lower = property_id.to_lowercase();
    avail
        .into_iter()
        .find(|a| a.property_id == id_lower)
        .map(Json)
        .ok_or(StatusCode::NOT_FOUND)
}

async fn fetch_all_availability(state: &AppState) -> Vec<PropertyAvailability> {
    // Check cache
    {
        let cache = state.avail_cache.read().await;
        if let Some(ref c) = *cache {
            if c.updated_at.elapsed() < AVAIL_CACHE_TTL {
                return c.data.clone();
            }
        }
    }

    let now = chrono::Utc::now();
    let mut all = Vec::new();

    let today_str = now.format("%Y-%m-%d").to_string();

    for def in PROPERTY_DEFS {
        let mut booked = if let Some(url) = def.ical_url {
            fetch_and_parse_ical(&state.http_client, url).await
        } else {
            Vec::new()
        };

        // If no future bookings from iCal, use demo data so calendar looks realistic
        let has_future = booked.iter().any(|r| r.end > today_str);
        if !has_future {
            booked = generate_demo_bookings(def.id, &now);
        }

        all.push(PropertyAvailability {
            property_id: def.id.into(),
            property_name: def.name.into(),
            location: String::new(),
            property_type: "villa".into(),
            house_group_id: String::new(),
            booked_ranges: booked,
            days: Vec::new(),
            updated_at: now.format("%Y-%m-%dT%H:%M:%SZ").to_string(),
        });
    }

    // Update cache
    {
        let mut cache = state.avail_cache.write().await;
        *cache = Some(AvailabilityCache {
            data: all.clone(),
            updated_at: std::time::Instant::now(),
        });
    }

    all
}

/// Parse iCal (.ics) data and extract booked date ranges.
fn parse_ical_events(ical_text: &str) -> Vec<DateRange> {
    let mut ranges = Vec::new();
    let mut in_event = false;
    let mut start = String::new();
    let mut end = String::new();

    for line in ical_text.lines() {
        let line = line.trim();
        if line == "BEGIN:VEVENT" {
            in_event = true;
            start.clear();
            end.clear();
        } else if line == "END:VEVENT" {
            if in_event && !start.is_empty() && !end.is_empty() {
                // Convert YYYYMMDD → YYYY-MM-DD
                let fmt = |s: &str| {
                    if s.len() >= 8 {
                        format!("{}-{}-{}", &s[..4], &s[4..6], &s[6..8])
                    } else {
                        s.to_string()
                    }
                };
                ranges.push(DateRange {
                    start: fmt(&start),
                    end: fmt(&end),
                });
            }
            in_event = false;
        } else if in_event {
            if let Some(val) = line.strip_prefix("DTSTART;VALUE=DATE:") {
                start = val.to_string();
            } else if let Some(val) = line.strip_prefix("DTSTART:") {
                start = val.chars().take(8).collect();
            } else if let Some(val) = line.strip_prefix("DTEND;VALUE=DATE:") {
                end = val.to_string();
            } else if let Some(val) = line.strip_prefix("DTEND:") {
                end = val.chars().take(8).collect();
            }
        }
    }

    ranges
}

async fn fetch_and_parse_ical(client: &reqwest::Client, url: &str) -> Vec<DateRange> {
    match client.get(url).send().await {
        Ok(resp) if resp.status().is_success() => {
            if let Ok(text) = resp.text().await {
                parse_ical_events(&text)
            } else {
                Vec::new()
            }
        }
        _ => Vec::new(),
    }
}

/// Generate demo bookings so the calendar looks realistic before iCal URLs are set.
/// Produces a mix of weekend stays, week-long stays, and occasional long stays
/// spread across the next 6 months.
fn generate_demo_bookings(
    property_id: &str,
    now: &chrono::DateTime<chrono::Utc>,
) -> Vec<DateRange> {
    use chrono::Duration;

    let today = now.date_naive();

    // Deterministic seed based on property_id
    let seed: u32 = property_id.bytes().map(|b| b as u32).sum();

    // Generate bookings spread across ~180 days
    // Pattern: short gaps → booked → gap → booked, with varying lengths
    let patterns: &[&[(i64, i64)]] = &[
        // Pattern 0: Popular property, lots of bookings
        &[(1, 4), (7, 10), (14, 18), (22, 25), (30, 37), (42, 45),
          (50, 53), (58, 62), (70, 74), (80, 83), (90, 97), (105, 109),
          (115, 118), (125, 132), (140, 143), (155, 160), (168, 172)],
        // Pattern 1: Moderate bookings
        &[(3, 6), (12, 16), (24, 28), (35, 38), (48, 55), (63, 66),
          (75, 79), (88, 92), (102, 106), (118, 122), (135, 142),
          (150, 153), (165, 170)],
        // Pattern 2: Seasonal bursts
        &[(0, 5), (8, 11), (20, 27), (40, 43), (55, 58), (65, 72),
          (85, 88), (95, 102), (110, 113), (130, 137), (148, 152),
          (160, 167)],
        // Pattern 3: Long-stay oriented
        &[(2, 9), (15, 18), (25, 32), (40, 47), (55, 60), (70, 77),
          (90, 95), (105, 112), (125, 130), (145, 152), (165, 170)],
        // Pattern 4: Weekend-heavy
        &[(1, 3), (5, 8), (12, 15), (19, 22), (26, 29), (33, 36),
          (40, 47), (54, 57), (61, 64), (68, 71), (75, 82), (89, 92),
          (96, 99), (110, 117), (124, 127), (140, 143), (155, 162)],
    ];

    let pattern = patterns[(seed as usize) % patterns.len()];
    let mut ranges = Vec::new();

    for (start_offset, end_offset) in pattern {
        let s = today + Duration::days(*start_offset);
        let e = today + Duration::days(*end_offset);
        ranges.push(DateRange {
            start: s.format("%Y-%m-%d").to_string(),
            end: e.format("%Y-%m-%d").to_string(),
        });
    }

    ranges
}

// ── Auth & Members handlers ─────────────────────────

async fn auth_verify(
    State(state): State<AppState>,
    Json(body): Json<AuthVerifyRequest>,
) -> (StatusCode, Json<AuthVerifyResponse>) {
    let fail = |msg: &str| {
        (
            StatusCode::UNAUTHORIZED,
            Json(AuthVerifyResponse {
                ok: false,
                token: None,
                error: Some(msg.into()),
            }),
        )
    };

    // 1. Validate timestamp in message (format: "enablerdao-auth:<unix_timestamp>")
    let parts: Vec<&str> = body.message.splitn(2, ':').collect();
    if parts.len() != 2 || parts[0] != "enablerdao-auth" {
        return fail("invalid message format");
    }
    let ts: i64 = match parts[1].parse() {
        Ok(v) => v,
        Err(_) => return fail("invalid timestamp"),
    };
    let now = chrono::Utc::now().timestamp();
    if (now - ts).abs() > MESSAGE_MAX_AGE_SECS {
        return fail("message expired");
    }

    // 2. Decode public key (bs58)
    let pubkey_bytes: [u8; 32] = match bs58::decode(&body.wallet_address).into_vec() {
        Ok(v) if v.len() == 32 => {
            let mut arr = [0u8; 32];
            arr.copy_from_slice(&v);
            arr
        }
        _ => return fail("invalid wallet address"),
    };

    // 3. Decode signature (base64)
    let sig_bytes: [u8; 64] =
        match base64::Engine::decode(&base64::engine::general_purpose::STANDARD, &body.signature) {
            Ok(v) if v.len() == 64 => {
                let mut arr = [0u8; 64];
                arr.copy_from_slice(&v);
                arr
            }
            _ => return fail("invalid signature"),
        };

    // 4. Verify Ed25519 signature
    let verifying_key = match ed25519_dalek::VerifyingKey::from_bytes(&pubkey_bytes) {
        Ok(k) => k,
        Err(_) => return fail("invalid public key"),
    };
    let signature = ed25519_dalek::Signature::from_bytes(&sig_bytes);
    if ed25519_dalek::Verifier::verify(&verifying_key, body.message.as_bytes(), &signature).is_err()
    {
        return fail("signature verification failed");
    }

    // 5. Check EBR token balance via Solana RPC
    let rpc_url = std::env::var("SOLANA_RPC_URL")
        .unwrap_or_else(|_| "https://api.mainnet-beta.solana.com".into());

    match check_ebr_balance(&state.http_client, &rpc_url, &body.wallet_address).await {
        Ok(balance) if balance >= EBR_MIN_BALANCE => {}
        Ok(balance) => {
            return fail(&format!(
                "insufficient EBR balance: {} (need >= {})",
                balance, EBR_MIN_BALANCE
            ));
        }
        Err(e) => {
            tracing::error!(err = %e, "Solana RPC error");
            return fail("failed to check token balance");
        }
    }

    // 6. Generate session token
    let token = generate_session_token();
    {
        // Clean expired sessions while we hold the lock
        let mut sessions = state.sessions.write().await;
        sessions.retain(|_, s| s.expires_at > std::time::Instant::now());
        sessions.insert(
            token.clone(),
            Session {
                wallet_address: body.wallet_address.clone(),
                expires_at: std::time::Instant::now() + SESSION_TTL,
            },
        );
    }

    info!(wallet = %body.wallet_address, "Auth verified, session created");

    spawn_line_notification(
        state.http_client.clone(),
        format!(
            "[Auth] ウォレット認証成功\nアドレス: {}...",
            &body.wallet_address[..std::cmp::min(8, body.wallet_address.len())]
        ),
    );

    (
        StatusCode::OK,
        Json(AuthVerifyResponse {
            ok: true,
            token: Some(token),
            error: None,
        }),
    )
}

async fn check_ebr_balance(
    client: &reqwest::Client,
    rpc_url: &str,
    wallet: &str,
) -> Result<u64, String> {
    let payload = serde_json::json!({
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getTokenAccountsByOwner",
        "params": [
            wallet,
            { "mint": EBR_MINT },
            { "encoding": "jsonParsed" }
        ]
    });

    let resp = client
        .post(rpc_url)
        .json(&payload)
        .send()
        .await
        .map_err(|e| format!("RPC request failed: {}", e))?;

    let body: serde_json::Value = resp
        .json()
        .await
        .map_err(|e| format!("RPC response parse failed: {}", e))?;

    if let Some(err) = body.get("error") {
        return Err(format!("RPC error: {}", err));
    }

    let accounts = body["result"]["value"]
        .as_array()
        .ok_or_else(|| "unexpected RPC response format".to_string())?;

    let mut total: u64 = 0;
    for account in accounts {
        if let Some(amount_str) =
            account["account"]["data"]["parsed"]["info"]["tokenAmount"]["amount"].as_str()
        {
            total += amount_str.parse::<u64>().unwrap_or(0);
        }
    }

    // EBR has 9 decimals
    let balance = total / 1_000_000_000;
    Ok(balance)
}

fn generate_session_token() -> String {
    use rand::Rng;
    let mut rng = rand::thread_rng();
    let bytes: [u8; 32] = rng.gen();
    base64::Engine::encode(&base64::engine::general_purpose::URL_SAFE_NO_PAD, bytes)
}

// ── NOT A HOTEL API integration ─────────────────────

async fn refresh_nah_firebase_token(client: &reqwest::Client) -> Result<String, String> {
    let refresh_token =
        std::env::var("NAH_REFRESH_TOKEN").map_err(|_| "NAH_REFRESH_TOKEN not set".to_string())?;
    let api_key =
        std::env::var("NAH_API_KEY").map_err(|_| "NAH_API_KEY not set".to_string())?;

    let url = format!(
        "https://securetoken.googleapis.com/v1/token?key={}",
        api_key
    );
    let resp = client
        .post(&url)
        .form(&[
            ("grant_type", "refresh_token"),
            ("refresh_token", refresh_token.as_str()),
        ])
        .send()
        .await
        .map_err(|e| format!("Firebase refresh failed: {}", e))?;

    if !resp.status().is_success() {
        return Err(format!("Firebase refresh returned {}", resp.status()));
    }

    let body: FirebaseTokenResponse = resp
        .json()
        .await
        .map_err(|e| format!("Firebase response parse failed: {}", e))?;

    Ok(body.id_token)
}

async fn get_nah_id_token(state: &AppState) -> Result<String, String> {
    {
        let cache = state.nah_token.read().await;
        if let Some(ref c) = *cache {
            if c.expires_at > std::time::Instant::now() {
                return Ok(c.id_token.clone());
            }
        }
    }

    let token = refresh_nah_firebase_token(&state.http_client).await?;

    {
        let mut cache = state.nah_token.write().await;
        *cache = Some(NahTokenCache {
            id_token: token.clone(),
            expires_at: std::time::Instant::now() + NAH_TOKEN_TTL,
        });
    }

    Ok(token)
}

struct NahVacancyResult {
    booked_ranges: Vec<DateRange>,
    days: Vec<DayInfo>,
}

async fn fetch_nah_vacancy(
    client: &reqwest::Client,
    id_token: &str,
    house_group_id: &str,
) -> Result<NahVacancyResult, String> {
    let url = format!("{}/get_vacancy_calendar", NAH_API_BASE);
    let payload = serde_json::json!({
        "daoUse": {
            "houseGroupId": house_group_id,
            "limitToOwnedSlotDeadline": false
        }
    });

    let resp = client
        .post(&url)
        .bearer_auth(id_token)
        .header("not-a-platform", "web")
        .header("not-a-web-app-version", "v0.1.131")
        .json(&payload)
        .send()
        .await
        .map_err(|e| format!("NAH API request failed: {}", e))?;

    if !resp.status().is_success() {
        return Err(format!("NAH API returned {}", resp.status()));
    }

    let body: NahVacancyResponse = resp
        .json()
        .await
        .map_err(|e| format!("NAH response parse failed: {}", e))?;

    let calendar = match body.calendar {
        Some(c) => c,
        None => {
            return Ok(NahVacancyResult {
                booked_ranges: Vec::new(),
                days: Vec::new(),
            })
        }
    };

    let booked_ranges = nah_calendar_to_ranges(&calendar);
    let days = nah_calendar_to_days(&calendar);

    Ok(NahVacancyResult {
        booked_ranges,
        days,
    })
}

fn nah_calendar_to_days(calendar: &NahCalendar) -> Vec<DayInfo> {
    let mut days = Vec::new();
    for month in &calendar.months {
        for day in &month.days {
            let date_str = format!(
                "{}-{:02}-{:02}",
                day.date.year, day.date.month, day.date.day
            );
            days.push(DayInfo {
                date: date_str,
                vacant: day.vacant,
                price_type: day.price_type.clone().unwrap_or_else(|| "standard".into()),
            });
        }
    }
    days
}

fn nah_calendar_to_ranges(calendar: &NahCalendar) -> Vec<DateRange> {
    let mut ranges = Vec::new();
    let mut range_start: Option<String> = None;
    let mut last_booked: Option<String> = None;

    for month in &calendar.months {
        for day in &month.days {
            let date_str = format!(
                "{}-{:02}-{:02}",
                day.date.year, day.date.month, day.date.day
            );
            if !day.vacant {
                if range_start.is_none() {
                    range_start = Some(date_str.clone());
                }
                last_booked = Some(date_str);
            } else if let (Some(start), Some(_)) = (range_start.take(), last_booked.take()) {
                // End is the first available day (exclusive)
                ranges.push(DateRange {
                    start,
                    end: date_str.clone(),
                });
            }
        }
    }

    // Close any remaining range
    if let (Some(start), Some(end)) = (range_start, last_booked) {
        if let Some(next) = next_day_str(&end) {
            ranges.push(DateRange { start, end: next });
        }
    }

    ranges
}

fn next_day_str(date: &str) -> Option<String> {
    let d = chrono::NaiveDate::parse_from_str(date, "%Y-%m-%d").ok()?;
    let next = d + chrono::Duration::days(1);
    Some(next.format("%Y-%m-%d").to_string())
}

async fn fetch_nah_owner_home(
    client: &reqwest::Client,
    id_token: &str,
) -> Result<NahOwnerHomeData, String> {
    let url = format!("{}/get_owner_home_data", NAH_API_BASE);
    let resp = client
        .post(&url)
        .bearer_auth(id_token)
        .header("not-a-platform", "web")
        .header("not-a-web-app-version", "v0.1.131")
        .json(&serde_json::json!({}))
        .send()
        .await
        .map_err(|e| format!("NAH owner home request failed: {}", e))?;

    if !resp.status().is_success() {
        return Err(format!("NAH owner home returned {}", resp.status()));
    }

    resp.json()
        .await
        .map_err(|e| format!("NAH owner home parse failed: {}", e))
}

/// Discover all house groups the user has access to, then fetch vacancy for each.
async fn fetch_nah_member_availability(
    state: &AppState,
) -> Result<Vec<PropertyAvailability>, String> {
    let id_token = get_nah_id_token(state).await?;
    let now = chrono::Utc::now();

    // Discover available properties
    let home = fetch_nah_owner_home(&state.http_client, &id_token).await?;

    // Collect (house_group_id, display_name, location, property_type) from owned bundles + club houses
    struct NahTarget {
        group_id: String,
        name: String,
        location: String,
        property_type: String,
    }
    let mut targets: Vec<NahTarget> = Vec::new();

    for prop in &home.available_properties {
        if let Some(ref bundle) = prop.owned_house_bundle {
            if let Some(ref b) = bundle.bundle {
                let name = match (&b.parent_name, &b.name) {
                    (Some(p), Some(n)) => format!("{} {}", p, n),
                    (Some(p), None) => p.clone(),
                    (None, Some(n)) => n.clone(),
                    (None, None) => "Unknown".into(),
                };
                let location = b.parent_name.clone().unwrap_or_default();
                for gid in &b.house_group_ids {
                    targets.push(NahTarget {
                        group_id: gid.clone(),
                        name: name.clone(),
                        location: location.clone(),
                        property_type: "villa".into(),
                    });
                }
            }
        }
    }

    for ch in &home.club_houses {
        if let Some(ref hg) = ch.house_group {
            let name = match (&hg.place_name, &hg.name) {
                (Some(p), Some(n)) => format!("{} {}", p, n),
                (Some(p), None) => p.clone(),
                (None, Some(n)) => n.clone(),
                (None, None) => hg.id.clone(),
            };
            let location = hg.place_name.clone().unwrap_or_default();
            targets.push(NahTarget {
                group_id: hg.id.clone(),
                name,
                location,
                property_type: "club_house".into(),
            });
        }
    }

    if targets.is_empty() {
        return Err("No accessible NOT A HOTEL properties found".into());
    }

    info!(
        count = targets.len(),
        "Fetching NAH vacancy for discovered properties"
    );

    let mut avail = Vec::new();
    for t in &targets {
        match fetch_nah_vacancy(&state.http_client, &id_token, &t.group_id).await {
            Ok(result) => {
                avail.push(PropertyAvailability {
                    property_id: format!("nah_{}", t.group_id),
                    property_name: t.name.clone(),
                    location: t.location.clone(),
                    property_type: t.property_type.clone(),
                    house_group_id: t.group_id.clone(),
                    booked_ranges: result.booked_ranges,
                    days: result.days,
                    updated_at: now.format("%Y-%m-%dT%H:%M:%SZ").to_string(),
                });
            }
            Err(e) => {
                tracing::warn!(property = %t.group_id, err = %e, "NAH vacancy fetch failed");
                avail.push(PropertyAvailability {
                    property_id: format!("nah_{}", t.group_id),
                    property_name: t.name.clone(),
                    location: t.location.clone(),
                    property_type: t.property_type.clone(),
                    house_group_id: t.group_id.clone(),
                    booked_ranges: Vec::new(),
                    days: Vec::new(),
                    updated_at: now.format("%Y-%m-%dT%H:%M:%SZ").to_string(),
                });
            }
        }
    }

    Ok(avail)
}

async fn get_member_availability(
    State(state): State<AppState>,
    req: axum::http::Request<axum::body::Body>,
) -> Result<Json<Vec<PropertyAvailability>>, StatusCode> {
    // Extract Bearer token
    let auth_header = req
        .headers()
        .get(axum::http::header::AUTHORIZATION)
        .and_then(|v| v.to_str().ok())
        .unwrap_or("");

    let token = auth_header
        .strip_prefix("Bearer ")
        .unwrap_or("")
        .to_string();

    if token.is_empty() {
        return Err(StatusCode::UNAUTHORIZED);
    }

    // Validate session
    {
        let sessions = state.sessions.read().await;
        match sessions.get(&token) {
            Some(session) if session.expires_at > std::time::Instant::now() => {}
            _ => return Err(StatusCode::UNAUTHORIZED),
        }
    }

    // Check NAH member cache
    {
        let cache = state.nah_member_cache.read().await;
        if let Some(ref c) = *cache {
            if c.updated_at.elapsed() < NAH_CACHE_TTL {
                return Ok(Json(c.data.clone()));
            }
        }
    }

    // Fetch real NOT A HOTEL availability
    let now = chrono::Utc::now();
    let avail = match fetch_nah_member_availability(&state).await {
        Ok(data) => data,
        Err(e) => {
            tracing::warn!(err = %e, "NAH API unavailable, using demo data");
            MEMBER_PROPERTY_DEFS
                .iter()
                .map(|def| {
                    let booked = generate_demo_bookings(def.id, &now);
                    let prop_type = if def.name.contains("CLUB HOUSE") {
                        "club_house"
                    } else {
                        "villa"
                    };
                    PropertyAvailability {
                        property_id: def.id.into(),
                        property_name: format!("{} ({})", def.name, def.location),
                        location: def.location.into(),
                        property_type: prop_type.into(),
                        house_group_id: def.id.into(),
                        booked_ranges: booked,
                        days: Vec::new(),
                        updated_at: now.format("%Y-%m-%dT%H:%M:%SZ").to_string(),
                    }
                })
                .collect()
        }
    };

    // Update cache
    {
        let mut cache = state.nah_member_cache.write().await;
        *cache = Some(NahMemberCache {
            data: avail.clone(),
            updated_at: std::time::Instant::now(),
        });
    }

    Ok(Json(avail))
}

// ── Inquiry ─────────────────────────────────────────

#[derive(Deserialize)]
pub struct InquiryRequest {
    pub property_id: String,
    pub property_name: String,
    pub check_in: String,
    pub check_out: String,
    pub guests: u32,
    #[serde(default)]
    pub message: String,
}

#[derive(Serialize, Deserialize)]
pub struct InquiryResponse {
    pub ok: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}

async fn member_inquiry(
    State(state): State<AppState>,
    req: axum::http::Request<axum::body::Body>,
) -> (StatusCode, Json<InquiryResponse>) {
    let fail = |status: StatusCode, msg: &str| {
        (
            status,
            Json(InquiryResponse {
                ok: false,
                error: Some(msg.into()),
            }),
        )
    };

    // Extract Bearer token
    let auth_header = req
        .headers()
        .get(axum::http::header::AUTHORIZATION)
        .and_then(|v| v.to_str().ok())
        .unwrap_or("");
    let token = auth_header
        .strip_prefix("Bearer ")
        .unwrap_or("")
        .to_string();
    if token.is_empty() {
        return fail(StatusCode::UNAUTHORIZED, "missing auth token");
    }

    // Validate session
    let wallet_addr = {
        let sessions = state.sessions.read().await;
        match sessions.get(&token) {
            Some(session) if session.expires_at > std::time::Instant::now() => {
                session.wallet_address.clone()
            }
            _ => return fail(StatusCode::UNAUTHORIZED, "invalid or expired session"),
        }
    };

    // Parse body from remaining request
    let body_bytes = match axum::body::to_bytes(req.into_body(), 65536).await {
        Ok(b) => b,
        Err(_) => return fail(StatusCode::BAD_REQUEST, "invalid request body"),
    };
    let body: InquiryRequest = match serde_json::from_slice(&body_bytes) {
        Ok(b) => b,
        Err(_) => return fail(StatusCode::BAD_REQUEST, "invalid JSON"),
    };

    // Validate
    if body.property_id.is_empty() || body.check_in.is_empty() || body.check_out.is_empty() {
        return fail(StatusCode::BAD_REQUEST, "missing required fields");
    }
    if body.guests == 0 || body.guests > 20 {
        return fail(StatusCode::BAD_REQUEST, "guests must be 1-20");
    }

    info!(
        wallet = %wallet_addr,
        property = %body.property_name,
        check_in = %body.check_in,
        check_out = %body.check_out,
        guests = body.guests,
        "Member inquiry received"
    );

    spawn_line_notification(
        state.http_client.clone(),
        format!(
            "[問い合わせ] {}\n期間: {}~{}\n人数: {}名",
            body.property_name, body.check_in, body.check_out, body.guests
        ),
    );

    // Send email via Resend
    let api_key = std::env::var("RESEND_API_KEY").unwrap_or_default();
    if api_key.is_empty() {
        info!("RESEND_API_KEY not set — inquiry logged but not emailed");
        return (
            StatusCode::OK,
            Json(InquiryResponse {
                ok: true,
                error: None,
            }),
        );
    }

    let to_email = std::env::var("INQUIRY_EMAIL")
        .or_else(|_| std::env::var("RESEND_TO"))
        .unwrap_or_else(|_| "info@enablerdao.com".into());

    let html = format!(
        r#"<h2>物件問い合わせ</h2>
<table style="border-collapse:collapse;">
<tr><td style="padding:4px 12px;font-weight:bold;">物件</td><td style="padding:4px 12px;">{} ({})</td></tr>
<tr><td style="padding:4px 12px;font-weight:bold;">チェックイン</td><td style="padding:4px 12px;">{}</td></tr>
<tr><td style="padding:4px 12px;font-weight:bold;">チェックアウト</td><td style="padding:4px 12px;">{}</td></tr>
<tr><td style="padding:4px 12px;font-weight:bold;">人数</td><td style="padding:4px 12px;">{}名</td></tr>
<tr><td style="padding:4px 12px;font-weight:bold;">ウォレット</td><td style="padding:4px 12px;">{}</td></tr>
<tr><td style="padding:4px 12px;font-weight:bold;">メッセージ</td><td style="padding:4px 12px;">{}</td></tr>
</table>"#,
        body.property_name,
        body.property_id,
        body.check_in,
        body.check_out,
        body.guests,
        wallet_addr,
        if body.message.is_empty() {
            "(なし)"
        } else {
            &body.message
        }
    );

    let payload = ResendEmail {
        from: "EnablerDAO <noreply@enablerdao.com>".into(),
        to: vec![to_email],
        subject: format!(
            "物件問い合わせ: {} ({}-{})",
            body.property_name, body.check_in, body.check_out
        ),
        html,
    };

    match state
        .http_client
        .post("https://api.resend.com/emails")
        .bearer_auth(&api_key)
        .json(&payload)
        .send()
        .await
    {
        Ok(res) if res.status().is_success() => {
            info!(property = %body.property_name, "Inquiry email sent");
            (
                StatusCode::OK,
                Json(InquiryResponse {
                    ok: true,
                    error: None,
                }),
            )
        }
        Ok(res) => {
            let status = res.status();
            tracing::error!(status = %status, "Inquiry email send failed");
            fail(StatusCode::INTERNAL_SERVER_ERROR, "email send failed")
        }
        Err(e) => {
            tracing::error!(err = %e, "Inquiry email request failed");
            fail(StatusCode::INTERNAL_SERVER_ERROR, "email send failed")
        }
    }
}

// ── Chat / AI Concierge ─────────────────────────────

#[derive(Deserialize)]
pub struct ChatRequest {
    pub messages: Vec<ChatMessage>,
    #[serde(default)]
    pub property_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChatMessage {
    pub role: String,
    pub content: String,
}

#[derive(Serialize, Deserialize)]
pub struct ChatResponse {
    pub message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub action: Option<ChatAction>,
}

#[derive(Serialize, Deserialize)]
pub struct ChatAction {
    pub action_type: String,
    pub check_in: String,
    pub check_out: String,
    pub guests: u32,
    pub amount: u64,
    pub description: String,
}

const GARAGE_HOUSE_SYSTEM_PROMPT: &str = r#"あなたはEnablerDAOの物件「ガレージハウス ホノルル」の専属AIコンシェルジュです。
丁寧で親しみやすく、日本語と英語の両方に対応してください。ユーザーの言語に合わせて回答してください。

## 物件情報
- 名前: ガレージハウス ホノルル (Garage House Honolulu)
- 場所: ハワイ州ホノルル、中心街から車で15分
- 特徴: 砂浜まで徒歩0分、ココヘッドを望む絶景オーシャンビュー、BBQ設備完備
- Airbnb: https://www.airbnb.jp/rooms/936009273046846679

## 料金目安（1泊あたり）
- 通常期: ¥35,000〜¥45,000
- 繁忙期(GW/夏/年末年始): ¥50,000〜¥65,000
- 最低宿泊数: 2泊
- クリーニング費: ¥15,000（1回）
- 最大宿泊人数: 6名

## 設備・アメニティ
- ガレージ（車1台）、無料Wi-Fi、エアコン
- フルキッチン（コンロ、冷蔵庫、電子レンジ、食器）
- 洗濯機、乾燥機
- BBQグリル（屋外テラス）
- ベッドルーム2室（キングベッド1、ツインベッド1）
- バスルーム2室
- プライベートビーチアクセス

## 周辺情報
- ワイキキビーチ: 車で15分
- ダイヤモンドヘッド: 車で20分
- アラモアナセンター: 車で10分
- ダニエル・K・イノウエ国際空港: 車で25分

## 予約ルール
- ユーザーが予約を確定したいと明確に伝えた場合にのみ、以下のタグを出力してください:
  [BOOK:チェックイン日,チェックアウト日,人数,合計金額(円)]
  例: [BOOK:2026-03-15,2026-03-18,2,120000]
- 金額は宿泊数×1泊料金+クリーニング費で計算してください
- 日付はYYYY-MM-DD形式で出力してください
- 予約タグは必ず回答の最後に付けてください

## 注意事項
- 空き状況を聞かれた場合は、大まかな目安を伝えつつ「正確な空き状況はAirbnbでもご確認いただけます」と案内してください
- 料金はあくまで目安であることを伝えてください
- 質問に答えられない場合は info@enablerdao.com への問い合わせを案内してください
"#;

async fn chat_handler(
    State(state): State<AppState>,
    Json(body): Json<ChatRequest>,
) -> (StatusCode, Json<ChatResponse>) {
    let llm_url = std::env::var("CHAT_LLM_URL")
        .unwrap_or_else(|_| "https://api.openai.com/v1/chat/completions".into());
    let llm_api_key = std::env::var("CHAT_LLM_API_KEY").unwrap_or_default();
    let llm_model =
        std::env::var("CHAT_LLM_MODEL").unwrap_or_else(|_| "gpt-4o-mini".into());

    if llm_api_key.is_empty() {
        return (
            StatusCode::SERVICE_UNAVAILABLE,
            Json(ChatResponse {
                message: "チャット機能は現在準備中です。お問い合わせは info@enablerdao.com までお願いします。".into(),
                action: None,
            }),
        );
    }

    // Validate messages
    if body.messages.is_empty() || body.messages.len() > 50 {
        return (
            StatusCode::BAD_REQUEST,
            Json(ChatResponse {
                message: "メッセージを入力してください。".into(),
                action: None,
            }),
        );
    }

    // Build LLM messages with system prompt
    let mut llm_messages = vec![serde_json::json!({
        "role": "system",
        "content": GARAGE_HOUSE_SYSTEM_PROMPT
    })];
    for msg in &body.messages {
        let role = match msg.role.as_str() {
            "user" | "assistant" => msg.role.as_str(),
            _ => continue,
        };
        llm_messages.push(serde_json::json!({
            "role": role,
            "content": msg.content
        }));
    }

    let llm_payload = serde_json::json!({
        "model": llm_model,
        "messages": llm_messages,
        "max_tokens": 1024,
        "temperature": 0.7,
    });

    let resp = match state
        .http_client
        .post(&llm_url)
        .bearer_auth(&llm_api_key)
        .json(&llm_payload)
        .send()
        .await
    {
        Ok(r) => r,
        Err(e) => {
            tracing::error!(err = %e, "LLM API request failed");
            return (
                StatusCode::BAD_GATEWAY,
                Json(ChatResponse {
                    message: "AIサービスに接続できませんでした。しばらく後にお試しください。".into(),
                    action: None,
                }),
            );
        }
    };

    if !resp.status().is_success() {
        let status = resp.status();
        tracing::error!(status = %status, "LLM API returned error");
        return (
            StatusCode::BAD_GATEWAY,
            Json(ChatResponse {
                message: "AIサービスでエラーが発生しました。しばらく後にお試しください。".into(),
                action: None,
            }),
        );
    }

    let llm_body: serde_json::Value = match resp.json().await {
        Ok(v) => v,
        Err(e) => {
            tracing::error!(err = %e, "LLM response parse failed");
            return (
                StatusCode::BAD_GATEWAY,
                Json(ChatResponse {
                    message: "AI応答の解析に失敗しました。".into(),
                    action: None,
                }),
            );
        }
    };

    let ai_message = llm_body["choices"][0]["message"]["content"]
        .as_str()
        .unwrap_or("申し訳ございません、応答を生成できませんでした。")
        .to_string();

    // Parse BOOK tag if present
    let action = parse_book_tag(&ai_message);

    // Strip the BOOK tag from the visible message
    let clean_message = if action.is_some() {
        let re_start = ai_message.find("[BOOK:");
        let re_end = ai_message.find(']').map(|i| i + 1);
        match (re_start, re_end) {
            (Some(s), Some(e)) if e > s => {
                let mut m = ai_message.clone();
                m.replace_range(s..e, "");
                m.trim().to_string()
            }
            _ => ai_message,
        }
    } else {
        ai_message
    };

    (
        StatusCode::OK,
        Json(ChatResponse {
            message: clean_message,
            action,
        }),
    )
}

fn parse_book_tag(text: &str) -> Option<ChatAction> {
    // Look for [BOOK:check_in,check_out,guests,amount]
    let start = text.find("[BOOK:")?;
    let end = text[start..].find(']')? + start;
    let inner = &text[start + 6..end];
    let parts: Vec<&str> = inner.split(',').collect();
    if parts.len() != 4 {
        return None;
    }
    let check_in = parts[0].trim().to_string();
    let check_out = parts[1].trim().to_string();
    let guests: u32 = parts[2].trim().parse().ok()?;
    let amount: u64 = parts[3].trim().parse().ok()?;

    // Validate date format (basic check)
    if check_in.len() != 10 || check_out.len() != 10 {
        return None;
    }

    Some(ChatAction {
        action_type: "checkout".into(),
        check_in,
        check_out,
        guests,
        amount,
        description: format!("ガレージハウス ホノルル 宿泊予約"),
    })
}

// ── Stripe Checkout ─────────────────────────────────

#[derive(Deserialize)]
pub struct CheckoutRequest {
    pub property_id: String,
    pub check_in: String,
    pub check_out: String,
    pub guests: u32,
    pub amount: u64,
    #[serde(default)]
    pub customer_email: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct CheckoutResponse {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub url: Option<String>,
    pub ok: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}

async fn chat_checkout(
    State(state): State<AppState>,
    Json(body): Json<CheckoutRequest>,
) -> (StatusCode, Json<CheckoutResponse>) {
    let fail = |msg: &str| {
        (
            StatusCode::BAD_REQUEST,
            Json(CheckoutResponse {
                url: None,
                ok: false,
                error: Some(msg.into()),
            }),
        )
    };

    let stripe_key = std::env::var("STRIPE_SECRET_KEY").unwrap_or_default();
    if stripe_key.is_empty() {
        return (
            StatusCode::SERVICE_UNAVAILABLE,
            Json(CheckoutResponse {
                url: None,
                ok: false,
                error: Some("決済機能は現在準備中です。".into()),
            }),
        );
    }

    // Validate input
    if body.check_in.is_empty() || body.check_out.is_empty() {
        return fail("チェックイン/チェックアウト日を指定してください");
    }
    if body.guests == 0 || body.guests > 10 {
        return fail("宿泊人数は1〜10名で指定してください");
    }
    if body.amount == 0 || body.amount > 10_000_000 {
        return fail("金額が不正です");
    }

    let client = stripe::Client::new(stripe_key);

    let mut params = stripe::CreateCheckoutSession::new();
    params.mode = Some(stripe::CheckoutSessionMode::Payment);
    params.success_url = Some("https://enablerdao.com/?booking=success");
    params.cancel_url = Some("https://enablerdao.com/?booking=cancel");

    if let Some(ref email) = body.customer_email {
        params.customer_email = Some(email.as_str());
    }

    let line_item = stripe::CreateCheckoutSessionLineItems {
        price_data: Some(stripe::CreateCheckoutSessionLineItemsPriceData {
            currency: stripe::Currency::JPY,
            product_data: Some(
                stripe::CreateCheckoutSessionLineItemsPriceDataProductData {
                    name: format!(
                        "ガレージハウス ホノルル ({} ~ {}, {}名)",
                        body.check_in, body.check_out, body.guests
                    ),
                    ..Default::default()
                },
            ),
            unit_amount: Some(body.amount as i64),
            ..Default::default()
        }),
        quantity: Some(1),
        ..Default::default()
    };
    params.line_items = Some(vec![line_item]);

    let mut metadata = std::collections::HashMap::new();
    metadata.insert("property_id".into(), body.property_id.clone());
    metadata.insert("check_in".into(), body.check_in.clone());
    metadata.insert("check_out".into(), body.check_out.clone());
    metadata.insert("guests".into(), body.guests.to_string());
    params.metadata = Some(metadata);

    match stripe::CheckoutSession::create(&client, params).await {
        Ok(session) => {
            if let Some(url) = session.url {
                info!(
                    property = %body.property_id,
                    check_in = %body.check_in,
                    check_out = %body.check_out,
                    amount = body.amount,
                    "Stripe checkout session created"
                );
                spawn_line_notification(
                    state.http_client.clone(),
                    format!(
                        "[予約] Stripe作成\n物件: {}\n金額: {}円",
                        body.property_id, body.amount
                    ),
                );
                (
                    StatusCode::OK,
                    Json(CheckoutResponse {
                        url: Some(url),
                        ok: true,
                        error: None,
                    }),
                )
            } else {
                tracing::error!("Stripe session created but no URL returned");
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(CheckoutResponse {
                        url: None,
                        ok: false,
                        error: Some("決済セッションの作成に失敗しました。".into()),
                    }),
                )
            }
        }
        Err(e) => {
            tracing::error!(err = %e, "Stripe checkout session creation failed");
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(CheckoutResponse {
                    url: None,
                    ok: false,
                    error: Some("決済セッションの作成に失敗しました。".into()),
                }),
            )
        }
    }
}

// ── LINE Messaging API ──────────────────────────────

#[derive(Serialize)]
struct LinePushMessage {
    to: String,
    messages: Vec<LineMessage>,
}

#[derive(Serialize)]
#[serde(tag = "type")]
enum LineMessage {
    #[serde(rename = "text")]
    Text { text: String },
}

#[derive(Serialize)]
struct LineReplyMessage {
    #[serde(rename = "replyToken")]
    reply_token: String,
    messages: Vec<LineMessage>,
}

#[derive(Deserialize)]
struct LineWebhookBody {
    events: Vec<LineEvent>,
}

#[derive(Deserialize)]
struct LineEvent {
    #[serde(rename = "type")]
    event_type: String,
    #[serde(rename = "replyToken")]
    reply_token: Option<String>,
    source: Option<LineSource>,
    message: Option<LineEventMessage>,
}

#[derive(Deserialize)]
struct LineSource {
    #[serde(rename = "type")]
    source_type: Option<String>,
    #[serde(rename = "groupId")]
    group_id: Option<String>,
    #[serde(rename = "userId")]
    user_id: Option<String>,
}

#[derive(Deserialize)]
struct LineEventMessage {
    #[serde(rename = "type")]
    message_type: String,
    text: Option<String>,
}

/// Fire-and-forget LINE push notification to admin + group.
/// Sends to LINE_ADMIN_USER_ID and LINE_GROUP_ID (both optional).
fn spawn_line_notification(client: reqwest::Client, message: String) {
    let token = match std::env::var("LINE_CHANNEL_ACCESS_TOKEN") {
        Ok(t) if !t.is_empty() => t,
        _ => return,
    };

    // Collect all notification targets
    let mut targets: Vec<String> = Vec::new();
    if let Ok(id) = std::env::var("LINE_ADMIN_USER_ID") {
        if !id.is_empty() {
            targets.push(id);
        }
    }
    if let Ok(id) = std::env::var("LINE_GROUP_ID") {
        if !id.is_empty() {
            targets.push(id);
        }
    }
    if targets.is_empty() {
        return;
    }

    tokio::spawn(async move {
        for target in targets {
            let payload = LinePushMessage {
                to: target.clone(),
                messages: vec![LineMessage::Text {
                    text: message.clone(),
                }],
            };
            if let Err(e) = client
                .post("https://api.line.me/v2/bot/message/push")
                .bearer_auth(&token)
                .json(&payload)
                .send()
                .await
            {
                tracing::warn!(target = %target, err = %e, "LINE push notification failed");
            }
        }
    });
}

/// Reply to a LINE user via the Reply API (max 5000 chars).
async fn send_line_reply(client: &reqwest::Client, reply_token: &str, text: &str) {
    let token = match std::env::var("LINE_CHANNEL_ACCESS_TOKEN") {
        Ok(t) if !t.is_empty() => t,
        _ => return,
    };

    // LINE text message limit: 5000 characters
    let truncated = if text.chars().count() > 5000 {
        let mut s: String = text.chars().take(4997).collect();
        s.push_str("...");
        s
    } else {
        text.to_string()
    };

    let payload = LineReplyMessage {
        reply_token: reply_token.to_string(),
        messages: vec![LineMessage::Text { text: truncated }],
    };
    if let Err(e) = client
        .post("https://api.line.me/v2/bot/message/reply")
        .bearer_auth(&token)
        .json(&payload)
        .send()
        .await
    {
        tracing::warn!(err = %e, "LINE reply failed");
    }
}

/// Push a message to a specific LINE user (for delayed responses when reply token expires).
async fn send_line_push(client: &reqwest::Client, user_id: &str, text: &str) {
    let token = match std::env::var("LINE_CHANNEL_ACCESS_TOKEN") {
        Ok(t) if !t.is_empty() => t,
        _ => return,
    };
    let payload = LinePushMessage {
        to: user_id.to_string(),
        messages: vec![LineMessage::Text {
            text: text.to_string(),
        }],
    };
    if let Err(e) = client
        .post("https://api.line.me/v2/bot/message/push")
        .bearer_auth(&token)
        .json(&payload)
        .send()
        .await
    {
        tracing::warn!(err = %e, "LINE push (delayed reply) failed");
    }
}

/// Forward user text to the chat AI (reuses the same LLM config as chat_handler).
async fn forward_to_chat_ai(client: &reqwest::Client, user_text: &str) -> String {
    let llm_url = std::env::var("CHAT_LLM_URL")
        .unwrap_or_else(|_| "https://api.openai.com/v1/chat/completions".into());
    let llm_api_key = std::env::var("CHAT_LLM_API_KEY").unwrap_or_default();
    let llm_model = std::env::var("CHAT_LLM_MODEL").unwrap_or_else(|_| "gpt-4o-mini".into());

    if llm_api_key.is_empty() {
        return "チャットAIは現在準備中です。お問い合わせは info@enablerdao.com までお願いします。"
            .to_string();
    }

    let payload = serde_json::json!({
        "model": llm_model,
        "messages": [
            { "role": "system", "content": GARAGE_HOUSE_SYSTEM_PROMPT },
            { "role": "user", "content": user_text }
        ],
        "max_tokens": 1024,
        "temperature": 0.7,
    });

    let resp = match client.post(&llm_url).bearer_auth(&llm_api_key).json(&payload).send().await {
        Ok(r) if r.status().is_success() => r,
        _ => {
            return "申し訳ございません、AIサービスに接続できませんでした。".to_string();
        }
    };

    match resp.json::<serde_json::Value>().await {
        Ok(body) => body["choices"][0]["message"]["content"]
            .as_str()
            .unwrap_or("申し訳ございません、応答を生成できませんでした。")
            .to_string(),
        Err(_) => "AI応答の解析に失敗しました。".to_string(),
    }
}

/// LINE Webhook endpoint — verifies signature, processes events asynchronously.
async fn line_webhook(
    State(state): State<AppState>,
    headers: HeaderMap,
    body: axum::body::Bytes,
) -> StatusCode {
    // 1. Verify X-Line-Signature
    let channel_secret = match std::env::var("LINE_CHANNEL_SECRET") {
        Ok(s) if !s.is_empty() => s,
        _ => {
            tracing::warn!("LINE_CHANNEL_SECRET not set — rejecting webhook");
            return StatusCode::INTERNAL_SERVER_ERROR;
        }
    };

    let signature = match headers.get("x-line-signature").and_then(|v| v.to_str().ok()) {
        Some(s) => s.to_string(),
        None => {
            tracing::warn!("Missing X-Line-Signature header");
            return StatusCode::BAD_REQUEST;
        }
    };

    if !verify_line_signature(&channel_secret, &body, &signature) {
        tracing::warn!("Invalid LINE webhook signature");
        return StatusCode::UNAUTHORIZED;
    }

    // 2. Parse body
    let webhook_body: LineWebhookBody = match serde_json::from_slice(&body) {
        Ok(b) => b,
        Err(e) => {
            tracing::warn!(err = %e, "Failed to parse LINE webhook body");
            return StatusCode::BAD_REQUEST;
        }
    };

    // 3. Process events asynchronously (LINE requires quick 200 OK)
    let client = state.http_client.clone();
    tokio::spawn(async move {
        for event in webhook_body.events {
            // Log source info for discovering group IDs
            if let Some(ref source) = event.source {
                info!(
                    event_type = %event.event_type,
                    source_type = ?source.source_type,
                    group_id = ?source.group_id,
                    user_id = ?source.user_id,
                    "LINE webhook event"
                );
            }
            match event.event_type.as_str() {
                "message" => {
                    if let (Some(ref msg), Some(ref reply_token)) =
                        (event.message, event.reply_token)
                    {
                        match msg.message_type.as_str() {
                            "text" => {
                                if let Some(ref user_text) = msg.text {
                                    // Use timeout to respect reply token expiry (~30s)
                                    let ai_future = forward_to_chat_ai(&client, user_text);
                                    match tokio::time::timeout(
                                        std::time::Duration::from_secs(25),
                                        ai_future,
                                    )
                                    .await
                                    {
                                        Ok(ai_reply) => {
                                            send_line_reply(&client, reply_token, &ai_reply)
                                                .await;
                                        }
                                        Err(_) => {
                                            // Reply token may be expired; use Push API
                                            if let Some(ref source) = event.source {
                                                if let Some(ref uid) = source.user_id {
                                                    send_line_push(
                                                        &client,
                                                        uid,
                                                        "応答に時間がかかっています。しばらくお待ちください。",
                                                    )
                                                    .await;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            "sticker" => {} // Silent ignore
                            _ => {
                                send_line_reply(
                                    &client,
                                    reply_token,
                                    "テキストメッセージでご質問ください。画像・動画には対応しておりません。",
                                )
                                .await;
                            }
                        }
                    }
                }
                "follow" => {
                    if let Some(ref reply_token) = event.reply_token {
                        let welcome = "EnablerDAOへようこそ！🏠\n\n物件に関するご質問をお気軽にどうぞ。AIコンシェルジュがお答えします。";
                        send_line_reply(&client, reply_token, welcome).await;
                    }
                    if let Some(ref source) = event.source {
                        if let Some(ref uid) = source.user_id {
                            spawn_line_notification(
                                client.clone(),
                                format!("[LINE] 新規フォロー: {}", uid),
                            );
                        }
                    }
                }
                _ => {}
            }
        }
    });

    StatusCode::OK
}

/// Verify LINE webhook signature using HMAC-SHA256.
fn verify_line_signature(channel_secret: &str, body: &[u8], signature: &str) -> bool {
    use hmac::{Hmac, Mac};
    use sha2::Sha256;

    type HmacSha256 = Hmac<Sha256>;

    let mut mac = match HmacSha256::new_from_slice(channel_secret.as_bytes()) {
        Ok(m) => m,
        Err(_) => return false,
    };
    mac.update(body);
    let result = mac.finalize().into_bytes();
    let expected = base64::Engine::encode(&base64::engine::general_purpose::STANDARD, result);
    expected == signature
}

// ── Beds24 Booking ─────────────────────────────────

async fn get_beds24_token(state: &AppState) -> Result<String, String> {
    // Check cache
    {
        let cache = state.beds24_token.read().await;
        if let Some(ref c) = *cache {
            if c.expires_at > std::time::Instant::now() {
                return Ok(c.access_token.clone());
            }
        }
    }

    let refresh_token = std::env::var("BEDS24_REFRESH_TOKEN").unwrap_or_default();
    if refresh_token.is_empty() {
        return Err("Beds24 not configured".into());
    }

    let resp = state
        .http_client
        .get(format!("{}/authentication/token", BEDS24_API_BASE))
        .header("refreshToken", &refresh_token)
        .header("Accept", "application/json")
        .send()
        .await
        .map_err(|e| format!("Beds24 token request failed: {e}"))?;

    if !resp.status().is_success() {
        let status = resp.status();
        return Err(format!("Beds24 token refresh failed: {status}"));
    }

    let data: serde_json::Value = resp
        .json()
        .await
        .map_err(|e| format!("Beds24 token parse failed: {e}"))?;

    let token = data["token"]
        .as_str()
        .ok_or_else(|| "No token in Beds24 response".to_string())?
        .to_string();

    let expires_in = data["expiresIn"].as_u64().unwrap_or(86400);

    // Cache token
    {
        let mut cache = state.beds24_token.write().await;
        *cache = Some(Beds24TokenCache {
            access_token: token.clone(),
            expires_at: std::time::Instant::now()
                + std::time::Duration::from_secs(expires_in.saturating_sub(300)),
        });
    }

    info!("Beds24 token refreshed");
    Ok(token)
}

#[derive(Deserialize)]
pub struct Beds24BookRequest {
    pub property_id: String,
    pub check_in: String,
    pub check_out: String,
    pub guests: u32,
    #[serde(default)]
    pub first_name: Option<String>,
    #[serde(default)]
    pub last_name: Option<String>,
    #[serde(default)]
    pub email: Option<String>,
    #[serde(default)]
    pub phone: Option<String>,
    #[serde(default)]
    pub message: Option<String>,
}

#[derive(Serialize)]
pub struct Beds24BookResponse {
    pub ok: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub booking_id: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}

async fn beds24_book(
    State(state): State<AppState>,
    Json(body): Json<Beds24BookRequest>,
) -> (StatusCode, Json<Beds24BookResponse>) {
    let fail = |code: StatusCode, msg: &str| {
        (
            code,
            Json(Beds24BookResponse {
                ok: false,
                booking_id: None,
                error: Some(msg.into()),
            }),
        )
    };

    // Resolve Beds24 property ID
    let prop_map = parse_beds24_property_map();
    let beds24_prop_id = match prop_map.get(&body.property_id) {
        Some(id) => *id,
        None => return fail(StatusCode::BAD_REQUEST, "物件IDが不正です"),
    };

    // Validate
    if body.check_in.is_empty() || body.check_out.is_empty() {
        return fail(StatusCode::BAD_REQUEST, "日付を指定してください");
    }
    if body.guests == 0 || body.guests > 20 {
        return fail(StatusCode::BAD_REQUEST, "人数は1〜20名で指定してください");
    }

    // Get Beds24 token
    let token = match get_beds24_token(&state).await {
        Ok(t) => t,
        Err(e) => {
            tracing::error!(err = %e, "Beds24 token error");
            return fail(StatusCode::SERVICE_UNAVAILABLE, "予約システムに接続できません");
        }
    };

    // Create booking via Beds24 API
    let booking_payload = serde_json::json!([{
        "propertyId": beds24_prop_id,
        "arrival": body.check_in,
        "departure": body.check_out,
        "numAdult": body.guests,
        "firstName": body.first_name.as_deref().unwrap_or(""),
        "lastName": body.last_name.as_deref().unwrap_or("Guest"),
        "email": body.email.as_deref().unwrap_or(""),
        "phone": body.phone.as_deref().unwrap_or(""),
        "notes": body.message.as_deref().unwrap_or(""),
        "status": 1,
        "referer": "enablerdao.com"
    }]);

    let resp = state
        .http_client
        .post(format!("{}/bookings", BEDS24_API_BASE))
        .header("token", &token)
        .header("Accept", "application/json")
        .json(&booking_payload)
        .send()
        .await;

    match resp {
        Ok(r) if r.status().is_success() => {
            let data: serde_json::Value = r.json().await.unwrap_or_default();
            let booking_id = data
                .get("data")
                .and_then(|d| d.as_array())
                .and_then(|arr| arr.first())
                .and_then(|b| b["id"].as_u64());

            info!(
                property = %body.property_id,
                beds24_id = beds24_prop_id,
                check_in = %body.check_in,
                check_out = %body.check_out,
                booking_id = ?booking_id,
                "Beds24 booking created"
            );

            (
                StatusCode::OK,
                Json(Beds24BookResponse {
                    ok: true,
                    booking_id,
                    error: None,
                }),
            )
        }
        Ok(r) => {
            let status = r.status();
            let body_text = r.text().await.unwrap_or_default();
            tracing::error!(status = %status, body = %body_text, "Beds24 booking failed");
            fail(
                StatusCode::BAD_GATEWAY,
                "予約の登録に失敗しました。時間をおいて再度お試しください。",
            )
        }
        Err(e) => {
            tracing::error!(err = %e, "Beds24 request error");
            fail(
                StatusCode::BAD_GATEWAY,
                "予約システムとの通信に失敗しました。",
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
    format!(
        r#"<!DOCTYPE html>
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
</html>"#,
        email = email
    )
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
            avail_cache: Arc::new(RwLock::new(None)),
            http_client: reqwest::Client::builder()
                .user_agent("enablerdao-test/0.1")
                .timeout(std::time::Duration::from_secs(5))
                .build()
                .unwrap(),
            sessions: Arc::new(RwLock::new(HashMap::new())),
            nah_token: Arc::new(RwLock::new(None)),
            nah_member_cache: Arc::new(RwLock::new(None)),
            beds24_token: Arc::new(RwLock::new(None)),
        }
    }

    fn test_app() -> Router {
        let state = test_state();
        Router::new()
            .route("/api/projects", get(get_projects))
            .route("/api/projects/:name", get(get_project_by_name))
            .route("/api/availability", get(get_all_availability))
            .route("/api/subscribe", post(subscribe))
            .route("/api/auth/verify", post(auth_verify))
            .route("/api/members/availability", get(get_member_availability))
            .route("/api/members/inquiry", post(member_inquiry))
            .route("/api/chat", post(chat_handler))
            .route("/api/chat/checkout", post(chat_checkout))
            .route("/api/line/webhook", post(line_webhook))
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

    async fn test_state_with_cache() -> AppState {
        let state = test_state();
        // Pre-populate cache so tests don't depend on GitHub API
        let projects = PROJECT_DEFS
            .iter()
            .map(|def| Project {
                name: def.name.into(),
                repo: def.repo.into(),
                description: def.description.into(),
                language: def.default_language.into(),
                stars: def.default_stars,
                forks: def.default_forks,
                issues: def.default_issues,
                traffic: 0,
                reward: def.reward.into(),
                url: format!("https://github.com/{}", def.repo),
                service_url: def.service_url.into(),
            })
            .collect();
        let mut cache = state.cache.write().await;
        *cache = Some(ProjectCache {
            projects,
            updated_at: std::time::Instant::now(),
        });
        drop(cache);
        state
    }

    #[tokio::test]
    async fn test_get_project_by_name_found() {
        let state = test_state_with_cache().await;
        // Verify cache is populated
        {
            let cache = state.cache.read().await;
            let c = cache.as_ref().unwrap();
            assert_eq!(c.projects.len(), 4);
            assert_eq!(c.projects[1].name, "hypernews");
        }

        let app = Router::new()
            .route("/api/projects/:name", get(get_project_by_name))
            .with_state(state);

        let resp = app
            .oneshot(
                Request::get("/api/projects/hypernews")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(resp.status(), StatusCode::OK);
        let body = axum::body::to_bytes(resp.into_body(), 65536).await.unwrap();
        let project: Project = serde_json::from_slice(&body).unwrap();
        assert_eq!(project.name, "hypernews");
    }

    #[tokio::test]
    async fn test_get_project_by_name_not_found() {
        let state = test_state_with_cache().await;
        let app = Router::new()
            .route("/api/projects/:name", get(get_project_by_name))
            .with_state(state);

        let resp = app
            .oneshot(
                Request::get("/api/projects/nonexistent")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(resp.status(), StatusCode::NOT_FOUND);
    }

    #[test]
    fn test_parse_ical_events() {
        let ical = "\
BEGIN:VCALENDAR\r\n\
VERSION:2.0\r\n\
BEGIN:VEVENT\r\n\
DTSTART;VALUE=DATE:20260315\r\n\
DTEND;VALUE=DATE:20260320\r\n\
SUMMARY:Reserved\r\n\
END:VEVENT\r\n\
BEGIN:VEVENT\r\n\
DTSTART;VALUE=DATE:20260401\r\n\
DTEND;VALUE=DATE:20260405\r\n\
SUMMARY:Not available\r\n\
END:VEVENT\r\n\
END:VCALENDAR";

        let ranges = parse_ical_events(ical);
        assert_eq!(ranges.len(), 2);
        assert_eq!(ranges[0].start, "2026-03-15");
        assert_eq!(ranges[0].end, "2026-03-20");
        assert_eq!(ranges[1].start, "2026-04-01");
        assert_eq!(ranges[1].end, "2026-04-05");
    }

    #[test]
    fn test_parse_ical_empty() {
        let ranges = parse_ical_events("");
        assert!(ranges.is_empty());
    }

    #[tokio::test]
    async fn test_auth_verify_invalid_message_format() {
        let app = test_app();
        let resp = app
            .oneshot(
                Request::post("/api/auth/verify")
                    .header("content-type", "application/json")
                    .body(Body::from(
                        r#"{"wallet_address":"test","signature":"dGVzdA==","message":"bad-format"}"#,
                    ))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(resp.status(), StatusCode::UNAUTHORIZED);
        let body = axum::body::to_bytes(resp.into_body(), 4096).await.unwrap();
        let res: AuthVerifyResponse = serde_json::from_slice(&body).unwrap();
        assert!(!res.ok);
        assert_eq!(res.error.as_deref(), Some("invalid message format"));
    }

    #[tokio::test]
    async fn test_auth_verify_expired_timestamp() {
        let app = test_app();
        let old_ts = chrono::Utc::now().timestamp() - 600; // 10 min ago
        let msg = format!("enablerdao-auth:{}", old_ts);
        let body_json = serde_json::json!({
            "wallet_address": "11111111111111111111111111111111",
            "signature": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "message": msg
        });
        let resp = app
            .oneshot(
                Request::post("/api/auth/verify")
                    .header("content-type", "application/json")
                    .body(Body::from(serde_json::to_string(&body_json).unwrap()))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(resp.status(), StatusCode::UNAUTHORIZED);
        let body = axum::body::to_bytes(resp.into_body(), 4096).await.unwrap();
        let res: AuthVerifyResponse = serde_json::from_slice(&body).unwrap();
        assert!(!res.ok);
        assert_eq!(res.error.as_deref(), Some("message expired"));
    }

    #[tokio::test]
    async fn test_members_availability_no_auth() {
        let app = test_app();
        let resp = app
            .oneshot(
                Request::get("/api/members/availability")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(resp.status(), StatusCode::UNAUTHORIZED);
    }

    #[tokio::test]
    async fn test_members_availability_with_valid_session() {
        let state = test_state();
        let token = generate_session_token();
        {
            let mut sessions = state.sessions.write().await;
            sessions.insert(
                token.clone(),
                Session {
                    wallet_address: "TestWallet".into(),
                    expires_at: std::time::Instant::now() + SESSION_TTL,
                },
            );
        }
        let app = Router::new()
            .route("/api/members/availability", get(get_member_availability))
            .with_state(state);

        let resp = app
            .oneshot(
                Request::get("/api/members/availability")
                    .header("authorization", format!("Bearer {}", token))
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(resp.status(), StatusCode::OK);
        let body = axum::body::to_bytes(resp.into_body(), 65536).await.unwrap();
        let avail: Vec<PropertyAvailability> = serde_json::from_slice(&body).unwrap();
        assert_eq!(avail.len(), MEMBER_PROPERTY_DEFS.len());
    }

    #[tokio::test]
    async fn test_nah_api_integration() {
        // Skip if NAH_REFRESH_TOKEN not set
        if std::env::var("NAH_REFRESH_TOKEN").is_err() {
            eprintln!("SKIP: NAH_REFRESH_TOKEN not set");
            return;
        }

        let state = test_state();
        let token = generate_session_token();
        {
            let mut sessions = state.sessions.write().await;
            sessions.insert(
                token.clone(),
                Session {
                    wallet_address: "TestWallet".into(),
                    expires_at: std::time::Instant::now() + SESSION_TTL,
                },
            );
        }
        let app = Router::new()
            .route("/api/members/availability", get(get_member_availability))
            .with_state(state);

        let resp = app
            .oneshot(
                Request::get("/api/members/availability")
                    .header("authorization", format!("Bearer {}", token))
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(resp.status(), StatusCode::OK);
        let body = axum::body::to_bytes(resp.into_body(), 131072)
            .await
            .unwrap();
        let avail: Vec<PropertyAvailability> = serde_json::from_slice(&body).unwrap();

        // Should have dynamically discovered properties (at least 1)
        assert!(!avail.is_empty(), "Should return NAH properties");
        eprintln!("NAH properties returned: {}", avail.len());
        for p in &avail {
            eprintln!(
                "  {} ({}): {} booked ranges",
                p.property_name,
                p.property_id,
                p.booked_ranges.len()
            );
        }
        // aoshima-masterpiece should always be present
        assert!(
            avail.iter().any(|p| p.property_id.contains("aoshima")),
            "Should contain aoshima-masterpiece"
        );
    }

    #[test]
    fn test_session_token_generation() {
        let t1 = generate_session_token();
        let t2 = generate_session_token();
        assert_ne!(t1, t2);
        assert!(t1.len() >= 32);
    }

    #[test]
    fn test_nah_calendar_to_ranges() {
        let calendar = NahCalendar {
            months: vec![NahMonth {
                year: 2026,
                month: 3,
                days: vec![
                    NahDay {
                        date: NahDate {
                            year: 2026,
                            month: 3,
                            day: 1,
                        },
                        vacant: true,
                        price_type: None,
                    },
                    NahDay {
                        date: NahDate {
                            year: 2026,
                            month: 3,
                            day: 2,
                        },
                        vacant: false,
                        price_type: None,
                    },
                    NahDay {
                        date: NahDate {
                            year: 2026,
                            month: 3,
                            day: 3,
                        },
                        vacant: false,
                        price_type: None,
                    },
                    NahDay {
                        date: NahDate {
                            year: 2026,
                            month: 3,
                            day: 4,
                        },
                        vacant: true,
                        price_type: None,
                    },
                    NahDay {
                        date: NahDate {
                            year: 2026,
                            month: 3,
                            day: 5,
                        },
                        vacant: true,
                        price_type: None,
                    },
                    NahDay {
                        date: NahDate {
                            year: 2026,
                            month: 3,
                            day: 6,
                        },
                        vacant: false,
                        price_type: None,
                    },
                    NahDay {
                        date: NahDate {
                            year: 2026,
                            month: 3,
                            day: 7,
                        },
                        vacant: true,
                        price_type: None,
                    },
                ],
            }],
        };

        let ranges = nah_calendar_to_ranges(&calendar);
        assert_eq!(ranges.len(), 2);
        assert_eq!(ranges[0].start, "2026-03-02");
        assert_eq!(ranges[0].end, "2026-03-04");
        assert_eq!(ranges[1].start, "2026-03-06");
        assert_eq!(ranges[1].end, "2026-03-07");
    }

    #[test]
    fn test_nah_calendar_to_ranges_trailing() {
        // Test range that extends to end of month
        let calendar = NahCalendar {
            months: vec![NahMonth {
                year: 2026,
                month: 2,
                days: vec![
                    NahDay {
                        date: NahDate {
                            year: 2026,
                            month: 2,
                            day: 26,
                        },
                        vacant: true,
                        price_type: None,
                    },
                    NahDay {
                        date: NahDate {
                            year: 2026,
                            month: 2,
                            day: 27,
                        },
                        vacant: false,
                        price_type: None,
                    },
                    NahDay {
                        date: NahDate {
                            year: 2026,
                            month: 2,
                            day: 28,
                        },
                        vacant: false,
                        price_type: None,
                    },
                ],
            }],
        };

        let ranges = nah_calendar_to_ranges(&calendar);
        assert_eq!(ranges.len(), 1);
        assert_eq!(ranges[0].start, "2026-02-27");
        assert_eq!(ranges[0].end, "2026-03-01");
    }

    #[test]
    fn test_next_day_str() {
        assert_eq!(next_day_str("2026-02-28"), Some("2026-03-01".into()));
        assert_eq!(next_day_str("2026-12-31"), Some("2027-01-01".into()));
        assert_eq!(next_day_str("2026-03-15"), Some("2026-03-16".into()));
        assert_eq!(next_day_str("invalid"), None);
    }

    #[test]
    fn test_demo_bookings_generated() {
        let now = chrono::Utc::now();
        let bookings = generate_demo_bookings("property01", &now);
        assert!(!bookings.is_empty());
        // All dates should be valid YYYY-MM-DD format
        for b in &bookings {
            assert_eq!(b.start.len(), 10);
            assert_eq!(b.end.len(), 10);
            assert!(b.start < b.end);
        }
    }

    #[tokio::test]
    async fn test_get_all_availability() {
        let app = test_app();
        let resp = app
            .oneshot(
                Request::get("/api/availability")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(resp.status(), StatusCode::OK);
        let body = axum::body::to_bytes(resp.into_body(), 65536).await.unwrap();
        let avail: Vec<PropertyAvailability> = serde_json::from_slice(&body).unwrap();
        assert_eq!(avail.len(), 4); // 4 properties (property05 excluded)
    }

    #[tokio::test]
    async fn test_inquiry_no_auth() {
        let app = test_app();
        let resp = app
            .oneshot(
                Request::post("/api/members/inquiry")
                    .header("content-type", "application/json")
                    .body(Body::from(r#"{"property_id":"test","property_name":"Test","check_in":"2026-03-01","check_out":"2026-03-05","guests":2,"message":""}"#))
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(resp.status(), StatusCode::UNAUTHORIZED);
    }

    #[tokio::test]
    async fn test_inquiry_with_session() {
        let state = test_state();
        let token = generate_session_token();
        {
            let mut sessions = state.sessions.write().await;
            sessions.insert(
                token.clone(),
                Session {
                    wallet_address: "TestWallet".into(),
                    expires_at: std::time::Instant::now() + SESSION_TTL,
                },
            );
        }
        let app = Router::new()
            .route("/api/members/inquiry", post(member_inquiry))
            .with_state(state);

        let resp = app
            .oneshot(
                Request::post("/api/members/inquiry")
                    .header("content-type", "application/json")
                    .header("authorization", format!("Bearer {}", token))
                    .body(Body::from(r#"{"property_id":"nah_test","property_name":"Test Property","check_in":"2026-03-01","check_out":"2026-03-05","guests":2,"message":"テスト問い合わせ"}"#))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(resp.status(), StatusCode::OK);
        let body = axum::body::to_bytes(resp.into_body(), 4096).await.unwrap();
        let res: InquiryResponse = serde_json::from_slice(&body).unwrap();
        assert!(res.ok);
    }

    #[tokio::test]
    async fn test_inquiry_invalid_guests() {
        let state = test_state();
        let token = generate_session_token();
        {
            let mut sessions = state.sessions.write().await;
            sessions.insert(
                token.clone(),
                Session {
                    wallet_address: "TestWallet".into(),
                    expires_at: std::time::Instant::now() + SESSION_TTL,
                },
            );
        }
        let app = Router::new()
            .route("/api/members/inquiry", post(member_inquiry))
            .with_state(state);

        let resp = app
            .oneshot(
                Request::post("/api/members/inquiry")
                    .header("content-type", "application/json")
                    .header("authorization", format!("Bearer {}", token))
                    .body(Body::from(r#"{"property_id":"nah_test","property_name":"Test","check_in":"2026-03-01","check_out":"2026-03-05","guests":0,"message":""}"#))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(resp.status(), StatusCode::BAD_REQUEST);
        let body = axum::body::to_bytes(resp.into_body(), 4096).await.unwrap();
        let res: InquiryResponse = serde_json::from_slice(&body).unwrap();
        assert!(!res.ok);
        assert_eq!(res.error.as_deref(), Some("guests must be 1-20"));
    }

    #[test]
    fn test_day_info_serialization() {
        let day = DayInfo {
            date: "2026-03-15".into(),
            vacant: true,
            price_type: "high".into(),
        };
        let json = serde_json::to_string(&day).unwrap();
        assert!(json.contains("2026-03-15"));
        assert!(json.contains("\"vacant\":true"));
        assert!(json.contains("\"price_type\":\"high\""));

        let parsed: DayInfo = serde_json::from_str(&json).unwrap();
        assert_eq!(parsed.date, "2026-03-15");
        assert!(parsed.vacant);
        assert_eq!(parsed.price_type, "high");
    }

    #[test]
    fn test_nah_calendar_to_days() {
        let calendar = NahCalendar {
            months: vec![NahMonth {
                year: 2026,
                month: 3,
                days: vec![
                    NahDay {
                        date: NahDate {
                            year: 2026,
                            month: 3,
                            day: 1,
                        },
                        vacant: true,
                        price_type: Some("standard".into()),
                    },
                    NahDay {
                        date: NahDate {
                            year: 2026,
                            month: 3,
                            day: 2,
                        },
                        vacant: false,
                        price_type: Some("high".into()),
                    },
                ],
            }],
        };

        let days = nah_calendar_to_days(&calendar);
        assert_eq!(days.len(), 2);
        assert_eq!(days[0].date, "2026-03-01");
        assert!(days[0].vacant);
        assert_eq!(days[0].price_type, "standard");
        assert_eq!(days[1].date, "2026-03-02");
        assert!(!days[1].vacant);
        assert_eq!(days[1].price_type, "high");
    }

    #[test]
    fn test_parse_book_tag_valid() {
        let text = "はい、ご予約を承ります。\n[BOOK:2026-03-15,2026-03-18,2,120000]";
        let action = parse_book_tag(text).unwrap();
        assert_eq!(action.action_type, "checkout");
        assert_eq!(action.check_in, "2026-03-15");
        assert_eq!(action.check_out, "2026-03-18");
        assert_eq!(action.guests, 2);
        assert_eq!(action.amount, 120000);
    }

    #[test]
    fn test_parse_book_tag_missing() {
        let text = "空き状況をお調べします。";
        assert!(parse_book_tag(text).is_none());
    }

    #[test]
    fn test_parse_book_tag_invalid_format() {
        let text = "[BOOK:bad,data]";
        assert!(parse_book_tag(text).is_none());
    }

    #[tokio::test]
    async fn test_chat_no_api_key() {
        // Without CHAT_LLM_API_KEY, should return service unavailable
        let app = test_app();
        let body = serde_json::json!({
            "messages": [{"role": "user", "content": "hello"}]
        });
        let resp = app
            .oneshot(
                Request::post("/api/chat")
                    .header("content-type", "application/json")
                    .body(Body::from(serde_json::to_string(&body).unwrap()))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(resp.status(), StatusCode::SERVICE_UNAVAILABLE);
        let body = axum::body::to_bytes(resp.into_body(), 4096).await.unwrap();
        let res: ChatResponse = serde_json::from_slice(&body).unwrap();
        assert!(res.action.is_none());
        assert!(!res.message.is_empty());
    }

    #[tokio::test]
    async fn test_chat_empty_messages() {
        // Without CHAT_LLM_API_KEY, the handler returns 503 before
        // validating messages. This test verifies the endpoint is reachable
        // and returns a valid ChatResponse.
        let app = test_app();
        let body = serde_json::json!({
            "messages": []
        });
        let resp = app
            .oneshot(
                Request::post("/api/chat")
                    .header("content-type", "application/json")
                    .body(Body::from(serde_json::to_string(&body).unwrap()))
                    .unwrap(),
            )
            .await
            .unwrap();

        // Without API key, empty messages still returns SERVICE_UNAVAILABLE
        let status = resp.status();
        assert!(
            status == StatusCode::BAD_REQUEST || status == StatusCode::SERVICE_UNAVAILABLE,
            "Expected 400 or 503, got {}",
            status
        );
    }

    #[tokio::test]
    async fn test_checkout_returns_response() {
        // Without STRIPE_SECRET_KEY, should return service unavailable or error
        let app = test_app();
        let body = serde_json::json!({
            "property_id": "property05",
            "check_in": "2026-03-15",
            "check_out": "2026-03-18",
            "guests": 2,
            "amount": 120000
        });
        let resp = app
            .oneshot(
                Request::post("/api/chat/checkout")
                    .header("content-type", "application/json")
                    .body(Body::from(serde_json::to_string(&body).unwrap()))
                    .unwrap(),
            )
            .await
            .unwrap();

        // Without stripe key: 503; with leaked env var from other test: 400/500
        let body = axum::body::to_bytes(resp.into_body(), 4096).await.unwrap();
        let res: CheckoutResponse = serde_json::from_slice(&body).unwrap();
        assert!(!res.ok || res.url.is_some());
    }

    #[test]
    fn test_verify_line_signature_valid() {
        let secret = "test_channel_secret";
        let body = b"{\"events\":[]}";
        // Compute expected HMAC-SHA256
        use hmac::{Hmac, Mac};
        use sha2::Sha256;
        type HmacSha256 = Hmac<Sha256>;
        let mut mac = HmacSha256::new_from_slice(secret.as_bytes()).unwrap();
        mac.update(body);
        let result = mac.finalize().into_bytes();
        let signature =
            base64::Engine::encode(&base64::engine::general_purpose::STANDARD, result);

        assert!(verify_line_signature(secret, body, &signature));
    }

    #[test]
    fn test_verify_line_signature_invalid() {
        let secret = "test_channel_secret";
        let body = b"{\"events\":[]}";
        assert!(!verify_line_signature(secret, body, "invalid_signature"));
    }

    #[test]
    fn test_verify_line_signature_wrong_body() {
        let secret = "test_channel_secret";
        let body = b"{\"events\":[]}";
        use hmac::{Hmac, Mac};
        use sha2::Sha256;
        type HmacSha256 = Hmac<Sha256>;
        let mut mac = HmacSha256::new_from_slice(secret.as_bytes()).unwrap();
        mac.update(body);
        let result = mac.finalize().into_bytes();
        let signature =
            base64::Engine::encode(&base64::engine::general_purpose::STANDARD, result);

        // Verify with different body should fail
        assert!(!verify_line_signature(
            secret,
            b"tampered body",
            &signature
        ));
    }

    #[tokio::test]
    async fn test_line_webhook_missing_signature() {
        let app = test_app();
        let resp = app
            .oneshot(
                Request::post("/api/line/webhook")
                    .header("content-type", "application/json")
                    .body(Body::from(r#"{"events":[]}"#))
                    .unwrap(),
            )
            .await
            .unwrap();

        // Missing signature header → 400 or 500 (depending on LINE_CHANNEL_SECRET)
        assert_ne!(resp.status(), StatusCode::OK);
    }
}
