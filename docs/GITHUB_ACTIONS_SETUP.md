# GitHub Actions CI/CD セットアップ

Cloudflare Pagesへの自動デプロイをGitHub Actionsで設定する手順。

## 1. Cloudflare API Token取得

### 手順

1. [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens) → **My Profile** → **API Tokens**
2. **Create Token** をクリック
3. **Use template** → **Edit Cloudflare Workers** を選択
4. 設定:
   ```
   Token name: GitHub Actions - enablerdao
   Permissions:
     - Account → Cloudflare Pages → Edit
   Account Resources:
     - Include → [Your Account]
   Zone Resources:
     - Include → All zones (or specific: enablerdao.com)
   ```
5. **Continue to summary** → **Create Token**
6. トークンをコピー（**一度しか表示されません**）

## 2. Cloudflare Account ID取得

### 手順

1. [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 右サイドバーの **Account ID** をコピー

または

```bash
wrangler whoami
# Account ID: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 3. GitHub Secretsに追加

### 手順

1. GitHubリポジトリ → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** をクリック
3. 以下を追加:

   **CLOUDFLARE_API_TOKEN**
   ```
   Value: (手順1で取得したトークン)
   ```

   **CLOUDFLARE_ACCOUNT_ID**
   ```
   Value: (手順2で取得したAccount ID)
   ```

## 4. ワークフロー確認

`.github/workflows/cloudflare-pages.yml` が存在することを確認:

```bash
ls -la .github/workflows/cloudflare-pages.yml
```

## 5. デプロイテスト

### mainブランチへのpush

```bash
git add .
git commit -m "feat: setup Cloudflare Pages deployment"
git push origin main
```

### GitHub Actionsで確認

1. GitHubリポジトリ → **Actions** タブ
2. **Deploy to Cloudflare Pages** ワークフローを確認
3. 成功すると緑のチェックマークが表示される

### デプロイURLの確認

- **Production**: https://enablerdao.pages.dev
- **Custom domain**: https://enablerdao.com
- **Preview** (PRごと): https://[commit-hash].enablerdao.pages.dev

## 6. ブランチ戦略

### 推奨ワークフロー

```
main (本番) → Cloudflare Pages Production
  ↑
develop (開発) → Cloudflare Pages Preview
  ↑
feature/* (機能) → PR Preview
```

### 設定例

```yaml
# .github/workflows/cloudflare-pages.yml
on:
  push:
    branches:
      - main      # 本番デプロイ
      - develop   # プレビューデプロイ
  pull_request:
    branches:
      - main      # PR Preview
```

## 7. 環境変数の管理

### Cloudflare Pages Dashboard経由

1. Cloudflare Pages → **enablerdao** → **Settings** → **Environment variables**
2. Production / Preview ごとに設定

### GitHub Actions経由（将来的）

```yaml
# wrangler.toml に定義
# または GitHub Secrets から注入可能
```

## トラブルシューティング

### ワークフローが失敗する

#### エラー: "Authentication error"

**原因**: API Tokenが無効または期限切れ

**解決方法**:
1. Cloudflare Dashboardで新しいトークンを生成
2. GitHub Secretsを更新
3. ワークフローを再実行

#### エラー: "Project not found"

**原因**: プロジェクト名が一致していない

**解決方法**:
1. Cloudflare Pages Dashboard でプロジェクト名を確認
2. `cloudflare-pages.yml` の `--project-name=enablerdao` を修正

#### エラー: "Build failed"

**原因**: ビルドスクリプトのエラー

**解決方法**:
```bash
# ローカルでビルドテスト
npm run pages:build

# エラーを修正してから再度push
```

### ワークフローが実行されない

**原因**: ワークフローファイルのYAML構文エラー

**解決方法**:
```bash
# YAML検証
npm install -g yaml-validator
yaml-validator .github/workflows/cloudflare-pages.yml
```

### デプロイURLにアクセスできない

**原因**: DNS設定またはSSL証明書の問題

**解決方法**:
1. Cloudflare Pages Dashboard → Custom domains で状態確認
2. SSL証明書発行を待つ（最大24時間）

## セキュリティベストプラクティス

### API Tokenの権限を最小限に

- **Account → Cloudflare Pages → Edit** のみ
- 不要な権限は付与しない

### Token定期ローテーション

- 3-6ヶ月ごとに新しいトークンを生成
- 古いトークンを削除

### Secretsの保護

- GitHub Secretsは暗号化されている
- ログに出力されない（自動マスキング）

## 参考リンク

- [GitHub Actions公式ドキュメント](https://docs.github.com/en/actions)
- [Cloudflare Wrangler Action](https://github.com/cloudflare/wrangler-action)
- [Cloudflare API Tokens](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/)

---

**Last Updated**: 2026-02-14
