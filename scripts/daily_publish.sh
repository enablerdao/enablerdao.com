#!/usr/bin/env bash
# daily_publish.sh — 1日1記事を blog_seed.json に追記するパイプライン
#
# 動作:
#   1. drafts/ から未公開記事を拾う (`.md` + frontmatter必須)
#   2. add_blog_post.py --from-markdown で blog_seed.json に追記
#   3. git diff があれば fly deploy (コメントアウト。ユーザー承認必要)
#   4. TELEGRAM_BOT_TOKEN があれば通知
#
# env:
#   DRY_RUN=1          変更せずサマリだけ
#   TELEGRAM_BOT_TOKEN  通知Token (省略可)
#   TELEGRAM_CHAT_ID    デフォルト 1136442501

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DRAFTS_DIR="$REPO_ROOT/drafts"
PUBLISHED_DIR="$REPO_ROOT/drafts/.published"
ADD_SCRIPT="$REPO_ROOT/scripts/add_blog_post.py"

mkdir -p "$PUBLISHED_DIR"

DRY_RUN="${DRY_RUN:-0}"
TG_CHAT_ID="${TELEGRAM_CHAT_ID:-1136442501}"

echo "[info] daily_publish.sh start (DRY_RUN=$DRY_RUN)"

# 1本だけ取り出す (日付順でソート、先頭)
candidate="$(ls -1 "$DRAFTS_DIR"/*.md 2>/dev/null | sort | head -n 1 || true)"

if [[ -z "$candidate" ]]; then
  echo "[info] no drafts to publish"
  exit 0
fi

echo "[info] candidate: $(basename "$candidate")"

# 2. 追記
if [[ "$DRY_RUN" == "1" ]]; then
  DRY_RUN=1 python3 "$ADD_SCRIPT" --from-markdown "$candidate"
  echo "[dry-run] would move $(basename "$candidate") -> drafts/.published/"
  exit 0
fi

python3 "$ADD_SCRIPT" --from-markdown "$candidate"

# 3. drafts/.published/ に退避
mv "$candidate" "$PUBLISHED_DIR/"
echo "[ok] moved to $PUBLISHED_DIR/$(basename "$candidate")"

# 4. デプロイ (要承認 - コメントアウト済み)
#
# cd "$REPO_ROOT"
# if git diff --quiet static/blog_seed.json; then
#   echo "[info] no changes to deploy"
# else
#   echo "[info] running: fly deploy --remote-only -a enablerdao"
#   fly deploy --remote-only -a enablerdao
# fi

echo ""
echo "==== NEXT STEP ===="
echo "  1. 内容確認: git diff static/blog_seed.json"
echo "  2. デプロイ: fly deploy --remote-only -a enablerdao"
echo "==================="

# 5. Telegram通知 (任意)
if [[ -n "${TELEGRAM_BOT_TOKEN:-}" ]]; then
  slug="$(basename "$candidate" .md)"
  msg="📝 [enablerdao] Draft queued: ${slug}"
  curl -sS -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    -d "chat_id=${TG_CHAT_ID}" \
    -d "text=${msg}" > /dev/null || echo "[warn] telegram notify failed"
fi

echo "[ok] done"
