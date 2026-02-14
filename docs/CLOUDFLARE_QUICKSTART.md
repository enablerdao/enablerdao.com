# Cloudflare Pages クイックスタート

enablerdao.comを5分でデプロイする最短手順。

## 1. 前提条件チェック

```bash
# Node.js バージョン確認
node -v  # v20.x 以上

# リポジトリ確認
git remote -v
```

## 2. 依存関係インストール

```bash
# @cloudflare/next-on-pages をインストール
npm install -D @cloudflare/next-on-pages wrangler

# または
pnpm add -D @cloudflare/next-on-pages wrangler
```

## 3. ローカルビルドテスト

```bash
# Cloudflare Pages用にビルド
npm run pages:build

# 成功すると .vercel/output/static/ が生成される
ls -la .vercel/output/static
```

## 4. Cloudflare Pages プロジェクト作成

### GitHub連携（推奨）

1. [Cloudflare Pages Dashboard](https://dash.cloudflare.com)にアクセス
2. **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
3. GitHubリポジトリを選択
4. ビルド設定:
   ```
   Framework preset: Next.js
   Build command: npx @cloudflare/next-on-pages
   Build output directory: .vercel/output/static
   ```

### CLI経由（代替）

```bash
# Wrangler ログイン
wrangler login

# デプロイ
npm run deploy
```

## 5. 環境変数設定

Cloudflare Pages Dashboard → Settings → Environment variables:

```bash
# Production環境
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_NEWSLETTER_ENABLED=true
NODE_ENV=production
```

**重要**: `RESEND_API_KEY`は「Secret」タイプで追加

## 6. カスタムドメイン設定

1. Cloudflare Pages → Custom domains → **Set up a custom domain**
2. `enablerdao.com` を入力
3. DNS設定を確認（自動で追加される）

## 7. デプロイ確認

```bash
# デプロイURL確認
# Production: https://enablerdao.pages.dev
# Custom domain: https://enablerdao.com

# ローカルプレビュー
npm run preview
```

## トラブルシューティング

### ビルドエラー

```bash
# キャッシュクリア
rm -rf .next .vercel node_modules
npm install
npm run pages:build
```

### 環境変数が反映されない

1. Cloudflare Pages → Settings → Environment variables
2. 変数を再設定
3. **Retry deployment** をクリック

### カスタムドメインが機能しない

```bash
# DNS伝播確認
dig enablerdao.com

# 24時間待ってSSL証明書発行完了を確認
```

## 次のステップ

詳細なデプロイガイド: [DEPLOY_CLOUDFLARE.md](./DEPLOY_CLOUDFLARE.md)

---

**所要時間**: 5-10分（DNS伝播を除く）
