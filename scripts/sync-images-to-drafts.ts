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

async function syncImagesToDrafts() {
  try {
    console.log('🚀 公開済みドキュメントの画像をドラフトに同期開始...\n')

    // 全ての講座を取得
    const courses = await client.fetch(`*[_type == "course"]{
      _id,
      courseId,
      title,
      image
    }`)

    console.log(`📋 対象講座数: ${courses.length}件\n`)

    for (const course of courses) {
      console.log(`\n処理中: ${course.title} (${course.courseId})`)
      console.log(`  Published ID: ${course._id}`)

      // ドラフトIDを生成
      const draftId = course._id.startsWith('drafts.')
        ? course._id
        : `drafts.${course._id}`

      // ドラフトが存在するか確認
      const existingDraft = await client.fetch(
        `*[_id == $draftId][0]`,
        { draftId }
      )

      if (existingDraft) {
        console.log(`  Draft ID: ${draftId} (既存)`)

        // ドラフトに画像が設定されているか確認
        if (existingDraft.image?.asset?._ref) {
          console.log(`  ✅ ドラフトには既に画像が設定されています`)
          continue
        }

        // 公開版に画像がある場合、ドラフトにコピー
        if (course.image?.asset?._ref) {
          console.log(`  → ドラフトに画像を設定中...`)
          await client
            .patch(draftId)
            .set({ image: course.image })
            .commit()
          console.log(`  ✅ ドラフトに画像を設定完了`)
        } else {
          console.log(`  ⚠️  公開版にも画像が設定されていません`)
        }
      } else {
        // ドラフトが存在しない場合
        console.log(`  ℹ️  ドラフトは存在しません（公開版のみ）`)

        // 公開版に画像がある場合は問題なし
        if (course.image?.asset?._ref) {
          console.log(`  ✅ 公開版に画像が設定されています`)
        } else {
          console.log(`  ⚠️  公開版にも画像が設定されていません`)
        }
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log('🎉 画像の同期が完了しました！')
    console.log('='.repeat(60))

    console.log('\n🔗 確認方法:')
    console.log('1. Sanity Studio: http://localhost:3333/')
    console.log('2. 各講座を開いて画像が表示されることを確認')
    console.log('3. 必要に応じて「Publish」をクリックしてドラフトを公開')

  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error)
    if (error instanceof Error) {
      console.error('エラーメッセージ:', error.message)
    }
  }
}

// スクリプトを実行
syncImagesToDrafts()