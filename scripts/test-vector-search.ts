import { config } from 'dotenv'
import { vectorSearch, hybridSearch, getVectorDBStats } from '../lib/db/document-vector-operations'

// .env.localファイルを明示的に読み込み
config({ path: '.env.local' })

async function testVectorSearch() {
  console.log('='.repeat(60))
  console.log('🧪 Testing Vector Search (DeepSeek)')
  console.log('='.repeat(60))
  console.log('')

  try {
    // 統計情報表示
    console.log('📊 Vector DB Statistics:\n')
    const totalStats = await getVectorDBStats()
    console.log(`  Total documents: ${totalStats.total_count}`)
    console.log(`  Document types: ${totalStats.type_count}`)
    console.log(`  Last updated: ${totalStats.last_updated}`)
    console.log('')

    const courseStats = await getVectorDBStats('course')
    console.log(`  Courses: ${courseStats.total_count}`)

    const instructorStats = await getVectorDBStats('instructor')
    console.log(`  Instructors: ${instructorStats.total_count}`)
    console.log('\n' + '='.repeat(60) + '\n')

    // テストクエリ
    const testQueries = [
      { query: 'どのような講座がありますか？', type: 'course' },
      { query: 'カフェキネシの基礎を学びたい', type: 'course' },
      { query: 'チャクラについて学べる講座', type: 'course' },
      { query: 'ピーチタッチ', type: 'course' },
      { query: 'インストラクターを探したい', type: 'instructor' },
      { query: '北海道のインストラクター', type: 'instructor' },
    ]

    for (const { query, type } of testQueries) {
      console.log(`🔍 Query: "${query}" (type: ${type})\n`)

      // ベクトル検索
      console.log('  📊 Vector Search Results:')
      const vectorResults = await vectorSearch(query, {
        topK: 5,
        threshold: 0.2,
        type,
      })

      if (vectorResults.length === 0) {
        console.log('    ⚠️  No results found (threshold too high?)\n')
      } else {
        vectorResults.forEach((result: any, index: number) => {
          console.log(`    ${index + 1}. [${result.type}] ${result.title}`)
          console.log(`       Similarity: ${(result.similarity * 100).toFixed(2)}%`)
          console.log(`       URL: ${result.url}`)
        })
        console.log('')
      }

      // ハイブリッド検索
      console.log('  🔀 Hybrid Search Results:')
      const hybridResults = await hybridSearch(query, {
        topK: 5,
        threshold: 0.1,
        type,
      })

      if (hybridResults.length === 0) {
        console.log('    ⚠️  No results found\n')
      } else {
        hybridResults.forEach((result: any, index: number) => {
          console.log(`    ${index + 1}. [${result.type}] ${result.title}`)
          console.log(`       Combined Score: ${(result.combined_score * 100).toFixed(2)}%`)
          console.log(`       Vector: ${(result.vector_score * 100).toFixed(2)}%, Text: ${(result.text_score * 100).toFixed(2)}%`)
          console.log(`       URL: ${result.url}`)
        })
        console.log('')
      }

      console.log('  ' + '-'.repeat(56) + '\n')
    }

    console.log('='.repeat(60))
    console.log('🎉 Vector Search Test Completed!')
    console.log('='.repeat(60))
    console.log('\n💡 Observations:')
    console.log('  - Check if all 6 courses are searchable')
    console.log('  - Verify similarity scores are > 30%')
    console.log('  - Compare vector vs hybrid search results')
    console.log('  - Adjust threshold if needed\n')

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Test failed:', error)
    process.exit(1)
  }
}

testVectorSearch()
