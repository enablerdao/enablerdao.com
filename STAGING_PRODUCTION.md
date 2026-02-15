# ステージング/本番デプロイガイド

## 🎯 環境分離

| 環境 | Fly.io App | URL | 用途 |
|------|-----------|-----|------|
| **Staging** | enablerdao-staging | https://enablerdao-staging.fly.dev | 開発・テスト用 |
| **Production** | enablerdao | https://enablerdao.com | 本番環境 |

---

## 🚀 ステージング環境デプロイ

```bash
# ステージング環境にデプロイ
fly deploy -c fly-staging.toml

# ステージング環境を開く
fly open -a enablerdao-staging

# ステージング環境のログ確認
fly logs -a enablerdao-staging
```

### ステージング環境の特徴
- `NODE_ENV=staging` で起動
- メモリ256MB（本番512MBの半分）
- `min_machines_running=0`（アイドル時自動停止でコスト削減）
- URL: `https://enablerdao-staging.fly.dev`

---

## 🌍 本番環境デプロイ

```bash
# 本番環境にデプロイ
fly deploy -c fly.toml

# または単純に
fly deploy

# 本番環境を開く
fly open -a enablerdao

# 本番環境のログ確認
fly logs -a enablerdao
```

### 本番環境の特徴
- `NODE_ENV=production` で起動
- メモリ512MB
- `min_machines_running=1`（常に1台稼働）
- カスタムドメイン: `https://enablerdao.com`

---

## 📋 推奨ワークフロー

### 1. 機能開発
```bash
# ローカルで開発
npm run dev

# ローカルテスト
# ブラウザで http://localhost:3000 確認
```

### 2. ステージングデプロイ
```bash
# ステージング環境にデプロイ
fly deploy -c fly-staging.toml

# ステージング環境で動作確認
open https://enablerdao-staging.fly.dev
```

### 3. 本番デプロイ（マージ後）
```bash
# GitHubでPRマージ

# mainブランチをpull
git pull origin main

# 本番環境にデプロイ
fly deploy -c fly.toml
```

---

## 🔧 初回セットアップ

### ステージングアプリ作成（初回のみ）
```bash
# ステージングアプリを作成
fly apps create enablerdao-staging

# ステージングアプリにデプロイ
fly deploy -c fly-staging.toml

# カスタムドメイン設定（オプション）
fly certs add staging.enablerdao.com -a enablerdao-staging
```

---

## 🌐 環境変数設定

### ステージング環境
```bash
fly secrets set -a enablerdao-staging \
  RESEND_API_KEY="re_xxxxx" \
  NEXT_PUBLIC_GA_MEASUREMENT_ID="G-STAGING"
```

### 本番環境
```bash
fly secrets set -a enablerdao \
  RESEND_API_KEY="re_xxxxx" \
  NEXT_PUBLIC_GA_MEASUREMENT_ID="G-PROD"
```

---

## 📝 package.json更新

以下のスクリプトを `package.json` に追加すると便利です：

```json
{
  "scripts": {
    "deploy:staging": "fly deploy -c fly-staging.toml",
    "deploy:prod": "fly deploy -c fly.toml",
    "logs:staging": "fly logs -a enablerdao-staging",
    "logs:prod": "fly logs -a enablerdao",
    "open:staging": "fly open -a enablerdao-staging",
    "open:prod": "fly open -a enablerdao"
  }
}
```

使い方:
```bash
npm run deploy:staging  # ステージングデプロイ
npm run deploy:prod     # 本番デプロイ
npm run open:staging    # ステージング環境を開く
npm run logs:staging    # ステージングログ確認
```

---

## ✅ チェックリスト

### ステージングデプロイ前
- [ ] ローカルでビルドエラーなし (`npm run build`)
- [ ] ローカルで動作確認済み
- [ ] 新機能の簡易テスト完了

### 本番デプロイ前
- [ ] ステージング環境で動作確認済み
- [ ] 主要機能のテスト完了
- [ ] パフォーマンス確認済み
- [ ] GitHubにPRマージ済み

---

## 🚨 トラブルシューティング

### ステージング環境が起動しない
```bash
# ステータス確認
fly status -a enablerdao-staging

# マシンを強制起動
fly machine start -a enablerdao-staging
```

### デプロイ失敗時
```bash
# ログを確認
fly logs -a enablerdao-staging

# ビルドログ確認
fly deploy -c fly-staging.toml --verbose
```

---

**作成日**: 2026-02-14
**更新**: WorldMonitor統合、Wisbee削除、EBR詳細追加
