# Cloudflare Pages Deployment Guide

enablerdao.comをCloudflare Pagesにデプロイするための完全ガイド。

## 目次

1. [前提条件](#前提条件)
2. [Cloudflareアカウント準備](#cloudflareアカウント準備)
3. [プロジェクト作成（Dashboard）](#プロジェクト作成dashboard)
4. [環境変数設定](#環境変数設定)
5. [カスタムドメイン設定](#カスタムドメイン設定)
6. [デプロイ方法](#デプロイ方法)
7. [ローカル開発](#ローカル開発)
8. [トラブルシューティング](#トラブルシューティング)

---

## 前提条件

- Node.js 20.x以上
- npm または pnpm
- Cloudflareアカウント（無料プランで可）
- GitHubリポジトリ（推奨）
- Resend APIキー（メール送信用）

---

## Cloudflareアカウント準備

### 1. アカウント作成

1. [Cloudflare](https://dash.cloudflare.com/sign-up)にアクセス
2. メールアドレスとパスワードで登録
3. メールを確認してアカウントを有効化

### 2. Wrangler CLI インストール（オプション）

```bash
npm install -g wrangler
wrangler login
```

---

## プロジェクト作成（Dashboard）

### GitHub連携（推奨）

1. [Cloudflare Pages Dashboard](https://dash.cloudflare.com/?to=/:account/pages)にアクセス
2. **"Create application"** → **"Pages"** → **"Connect to Git"**
3. GitHubアカウントを連携
4. リポジトリ選択: `yukihamada/d-enablerdao` (または該当するリポジトリ)
5. ビルド設定:

   ```yaml
   Framework preset: Next.js
   Build command: npx @cloudflare/next-on-pages
   Build output directory: .vercel/output/static
   Root directory: (empty)
   Environment variables: (後で設定)
   ```

6. **"Save and Deploy"** をクリック

### CLI経由（代替方法）

```bash
# ビルド
npm run pages:build

# デプロイ
wrangler pages deploy .vercel/output/static \
  --project-name=enablerdao \
  --branch=main
```

---

## 環境変数設定

### Dashboard経由

1. Pages プロジェクト → **"Settings"** → **"Environment variables"**
2. 以下の変数を追加:

#### Production環境

| Variable Name | Value | Type |
|--------------|-------|------|
| `RESEND_API_KEY` | `re_xxxxxxxxxxxxxxxxxxxx` | Secret |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` | Plain text |
| `NEXT_PUBLIC_NEWSLETTER_ENABLED` | `true` | Plain text |
| `NODE_ENV` | `production` | Plain text |

#### Preview環境

同様の変数を設定（テスト用のAPIキーを使用推奨）

### CLI経由

```bash
# Secret変数の設定
wrangler pages secret put RESEND_API_KEY --project-name=enablerdao

# 通常の環境変数
wrangler pages secret put NEXT_PUBLIC_GA_MEASUREMENT_ID --project-name=enablerdao
```

---

## カスタムドメイン設定

### 1. ドメインをCloudflareに追加

1. Cloudflare Dashboard → **"Websites"** → **"Add a site"**
2. `enablerdao.com` を入力
3. ネームサーバーを変更（ドメインレジストラで設定）:
   ```
   NS1: xxxxxx.ns.cloudflare.com
   NS2: yyyyyy.ns.cloudflare.com
   ```

### 2. Pagesにカスタムドメイン追加

1. Pages プロジェクト → **"Custom domains"** → **"Set up a custom domain"**
2. ドメイン入力:
   - `enablerdao.com` (apex domain)
   - `www.enablerdao.com` (オプション)
3. DNS設定を確認（自動で追加される）:
   ```
   CNAME enablerdao.com → enablerdao.pages.dev
   CNAME www.enablerdao.com → enablerdao.pages.dev
   ```

### DNS設定例

Cloudflare DNS設定画面で以下を確認:

| Type | Name | Content | Proxy status |
|------|------|---------|--------------|
| CNAME | @ | enablerdao.pages.dev | Proxied |
| CNAME | www | enablerdao.pages.dev | Proxied |

**注意**: Apex domain (enablerdao.com) のCNAME Flatteningが有効になっていることを確認。

---

## デプロイ方法

### 自動デプロイ（GitHub連携）

- **main**ブランチへのpush → 本番デプロイ
- その他のブランチ → プレビューデプロイ

### 手動デプロイ（CLI）

#### 本番環境

```bash
# ビルド + デプロイ
npm run deploy

# または詳細指定
npx @cloudflare/next-on-pages
wrangler pages deploy .vercel/output/static \
  --project-name=enablerdao \
  --branch=main \
  --commit-dirty=true
```

#### プレビュー環境

```bash
wrangler pages deploy .vercel/output/static \
  --project-name=enablerdao \
  --branch=preview
```

### デプロイ確認

1. デプロイ完了後、URLをブラウザで開く:
   - 本番: `https://enablerdao.com`
   - プレビュー: `https://xxxxxx.enablerdao.pages.dev`

2. 確認項目:
   - [ ] ホームページが表示される
   - [ ] ニュースレター登録が動作する（テストメール送信）
   - [ ] 画像が正しく表示される
   - [ ] Google Analytics計測が動作する（GA4ダッシュボード確認）
   - [ ] セキュリティヘッダーが設定されている（DevTools Network確認）

---

## ローカル開発

### .dev.varsファイル作成

```bash
cp .dev.vars.example .dev.vars
```

`.dev.vars`を編集して環境変数を設定:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_NEWSLETTER_ENABLED=true
NODE_ENV=development
```

### 開発サーバー起動

#### Next.js標準開発サーバー（推奨）

```bash
npm run dev
# http://localhost:3000 で起動
```

#### Cloudflare Pages ローカルエミュレーター

```bash
# ビルドしてからプレビュー
npm run preview

# または直接
npm run cf:dev
```

### ローカルビルド確認

```bash
# Cloudflare Pages用ビルド
npm run pages:build

# 出力確認
ls -la .vercel/output/static
```

---

## トラブルシューティング

### 1. ビルドエラー: "Cannot find module '@cloudflare/next-on-pages'"

**原因**: `@cloudflare/next-on-pages`がインストールされていない

**解決方法**:
```bash
npm install -D @cloudflare/next-on-pages
```

### 2. デプロイエラー: "Environment variable RESEND_API_KEY is not set"

**原因**: 環境変数が設定されていない

**解決方法**:
1. Cloudflare Pages Dashboard → Settings → Environment variables
2. `RESEND_API_KEY`を追加（Secretタイプ）
3. 再デプロイ

### 3. カスタムドメインが機能しない

**原因**: DNS設定の反映待ち、またはSSL証明書発行中

**解決方法**:
1. DNS伝播を確認: [DNS Checker](https://dnschecker.org/)
2. SSL証明書発行を待つ（最大24時間）
3. Cloudflare Dashboard → SSL/TLS → Overview → "Full (strict)"に設定

### 4. 画像が表示されない

**原因**: Next.js Image Optimizationの設定ミス

**解決方法**:
`next.config.ts`に以下が設定されていることを確認:
```typescript
images: {
  unoptimized: true,
}
```

### 5. API Routesが動作しない（404エラー）

**原因**: Edge Runtime非対応の機能を使用している

**解決方法**:
API Routeファイルに以下を追加:
```typescript
export const runtime = 'edge';
```

### 6. ビルドサイズ制限エラー

**原因**: Cloudflare Pages無料プランの制限（25MB）を超過

**解決方法**:
1. 依存関係を削減
2. 画像を最適化（WebP、圧縮）
3. Dynamic Importsを活用
4. 不要なnode_modulesを除外

### 7. デプロイは成功するがページが真っ白

**原因**: JavaScriptエラー、または環境変数の不足

**解決方法**:
1. ブラウザのDevTools Consoleでエラーを確認
2. `NEXT_PUBLIC_`接頭辞付き環境変数が設定されているか確認
3. プレビューデプロイでテストしてから本番デプロイ

### 8. メール送信が失敗する

**原因**: Resend APIキーが無効、またはドメイン未認証

**解決方法**:
1. [Resend Dashboard](https://resend.com/domains)でドメイン認証状態を確認
2. APIキーが正しく設定されているか確認
3. Cloudflare Pagesの環境変数を再確認
4. ログを確認: Cloudflare Pages → Deployments → (最新デプロイ) → Functions logs

---

## パフォーマンス最適化

### Cloudflare CDN活用

- すべてのアセットが自動的にCloudflare CDNから配信される
- エッジロケーション300+で高速配信
- 無料プランでも無制限のリクエスト

### Analytics設定

1. Cloudflare Pages → Analytics → Web Analytics を有効化
2. Core Web Vitals（LCP, FID, CLS）をモニタリング
3. Google Analytics 4と併用して詳細分析

### キャッシュ設定

Cloudflare Dashboard → Caching → Configuration:
- Browser Cache TTL: **4 hours**（推奨）
- Always Online: **On**（オフライン時のキャッシュ表示）

---

## セキュリティ

### WAF（Web Application Firewall）

Cloudflare Dashboard → Security → WAF:
- Security Level: **Medium**（推奨）
- Challenge Passage: **30 minutes**

### SSL/TLS設定

Cloudflare Dashboard → SSL/TLS:
- SSL/TLS encryption mode: **Full (strict)**
- Minimum TLS Version: **TLS 1.2**
- Automatic HTTPS Rewrites: **On**

### DDoS対策

- Cloudflare DDoS保護が自動で有効（無料プラン含む）
- Rate Limiting: Pages プロジェクト → Settings → Rate limiting

---

## 料金

### 無料プラン

- 500ビルド/月
- 無制限のリクエスト
- 無制限の帯域幅
- 100 custom domains/project

### Proプラン ($20/月)

- 5,000ビルド/月
- より高度なビルド設定
- Priority support

**enablerdao.comは無料プランで十分運用可能**

---

## 参考リンク

- [Cloudflare Pages公式ドキュメント](https://developers.cloudflare.com/pages/)
- [@cloudflare/next-on-pages GitHub](https://github.com/cloudflare/next-on-pages)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Resend Documentation](https://resend.com/docs)
- [Cloudflare Workers & Pages Discord](https://discord.gg/cloudflaredev)

---

## サポート

問題が発生した場合:

1. このドキュメントのトラブルシューティングセクションを確認
2. Cloudflare Pages ログを確認
3. [Cloudflare Community](https://community.cloudflare.com/)で質問
4. GitHub Issuesで報告（リポジトリの問題の場合）

---

**Last Updated**: 2026-02-14
**Author**: Yuki Hamada
**Project**: enablerdao.com
