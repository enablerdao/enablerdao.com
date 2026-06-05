mod layout;
mod static_assets;
mod kv;
mod data;
mod email;
mod seo;
mod markdown;
mod pages;
mod api;

use spin_sdk::http::{IntoResponse, Method, Request, Response};
use spin_sdk::http_component;

/// Extract the best-guess client IP from request headers.
/// Priority: fly-client-ip → x-forwarded-for (first entry) → spin-client-addr → fallback.
fn client_ip(req: &Request) -> String {
    if let Some(s) = req.header("fly-client-ip").and_then(|v| v.as_str()) {
        let s = s.trim();
        if !s.is_empty() {
            return s.to_string();
        }
    }
    if let Some(s) = req.header("x-forwarded-for").and_then(|v| v.as_str()) {
        let first = s.split(',').next().unwrap_or("").trim();
        if !first.is_empty() {
            return first.to_string();
        }
    }
    if let Some(s) = req.header("spin-client-addr").and_then(|v| v.as_str()) {
        // Strip port if present (e.g. "1.2.3.4:12345")
        let s = s.trim();
        if !s.is_empty() {
            return s.rsplit_once(':').map(|(ip, _)| ip).unwrap_or(s).to_string();
        }
    }
    "unknown".to_string()
}

/// Determine the allowed CORS origin.
/// Reads the `ALLOW_ORIGIN` spin variable for dev overrides; defaults to enablerdao.com.
fn allowed_origin() -> String {
    spin_sdk::variables::get("allow_origin")
        .unwrap_or_else(|_| "https://enablerdao.com".to_string())
}

/// Build a CORS-safe JSON response with the correct origin header.
fn json_response_cors(status: u16, origin: &str, body: Vec<u8>) -> Response {
    Response::builder()
        .status(status)
        .header("content-type", "application/json")
        .header("access-control-allow-origin", origin)
        .body(body)
        .build()
}

/// Return a 429 Too Many Requests JSON error.
fn too_many_requests(origin: &str) -> Response {
    let body = serde_json::to_vec(
        &serde_json::json!({"ok": false, "error": "リクエストが多すぎます。しばらく待ってから再試行してください。"}),
    )
    .unwrap_or_default();
    json_response_cors(429, origin, body)
}

#[http_component]
async fn handle(req: Request) -> anyhow::Result<impl IntoResponse> {
    let method = req.method().clone();
    let path = req.path().to_string();

    // Ensure blog seed data is loaded on first request
    let _ = kv::ensure_blog_seed();

    let resp = match (&method, path.as_str()) {
        // --- Health ---
        (Method::Get, "/health") => json_ok(&serde_json::json!({"status": "ok"})),

        // --- Static assets ---
        (Method::Get, p) if p.starts_with("/static/") => {
            match static_assets::serve_static(p) {
                Some(r) => r,
                None => not_found(),
            }
        }

        // --- Pages ---
        (Method::Get, "/" | "") => {
            static_assets::serve_enabler_page()
        }
        (Method::Get, "/products") => {
            static_assets::serve_products_page()
        }
        (Method::Get, "/futami" | "/futami/") => {
            static_assets::serve_futami_page()
        }
        (Method::Get, "/misogihama" | "/misogihama/" | "/futami-village" | "/futami-village/") => {
            static_assets::serve_futami_village_page()
        }
        (Method::Get, "/misogihama/complex" | "/misogihama/complex/") => {
            static_assets::serve_complex_page()
        }
        (Method::Get, "/misogihama/residence" | "/misogihama/residence/") => {
            static_assets::serve_residence_page()
        }
        (Method::Get, "/projects") => {
            html_page("Projects \u{2014} EnablerDAO",
                "EnablerDAO\u{304c}\u{904b}\u{55b6}\u{3059}\u{308b}\u{30d7}\u{30ed}\u{30c0}\u{30af}\u{30c8}\u{4e00}\u{89a7}\u{3002}",
                "https://enablerdao.com/projects",
                &pages::projects::render())
        }
        (Method::Get, "/blog") => {
            let posts = data::load_blog_posts();
            html_page("Blog \u{2014} EnablerDAO",
                "EnablerDAO\u{306e}\u{6280}\u{8853}\u{30d6}\u{30ed}\u{30b0}\u{3002}",
                "https://enablerdao.com/blog",
                &pages::blog::render_list(&posts))
        }
        (Method::Get, p) if p.starts_with("/blog/") => {
            let slug = &p[6..];
            let posts = data::load_blog_posts();
            match posts.iter().find(|p| p.slug == slug) {
                Some(post) => {
                    let content_html = markdown::render(&post.content);
                    html_page(&format!("{} \u{2014} EnablerDAO Blog", post.title),
                        &post.description,
                        &format!("https://enablerdao.com/blog/{}", post.slug),
                        &pages::blog::render_detail(post, &content_html))
                }
                None => not_found(),
            }
        }
        (Method::Get, "/ideas") => {
            html_page("Ideas \u{2014} EnablerDAO",
                "\u{3042}\u{306a}\u{305f}\u{306e}\u{30a2}\u{30a4}\u{30c7}\u{30a2}\u{304c}\u{3001}\u{6b21}\u{306e}\u{30d7}\u{30ed}\u{30c0}\u{30af}\u{30c8}\u{306b}\u{306a}\u{308b}\u{3002}",
                "https://enablerdao.com/ideas",
                &pages::ideas::render())
        }
        (Method::Get, "/agents") => {
            html_page("AI Agents \u{2014} EnablerDAO Dog Pack",
                "11\u{5339}\u{306e}AI\u{72ac}\u{30a8}\u{30fc}\u{30b8}\u{30a7}\u{30f3}\u{30c8}\u{304c}EnablerDAO\u{3092}24\u{6642}\u{9593}\u{81ea}\u{5f8b}\u{904b}\u{7528}\u{3002}",
                "https://enablerdao.com/agents",
                &pages::agents::render())
        }
        (Method::Get, "/dao") => {
            html_page("DAO \u{2014} EnablerDAO",
                "EnablerDAO \u{30ac}\u{30d0}\u{30ca}\u{30f3}\u{30b9}\u{3002}",
                "https://enablerdao.com/dao",
                &pages::dao::render())
        }
        (Method::Get, "/token") => {
            html_page("Token Economy \u{2014} EnablerDAO",
                "EBR\u{30fb}BONE\u{30fb}ENAI \u{2014} EnablerDAO\u{306e}Solana\u{30c8}\u{30fc}\u{30af}\u{30f3}\u{30a8}\u{30b3}\u{30ce}\u{30df}\u{30fc}",
                "https://enablerdao.com/token",
                &pages::token::render())
        }
        (Method::Get, "/qa") => {
            html_page("Q&A \u{2014} EnablerDAO",
                "EnablerDAO\u{306b}\u{95a2}\u{3059}\u{308b}\u{8cea}\u{554f}\u{3068}\u{56de}\u{7b54}\u{3002}",
                "https://enablerdao.com/qa",
                &pages::simple::render_qa())
        }
        (Method::Get, "/dashboard") => {
            html_page("Dashboard \u{2014} EnablerDAO",
                "EnablerDAO \u{30d3}\u{30b8}\u{30cd}\u{30b9}KPI\u{30c0}\u{30c3}\u{30b7}\u{30e5}\u{30dc}\u{30fc}\u{30c9}\u{3002}",
                "https://enablerdao.com/dashboard",
                &pages::simple::render_dashboard())
        }
        (Method::Get, "/metrics") => {
            html_page("Metrics \u{2014} EnablerDAO",
                "EnablerDAO \u{30e1}\u{30c8}\u{30ea}\u{30af}\u{30b9}\u{3002}",
                "https://enablerdao.com/metrics",
                &pages::simple::render_metrics())
        }
        (Method::Get, "/safety") => {
            html_page("Safety Dashboard \u{2014} EnablerDAO",
                "AI\u{30a8}\u{30fc}\u{30b8}\u{30a7}\u{30f3}\u{30c8}\u{7fa4}\u{306e}\u{30ea}\u{30a2}\u{30eb}\u{30bf}\u{30a4}\u{30e0}\u{5b89}\u{5168}\u{6027}\u{30c0}\u{30c3}\u{30b7}\u{30e5}\u{30dc}\u{30fc}\u{30c9}\u{3002}",
                "https://enablerdao.com/safety",
                &pages::safety::render())
        }
        (Method::Get, "/status") => {
            html_page("Status \u{2014} EnablerDAO",
                "EnablerDAO \u{30b5}\u{30fc}\u{30d3}\u{30b9}\u{7a3c}\u{50cd}\u{72b6}\u{6cc1}\u{3002}",
                "https://enablerdao.com/status",
                &pages::simple::render_status())
        }
        (Method::Get, "/privacy") => {
            html_page("Privacy Policy \u{2014} EnablerDAO",
                "EnablerDAO \u{30d7}\u{30e9}\u{30a4}\u{30d0}\u{30b7}\u{30fc}\u{30dd}\u{30ea}\u{30b7}\u{30fc}\u{3002}",
                "https://enablerdao.com/privacy",
                &pages::privacy::render())
        }
        (Method::Get, "/careers") => {
            html_page_noindex("Careers \u{2014} \u{63a1}\u{7528} | EnablerDAO",
                "\u{4e16}\u{754c}\u{4e2d}\u{3067}\u{4f7f}\u{308f}\u{308c}\u{308b}\u{3082}\u{306e}\u{3092}\u{3001}\u{4ef2}\u{9593}\u{3068}\u{3002}\u{682a}\u{5f0f}\u{4f1a}\u{793e}\u{30a4}\u{30cd}\u{30d6}\u{30e9}/EnablerDAO\u{306e}\u{63a1}\u{7528}\u{3002}",
                "https://enablerdao.com/careers",
                &pages::careers::render())
        }
        (Method::Get, "/fanclub") => {
            html_page("Fan Club \u{2014} Enabler",
                "Enabler\u{30d5}\u{30a1}\u{30f3}\u{30af}\u{30e9}\u{30d6}\u{3002}\u{30d1}\u{30b7}\u{30e3}Pro\u{30d7}\u{30e9}\u{30f3}\u{304c}\u{7121}\u{6599}\u{3002}",
                "https://enablerdao.com/fanclub",
                &pages::fanclub::render())
        }

        // --- SEO ---
        (Method::Get, "/sitemap.xml") => {
            Response::builder()
                .status(200)
                .header("content-type", "application/xml; charset=utf-8")
                .header("cache-control", "public, max-age=43200")
                .body(seo::sitemap_xml())
                .build()
        }
        (Method::Get, "/robots.txt") => {
            Response::builder()
                .status(200)
                .header("content-type", "text/plain; charset=utf-8")
                .header("cache-control", "public, max-age=86400")
                .body(seo::robots_txt())
                .build()
        }
        (Method::Get, "/feed.xml") => {
            let posts = data::load_blog_posts();
            Response::builder()
                .status(200)
                .header("content-type", "application/rss+xml; charset=utf-8")
                .header("cache-control", "public, max-age=3600")
                .body(seo::feed_xml(&posts))
                .build()
        }

        // --- API ---
        (Method::Get, "/api/ideas") => api::ideas::list(),
        (Method::Post, "/api/ideas") => api::ideas::create(req).await,
        (Method::Post, p) if p.starts_with("/api/ideas/") && p.ends_with("/like") => {
            let id_str = &p[11..p.len() - 5];
            api::ideas::like(id_str)
        }
        (Method::Get, "/api/qa") => api::qa::list(),
        (Method::Post, "/api/qa") => api::qa::create(req),
        (Method::Post, p) if p.starts_with("/api/qa/") && p.ends_with("/answer") => {
            let id_str = &p[8..p.len() - 7];
            api::qa::answer(id_str, req)
        }
        (Method::Post, "/api/newsletter/subscribe") => {
            let ip = client_ip(&req);
            let origin = allowed_origin();
            if !kv::check_rate_limit(&ip, "newsletter_subscribe", 3, 300) {
                too_many_requests(&origin)
            } else {
                api::newsletter::subscribe(req, &origin).await
            }
        }
        (Method::Post, "/api/feedback") => api::feedback::submit(req).await,
        (Method::Get, "/api/metrics") => api::metrics::get(),
        (Method::Post, "/api/analytics/log") => api::analytics::log(req),
        (Method::Get, p) if p.starts_with("/analytics") => api::analytics::dashboard(p, req),
        (Method::Post, "/api/fanclub/register") => {
            let ip = client_ip(&req);
            let origin = allowed_origin();
            if !kv::check_rate_limit(&ip, "fanclub_register", 3, 300) {
                too_many_requests(&origin)
            } else {
                api::fanclub::register(req, &origin).await
            }
        }
        (Method::Post, "/api/fanclub/login") => api::fanclub::login(req).await,
        (Method::Get, p) if p.starts_with("/api/fanclub/verify") => api::fanclub::verify(p),
        (Method::Get, "/api/fanclub/codes") => {
            let hashes = kv::list_promo_code_hashes();
            json_ok(&serde_json::json!({"version": 1, "hashes": hashes}))
        }

        // --- CORS preflight ---
        (Method::Options, _) => {
            let origin = allowed_origin();
            Response::builder()
                .status(204)
                .header("access-control-allow-origin", origin)
                .header("access-control-allow-methods", "GET, POST, OPTIONS")
                .header("access-control-allow-headers", "content-type")
                .body(())
                .build()
        }

        _ => not_found(),
    };

    Ok(resp)
}

fn html_page(title: &str, description: &str, canonical: &str, content: &str) -> Response {
    let html = layout::page_shell(title, description, canonical, content);
    Response::builder()
        .status(200)
        .header("content-type", "text/html; charset=utf-8")
        .header("cache-control", "public, max-age=300, stale-while-revalidate=60")
        .header("x-frame-options", "SAMEORIGIN")
        .header("x-content-type-options", "nosniff")
        .header("referrer-policy", "strict-origin-when-cross-origin")
        .header("strict-transport-security", "max-age=31536000; includeSubDomains")
        .body(html)
        .build()
}

/// Like `html_page` but marks the page `noindex, nofollow` (meta + header) and
/// disables caching — for draft pages not yet meant for search engines / public nav.
fn html_page_noindex(title: &str, description: &str, canonical: &str, content: &str) -> Response {
    let html = layout::page_shell_robots(title, description, canonical, "noindex, nofollow", content);
    Response::builder()
        .status(200)
        .header("content-type", "text/html; charset=utf-8")
        .header("cache-control", "no-store")
        .header("x-robots-tag", "noindex, nofollow")
        .header("x-frame-options", "SAMEORIGIN")
        .header("x-content-type-options", "nosniff")
        .header("referrer-policy", "strict-origin-when-cross-origin")
        .header("strict-transport-security", "max-age=31536000; includeSubDomains")
        .body(html)
        .build()
}

fn json_ok(value: &serde_json::Value) -> Response {
    let origin = allowed_origin();
    Response::builder()
        .status(200)
        .header("content-type", "application/json")
        .header("access-control-allow-origin", origin)
        .body(serde_json::to_string(value).unwrap_or_default())
        .build()
}

fn not_found() -> Response {
    Response::builder()
        .status(404)
        .header("content-type", "text/html; charset=utf-8")
        .body("<h1>404 Not Found</h1>")
        .build()
}
