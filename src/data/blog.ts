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
