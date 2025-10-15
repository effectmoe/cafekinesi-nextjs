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

async function copyOldKinesi1Image() {
  console.log('🖼️  旧カフェキネシⅠの画像を新カフェキネシⅠに設定中...\n')

  const newKinesi1Id = '62639a78-3cd2-43df-b7e7-0bf59c2ec20f'
  const imageAssetId = 'image-eb7e8b2a2fa9fd99cec6704329cc29e211c9049a-557x314-webp'

  try {
    await sanityClient
      .patch(newKinesi1Id)
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
    console.log('   画像URL: https://cdn.sanity.io/images/e4aqw590/production/eb7e8b2a2fa9fd99cec6704329cc29e211c9049a-557x314.webp')
    console.log('\n📝 設定内容:')
    console.log('   - 旧カフェキネシⅠと同じ画像を使用')
    console.log('   - ピラーページのコースカードに表示されます')
    console.log('\n🌐 確認URL:')
    console.log('   https://cafekinesi-nextjs.vercel.app/school/kinesi1')
    console.log('   https://cafekinesi-nextjs.vercel.app/school')

  } catch (error) {
    console.error('\n💥 エラー:', error)
    process.exit(1)
  }
}

copyOldKinesi1Image()
