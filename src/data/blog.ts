export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  author: string;
  publishedAt: string;
  tags: string[];
  category: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "all-services-verified-blog-launch-2026-02",
    title: "全サービス稼働確認 — 55テスト全パス＆ブログ機能ローンチ",
    description:
      "EnablerDAO全プロジェクトの包括テスト55件全パス、DojoC Next.js 16アップグレード完了、CLIツールデプロイ、ブログ機能ローンチ、yukihamada.jp Rust移行開始の詳細レポート。",
    content: `## 概要

本日、EnablerDAOが運営する全サービスの包括的な稼働確認テストを実施し、55テストすべてがパスしました。加えて、ブログ機能の新規ローンチ、CLIツールのデプロイ、DojoCのメジャーアップグレード完了、yukihamada.jpのRust移行開始など、複数の重要マイルストーンを達成しています。

## 包括テスト結果：55テスト全パス

全プロジェクトを横断する自動テストスイートを実行し、55件すべてが正常にパスしました。

### EnablerDAO（12/12ページ + API全正常）

EnablerDAOのWebサイト全12ページと全APIエンドポイントの正常動作を確認。ページレンダリング、API応答、データ整合性のすべてにおいて問題なしです。

### DojoC（11/11ページ全正常）

セキュリティ教育プラットフォームDojoCの全11ページが正常に表示・動作することを確認しました。

### 外部12サービス全HTTP 200

EnablerDAOが連携する外部12サービスすべてに対してHTTPリクエストを送信し、全サービスからHTTP 200レスポンスを受信しました。

### セキュリティヘッダー検証（20/20）

4サイト × 5ヘッダー = 20項目のセキュリティヘッダー検証を実施し、すべてパスしました。検証対象ヘッダー：
- \`Content-Security-Policy\`
- \`X-Content-Type-Options\`
- \`X-Frame-Options\`
- \`Strict-Transport-Security\`
- \`Referrer-Policy\`

## DojoC Next.js 14→16 メジャーアップグレード完了

DojoCのNext.jsを14から16にメジャーアップグレードしました。

### セキュリティ脆弱性の解消
- **アップグレード前**: 11件の脆弱性（1 critical: Authorization Bypass含む）
- **アップグレード後**: 0件

React 18→19への移行、params/searchParamsの非同期化対応、next.config.tsへの移行など、すべての破壊的変更に対応済みです。Turbopackの採用により、ビルド時間も大幅に短縮されました。

## EnablerDAO CLIツールの完成とデプロイ

\`enablerdao\`コマンドラインツールが完成し、本番環境にデプロイされました。

\`\`\`bash
# インストール
curl -fsSL https://enablerdao.com/install.sh | bash

# 主なコマンド
enablerdao projects   # 全プロジェクト一覧
enablerdao status     # 全サービスのライブステータス確認
enablerdao repos      # GitHubリポジトリ一覧
enablerdao work <repo> # Fork→Clone→開発開始
enablerdao pr <repo>   # コミット→PR作成を自動化
\`\`\`

POSIX準拠シェルスクリプトとして実装されており、sudo不要・Node.js不要でmacOS / Linux / WSLで動作します。

## ブログ機能の新規追加とデプロイ

EnablerDAOのWebサイトにブログ機能を新規追加しました。技術的な取り組み、プロジェクトの進捗、セキュリティレビュー結果などを発信するためのプラットフォームです。

### 技術仕様
- Next.js App Routerベースの静的生成（SSG）
- TypeScript型安全なデータ構造
- カテゴリ・タグによるフィルタリング
- レスポンシブデザイン対応

## yukihamada.jp Rust移行開始

yukihamada.jpのバックエンドをRustへ移行するプロジェクトを開始しました。Axumフレームワークを採用し、パフォーマンスとメモリ安全性の向上を目指します。

## まとめ

| 項目 | 結果 |
|---|---|
| 包括テスト | 55/55パス |
| EnablerDAOページ+API | 12/12正常 |
| DojoCページ | 11/11正常 |
| 外部サービス | 12/12 HTTP 200 |
| セキュリティヘッダー | 20/20パス |
| DojoC脆弱性 | 11→0件 |
| CLIツール | デプロイ完了 |
| ブログ機能 | ローンチ完了 |
| yukihamada.jp Rust移行 | 開始 |

すべてのコードは[GitHub](https://github.com/enablerdao)でオープンソースとして公開しています。`,
    author: "EnablerDAO",
    publishedAt: "2026-02-13",
    tags: ["testing", "deploy", "blog", "upgrade", "rust"],
    category: "Engineering",
  },
  {
    slug: "cross-project-security-review-2026-02",
    title: "全プロジェクト横断セキュリティレビュー＆メジャーアップグレード完了",
    description:
      "EnablerDAOの全6プロジェクトに対する包括的なセキュリティレビュー、バグ修正、CLIツール開発、Next.js 16メジャーアップグレードの詳細レポート。",
    content: `## 概要

EnablerDAOでは、運営する全プロジェクトに対して包括的なセキュリティレビューとコード品質改善を実施しました。6つのプロジェクトを並列でレビュー・テスト・修正し、すべてのビルドが通ることを確認した上でデプロイまで完了しています。

## 対象プロジェクト

| プロジェクト | 技術スタック | 修正内容 |
|---|---|---|
| Elio Chat iOS | Swift / SwiftUI | API整合性、HTTP status check、@StateObject修正 |
| elio-api | Cloudflare Workers / TypeScript | API一貫性、重複排除、エラーレスポンス統一 |
| Nanobot | Rust / Axum | CORS設定、セッションID形式、SSEイベント処理 |
| Wisbee Web | 静的HTML / JavaScript | プライバシーポリシー修正、APIドメイン修正 |
| EnablerDAO | Next.js 16 / TypeScript | XSS対策、Webhook認証、レースコンディション修正 |
| DojoC | Next.js 16 / TypeScript | メジャーアップグレード（14→16）、セキュリティ脆弱性全解消 |

## セキュリティ修正の詳細

### XSS対策（EnablerDAO）
メール自動返信のWebhookで、ユーザー入力がHTMLにエスケープなしで埋め込まれていた問題を修正。\`escapeHtml\`関数を追加し、\`&\`, \`<\`, \`>\`, \`"\`, \`'\`の5文字をエンティティに変換するようにしました。

### Webhook認証の強化
Resend Webhookのリクエストに対して、HMAC-SHA256署名検証を実装。\`crypto.timingSafeEqual\`によるタイミングセーフな比較で、署名偽造攻撃を防止します。

### レースコンディション対策
Q&Aストアのファイル書き込みにロック機構を追加。複数のリクエストが同時にファイルを書き込んだ際にデータが破損する問題を解消しました。

### プライバシーポリシーの正確性（Wisbee）
「会話履歴はブラウザ内にのみ保存されます」という記述が実際のAPI通信と矛盾していたため、正確な表現に修正。AI推論のためにサーバーに送信されるが長期保存はされないことを明記しました。

## EnablerDAO CLIツールの開発

\`enablerdao\`コマンドをターミナルから使えるCLIツールを新規開発しました。

### インストール方法
\`\`\`bash
curl -fsSL https://enablerdao.com/install.sh | bash
\`\`\`

### 主なコマンド
- \`enablerdao projects\` — 全13+プロジェクト一覧表示
- \`enablerdao status\` — 全サービスのライブHTTPステータス確認
- \`enablerdao repos\` — GitHubリポジトリ一覧（gh CLI連携）
- \`enablerdao work <repo>\` — Fork→Clone→Claude Code起動で開発開始
- \`enablerdao pr <repo>\` — コミット→PR作成を自動化

sudo不要、Node.js不要のPOSIX準拠シェルスクリプトとして実装。macOS / Linux / WSLで動作します。

## Next.js 16 メジャーアップグレード（DojoC）

DojoC（セキュリティ教育プラットフォーム）をNext.js 14.2.5からNext.js 16.1.6にメジャーアップグレードしました。

### 対応した破壊的変更
1. **React 18 → 19**: react/react-dom をv19に更新
2. **params の非同期化**: 動的ルートの\`params\`を\`Promise<>\`型に変更し、\`await\`で取得するように修正
3. **searchParams の非同期化**: チェックアウト成功ページの\`searchParams\`も同様に修正
4. **next.config.js → next.config.ts**: ESM形式に移行

### セキュリティ改善
- **修正前**: 11件の脆弱性（1 critical: Authorization Bypass）
- **修正後**: 0件（Next.js関連すべて解消）
- ビルド時間: ~20s → **9.0s**（Turbopack）

## テスト結果

全6プロジェクトで並列テストを実施し、すべてパスしました。

| テスト | 結果 |
|---|---|
| Elio iOS Xcode build | BUILD SUCCEEDED |
| elio-api tsc --noEmit | 0 errors |
| Nanobot cargo check + clippy | 0 errors |
| Wisbee Web HTML/JS validation | valid |
| EnablerDAO Next.js build | 16/16 pages OK |
| DojoC Next.js build | 24/24 pages OK |

## デプロイ

修正完了後、EnablerDAOとDojoCの両サイトをFly.io（東京リージョン）にデプロイ。ダウンタイムなしのローリングデプロイで更新が完了しています。

## まとめ

今回のレビューでは、AI支援による並列コードレビューの手法を採用しました。6プロジェクトのレビュー、修正、テスト、デプロイまでを一連のワークフローとして実行し、プロジェクト間の整合性を確保しています。

EnablerDAOはオープンソースプロジェクトです。コードは[GitHub](https://github.com/enablerdao)で公開しており、誰でもレビュー・貢献できます。`,
    author: "EnablerDAO",
    publishedAt: "2026-02-13",
    tags: ["security", "review", "next.js", "cli", "deploy"],
    category: "Engineering",
  },
];
