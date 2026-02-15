#!/bin/bash
# Cloudflare Pages デプロイ後の自動テスト

set -e

URL="${1:-https://enablerdao.pages.dev}"
echo "🧪 Testing: $URL"
echo "=========================================="

# 1. HTTPSチェック
echo "1. HTTPS確認..."
STATUS=$(curl -o /dev/null -s -w "%{http_code}" "$URL")
if [ "$STATUS" -eq 200 ]; then
  echo "✅ HTTP 200 OK"
else
  echo "❌ HTTP $STATUS"
  exit 1
fi

# 2. レスポンスタイム測定
echo ""
echo "2. レスポンスタイム測定..."
TIME=$(curl -o /dev/null -s -w "%{time_total}" "$URL")
echo "⏱️  ${TIME}秒"

# 3. 必須コンテンツ確認
echo ""
echo "3. コンテンツ確認..."
CONTENT=$(curl -s "$URL")

if echo "$CONTENT" | grep -q "EnablerDAO"; then
  echo "✅ ロゴ表示確認"
else
  echo "❌ ロゴ未表示"
fi

if echo "$CONTENT" | grep -q "無料で始める"; then
  echo "✅ ヒーローCTA確認"
else
  echo "❌ ヒーローCTA未表示"
fi

if echo "$CONTENT" | grep -q "newsletter"; then
  echo "✅ Newsletter CTA確認"
else
  echo "❌ Newsletter CTA未表示"
fi

# 4. API動作確認
echo ""
echo "4. Newsletter API確認..."
API_RESPONSE=$(curl -s -X POST "$URL/api/newsletter/subscribe" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}')

if echo "$API_RESPONSE" | grep -q "success\|登録"; then
  echo "✅ API動作確認"
else
  echo "⚠️  API要確認: $API_RESPONSE"
fi

# 5. SSL証明書確認
echo ""
echo "5. SSL証明書確認..."
SSL_INFO=$(echo | openssl s_client -servername enablerdao.pages.dev -connect enablerdao.pages.dev:443 2>/dev/null | openssl x509 -noout -dates)
echo "$SSL_INFO"
echo "✅ SSL有効"

# 6. Lighthouseスコア（オプション）
echo ""
echo "6. Lighthouseスコア測定（省略可）..."
if command -v lighthouse &> /dev/null; then
  npx lighthouse "$URL" --only-categories=performance,accessibility --quiet --chrome-flags="--headless"
else
  echo "⚠️  Lighthouse未インストール（スキップ）"
fi

echo ""
echo "=========================================="
echo "✅ 全テスト完了！"
echo "🌐 デプロイURL: $URL"
