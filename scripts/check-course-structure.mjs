import { createClient } from 'next-sanity'

const client = createClient({
  projectId: 'e4aqw590',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function checkCourses() {
  const courses = await client.fetch(`
    *[_type == "course"] | order(order asc) {
      _id,
      order,
      title,
      courseType,
      "parentCourseTitle": parentCourse->title
    }
  `)

  console.log('=== Sanity内の講座の階層構造 ===\n')

  // 主要講座と補助講座を分けて表示
  const mainCourses = courses.filter(c => !c.courseType || c.courseType === 'main')
  const auxCourses = courses.filter(c => c.courseType === 'auxiliary')
  const unsetCourses = courses.filter(c => !c.courseType)

  console.log('📊 統計:')
  console.log(`   主要講座: ${mainCourses.length}件`)
  console.log(`   補助講座: ${auxCourses.length}件`)
  console.log(`   未設定: ${unsetCourses.length}件`)
  console.log(`   合計: ${courses.length}件\n`)

  console.log('📋 全講座リスト:\n')
  courses.forEach(course => {
    const type = course.courseType === 'main' ? '🔵 主要講座' :
                 course.courseType === 'auxiliary' ? '🟢 補助講座' : '⚪ 未設定'
    const parent = course.parentCourseTitle ? ` (親: ${course.parentCourseTitle})` : ''
    console.log(`${course.order}. ${course.title}`)
    console.log(`   ${type}${parent}\n`)
  })
}

checkCourses().catch(console.error)
