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

async function fixMainImage() {
  console.log('🔧 メイン画像を設定中...\n')

  const slug = 'breathing-stress-relief'

  try {
    // 既存の記事を取得
    const existingPost = await sanityClient.fetch(`
      *[_type == "blogPost" && slug.current == $slug][0] {
        _id
      }
    `, { slug })

    if (!existingPost) {
      console.error('記事が見つかりません')
      return
    }

    // 他のブログ記事からメイン画像を取得
    const samplePost = await sanityClient.fetch(`
      *[_type == "blogPost" && mainImage != null][0] {
        mainImage
      }
    `)

    if (!samplePost || !samplePost.mainImage) {
      console.error('参照できる画像が見つかりません')
      console.log('\n💡 Sanity Studioで直接画像をアップロードしてください：')
      console.log('   https://www.sanity.io/@oCO4T3gQg/studio/t93oer6ecn1jvet1zpemf6y4/default/structure/blogPosts;breathing-stress-relief')
      return
    }

    // メイン画像を設定
    await sanityClient
      .patch(existingPost._id)
      .set({ mainImage: samplePost.mainImage })
      .commit()

    console.log('✅ メイン画像を設定しました')
    console.log('\n🌐 Sanity Studioで確認してください：')
    console.log('   https://www.sanity.io/@oCO4T3gQg/studio/t93oer6ecn1jvet1zpemf6y4/default/structure/blogPosts;breathing-stress-relief')
    console.log('\n📝 Publishボタンが有効になっているはずです。クリックしてパブリッシュしてください。')

  } catch (error) {
    console.error('\n💥 エラー:', error)
    process.exit(1)
  }
}

fixMainImage()
