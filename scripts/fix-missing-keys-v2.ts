import { createClient } from '@sanity/client'
import { config } from 'dotenv'
import { resolve } from 'path'
import { randomBytes } from 'crypto'

config({ path: resolve(__dirname, '../.env.local') })

const sanityClient = createClient({
  projectId: 'e4aqw590',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
})

function generateKey(): string {
  return randomBytes(16).toString('hex')
}

async function fixMissingKeys() {
  console.log('🔍 _keyが不足しているcourseドキュメントを検索中...\n')

  const courseId = '62639a78-3cd2-43df-b7e7-0bf59c2ec20f'
  const course = await sanityClient.getDocument(courseId)

  if (!course) {
    console.error('❌ ドキュメントが見つかりません')
    return
  }

  console.log(`✅ ドキュメント取得: ${course.title}`)
  console.log(`   courseId: ${course.courseId}`)

  let needsUpdate = false
  const updateData: any = {}

  // sectionsの_keyを追加
  if (course.sections && Array.isArray(course.sections)) {
    const missingSections = course.sections.filter((s: any) => !s._key)
    if (missingSections.length > 0) {
      const updatedSections = course.sections.map((section: any) => {
        if (!section._key) {
          return {
            ...section,
            _key: generateKey()
          }
        }
        return section
      })
      updateData.sections = updatedSections
      needsUpdate = true
      console.log(`📝 sections に _key を追加: ${missingSections.length}個`)
    } else {
      console.log(`✅ sections: すべて_keyあり (${course.sections.length}個)`)
    }
  }

  // faqの_keyを追加
  if (course.faq && Array.isArray(course.faq)) {
    const missingFaq = course.faq.filter((f: any) => !f._key)
    if (missingFaq.length > 0) {
      const updatedFaq = course.faq.map((item: any) => {
        if (!item._key) {
          return {
            ...item,
            _key: generateKey()
          }
        }
        return item
      })
      updateData.faq = updatedFaq
      needsUpdate = true
      console.log(`📝 faq に _key を追加: ${missingFaq.length}個`)
    } else {
      console.log(`✅ faq: すべて_keyあり (${course.faq.length}個)`)
    }
  }

  if (needsUpdate) {
    console.log('\n🔧 ドキュメントを更新中...')
    console.log('更新内容:', Object.keys(updateData))

    // すべての更新を一度に適用
    await sanityClient
      .patch(courseId)
      .set(updateData)
      .commit()

    console.log('✅ 更新完了！')
  } else {
    console.log('\n✅ _keyの不足はありません')
  }
}

async function main() {
  console.log('🚀 Sanity _key修正スクリプト v2\n')
  console.log('='.repeat(60))

  try {
    await fixMissingKeys()

    console.log('\n' + '='.repeat(60))
    console.log('🎉 すべての修正が完了しました！')
  } catch (error) {
    console.error('\n💥 エラーが発生しました:', error)
    process.exit(1)
  }
}

main()
