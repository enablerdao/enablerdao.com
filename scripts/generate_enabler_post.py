#!/usr/bin/env python3
"""
generate_enabler_post.py — AI記事ジェネレータ (テンプレ枠)

Usage:
  python3 scripts/generate_enabler_post.py \
    --keyword "AI ソロ起業" \
    --target-word-count 2200 \
    --category Engineering

Output:
  drafts/YYYY-MM-DD-{slug}.md  (frontmatter付きMarkdown)

パイプライン (TODO):
  1. RunPod Nemotron 9B pod (~/.env: RUNPOD_NEMOTRON_URL) で日本語ドラフト生成
  2. Gemini 2.5 Flash で文体統一 / 翻訳 / tone調整 (GEMINI_API_KEY)
  3. Claude Sonnet 4.6 で事実チェック+内部リンク整合性レビュー (ANTHROPIC_API_KEY)
  4. drafts/ に書き出し → 人間確認 → scripts/daily_publish.sh で投入
"""
from __future__ import annotations

import argparse
import re
import sys
from datetime import date
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DRAFTS_DIR = REPO_ROOT / "drafts"


def slugify(keyword: str, today: str) -> str:
    base = re.sub(r"[^\w\s-]", "", keyword.lower())
    base = re.sub(r"[\s_]+", "-", base).strip("-") or "post"
    # Keep ASCII only for slug safety
    base = re.sub(r"[^a-z0-9-]", "", base)
    if not base:
        base = "post"
    return f"{base}-{today}"


def render_template(*, keyword: str, word_count: int, slug: str, today: str, category: str) -> str:
    # TODO: ここで Nemotron pod (RunPod) → Gemini Flash翻訳 → Claude Sonnet レビュー
    # 現在はテンプレ枠のみ。人間が書き足すかAIが埋める前提。
    frontmatter = (
        "---\n"
        f'title: "【下書き】{keyword} — 2026年のEnablerの視点"\n'
        f"slug: {slug}\n"
        f"date: {today}\n"
        f'description: "{keyword}について、ローカルファースト×ユーザー所有経済の観点で掘り下げる下書き記事。"\n'
        f'tags: [{keyword.replace(" ", "-")}, enablerdao, devlog]\n'
        f"lang: ja\n"
        f"category: {category}\n"
        f"author: AI\n"
        "---\n\n"
    )

    body = f"""## TL;DR

- **キーワード**: {keyword}
- **狙い**: {keyword} を Enabler の哲学（オープンソース・ローカルファースト・ユーザー利益還元）に紐付けて語る
- **想定字数**: 約 {word_count} 字

---

## 1. イントロ (300字)

<!-- TODO: Nemotron pod で日本語ドラフト生成 -->
<!-- ここに {keyword} の現状/課題 を書く -->

## 2. 背景 (500字)

<!-- TODO: なぜ今 {keyword} なのか。過去10年の流れ -->

## 3. Enablerの立場 (500字)

<!-- TODO: ローカルファースト / ユーザー所有経済 の観点で語る -->
<!-- 内部リンク2つ以上: /blog/ai-cxo-team-2026-03-30 などから選ぶ -->

## 4. 実装/実例 (600字)

<!-- TODO: Rust + Fly.io + SQLite の具体例 -->
<!-- コードブロックは `rust` で統一 -->

## 5. 次の一手 (300字)

<!-- TODO: 読者へのアクション提案 -->

---

## CTA

もしこのアプローチに興味があれば:

- **KAGI** — Chat + Claude Code統合: <https://chatweb.ai>
- **Pasha** — AI家計簿 iOS: <https://pasha.run>
- **Koe** — 声で入力するデバイス: <https://koe.live>
- **Elio** — P2P分散AI推論: <https://elio.love>

---

*EnablerDAO / {today}*
"""
    return frontmatter + body


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--keyword", required=True)
    ap.add_argument("--target-word-count", type=int, default=2000)
    ap.add_argument("--category", default="Engineering")
    ap.add_argument("--slug", help="明示スラッグ (省略時はkeywordから生成)")
    args = ap.parse_args()

    today = date.today().isoformat()
    slug = args.slug or slugify(args.keyword, today)

    DRAFTS_DIR.mkdir(parents=True, exist_ok=True)
    out_path = DRAFTS_DIR / f"{today}-{slug}.md"
    if out_path.exists():
        print(f"[error] already exists: {out_path}", file=sys.stderr)
        return 2

    content = render_template(
        keyword=args.keyword,
        word_count=args.target_word_count,
        slug=slug,
        today=today,
        category=args.category,
    )
    out_path.write_text(content, encoding="utf-8")
    print(f"[ok] wrote draft: {out_path.relative_to(REPO_ROOT)}")
    print(f"  slug: {slug}")
    print(f"  category: {args.category}")
    print(f"  next: edit → python3 scripts/add_blog_post.py --from-markdown {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
