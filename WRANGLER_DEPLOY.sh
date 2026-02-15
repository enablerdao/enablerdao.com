#!/bin/bash
# Cloudflare Pages Wrangler CLI デプロイスクリプト

set -e

echo "🚀 Cloudflare Pages デプロイ開始..."

# 1. Wranglerログイン
echo "📝 Wranglerログイン..."
npx wrangler login

# 2. プロジェクト作成（初回のみ）
echo "🏗️  プロジェクト作成..."
npx wrangler pages project create enablerdao --production-branch=main || echo "プロジェクトは既に存在します"

# 3. デプロイ
echo "📦 ビルド成果物をデプロイ..."
npx wrangler pages deploy .vercel/output/static --project-name=enablerdao

# 4. 環境変数設定
echo "🔐 環境変数を設定してください（別途実行）:"
echo "  npx wrangler pages secret put RESEND_API_KEY"
echo "  npx wrangler pages secret put NEXT_PUBLIC_GA_MEASUREMENT_ID"

echo "✅ デプロイ完了！"
echo "🌐 URL: https://enablerdao.pages.dev"
