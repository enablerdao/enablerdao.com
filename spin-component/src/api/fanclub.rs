/// Fan club API: register, login (magic link), verify token → show promo code.

use spin_sdk::http::{Request, Response};

use crate::kv;

pub async fn register(req: Request) -> Response {
    let body = req.body();
    let Ok(json): Result<serde_json::Value, _> = serde_json::from_slice(body) else {
        return json_error(400, "invalid JSON");
    };

    let email = json["email"].as_str().unwrap_or("").trim().to_lowercase();
    if email.is_empty() || !email.contains('@') {
        return json_error(400, "有効なメールアドレスを入力してください");
    }

    // Check if already registered
    let members = kv::list_fanclub_members();
    if members.iter().any(|m| m.email == email) {
        // Already a member — just send login link
        return send_login_and_respond(&email).await;
    }

    // Register new member with a promo code
    match kv::create_fanclub_member(&email) {
        Ok(_member) => send_login_and_respond(&email).await,
        Err(_) => json_error(500, "登録に失敗しました"),
    }
}

pub async fn login(req: Request) -> Response {
    let body = req.body();
    let Ok(json): Result<serde_json::Value, _> = serde_json::from_slice(body) else {
        return json_error(400, "invalid JSON");
    };

    let email = json["email"].as_str().unwrap_or("").trim().to_lowercase();
    if email.is_empty() || !email.contains('@') {
        return json_error(400, "有効なメールアドレスを入力してください");
    }

    let members = kv::list_fanclub_members();
    if !members.iter().any(|m| m.email == email) {
        return json_error(404, "このメールアドレスは登録されていません。先にファンクラブに登録してください。");
    }

    send_login_and_respond(&email).await
}

pub fn verify(path: &str) -> Response {
    // path = "/api/fanclub/verify?token=XXXX"
    let token = path.split("token=").nth(1).unwrap_or("").split('&').next().unwrap_or("");
    if token.is_empty() {
        return json_error(400, "トークンが必要です");
    }

    match kv::verify_fanclub_token(token) {
        Some(member) => {
            let resp = serde_json::json!({
                "ok": true,
                "email": member.email,
                "promo_code": member.promo_code,
            });
            json_response(200, serde_json::to_vec(&resp).unwrap_or_default())
        }
        None => json_error(401, "無効または期限切れのトークンです"),
    }
}

async fn send_login_and_respond(email: &str) -> Response {
    // Generate a magic link token
    let token = kv::create_fanclub_token(email);

    // Send email with magic link
    let api_key = spin_sdk::variables::get("resend_api_key").unwrap_or_default();
    crate::email::send_fanclub_login(&api_key, email, &token).await;

    let resp = serde_json::json!({
        "ok": true,
        "message": "ログインリンクをメールに送信しました。メールを確認してください。"
    });
    json_response(200, serde_json::to_vec(&resp).unwrap_or_default())
}

fn json_response(status: u16, body: Vec<u8>) -> Response {
    Response::builder()
        .status(status)
        .header("content-type", "application/json")
        .header("access-control-allow-origin", "*")
        .body(body)
        .build()
}

fn json_error(status: u16, msg: &str) -> Response {
    let body = serde_json::to_vec(&serde_json::json!({"ok": false, "error": msg})).unwrap_or_default();
    json_response(status, body)
}
