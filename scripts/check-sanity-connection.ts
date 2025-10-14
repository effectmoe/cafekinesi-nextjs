/**
 * Sanity連携確認スクリプト
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@sanity/client'

config({ path: resolve(process.cwd(), '.env.local') })

const client = createClient({
  projectId: 'e4aqw590',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

async function main() {
  console.log('🔍 Sanity連携を確認中...\n')

  try {
    // 1. schoolPageContentの存在確認
    console.log('📄 schoolPageContentドキュメントを確認中...')
    const pageContent = await client.fetch(`*[_type == "schoolPageContent"][0] {
      _id,
      title,
      isActive,
      selectionGuide { title },
      learningFlow { title, steps },
      faq { title, items },
      certification { title }
    }`)

    if (pageContent) {
      console.log('✅ schoolPageContentが見つかりました:')
      console.log(`   ID: ${pageContent._id}`)
      console.log(`   タイトル: ${pageContent.title}`)
      console.log(`   公開状態: ${pageContent.isActive ? '公開中' : '非公開'}`)
      console.log(`   講座の選び方: ${pageContent.selectionGuide?.title || '未設定'}`)
      console.log(`   学習の流れ: ${pageContent.learningFlow?.title || '未設定'} (${pageContent.learningFlow?.steps?.length || 0}ステップ)`)
      console.log(`   FAQ: ${pageContent.faq?.title || '未設定'} (${pageContent.faq?.items?.length || 0}項目)`)
      console.log(`   資格・認定: ${pageContent.certification?.title || '未設定'}`)
    } else {
      console.log('⚠️  schoolPageContentが見つかりません')
    }

    // 2. courseの階層構造確認
    console.log('\n📚 講座の階層構造を確認中...')
    const courses = await client.fetch(`*[_type == "course" && isActive == true] {
      _id,
      title,
      courseType,
      "parentTitle": parentCourse->title,
      "childCount": count(*[_type == "course" && parentCourse._ref == ^._id])
    } | order(order asc)`)

    console.log(`\n✅ ${courses.length}件の講座が見つかりました:\n`)

    const mainCourses = courses.filter((c: any) => !c.courseType || c.courseType === 'main')
    const auxCourses = courses.filter((c: any) => c.courseType === 'auxiliary')

    console.log(`   主要講座: ${mainCourses.length}件`)
    mainCourses.forEach((course: any) => {
      console.log(`      - ${course.title} (子講座: ${course.childCount}件)`)
    })

    console.log(`\n   補助講座: ${auxCourses.length}件`)
    auxCourses.forEach((course: any) => {
      console.log(`      - ${course.title} (親: ${course.parentTitle || '未設定'})`)
    })

    // 3. スキーマの存在確認
    console.log('\n🔧 スキーマを確認中...')
    const schemas = await client.fetch(`*[_type == "sanity.schema"]._type`)
    console.log(`   登録されているスキーマ数: ${schemas.length}`)

    console.log('\n✅ Sanity連携は正常に動作しています！')

  } catch (error) {
    console.error('❌ エラーが発生しました:', error)
    process.exit(1)
  }
}

main()
