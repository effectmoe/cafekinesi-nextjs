/**
 * Import instructors from existing site data to Sanity
 *
 * Based on the instructor list from https://cafekinesi.com/instructor/
 * This script creates instructor documents in Sanity for each prefecture.
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// Prefectures with instructors based on the screenshot
const prefecturesWithInstructors = [
  '北海道', '青森県', '秋田県', '岩手県', '宮城県', '栃木県', '群馬県',
  '埼玉県', '千葉県', '東京都', '神奈川県', '新潟県', '山梨県', '長野県',
  '静岡県', '愛知県', '滋賀県', '京都府', '大阪府', '兵庫県', '岡山県',
  '広島県', '香川県', '福岡県', '沖縄県', 'アメリカ', 'ヨーロッパ'
]

// Sample instructor data for each prefecture
const sampleInstructors = prefecturesWithInstructors.map((region, index) => {
  const isOverseas = region === 'アメリカ' || region === 'ヨーロッパ'

  return {
    _type: 'instructor',
    name: `${region}のインストラクター`,
    slug: {
      _type: 'slug',
      current: `instructor-${index + 1}`,
    },
    title: 'カフェキネシ公認インストラクター',
    bio: `${region}で活動しているカフェキネシインストラクターです。キネシオロジーとアロマセラピーを融合した独自のセッションを提供しています。`,
    region: region,
    order: index,
    isActive: true,
    featured: false,
  }
})

async function importInstructors() {
  console.log('Starting instructor import...')
  console.log(`Total instructors to import: ${sampleInstructors.length}`)

  let successCount = 0
  let errorCount = 0

  for (const instructor of sampleInstructors) {
    try {
      const result = await client.create(instructor)
      console.log(`✅ Created: ${instructor.name} (${instructor.region})`)
      successCount++
    } catch (error) {
      console.error(`❌ Error creating ${instructor.name}:`, error)
      errorCount++
    }
  }

  console.log('\n=== Import Summary ===')
  console.log(`✅ Successfully imported: ${successCount}`)
  console.log(`❌ Failed: ${errorCount}`)
  console.log(`Total: ${successCount + errorCount}`)
}

// Run the import
importInstructors()
  .then(() => {
    console.log('\n✨ Import completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Import failed:', error)
    process.exit(1)
  })
