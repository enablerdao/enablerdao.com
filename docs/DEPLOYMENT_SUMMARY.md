# Cloudflare Pages デプロイ設定 - 完了サマリー

## 作成したファイル

### 1. Cloudflare Pages設定

#### `/Users/yuki/workspace/savejapan/d-enablerdao/wrangler.toml`
- Cloudflare Pages用の設定ファイル
- プロジェクト名: `enablerdao`
- ビルドコマンド: `npm run build`
- 出力ディレクトリ: `.vercel/output/static`
- Production/Preview環境の設定

#### `/Users/yuki/workspace/savejapan/d-enablerdao/.dev.vars.example`
- ローカル開発用環境変数のテンプレート
- 必要な環境変数:
  - `RESEND_API_KEY` (メール送信)
  - `NEXT_PUBLIC_GA_MEASUREMENT_ID` (Google Analytics)
  - `NEXT_PUBLIC_NEWSLETTER_ENABLED` (ニュースレター機能)

### 2. GitHub Actions CI/CD

#### `/Users/yuki/workspace/savejapan/d-enablerdao/.github/workflows/cloudflare-pages.yml`
- 自動デプロイワークフロー
- トリガー:
  - `main` / `develop` ブランチへのpush
  - `main` へのPull Request
- 必要なGitHub Secrets:
  - `CLOUDFLARE_API_TOKEN`
  - `CLOUDFLARE_ACCOUNT_ID`

### 3. ドキュメント

#### `/Users/yuki/workspace/savejapan/d-enablerdao/docs/DEPLOY_CLOUDFLARE.md` (10KB)
- 完全なデプロイガイド
- カスタムドメイン設定
- トラブルシューティング
- セキュリティ・パフォーマンス最適化

#### `/Users/yuki/workspace/savejapan/d-enablerdao/docs/CLOUDFLARE_QUICKSTART.md` (2.5KB)
- 5分で完了するクイックスタート
- 最小限の手順でデプロイ

#### `/Users/yuki/workspace/savejapan/d-enablerdao/docs/GITHUB_ACTIONS_SETUP.md` (4.7KB)
- GitHub Actions自動デプロイのセットアップ
- API Token取得方法
- ブランチ戦略

### 4. package.json スクリプト

追加されたスクリプト:
```json
{
  "pages:build": "npx @cloudflare/next-on-pages",
  "preview": "npm run pages:build && wrangler pages dev",
  "deploy": "npm run pages:build && wrangler pages deploy",
  "cf:dev": "wrangler pages dev .vercel/output/static --compatibility-date=2024-01-01"
}
```

### 5. Next.js設定の調整

#### `/Users/yuki/workspace/savejapan/d-enablerdao/next.config.ts`
- コメント追加: Cloudflare Pages互換性の説明

#### API Routes (Edge Runtime対応)
以下のルートに `export const runtime = 'edge';` を追加:
- ✅ `/api/newsletter/subscribe/route.ts`
- ✅ `/api/verify/domain/check/route.ts`
- ✅ `/api/verify/github/check/route.ts`
- ✅ `/api/verify/email/send/route.ts`
- ✅ `/api/verify/email/confirm/route.ts`

#### Node.js Runtime必須ルート (Edge Runtime無効)
以下のルートはNode.js APIを使用するため、Edge Runtime無効化 + コメント追加:
- ⚠️ `/api/email/webhook/route.ts` (crypto module)
- ⚠️ `/api/qa/route.ts` (fs module via qa-store.ts)
- ⚠️ `/api/qa/[id]/answer/route.ts` (fs module via qa-store.ts)

### 6. .gitignore更新

Cloudflare関連ファイルを除外:
```gitignore
# Cloudflare
.dev.vars
.wrangler/
wrangler.toml.backup
```

### 7. README.md更新

- EnablerDAOプロジェクトの説明
- Cloudflare Pagesデプロイ手順
- プロジェクト構造
- ドキュメントへのリンク

---

## デプロイ手順（概要）

### 必須: 依存関係インストール

```bash
npm install -D @cloudflare/next-on-pages wrangler
```

### 方法1: GitHub連携（推奨）

1. Cloudflare Pages Dashboardでリポジトリ連携
2. ビルド設定:
   - Framework: Next.js
   - Build command: `npx @cloudflare/next-on-pages`
   - Output: `.vercel/output/static`
3. 環境変数設定
4. `main`ブランチにpushで自動デプロイ

### 方法2: CLI経由

```bash
wrangler login
npm run deploy
```

---

## Edge Runtime制限事項

Cloudflare Pages (Edge Runtime) では以下のNode.js APIが利用不可:

### 現在の制限

1. **crypto module** (`/api/email/webhook`)
   - Web Crypto APIへの移行が必要
   - または署名検証を無効化（セキュリティリスク）

2. **fs module** (`/api/qa/*`)
   - Cloudflare KV / D1 / Supabaseへの移行が必要
   - または該当ルートのみLambda/Vercel Functionsで実行

### 対応オプション

#### オプション1: 外部ストレージへ移行（推奨）
- QA機能 → Cloudflare D1 / Supabase
- Webhook署名検証 → Web Crypto API

#### オプション2: ハイブリッドデプロイ
- メインサイト → Cloudflare Pages (Edge)
- Node.js必須API → AWS Lambda / Vercel Functions

#### オプション3: 機能無効化
- 該当機能を一時的に無効化してデプロイ
- 後で外部ストレージ版を実装

---

## 料金

### Cloudflare Pages 無料プラン
- ✅ 500ビルド/月
- ✅ 無制限リクエスト
- ✅ 無制限帯域幅
- ✅ 100カスタムドメイン
- ✅ DDoS保護
- ✅ CDN (300+エッジロケーション)

**enablerdao.comは無料プランで運用可能**

---

## 次のステップ

### 1. ローカルビルドテスト

```bash
npm run pages:build
```

### 2. Cloudflare Pages プロジェクト作成

[CLOUDFLARE_QUICKSTART.md](./CLOUDFLARE_QUICKSTART.md) を参照

### 3. GitHub Actions設定

[GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md) を参照

### 4. カスタムドメイン設定

[DEPLOY_CLOUDFLARE.md](./DEPLOY_CLOUDFLARE.md#カスタムドメイン設定) を参照

### 5. Edge Runtime対応 (オプション)

- `/api/email/webhook` → Web Crypto API移行
- `/api/qa/*` → Cloudflare D1 / Supabase移行

---

## 確認済み事項

- ✅ Next.js 16.1.6ビルド成功
- ✅ `output: "standalone"` 設定済み
- ✅ `images.unoptimized: true` 設定済み (Cloudflare必須)
- ✅ セキュリティヘッダー設定済み (CSP, HSTS, X-Frame-Options)
- ✅ Edge Runtime対応API Routes (5/8)
- ⚠️ Node.js Runtime必須API Routes (3/8) - 代替実装または移行が必要

---

## サポート

問題が発生した場合:
1. [DEPLOY_CLOUDFLARE.md](./DEPLOY_CLOUDFLARE.md) のトラブルシューティングを確認
2. Cloudflare Pages ログを確認
3. [Cloudflare Community](https://community.cloudflare.com/)

---

**作成日**: 2026-02-14
**プロジェクト**: enablerdao.com
**デプロイ先**: Cloudflare Pages
