#!/usr/bin/env node

/**
 * Sanity Webhookのセットアップスクリプト
 *
 * 使用方法:
 * 1. Sanity Management APIトークンを環境変数に設定
 * 2. スクリプトを実行: node scripts/setup-sanity-webhook.js
 */

const webhookConfig = {
  name: 'Next.js Revalidation Webhook',
  description: 'Triggers revalidation when content is published or updated',

  // Webhookの送信先URL（本番環境）
  url: 'https://cafekinesi-nextjs.vercel.app/api/revalidate',

  // トリガーするイベント
  dataset: 'production',
  trigger: {
    projectId: 'e4aqw590',
    dataset: 'production',
  },

  // 監視するドキュメントタイプ
  documentTypes: [
    'blogPost',
    'page',
    'homepage',
    'album',
    'author',
    'category'
  ],

  // イベントタイプ
  events: [
    'create',
    'update',
    'delete'
  ]
}

console.log(`
============================================
Sanity Webhook設定手順
============================================

1. Sanity Studioにログイン
   https://www.sanity.io/manage

2. プロジェクト "cafekinesi" (e4aqw590) を選択

3. API タブ → Webhooks セクションへ移動

4. "Create Webhook" をクリック

5. 以下の情報を入力:

   Name: ${webhookConfig.name}

   URL: ${webhookConfig.url}

   Dataset: ${webhookConfig.dataset}

   Trigger on:
   ${webhookConfig.events.map(e => `   ✓ ${e}`).join('\n')}

   Filter (GROQ):
   _type in [${webhookConfig.documentTypes.map(t => `"${t}"`).join(', ')}]

   Secret:
   ランダムな文字列を生成して設定
   例: $(openssl rand -hex 32)

   HTTP Method: POST

   Headers:
   Content-Type: application/json

6. "Save" をクリック

7. 生成されたSecretを環境変数に追加:

   Vercelダッシュボード:
   Settings → Environment Variables
   SANITY_WEBHOOK_SECRET = [生成したSecret]

   ローカル (.env.local):
   SANITY_WEBHOOK_SECRET=[生成したSecret]

8. Webhookのテスト:

   Sanity Studioで任意のコンテンツを更新
   Webhooks → View Logs で配信状況を確認

============================================
環境変数の設定例
============================================

# .env.local
SANITY_WEBHOOK_SECRET=your-webhook-secret-here

============================================
テスト用コマンド（ローカル環境）
============================================

# Webhookエンドポイントのテスト
curl -X GET "http://localhost:3000/api/revalidate?type=blogPost&slug=test-post"

# 本番環境でのテスト（Secretが必要）
curl -X POST https://cafekinesi-nextjs.vercel.app/api/revalidate \\
  -H "Content-Type: application/json" \\
  -H "sanity-webhook-signature: test-signature" \\
  -d '{"_type":"blogPost","slug":{"current":"test-post"}}'

============================================
`)

// Webhookシークレットの生成例
const crypto = require('crypto')
const exampleSecret = crypto.randomBytes(32).toString('hex')
console.log(`生成されたシークレット例: ${exampleSecret}`)
console.log('\n重要: このシークレットは安全に保管してください。')