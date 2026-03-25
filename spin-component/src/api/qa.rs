/// `/api/qa` endpoints.

use spin_sdk::http::{Request, Response};

use crate::kv;

/// `GET /api/qa` — return all Q&A items as a JSON array.
pub fn list() -> Response {
    let items = kv::list_qa();
    let body = serde_json::to_vec(&items).unwrap_or_default();
    json_response(200, body)
}

/// `POST /api/qa` — submit a new question.
///
/// Expected JSON body: `{ "question", "asker" }`
pub fn create(req: Request) -> Response {
    let body = req.body();
    let data: serde_json::Value = match serde_json::from_slice(body) {
        Ok(v) => v,
        Err(_) => return json_error(400, "invalid JSON body"),
    };

    let question = data["question"].as_str().unwrap_or("").trim();
    let asker = data["asker"].as_str().unwrap_or("anonymous").trim();

    if question.is_empty() {
        return json_error(400, "question is required");
    }

    match kv::create_question(question, asker) {
        Ok(item) => {
            let body = serde_json::to_vec(&item).unwrap_or_default();
            json_response(201, body)
        }
        Err(e) => json_error(500, &format!("failed to create question: {e}")),
    }
}

/// `POST /api/qa/:id/answer` — set the answer on an existing question.
///
/// Expected JSON body: `{ "answer" }`
pub fn answer(id_str: &str, req: Request) -> Response {
    let id: u64 = match id_str.parse() {
        Ok(v) => v,
        Err(_) => return json_error(400, "invalid QA id"),
    };

    let body = req.body();
    let data: serde_json::Value = match serde_json::from_slice(body) {
        Ok(v) => v,
        Err(_) => return json_error(400, "invalid JSON body"),
    };

    let answer_text = data["answer"].as_str().unwrap_or("").trim();
    if answer_text.is_empty() {
        return json_error(400, "answer is required");
    }

    match kv::answer_question(id, answer_text) {
        Ok(()) => json_response(
            200,
            serde_json::to_vec(&serde_json::json!({"ok": true})).unwrap_or_default(),
        ),
        Err(e) => json_error(404, &format!("QA item not found: {e}")),
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
