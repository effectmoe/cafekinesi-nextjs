#!/bin/bash

# Cafe Kinesi プロジェクト 自動セットアップスクリプト
# Usage: chmod +x setup.sh && ./setup.sh

set -e  # エラーで停止

echo "🚀 Cafe Kinesi プロジェクトセットアップを開始します..."
echo ""

# Node.jsバージョンチェック
echo "📋 前提条件チェック中..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Node.js 18以上が必要です（現在: v$NODE_VERSION）"
  exit 1
fi
echo "✅ Node.js $(node -v)"

# pnpmチェック
if ! command -v pnpm &> /dev/null; then
  echo "📦 pnpmをインストール中..."
  npm install -g pnpm
fi
echo "✅ pnpm $(pnpm -v)"

# Vercel CLIチェック
if ! command -v vercel &> /dev/null; then
  echo "📦 Vercel CLIをインストール中..."
  npm install -g vercel
fi
echo "✅ Vercel CLI"

echo ""
echo "─────────────────────────────────────────"
echo "📦 STEP 1/6: 依存関係インストール"
echo "─────────────────────────────────────────"
pnpm install

echo ""
echo "─────────────────────────────────────────"
echo "🔑 STEP 2/6: 環境変数設定"
echo "─────────────────────────────────────────"

# .env.exampleから.env.localを作成
if [ ! -f .env.local ]; then
  cat > .env.local << 'ENVEOF'
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=""
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2024-01-01"
SANITY_API_TOKEN=""

# Vercel Postgres
POSTGRES_URL=""

# AI Provider
AI_PROVIDER="deepseek"
DEEPSEEK_API_KEY=""

# Site
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Session (optional)
SESSION_TIMEOUT="1800000"
MAX_SESSIONS="100"
ENVEOF

  echo "✅ .env.local テンプレート作成完了"
else
  echo "⚠️  .env.local が既に存在します（スキップ）"
fi

echo ""
echo "次のステップでAPIキーを設定してください："
echo ""
echo "1. Sanity Studio"
echo "   → https://www.sanity.io/"
echo "   → プロジェクト作成 → API Token取得"
echo ""
echo "2. DeepSeek API"
echo "   → https://platform.deepseek.com/"
echo "   → API Keys → Create New Key"
echo ""
echo "3. Vercel Postgres"
echo "   → vercel postgres create"
echo "   → POSTGRES_URL を取得"
echo ""

read -p "環境変数を設定しましたか？ (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo ""
  echo "環境変数を設定してから、再度このスクリプトを実行してください："
  echo "  ./setup.sh"
  exit 0
fi

echo ""
echo "─────────────────────────────────────────"
echo "🎨 STEP 3/6: Sanity Studio初期化"
echo "─────────────────────────────────────────"

cd studio
if [ ! -d node_modules ]; then
  pnpm install
fi

echo ""
echo "Sanity Studioを初期化しますか？"
echo "（既に初期化済みの場合は N を選択）"
read -p "初期化する (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
  npx sanity init
  echo "✅ Sanity Studio初期化完了"
else
  echo "⏭️  Sanity Studio初期化をスキップ"
fi

cd ..

echo ""
echo "─────────────────────────────────────────"
echo "🗄️  STEP 4/6: Postgres + pgvector設定"
echo "─────────────────────────────────────────"

echo ""
echo "Vercel Postgresを設定しますか？"
echo "（既に設定済みの場合は N を選択）"
read -p "設定する (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "以下のコマンドを順番に実行してください："
  echo ""
  echo "1. Postgres作成:"
  echo "   vercel postgres create"
  echo ""
  echo "2. pgvector拡張有効化:"
  echo "   vercel postgres exec -- \"CREATE EXTENSION IF NOT EXISTS vector\""
  echo ""
  echo "3. テーブル作成:"
  echo "   vercel postgres exec -- \""
  echo "   CREATE TABLE document_embeddings ("
  echo "     id SERIAL PRIMARY KEY,"
  echo "     type VARCHAR(50) NOT NULL,"
  echo "     title TEXT,"
  echo "     content TEXT NOT NULL,"
  echo "     embedding vector(384) NOT NULL,"
  echo "     url TEXT,"
  echo "     metadata JSONB,"
  echo "     created_at TIMESTAMPTZ DEFAULT NOW(),"
  echo "     updated_at TIMESTAMPTZ DEFAULT NOW()"
  echo "   );"
  echo "   CREATE INDEX ON document_embeddings USING ivfflat (embedding vector_cosine_ops);"
  echo "   \""
  echo ""
  read -p "実行しましたか？ (y/N): " -n 1 -r
  echo
else
  echo "⏭️  Postgres設定をスキップ"
fi

echo ""
echo "─────────────────────────────────────────"
echo "🧠 STEP 5/6: エンベディング生成"
echo "─────────────────────────────────────────"

echo ""
echo "Sanityにコンテンツを追加してから、エンベディングを生成してください："
echo ""
echo "1. Sanity Studioでコンテンツ追加:"
echo "   cd studio && pnpm dev"
echo "   → http://localhost:3333"
echo ""
echo "2. エンベディング生成:"
echo "   pnpm run populate-embeddings"
echo ""

read -p "今すぐ実行しますか？ (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
  if [ -f scripts/populate-embeddings.ts ]; then
    pnpm run populate-embeddings
    echo "✅ エンベディング生成完了"
  else
    echo "⚠️  scripts/populate-embeddings.ts が見つかりません"
  fi
else
  echo "⏭️  エンベディング生成をスキップ（後で実行してください）"
fi

echo ""
echo "─────────────────────────────────────────"
echo "🎉 STEP 6/6: 開発サーバー起動"
echo "─────────────────────────────────────────"

echo ""
echo "セットアップが完了しました！"
echo ""
echo "次のコマンドで開発サーバーを起動してください："
echo ""
echo "  pnpm dev"
echo ""
echo "その後、ブラウザで以下にアクセス："
echo "  → http://localhost:3000"
echo ""
echo "───────────────────────────────────────────────────"
echo "📚 詳細ドキュメント:"
echo "  - フルスタック構築マニュアル:"
echo "    docs/2025-10-09_フルスタック構築マニュアル_Phase0-5統合版.md"
echo "  - マスターガイド:"
echo "    docs/2025-10-08_Cafe_Kinesi_システム構築マスターガイド.md"
echo "───────────────────────────────────────────────────"
echo ""

read -p "今すぐ開発サーバーを起動しますか？ (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo ""
  echo "🚀 開発サーバーを起動します..."
  echo "（Ctrl+C で終了）"
  sleep 2
  pnpm dev
else
  echo ""
  echo "✅ セットアップ完了！"
  echo ""
  echo "開発を開始するには:"
  echo "  pnpm dev"
fi
