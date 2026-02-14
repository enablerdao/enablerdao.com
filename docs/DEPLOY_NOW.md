# Cloudflare Pages デプロイガイド

**初回デプロイ完全版 - コピペで即実行可能**

所要時間: 10-15分（カスタムドメイン設定含む）

---

## 1. デプロイ前最終確認（1分）

### チェックリスト

- [ ] ビルドが成功している（`.vercel/output/static`ディレクトリ存在確認）
- [ ] 全APIルートにEdge Runtime設定済み（`export const runtime = 'edge'`）
- [ ] 環境変数の準備完了（RESEND_API_KEY等）
- [ ] GitHubにpush済み（または準備完了）
- [ ] Node.js 18以上がインストール済み

### 確認コマンド

```bash
# ビルド成果物の確認
ls -la .vercel/output/static

# ビルドサイズ確認（1MB以下が理想）
du -sh .vercel/output/static

# Git状態確認
git status
git log --oneline -3
```

---

## 2. デプロイ方法（2つの選択肢）

### 方法A: Cloudflare Dashboard（推奨・初回）

**所要時間: 5分**

#### Step 1: プロジェクト作成

1. https://dash.cloudflare.com にアクセス
2. **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
3. GitHub連携を承認（初回のみ）
4. リポジトリ選択: `yukihamada/d-enablerdao`

#### Step 2: ビルド設定

```
Project name: enablerdao
Production branch: main
Build command: npx @cloudflare/next-on-pages
Build output directory: .vercel/output/static
Root directory: (empty)
```

#### Step 3: 環境変数設定

**Environment variables** セクションで以下を追加:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `RESEND_API_KEY` | `re_xxxxx...` | Production |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` | Production |
| `NODE_VERSION` | `18` | Production |

#### Step 4: デプロイ実行

1. **Save and Deploy** クリック
2. ビルドログ確認（2-3分）
3. デプロイURL取得: `https://enablerdao.pages.dev`

---

### 方法B: Wrangler CLI（上級者向け・自動化）

**所要時間: 3分**

#### Step 1: Wranglerインストール & ログイン

```bash
# Wranglerログイン（ブラウザが開く）
npx wrangler login

# ログイン確認
npx wrangler whoami
```

#### Step 2: プロジェクト作成

```bash
# 新規プロジェクト作成
npx wrangler pages project create enablerdao

# 確認メッセージが表示される
# Production branch: main
# Preview branch: (all other branches)
```

#### Step 3: デプロイ実行

```bash
# package.jsonのスクリプト使用
npm run deploy

# または直接実行
npx wrangler pages deploy .vercel/output/static \
  --project-name=enablerdao \
  --branch=main

# デプロイ成功時の出力例:
# ✨ Success! Uploaded 42 files (1.2 MiB)
# ✨ Deployment complete! Take a peek over at https://abc123.enablerdao.pages.dev
```

#### Step 4: 環境変数設定（CLI経由）

```bash
# 本番環境に環境変数を追加
npx wrangler pages secret put RESEND_API_KEY --env=production
# 入力プロンプトが表示される → API Keyを貼り付け

npx wrangler pages secret put NEXT_PUBLIC_GA_MEASUREMENT_ID --env=production
# 入力プロンプトが表示される → GA IDを貼り付け

# 環境変数一覧確認
npx wrangler pages secret list --env=production
```

---

## 3. デプロイ後の即時確認（2分）

### チェックリスト

- [ ] トップページが表示される
- [ ] API エンドポイントが動作する
- [ ] 静的アセット（CSS/JS/画像）が読み込まれる
- [ ] レスポンス速度が200ms以下

### 確認コマンド

```bash
# 1. HTTPステータス確認（200 OKを期待）
curl -I https://enablerdao.pages.dev

# 2. トップページHTML取得
curl https://enablerdao.pages.dev | head -50

# 3. Newsletter API動作確認（400 Bad Requestまたは200を期待）
curl -X POST https://enablerdao.pages.dev/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}' \
  -w "\nHTTP Status: %{http_code}\n"

# 4. レスポンス時間測定
curl -o /dev/null -s -w "Total time: %{time_total}s\n" https://enablerdao.pages.dev

# 5. Lighthouse簡易測定（Performance 90+を目指す）
npx lighthouse https://enablerdao.pages.dev \
  --only-categories=performance \
  --preset=desktop \
  --quiet \
  --chrome-flags="--headless"
```

### ブラウザ確認

1. https://enablerdao.pages.dev を開く
2. DevTools → Network タブ → ページリロード
3. 確認項目:
   - 全リソースが200 OK
   - Total Load Time < 2秒
   - First Contentful Paint < 1秒
   - Console にエラーなし

---

## 4. カスタムドメイン設定（5分）

### Cloudflare Dashboard経由

#### Step 1: ドメイン追加

1. Cloudflare Dashboard → **Pages** → `enablerdao` → **Custom domains**
2. **Set up a custom domain** クリック
3. ドメイン入力: `enablerdao.com`
4. **Activate domain** クリック

#### Step 2: DNS設定

**自動設定（Cloudflareでドメイン管理している場合）:**
- 自動でCNAMEレコードが追加される
- 数分で反映

**手動設定（外部DNSの場合）:**

```
Type: CNAME
Name: @ (or enablerdao.com)
Value: enablerdao.pages.dev
Proxy: Yes (orange cloud)
TTL: Auto
```

```
Type: CNAME
Name: www
Value: enablerdao.pages.dev
Proxy: Yes (orange cloud)
TTL: Auto
```

#### Step 3: SSL証明書発行待ち

- 自動発行: 2-5分
- ステータス確認: Custom domains → `enablerdao.com` → **Active** 表示を確認

#### Step 4: 動作確認

```bash
# DNS反映確認
dig enablerdao.com +short
# → Cloudflare IPアドレスが返る

# HTTPS動作確認
curl -I https://enablerdao.com
# → HTTP/2 200 OK

# リダイレクト確認
curl -I http://enablerdao.com
# → 301 Moved Permanently → https://enablerdao.com
```

---

## 5. トラブルシューティング

### よくあるエラーと解決策

#### ビルド失敗

**エラー例:**
```
Error: Build failed with exit code 1
```

**解決策:**
```bash
# ローカルでビルド確認
npm run pages:build

# Node.jsバージョン確認（18以上必須）
node -v

# 依存関係再インストール
rm -rf node_modules package-lock.json
npm install
npm run pages:build
```

#### 環境変数未反映

**症状:** APIが500エラー、機能が動作しない

**解決策:**
```bash
# 環境変数確認
npx wrangler pages secret list --env=production

# 再設定
npx wrangler pages secret put RESEND_API_KEY --env=production

# 再デプロイ（環境変数変更後は必須）
npx wrangler pages deploy .vercel/output/static --project-name=enablerdao
```

#### DNS未反映

**症状:** `enablerdao.com` にアクセスできない

**解決策:**
```bash
# DNS伝播確認（複数地域から）
curl https://dns.google/resolve?name=enablerdao.com&type=A

# キャッシュクリア
# Chrome: Ctrl+Shift+R
# Safari: Cmd+Option+R

# 待機時間: 通常5分、最大48時間
```

#### 404エラー（ルーティング問題）

**症状:** `/about` などが404

**解決策:**
```bash
# _routes.json確認
cat .vercel/output/static/_routes.json

# 再ビルド
npm run pages:build

# デプロイ
npx wrangler pages deploy .vercel/output/static --project-name=enablerdao
```

---

## 6. 次のステップ

### デプロイ完了後のチェックリスト

- [ ] `POST_DEPLOY_CHECKLIST.md` で全項目確認
- [ ] Google Analytics動作確認（リアルタイムレポート）
- [ ] Newsletter送信テスト（実際のメールアドレスで）
- [ ] パフォーマンス測定（Lighthouse 全カテゴリー）
- [ ] SEO確認（meta tags, sitemap.xml）
- [ ] アクセシビリティ確認（WCAG 2.1 AA）
- [ ] チーム共有・アナウンス

### 推奨設定

```bash
# 1. Google Analytics確認
# → https://analytics.google.com → リアルタイム → 1 active user確認

# 2. Newsletter機能テスト
curl -X POST https://enablerdao.pages.dev/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"your-real-email@example.com"}'
# → メール受信確認

# 3. Lighthouse全カテゴリー測定
npx lighthouse https://enablerdao.pages.dev \
  --output=html \
  --output-path=./lighthouse-report.html \
  --view

# 4. セキュリティヘッダー確認
curl -I https://enablerdao.pages.dev | grep -E "(X-|Content-Security)"
```

---

## 7. ロールバック手順（万が一のため）

### Cloudflare Dashboard経由

1. **Workers & Pages** → `enablerdao` → **Deployments**
2. 前バージョンを探す（タイムスタンプで確認）
3. **...** メニュー → **Rollback to this deployment**
4. 確認ダイアログで **Rollback** クリック

### Wrangler CLI経由

```bash
# デプロイ履歴確認
npx wrangler pages deployment list --project-name=enablerdao

# 出力例:
# ID                                Created At           Environment
# abc123def456                      2024-01-15 10:30     production
# xyz789uvw012                      2024-01-15 09:00     production

# 特定バージョンに切り替え（プロモート）
npx wrangler pages deployment tail abc123def456

# または前バージョンを再デプロイ
git checkout <previous-commit-hash>
npm run pages:build
npx wrangler pages deploy .vercel/output/static --project-name=enablerdao
```

---

## 8. 監視設定

### Cloudflare Analytics有効化

1. **Workers & Pages** → `enablerdao` → **Analytics**
2. Web Analytics 有効化（自動）
3. 確認項目:
   - Page views
   - Unique visitors
   - Response time
   - Error rate

### Uptime監視設定（推奨: UptimeRobot）

```
Monitor Type: HTTPS
URL: https://enablerdao.pages.dev
Monitoring Interval: 5 minutes
Alert Contacts: your-email@example.com
```

### エラーアラート設定

```bash
# Cloudflare Workers Analytics API経由（上級者向け）
# https://developers.cloudflare.com/analytics/graphql-api/

# または Sentry統合
# https://sentry.io/for/cloudflare-workers/
```

---

## 9. 連絡先・サポート

### トラブル発生時

- **Cloudflare Docs**: https://developers.cloudflare.com/pages/
- **Community Discord**: https://discord.cloudflare.com
- **GitHub Issues**: https://github.com/cloudflare/next-on-pages/issues
- **プロジェクト管理者**: Yuki Hamada

### 緊急連絡先

```
# プロジェクトステータス確認
https://www.cloudflarestatus.com

# Cloudflare Support（有料プラン）
https://dash.cloudflare.com/?to=/:account/support
```

---

## 10. デプロイチェックシート（印刷用）

```
[ ] 1. ビルド成功確認
[ ] 2. 環境変数設定完了
[ ] 3. GitHub push完了
[ ] 4. Cloudflare ログイン
[ ] 5. プロジェクト作成
[ ] 6. ビルド設定入力
[ ] 7. デプロイ実行
[ ] 8. デプロイURL確認
[ ] 9. トップページ表示確認
[ ] 10. API動作確認
[ ] 11. Lighthouse測定（90+）
[ ] 12. カスタムドメイン設定
[ ] 13. DNS反映確認
[ ] 14. SSL証明書確認
[ ] 15. Google Analytics確認
[ ] 16. Newsletter テスト
[ ] 17. POST_DEPLOY_CHECKLIST.md 実行
[ ] 18. チーム共有
[ ] 19. 監視設定
[ ] 20. ドキュメント更新
```

---

**最終更新**: 2026-02-14
**所要時間**: 初回 15分、2回目以降 3分
**難易度**: 初級（Dashboard）/ 中級（CLI）

デプロイ成功を祈ります！
