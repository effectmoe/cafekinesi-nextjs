/**
 * Delete instructors from Sanity
 *
 * Usage:
 * - Delete all: npx tsx scripts/delete-instructors.ts --all
 * - Delete by ID: npx tsx scripts/delete-instructors.ts --id "instructor-1"
 * - Delete by IDs: npx tsx scripts/delete-instructors.ts --ids "id1,id2,id3"
 * - Delete by region: npx tsx scripts/delete-instructors.ts --region "東京都"
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

async function deleteInstructors() {
  const args = process.argv.slice(2)

  // Parse command line arguments
  const deleteAll = args.includes('--all')
  const idIndex = args.indexOf('--id')
  const idsIndex = args.indexOf('--ids')
  const regionIndex = args.indexOf('--region')

  let query = '*[_type == "instructor"]'
  let deleteMessage = ''

  if (deleteAll) {
    deleteMessage = 'すべてのインストラクター'
  } else if (idIndex !== -1 && args[idIndex + 1]) {
    const id = args[idIndex + 1]
    query = `*[_type == "instructor" && _id == "${id}"]`
    deleteMessage = `ID: ${id} のインストラクター`
  } else if (idsIndex !== -1 && args[idsIndex + 1]) {
    const ids = args[idsIndex + 1].split(',').map(id => `"${id.trim()}"`).join(', ')
    query = `*[_type == "instructor" && _id in [${ids}]]`
    deleteMessage = `指定されたIDのインストラクター`
  } else if (regionIndex !== -1 && args[regionIndex + 1]) {
    const region = args[regionIndex + 1]
    query = `*[_type == "instructor" && region == "${region}"]`
    deleteMessage = `地域: ${region} のインストラクター`
  } else {
    console.log('❌ 使用方法:')
    console.log('  全削除:           npx tsx scripts/delete-instructors.ts --all')
    console.log('  ID指定削除:       npx tsx scripts/delete-instructors.ts --id "instructor-1"')
    console.log('  複数ID削除:       npx tsx scripts/delete-instructors.ts --ids "id1,id2,id3"')
    console.log('  地域指定削除:     npx tsx scripts/delete-instructors.ts --region "東京都"')
    process.exit(1)
  }

  console.log(`\n🔍 ${deleteMessage}を検索中...`)

  // Fetch instructors to delete
  const instructors = await client.fetch(query)

  if (instructors.length === 0) {
    console.log('❌ 削除対象のインストラクターが見つかりませんでした。')
    process.exit(0)
  }

  console.log(`\n📋 削除対象: ${instructors.length}件`)
  instructors.forEach((instructor: any) => {
    console.log(`  - ${instructor.name} (${instructor.region || '地域未設定'}) [${instructor._id}]`)
  })

  console.log(`\n⚠️  本当に削除しますか? (この操作は取り消せません)`)
  console.log('削除を実行するには、再度スクリプトを --confirm オプション付きで実行してください:')
  console.log(`  npx tsx scripts/delete-instructors.ts ${args.join(' ')} --confirm\n`)

  if (!args.includes('--confirm')) {
    process.exit(0)
  }

  console.log('\n🗑️  削除を開始します...\n')

  let successCount = 0
  let errorCount = 0

  for (const instructor of instructors) {
    try {
      await client.delete(instructor._id)
      console.log(`✅ 削除完了: ${instructor.name} (${instructor.region})`)
      successCount++
    } catch (error) {
      console.error(`❌ 削除失敗: ${instructor.name}`, error)
      errorCount++
    }
  }

  console.log('\n=== 削除結果 ===')
  console.log(`✅ 成功: ${successCount}件`)
  console.log(`❌ 失敗: ${errorCount}件`)
  console.log(`合計: ${successCount + errorCount}件`)
  console.log('\n✨ 削除処理が完了しました！\n')
}

// Run the delete script
deleteInstructors()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 削除処理中にエラーが発生しました:', error)
    process.exit(1)
  })
