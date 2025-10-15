import { createClient } from '@sanity/client'
import { config } from 'dotenv'
import { resolve } from 'path'
import { randomBytes } from 'crypto'

// 環境変数を読み込む
config({ path: resolve(__dirname, '../.env.local') })

// Sanity クライアント
const sanityClient = createClient({
  projectId: 'e4aqw590',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
})

// ユニークなキーを生成
function generateKey(): string {
  return randomBytes(16).toString('hex')
}

async function fixMissingKeys() {
  console.log('🔍 _keyが不足しているcourseドキュメントを検索中...\n')

  // 正しいクラスターページを取得
  const courseId = '62639a78-3cd2-43df-b7e7-0bf59c2ec20f'

  const course = await sanityClient.getDocument(courseId)

  if (!course) {
    console.error('❌ ドキュメントが見つかりません')
    return
  }

  console.log(`✅ ドキュメント取得: ${course.title}`)
  console.log(`   courseId: ${course.courseId}`)

  let needsUpdate = false
  const patches: any[] = []

  // sectionsの_keyを追加
  if (course.sections && Array.isArray(course.sections)) {
    const updatedSections = course.sections.map((section: any) => {
      if (!section._key) {
        needsUpdate = true
        return {
          ...section,
          _key: generateKey()
        }
      }
      return section
    })

    if (needsUpdate) {
      patches.push({
        set: {
          sections: updatedSections
        }
      })
      console.log(`📝 sections に _key を追加: ${updatedSections.length}個`)
    }
  }

  // faqの_keyを追加
  if (course.faq && Array.isArray(course.faq)) {
    const updatedFaq = course.faq.map((item: any) => {
      if (!item._key) {
        needsUpdate = true
        return {
          ...item,
          _key: generateKey()
        }
      }
      return item
    })

    if (needsUpdate) {
      patches.push({
        set: {
          faq: updatedFaq
        }
      })
      console.log(`📝 faq に _key を追加: ${updatedFaq.length}個`)
    }
  }

  if (needsUpdate) {
    console.log('\n🔧 ドキュメントを更新中...')

    // パッチを適用
    await sanityClient
      .patch(courseId)
      .set(patches[0].set)
      .commit()

    console.log('✅ 更新完了！')
  } else {
    console.log('✅ _keyの不足はありません')
  }
}

async function deleteIncorrectCluster() {
  console.log('\n🗑️  不正なクラスターページを削除中...')

  const incorrectId = 'kinesi1-cluster'

  try {
    await sanityClient.delete(incorrectId)
    console.log(`✅ 削除完了: ${incorrectId}`)
  } catch (error) {
    console.error(`❌ 削除エラー:`, error)
  }
}

async function main() {
  console.log('🚀 Sanity課題修正スクリプト開始\n')
  console.log('='.repeat(60))

  try {
    // 1. 不正なクラスターページを削除
    await deleteIncorrectCluster()

    console.log('\n' + '='.repeat(60))

    // 2. _keyを追加
    await fixMissingKeys()

    console.log('\n' + '='.repeat(60))
    console.log('🎉 すべての修正が完了しました！')
  } catch (error) {
    console.error('\n💥 エラーが発生しました:', error)
    process.exit(1)
  }
}

main()
