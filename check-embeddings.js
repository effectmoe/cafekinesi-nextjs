import { sql } from '@vercel/postgres';

async function checkEmbeddings() {
  try {
    console.log('🔍 Checking document_embeddings table...\n');
    
    const result = await sql`
      SELECT id, type, title, 
             LEFT(content, 200) as content_preview,
             updated_at
      FROM document_embeddings
      WHERE type = 'knowledgeBase'
      ORDER BY updated_at DESC;
    `;
    
    console.log(`Found ${result.rows.length} knowledgeBase documents in vector DB:\n`);
    
    result.rows.forEach((row, i) => {
      console.log(`${i + 1}. ID: ${row.id}`);
      console.log(`   Title: ${row.title}`);
      console.log(`   Updated: ${row.updated_at}`);
      console.log(`   Content preview: ${row.content_preview}...`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
  process.exit(0);
}

checkEmbeddings();
