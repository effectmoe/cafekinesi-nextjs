import { sql } from '@vercel/postgres';

async function checkDBContent() {
  try {
    console.log('🔍 Checking document_embeddings content...\n');

    // Check total count
    const countResult = await sql`
      SELECT COUNT(*) as total FROM document_embeddings;
    `;
    console.log(`📊 Total documents: ${countResult.rows[0].total}\n`);

    // Check recent documents with content length
    const results = await sql`
      SELECT
        id,
        type,
        title,
        LENGTH(content) as content_length,
        LEFT(content, 200) as content_preview,
        updated_at
      FROM document_embeddings
      ORDER BY updated_at DESC
      LIMIT 10;
    `;

    console.log('📄 Recent 10 documents:\n');
    results.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.type} - ${row.title}`);
      console.log(`   Content Length: ${row.content_length} chars`);
      console.log(`   Preview: ${row.content_preview || '(empty)'}`);
      console.log(`   Updated: ${row.updated_at}`);
      console.log('');
    });

    // Check for empty content
    const emptyCount = await sql`
      SELECT COUNT(*) as empty_count
      FROM document_embeddings
      WHERE content = '' OR content IS NULL;
    `;
    console.log(`⚠️  Empty content documents: ${emptyCount.rows[0].empty_count}`);

    // Check content by type
    const byType = await sql`
      SELECT
        type,
        COUNT(*) as count,
        AVG(LENGTH(content)) as avg_content_length,
        MIN(LENGTH(content)) as min_length,
        MAX(LENGTH(content)) as max_length
      FROM document_embeddings
      GROUP BY type
      ORDER BY count DESC;
    `;

    console.log('\n📊 Content statistics by type:\n');
    byType.rows.forEach(row => {
      console.log(`${row.type}:`);
      console.log(`  Count: ${row.count}`);
      console.log(`  Avg Length: ${Math.round(row.avg_content_length)} chars`);
      console.log(`  Range: ${row.min_length} - ${row.max_length} chars`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkDBContent();
