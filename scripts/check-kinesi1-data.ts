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

async function checkKinesi1Data() {
  console.log('🔍 カフェキネシⅠのデータを確認中...\n')

  const kinesi1 = await sanityClient.fetch(`
    *[_type == "course" && courseId == "kinesi1"][0] {
      _id,
      courseId,
      title,
      order,
      courseType,
      isActive,
      image,
      "imageUrl": image.asset->url
    }
  `)

  if (!kinesi1) {
    console.error('❌ カフェキネシⅠが見つかりません')
    return
  }

  console.log('📊 カフェキネシⅠの情報:')
  console.log('  ID:', kinesi1._id)
  console.log('  courseId:', kinesi1.courseId)
  console.log('  title:', kinesi1.title)
  console.log('  order:', kinesi1.order, kinesi1.order === 0 ? '⚠️  0になっています！' : '')
  console.log('  courseType:', kinesi1.courseType || '未設定')
  console.log('  isActive:', kinesi1.isActive)
  console.log('  画像:', kinesi1.imageUrl ? `✅ あり (${kinesi1.imageUrl})` : '❌ なし')

  if (kinesi1.order === 0 || !kinesi1.order) {
    console.log('\n⚠️  問題発見: orderが0または未設定です')
    console.log('   → レベル表示が「レベル 0」になります')
  }

  if (!kinesi1.imageUrl) {
    console.log('\n⚠️  問題発見: 画像が設定されていません')
    console.log('   → カード表示で画像が表示されず、レイアウトが崩れます')
  }
}

checkKinesi1Data()
