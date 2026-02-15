#!/bin/bash
# Cloudflare Pages デプロイ監視

PROJECT_NAME="enablerdao"

echo "👀 デプロイ状態監視中..."
echo "プロジェクト: $PROJECT_NAME"
echo "=========================================="

# 最新デプロイ取得
npx wrangler pages deployment list --project-name=$PROJECT_NAME | head -20

echo ""
echo "リアルタイムログ取得（Ctrl+Cで終了）:"
npx wrangler pages deployment tail --project-name=$PROJECT_NAME
