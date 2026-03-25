/// SEO helpers: sitemap, robots.txt, RSS feed.

use crate::data::BlogPost;

/// Generate `sitemap.xml` covering all public routes.
pub fn sitemap_xml() -> String {
    let base = "https://enablerdao.com";
    // (path, changefreq, priority)
    let routes: &[(&str, &str, &str)] = &[
        ("/",         "daily",   "1.0"),
        ("/projects", "weekly",  "0.9"),
        ("/blog",     "daily",   "0.9"),
        ("/ideas",    "weekly",  "0.8"),
        ("/agents",   "weekly",  "0.8"),
        ("/dao",      "monthly", "0.7"),
        ("/token",    "monthly", "0.7"),
        ("/qa",       "monthly", "0.6"),
        ("/dashboard","weekly",  "0.6"),
        ("/metrics",  "weekly",  "0.6"),
        ("/status",   "hourly",  "0.5"),
    ];

    let mut xml = String::from(
        r#"<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
          http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
"#,
    );

    for (route, changefreq, priority) in routes {
        xml.push_str(&format!(
            "  <url>\n    <loc>{base}{route}</loc>\n    <changefreq>{changefreq}</changefreq>\n    <priority>{priority}</priority>\n  </url>\n"
        ));
    }

    xml.push_str("</urlset>\n");
    xml
}

/// Generate `robots.txt`.
pub fn robots_txt() -> String {
    r#"User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Crawl-delay: 1

Sitemap: https://enablerdao.com/sitemap.xml
"#.to_string()
}

/// Generate an RSS 2.0 feed from blog posts.
pub fn feed_xml(posts: &[BlogPost]) -> String {
    let mut xml = String::from(
        r#"<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>EnablerDAO Blog</title>
    <link>https://enablerdao.com/blog</link>
    <description>EnablerDAO - Building the future of decentralized innovation</description>
    <language>ja</language>
    <atom:link href="https://enablerdao.com/feed.xml" rel="self" type="application/rss+xml"/>
"#,
    );

    for post in posts {
        let link = format!("https://enablerdao.com/blog/{}", post.slug);
        // Escape basic XML entities in title / description.
        let title = xml_escape(&post.title);
        let desc = xml_escape(&post.description);

        xml.push_str(&format!(
            r#"    <item>
      <title>{title}</title>
      <link>{link}</link>
      <guid isPermaLink="true">{link}</guid>
      <description>{desc}</description>
      <pubDate>{date}</pubDate>
      <category>{cat}</category>
    </item>
"#,
            date = &post.published_at,
            cat = xml_escape(&post.category),
        ));
    }

    xml.push_str("  </channel>\n</rss>\n");
    xml
}

/// Minimal XML entity escaping.
fn xml_escape(s: &str) -> String {
    s.replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('"', "&quot;")
        .replace('\'', "&apos;")
}
