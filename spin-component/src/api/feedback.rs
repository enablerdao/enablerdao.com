/// `/api/feedback` endpoint.

use spin_sdk::http::{Request, Response};

/// `POST /api/feedback` — submit user feedback.
///
/// Expected JSON body: `{ "message", "contact" }`
pub async fn submit(req: Request) -> Response {
    let body = req.body();
    let data: serde_json::Value = match serde_json::from_slice(body) {
        Ok(v) => v,
        Err(_) => return json_error(400, "invalid JSON body"),
    };

    let message = data["message"].as_str().unwrap_or("").trim();
    let contact = data["contact"].as_str().unwrap_or("").trim();

    if message.is_empty() {
        return json_error(400, "message is required");
    }

    // Send email notification (fire-and-forget).
    if let Ok(api_key) = spin_sdk::variables::get("resend_api_key") {
        crate::email::send_feedback_notification(&api_key, message, contact).await;
    }

    let resp = serde_json::json!({
        "ok": true,
        "message": "フィードバックを送信しました。ありがとうございます！",
    });
    json_response(200, serde_json::to_vec(&resp).unwrap_or_default())
}

// ── helpers ─────────────────────────────────────────────────────────────────

fn json_response(status: u16, body: Vec<u8>) -> Response {
    Response::builder()
        .status(status)
        .header("content-type", "application/json")
        .header("access-control-allow-origin", "*")
        .body(body)
        .build()
}

fn json_error(status: u16, msg: &str) -> Response {
    let body = serde_json::to_vec(&serde_json::json!({"error": msg})).unwrap_or_default();
    json_response(status, body)
}
