# Cloudflare Pages セットアップ手順書

このドキュメントでは、enablerdaoプロジェクトをCloudflare PagesにGitHub連携でデプロイする詳細な手順を説明します。

## 前提条件

- [ ] GitHubアカウント（yukihamada/d-enablerdaoリポジトリへのアクセス権）
- [ ] Cloudflareアカウント（未作成の場合は手順1で作成）
- [ ] Resend APIキー（Newsletter機能用）
- [ ] Google Analytics測定ID（アナリティクス用、オプション）

---

## 1. Cloudflareダッシュボードアクセス

### 1-1. Cloudflareにアクセス

1. ブラウザで https://dash.cloudflare.com/ にアクセス
2. 既存アカウントがある場合: 「Log in」をクリックしてログイン
3. 新規の場合: 「Sign Up」をクリック

### 1-2. 新規サインアップ手順（初めての場合）

1. メールアドレスとパスワードを入力
2. メール認証リンクをクリックして確認
3. プラン選択画面で「Free」プランを選択
4. ダッシュボードにリダイレクトされる

### 1-3. Pages画面への移動

1. 左サイドバーから「Workers & Pages」をクリック
2. 「Create application」ボタンをクリック
3. 「Pages」タブを選択

---

## 2. GitHub連携設定

### 2-1. Git接続の開始

1. 「Connect to Git」ボタンをクリック
2. プロバイダー選択画面で「GitHub」を選択

### 2-2. GitHub認証

1. GitHubのOAuth認証画面が表示される
2. 「Authorize Cloudflare-Pages」ボタンをクリック
3. パスワード再入力を求められた場合は入力

### 2-3. リポジトリアクセス許可

1. 組織/個人アカウント選択画面で「yukihamada」を選択
2. リポジトリアクセス設定:
   - 「Only select repositories」を選択
   - ドロップダウンから「d-enablerdao」を選択
   - 「Install & Authorize」をクリック

### 2-4. リポジトリ選択

1. Cloudflareダッシュボードに戻る
2. リポジトリ一覧から「yukihamada/d-enablerdao」を選択
3. 「Begin setup」ボタンをクリック

---

## 3. ビルド設定（重要）

この設定が最も重要です。Next.js on Pagesに最適化された設定を使用します。

### 3-1. プロジェクト基本設定

```
Project name: enablerdao
Production branch: main
```

**注意**: Project nameはURLの一部になります（例: enablerdao.pages.dev）。後から変更できません。

### 3-2. ビルド設定

「Build settings」セクションで以下を入力:

```
Framework preset: Next.js (Static HTML Export)
```

ドロップダウンから「Next.js」を選択すると、以下のデフォルト値が自動入力されます。**これらを以下の値に変更してください:**

```
Build command: npx @cloudflare/next-on-pages
Build output directory: .vercel/output/static
Root directory: (空欄のまま)
```

### 3-3. ビルド設定の詳細説明

| 項目 | 値 | 理由 |
|------|-----|------|
| Build command | `npx @cloudflare/next-on-pages` | Cloudflare Pages用のNext.js最適化ビルダーを使用 |
| Build output directory | `.vercel/output/static` | @cloudflare/next-on-pagesの出力先 |
| Root directory | (空欄) | リポジトリルートがプロジェクトルート |

**重要**: `next build`や`next export`は使用しません。Cloudflare Edge Functions対応のため`@cloudflare/next-on-pages`を使用します。

---

## 4. 環境変数設定

### 4-1. Production環境変数

「Environment variables」セクションで「Add variable」をクリックし、以下を**1つずつ**追加:

```bash
# 必須: Resend API キー（Newsletter機能用）
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx

# オプション: Google Analytics測定ID
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# 機能フラグ: Newsletter有効化
NEXT_PUBLIC_NEWSLETTER_ENABLED=true

# Node.jsバージョン指定
NODE_VERSION=20
```

### 4-2. 環境変数の入力方法

各変数ごとに:
1. 「Variable name」に変数名を入力（例: `RESEND_API_KEY`）
2. 「Value」に実際の値を入力
3. 「Environment」で「Production」を選択
4. 「Add variable」をクリック
5. 次の変数を追加

### 4-3. Preview環境変数（オプションだが推奨）

同じ変数をPreview環境にも追加する場合:
1. 各変数の「Add variable」時に「Environment」で「Preview」も選択
2. または、後から「Environment variables」ページで「Add variable」→「Preview」を選択して追加

**推奨設定**: ProductionとPreviewで同じ値を使用（本番環境でのテストを容易にするため）

---

## 5. 初回デプロイ

### 5-1. デプロイ開始

1. すべての設定を確認
2. 「Save and Deploy」ボタンをクリック
3. ビルドが開始される（通常2〜5分）

### 5-2. ビルドログの確認

デプロイ中の画面で:
1. リアルタイムでビルドログが表示される
2. 各ステップ（Clone, Build, Deploy）の進捗を確認
3. エラーが発生した場合は赤文字で表示される

**ビルドログの見方:**
```
✓ Cloning repository
✓ Installing dependencies
✓ Building application
✓ Deploying to Cloudflare's network
```

### 5-3. デプロイ完了の確認

1. 「Success!」メッセージが表示される
2. デプロイURL（`https://enablerdao.pages.dev`）が表示される
3. 「Visit site」ボタンをクリックして動作確認

### 5-4. 初回デプロイでの注意点

- 初回は依存関係のインストールに時間がかかる（3〜5分）
- 2回目以降はキャッシュにより1〜2分に短縮
- ビルドエラーが出た場合は「Retry deployment」で再試行

---

## 6. カスタムドメイン設定

### 6-1. カスタムドメインの追加

1. プロジェクトページで「Custom domains」タブをクリック
2. 「Set up a custom domain」ボタンをクリック
3. ドメイン入力欄に `enablerdao.com` を入力
4. 「Continue」をクリック

### 6-2. DNS設定手順（Cloudflare DNS使用の場合）

Cloudflare DNS経由でドメインを管理している場合:

1. 自動的にCNAMEレコードが追加される
2. 「Activate domain」ボタンをクリック
3. SSL証明書の発行が自動的に開始される（5〜10分）

**自動追加されるDNSレコード:**
```
Type: CNAME
Name: enablerdao.com
Target: enablerdao.pages.dev
Proxy: Proxied (オレンジクラウドON)
```

### 6-3. 外部DNSプロバイダー使用の場合

Cloudflare以外でDNSを管理している場合:

1. DNSプロバイダーの管理画面にアクセス
2. 以下のCNAMEレコードを追加:
```
Type: CNAME
Name: @ (またはenablerdao.com)
Value: enablerdao.pages.dev
TTL: Auto (または3600)
```
3. 変更が反映されるまで待機（最大48時間、通常は数分〜1時間）
4. Cloudflareダッシュボードに戻り「Check DNS」をクリック

### 6-4. SSL証明書の確認

1. 「Custom domains」タブで証明書ステータスを確認
2. 「Active」と表示されればSSL有効化完了
3. ブラウザで `https://enablerdao.com` にアクセスして確認

**証明書発行の流れ:**
- Pending → Initializing → Active（通常5〜10分）
- エラーが出た場合は「Retry」ボタンで再試行

### 6-5. www サブドメインの追加（オプション）

`www.enablerdao.com` も追加する場合:
1. 「Add a custom domain」をクリック
2. `www.enablerdao.com` を入力
3. 同様の手順でDNS設定とSSL証明書発行

---

## 7. 設定最適化

### 7-1. Functions設定（Edge Functions有効化）

1. 「Settings」タブをクリック
2. 「Functions」セクションを展開
3. 以下を確認/設定:

```
Compatibility Date: (最新の日付を選択)
Compatibility Flags: (空欄でOK)
```

**Edge Functionsの利点:**
- サーバーサイドロジックをエッジで実行
- API Routes (`/api/*`) がグローバルに高速化
- Newsletter送信処理が高速化

### 7-2. プレビューデプロイ設定

1. 「Settings」→「Builds & deployments」
2. 「Branch deployments」セクション:

```
☑ Enable preview deployments for all branches
Production branch: main
```

**設定の意味:**
- PRごとに自動プレビューURL生成（例: `feat-123.enablerdao.pages.dev`）
- mainブランチへのマージ前にテスト可能

### 7-3. Build設定の確認

「Builds & deployments」→「Build configuration」で確認:

```
Build command: npx @cloudflare/next-on-pages
Build output directory: .vercel/output/static
Root directory: (None)
Node version: 20
```

変更が必要な場合は「Configure build settings」で編集可能。

### 7-4. Webhooks設定（オプション）

Slackやメール通知を受け取る場合:

1. 「Settings」→「Notifications」
2. 「Add webhook」をクリック
3. Webhook URL（Slack Incoming Webhookなど）を入力
4. イベント選択:
   - ☑ Deployment started
   - ☑ Deployment success
   - ☑ Deployment failed

---

## 8. 動作確認チェックリスト

デプロイ完了後、以下を順番に確認してください。

### 8-1. 基本表示確認

- [ ] トップページ（`/`）が正しく表示される
- [ ] ヒーローセクションの画像・テキストが表示される
- [ ] ナビゲーションメニューが表示される
- [ ] フッターが表示される

### 8-2. Newsletter機能確認

- [ ] Newsletter登録フォームが表示される
- [ ] メールアドレスを入力できる
- [ ] 「Subscribe」ボタンをクリックできる
- [ ] 送信後にサクセスメッセージが表示される
- [ ] Resendダッシュボードでメールが送信されている

**テスト手順:**
1. 自分のメールアドレスを入力
2. 送信
3. Resendダッシュボード（https://resend.com/emails）でメール確認

### 8-3. プロダクトカードCTA動作

- [ ] 「TEIKAN」カードの「Coming Soon」ボタンが表示される
- [ ] 「D-ECOS」カードの「Learn More」ボタンが表示される
- [ ] ボタンクリックで正しいアクションが発生する

### 8-4. ヒーローCTAスムーズスクロール

- [ ] 「Join Our Community」ボタンをクリック
- [ ] Newsletterセクションまでスムーズにスクロールする
- [ ] フォーカスがメール入力欄に移動する

### 8-5. Google Analytics動作確認

**Chrome DevToolsでの確認手順:**
1. ページを開く
2. F12でDevToolsを開く
3. 「Network」タブを選択
4. フィルターに「google-analytics」を入力
5. ページリロード
6. `collect?v=2&...` リクエストが表示されればOK

または:
1. Chrome拡張「Google Analytics Debugger」をインストール
2. 拡張を有効化してページアクセス
3. コンソールにGA4イベントログが表示される

- [ ] GA4の計測タグが読み込まれている
- [ ] ページビューイベントが送信されている

### 8-6. レスポンシブ表示確認

DevToolsで以下のデバイスサイズをテスト:

**モバイル（375px × 667px - iPhone SE）:**
- [ ] ナビゲーションがハンバーガーメニューになる
- [ ] プロダクトカードが縦1列に並ぶ
- [ ] テキストが読みやすいサイズで表示される
- [ ] 画像が適切にリサイズされる

**タブレット（768px × 1024px - iPad）:**
- [ ] プロダクトカードが2列に並ぶ
- [ ] 余白が適切に表示される

**デスクトップ（1920px × 1080px）:**
- [ ] プロダクトカードが横並びに表示される
- [ ] ヒーローセクションが画面幅いっぱいに表示される
- [ ] 最大コンテンツ幅が適切に制限される（max-w-7xl）

### 8-7. パフォーマンス確認

Lighthouse（DevTools内）でスコア確認:
1. DevToolsの「Lighthouse」タブを開く
2. 「Mobile」を選択
3. 「Analyze page load」をクリック

**目標スコア:**
- [ ] Performance: 90以上
- [ ] Accessibility: 95以上
- [ ] Best Practices: 95以上
- [ ] SEO: 100

---

## 9. GitHub Actions連携（オプション）

Cloudflare Pagesは自動的にGitHubのpushを検知してデプロイしますが、追加のCI/CDパイプラインを設定することも可能です。

### 9-1. GitHub Actionsワークフロー有効化

リポジトリに `.github/workflows/cloudflare-pages.yml` を作成:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npx @cloudflare/next-on-pages

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: enablerdao
          directory: .vercel/output/static
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

### 9-2. Cloudflare APIトークン取得

1. Cloudflareダッシュボード → 右上のプロフィール → 「My Profile」
2. 「API Tokens」タブ
3. 「Create Token」ボタン
4. 「Edit Cloudflare Workers」テンプレートを選択
5. 権限設定:
   - Account: Cloudflare Pages: Edit
   - Zone: (不要)
6. 「Continue to summary」→「Create Token」
7. トークンをコピー（1回のみ表示）

### 9-3. GitHubシークレット設定

1. GitHubリポジトリ → 「Settings」タブ
2. 「Secrets and variables」→「Actions」
3. 「New repository secret」で以下を追加:

```
Name: CLOUDFLARE_API_TOKEN
Secret: (手順9-2でコピーしたトークン)

Name: CLOUDFLARE_ACCOUNT_ID
Secret: (CloudflareダッシュボードのURL末尾の英数字)
```

**CLOUDFLARE_ACCOUNT_IDの確認方法:**
- ダッシュボードURLが `https://dash.cloudflare.com/abc123def456...` の場合、`abc123def456...` 部分

### 9-4. ワークフロー動作確認

1. リポジトリに変更をpush
2. 「Actions」タブでワークフロー実行を確認
3. 緑色のチェックマークで成功確認

---

## 10. トラブルシューティング

### 10-1. ビルド失敗時

**エラー: `Command failed with exit code 1`**

**原因と解決策:**

1. **依存関係エラー**
   ```
   Error: Cannot find module '@cloudflare/next-on-pages'
   ```
   → `package.json`に以下を追加:
   ```json
   "devDependencies": {
     "@cloudflare/next-on-pages": "^1.13.2"
   }
   ```
   → リポジトリにpushして再デプロイ

2. **Next.js設定エラー**
   ```
   Error: Static export not supported
   ```
   → `next.config.mjs`を確認:
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',  // この行が必要
     images: {
       unoptimized: true  // この行が必要
     }
   };
   ```

3. **Node.jsバージョンエラー**
   ```
   Error: The engine "node" is incompatible
   ```
   → 環境変数に `NODE_VERSION=20` を追加（手順4参照）

**ビルドログの確認:**
1. デプロイ履歴から失敗したビルドをクリック
2. 「View build logs」で詳細ログ表示
3. エラーメッセージを検索して原因特定

### 10-2. 環境変数が反映されない時

**症状:**
- Newsletter送信が失敗する
- Google Analyticsが動作しない

**解決手順:**

1. **環境変数の確認**
   - 「Settings」→「Environment variables」
   - 変数名のスペルミスを確認
   - 値が正しく入力されているか確認

2. **環境の確認**
   - Production環境に設定されているか確認
   - Preview環境にも設定が必要な場合は追加

3. **再デプロイ**
   - 環境変数変更後は**必ず再デプロイ**が必要
   - 「Deployments」→「Retry deployment」
   - または、GitHubに空コミットをpush:
   ```bash
   git commit --allow-empty -m "Trigger rebuild"
   git push
   ```

4. **環境変数の優先順位**
   - Cloudflare Pages環境変数 > .env.local
   - ブラウザで確認: DevTools → Network → ヘッダー確認

### 10-3. DNS設定エラー時

**エラー: `DNS validation failed`**

**原因と解決策:**

1. **CNAMEレコード未設定**
   - DNSプロバイダーでCNAMEレコードを確認
   - `enablerdao.com` → `enablerdao.pages.dev` を設定

2. **DNS伝播待ち**
   - DNS変更は最大48時間かかる場合がある
   - 確認コマンド:
   ```bash
   nslookup enablerdao.com
   ```
   - 結果に `enablerdao.pages.dev` が表示されればOK

3. **Cloudflare Proxyの競合**
   - CloudflareでDNS管理している場合:
   - オレンジクラウド（Proxied）をONにする
   - グレークラウド（DNS only）はOFF

4. **ルートドメインの場合**
   - `@` レコードではなく `enablerdao.com` を使用
   - または、ALIASレコード（プロバイダーによる）

**DNS確認ツール:**
- https://www.whatsmydns.net/
- ドメイン入力 → 「CNAME」を選択 → 世界各地での伝播状況を確認

### 10-4. SSL証明書エラー

**エラー: `Certificate provisioning failed`**

**解決策:**

1. **DNS確認**
   - 上記10-3のDNS設定を再確認
   - DNSが正しく伝播しているか確認

2. **証明書の再発行**
   - 「Custom domains」→ドメインの横の「...」→「Retry SSL provisioning」

3. **CAA レコード確認**
   - DNSにCAAレコードがある場合、以下を追加:
   ```
   Type: CAA
   Name: enablerdao.com
   Value: 0 issue "letsencrypt.org"
   ```

4. **待機時間**
   - SSL発行は最大24時間かかる場合がある
   - 通常は5〜15分で完了

### 10-5. ページが表示されない（404エラー）

**症状:**
- `https://enablerdao.pages.dev/` にアクセスすると404

**原因と解決策:**

1. **ビルド出力ディレクトリが間違っている**
   - 「Settings」→「Builds & deployments」→「Build configuration」
   - `Build output directory` が `.vercel/output/static` になっているか確認

2. **index.htmlが生成されていない**
   - ビルドログで `Generating static pages` を確認
   - `next.config.mjs` に `output: 'export'` があるか確認

3. **ルートパスの問題**
   - `Root directory` が空欄（または `/`）になっているか確認
   - サブディレクトリにプロジェクトがある場合は設定

4. **キャッシュクリア**
   - ブラウザのキャッシュをクリア（Ctrl+Shift+R / Cmd+Shift+R）
   - Cloudflare側のキャッシュパージ:
     - 「Caching」→「Configuration」→「Purge Everything」

### 10-6. Newsletter送信が失敗する

**症状:**
- フォーム送信後にエラーメッセージ

**デバッグ手順:**

1. **ブラウザDevToolsで確認**
   - Network タブで `/api/newsletter` リクエストを確認
   - ステータスコードを確認（200/400/500）
   - Responseタブでエラーメッセージを確認

2. **Resend APIキー確認**
   - 「Settings」→「Environment variables」→ `RESEND_API_KEY`
   - Resendダッシュボード（https://resend.com/api-keys）でキーの有効性確認

3. **API Routeログ確認**
   - Cloudflare Pages Functions ログを確認:
   - 「Functions」タブ → 「Real-time logs」
   - エラースタックトレースを確認

4. **Resend ドメイン確認**
   - Resendでドメイン認証が完了しているか確認
   - SPF/DKIMレコードが設定されているか確認

---

## チェックリスト: セットアップ完了確認

すべての手順が完了したら、以下を最終確認してください。

### デプロイ基本設定
- [ ] Cloudflare Pagesプロジェクト作成完了
- [ ] GitHub連携設定完了
- [ ] ビルド設定が正しい（`npx @cloudflare/next-on-pages`）
- [ ] 環境変数が設定されている（RESEND_API_KEY等）
- [ ] 初回デプロイが成功している

### ドメイン・SSL
- [ ] カスタムドメイン設定完了（enablerdao.com）
- [ ] DNS設定完了（CNAME レコード）
- [ ] SSL証明書が有効（Activeステータス）
- [ ] HTTPSでアクセス可能

### 機能確認
- [ ] トップページが表示される
- [ ] Newsletter機能が動作する
- [ ] Google Analyticsが動作する
- [ ] レスポンシブデザインが正しく表示される
- [ ] Lighthouseスコアが目標値以上

### 自動化・モニタリング
- [ ] プレビューデプロイが有効
- [ ] 通知設定完了（オプション）
- [ ] GitHub Actions設定完了（オプション）

---

## 次のステップ

セットアップ完了後:

1. **定期的な更新**
   - GitHubにpushするだけで自動デプロイ
   - PRごとにプレビュー環境が自動生成

2. **監視**
   - Cloudflare Analytics でトラフィック確認
   - Resend Dashboard でメール送信状況確認
   - Google Analytics でユーザー行動分析

3. **最適化**
   - Lighthouse スコアを定期的にチェック
   - Core Web Vitals の改善
   - 画像最適化（WebP/AVIF変換）

4. **セキュリティ**
   - APIキーの定期的なローテーション
   - Cloudflare WAF設定（Proプラン以上）
   - DDoS対策の確認

---

## サポート・参考資料

### Cloudflare Pages
- 公式ドキュメント: https://developers.cloudflare.com/pages/
- Next.js on Pages ガイド: https://developers.cloudflare.com/pages/framework-guides/nextjs/

### Next.js
- Static Export ドキュメント: https://nextjs.org/docs/app/building-your-application/deploying/static-exports

### Resend
- API ドキュメント: https://resend.com/docs

### トラブルシューティング
- Cloudflare Community: https://community.cloudflare.com/
- Stack Overflow: `[cloudflare-pages]` タグで検索

---

**最終更新:** 2026-02-14
**対象プロジェクト:** yukihamada/d-enablerdao
**作成者:** Claude Code (Anthropic)
