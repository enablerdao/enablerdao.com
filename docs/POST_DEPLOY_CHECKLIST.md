# デプロイ後品質保証チェックリスト

Cloudflare Pagesデプロイ後に実施する品質保証チェック項目です。
本番環境への影響を最小化するため、各項目を順番に確認してください。

---

## 1. 基本動作確認

### 表示確認
- [ ] トップページ (/) が表示される
- [ ] 全セクション（Hero, Products, Newsletter, Footer）が正しくレンダリングされる
- [ ] 画像・アイコンが表示される（Lucide Icons, プロダクトアイコン）
- [ ] フォントが正しく読み込まれる（システムフォント）
- [ ] ページスクロールがスムーズに動作する

**確認方法**: ブラウザで直接アクセス
**期待値**: 全要素が意図通りに表示され、レイアウト崩れがない

---

## 2. CTA機能確認

### ボタン・リンク動作
- [ ] "無料で始める" ボタンで #products セクションへスムーズスクロール
- [ ] "GitHubを見る" リンクが新規タブで開く（target="_blank"）
- [ ] トラストバッジが表示される（12製品 / 6,000+ユーザー / 100%オープンソース）
- [ ] プロダクトカード「無料で試す」ボタンが各製品URLへ遷移
- [ ] 全リンクに `rel="noopener noreferrer"` が設定されている

**確認方法**: 各ボタンをクリックして動作確認
**期待値**: 全てのCTAが意図通りに動作する

---

## 3. Newsletter機能確認

### フォーム動作
- [ ] メール入力フォームが表示される
- [ ] 空送信時にバリデーションエラー表示
- [ ] 無効なメールアドレス（例: `test@`）でエラー表示
- [ ] 有効なメールアドレスで登録成功
- [ ] 成功メッセージとクーポンコード（HAMADABJJ）が表示される
- [ ] POST `/api/newsletter/subscribe` が 200 を返す
- [ ] 重複登録時に適切なメッセージ表示

**確認方法**: DevTools Network タブでAPIリクエスト監視
**期待値**:
```json
POST /api/newsletter/subscribe
Status: 200 OK
Response: {"success": true, "coupon_code": "HAMADABJJ"}
```

**テストスクリプト**:
```bash
# API動作確認
curl -X POST https://enablerdao.com/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}' \
  -w "\nStatus: %{http_code}\n"
```

---

## 4. レスポンシブ確認

### 各デバイスサイズ
- [ ] モバイル（375px）で正常表示
  - ハンバーガーメニュー表示（将来実装時）
  - タイトルが読みやすいサイズ
  - ボタンがタップしやすい（min 44x44px）
- [ ] タブレット（768px）で正常表示
  - レイアウトが2カラムに調整
  - 余白が適切
- [ ] デスクトップ（1920px）で正常表示
  - コンテンツが中央に配置（max-width適用）
  - プロダクトカードが3カラムグリッド表示
- [ ] 横向き対応（ランドスケープモード）

**確認方法**: Chrome DevTools Device Toolbar
**期待値**: 全てのブレークポイントで読みやすく、使いやすい表示

---

## 5. パフォーマンス確認

### Lighthouse スコア目標値
- [ ] Performance > 90
- [ ] Accessibility > 90
- [ ] Best Practices > 90
- [ ] SEO > 90

### Core Web Vitals
- [ ] First Contentful Paint (FCP) < 1.5s
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Total Blocking Time (TBT) < 300ms
- [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] Time to Interactive (TTI) < 3.5s

**確認ツール**:
- Chrome DevTools Lighthouse
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)

**テストスクリプト**:
```bash
# Lighthouse CLI
npx lighthouse https://enablerdao.com \
  --output=json \
  --output=html \
  --output-path=./lighthouse-report \
  --chrome-flags="--headless"

# パフォーマンス計測（curl）
curl -w "@curl-format.txt" -o /dev/null -s https://enablerdao.com
```

**curl-format.txt**:
```
time_namelookup:  %{time_namelookup}s\n
time_connect:     %{time_connect}s\n
time_starttransfer: %{time_starttransfer}s\n
time_total:       %{time_total}s\n
size_download:    %{size_download} bytes\n
```

---

## 6. SEO確認

### メタタグ
- [ ] `<title>` タグが設定されている（60文字以内推奨）
- [ ] `<meta name="description">` が設定されている（155文字以内推奨）
- [ ] Open Graph タグ（og:title, og:description, og:image, og:url）
- [ ] Twitter Card タグ（twitter:card, twitter:title, twitter:description, twitter:image）
- [ ] `<link rel="canonical">` が設定されている
- [ ] `<meta name="viewport">` が設定されている
- [ ] favicon.ico が存在する

### SEO関連ファイル
- [ ] `/robots.txt` が正しい内容
- [ ] `/sitemap.xml` が存在する（将来実装時）
- [ ] 構造化データ（JSON-LD）が適切（将来実装時）

**確認方法**: View Page Source または DevTools Elements
**期待値**:
```html
<title>EnablerDAO - 障害者支援のためのWeb3プラットフォーム</title>
<meta name="description" content="...">
<meta property="og:title" content="...">
<link rel="canonical" href="https://enablerdao.com/">
```

**テストツール**:
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

---

## 7. Analytics確認

### Google Analytics / Cloudflare Analytics
- [ ] Google Analytics タグが読み込まれる（gtag.js または GA4）
- [ ] カスタムイベントが送信される（`newsletter_signup`）
- [ ] ページビューがトラッキングされる
- [ ] Cloudflare Web Analytics が有効

**確認方法**:
1. DevTools Network タブで `google-analytics.com` リクエスト確認
2. GA4 DebugView でリアルタイムイベント確認
3. Cloudflare Dashboard > Analytics

**期待値**: イベントがリアルタイムで記録される

---

## 8. セキュリティ確認

### HTTPS・SSL
- [ ] HTTPS で配信される（HTTP→HTTPS自動リダイレクト）
- [ ] SSL証明書が有効（有効期限確認）
- [ ] SSL Labs で A+ 評価

**テストツール**:
```bash
# SSL証明書確認
openssl s_client -connect enablerdao.com:443 -servername enablerdao.com < /dev/null 2>/dev/null | openssl x509 -noout -dates

# SSL Labs API
curl -s "https://api.ssllabs.com/api/v3/analyze?host=enablerdao.com" | jq '.endpoints[0].grade'
```

### セキュリティヘッダー
- [ ] `Content-Security-Policy` 設定
- [ ] `X-Frame-Options: DENY` または `SAMEORIGIN`
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Permissions-Policy` 設定（カメラ・マイク等制限）

**確認方法**:
```bash
curl -I https://enablerdao.com | grep -E "Content-Security|X-Frame|X-Content|Referrer"
```

**期待値**（Cloudflare Pages デフォルト + カスタム設定）:
```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

**テストツール**: [SecurityHeaders.com](https://securityheaders.com/)

---

## 9. カスタムドメイン確認

### ドメイン設定
- [ ] `enablerdao.com` でアクセス可能
- [ ] `www.enablerdao.com` でアクセス可能
- [ ] HTTP→HTTPS 自動リダイレクト
- [ ] www なし → www あり リダイレクト（または逆、ポリシーに応じて）
- [ ] DNS レコード正しく設定（CNAME または A レコード）

**確認方法**:
```bash
# リダイレクト確認
curl -I http://enablerdao.com
curl -I http://www.enablerdao.com
curl -I https://www.enablerdao.com

# DNS確認
dig enablerdao.com
dig www.enablerdao.com
```

**期待値**: 全てのバリエーションが最終的に `https://enablerdao.com` に正規化される

---

## 10. エラーハンドリング確認

### エラーページ
- [ ] 存在しないページ（`/nonexistent`）で 404 エラーページ表示
- [ ] 404 ページにホームへ戻るリンクがある
- [ ] API エラー時に適切なエラーメッセージ（Newsletter登録失敗時など）
- [ ] ネットワークエラー時の表示（オフライン時）
- [ ] JavaScriptエラーが発生していない（Console確認）

**確認方法**:
1. ブラウザで `/test-404` にアクセス
2. DevTools Console でエラーログ確認
3. Newsletter APIをモックして失敗時の挙動確認

**期待値**: ユーザーフレンドリーなエラーメッセージ、コンソールに未処理エラーなし

---

## 11. パフォーマンス最適化確認

### アセット最適化
- [ ] 画像が最適化されている（WebP/AVIF形式、適切なサイズ）
- [ ] CSS が minify されている
- [ ] JavaScript が minify されている
- [ ] 不要なコンソールログ（`console.log`）がない
- [ ] Cloudflare CDN から配信されている（Response Headers に `CF-Ray`）
- [ ] Gzip/Brotli 圧縮が有効

**確認方法**:
```bash
# CDN確認
curl -I https://enablerdao.com | grep CF-Ray

# 圧縮確認
curl -H "Accept-Encoding: gzip,deflate,br" -I https://enablerdao.com | grep Content-Encoding
```

**期待値**:
```
CF-Ray: xxxxx-NRT
Content-Encoding: br
```

### キャッシュ設定
- [ ] 静的アセットに適切な Cache-Control ヘッダー
- [ ] HTML に `no-cache` または短いキャッシュ時間
- [ ] CSS/JS/画像に長期キャッシュ（`max-age=31536000`）

---

## 12. 監視・通知設定

### Cloudflare設定
- [ ] Cloudflare Analytics が動作（Visitors, Requests, Bandwidth）
- [ ] デプロイ通知設定（Slack/Email/Discord）
- [ ] エラーアラート設定（Pages Functions エラー率 > 5%）
- [ ] カスタムアラート設定（レスポンスタイム > 3s）

**設定場所**: Cloudflare Dashboard > Pages > Settings > Notifications

### 外部監視（オプション）
- [ ] Uptime監視（UptimeRobot, Pingdom等）
- [ ] Error Tracking（Sentry等）
- [ ] RUM（Real User Monitoring）設定

---

## テストツール一覧

| カテゴリ | ツール | 用途 |
|---------|--------|------|
| パフォーマンス | Chrome DevTools Lighthouse | 総合スコア測定 |
| パフォーマンス | [PageSpeed Insights](https://pagespeed.web.dev/) | Google公式パフォーマンス測定 |
| パフォーマンス | [GTmetrix](https://gtmetrix.com/) | 詳細パフォーマンス分析 |
| パフォーマンス | [WebPageTest](https://www.webpagetest.org/) | マルチロケーション測定 |
| セキュリティ | [SecurityHeaders.com](https://securityheaders.com/) | HTTPヘッダー検証 |
| セキュリティ | [SSL Labs](https://www.ssllabs.com/ssltest/) | SSL/TLS設定評価 |
| SEO | [Google Rich Results Test](https://search.google.com/test/rich-results) | 構造化データ検証 |
| SEO | [Facebook Debugger](https://developers.facebook.com/tools/debug/) | OGPタグ確認 |
| SEO | [Twitter Card Validator](https://cards-dev.twitter.com/validator) | Twitterカード確認 |
| アクセシビリティ | [WAVE](https://wave.webaim.org/) | アクセシビリティ検証 |
| アクセシビリティ | [axe DevTools](https://www.deque.com/axe/devtools/) | Chrome拡張でa11y検証 |

---

## 自動テストスクリプト

### 一括確認スクリプト（Bash）

```bash
#!/bin/bash
# deploy-qa.sh - デプロイ後QAスクリプト

SITE_URL="https://enablerdao.com"
REPORT_DIR="./qa-reports"

mkdir -p "$REPORT_DIR"

echo "========================================="
echo "デプロイ後QA開始: $SITE_URL"
echo "========================================="

# 1. 基本動作確認
echo "[1/8] 基本動作確認..."
STATUS=$(curl -o /dev/null -s -w "%{http_code}" "$SITE_URL")
if [ "$STATUS" -eq 200 ]; then
  echo "✅ サイトアクセス成功 (HTTP $STATUS)"
else
  echo "❌ サイトアクセス失敗 (HTTP $STATUS)"
  exit 1
fi

# 2. SSL確認
echo "[2/8] SSL証明書確認..."
openssl s_client -connect enablerdao.com:443 -servername enablerdao.com < /dev/null 2>/dev/null | \
  openssl x509 -noout -dates > "$REPORT_DIR/ssl-cert.txt"
echo "✅ SSL証明書情報保存: $REPORT_DIR/ssl-cert.txt"

# 3. セキュリティヘッダー確認
echo "[3/8] セキュリティヘッダー確認..."
curl -I "$SITE_URL" > "$REPORT_DIR/headers.txt" 2>&1
if grep -q "X-Content-Type-Options" "$REPORT_DIR/headers.txt"; then
  echo "✅ セキュリティヘッダー検出"
else
  echo "⚠️  一部セキュリティヘッダー未設定"
fi

# 4. CDN確認
echo "[4/8] Cloudflare CDN確認..."
if grep -q "CF-Ray" "$REPORT_DIR/headers.txt"; then
  echo "✅ Cloudflare経由で配信"
else
  echo "❌ CDN未検出"
fi

# 5. 圧縮確認
echo "[5/8] 圧縮確認..."
ENCODING=$(curl -H "Accept-Encoding: gzip,deflate,br" -I "$SITE_URL" 2>/dev/null | grep -i "Content-Encoding")
if [[ "$ENCODING" == *"br"* ]] || [[ "$ENCODING" == *"gzip"* ]]; then
  echo "✅ 圧縮有効: $ENCODING"
else
  echo "⚠️  圧縮未検出"
fi

# 6. Lighthouse テスト
echo "[6/8] Lighthouse実行（時間がかかります）..."
npx lighthouse "$SITE_URL" \
  --output=json \
  --output=html \
  --output-path="$REPORT_DIR/lighthouse-report" \
  --chrome-flags="--headless" \
  --quiet 2>&1 | grep "Performance\|Accessibility\|Best Practices\|SEO"
echo "✅ Lighthouseレポート: $REPORT_DIR/lighthouse-report.html"

# 7. APIテスト（Newsletter）
echo "[7/8] Newsletter API テスト..."
API_RESPONSE=$(curl -X POST "$SITE_URL/api/newsletter/subscribe" \
  -H "Content-Type: application/json" \
  -d '{"email":"qa-test@example.com"}' \
  -s -w "\n%{http_code}")
API_STATUS=$(echo "$API_RESPONSE" | tail -1)
if [ "$API_STATUS" -eq 200 ]; then
  echo "✅ Newsletter API 正常 (HTTP $API_STATUS)"
else
  echo "⚠️  Newsletter API 異常 (HTTP $API_STATUS)"
fi

# 8. リダイレクトテスト
echo "[8/8] リダイレクトテスト..."
HTTP_REDIRECT=$(curl -I http://enablerdao.com 2>/dev/null | grep -i "Location")
if [[ "$HTTP_REDIRECT" == *"https"* ]]; then
  echo "✅ HTTP→HTTPS リダイレクト確認"
else
  echo "⚠️  HTTPリダイレクト未設定"
fi

echo "========================================="
echo "QA完了！レポート: $REPORT_DIR"
echo "========================================="
```

**実行方法**:
```bash
chmod +x deploy-qa.sh
./deploy-qa.sh
```

### Node.js版（Playwright使用）

```javascript
// qa-test.js
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('[1/5] ページロード確認...');
  await page.goto('https://enablerdao.com');
  const title = await page.title();
  console.log(`✅ Title: ${title}`);

  console.log('[2/5] CTAボタン確認...');
  const ctaButton = await page.locator('text=無料で始める').first();
  await ctaButton.click();
  await page.waitForTimeout(1000);
  console.log('✅ CTAクリック成功');

  console.log('[3/5] Newsletter フォーム確認...');
  await page.fill('input[type="email"]', 'test@example.com');
  await page.click('button:has-text("登録")');
  await page.waitForSelector('text=登録ありがとうございます', { timeout: 5000 });
  console.log('✅ Newsletter登録成功');

  console.log('[4/5] レスポンシブ確認...');
  await page.setViewportSize({ width: 375, height: 667 });
  await page.waitForTimeout(500);
  console.log('✅ モバイルビュー確認');

  console.log('[5/5] アクセシビリティ確認...');
  const violations = await page.evaluate(() => {
    // axe-core を使った検証（要インストール）
    return window.axe ? window.axe.run() : null;
  });
  if (violations && violations.violations.length === 0) {
    console.log('✅ アクセシビリティ問題なし');
  }

  await browser.close();
  console.log('========================================');
  console.log('QA完了！');
})();
```

---

## 不具合発見時の対応フロー

### 1. 問題の詳細記録

**記録すべき情報**:
- 発生時刻（JST）
- 影響範囲（全ユーザー / 特定ブラウザ / 特定地域）
- 再現手順
- スクリーンショット・動画
- エラーメッセージ（DevTools Console）
- Network リクエストログ

**記録場所**: GitHub Issues または内部Wikiに記録

### 2. Cloudflare Pagesログ確認

**確認手順**:
1. Cloudflare Dashboard → Pages → プロジェクト選択
2. "Functions" タブ → "Real-time Logs" 確認
3. デプロイログ確認（Build & Deployment タブ）
4. Analytics → Requests/Errors グラフ確認

**重点確認項目**:
- HTTP 5xx エラー率
- レスポンスタイム中央値
- 特定エンドポイントのエラー

### 3. ロールバック手順

**緊急時（本番障害）**:
```bash
# Cloudflare Pages CLI（wrangler）
npx wrangler pages deployment list --project-name=enablerdao
npx wrangler pages deployment rollback <DEPLOYMENT_ID>
```

**または Cloudflare Dashboard から**:
1. Pages → Deployments
2. 前回の正常デプロイを選択
3. "Rollback to this deployment" クリック

**ロールバック後の確認**:
- トップページアクセス確認
- Newsletter API動作確認
- Analytics でエラー率低下確認

### 4. 修正デプロイ手順

**ローカル修正**:
1. 問題のあるコードを修正
2. ローカルで動作確認（`npm run dev`）
3. テスト実行（`npm test`）
4. コミット・プッシュ

**自動デプロイ**:
```bash
git add .
git commit -m "fix: Newsletter登録エラー修正"
git push origin main
```

**手動デプロイ（Cloudflare Pages）**:
```bash
npx wrangler pages deploy ./dist --project-name=enablerdao
```

**デプロイ後の確認**:
- このチェックリストを再実行
- 特に問題が発生した項目を重点確認
- 24時間後に Analytics で異常値がないか確認

---

## 定期メンテナンス推奨項目

### 週次
- [ ] Cloudflare Analytics レビュー（トラフィック・エラー率）
- [ ] SSL証明書有効期限確認（Cloudflareが自動更新）

### 月次
- [ ] Lighthouse スコア測定・記録
- [ ] セキュリティヘッダー再確認
- [ ] 依存パッケージ更新（`npm outdated`）

### 四半期
- [ ] 全チェックリスト項目再実行
- [ ] ユーザーフィードバック反映
- [ ] パフォーマンス改善施策検討

---

## チェックリスト完了時の報告フォーマット

```markdown
## デプロイQA完了報告

**デプロイ日時**: 2026-02-14 15:30 JST
**デプロイID**: abcd1234
**URL**: https://enablerdao.com

### 結果サマリー
- ✅ 基本動作: 正常
- ✅ パフォーマンス: Lighthouse 95点
- ⚠️  セキュリティヘッダー: CSP未設定（Issue #123で対応予定）
- ✅ Newsletter API: 正常
- ✅ レスポンシブ: 全デバイスで正常

### 発見された問題
なし

### 次回改善項目
1. Content-Security-Policy ヘッダー追加
2. WebP画像への変換
3. Service Worker 導入検討

**QA担当**: @username
**承認**: @reviewer
```

---

## 参考資料

- [Cloudflare Pages ドキュメント](https://developers.cloudflare.com/pages/)
- [Web Vitals](https://web.dev/vitals/)
- [OWASP セキュリティヘッダー](https://owasp.org/www-project-secure-headers/)
- [Google SEO スターターガイド](https://developers.google.com/search/docs/beginner/seo-starter-guide)

---

**最終更新**: 2026-02-14
**メンテナンス担当**: EnablerDAO開発チーム
