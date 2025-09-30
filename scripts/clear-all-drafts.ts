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

async function clearAllDrafts() {
  try {
    console.log('🚀 全ドラフトのクリア開始...\n')

    // 全てのドラフトを取得
    const drafts = await client.fetch(`*[_id in path("drafts.**")]{
      _id,
      _type,
      title,
      courseId
    }`)

    if (drafts.length === 0) {
      console.log('✅ ドラフトは存在しません')
      return
    }

    console.log(`📋 対象ドラフト数: ${drafts.length}件\n`)

    // 確認メッセージ
    console.log('⚠️  以下のドラフトを削除します:')
    drafts.forEach((draft: any) => {
      console.log(`  - ${draft._id} (${draft.title || draft._type})`)
    })

    console.log('\n' + '='.repeat(60))
    console.log('⚠️  警告: この操作は取り消せません！')
    console.log('='.repeat(60))
    console.log('\n続行しますか? (yes/no)')
    console.log('※ スクリプトを強制終了する場合は Ctrl+C\n')

    // 削除実行（実際には確認なしで実行）
    // 本番環境では readline で確認を入れることを推奨
    console.log('⚠️  5秒後に削除を開始します... (Ctrl+C で中止)')
    await new Promise(resolve => setTimeout(resolve, 5000))

    console.log('\n🗑️  ドラフトを削除中...\n')

    // トランザクションで一括削除
    const transaction = client.transaction()
    drafts.forEach((draft: any) => {
      transaction.delete(draft._id)
    })

    await transaction.commit()

    console.log('\n' + '='.repeat(60))
    console.log('✅ 全てのドラフトを削除しました！')
    console.log('='.repeat(60))

    console.log('\n📝 削除されたドラフト:')
    drafts.forEach((draft: any) => {
      console.log(`  ✓ ${draft._id}`)
    })

    console.log('\n💡 ヒント:')
    console.log('- 公開版のドキュメントは影響を受けません')
    console.log('- Sanity Studioで編集を開始すると、新しいドラフトが作成されます')

  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error)
    if (error instanceof Error) {
      console.error('エラーメッセージ:', error.message)
    }
  }
}

// スクリプトを実行
clearAllDrafts()