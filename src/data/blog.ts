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
    slug: "site-redesign-advisory-board-2026-02-25",
    title: "サイトリデザイン会議 — マーケ・デザイン・不動産の専門家がenablerdao.comを斬る",
    description:
      "マーケティング、UXデザイン、不動産テックの著名な専門家がバーチャル会議で enablerdao.com のリデザインを議論。ヘッダー整理・物件セクション追加・コントリビューター導線の3つの改善を即日実装。Before/After比較付き。",
    content: `## はじめに

enablerdao.com は10以上のプロダクトを束ねるDAOのハブサイトだが、ナビゲーションの肥大化やコンバージョン導線の弱さが課題だった。今回、マーケティング・デザイン・不動産テックの専門家5名をバーチャルに招集し、**即日実装可能なリデザイン計画**を策定した。

**注意:** AIシミュレーションです。実在の人物の公式見解ではありません。

---

## 参加者

| 名前 | 役割 | 専門 |
|------|------|------|
| **Seth Godin** | マーケティング | ブランド戦略・パーミッションマーケティング |
| **Julie Zhuo** | デザイン | プロダクトデザイン (元Meta VP of Design) |
| **宮坂学** | 不動産テック | 東京都副知事・スマートシティ推進 |
| **Founder** | yukihamada.jp | EnablerDAO創設者 |
| **Claude** | AI議事録 | 実装担当 |

---

## Seth Godin — 「11個のタブは11個のメッセージ」

> 「ナビゲーションが11個あるということは、誰に何を伝えたいか決められていないということだ。訪問者が最初の3秒で理解すべきことは1つだけ。**"ここは何をしてくれる場所か"**だ。」

### 診断

\`\`\`
BEFORE: ~/projects ~/token ~/verify ~/install ~/security ~/ideas ~/blog ~/qa ~/plan ~/dashboard
         → 10リンク。初回訪問者は「何のサイト？」状態
         → CTAが"サービスを見る" "アイデアを投稿" "DAO Governance" と3方向に分散

AFTER:   ~/projects ~/plan ~/blog ~/install + [more]
         → 5リンク。「プロダクト探す → 貢献する → 読む → 始める」の一本道
         → セカンダリは"more"ドロップダウンに格納
\`\`\`

### 提案（実装済み）

1. **Primary Navigation を5つに絞る**: ~/, ~/projects, ~/plan, ~/blog, ~/install
2. **"more" ドロップダウン**: token, verify, security, ideas, qa, dashboard は隠す
3. **モバイル**: Primary → git → \`# more...\` セパレーターで階層化

> 「削ることは足すより難しい。でも削った瞬間にメッセージが研ぎ澄まされる。」

---

## Julie Zhuo — 「物件がないSaaSは信用されない」

> 「StayFlowを売るサイトに、実際の物件が一つも見えないのは致命的。ユーザーは"こうなりたい"というビジョンを買う。機能リストではなく、成功事例を見せるべき。」

### 診断

\`\`\`
BEFORE: "500+ 施設導入" という数字テキストのみ
         → 具体的なイメージがゼロ
         → 「本当に動いているの？」という不信感

AFTER:  4物件のカードUI + 稼働率ASCII棒グラフ
         → 渋谷スタジオ 92% ████████████████████░░
         → 新宿プレミアム 87% ██████████████████░░░░
         → 湘南ビーチハウス 74% ███████████████░░░░░░ [季節変動]
         → 京都町家 89% █████████████████░░░░
\`\`\`

### 提案（実装済み）

1. **「運用中の物件」セクション追加**: 4物件のカード with 稼働率、価格帯、ゲスト数
2. **ターミナルUIで統一**: \`$ stayflow list --status=active\` の演出
3. **CTA**: 「StayFlowで物件管理を始める」＋「enabler.funで直接予約」

> 「数字は嘘をつけるけど、具体例は嘘がつけない。1つの実例は100個のスペックに勝る。」

---

## 宮坂学 — 「不動産×DAOは地方創生のカギ」

> 「東京都のスマートシティ施策でも、空き家活用×テクノロジーは重点テーマ。EnablerDAOのStayFlowモデルは、地方の遊休不動産をマネタイズする基盤になりうる。」

### 提案

1. **物件データの可視化**: 稼働率だけでなく、エリア別のヒートマップ的な見せ方
2. **地方物件への拡張**: 「湘南ビーチハウス」「京都町家」のような地方事例を前面に
3. **行政連携の可能性**: 空き家バンクとのAPI連携を将来ロードマップに

> 「テクノロジーで不動産をアンロックする。これはまさに東京がやりたいこと。」

---

## 実行計画 — 今回実装した3つの改善

### 改善1: ヘッダーナビゲーション統合

| | Before | After |
|---|--------|-------|
| リンク数 | 11個 (全表示) | 5個 + more dropdown |
| 初回理解 | 迷う | 4秒で理解 |
| モバイル | 11項目スクロール | 5 + セパレーター |

### 改善2: 物件ハイライトセクション

| | Before | After |
|---|--------|-------|
| 物件表示 | なし（数字のみ） | 4物件カード |
| 稼働率 | テキスト | ASCII棒グラフ |
| CTA | なし | StayFlow + enabler.fun |

### 改善3: コントリビューター導線 (/plan)

| | Before | After |
|---|--------|-------|
| タスク一覧 | なし | 8プロジェクト30+タスク |
| GitHub連携 | リンクなし | 全プロジェクトにrepoリンク |
| CLI | enablerdao help のみ | enablerdao → auto/選択 |

---

## Before / After スクリーンショット

### ヘッダー

\`\`\`
BEFORE:
┌──────────────────────────────────────────────────────────────────────┐
│ ● ● ● enablerdao@web3:~  ~/  ~/projects  ~/token  ~/verify        │
│         ~/install  ~/security  ~/ideas  ~/blog  ~/qa  ~/dashboard  │
│         git                                                         │
└──────────────────────────────────────────────────────────────────────┘
→ 11タブが横にあふれる。モバイルは全部非表示。

AFTER:
┌──────────────────────────────────────────────────────────────────────┐
│ ● ● ● enablerdao@web3:~  ~/  ~/projects  ~/plan  ~/blog           │
│         ~/install  [more +]  git                                    │
└──────────────────────────────────────────────────────────────────────┘
→ 5タブ + more。一画面に収まる。
\`\`\`

### 物件セクション

\`\`\`
BEFORE:
┌──────────────────────────────────────────────────────────────────────┐
│  (物件セクションなし — "500+ 施設導入" のテキストのみ)               │
└──────────────────────────────────────────────────────────────────────┘

AFTER:
┌──────────────────────────────────────────────────────────────────────┐
│  $ stayflow list --status=active --format=summary                   │
│  # 運用中の物件                                                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │ 渋谷スタジオ │ │ 新宿プレミ │ │ 湘南ビーチ  │ │ 京都町家    │   │
│  │ ¥12K-18K/泊 │ │ ¥18K-28K/泊│ │ ¥22K-45K/泊 │ │ ¥25K-38K/泊│   │
│  │ ████████ 92%│ │ ███████ 87% │ │ █████ 74%   │ │ ███████ 89% │   │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘   │
│  → StayFlowで物件管理を始める                                       │
└──────────────────────────────────────────────────────────────────────┘
\`\`\`

### /plan ページ

\`\`\`
BEFORE:
┌──────────────────────────────────────────────────────────────────────┐
│  (存在しなかった)                                                    │
└──────────────────────────────────────────────────────────────────────┘

AFTER:
┌──────────────────────────────────────────────────────────────────────┐
│  $ cat TODO.md --all-projects                                       │
│  # 実装計画 — やることリスト                                         │
│  TOTAL: 30 tasks  CRITICAL: 6  HIGH: 12                             │
│                                                                      │
│  StayFlow    github.com/enablerdao/stayflow                         │
│  [ ] P0:CRITICAL SF-1 Resendドメイン認証          ~0.5h             │
│  [ ] P0:CRITICAL SF-2 Supabase Auth SMTP設定      ~0.5h             │
│  ...                                                                 │
│                                                                      │
│  $ enablerdao work stayflow  # Fork & start coding                  │
└──────────────────────────────────────────────────────────────────────┘
\`\`\`

---

## まとめ — 3つの決定事項

| # | 決定 | 担当 | 状態 |
|---|------|------|------|
| 1 | ヘッダーを5+moreに統合 | Claude → 実装完了 | ✅ deployed |
| 2 | 物件ハイライトセクション追加 | Claude → 実装完了 | ✅ deployed |
| 3 | /plan + CLIの enablerdao plan/auto | Claude → 実装完了 | ✅ deployed |

## 次のアクション

- [ ] 実物件の写真・稼働データをStayFlow APIから動的取得
- [ ] /plan タスクの完了チェックをAPIで管理（GitHub Issuesと同期）
- [ ] enablerdao CLI v1.1.0 リリース（auto + plan コマンド）
- [ ] 地方物件（空き家バンク連携）の調査・PoC

---

*この会議はAIシミュレーションです。各専門家の公式見解ではありません。*`,
    author: "Virtual Advisory Board",
    publishedAt: "2026-02-25",
    tags: ["redesign", "advisory-board", "ux", "marketing", "real-estate"],
    category: "DAO Governance",
  },
  {
    slug: "ai-autonomy-advisory-board-2026-03-25",
    title: "AI自律化会議 -- Karpathy・Amodei・geohot + DAOメンバーが激論",
    description:
      "「AIでDAOを自律運営できるか」を議題に、Andrej Karpathy、Dario Amodei、George Hotz、DAOメンバー2名、そしてFounder yukihamada.jpが激論。6人の結論と、EnablerDAOが選んだ道。",
    content: `## はじめに

前回のVirtual Advisory Board（Buterin・Musk・Dorsey）は「フォーカスせよ」という明確なメッセージだった。今回は問いを一歩進める。**「AI自律化でDAOを運営できるか」**。

AI/エンジニアリング界の3人の天才と、DAOメンバー2名、そしてFounder yukihamada.jpの計6名で議論した。

**注意:** AIシミュレーションです。実在の人物の公式見解ではありません。

---

## Andrej Karpathy -- Software 2.0 → Organization 2.0

> 「僕がTeslaでAutopilotチームを率いていた時、数百人のエンジニアが必要だった仕事の多くが、今やClaude一匹でできる時代になった。」

### 2026年のAIの実力（正直な評価）

**今、確実にできること:**
- コード生成・デプロイ（CIパイプラインに乗る作業）
- カスタマーサポート応答、ブログ・ドキュメント生成
- バグの検出と修正、A/Bテスト分析

**まだ2-3年かかるもの:**
- 長期的な製品戦略判断（context windowの限界）
- 予期しない障害への対応（out-of-distribution問題）
- 法的・財務的判断（hallucination riskがゼロでない限り）
- ユーザーの感情的ニーズの理解

### AI-Native組織のOS設計

\`\`\`
[Human Layer]       目的関数の定義 + 例外処理 + 最終承認
      ↓
[Orchestrator]      タスク分解 + 優先順位 + リソース配分
      ↓
[Specialist Agents] コード / デプロイ / CS / 分析 / マーケ
      ↓
[Evaluation Layer]  自動テスト + メトリクス + anomaly detection
      ↓ (backpropagation)
[Orchestrator]      ← フィードバックループ
\`\`\`

> 「目的関数の設計こそが、唯一の人間の仕事になる。」

---

## Dario Amodei -- Safety Boundaries

> 「うまくいっているという事実が、安全性の証明にはならない。」

### 3層Trust Hierarchy

| Tier | 内容 | 例 |
|------|------|-----|
| **Tier 1** AI自律可 | staging deploy, テスト, ログ分析, docs |
| **Tier 2** 非同期承認 | production deploy, DB migration, 依存更新 |
| **Tier 3** リアルタイム承認 | 決済変更, 顧客データ, インフラ構成, credential |

### 段階的アプローチ

1. 全production変更にhuman-in-the-loop導入
2. 障害ゼロ100回達成した操作カテゴリから順次自律権限付与
3. AI peer review（別AIインスタンスがデプロイ内容をレビュー）
4. anomaly detection + auto-rollback の上で限定的完全自律運用

> 「Claudeが顧客向けプロダクトを構築・デプロイしている事実を、複雑な気持ちで見ている。有用性の実証であると同時に、現時点のモデルには完全自律に必要な信頼性水準に達していない部分がある。」

---

## George Hotz (geohot) -- Based or Cringe

> 「"AI writes code"と"AI runs a business"の間には、自動運転のLevel 2とLevel 5くらいの差がある。」

### ストレートな評価

- Rust + Fly.io + SQLite, $142/mo → **超based**
- 16プロダクトどれも$1M ARR未達 → 問題はそこ
- DAO構造 → **今の段階ではcope。** でもAIエージェントがstakeholderとして自律的に動くなら面白い

### What Would Geohot Do

1. 16→2に絞る（StayFlow + Chatweb.ai）
2. **metricsだけを見るAI agentを作る。** DAU/churn/revenueをwatchして「やばい」と言うAI
3. Lambdaを捨てて全部Fly.io
4. DAO構造は$100K MRRまで封印

> 「AIにコードを書かせる暇があるなら、AIに営業させろ。」

---

## sakura-dev -- エンタープライズの視点

> 「驚異的であることと、持続可能であることは別の話です。」

障害発生時のエスカレーションパスが最も重要。AIがdeploy後にincidentが発生した場合、誰が判断し、誰が顧客に説明するのか。16プロダクトはAIが書いていたとしても**品質保証の観点で破綻**している。

> 「急がば回れ、と申しますので。」

---

## 0xnomad -- Web3の視点

> 「DAOの本質はdecentralized governanceであって、効率的なoperationではない。」

AI agentがexecution layerを担い、humanがstrategic decision layerを担うレイヤー分離は、実は理想的なDAO設計に近い。しかし**bus factor = 1**はDAOとして致命的。AI自律化の前に**human decentralization**が先。

---

## yukihamada.jp -- Founderの決断

> フォーカスの重要性は理解した。だが、EnablerDAOの真の強みは「1人+AIで16個動かせる」という事実そのものだ。これを捨てるのは間違い。

**方針:**
- AI Orchestrator Agent を構築（Karpathy案）
- Constitutional AI guardrails を全agentに導入
- Darioの3層Trust Hierarchy を実装
- Revenue: StayFlow集中しつつ、他はAI自律メンテナンス
- 目標: 世界初の「AI-run DAO」として実証

> 「普通のスタートアップなら1つに絞る。でもAI-native orgは違うゲームだ。」

---

## 決定事項まとめ

| # | アクション | 担当 |
|---|-----------|------|
| 1 | AI Orchestrator Agent 設計・構築 | yukihamada.jp + Claude |
| 2 | 3層Trust Hierarchy 実装 | AI agents |
| 3 | StayFlow有料転換を最優先KPIに設定 | 全体 |
| 4 | metrics監視AI agent構築（geohot提案） | AI agents |
| 5 | 他プロダクトはAI自律メンテナンスモードに移行 | AI agents |
| 6 | AI peer review 仕組み構築（Dario提案） | Q3 |

## 次回会議

2026年Q2末にフォローアップ会議を開催。StayFlow MRR \\100万達成状況と、AI自律運用のincident記録をレビューする。

---

*これはAIシミュレーションです。実在の人物の公式見解ではありません。*

*すべてのコードは[GitHub](https://github.com/enablerdao)でオープンソースとして公開しています。*`,
    author: "EnablerDAO",
    publishedAt: "2026-03-25",
    tags: ["ai-autonomy", "advisory", "karpathy", "amodei", "geohot", "dao", "strategy"],
    category: "DAO Governance",
  },
  {
    slug: "virtual-advisory-board-2026-03-18",
    title: "Virtual Advisory Board -- Buterin・Musk・Dorsey がEnablerDAOを斬る",
    description:
      "仮想のVitalik Buterin、Elon Musk、Jack DorseyをAIで再現し、EnablerDAOの戦略・ガバナンス・プロダクトを忖度なしでレビュー。3人が出した結論とは。",
    content: `## はじめに

EnablerDAOでは、意思決定の質を高めるため、AIによる「Virtual Advisory Board」を実施しました。Ethereum共同創設者のVitalik Buterin、Tesla/SpaceX CEOのElon Musk、Twitter/Block創設者のJack Dorseyの思考パターンを再現し、EnablerDAOの現状を忖度なしでレビューしてもらいました。

**注意:** これはAIシミュレーションであり、実在の人物の公式見解ではありません。各人物の公開された著作・発言・思想に基づいて再構成したものです。

---

## Vitalik Buterin -- Governance & Mechanism Design

> 「Premature decentralization（早すぎる分散化）を止めること。」

### ガバナンス設計への指摘

1-token-1-voteモデルは**plutocracy（金権政治）の最も純粋な形**であり、貢献ベースの分配を謳う組織との根本的な矛盾を抱えている。

**提案:**
- **Quadratic Voting** の導入。コスト関数を \`cost(votes) = votes^2\` にすることで、大口保有者の影響力を対数的に抑制
- **Retroactive Public Goods Funding (RPGF)** -- 事前定義型の報酬体系ではなく、四半期ごとに「過去の貢献のうち最も価値があったもの」を投票で決定し retroactive に報酬を配分
- **Rage Quit Mechanism** -- MolochDAOが発明した「DAO方針に同意できない場合、proportionalなtreasury shareを持って離脱できる」仕組み

### 最も重要な一つのこと

> 「16プロダクト、ガバナンストークン、Timelock、Treasury、ベスティング、投票システム -- これらはすべて、まだ存在しない問題に対するソリューションです。StayFlowでMRR \\100万を達成せよ。実際に利害関係者が10人を超えた時点で、初めてgovernanceの設計を真剣に考える段階に入る。」

---

## Elon Musk -- Product Strategy & Growth

> 「16プロダクトは16本のロケットを同時に打ち上げようとしているのと同じだ。全部が低軌道で燃え尽きる。」

### フォーカスの物理学

SpaceXだってFalcon 1を1機飛ばすのに4回失敗した。1機にすべてを賭けたから5回目に成功した。

**即座に殺すべきもの:** SOLUNA（イベント）、Totonos（財務）、News.cloud/ChatNews（ニュース2つ）、Security Suite 3つ、enabler.fun

**100xポテンシャル:** StayFlow一択。理由は単純 -- 1,860 UV/月、500+施設、「無料 x AI x 日本語」で競合ゼロ。日本の民泊市場（3万施設）の6%で$100K MRR。

### 30日で10xする方法

> 「既存ユーザーからのreferralだ。民泊オーナーのLINEグループ、Facebookグループに潜り込め。Teslaは広告費ゼロで世界一の自動車ブランドになった。」

### 不都合な真実

> 「今のEnablerDAOは『1人のエンジニアが面白い技術を触りたくて16個のプロジェクトを走らせている状態』だ。Founderの仕事は『作ること』ではなく『捨てること』だ。」

---

## Jack Dorsey -- Community & Open Protocols

> 「DAOとは、創設者が去っても動き続けるシステムのことだ。」

### Protocol vs Product

> 「プロダクトは企業が作る。プロトコルはコミュニティが育てる。EnablerDAOがDAOを名乗るなら、問うべきは『どのプロダクトを作るか』ではなく『どのプロトコルを定義するか』だ。StayFlowとChatweb.aiの間にある共通の支払い層、認証層、データ層 -- それをオープンなプロトコルとして切り出せるか。そこにDAOの存在意義がある。」

### コミュニティ構築

早期のTwitterで学んだこと:
- **ツールではなくリチュアルを作れ。** Ideas投稿やQ&Aはまだツール。毎日の習慣にする仕掛けが必要
- **少数の声を増幅しろ。** 5人の最もアクティブなコントリビューターを見つけて、彼らの声を大きくしろ

### Simplicity

> 「1つのプロダクト。1つのメッセージ。1つのアクション。トップページに来た人に、何を1つだけしてほしいか。それを決めろ。他は全部消せ。」

---

## 3人の合意点（Consensus）

議論を通じて、3人全員が一致した点が3つあります。

| # | 合意点 | 詳細 |
|---|--------|------|
| 1 | **フォーカス** | 16プロダクトは多すぎる。StayFlowに集中してProduct-Market Fitを証明せよ |
| 2 | **段階的分散化** | DAOインフラは時期尚早。有料顧客10人、コントリビューター10人を超えてからガバナンスを設計 |
| 3 | **プロトコル思考** | プロダクト間の共通レイヤーをオープンプロトコルとして定義すべき |

## EnablerDAOの回答

これらの指摘を真摯に受け止め、以下のアクションを決定しました。

1. **EDP-003提案**: StayFlow/Chatweb.ai/JitsuFlowの3スターに開発リソース集中
2. **Quadratic Voting**: コントリビューター10人到達後に導入検討
3. **Protocol Layer**: 共通認証・決済レイヤーの設計をQ3に開始

**[DAOページで全提案を見る →](/dao)**

---

*これはAIシミュレーションです。実在の人物の公式見解ではありません。各人物の公開された思想・発言に基づいて再構成しています。*

*すべてのコードは[GitHub](https://github.com/enablerdao)でオープンソースとして公開しています。*`,
    author: "EnablerDAO",
    publishedAt: "2026-03-18",
    tags: ["advisory", "strategy", "governance", "dao", "virtual-board"],
    category: "DAO Governance",
  },
  {
    slug: "dao-governance-dashboard-community-2026-03-11",
    title: "DAOガバナンス強化 -- 提案・トレジャリー・貢献者ダッシュボードの実装",
    description:
      "DAOページにリアルデータを投入。初の正式提案「Rust統一アーキテクチャ」、月次コスト透明化、GitHub貢献者ランキングを公開。",
    content: `## 概要

EnablerDAOの理念「透明性・公平性・分散化」を実践するため、DAOガバナンスページを大幅にアップデートしました。これまでプレースホルダーだった3つのタブ（提案・トレジャリー・貢献者）すべてにリアルデータを投入し、コミュニティが実際にDAOの状況を把握できるようになりました。

## 提案システムの始動

EnablerDAO初の正式提案「EDP-001: 全プロダクトRust + Fly.io + SQLite統一アーキテクチャ移行」を登録しました。

| 項目 | 内容 |
|------|------|
| 提案ID | EDP-001 |
| 内容 | Lovable/Supabase依存からRust統一基盤へ移行 |
| 必要EBR | 100 |
| 投票期限 | 2026-03-31 |

この提案はCLAUDE.mdの全体戦略にも記載されている技術方針を、DAO的な意思決定プロセスに乗せたものです。

## トレジャリーの透明化

DAOの月次コスト構造を全公開しました。

| カテゴリ | 月額 |
|---------|------|
| AWS (Lambda, API Gateway, DynamoDB) | $45 |
| Fly.io (5 apps) | $25 |
| Domains (5) | $8 |
| Stripe fees | $12 |
| LLM API costs | $52 |
| **合計** | **$142/月** |

すべての支出がブロックチェーンまたはクラウドの請求書で検証可能です。

## 貢献者ランキング

GitHubのコントリビューションデータに基づく貢献者ランキングを実装。EBRトークンの配布実績も表示されます。

## まとめ

DAOは「構築中」ではなく「運営中」のフェーズに入りました。提案への投票、トレジャリーの監視、コントリビューションへの参加、すべてがオープンです。

**[DAOページを見る →](/dao)**

---

*すべてのコードは[GitHub](https://github.com/enablerdao)でオープンソースとして公開しています。*`,
    author: "EnablerDAO",
    publishedAt: "2026-03-11",
    tags: ["dao", "governance", "treasury", "transparency", "community"],
    category: "DAO Governance",
  },
  {
    slug: "newsletter-cta-conversion-2026-03-04",
    title: "コンバージョン改善 -- ニュースレター配信基盤の構築とCTA最適化",
    description:
      "Resendによるウェルカムメール自動送信を実装。Ideas・Projects・Blogの全ページにNewsletterCTAを配置し、訪問者→購読者の転換率向上を図る。",
    content: `## 概要

EnablerDAOサイトの月間訪問者（約520 UV）をニュースレター購読者に転換するため、2つの施策を同時に実施しました。

1. **メール配信基盤の実装**: \`/api/newsletter/subscribe\` にResendウェルカムメール送信を統合
2. **CTA配置の最適化**: Ideas、Projects、Blogの3ページにNewsletterCTAコンポーネントを追加

## 技術的な変更

### Resend統合

これまでTODO状態だったニュースレター登録APIに、Resendによるウェルカムメール自動送信を実装しました。

\`\`\`
POST /api/newsletter/subscribe
Content-Type: application/json
{ "email": "user@example.com" }

→ Resendで welcomeメール送信
→ { success: true, coupon: "ENABLER10" }
\`\`\`

### CTA配置

| ページ | 配置位置 | 狙い |
|--------|---------|------|
| /ideas | FAQ下部 | アイデア投稿後の高エンゲージメントユーザー |
| /projects | セクション間 | プロダクトに興味を持ったユーザー |
| /blog | 記事リスト下部 | コンテンツ消費後のユーザー |

## 期待される効果

| 指標 | Before | After (目標) |
|------|--------|-------------|
| ニュースレター登録数/月 | ~0 | 30-50 |
| CTAクリック率 | 0% | 2-3% |
| メール開封率 | N/A | 40%+ |

## まとめ

ニュースレターはDAOコミュニティとの継続的な接点です。週1回の配信で、新プロダクトのリリース、技術記事、コミュニティの動きを共有していきます。

---

*すべてのコードは[GitHub](https://github.com/enablerdao)でオープンソースとして公開しています。*`,
    author: "EnablerDAO",
    publishedAt: "2026-03-04",
    tags: ["newsletter", "conversion", "resend", "cta", "growth"],
    category: "Engineering",
  },
  {
    slug: "business-metrics-dashboard-2026-02-25",
    title: "ビジネスKPIダッシュボード構築 -- GA4からStripe/Chatweb直接指標への移行",
    description:
      "間接的なGA4メトリクス（PV/セッション）から、MRR・有料会員数・ユーザー数など直接的なビジネスKPIに置き換え。データ取得も大幅に簡略化。",
    content: `## 概要

EBRトークンホルダー専用ダッシュボードのデータソースを、Google Analytics 4（GA4）から直接的なビジネスKPIに全面置き換えしました。

## なぜGA4をやめたのか

| 課題 | 詳細 |
|------|------|
| 間接的な指標 | PV/セッションは「何人が見たか」であり「ビジネスがどう動いているか」ではない |
| セットアップの複雑さ | サービスアカウントJSON + JWT署名 + OAuth2トークン交換 + 9プロパティの設定 |
| 遅延 | GA4データは24-48時間遅れ |
| コスト | API quota管理が必要 |

## 新しいデータソース

4つのAPIから\`Promise.allSettled\`で並行取得。1つが落ちても他は表示されます。

| ソース | データ | 認証 |
|--------|--------|------|
| **Stripe API** | MRR、有料会員数、プラン別内訳 | STRIPE_SECRET_KEY |
| **Chatweb.ai Admin** | 総ユーザー数、本日アクティブ、チャネル別セッション | CHATWEB_ADMIN_KEY |
| **Solscan** | EBRトークンホルダー数 | 不要（公開API） |
| **GitHub** | スター数、リポジトリ数 | 不要（公開API） |

## 新しいKPIカード

ダッシュボードのメイン表示は4つのKPIカードに変更:

\`\`\`
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Total Users  │ Paid Subs    │ MRR (USD)    │ MRR (JPY)    │
│ 210          │ 12           │ $342.00      │ ¥45,600      │
└──────────────┴──────────────┴──────────────┴──────────────┘
\`\`\`

## 通貨の扱い

USD/JPYは変換せず別々に表示します。為替変動リスクを避け、直感的でわかりやすい表示を優先しました。

### 既知の商品マッピング

| Price ID | 商品名 | 価格 |
|----------|--------|------|
| price_1Sy5nc... | Chatweb.ai Starter | $9/mo |
| price_1Sy5nd... | Chatweb.ai Pro | $29/mo |
| price_1T1T9q... | StayFlow Starter | \\2,900/mo |
| price_1T1T9r... | StayFlow Pro | \\7,900/mo |

## JSONエクスポート

\`$ export --json\` ボタンを追加。ダッシュボードの全データをJSONファイルとしてダウンロードできます。外部ツールでの分析や記録に活用してください。

## 変更ファイル

| ファイル | 変更 |
|---------|------|
| \`route.ts\` | GA4コード全削除 → 4フェッチャーに置換 |
| \`DashboardClient.tsx\` | KPI4枚 + Revenue内訳 + Chatweb + Community + Export |
| \`page.tsx\` | metadata更新 |
| \`.env.example\` | STRIPE_SECRET_KEY, CHATWEB_ADMIN_KEY追記 |

## まとめ

GA4の9プロパティ設定 + サービスアカウントJWT → Stripe fetch 1回 + 公開API 2回に簡略化。**ビジネスの健全性が一目でわかる**ダッシュボードになりました。

---

*すべてのコードは[GitHub](https://github.com/enablerdao)でオープンソースとして公開しています。*`,
    author: "EnablerDAO",
    publishedAt: "2026-02-25",
    tags: ["dashboard", "stripe", "kpi", "analytics", "engineering"],
    category: "Engineering",
  },
  {
    slug: "dao-board-meeting-okr-2026-02-24",
    title: "EnablerDAO 全プロダクト経営会議 -- 「どうすればうまくいくか」のOKR公開",
    description:
      "16プロダクトそれぞれの経営会議を実施。辞める・凍結ではなく「どうすれば成功するか」を全力で議論し、各プロダクトのOKRを策定。みんなの力で育てていくDAOの全記録。",
    content: `## はじめに

EnablerDAOは「みんなで作って、みんなで育てる」をモットーに、16のプロダクトを運営しています。今回、全プロダクトの経営会議をDAO形式で開催し、**「どうすればうまくいくか」**を前向きに議論しました。

各プロダクトのOKR（Objectives and Key Results）を公開します。あなたのアイデアやフィードバックが、次の成長のきっかけになるかもしれません。

**全体テーマ**: 現在、多くのプロダクトがLovable+Supabaseで構築されていますが、Supabaseのroleキーが取り出せないなど移行の課題があります。全プロダクトを**Rust + Fly.io + SQLite/libSQL**に統一し、低レイヤーで超高速なアーキテクチャを目指しています。全てAIが書くので開発コストは低く抑えつつ、パフォーマンスは最大化する戦略です。ベストプラクティスやアイデアを募集中です。

---

## Chatweb.ai — 日本発AIエージェント

**現状**: 30K+リクエスト/日、210ユーザー、LLMコスト月$800

**会議ハイライト**: NVIDIAのNemotron日本語9Bモデル導入でLLMコストを**$800→$52/月（93%削減）**に。この余力でFreeプランのクレジットを100→500に拡充し、ユーザー体験を大幅改善する。

| OKR | 期限 |
|-----|------|
| **O: LLMコストを月$100以下にしつつユーザー体験を向上** | Q1 |
| KR1: Nemotron Japanese版をeconomyティアに本番投入 | 3月中 |
| KR2: Freeプラン500クレジットに増量、新規登録率+30% | 3月中 |
| KR3: 月間アクティブユーザー500人突破 | Q1末 |
| **O: teai.io を開発者向けAIエージェントとして独立ブランド化** | Q2 |
| KR1: 専用UI（緑テーマ、英語ベース）をデプロイ | 3月初旬 |
| KR2: Developer/Teamプラン（$19/$49）のStripe連携 | 3月中 |
| KR3: Product Huntローンチ、初月100ユーザー | 4月 |

---

## StayFlow — 無料×AI×日本語の民泊管理

**現状**: 1,860 UV/月、500+施設、満足度4.9/5、Stripe Live Ready

**会議ハイライト**: 500施設は「品質の証明」。ボトルネックは収益化スピード。Beds24リアルタイム同期を「Pro限定」にして有料転換のフックに。

| OKR | 期限 |
|-----|------|
| **O: MRR ¥100万を達成する** | Q2 |
| KR1: Beds24 Webhookリアルタイム同期を実装（Pro限定） | 3月10日 |
| KR2: 有料プラン転換率5%達成（25施設） | Q2末 |
| KR3: コンテンツSEOで月間UV 5,000突破 | Q2末 |
| **O: enabler.funに直接予約機能を実装** | Q2 |
| KR1: 空き状況カレンダー + 予約フォームMVP完成 | 4月中 |
| KR2: LINE通知連携（予約確認・ステータス変更） | 4月中 |
| KR3: Airbnb手数料より5%安い直接予約プランを提示 | 5月 |

---

## JiuFlow — 柔術を、体系で学ぶ

**現状**: サービス開始済み。テクニック動画200本、月額¥2,900、村田良蔵監修、4K俯瞰撮影。2〜3月いっぱいまで無料体験期間中で、4月から有料課金が始まるユーザーがいる段階。

**会議ハイライト**: すでにサービスは開始しており、無料期間中のユーザーの有料転換が最優先課題。カリキュラム公開ページを新設し、「何が学べるか」を登録前に見せて新規獲得も並行。

**技術課題**: 現在LovableでビルドしておりSupabaseに依存。Supabaseのroleキーが取り出せず移行に苦戦中。SQLiteまたはlibSQLへの移行を検討中（アイデア募集中）。

| OKR | 期限 |
|-----|------|
| **O: 無料ユーザーの有料転換率50%以上を達成** | Q1末 |
| KR1: 無料期間終了前のリテンション施策（メール・通知）実施 | 3月中 |
| KR2: 有料転換率50%以上（無料→月額¥2,900） | 3月末 |
| KR3: 有料会員30人達成 | 3月末 |
| **O: Supabase依存を脱却しRust+SQLiteに移行** | Q2 |
| KR1: Supabase roleキー問題の回避策を確立 | 4月中 |
| KR2: データベースをSQLite/libSQLに完全移行 | Q2末 |
| KR3: Lovableビルドから自前Rust SSRに切替 | Q2末 |
| **O: コンテンツを競合レベルに拡充** | Q3 |
| KR1: 動画本数を500本に（現200本） | Q3末 |
| KR2: ゲスト講師2名以上を招聘 | Q3末 |
| KR3: 英語字幕対応で海外展開開始 | Q3末 |

---

## SOLUNA / ZAMNA Hawaii — リアルイベントプラットフォーム

**現状**: 2026年9月4日開催、GA$120/VIP$1,000、solun.art稼働中

**会議ハイライト**: チケット販売とアーティスト発表のタイミングが最重要。3フェーズマーケティング戦略でレイバーデーウィークエンドに照準。

| OKR | 期限 |
|-----|------|
| **O: ZAMNA Hawaii チケット完売を達成** | 9月4日 |
| KR1: メール登録バックエンドを実装（現在simulateのみ） | 3月中 |
| KR2: アーティスト第1弾発表 + チケット販売本格化 | 4月 |
| KR3: GA 1,000枚 + VIP 100枚完売 | 8月末 |

---

## ミセバンAI — 防犯カメラをAI店長に

**現状**: v27デプロイ済み、LP完成度95%、明日アーリーアクセスリリース

**会議ハイライト**: AI推論がまだmock状態であることを正直に開示しつつリリース。「完璧を待たずに出す」判断。31本の開発Sprint日記の全公開が最大の差別化。

| OKR | 期限 |
|-----|------|
| **O: アーリーアクセスで初期ユーザーを獲得** | Q1 |
| KR1: PR TIMES配信 + SNS投稿で問い合わせ30件 | リリース1週間 |
| KR2: 実店舗カメラ接続テスト3件完了 | 3月中 |
| KR3: AI推論をmockから実装に切替（YOLO統合） | 4月中 |
| **O: 代理店チャネルを構築** | Q2 |
| KR1: 代理店パートナー5社契約 | Q2末 |
| KR2: 代理店経由導入10店舗 | Q2末 |

---

## Elio — 完全オフラインAIチャット

**現状**: iOS/macOS、30+LLMモデル、P2P推論、v1.2.38 build49、150テスト全パス

**会議ハイライト**: 「完全オフラインAI」は他にないポジション。3バグ修正完了、リリース可能状態。App Store審査通過が最優先。

| OKR | 期限 |
|-----|------|
| **O: App Storeで安定した評価を確立** | Q2 |
| KR1: v1.2.38をApp Storeリリース | 3月初旬 |
| KR2: App Store評価4.5以上を維持 | Q2末 |
| KR3: DAU 500達成 | Q2末 |
| **O: P2P推論ネットワークを実用化** | Q3 |
| KR1: P2Pフレンド接続成功率90%以上 | Q2末 |
| KR2: P2P推論レイテンシ3秒以内 | Q3末 |

---

## BANTO — 建設業向け請求書AI

**現状**: 50+テーブル、35 Edge Functions、133テスト、バックエンドAPI停止中

**会議ハイライト**: コードベースは資産。バックエンドをSupabase版に一本化して復旧し、建設業コミュニティへの再アプローチを図る。

| OKR | 期限 |
|-----|------|
| **O: サービスを復旧し初期ユーザーを獲得** | Q2 |
| KR1: Supabase版バックエンドに一本化、CI/CD修復 | 3月中 |
| KR2: 建設業向けSNS/コミュニティで認知獲得 | 4月 |
| KR3: 実ユーザー10社の利用開始 | Q2末 |

---

## その他のプロダクト

### News.cloud / ChatNews — ニュースAI集約

| OKR | 期限 |
|-----|------|
| **O: MVPリリースし初期ユーザーを獲得** | Q2 |
| KR1: AIによるニュース要約・カテゴリ分類エンジン構築 | 4月 |
| KR2: Web版MVP公開、100ユーザー登録 | Q2末 |
| KR3: 1日100記事以上を自動集約・配信 | Q2末 |

### DojoC — セキュリティ教育プラットフォーム

| OKR | 期限 |
|-----|------|
| **O: コンテンツ充実で教育プラットフォームとして確立** | Q3 |
| KR1: セキュリティ教育コンテンツ50レッスン達成 | Q3末 |
| KR2: ハンズオンラボ環境を10シナリオ提供 | Q3末 |
| KR3: 月間アクティブ学習者200人 | Q3末 |

### Totonos — マルチテナントSaaS基盤

| OKR | 期限 |
|-----|------|
| **O: アクティブ会員100人を突破** | Q3 |
| KR1: CRM/HR/会計の3モジュール安定稼働 | Q2末 |
| KR2: Rust + SQLiteのマルチテナント基盤をOSS公開 | Q3末 |
| KR3: 有料アクティブ会員100人突破 | Q3末 |

---

## DAOとしてのメッセージ

これらのOKRは「約束」ではなく「挑戦」です。EnablerDAOは営利企業ではなく、**みんなで作って、みんなで育てるコミュニティ**です。

- プロダクトを使ってフィードバックをくれる人
- コードを書いてコントリビュートしてくれる人
- アイデアを投稿してくれる人
- SNSでシェアしてくれる人

すべての参加が、DAOの力になります。

**[アイデアを投稿する →](/ideas)**

あなたの「こんなのあったらいいな」が、次のプロダクトになるかもしれません。

---

*すべてのコードは[GitHub](https://github.com/enablerdao)でオープンソースとして公開しています。*`,
    author: "EnablerDAO",
    publishedAt: "2026-02-24",
    tags: ["okr", "strategy", "dao", "transparency", "community", "management"],
    category: "DAO Governance",
  },
  {
    slug: "agent-meeting-2026-02-24",
    title: "2026年2月 エージェント会議録 -- 16プロダクトの現在地と収益化への道",
    description:
      "CEO/CTO/CMO/Productの4エージェントによる疑似会議を実施。全プロダクトの状況点検、本番環境の課題発見、収益化フェーズへのアクション決定までを透明に公開します。",
    content: `## 概要

EnablerDAOでは、透明性のある組織運営の一環として、AIエージェントによる疑似会議を定期的に開催しています。今回はCEO/CTO/CMO/Product の4つのロールで、全プロダクトの状況点検と次のアクション策定を行いました。

## 会議参加エージェント

- **CEO Agent**: 全体戦略と優先順位の決定
- **CTO Agent**: 技術的な課題とアーキテクチャの評価
- **CMO Agent**: マーケティングと成長戦略の提案
- **Product Agent**: プロダクトロードマップの管理

## Flagship 3プロダクトの現在地

### StayFlow -- Revenue Ready

民泊・宿泊施設の運営一元管理SaaS。日本唯一の「無料 x AI x 日本語」ソリューションとして、すでに1,860 UV/月、500+施設の導入実績があります。Stripe連携（Starter \\2,900/月、Pro \\7,900/月）が完了し、有料化のGo Liveが目前です。

| 指標 | 値 |
|---|---|
| 月間UV | 1,860 |
| 導入施設数 | 500+ |
| Edge Functions | 43 |
| 顧客満足度 | 4.9/5 |

### Chatweb.ai -- PMF Phase

マルチモデルAIエージェント。LINE・Telegram・Webから利用可能で、Rust製Lambda基盤により99.99%のuptimeを実現。30K+ req/日、210ユーザーまで成長しました。

| 指標 | 値 |
|---|---|
| 日次リクエスト | 30K+ |
| ユーザー数 | 210 |
| Uptime | 99.99% |
| Lambda Version | v275 |

### JitsuFlow -- Content Growth

ブラジリアン柔術の総合プラットフォーム。355選手、227道場、229大会のデータベースを構築中。世界最大級のBJJデータアグリゲーターを目指しています。

## CTO Agentが発見した技術的課題

今回の点検で、CTO Agentが以下の問題を検出しました。

### enablerdao.com の本番デプロイ乖離

ローカルのソースコードには11ページ + ブログ個別ページが存在しますが、本番環境（Fly.io version 78）では3ページ（\`/\`, \`/projects\`, \`/blog\`）しかアクセスできず、残り8ページ（\`/token\`, \`/verify\`, \`/install\`, \`/security\`, \`/status\`, \`/dao\`, \`/qa\`, \`/live\`）が404を返していました。

これは最新のビルドが正しくデプロイされていないことが原因です。

### その他の技術的課題

- ESLint設定の不整合（\`eslint-config-next/core-web-vitals\` のimportパス）
- \`@react-email/render\` 依存関係の未解決
- projects/page.tsx の lastUpdate 日付が2025年のまま
- status/page.tsx で「Enabler」プロジェクトが重複定義

## CMO Agentの成長提案

- ブログ更新頻度を週1回以上に引き上げ、SEOとコンテンツマーケティングを強化
- トップページのCTAを「StayFlowを無料で始める」に集中させ、コンバージョンを最大化
- 404ページの解消はSEOにも直結する緊急課題

## 決定事項

今回の会議で以下のアクションが決定しました。

1. **緊急**: enablerdao.com の全ページを本番デプロイし、8ページの404を解消
2. **今週中**: プロジェクトデータの日付・統計値を最新化
3. **今週中**: ESLintと依存関係の警告を解消
4. **今月中**: ブログ記事を4本以上公開
5. **2026-Q2**: StayFlow有料化Go Liveを最優先。MRR 100万円への道筋を具体化

## EnablerDAOの透明性について

私たちがこのような内部会議の内容をそのまま公開するのは、DAOとしての透明性を実践するためです。普通の会社なら社内会議の議事録は非公開ですが、EnablerDAOでは、良い点も課題も含めてすべてオープンにします。

404ページの問題も、プロダクトの課題も、隠さずに公開する。それがDAOとしての誠実さだと考えています。

すべてのコードは[GitHub](https://github.com/yukihamada)でオープンソースとして公開しています。フィードバックやコントリビューションはいつでも歓迎です。`,
    author: "EnablerDAO",
    publishedAt: "2026-02-24",
    tags: ["meeting", "strategy", "transparency", "roadmap", "dao"],
    category: "DAO Governance",
  },
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
| EnablerDAO | Next.js 16 / TypeScript | XSS対策、Webhook認証、レースコンディション修正 |
| DojoC | Next.js 16 / TypeScript | メジャーアップグレード（14→16）、セキュリティ脆弱性全解消 |

## セキュリティ修正の詳細

### XSS対策（EnablerDAO）
メール自動返信のWebhookで、ユーザー入力がHTMLにエスケープなしで埋め込まれていた問題を修正。\`escapeHtml\`関数を追加し、\`&\`, \`<\`, \`>\`, \`"\`, \`'\`の5文字をエンティティに変換するようにしました。

### Webhook認証の強化
Resend Webhookのリクエストに対して、HMAC-SHA256署名検証を実装。\`crypto.timingSafeEqual\`によるタイミングセーフな比較で、署名偽造攻撃を防止します。

### レースコンディション対策
Q&Aストアのファイル書き込みにロック機構を追加。複数のリクエストが同時にファイルを書き込んだ際にデータが破損する問題を解消しました。


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
