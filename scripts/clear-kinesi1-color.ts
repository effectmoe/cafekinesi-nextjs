import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'

// 環境変数を読み込み
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_WRITE_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function clearKinesi1Color() {
  try {
    console.log('🔧 カフェキネシⅠのカラーテーマ問題を修正します...\n')

    const documentId = 'bkb6PwLeQwnfx5dxMFx6pE'

    // ドラフトを削除
    console.log('1. ドラフトを削除中...')
    try {
      await client.delete(`drafts.${documentId}`)
      console.log('   ✅ ドラフトを削除しました')
    } catch (e) {
      console.log('   ⚠️  ドラフトが存在しない、または既に削除されています')
    }

    // backgroundClassフィールドをunsetして削除
    console.log('\n2. backgroundClassフィールドを削除中...')
    const result = await client
      .patch(documentId)
      .unset(['backgroundClass'])
      .commit()
    console.log('   ✅ backgroundClassを削除しました')

    console.log('\n' + '='.repeat(60))
    console.log('✅ カラーテーマ問題が修正されました！')
    console.log('='.repeat(60))

    console.log('\n🎯 次のステップ:')
    console.log('1. Sanity Studioをリフレッシュ（Cmd/Ctrl + R）')
    console.log('2. カフェキネシⅠを開く')
    console.log('3. 講座IDを変更（例：cafe-kinesi）')
    console.log('4. Publishボタンが青く有効になることを確認')
    console.log('\nSanity Studio: http://localhost:3333/')

  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error)
    if (error instanceof Error) {
      console.error('エラーメッセージ:', error.message)
    }
  }
}

// スクリプトを実行
clearKinesi1Color()