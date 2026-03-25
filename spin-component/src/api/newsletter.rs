/// `/api/newsletter` endpoint.

use spin_sdk::http::{Request, Response};

use crate::kv;

/// `POST /api/newsletter/subscribe` — subscribe an email to the newsletter.
///
/// Expected JSON body: `{ "email" }`
///
/// Returns a JSON object with a coupon code on success.
pub async fn subscribe(req: Request) -> Response {
    let body = req.body();
    let data: serde_json::Value = match serde_json::from_slice(body) {
        Ok(v) => v,
        Err(_) => return json_error(400, "invalid JSON body"),
    };

    let email = data["email"].as_str().unwrap_or("").trim().to_string();
    if email.is_empty() || !email.contains('@') {
        return json_error(400, "valid email is required");
    }

    match kv::subscribe_newsletter(&email) {
        Ok(()) => {
            // Fire-and-forget welcome email.
            if let Ok(api_key) = spin_sdk::variables::get("resend_api_key") {
                crate::email::send_welcome(&api_key, &email).await;
            }

            let resp = serde_json::json!({
                "ok": true,
                "message": "ご登録ありがとうございます！",
                "coupon": "ENABLER2026",
            });
            json_response(200, serde_json::to_vec(&resp).unwrap_or_default())
        }
        Err(e) => json_error(500, &format!("subscription failed: {e}")),
    }
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
