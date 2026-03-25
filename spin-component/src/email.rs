/// Outbound email via the Resend API.
///
/// All sends are fire-and-forget: failures are logged but never bubble up to
/// the caller (the user-facing request should succeed regardless of email).

use spin_sdk::http::{Method, Request, Response};

/// Send a welcome email to a new newsletter subscriber.
pub async fn send_welcome(api_key: &str, to: &str) {
    if api_key.is_empty() {
        return;
    }

    let body = serde_json::json!({
        "from": "info@enablerdao.com",
        "to": [to],
        "subject": "EnablerDAOへようこそ！",
        "html": format!(
            r#"<div style="font-family:monospace;background:#0a0a0a;color:#e8e8e8;padding:32px;max-width:600px;">
<h1 style="color:#44ff88;font-size:18px;">$ welcome --user {to}</h1>
<p>EnablerDAOのニュースレターにご登録ありがとうございます。</p>
<p>最新のプロダクト情報、技術記事、コミュニティの動きを週1回お届けします。</p>
<hr style="border-color:#333;">
<p style="color:#888;font-size:12px;">EnablerDAO &mdash; Building the future of decentralized innovation</p>
</div>"#
        ),
    });

    let Ok(body_bytes) = serde_json::to_vec(&body) else { return };
    let req = Request::builder()
        .method(Method::Post)
        .uri("https://api.resend.com/emails")
        .header("Authorization", &format!("Bearer {api_key}"))
        .header("Content-Type", "application/json")
        .body(body_bytes)
        .build();

    let _: Result<Response, _> = spin_sdk::http::send(req).await;
}

/// Notify admins about a new idea submission.
pub async fn send_idea_notification(api_key: &str, idea_title: &str, nickname: &str) {
    if api_key.is_empty() {
        return;
    }

    let body = serde_json::json!({
        "from": "info@enablerdao.com",
        "to": ["info@enablerdao.com"],
        "subject": format!("[EnablerDAO] 新しいアイデア: {}", idea_title),
        "html": format!(
            r#"<div style="font-family:monospace;background:#0a0a0a;color:#e8e8e8;padding:32px;max-width:600px;">
<h1 style="color:#44ff88;font-size:18px;">$ new-idea --from {nickname}</h1>
<p><strong>{idea_title}</strong></p>
<p><a href="https://enablerdao.com/ideas" style="color:#44ff88;">アイデア一覧を見る</a></p>
</div>"#
        ),
    });

    let Ok(body_bytes) = serde_json::to_vec(&body) else { return };
    let req = Request::builder()
        .method(Method::Post)
        .uri("https://api.resend.com/emails")
        .header("Authorization", &format!("Bearer {api_key}"))
        .header("Content-Type", "application/json")
        .body(body_bytes)
        .build();

    let _: Result<Response, _> = spin_sdk::http::send(req).await;
}

/// Notify admins about user feedback.
pub async fn send_feedback_notification(api_key: &str, message: &str, contact: &str) {
    if api_key.is_empty() {
        return;
    }

    let body = serde_json::json!({
        "from": "info@enablerdao.com",
        "to": ["info@enablerdao.com"],
        "subject": "[EnablerDAO] フィードバック受信",
        "html": format!(
            r#"<div style="font-family:monospace;background:#0a0a0a;color:#e8e8e8;padding:32px;max-width:600px;">
<h1 style="color:#44ff88;font-size:18px;">$ feedback --received</h1>
<p><strong>メッセージ:</strong></p>
<pre style="background:#111;padding:16px;border-radius:4px;white-space:pre-wrap;">{message}</pre>
<p><strong>連絡先:</strong> {contact}</p>
</div>"#
        ),
    });

    let Ok(body_bytes) = serde_json::to_vec(&body) else { return };
    let req = Request::builder()
        .method(Method::Post)
        .uri("https://api.resend.com/emails")
        .header("Authorization", &format!("Bearer {api_key}"))
        .header("Content-Type", "application/json")
        .body(body_bytes)
        .build();

    let _: Result<Response, _> = spin_sdk::http::send(req).await;
}
