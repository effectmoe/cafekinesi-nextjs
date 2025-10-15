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

async function checkOldKinesi1Image() {
  console.log('🔍 旧カフェキネシⅠの画像を確認中...\n')

  // 旧kinesi1（非表示にしたもの）のIDを指定
  const oldKinesi1Id = 'bkb6PwLeQwnfx5dxMFx6pE'

  try {
    const oldKinesi1 = await sanityClient.fetch(`
      *[_id == $id][0] {
        _id,
        courseId,
        title,
        isActive,
        image,
        "imageUrl": image.asset->url,
        "imageAssetId": image.asset._ref
      }
    `, { id: oldKinesi1Id })

    if (!oldKinesi1) {
      console.error('❌ 旧カフェキネシⅠが見つかりません')
      return
    }

    console.log('📊 旧カフェキネシⅠの情報:')
    console.log('  ID:', oldKinesi1._id)
    console.log('  courseId:', oldKinesi1.courseId)
    console.log('  title:', oldKinesi1.title)
    console.log('  isActive:', oldKinesi1.isActive)
    console.log('  画像URL:', oldKinesi1.imageUrl || '❌ なし')
    console.log('  画像アセットID:', oldKinesi1.imageAssetId || '❌ なし')

    if (oldKinesi1.imageAssetId) {
      console.log('\n✅ この画像アセットIDを使用して、新カフェキネシⅠに設定します')
      console.log('   アセットID:', oldKinesi1.imageAssetId)
    } else {
      console.log('\n⚠️  旧カフェキネシⅠには画像が設定されていません')
    }

  } catch (error) {
    console.error('\n💥 エラー:', error)
    process.exit(1)
  }
}

checkOldKinesi1Image()
