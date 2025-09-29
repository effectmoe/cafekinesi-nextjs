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

async function fixKinesi1Color() {
  try {
    console.log('🎨 カフェキネシⅠのカラーテーマを修正します...\n')

    const documentId = 'bkb6PwLeQwnfx5dxMFx6pE'

    // 公開版を更新
    console.log('1. 公開版のカラーテーマを更新中...')
    const publishedResult = await client
      .patch(documentId)
      .set({ backgroundClass: 'album-teal' })
      .commit()
    console.log('   ✅ 公開版を更新しました')

    // ドラフト版も更新
    console.log('\n2. ドラフト版のカラーテーマを更新中...')
    try {
      const draftResult = await client
        .patch(`drafts.${documentId}`)
        .set({ backgroundClass: 'album-teal' })
        .commit()
      console.log('   ✅ ドラフト版を更新しました')
    } catch (e) {
      console.log('   ⚠️  ドラフト版が存在しない、または既に同じ値です')
    }

    console.log('\n' + '='.repeat(60))
    console.log('✅ カラーテーマの修正が完了しました！')
    console.log('='.repeat(60))

    console.log('\n📝 設定されたカラーテーマ: album-teal (ティール)')

    console.log('\n🎯 次のステップ:')
    console.log('1. Sanity Studioをリフレッシュ（Cmd/Ctrl + R）')
    console.log('2. カフェキネシⅠを開く')
    console.log('3. 別のカラーテーマを選択して変更を加える')
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
fixKinesi1Color()