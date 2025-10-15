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

async function checkMainImage() {
  console.log('🔍 メイン画像を確認中...\n')

  const slug = 'breathing-stress-relief'

  try {
    const post = await sanityClient.fetch(`
      *[_type == "blogPost" && slug.current == $slug][0] {
        _id,
        title,
        mainImage,
        author,
        publishedAt,
        category,
        excerpt
      }
    `, { slug })

    if (!post) {
      console.error('記事が見つかりません')
      return
    }

    console.log('📊 必須フィールドチェック:')
    console.log(`  タイトル: ${post.title ? '✅' : '❌'}`)
    console.log(`  著者: ${post.author ? '✅' : '❌'}`)
    console.log(`  公開日時: ${post.publishedAt ? '✅' : '❌'}`)
    console.log(`  カテゴリー: ${post.category ? '✅' : '❌'}`)
    console.log(`  抜粋: ${post.excerpt ? '✅' : '❌'}`)
    console.log(`  メイン画像: ${post.mainImage ? '✅' : '❌ ← これが原因！'}`)

    if (!post.mainImage) {
      console.log('\n⚠️  メイン画像が設定されていません。これがパブリッシュできない原因です。')
    }

  } catch (error) {
    console.error('\n💥 エラー:', error)
    process.exit(1)
  }
}

checkMainImage()
