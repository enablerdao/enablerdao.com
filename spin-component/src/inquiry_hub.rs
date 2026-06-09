/// Best-effort forwarding of public form submissions to the labs-enabler
/// aggregation hub. Fire-and-forget: any failure is silently ignored so it
/// never affects the user-facing request, the KV write, or the email path.

use spin_sdk::http::{Method, Request, Response};

const HUB_URL: &str = "https://labs-enabler.fly.dev/api/inquiry";

/// 集約ハブへ best-effort 転送。失敗は無視。
pub async fn forward(payload: serde_json::Value) {
    let Ok(body) = serde_json::to_vec(&payload) else { return };
    let req = Request::builder()
        .method(Method::Post)
        .uri(HUB_URL)
        .header("Content-Type", "application/json")
        .body(body)
        .build();
    let _: Result<Response, _> = spin_sdk::http::send(req).await;
}
