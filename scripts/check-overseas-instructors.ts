import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_WRITE_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function checkOverseasInstructors() {
  try {
    console.log('🔍 海外インストラクターのデータを確認中...\n')

    // アメリカとヨーロッパのインストラクターを取得
    const query = `*[_type == "instructor" && (region == "アメリカ" || region == "ヨーロッパ") && isActive == true] {
      _id,
      name,
      title,
      region,
      slug,
      isActive,
      "publishedAt": _updatedAt
    }`

    const instructors = await client.fetch(query)

    console.log('📊 取得結果:')
    console.log(`  インストラクター数: ${instructors.length}名\n`)

    if (instructors.length > 0) {
      instructors.forEach((instructor: any) => {
        console.log(`  🌏 ${instructor.region}: ${instructor.name}`)
        console.log(`     - タイトル: ${instructor.title || 'なし'}`)
        console.log(`     - スラッグ: ${instructor.slug?.current || 'なし'}`)
        console.log(`     - アクティブ: ${instructor.isActive}`)
        console.log(`     - 最終更新: ${instructor.publishedAt}\n`)
      })
    } else {
      console.log('  ⚠️  海外インストラクターが見つかりませんでした')
    }

    // 全インストラクターの地域別集計
    const allInstructors = await client.fetch(`*[_type == "instructor" && isActive == true] {
      region
    }`)

    const regionCounts: { [key: string]: number } = {}
    allInstructors.forEach((instructor: any) => {
      if (instructor.region) {
        regionCounts[instructor.region] = (regionCounts[instructor.region] || 0) + 1
      }
    })

    console.log('📍 地域別インストラクター数:')
    Object.entries(regionCounts).sort().forEach(([region, count]) => {
      console.log(`  ${region}: ${count}名`)
    })

  } catch (error) {
    console.error('❌ エラー:', error)
  }
}

checkOverseasInstructors()
