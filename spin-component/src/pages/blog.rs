use crate::data::category_class;
use crate::layout::NEWSLETTER_CTA_HTML;

/// Renders the blog listing page.
pub fn render_list(posts: &[crate::data::BlogPost]) -> String {
    let mut cards = String::new();
    for post in posts {
        let cls = category_class(&post.category);
        let tags_html: String = post
            .tags
            .iter()
            .map(|t| format!(r#"<span class="blog-tag">#{tag}</span>"#, tag = t))
            .collect::<Vec<_>>()
            .join("\n          ");

        cards.push_str(&format!(
            r#"      <a href="/blog/{slug}" class="blog-card">
        <div class="blog-card-header">
          <span class="blog-category badge-{cls}">{category}</span>
          <time class="blog-date">{date}</time>
        </div>
        <h2 class="blog-card-title">{title}</h2>
        <p class="blog-card-desc">{desc}</p>
        <div class="blog-tags">
          {tags}
        </div>
      </a>
"#,
            slug = post.slug,
            cls = cls,
            category = post.category,
            date = post.published_at,
            title = post.title,
            desc = post.description,
            tags = tags_html,
        ));
    }

    format!(
        r#"<section class="section">
  <div class="container">
    <div class="page-header">
      <h1 class="page-title prompt">$ ls ~/blog/</h1>
      <p class="page-subtitle">技術記事・DAO運営レポート・プロダクト開発の記録</p>
    </div>

    <div class="blog-list">
{cards}    </div>

    {newsletter}
  </div>
</section>"#,
        cards = cards,
        newsletter = NEWSLETTER_CTA_HTML,
    )
}

/// Renders a single blog post detail page.
pub fn render_detail(post: &crate::data::BlogPost, content_html: &str) -> String {
    let cls = category_class(&post.category);
    let tags_html: String = post
        .tags
        .iter()
        .map(|t| format!(r#"<span class="blog-tag">#{tag}</span>"#, tag = t))
        .collect::<Vec<_>>()
        .join("\n        ");

    format!(
        r#"<article class="section">
  <div class="container article-container">
    <nav class="breadcrumb">
      <a href="/">~/</a> / <a href="/blog">blog</a> / <span>{slug}</span>
    </nav>

    <header class="article-header-card">
      <span class="blog-category badge-{cls}">{category}</span>
      <h1 class="article-title">{title}</h1>
      <p class="article-desc">{desc}</p>
      <div class="article-meta">
        <span class="article-author">{author}</span>
        <time class="article-date">{date}</time>
      </div>
      <div class="blog-tags">
        {tags}
      </div>
    </header>

    <div class="article-content markdown-body">
      {content}
    </div>

    <nav class="article-nav">
      <a href="/blog" class="btn btn-secondary">← ブログ一覧に戻る</a>
      <a href="/ideas" class="btn btn-primary">💡 アイデアを投稿</a>
    </nav>
  </div>
</article>"#,
        slug = post.slug,
        cls = cls,
        category = post.category,
        title = post.title,
        desc = post.description,
        author = post.author,
        date = post.published_at,
        tags = tags_html,
        content = content_html,
    )
}
