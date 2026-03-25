/// `/api/metrics` endpoint.

use spin_sdk::http::Response;

/// `GET /api/metrics` — return metrics data.
///
/// The dashboard.html JS fetches this and populates KPI cards.
pub fn get() -> Response {
    let metrics = serde_json::json!({
        "users": {
            "total": 424,
            "paid": 18,
        },
        "revenue": {
            "mrr_jpy": 57150,
        },
        "infrastructure": {
            "monthly_cost_usd": 142,
            "services": {
                "AWS Lambda": 45,
                "Fly.io": 25,
                "Domains": 8,
                "Stripe fees": 12,
                "LLM API": 52,
            },
        },
        "community": {
            "ebr_holders": 82,
            "github_stars": 24,
            "github_repos": 12,
            "ideas": crate::kv::list_ideas().len(),
            "questions": crate::kv::list_qa().len(),
            "newsletter": crate::kv::list_newsletter_emails().len(),
        },
    });

    let body = serde_json::to_vec(&metrics).unwrap_or_default();
    Response::builder()
        .status(200)
        .header("content-type", "application/json")
        .header("access-control-allow-origin", "*")
        .body(body)
        .build()
}
