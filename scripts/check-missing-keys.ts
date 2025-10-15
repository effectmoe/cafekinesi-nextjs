import { createClient } from '@sanity/client'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '../.env.local') })

const sanityClient = createClient({
  projectId: 'e4aqw590',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
})

async function checkAllCourses() {
  console.log('🔍 すべてのcourseドキュメントを検索中...\n')

  const courses = await sanityClient.fetch(`
    *[_type == "course"] {
      _id,
      courseId,
      title,
      sections,
      faq
    }
  `)

  console.log(`📊 全${courses.length}件の講座を見つけました\n`)

  for (const course of courses) {
    console.log(`\n📝 講座: ${course.title}`)
    console.log(`   ID: ${course._id}`)
    console.log(`   courseId: ${course.courseId}`)

    // sectionsのチェック
    if (course.sections && Array.isArray(course.sections)) {
      const missingSectionsKeys = course.sections.filter((s: any) => !s._key)
      if (missingSectionsKeys.length > 0) {
        console.log(`   ⚠️  sections: ${missingSectionsKeys.length}個の_keyが不足`)
      } else {
        console.log(`   ✅ sections: すべて_keyあり (${course.sections.length}個)`)
      }
    } else {
      console.log(`   ℹ️  sections: なし`)
    }

    // faqのチェック
    if (course.faq && Array.isArray(course.faq)) {
      const missingFaqKeys = course.faq.filter((f: any) => !f._key)
      if (missingFaqKeys.length > 0) {
        console.log(`   ⚠️  faq: ${missingFaqKeys.length}個の_keyが不足`)
      } else {
        console.log(`   ✅ faq: すべて_keyあり (${course.faq.length}個)`)
      }
    } else {
      console.log(`   ℹ️  faq: なし`)
    }
  }
}

checkAllCourses().catch(console.error)
