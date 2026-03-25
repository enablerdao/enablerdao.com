/// `/api/ideas` endpoints.

use spin_sdk::http::{Request, Response};

use crate::kv;

/// `GET /api/ideas` — return all ideas as a JSON array.
pub fn list() -> Response {
    let ideas = kv::list_ideas();
    let body = serde_json::to_vec(&ideas).unwrap_or_default();
    json_response(200, body)
}

/// `POST /api/ideas` — create a new idea.
///
/// Expected JSON body: `{ "title", "detail", "category", "nickname", "email" }`
pub async fn create(req: Request) -> Response {
    let body = req.body();
    let data: serde_json::Value = match serde_json::from_slice(body) {
        Ok(v) => v,
        Err(_) => return json_error(400, "invalid JSON body"),
    };

    let title = data["title"].as_str().unwrap_or("").trim();
    let detail = data["detail"].as_str().unwrap_or("").trim();
    let category = data["category"].as_str().unwrap_or("general").trim();
    let nickname = data["nickname"].as_str().unwrap_or("anonymous").trim();
    let email = data["email"].as_str().unwrap_or("").trim();

    if title.is_empty() {
        return json_error(400, "title is required");
    }

    match kv::create_idea(title, detail, category, nickname, email) {
        Ok(idea) => {
            // Fire-and-forget email notification.
            if let Ok(api_key) = spin_sdk::variables::get("resend_api_key") {
                crate::email::send_idea_notification(&api_key, &idea.title, &idea.nickname).await;
            }

            let body = serde_json::to_vec(&idea).unwrap_or_default();
            json_response(201, body)
        }
        Err(e) => json_error(500, &format!("failed to create idea: {e}")),
    }
}

/// `POST /api/ideas/:id/like` — increment the like count.
pub fn like(id_str: &str) -> Response {
    let id: u64 = match id_str.parse() {
        Ok(v) => v,
        Err(_) => return json_error(400, "invalid idea id"),
    };

    match kv::like_idea(id) {
        Ok(()) => json_response(
            200,
            serde_json::to_vec(&serde_json::json!({"ok": true})).unwrap_or_default(),
        ),
        Err(e) => json_error(404, &format!("idea not found: {e}")),
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
