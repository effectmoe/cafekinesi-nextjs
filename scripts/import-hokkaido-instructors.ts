/**
 * Import Hokkaido instructors from existing site data to Sanity
 * Based on https://cafekinesi.com/category/hokkaido/
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

const hokkaidoInstructors = [
  {
    _type: 'instructor',
    name: 'Wisteria Guérison《ウィステリア・グリソン》',
    slug: {
      _type: 'slug',
      current: 'wisteria-guerison',
    },
    title: 'カフェキネシ公認インストラクター',
    bio: '北海道札幌市中央区で活動しているカフェキネシインストラクターです。カフェキネシ、ピーチタッチ、チャクラキネシの資格を持ち、キネシオロジーとアロマセラピーを融合した独自のセッションを提供しています。',
    specialties: ['カフェキネシ', 'ピーチタッチ', 'チャクラキネシ'],
    region: '北海道',
    order: 1,
    isActive: true,
    featured: false,
  },
  {
    _type: 'instructor',
    name: 'フェアリーズポット AKO',
    slug: {
      _type: 'slug',
      current: 'fairys-pot-ako',
    },
    title: 'カフェキネシ公認インストラクター',
    bio: '北海道札幌市中央区で活動しているカフェキネシインストラクターです。カフェキネシ、ピーチタッチ、チャクラ、ナビゲーター、キネシスタンダードの資格を持ち、幅広い分野で活動しています。',
    specialties: ['カフェキネシ', 'ピーチタッチ', 'チャクラキネシ', 'ナビゲーター', 'キネシスタンダード'],
    region: '北海道',
    order: 2,
    isActive: true,
    featured: false,
  },
  {
    _type: 'instructor',
    name: '煌めきの箱庭',
    slug: {
      _type: 'slug',
      current: 'kirameki-no-hakoniwa',
    },
    title: 'カフェキネシ公認インストラクター',
    bio: '北海道札幌市北区で活動しているカフェキネシインストラクターです。星に願いを、カフェキネシ、ピーチタッチ、チャクラ、HELP、TAOなど多彩な資格を持ち、総合的なセッションを提供しています。',
    specialties: ['星に願いを', 'カフェキネシ', 'ピーチタッチ', 'チャクラキネシ', 'HELP', 'TAO'],
    region: '北海道',
    order: 3,
    isActive: true,
    featured: false,
  },
  {
    _type: 'instructor',
    name: 'セッションルーム LuLu Harmonia（ルル・ハルモニーア）',
    slug: {
      _type: 'slug',
      current: 'lulu-harmonia',
    },
    title: 'カフェキネシ公認インストラクター',
    bio: '北海道札幌市で活動しているカフェキネシインストラクターです。カフェキネシ、ピーチタッチの資格を持ち、心と体の調和を大切にしたセッションを提供しています。',
    specialties: ['カフェキネシ', 'ピーチタッチ'],
    region: '北海道',
    order: 4,
    isActive: true,
    featured: false,
  },
]

async function deleteExistingHokkaidoInstructors() {
  console.log('Deleting existing Hokkaido instructors...')

  // Get all Hokkaido instructors
  const existingInstructors = await client.fetch(
    `*[_type == "instructor" && region == "北海道"]`
  )

  console.log(`Found ${existingInstructors.length} existing Hokkaido instructors`)

  // Delete each instructor
  for (const instructor of existingInstructors) {
    try {
      await client.delete(instructor._id)
      console.log(`🗑️  Deleted: ${instructor.name}`)
    } catch (error) {
      console.error(`❌ Error deleting ${instructor.name}:`, error)
    }
  }
}

async function importInstructors() {
  console.log('Starting Hokkaido instructor import...')
  console.log(`Total instructors to import: ${hokkaidoInstructors.length}`)

  let successCount = 0
  let errorCount = 0

  for (const instructor of hokkaidoInstructors) {
    try {
      const result = await client.create(instructor)
      console.log(`✅ Created: ${instructor.name}`)
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
async function main() {
  await deleteExistingHokkaidoInstructors()
  await importInstructors()
}

main()
  .then(() => {
    console.log('\n✨ Import completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Import failed:', error)
    process.exit(1)
  })
