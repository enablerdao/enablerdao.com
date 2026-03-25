/// Blog seed data loader.
///
/// The JSON file is embedded at compile time so no runtime I/O is needed.

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BlogPost {
    pub slug: String,
    pub title: String,
    pub description: String,
    pub content: String,
    pub author: String,
    #[serde(rename = "publishedAt")]
    pub published_at: String,
    pub tags: Vec<String>,
    pub category: String,
}

const BLOG_SEED: &str = include_str!("../../static/blog_seed.json");

/// Parse the compiled-in blog seed JSON into a `Vec<BlogPost>`.
pub fn load_blog_posts() -> Vec<BlogPost> {
    serde_json::from_str(BLOG_SEED).unwrap_or_default()
}

/// Map a blog category name to a CSS colour class token.
pub fn category_class(category: &str) -> &'static str {
    match category {
        "Engineering" => "green",
        "DAO Governance" => "cyan",
        "Analytics" => "amber",
        "Design" => "violet",
        _ => "green",
    }
}
