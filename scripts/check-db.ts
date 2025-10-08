import { config } from 'dotenv'
import { sql } from '@vercel/postgres'

// Load environment variables
config({ path: '.env.local' })

async function checkDatabase() {
  try {
    console.log('🔍 Checking document_embeddings table...\n')

    const { rows } = await sql`
      SELECT
        id,
        type,
        title,
        LEFT(content, 100) AS preview,
        url,
        updated_at
      FROM document_embeddings
      ORDER BY updated_at DESC
      LIMIT 10
    `

    console.log(`📊 Found ${rows.length} documents:\n`)

    rows.forEach((row, index) => {
      console.log(`${index + 1}. [${row.type}] ${row.title}`)
      console.log(`   ID: ${row.id}`)
      console.log(`   URL: ${row.url}`)
      console.log(`   Preview: ${row.preview}...`)
      console.log(`   Updated: ${row.updated_at}`)
      console.log('')
    })

    // Type別集計
    const { rows: typeCount } = await sql`
      SELECT type, COUNT(*) as count
      FROM document_embeddings
      GROUP BY type
      ORDER BY count DESC
    `

    console.log('\n📈 Documents by type:')
    typeCount.forEach(row => {
      console.log(`   ${row.type}: ${row.count}`)
    })

  } catch (error) {
    console.error('❌ Database error:', error)
  } finally {
    process.exit(0)
  }
}

checkDatabase()
