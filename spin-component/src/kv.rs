/// Key-value store helpers for persistent data.
///
/// Data model:
/// - `blog:posts`       → `Vec<BlogPost>` as JSON
/// - `blog:seed_loaded`  → `"true"`
/// - `ideas:all`         → `Vec<Idea>` as JSON
/// - `ideas:next_id`     → counter string
/// - `qa:all`            → `Vec<QaItem>` as JSON
/// - `qa:next_id`        → counter string
/// - `newsletter:emails` → `Vec<String>` as JSON

use serde::{Deserialize, Serialize};
use spin_sdk::key_value::Store;

use crate::data::BlogPost;

// ── Domain types ────────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Idea {
    pub id: u64,
    pub title: String,
    pub detail: String,
    pub category: String,
    pub nickname: String,
    pub likes: u64,
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QaItem {
    pub id: u64,
    pub question: String,
    pub answer: String,
    pub asker: String,
    pub created_at: String,
}

// ── KV keys ─────────────────────────────────────────────────────────────────

const KEY_IDEAS: &str = "ideas:all";
const KEY_IDEAS_NEXT_ID: &str = "ideas:next_id";
const KEY_QA: &str = "qa:all";
const KEY_QA_NEXT_ID: &str = "qa:next_id";
const KEY_NEWSLETTER: &str = "newsletter:emails";
const KEY_BLOG_POSTS: &str = "blog:posts";
const KEY_BLOG_SEED_LOADED: &str = "blog:seed_loaded";

// ── Blog ────────────────────────────────────────────────────────────────────

/// Ensure blog seed data is loaded into KV (idempotent).
pub fn ensure_blog_seed() {
    let Ok(store) = Store::open_default() else { return };
    if let Ok(Some(v)) = store.get(KEY_BLOG_SEED_LOADED) {
        if v == b"true" {
            return;
        }
    }
    let posts = crate::data::load_blog_posts();
    if let Ok(json) = serde_json::to_vec(&posts) {
        let _ = store.set(KEY_BLOG_POSTS, &json);
        let _ = store.set(KEY_BLOG_SEED_LOADED, b"true");
    }
}

/// Return all blog posts from KV (falls back to compiled seed data).
pub fn list_blog_posts() -> Vec<BlogPost> {
    let Ok(store) = Store::open_default() else {
        return crate::data::load_blog_posts();
    };
    match store.get(KEY_BLOG_POSTS) {
        Ok(Some(bytes)) => serde_json::from_slice(&bytes).unwrap_or_default(),
        _ => crate::data::load_blog_posts(),
    }
}

// ── Ideas ───────────────────────────────────────────────────────────────────

/// List all ideas (newest first by id).
pub fn list_ideas() -> Vec<Idea> {
    let Ok(store) = Store::open_default() else { return vec![] };
    match store.get(KEY_IDEAS) {
        Ok(Some(bytes)) => {
            let mut ideas: Vec<Idea> = serde_json::from_slice(&bytes).unwrap_or_default();
            ideas.sort_by(|a, b| b.id.cmp(&a.id));
            ideas
        }
        _ => vec![],
    }
}

/// Create a new idea and persist it.
pub fn create_idea(
    title: &str,
    detail: &str,
    category: &str,
    nickname: &str,
    _email: &str,
) -> anyhow::Result<Idea> {
    let store = Store::open_default()?;

    // Get and increment the next ID.
    let next_id = match store.get(KEY_IDEAS_NEXT_ID)? {
        Some(bytes) => {
            let s = String::from_utf8_lossy(&bytes);
            s.trim().parse::<u64>().unwrap_or(1)
        }
        None => 1,
    };

    let idea = Idea {
        id: next_id,
        title: title.to_string(),
        detail: detail.to_string(),
        category: category.to_string(),
        nickname: if nickname.is_empty() {
            "anonymous".to_string()
        } else {
            nickname.to_string()
        },
        likes: 0,
        created_at: String::new(), // WASM has no system clock; client renders timeAgo()
    };

    // Load existing list, append, and save.
    let mut ideas: Vec<Idea> = match store.get(KEY_IDEAS)? {
        Some(bytes) => serde_json::from_slice(&bytes).unwrap_or_default(),
        None => vec![],
    };
    ideas.push(idea.clone());

    store.set(KEY_IDEAS, &serde_json::to_vec(&ideas)?)?;
    store.set(
        KEY_IDEAS_NEXT_ID,
        (next_id + 1).to_string().as_bytes(),
    )?;

    Ok(idea)
}

/// Increment the like count for the idea with the given `id`.
pub fn like_idea(id: u64) -> anyhow::Result<()> {
    let store = Store::open_default()?;

    let mut ideas: Vec<Idea> = match store.get(KEY_IDEAS)? {
        Some(bytes) => serde_json::from_slice(&bytes)?,
        None => anyhow::bail!("no ideas found"),
    };

    let idea = ideas
        .iter_mut()
        .find(|i| i.id == id)
        .ok_or_else(|| anyhow::anyhow!("idea {} not found", id))?;
    idea.likes += 1;

    store.set(KEY_IDEAS, &serde_json::to_vec(&ideas)?)?;
    Ok(())
}

// ── Q&A ─────────────────────────────────────────────────────────────────────

/// List all Q&A items (newest first).
pub fn list_qa() -> Vec<QaItem> {
    let Ok(store) = Store::open_default() else { return vec![] };
    match store.get(KEY_QA) {
        Ok(Some(bytes)) => {
            let mut items: Vec<QaItem> = serde_json::from_slice(&bytes).unwrap_or_default();
            items.sort_by(|a, b| b.id.cmp(&a.id));
            items
        }
        _ => vec![],
    }
}

/// Create a new question (answer starts empty).
pub fn create_question(question: &str, asker: &str) -> anyhow::Result<QaItem> {
    let store = Store::open_default()?;

    let next_id = match store.get(KEY_QA_NEXT_ID)? {
        Some(bytes) => {
            let s = String::from_utf8_lossy(&bytes);
            s.trim().parse::<u64>().unwrap_or(1)
        }
        None => 1,
    };

    let item = QaItem {
        id: next_id,
        question: question.to_string(),
        answer: String::new(),
        asker: if asker.is_empty() {
            "anonymous".to_string()
        } else {
            asker.to_string()
        },
        created_at: String::new(),
    };

    let mut items: Vec<QaItem> = match store.get(KEY_QA)? {
        Some(bytes) => serde_json::from_slice(&bytes).unwrap_or_default(),
        None => vec![],
    };
    items.push(item.clone());

    store.set(KEY_QA, &serde_json::to_vec(&items)?)?;
    store.set(KEY_QA_NEXT_ID, (next_id + 1).to_string().as_bytes())?;

    Ok(item)
}

/// Set the answer on an existing question.
pub fn answer_question(id: u64, answer: &str) -> anyhow::Result<()> {
    let store = Store::open_default()?;

    let mut items: Vec<QaItem> = match store.get(KEY_QA)? {
        Some(bytes) => serde_json::from_slice(&bytes)?,
        None => anyhow::bail!("no QA items found"),
    };

    let item = items
        .iter_mut()
        .find(|q| q.id == id)
        .ok_or_else(|| anyhow::anyhow!("QA item {} not found", id))?;
    item.answer = answer.to_string();

    store.set(KEY_QA, &serde_json::to_vec(&items)?)?;
    Ok(())
}

// ── Newsletter ──────────────────────────────────────────────────────────────

/// Add an email to the newsletter list (deduped).
pub fn subscribe_newsletter(email: &str) -> anyhow::Result<()> {
    let store = Store::open_default()?;

    let mut emails: Vec<String> = match store.get(KEY_NEWSLETTER)? {
        Some(bytes) => serde_json::from_slice(&bytes).unwrap_or_default(),
        None => vec![],
    };

    let lower = email.to_lowercase();
    if !emails.iter().any(|e| e.to_lowercase() == lower) {
        emails.push(lower);
        store.set(KEY_NEWSLETTER, &serde_json::to_vec(&emails)?)?;
    }

    Ok(())
}

/// Return the full list of newsletter subscriber emails.
pub fn list_newsletter_emails() -> Vec<String> {
    let Ok(store) = Store::open_default() else { return vec![] };
    match store.get(KEY_NEWSLETTER) {
        Ok(Some(bytes)) => serde_json::from_slice(&bytes).unwrap_or_default(),
        _ => vec![],
    }
}
