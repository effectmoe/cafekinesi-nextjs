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

async function checkSanityImages() {
  console.log('🖼️  Sanityの画像アセットを確認中...\n')

  try {
    // 全画像アセットを取得
    const images = await sanityClient.fetch(`
      *[_type == "sanity.imageAsset"] | order(_createdAt desc) [0...10] {
        _id,
        url,
        originalFilename,
        size,
        "usedIn": count(*[references(^._id)])
      }
    `)

    console.log(`📊 最新の画像アセット（${images.length}件）:`)
    images.forEach((img: any, index: number) => {
      console.log(`\n${index + 1}. ${img.originalFilename || '名前なし'}`)
      console.log(`   ID: ${img._id}`)
      console.log(`   URL: ${img.url}`)
      console.log(`   使用箇所: ${img.usedIn}件`)
    })

    // kinesi1で使える画像を提案
    console.log('\n💡 kinesi1用の画像として使用できそうなもの:')
    const suitable = images.filter((img: any) => img.usedIn === 0)

    if (suitable.length > 0) {
      console.log(`未使用の画像が${suitable.length}件あります`)
      console.log('これらを使用することもできます。')
    } else {
      console.log('未使用の画像はありません。新しい画像をアップロードする必要があります。')
    }

  } catch (error) {
    console.error('\n💥 エラー:', error)
    process.exit(1)
  }
}

checkSanityImages()
