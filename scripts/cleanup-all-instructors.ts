/**
 * Clean up ALL instructor data and keep only the correct 4 Hokkaido instructors
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const CORRECT_SLUGS = [
  'wisteria-guerison',
  'fairys-pot-ako',
  'kirameki-no-hakoniwa',
  'lulu-harmonia'
]

async function cleanupInstructors() {
  console.log('Fetching all instructors...')

  const allInstructors = await client.fetch(
    `*[_type == "instructor"] {
      _id,
      name,
      "slug": slug.current,
      region
    }`
  )

  console.log(`Found ${allInstructors.length} total instructors\n`)

  // 削除対象と保持対象を分類
  const toDelete = allInstructors.filter((i: any) =>
    !CORRECT_SLUGS.includes(i.slug)
  )

  const toKeep = allInstructors.filter((i: any) =>
    CORRECT_SLUGS.includes(i.slug)
  )

  console.log(`Instructors to DELETE: ${toDelete.length}`)
  toDelete.forEach((i: any) => {
    console.log(`  - ${i.name} (${i.slug || 'no-slug'}) [${i._id}]`)
  })

  console.log(`\nInstructors to KEEP: ${toKeep.length}`)
  toKeep.forEach((i: any) => {
    console.log(`  - ${i.name} (${i.slug}) [${i._id}]`)
  })

  console.log('\n削除を実行しますか？ (この処理は取り消せません)')
  console.log('続行するには Ctrl+C で中断してください。5秒後に削除を開始します...')

  await new Promise(resolve => setTimeout(resolve, 5000))

  console.log('\n削除を開始します...')

  let deleteCount = 0
  for (const instructor of toDelete) {
    try {
      await client.delete(instructor._id)
      console.log(`✅ Deleted: ${instructor.name} (${instructor.slug || 'no-slug'})`)
      deleteCount++
    } catch (error) {
      console.error(`❌ Error deleting ${instructor.name}:`, error)
    }
  }

  console.log(`\n=== Cleanup Complete ===`)
  console.log(`✅ Deleted: ${deleteCount} instructors`)
  console.log(`✅ Remaining: ${toKeep.length} instructors`)
}

cleanupInstructors()
  .then(() => {
    console.log('\n✨ Cleanup completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Cleanup failed:', error)
    process.exit(1)
  })
