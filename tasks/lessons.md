# EnablerDAO.com — Lessons Learned

## 2026-02-22: 初期セットアップ
- プロジェクトにGitが未初期化の状態で開発が進んでいた → 変更追跡不能
- サイト上で `install.sh` を案内しているが実体ファイルが存在しなかった → ユーザー体験の断絶
- `generate-blog-post.sh` の出力先 `frontend/blog/` が未作成 → スクリプト実行時に失敗する
- バックエンドのプロジェクトデータがハードコード → GitHub APIから動的取得すべき
