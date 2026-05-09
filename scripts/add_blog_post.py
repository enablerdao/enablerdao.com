#!/usr/bin/env python3
"""
add_blog_post.py — enablerdao.com blog_seed.json appender.

Usage:
  # direct CLI args
  python3 scripts/add_blog_post.py \
    --title "記事タイトル" \
    --slug "my-post-2026-04-10" \
    --description "要約" \
    --body-file path/to/body.md \
    --tags "rust,saas,devlog" \
    --category "Engineering" \
    --author "Yuki Hamada" \
    --date 2026-04-10

  # from a markdown file with frontmatter
  python3 scripts/add_blog_post.py --from-markdown drafts/2026-04-10-my-post.md

Env:
  DRY_RUN=1    Print diff summary only, do not write.

Schema (blog_seed.json entry):
  slug:        str, unique (kebab-case, usually ends with -YYYY-MM-DD)
  title:       str
  description: str  (<=160 chars recommended, OGP description)
  content:     str  (raw markdown body)
  author:      str
  publishedAt: str  (YYYY-MM-DD)
  tags:        list[str]
  category:    str  (Engineering / DAO Governance / Analytics / Design / Team / DevLog)
"""
from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import sys
from datetime import date
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
SEED_PATH = REPO_ROOT / "static" / "blog_seed.json"
BACKUP_DIR = REPO_ROOT / "static" / ".blog_seed_backups"

VALID_CATEGORIES = {
    "Engineering",
    "DAO Governance",
    "Analytics",
    "Design",
    "Team",
    "DevLog",
}


def load_seed() -> list[dict]:
    with open(SEED_PATH, encoding="utf-8") as f:
        return json.load(f)


def save_seed(posts: list[dict]) -> None:
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    ts = date.today().isoformat()
    backup = BACKUP_DIR / f"blog_seed.{ts}.json"
    shutil.copy2(SEED_PATH, backup)
    with open(SEED_PATH, "w", encoding="utf-8") as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"[ok] wrote {SEED_PATH} (backup: {backup.relative_to(REPO_ROOT)})")


def parse_frontmatter(text: str) -> tuple[dict, str]:
    """Parse YAML-ish frontmatter from a markdown file.

    Supports:
      ---
      title: foo
      tags: [a, b, c]
      ---
      body...
    """
    if not text.startswith("---"):
        return {}, text
    end = text.find("\n---", 3)
    if end == -1:
        return {}, text
    raw = text[3:end].strip()
    body = text[end + 4 :].lstrip("\n")
    meta: dict = {}
    for line in raw.splitlines():
        line = line.rstrip()
        if not line or line.startswith("#"):
            continue
        if ":" not in line:
            continue
        key, _, val = line.partition(":")
        key = key.strip()
        val = val.strip()
        # list form: [a, b, c]
        if val.startswith("[") and val.endswith("]"):
            items = [
                x.strip().strip('"').strip("'")
                for x in val[1:-1].split(",")
                if x.strip()
            ]
            meta[key] = items
        else:
            meta[key] = val.strip('"').strip("'")
    return meta, body


def build_entry(
    *,
    title: str,
    slug: str,
    description: str,
    content: str,
    author: str,
    published_at: str,
    tags: list[str],
    category: str,
) -> dict:
    if category not in VALID_CATEGORIES:
        print(
            f"[warn] category '{category}' not in {sorted(VALID_CATEGORIES)}; using anyway",
            file=sys.stderr,
        )
    return {
        "slug": slug,
        "title": title,
        "description": description,
        "content": content,
        "author": author,
        "publishedAt": published_at,
        "tags": tags,
        "category": category,
    }


def append_entry(entry: dict, *, dry_run: bool) -> int:
    posts = load_seed()
    existing_slugs = {p["slug"] for p in posts}
    if entry["slug"] in existing_slugs:
        print(f"[error] slug already exists: {entry['slug']}", file=sys.stderr)
        return 2

    before = len(posts)
    posts.append(entry)
    after = len(posts)

    print("=" * 60)
    print(f"  slug:        {entry['slug']}")
    print(f"  title:       {entry['title']}")
    print(f"  description: {entry['description'][:80]}...")
    print(f"  author:      {entry['author']}")
    print(f"  publishedAt: {entry['publishedAt']}")
    print(f"  category:    {entry['category']}")
    print(f"  tags:        {entry['tags']}")
    print(f"  content len: {len(entry['content'])} chars")
    print(f"  posts:       {before} -> {after}")
    print("=" * 60)

    if dry_run:
        print("[dry-run] DRY_RUN=1 set, not writing")
        return 0

    save_seed(posts)
    return 0


def from_markdown(path: Path, dry_run: bool) -> int:
    text = path.read_text(encoding="utf-8")
    meta, body = parse_frontmatter(text)

    slug = meta.get("slug") or path.stem
    title = meta.get("title") or slug
    description = meta.get("description") or ""
    author = meta.get("author") or "Yuki Hamada"
    published_at = meta.get("date") or date.today().isoformat()
    tags = meta.get("tags") or []
    if isinstance(tags, str):
        tags = [t.strip() for t in tags.split(",") if t.strip()]
    category = meta.get("category") or "Engineering"

    entry = build_entry(
        title=title,
        slug=slug,
        description=description,
        content=body.strip(),
        author=author,
        published_at=published_at,
        tags=tags,
        category=category,
    )
    return append_entry(entry, dry_run=dry_run)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--from-markdown", type=Path, help="Markdown file with frontmatter")
    ap.add_argument("--title")
    ap.add_argument("--slug")
    ap.add_argument("--description")
    ap.add_argument("--body-file", type=Path, help="Path to markdown body (no frontmatter)")
    ap.add_argument("--body", help="Inline markdown body")
    ap.add_argument("--tags", default="", help="Comma-separated tags")
    ap.add_argument("--category", default="Engineering")
    ap.add_argument("--author", default="Yuki Hamada")
    ap.add_argument("--date", default=date.today().isoformat())
    ap.add_argument("--ogp-image", help="(optional) recorded as trailing metadata line")

    args = ap.parse_args()
    dry_run = os.environ.get("DRY_RUN") == "1"

    if args.from_markdown:
        return from_markdown(args.from_markdown, dry_run)

    required = ["title", "slug", "description"]
    missing = [k for k in required if not getattr(args, k)]
    if missing:
        ap.error(f"missing required args: {missing}")

    if args.body_file:
        content = args.body_file.read_text(encoding="utf-8")
    elif args.body:
        content = args.body
    else:
        ap.error("need --body-file or --body or --from-markdown")
        return 1

    tags = [t.strip() for t in args.tags.split(",") if t.strip()]

    entry = build_entry(
        title=args.title,
        slug=args.slug,
        description=args.description,
        content=content,
        author=args.author,
        published_at=args.date,
        tags=tags,
        category=args.category,
    )
    return append_entry(entry, dry_run=dry_run)


if __name__ == "__main__":
    sys.exit(main())
