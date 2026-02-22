# EnablerDAO.com — TODO

## P0: 基盤整備（今すぐ）

- [ ] **Git初期化** — `git init` + `.gitignore` 作成（target/, .env, node_modules）
- [ ] **初回コミット** — 現状をスナップショットとして保存
- [ ] **install.sh 作成** — サイト上で案内しているのに実体がない。最低限のスクリプトを用意
- [ ] **frontend/blog/ ディレクトリ作成** — `generate-blog-post.sh` の出力先が存在しない

## P1: 品質向上（今週中）

- [ ] **バックエンドテスト** — `/api/projects` と `/api/subscribe` の基本テスト（`#[tokio::test]`）
- [ ] **GitHub API連携** — プロジェクトデータをハードコードからGitHub API取得に変更
- [ ] **エラーハンドリング統一** — フロントエンドのfetch失敗時のUI改善
- [ ] **アクセシビリティ** — alt属性、aria-label、キーボードナビゲーション確認

## P2: デプロイ・運用（来週）

- [ ] **GitHub Actions CI** — `cargo test` + `cargo clippy` + Docker build をPR時に自動実行
- [ ] **Fly.ioデプロイ確認** — `fly deploy` でエンドツーエンド動作検証
- [ ] **RESEND_API_KEY設定** — Fly.io secrets に登録し、メール送信を本番有効化
- [ ] **ANTHROPIC_API_KEY設定** — ブログ自動生成用（Fly.io secrets or cron環境）

## P3: 機能追加（余裕があれば）

- [ ] **OGP/メタタグ最適化** — SNSシェア時のプレビュー画像・テキスト
- [ ] **パフォーマンス** — 画像最適化（WebP変換）、CSS/JS minify
- [ ] **多言語対応** — 英語版ページ or i18n切り替え
- [ ] **プロジェクト詳細ページ** — `/projects/:name` で個別ページ生成
