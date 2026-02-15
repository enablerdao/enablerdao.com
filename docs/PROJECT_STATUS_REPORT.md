# EnablerDAO プロジェクト統合レポート
更新日: 2026-02-14

## エグゼクティブサマリー
- 総プロジェクト数: 12
- 総月間トラフィック: 6,000+
- 技術スタック: Next.js, Rust, React Native
- インフラ: Cloudflare Pages, Fly.io, Vercel
- 最近の主要更新: enablerdao.com Cloudflare Pages移行完了

## プロジェクト一覧

### AI & テクノロジー（4プロジェクト）

#### 1. Chatweb.ai
- **ステータス**: 🟢 Active
- **トラフィック**: 289 visits/mo
- **技術**: Rust Lambda, Next.js
- **デプロイ**: AWS Lambda (ap-northeast-1)
- **最新**: v115 - Agentic Mode実装
- **次のステップ**: Explore Mode最適化

#### 2. Wisbee
- **ステータス**: 🟡 Integrated
- **トラフィック**: 613 visits/mo
- **統合**: Chatweb.ai と統合完了
- **リダイレクト**: Cloudflare Workers
- **次のステップ**: ブランディング整理

#### 3. Elio Chat
- **ステータス**: 🟢 Active
- **トラフィック**: 506 visits/mo
- **プラットフォーム**: iOS (App Store)
- **技術**: React Native, ローカルLLM
- **次のステップ**: Product Hunt ローンチ

#### 4. News.xyz
- **ステータス**: 🟢 Active
- **トラフィック**: 506 visits/mo
- **技術**: Next.js, AI自動収集
- **次のステップ**: Product Hunt ローンチ

### ビジネスツール（5プロジェクト）

#### 5. StayFlow
- **ステータス**: 🟢 Active
- **トラフィック**: 1.84k visits/mo（最大）
- **技術**: Next.js, Supabase
- **機能**: 民泊・宿泊施設運営管理
- **次のステップ**: 予約連携強化

#### 6. BANTO
- **ステータス**: 🟡 Beta
- **トラフィック**: 186 visits/mo
- **技術**: Next.js
- **対象**: 建設業者向け請求書管理
- **次のステップ**: 業界特化機能追加

#### 7. Totonos
- **ステータス**: 🟡 Beta
- **トラフィック**: 103 visits/mo
- **技術**: (調査中)
- **機能**: 企業財務自動化
- **次のステップ**: (調査結果待ち)

#### 8. VOLT
- **ステータス**: 🟢 Active
- **トラフィック**: 205 visits/mo
- **技術**: Next.js
- **機能**: ライブオークション
- **収益モデル**: 取引手数料10%
- **次のステップ**: 出品者獲得

#### 9. Enabler
- **ステータス**: 🟢 Active
- **トラフィック**: 107 visits/mo
- **技術**: Next.js
- **機能**: ライフスタイルサービス
- **収益モデル**: マーケットプレイス手数料15%
- **次のステップ**: サービス拡充

### セキュリティ（1プロジェクト）

#### 10. Security Scanner
- **ステータス**: 🟢 Active
- **トラフィック**: 113 visits/mo
- **技術**: Next.js
- **機能**: Webサイトセキュリティ診断
- **次のステップ**: Pro機能拡充

### スポーツ & コミュニティ（1プロジェクト）

#### 11. JitsuFlow
- **ステータス**: 🟢 Active
- **トラフィック**: 1.31k visits/mo
- **技術**: Next.js, Supabase
- **デプロイ**: Fly.io (nrt)
- **機能**: BJJ練習記録・道場運営
- **次のステップ**: UI改善、メール自動化

### アーカイブ

#### 12. Murata BJJ
- **ステータス**: 🔴 Archived
- **理由**: enablerdao.comから削除
- **移行先**: JitsuFlow に統合

## 技術インフラ

### ホスティング
- **Cloudflare Pages**: enablerdao.com
- **Fly.io**: jiuflow-ssr, nanobot-ai (nrt)
- **AWS Lambda**: chatweb.ai (ap-northeast-1)
- **Vercel**: 一部プロジェクト

### データベース
- **Supabase**: StayFlow, JitsuFlow
- **DynamoDB**: chatweb.ai
- **PostgreSQL**: 一部プロジェクト

## 収益サマリー

### 現状MRR（推定）
- サブスクリプション: ¥200,000/月
- トランザクション: ¥80,000/月
- **合計MRR**: ¥280,000/月

### 目標（12ヶ月後）
- **目標MRR**: ¥3,000,000/月
- **目標ARR**: ¥36,000,000/年

## 最近の主要更新（2026-02-14）

1. ✅ enablerdao.com Cloudflare Pages移行完了
2. ✅ Newsletter CTA & コンバージョン最適化
3. ✅ 全APIルート Edge Runtime対応
4. ✅ 収益戦略ドキュメント完備
5. ✅ Git push完了、デプロイ準備完了

## 次のステップ（優先順位順）

1. 🔴 enablerdao.com Cloudflare Pagesデプロイ実行
2. 🔴 totonos.jp 状況確認・戦略決定
3. 🟡 news.xyz Product Hunt ローンチ
4. 🟡 elio.love App Store申請
5. 🟡 jiuflow.art UI改善
6. 🟢 広告キャンペーン開始

## KPI

| 指標 | 現状 | 3ヶ月目標 | 6ヶ月目標 |
|------|------|----------|----------|
| 総トラフィック | 6,000/月 | 15,000/月 | 40,000/月 |
| 有料ユーザー | 20 | 100 | 300 |
| MRR | ¥280,000 | ¥500,000 | ¥1,500,000 |
| コンバージョン率 | 5% | 10% | 15% |

---

**作成者**: EnablerDAO Team
**最終更新**: 2026-02-14
**次回更新**: 毎月1日
