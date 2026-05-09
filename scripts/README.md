# enablerdao.com — Blog 追記スクリプト (P4)

既存の `static/blog_seed.json` + Rust/Spin ブログ基盤に、1日1記事を自動追記するパイプライン。

## ファイル構成

```
scripts/
├── add_blog_post.py          # blog_seed.json 追記本体
├── generate_enabler_post.py  # AI記事ジェネレータ (テンプレ枠)
├── daily_publish.sh          # 1日1記事の自動投入
└── README.md                 # ← このファイル

drafts/                       # 未公開ドラフト置き場
└── .published/               # 公開済みドラフト退避
```

## blog_seed.json スキーマ

```jsonc
{
  "slug":        "my-post-2026-04-10",   // ユニーク, kebab-case
  "title":       "記事タイトル",
  "description": "OGP/カード用 (160字以内推奨)",
  "content":     "## 見出し\n\n本文Markdown...",
  "author":      "Yuki Hamada",
  "publishedAt": "2026-04-10",           // YYYY-MM-DD
  "tags":        ["rust", "saas"],
  "category":    "Engineering"           // Engineering | DAO Governance | Analytics | Design | Team | DevLog
}
```

Rust側の読み込みは `spin-component/src/data.rs` の `BlogPost` に対応。`include_str!` で埋め込まれるため、**JSON変更後は Rust のリビルドが必要** (`fly deploy --remote-only -a enablerdao`)。

## 使い方

### 1. Markdownドラフトを書く

`drafts/` 以下に frontmatter 付きの `.md` を置く:

```markdown
---
title: "記事タイトル"
slug: my-post-2026-04-10
date: 2026-04-10
description: "要約"
tags: [rust, saas, devlog]
category: Engineering
author: Yuki Hamada
---

## 本文

...
```

### 2. 追記 (単発)

```bash
# DRY-RUN (diff のみ)
DRY_RUN=1 python3 scripts/add_blog_post.py \
  --from-markdown drafts/2026-04-10-my-post.md

# 本当に書き込む
python3 scripts/add_blog_post.py \
  --from-markdown drafts/2026-04-10-my-post.md
```

引数直接指定も可能:

```bash
python3 scripts/add_blog_post.py \
  --title "タイトル" \
  --slug my-post-2026-04-10 \
  --description "要約" \
  --body-file path/to/body.md \
  --tags "rust,saas" \
  --category Engineering
```

既存slugが重複するとエラー終了 (exit 2)。バックアップは `static/.blog_seed_backups/` に日付付きで保存。

### 3. 毎日1本を自動投入

```bash
# DRY-RUN
DRY_RUN=1 bash scripts/daily_publish.sh

# 本番
bash scripts/daily_publish.sh
```

- `drafts/` の先頭1件 (日付ソート昇順) を拾って追記
- 成功したら `drafts/.published/` に移動
- `TELEGRAM_BOT_TOKEN` があれば通知
- **fly deploy はコメントアウト済み** (ユーザー承認待ち)

### 4. AI記事ドラフト生成 (テンプレ枠)

```bash
python3 scripts/generate_enabler_post.py \
  --keyword "AI ソロ起業" \
  --target-word-count 2200 \
  --category Engineering
```

現在は空テンプレしか生成しない。中身を埋めるパイプラインは TODO:

1. **RunPod Nemotron 9B pod** (日本語ネイティブドラフト生成)
2. **Gemini 2.5 Flash** (文体統一・要約・tone調整)
3. **Claude Sonnet 4.6** (事実チェック・内部リンク整合性レビュー)
4. 出力を `drafts/` に書き出し → 人間確認 → `add_blog_post.py`

## デプロイ

```bash
cd /Users/yuki/workspace/enablerdao.com
git diff static/blog_seed.json   # 変更確認
fly deploy --remote-only -a enablerdao
```

`blog_seed.json` は `data.rs` で `include_str!` されているため、**必ずRustビルドが再実行される**。`fly deploy` で自動的にリビルドされる。

## 自動化の将来計画

短期 (1ヶ月):

- [ ] `generate_enabler_post.py` の AI パイプライン実装
- [ ] `daily_publish.sh` の fly deploy コメント解除 (承認後)
- [ ] GitHub Actions で毎朝 08:00 JST に `daily_publish.sh` を走らせる

中期 (3ヶ月):

- [ ] Saku (46.225.229.16) cron に組み込み (週次 + 日次のハイブリッド)
- [ ] アクセスログ (Plausible/GA4) から「刺さったKW」を学習して次記事に反映
- [ ] 内部リンクを自動提案 (既存29記事 + 追加記事を embedding で類似度計算)

長期 (半年):

- [ ] 美咲 (CMO) エージェントが日次で記事を書く → 翔太 (CTO) がレビュー → Yuki が最終判断
- [ ] Reader Analytics: どの段落で離脱したか、どのCTAがクリックされたかを記録
- [ ] A/Bタイトル・A/B CTA

## KW候補リスト (20)

| # | キーワード | カテゴリ | ねらい |
|---|---|---|---|
| 1 | AI ソロ起業 | DAO Governance | ✅ 本日投入 |
| 2 | ローカルファースト | DAO Governance | ✅ 本日投入 |
| 3 | Rust SaaS | Engineering | ✅ 本日投入 |
| 4 | Rust + WASM | Engineering | Fermyon Spin の実例 |
| 5 | SQLite WAL mode | Engineering | 小規模SaaS の DB戦略 |
| 6 | Fly.io Tokyo latency | Engineering | nrt リージョン実測 |
| 7 | Claude Code CLI | Engineering | chatweb.ai 実装記 |
| 8 | 電子帳簿保存法 AI | DAO Governance | Pasha の背景 |
| 9 | App Store 審査 リジェクト | DevLog | Pasha / JiuFlow 実体験 |
| 10 | Nemotron ローカル推論 | Engineering | Mac M5 の活用 |
| 11 | RunPod Serverless | Engineering | コスト比較 |
| 12 | Swift UI OCR | Engineering | Vision + ReceiptParser |
| 13 | ESP32 Rust 音声 | Engineering | Koe Device |
| 14 | DAO トレジャリー | DAO Governance | EnablerDAO運営実例 |
| 15 | OSS ライセンス MIT vs AGPL | DAO Governance | 戦略会議の続編 |
| 16 | Solana トークン設計 | DAO Governance | ENAI / EBR |
| 17 | ユーザー所有経済 | DAO Governance | Web3 + ローカルファースト |
| 18 | AI エージェント 協調 | Engineering | OpenClaw fleet の知見 |
| 19 | Askama テンプレート | Engineering | Rust + Askama 実例 |
| 20 | iOS TestFlight 自動化 | DevLog | fastlane + API Key |

## 制約 (このP4イテレーション)

- **既存 blog_seed.json の破壊禁止** — 必ずバックアップ取って追記
- **fly deploy 禁止** — コードと記事だけ作成、ユーザーが手動で承認
- **Rustコード変更禁止** — `scripts/` と `static/blog_seed.json` と `drafts/` のみ
- 秘密情報出力禁止
- git コミット禁止 (ユーザーが手動で)
