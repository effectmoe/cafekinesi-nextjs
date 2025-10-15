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

async function migrateClusterToMain() {
  console.log('🚀 クラスターページを正規ページに移行\n')
  console.log('='.repeat(60))

  try {
    // 1. 旧kinesi1を非公開にする
    console.log('\n📝 ステップ1: 旧カフェキネシⅠを非公開にする')
    const oldKinesi1Id = 'bkb6PwLeQwnfx5dxMFx6pE'

    await sanityClient
      .patch(oldKinesi1Id)
      .set({ isActive: false })
      .commit()

    console.log(`✅ 旧カフェキネシⅠ（ID: ${oldKinesi1Id}）を非公開にしました`)

    // 2. kinesi1-cluster を kinesi1 に変更
    console.log('\n📝 ステップ2: クラスターページを正規ページに変更')
    const clusterId = '62639a78-3cd2-43df-b7e7-0bf59c2ec20f'

    await sanityClient
      .patch(clusterId)
      .set({
        courseId: 'kinesi1',
        title: 'カフェキネシⅠ',
        isClusterPage: false
      })
      .commit()

    console.log(`✅ クラスターページを正規ページに変更しました`)
    console.log(`   - courseId: kinesi1-cluster → kinesi1`)
    console.log(`   - title: カフェキネシⅠ（クラスター） → カフェキネシⅠ`)
    console.log(`   - isClusterPage: true → false`)

    console.log('\n' + '='.repeat(60))
    console.log('🎉 移行が完了しました！')
    console.log('\n次のステップ:')
    console.log('1. Sanity Studioで変更を確認')
    console.log('2. https://cafekinesi-nextjs.vercel.app/school/kinesi1 でページを確認')

  } catch (error) {
    console.error('\n💥 エラーが発生しました:', error)
    process.exit(1)
  }
}

migrateClusterToMain()
