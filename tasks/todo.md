# EnablerDAO.com — TODO

## P0: 基盤整備 ✅

- [x] **Git初期化** — `git init` + `.gitignore` 作成
- [x] **初回コミット** — 現状をスナップショットとして保存
- [x] **install.sh 作成** — enabler-cli インストーラー
- [x] **frontend/blog/ ディレクトリ作成** — ブログ生成先

## P1: 品質向上 ✅

- [x] **バックエンドテスト** — 10テスト（health, projects, subscribe正常/異常, キャッシュ等）
- [x] **GitHub API連携** — stars/forks/issuesを動的取得、5分キャッシュ、デフォルト値フォールバック
- [x] **エラーハンドリング統一** — loading/error/retryのUI
- [x] **アクセシビリティ** — alt属性、aria-label、sr-only、aria-expanded

## P2: デプロイ・運用 ✅

- [x] **GitHub Actions CI** — test + clippy + fmt + Docker build（`.github/workflows/ci.yml`）
- [x] **CD workflow** — main push時にFly.ioへ自動デプロイ（`.github/workflows/deploy.yml`）
- [x] **Dockerfile最適化** — 依存キャッシュ層分離、Rust 1.84
- [ ] **Secrets設定** — 下記コマンドで手動設定が必要:

```bash
# Fly.io secrets（本番環境変数）
fly secrets set RESEND_API_KEY=re_xxxxxxxx
fly secrets set GITHUB_TOKEN=ghp_xxxxxxxx

# GitHub Actions secrets（CD用）
# リポジトリ Settings → Secrets → Actions で設定:
#   FLY_API_TOKEN — `fly tokens create deploy` で取得
```

## P3: 機能追加（余裕があれば）

- [ ] **OGP/メタタグ最適化** — SNSシェア時のプレビュー画像・テキスト
- [ ] **パフォーマンス** — 画像最適化（WebP変換）、CSS/JS minify
- [ ] **多言語対応** — 英語版ページ or i18n切り替え
- [ ] **プロジェクト詳細ページ** — `/projects/:name` で個別ページ生成
