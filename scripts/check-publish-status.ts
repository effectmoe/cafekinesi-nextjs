import { createClient } from '@sanity/client'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '../.env.local') })

const sanityClient = createClient({
  projectId: 'e4aqw590',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
})

async function checkPublishStatus() {
  console.log('🔍 パブリッシュ状態を確認中...\n')

  const slug = 'breathing-stress-relief'

  try {
    // ドラフトと公開済みの両方を確認
    const draft = await sanityClient.fetch(`
      *[_id == "drafts.post-9"][0] {
        _id,
        title,
        mainImage,
        content,
        faq
      }
    `)

    const published = await sanityClient.fetch(`
      *[_id == "post-9"][0] {
        _id,
        title,
        mainImage,
        content,
        faq
      }
    `)

    console.log('📊 ステータス:')
    console.log(`  ドラフト版: ${draft ? '✅ 存在' : '❌ なし'}`)
    console.log(`  公開版: ${published ? '✅ 存在' : '❌ なし'}`)

    if (draft) {
      console.log('\n📝 ドラフト版の詳細:')
      console.log(`  タイトル: ${draft.title}`)
      console.log(`  メイン画像: ${draft.mainImage ? '✅' : '❌'}`)
      console.log(`  コンテンツブロック: ${draft.content?.length || 0}`)
      console.log(`  FAQ: ${draft.faq?.length || 0}`)
    }

    if (published) {
      console.log('\n📝 公開版の詳細:')
      console.log(`  タイトル: ${published.title}`)
      console.log(`  メイン画像: ${published.mainImage ? '✅' : '❌'}`)
      console.log(`  コンテンツブロック: ${published.content?.length || 0}`)
      console.log(`  FAQ: ${published.faq?.length || 0}`)
    }

    if (draft && !published) {
      console.log('\n⚠️  まだパブリッシュされていません！')
      console.log('   Sanity Studioで右上の「Publish」ボタンをクリックしてください。')
      console.log('   URL: https://www.sanity.io/@oCO4T3gQg/studio/t93oer6ecn1jvet1zpemf6y4/default/structure/blogPosts;breathing-stress-relief')
    }

  } catch (error) {
    console.error('\n💥 エラー:', error)
    process.exit(1)
  }
}

checkPublishStatus()
