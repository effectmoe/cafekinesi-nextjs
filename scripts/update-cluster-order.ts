#!/usr/bin/env npx tsx

import { createClient } from '@sanity/client'
import { config } from 'dotenv'

config({ path: '.env.local' })

const client = createClient({
  projectId: 'e4aqw590',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
})

async function updateClusterOrder() {
  console.log('📝 「カフェキネシⅠ（クラスター）」のorder番号を更新中...\n')

  try {
    // 1. 対象の講座を取得
    const course = await client.fetch(`*[_type == "course" && courseId == "kinesi1-cluster"][0] {
      _id,
      title,
      subtitle,
      courseId,
      order
    }`)

    if (!course) {
      console.error('❌ 「カフェキネシⅠ（クラスター）」が見つかりません')
      process.exit(1)
    }

    console.log('現在のデータ:')
    console.log(`  タイトル: ${course.title}`)
    console.log(`  courseId: ${course.courseId}`)
    console.log(`  現在のorder: ${course.order}`)
    console.log(`  _id: ${course._id}\n`)

    // 2. order番号を0に更新
    console.log('order番号を 1 → 0 に更新します...\n')

    const result = await client
      .patch(course._id)
      .set({ order: 0 })
      .commit()

    console.log('✅ 更新完了！\n')
    console.log('更新後のデータ:')
    console.log(`  タイトル: ${result.title}`)
    console.log(`  courseId: ${result.courseId}`)
    console.log(`  新しいorder: ${result.order}`)

    console.log('\n📋 すべての講座の順序を確認:')

    const allCourses = await client.fetch(`*[_type == "course" && isActive == true] | order(order asc) {
      order,
      title,
      courseId
    }`)

    allCourses.forEach((c, index) => {
      console.log(`  ${index + 1}. [order: ${c.order}] ${c.title} (${c.courseId})`)
    })

    console.log('\n✨ 完了しました！')
    console.log('💡 Vercelで自動的にデプロイされるまで数分お待ちください。')
    console.log('💡 または /school ページを開いて再読み込みしてください。')

  } catch (error) {
    console.error('❌ エラーが発生しました:', error)
    process.exit(1)
  }
}

updateClusterOrder()
