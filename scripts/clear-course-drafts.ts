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

async function clearCourseDrafts() {
  try {
    console.log('🚀 講座ドラフトのクリア開始...\n')

    // 講座のドラフトのみを取得
    const drafts = await client.fetch(`*[_id in path("drafts.**") && _type == "course"]{
      _id,
      title,
      courseId
    }`)

    if (drafts.length === 0) {
      console.log('✅ 講座のドラフトは存在しません')
      return
    }

    console.log(`📋 対象ドラフト数: ${drafts.length}件\n`)

    console.log('⚠️  以下の講座ドラフトを削除します:')
    drafts.forEach((draft: any) => {
      console.log(`  - ${draft.title} (${draft.courseId}) - ID: ${draft._id}`)
    })

    console.log('\n' + '='.repeat(60))
    console.log('⚠️  警告: この操作は取り消せません！')
    console.log('='.repeat(60))
    console.log('\n⏳ 5秒後に削除を開始します... (Ctrl+C で中止)\n')

    await new Promise(resolve => setTimeout(resolve, 5000))

    console.log('🗑️  ドラフトを削除中...\n')

    // トランザクションで一括削除
    const transaction = client.transaction()
    drafts.forEach((draft: any) => {
      transaction.delete(draft._id)
    })

    await transaction.commit()

    console.log('='.repeat(60))
    console.log('✅ 全ての講座ドラフトを削除しました！')
    console.log('='.repeat(60))

    console.log('\n📝 削除されたドラフト:')
    drafts.forEach((draft: any) => {
      console.log(`  ✓ ${draft.title} (${draft._id})`)
    })

    console.log('\n💡 次のステップ:')
    console.log('1. Sanity Studioで講座を開く')
    console.log('2. 公開版の内容が表示される（ドラフトなし）')
    console.log('3. 編集を開始すると、新しいドラフトが作成される')

  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error)
    if (error instanceof Error) {
      console.error('エラーメッセージ:', error.message)
    }
  }
}

// スクリプトを実行
clearCourseDrafts()