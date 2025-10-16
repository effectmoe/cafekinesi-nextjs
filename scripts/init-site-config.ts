import { createClient } from '@sanity/client'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// .env.localから環境変数を読み込み
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

// Sanity Clientの設定
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'e4aqw590',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

// llms.txtファイルのパス
const LLMS_TXT_PATH = path.resolve(process.cwd(), 'public/llms.txt')

async function initializeSiteConfig() {
  try {
    console.log('🚀 Sanity siteConfig 初期化スクリプト開始...\n')

    // 既存のsiteConfigドキュメントを確認
    const existingConfig = await client.fetch(`*[_type == "siteConfig"][0]`)

    if (existingConfig) {
      console.log('⚠️  既に siteConfig ドキュメントが存在します:')
      console.log(`   ドキュメントID: ${existingConfig._id}`)
      console.log(`   タイトル: ${existingConfig.title || '(タイトルなし)'}`)
      console.log(`   ベースURL: ${existingConfig.baseUrl || '(URLなし)'}`)
      console.log('\n既存のドキュメントを更新しますか？')
      console.log('続行する場合は、手動で既存ドキュメントを削除してから再実行してください。')
      return
    }

    // llms.txtファイルを読み込み
    console.log('📄 llms.txt ファイルを読み込んでいます...')
    const llmsContent = fs.readFileSync(LLMS_TXT_PATH, 'utf-8')
    console.log(`✅ ${LLMS_TXT_PATH} を読み込みました (${llmsContent.length} 文字)\n`)

    // robots設定のデフォルト値
    const robotsRules = [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/private/'],
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        crawlDelay: 1,
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
      },
      {
        userAgent: 'Claude-Web',
        allow: '/',
        crawlDelay: 1,
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        crawlDelay: 1,
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        crawlDelay: 1,
      },
      {
        userAgent: 'FacebookBot',
        allow: '/',
      },
    ]

    // siteConfigドキュメントを作成
    console.log('📝 siteConfig ドキュメントを Sanity に作成しています...')
    const newDocument = {
      _type: 'siteConfig',
      title: 'Cafe Kinesi サイト設定',
      baseUrl: 'https://cafekinesi-nextjs.vercel.app',
      llmsContent,
      robotsRules,
      sitemapEnabled: true,
    }

    const result = await client.create(newDocument)

    console.log('✅ siteConfig ドキュメントの作成に成功しました！\n')
    console.log('作成されたドキュメント:')
    console.log(`   ドキュメントID: ${result._id}`)
    console.log(`   タイトル: ${result.title}`)
    console.log(`   ベースURL: ${result.baseUrl}`)
    console.log(`   llms.txt 文字数: ${result.llmsContent?.length || 0}`)
    console.log(`   robots ルール数: ${result.robotsRules?.length || 0}`)
    console.log(`   サイトマップ有効: ${result.sitemapEnabled ? 'はい' : 'いいえ'}`)
    console.log('\n🎉 初期化が完了しました！')
    console.log('\n次のステップ:')
    console.log('1. Sanity Studio (http://localhost:3333) でドキュメントを確認')
    console.log('2. 必要に応じて llms.txt の内容を編集')
    console.log('3. robots.txt のルールをカスタマイズ')
    console.log('4. 独自ドメイン設定時に baseUrl を更新')
  } catch (error) {
    console.error('❌ エラーが発生しました:', error)
    throw error
  }
}

// スクリプト実行
initializeSiteConfig()
  .then(() => {
    console.log('\n✨ スクリプトが正常に完了しました')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 スクリプトがエラーで終了しました:', error)
    process.exit(1)
  })
