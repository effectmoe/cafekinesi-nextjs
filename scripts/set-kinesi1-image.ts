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

async function setKinesi1Image() {
  console.log('🖼️  カフェキネシⅠに画像を設定中...\n')

  const kinesi1Id = '62639a78-3cd2-43df-b7e7-0bf59c2ec20f'

  // 温かいワークショップ環境の画像を使用
  const imageAssetId = 'image-a1c3c43589633b3e878f610cf15d9f33b7a9ae5d-1536x1024-png'

  try {
    await sanityClient
      .patch(kinesi1Id)
      .set({
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAssetId
          }
        }
      })
      .commit()

    console.log('✅ 画像を設定しました')
    console.log('   画像: 温かいワークショップ環境（親子で取り組む優しい活動）')
    console.log('   URL: https://cdn.sanity.io/images/e4aqw590/production/a1c3c43589633b3e878f610cf15d9f33b7a9ae5d-1536x1024.png')
    console.log('\n📝 設定内容:')
    console.log('   - カフェキネシⅠのサムネイル画像として表示されます')
    console.log('   - ピラーページのコースカードに表示されます')
    console.log('\n🌐 確認URL:')
    console.log('   https://cafekinesi-nextjs.vercel.app/school/kinesi1')
    console.log('   https://cafekinesi-nextjs.vercel.app/school')

  } catch (error) {
    console.error('\n💥 エラー:', error)
    process.exit(1)
  }
}

setKinesi1Image()
