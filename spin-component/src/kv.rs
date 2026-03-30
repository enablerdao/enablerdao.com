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

/// Ensure blog seed data is loaded into KV (version-aware).
/// Bump this version to force re-seed after blog_seed.json changes.
const BLOG_SEED_VERSION: &str = "v7";

pub fn ensure_blog_seed() {
    let Ok(store) = Store::open_default() else { return };
    if let Ok(Some(v)) = store.get(KEY_BLOG_SEED_LOADED) {
        if v == BLOG_SEED_VERSION.as_bytes() {
            return;
        }
    }
    let posts = crate::data::load_blog_posts();
    if let Ok(json) = serde_json::to_vec(&posts) {
        let _ = store.set(KEY_BLOG_POSTS, &json);
        let _ = store.set(KEY_BLOG_SEED_LOADED, BLOG_SEED_VERSION.as_bytes());
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

// ── Fan Club ────────────────────────────────────────────────────────────────

const KEY_FANCLUB_MEMBERS: &str = "fanclub:members";
const KEY_FANCLUB_TOKENS: &str = "fanclub:tokens";

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FanClubMember {
    pub email: String,
    pub promo_code: String,
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct FanClubToken {
    pub token: String,
    pub email: String,
    pub created_at: u64, // unix timestamp
}

/// List all fan club members.
pub fn list_fanclub_members() -> Vec<FanClubMember> {
    let Ok(store) = Store::open_default() else { return vec![] };
    match store.get(KEY_FANCLUB_MEMBERS) {
        Ok(Some(bytes)) => serde_json::from_slice(&bytes).unwrap_or_default(),
        _ => vec![],
    }
}

/// Register a new fan club member with an auto-generated promo code.
pub fn create_fanclub_member(email: &str) -> anyhow::Result<FanClubMember> {
    let store = Store::open_default()?;

    let mut members: Vec<FanClubMember> = match store.get(KEY_FANCLUB_MEMBERS)? {
        Some(bytes) => serde_json::from_slice(&bytes).unwrap_or_default(),
        None => vec![],
    };

    let lower = email.to_lowercase();
    if members.iter().any(|m| m.email == lower) {
        anyhow::bail!("already registered");
    }

    let code = generate_promo_code();
    let member = FanClubMember {
        email: lower,
        promo_code: code,
        created_at: now_iso(),
    };

    members.push(member.clone());
    store.set(KEY_FANCLUB_MEMBERS, &serde_json::to_vec(&members)?)?;

    // Also add hash to pasha promo codes list
    add_promo_code_hash(&member.promo_code);

    Ok(member)
}

/// Create a temporary login token for a fan club member.
pub fn create_fanclub_token(email: &str) -> String {
    let token = generate_token();

    let Ok(store) = Store::open_default() else { return token };
    let mut tokens: Vec<FanClubToken> = match store.get(KEY_FANCLUB_TOKENS) {
        Ok(Some(bytes)) => serde_json::from_slice(&bytes).unwrap_or_default(),
        _ => vec![],
    };

    // Remove expired tokens (older than 1 hour) and any existing tokens for this email
    let now = current_unix_time();
    tokens.retain(|t| t.email != email.to_lowercase() && (now - t.created_at) < 3600);

    tokens.push(FanClubToken {
        token: token.clone(),
        email: email.to_lowercase(),
        created_at: now,
    });

    let _ = store.set(KEY_FANCLUB_TOKENS, &serde_json::to_vec(&tokens).unwrap_or_default());
    token
}

/// Verify a login token and return the member if valid.
pub fn verify_fanclub_token(token: &str) -> Option<FanClubMember> {
    let store = Store::open_default().ok()?;
    let tokens: Vec<FanClubToken> = match store.get(KEY_FANCLUB_TOKENS) {
        Ok(Some(bytes)) => serde_json::from_slice(&bytes).unwrap_or_default(),
        _ => return None,
    };

    let now = current_unix_time();
    let found = tokens.iter().find(|t| t.token == token && (now - t.created_at) < 3600)?;

    let members = list_fanclub_members();
    members.into_iter().find(|m| m.email == found.email)
}

/// Add a promo code's SHA-256 hash to the codes list (for pasha.run sync).
fn add_promo_code_hash(code: &str) {
    let hash = sha256_hex(code);
    let Ok(store) = Store::open_default() else { return };

    let mut hashes: Vec<String> = match store.get("fanclub:code_hashes") {
        Ok(Some(bytes)) => serde_json::from_slice(&bytes).unwrap_or_default(),
        _ => vec![],
    };

    if !hashes.contains(&hash) {
        hashes.push(hash);
        let _ = store.set("fanclub:code_hashes", &serde_json::to_vec(&hashes).unwrap_or_default());
    }
}

/// Get all promo code hashes (for the API endpoint).
pub fn list_promo_code_hashes() -> Vec<String> {
    let Ok(store) = Store::open_default() else { return vec![] };
    match store.get("fanclub:code_hashes") {
        Ok(Some(bytes)) => serde_json::from_slice(&bytes).unwrap_or_default(),
        _ => vec![],
    }
}

// ── Helpers ─────────────────────────────────────────────────────────────────

fn generate_promo_code() -> String {
    // ENABLER-XXXX-XXXX-XXXX
    let chars: &[u8] = b"ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I ambiguity
    let mut parts = Vec::new();
    for _ in 0..3 {
        let part: String = (0..4)
            .map(|_| {
                let idx = (random_byte() as usize) % chars.len();
                chars[idx] as char
            })
            .collect();
        parts.push(part);
    }
    format!("ENABLER-{}-{}-{}", parts[0], parts[1], parts[2])
}

fn generate_token() -> String {
    (0..32)
        .map(|_| {
            let b = random_byte();
            format!("{:02x}", b)
        })
        .collect()
}

fn random_byte() -> u8 {
    // Simple PRNG using current time + counter
    use std::sync::atomic::{AtomicU64, Ordering};
    static COUNTER: AtomicU64 = AtomicU64::new(0);
    let c = COUNTER.fetch_add(1, Ordering::Relaxed);
    let t = current_unix_time();
    let mix = t.wrapping_mul(6364136223846793005).wrapping_add(c).wrapping_mul(1442695040888963407);
    (mix >> 33) as u8
}

fn sha256_hex(input: &str) -> String {
    // Simple SHA-256 implementation for WASM (no openssl dependency)
    // We use the same algorithm as the iOS app
    use std::num::Wrapping;

    let input = input.as_bytes();

    let k: [u32; 64] = [
        0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
        0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
        0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
        0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
        0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
        0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
        0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
        0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2,
    ];

    let mut h: [Wrapping<u32>; 8] = [
        Wrapping(0x6a09e667), Wrapping(0xbb67ae85), Wrapping(0x3c6ef372), Wrapping(0xa54ff53a),
        Wrapping(0x510e527f), Wrapping(0x9b05688c), Wrapping(0x1f83d9ab), Wrapping(0x5be0cd19),
    ];

    // Pre-processing: pad message
    let bit_len = (input.len() as u64) * 8;
    let mut msg = input.to_vec();
    msg.push(0x80);
    while (msg.len() % 64) != 56 {
        msg.push(0);
    }
    msg.extend_from_slice(&bit_len.to_be_bytes());

    // Process each 512-bit block
    for chunk in msg.chunks(64) {
        let mut w = [Wrapping(0u32); 64];
        for i in 0..16 {
            w[i] = Wrapping(u32::from_be_bytes([chunk[4*i], chunk[4*i+1], chunk[4*i+2], chunk[4*i+3]]));
        }
        for i in 16..64 {
            let s0 = (w[i-15].0.rotate_right(7)) ^ (w[i-15].0.rotate_right(18)) ^ (w[i-15].0 >> 3);
            let s1 = (w[i-2].0.rotate_right(17)) ^ (w[i-2].0.rotate_right(19)) ^ (w[i-2].0 >> 10);
            w[i] = w[i-16] + Wrapping(s0) + w[i-7] + Wrapping(s1);
        }

        let (mut a, mut b, mut c, mut d, mut e, mut f, mut g, mut hh) =
            (h[0], h[1], h[2], h[3], h[4], h[5], h[6], h[7]);

        for i in 0..64 {
            let s1 = Wrapping(e.0.rotate_right(6) ^ e.0.rotate_right(11) ^ e.0.rotate_right(25));
            let ch = Wrapping((e.0 & f.0) ^ ((!e.0) & g.0));
            let temp1 = hh + s1 + ch + Wrapping(k[i]) + w[i];
            let s0 = Wrapping(a.0.rotate_right(2) ^ a.0.rotate_right(13) ^ a.0.rotate_right(22));
            let maj = Wrapping((a.0 & b.0) ^ (a.0 & c.0) ^ (b.0 & c.0));
            let temp2 = s0 + maj;

            hh = g; g = f; f = e; e = d + temp1;
            d = c; c = b; b = a; a = temp1 + temp2;
        }

        h[0] = h[0] + a; h[1] = h[1] + b; h[2] = h[2] + c; h[3] = h[3] + d;
        h[4] = h[4] + e; h[5] = h[5] + f; h[6] = h[6] + g; h[7] = h[7] + hh;
    }

    h.iter().map(|x| format!("{:08x}", x.0)).collect()
}

fn now_iso() -> String {
    // Return a basic ISO timestamp from Unix time
    let secs = current_unix_time();
    // Simple conversion (approximate, doesn't handle leap seconds)
    let days = secs / 86400;
    let time_of_day = secs % 86400;
    let hours = time_of_day / 3600;
    let minutes = (time_of_day % 3600) / 60;

    // Calculate year/month/day from days since epoch
    let mut y = 1970i64;
    let mut remaining_days = days as i64;
    loop {
        let days_in_year = if y % 4 == 0 && (y % 100 != 0 || y % 400 == 0) { 366 } else { 365 };
        if remaining_days < days_in_year { break; }
        remaining_days -= days_in_year;
        y += 1;
    }
    let leap = y % 4 == 0 && (y % 100 != 0 || y % 400 == 0);
    let month_days: [i64; 12] = [31, if leap {29} else {28}, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let mut m = 0;
    for md in &month_days {
        if remaining_days < *md { break; }
        remaining_days -= md;
        m += 1;
    }

    format!("{:04}-{:02}-{:02}T{:02}:{:02}:00Z", y, m + 1, remaining_days + 1, hours, minutes)
}

fn current_unix_time() -> u64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_secs())
        .unwrap_or(0)
}
