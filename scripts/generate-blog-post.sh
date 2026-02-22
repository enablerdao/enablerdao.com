#!/bin/bash
# news.xyz ブログ記事自動生成スクリプト
# 使い方: ANTHROPIC_API_KEY=sk-... ./scripts/generate-blog-post.sh
# cron例: 0 9 * * * /path/to/generate-blog-post.sh >> /var/log/blog-gen.log 2>&1

set -euo pipefail

API_KEY="${ANTHROPIC_API_KEY:-}"
BLOG_DIR="$(cd "$(dirname "$0")/../frontend/blog" && pwd)"
DATE_STR=$(date +"%Y-%m-%d")
DATE_DISPLAY=$(date "+%B %d, %Y")
NEWS_API_URL="${NEWS_API_URL:-https://news.xyz/api/feed?limit=8&category=tech}"

if [ -z "$API_KEY" ]; then
  echo "[ERROR] ANTHROPIC_API_KEY not set"
  exit 1
fi

echo "[INFO] Fetching top news from $NEWS_API_URL ..."
NEWS_JSON=$(curl -sf "$NEWS_API_URL" 2>/dev/null || echo '[]')

# Extract headlines (titles + descriptions)
HEADLINES=$(echo "$NEWS_JSON" | python3 -c "
import json, sys
articles = json.load(sys.stdin)
if not isinstance(articles, list):
    articles = articles.get('articles', articles.get('items', []))
lines = []
for i, a in enumerate(articles[:8]):
    title = a.get('title', '')
    desc = a.get('description', a.get('summary', ''))[:120]
    if title:
        lines.append(f'{i+1}. {title}' + (f' — {desc}' if desc else ''))
print('\n'.join(lines))
" 2>/dev/null || echo "No articles fetched")

if [ "$HEADLINES" = "No articles fetched" ]; then
  echo "[WARN] Could not fetch headlines. Using fallback topics."
  HEADLINES="1. AI技術の最新動向 2026年
2. Rustプログラミング言語の採用が拡大
3. AWS Lambda コスト最適化の新手法
4. マルチモデルAIエージェントの台頭
5. 日本のAIスタートアップ最新情報"
fi

echo "[INFO] Headlines collected:"
echo "$HEADLINES"
echo ""

# Generate blog post using Claude API
echo "[INFO] Generating blog post with Claude..."

PROMPT="あなたはテクノロジーブログのライターです。以下の最新ニュース記事一覧を基に、読者が価値を感じる日本語のブログ記事を書いてください。

【本日のニュース】
$HEADLINES

【要件】
- タイトル: 本日のテクノロジートレンドまとめ（$DATE_DISPLAY）
- 長さ: 600-900文字
- 形式: 各トピックを2-3文で解説、最後に「まとめ」セクション
- トーン: プロフェッショナルかつ読みやすく
- EnablerDAO（https://enablerdao.com）とchatweb.ai（https://chatweb.ai）への自然なリンクを1箇所ずつ含める
- HTML形式で出力（<h2>, <p>, <ul>, <li>タグのみ使用）
- <html>, <body>, <head>タグは不要。本文のみ出力。"

RESPONSE=$(curl -sf "https://api.anthropic.com/v1/messages" \
  -H "x-api-key: $API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d "{
    \"model\": \"claude-haiku-4-5-20251001\",
    \"max_tokens\": 2000,
    \"messages\": [{
      \"role\": \"user\",
      \"content\": $(echo "$PROMPT" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')
    }]
  }" 2>/dev/null)

ARTICLE_BODY=$(echo "$RESPONSE" | python3 -c "
import json, sys
d = json.load(sys.stdin)
content = d.get('content', [])
text = next((c['text'] for c in content if c.get('type') == 'text'), '')
print(text)
" 2>/dev/null || echo "<p>記事の生成に失敗しました。</p>")

# Generate output filename
SLUG="${DATE_STR}-tech-digest"
OUTPUT_FILE="$BLOG_DIR/${SLUG}.html"

# Write HTML file
cat > "$OUTPUT_FILE" << HTMLEOF
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>テクノロジーダイジェスト ${DATE_DISPLAY} - EnablerDAO Blog</title>
    <meta name="description" content="${DATE_DISPLAY}のテクノロジーニュースまとめ。AI、Rust、クラウドの最新動向。">
    <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png">
    <link rel="stylesheet" href="/css/about.css?v=17">
    <link rel="stylesheet" href="/css/blog.css?v=1">
</head>
<body>
    <header class="about-header">
        <div class="about-header-inner">
            <a href="/" class="about-logo">EnablerDAO</a>
            <nav class="about-nav">
                <a href="/">Home</a>
                <a href="/blog/" class="active">Blog</a>
            </nav>
        </div>
    </header>
    <div class="blog-container">
        <article class="post-content">
            <div class="post-header">
                <div class="blog-post-meta">${DATE_DISPLAY} • Auto-generated • By nanobot AI</div>
                <h1 class="post-title">テクノロジーダイジェスト — ${DATE_DISPLAY}</h1>
            </div>
            ${ARTICLE_BODY}
            <hr style="border:none;border-top:1px solid #1a1a3e;margin:2rem 0;">
            <p style="font-size:0.85rem;color:#6b7280;text-align:center;">
                この記事は <a href="https://chatweb.ai" style="color:#60a5fa">chatweb.ai</a> の AI が自動生成しました。
                ソース: <a href="https://news.xyz" style="color:#60a5fa">news.xyz</a>
            </p>
        </article>
    </div>
</body>
</html>
HTMLEOF

echo "[INFO] Blog post written to: $OUTPUT_FILE"

# Update blog index.html
INDEX_FILE="$BLOG_DIR/index.html"
if [ -f "$INDEX_FILE" ]; then
  CARD_HTML="
        <article class=\"blog-post-card\">
            <div class=\"blog-post-meta\">${DATE_DISPLAY} • AI生成</div>
            <a href=\"/blog/${SLUG}.html\" class=\"blog-post-title\">テクノロジーダイジェスト — ${DATE_DISPLAY}</a>
            <p class=\"blog-post-excerpt\">本日の技術トレンドまとめ。AIエージェント、クラウド最適化、オープンソースの最新動向を解説。</p>
            <a href=\"/blog/${SLUG}.html\" class=\"read-more\">Read more →</a>
        </article>"

  # Insert new card after <div class="blog-container">
  python3 - "$INDEX_FILE" "$CARD_HTML" << 'PYEOF'
import sys
path, card = sys.argv[1], sys.argv[2]
with open(path) as f:
    content = f.read()
insert_after = '<div class="blog-container">'
idx = content.find(insert_after)
if idx != -1:
    pos = idx + len(insert_after)
    content = content[:pos] + '\n' + card + content[pos:]
    with open(path, 'w') as f:
        f.write(content)
    print(f"[INFO] Updated {path}")
else:
    print(f"[WARN] Could not find insertion point in {path}")
PYEOF
fi

echo "[DONE] Blog post generation complete: $OUTPUT_FILE"
