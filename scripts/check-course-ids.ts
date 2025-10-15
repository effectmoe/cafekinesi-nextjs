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

async function checkCourseIds() {
  console.log('📚 講座のcourseIDを確認中...\n')

  try {
    const courses = await client.fetch(`*[_type == "course"] | order(order asc) {
      _id,
      title,
      subtitle,
      courseId,
      order,
      isActive
    }`)

    console.log(`📋 取得した講座数: ${courses.length}件\n`)

    courses.forEach((course, index) => {
      console.log(`${index + 1}. 【${course.order}】 ${course.title}`)
      console.log(`   サブタイトル: ${course.subtitle || '未設定'}`)
      console.log(`   courseId: ${course.courseId || '❌ 未設定'}`)
      console.log(`   リンク: /school/${course.courseId || '[courseId未設定]'}`)
      console.log(`   _id: ${course._id}`)
      console.log(`   有効: ${course.isActive !== false ? 'Yes' : 'No'}`)
      console.log('')
    })

    // courseIdが未設定の講座を特定
    const missingCourseIds = courses.filter(c => !c.courseId)
    if (missingCourseIds.length > 0) {
      console.log('\n⚠️  courseIDが未設定の講座:')
      missingCourseIds.forEach(course => {
        console.log(`   - ${course.title} (${course.subtitle})`)
      })
    }

  } catch (error) {
    console.error('❌ エラー:', error)
    process.exit(1)
  }
}

checkCourseIds()
