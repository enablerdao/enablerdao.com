# EnablerDAO.com — TODO

## P0: 基盤整備 ✅

- [x] **Git初期化** — `git init` + `.gitignore` 作成
- [x] **初回コミット** — 現状をスナップショットとして保存
- [x] **install.sh 作成** — enabler-cli インストーラー
- [x] **frontend/blog/ ディレクトリ作成** — ブログ生成先

## P1: 品質向上 ✅

- [x] **バックエンドテスト** — 12テスト（health, projects, project by name, subscribe等）
- [x] **GitHub API連携** — stars/forks/issuesを動的取得、5分キャッシュ
- [x] **エラーハンドリング統一** — loading/error/retryのUI
- [x] **アクセシビリティ** — alt属性、aria-label、sr-only、aria-expanded

## P2: デプロイ・運用 ✅

- [x] **GitHub Actions CI** — test + clippy + fmt + Docker build
- [x] **CD workflow** — main push時にFly.ioへ自動デプロイ
- [x] **Dockerfile最適化** — 依存キャッシュ層分離、Rust 1.84
- [ ] **Secrets設定** — 手動: `fly secrets set`, GitHub Actions secrets

## P3: 機能追加 ✅

- [x] **OGP/メタタグ最適化** — enablerdao.com URL統一、description改善、canonical/hreflang
- [x] **パフォーマンス** — 画像lazy loading、script defer
- [x] **多言語対応** — /en/ 英語版ページ作成、hreflang相互リンク
- [x] **プロジェクト詳細ページ** — `/api/projects/:name` API + `/projects/` フロントエンド

## 残タスク

- [ ] Secrets設定（fly secrets set / GitHub Actions secrets）
- [ ] GitHubリモートリポジトリ作成 + push
- [ ] 本番デプロイ確認
