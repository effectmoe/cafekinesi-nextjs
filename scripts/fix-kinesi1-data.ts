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

async function fixKinesi1Data() {
  console.log('🔧 カフェキネシⅠのデータを修正中...\n')

  const kinesi1Id = '62639a78-3cd2-43df-b7e7-0bf59c2ec20f'

  try {
    // order を 1 に変更
    await sanityClient
      .patch(kinesi1Id)
      .set({ order: 1 })
      .commit()

    console.log('✅ orderを 0 → 1 に変更しました')
    console.log('   → レベル表示が「レベル 1」になります')

    console.log('\n⚠️  注意: 画像はまだ設定されていません')
    console.log('   Sanity Studioで画像をアップロードして設定してください')
    console.log('   https://cafekinesi.sanity.studio')

  } catch (error) {
    console.error('\n💥 エラーが発生しました:', error)
    process.exit(1)
  }
}

fixKinesi1Data()
