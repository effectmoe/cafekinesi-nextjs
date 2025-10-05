/**
 * Force cleanup ALL instructors except the correct 4 Hokkaido ones
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

const CORRECT_IDS = [
  'awQRn34trU8d5OFVbTCGYo', // Wisteria Guérison
  'DIQGglHLJ789Bk1yAhw20N', // フェアリーズポット AKO
  'LzGUJjhboVowJO8DBhzjRz', // 煌めきの箱庭
  'LzGUJjhboVowJO8DBhzjgb', // LuLu Harmonia
]

async function forceCleanup() {
  console.log('Fetching ALL instructors (including drafts)...')

  const allInstructors = await client.fetch(
    `*[_type == "instructor"] {
      _id,
      name,
      "slug": slug.current,
      region,
      isActive
    }`
  )

  console.log(`Found ${allInstructors.length} total instructors\n`)

  const toDelete = allInstructors.filter((i: any) =>
    !CORRECT_IDS.includes(i._id)
  )

  const toKeep = allInstructors.filter((i: any) =>
    CORRECT_IDS.includes(i._id)
  )

  console.log(`Will DELETE: ${toDelete.length} instructors`)
  toDelete.forEach((i: any) => {
    console.log(`  - ${i.name || 'NO NAME'} (${i.slug || 'no-slug'}) [${i._id}]`)
  })

  console.log(`\nWill KEEP: ${toKeep.length} instructors`)
  toKeep.forEach((i: any) => {
    console.log(`  - ${i.name} (${i.slug}) [${i._id}]`)
  })

  console.log('\nDeleting in 3 seconds...')
  await new Promise(resolve => setTimeout(resolve, 3000))

  let deleteCount = 0
  for (const instructor of toDelete) {
    try {
      await client.delete(instructor._id)
      console.log(`✅ Deleted: ${instructor.name || 'NO NAME'} (${instructor.slug || 'no-slug'})`)
      deleteCount++
    } catch (error) {
      console.error(`❌ Error deleting ${instructor._id}:`, error)
    }
  }

  console.log(`\n=== Cleanup Complete ===`)
  console.log(`✅ Deleted: ${deleteCount}`)
  console.log(`✅ Remaining: ${toKeep.length}`)
}

forceCleanup()
  .then(() => {
    console.log('\n✨ Force cleanup completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Cleanup failed:', error)
    process.exit(1)
  })
