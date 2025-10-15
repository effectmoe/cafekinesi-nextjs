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

async function checkContentOrder() {
  console.log('🔍 contentOrderを確認中...\n')

  try {
    const post = await sanityClient.fetch(`
      *[_id == "post-9"][0] {
        _id,
        title,
        contentOrder,
        tldr,
        content,
        keyPoint,
        summary,
        faq
      }
    `)

    if (!post) {
      console.error('記事が見つかりません')
      return
    }

    console.log('📊 コンテンツ情報:')
    console.log(`  タイトル: ${post.title}`)
    console.log(`  contentOrder: ${post.contentOrder ? JSON.stringify(post.contentOrder) : '❌ 未設定'}`)
    console.log(`\n  TL;DR: ${post.tldr ? '✅' : '❌'}`)
    console.log(`  本文ブロック: ${post.content?.length || 0}`)
    console.log(`  重要ポイント: ${post.keyPoint ? '✅' : '❌'}`)
    console.log(`  まとめ: ${post.summary ? '✅' : '❌'}`)
    console.log(`  FAQ: ${post.faq?.length || 0}`)

    if (!post.contentOrder || post.contentOrder.length === 0) {
      console.log('\n⚠️  contentOrderが設定されていません！')
      console.log('   これが原因でコンテンツが表示されていない可能性があります。')
    }

  } catch (error) {
    console.error('\n💥 エラー:', error)
    process.exit(1)
  }
}

checkContentOrder()
