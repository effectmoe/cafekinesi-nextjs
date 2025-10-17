import { config } from 'dotenv';
import { resolve } from 'path';
import { sql } from '@vercel/postgres';

config({ path: resolve(process.cwd(), '.env.local') });

async function main() {
  console.log('🔍 document_embeddingsテーブルのナレッジベース情報を確認...\n');

  try {
    // ナレッジベース全件を確認
    const allKB = await sql`
      SELECT id, type, title,
             LEFT(content, 100) as content_preview,
             LENGTH(content) as content_length,
             metadata
      FROM document_embeddings
      WHERE type = 'knowledgeBase'
      ORDER BY updated_at DESC;
    `;

    console.log('📚 ナレッジベース文書数:', allKB.rows.length, '件\n');

    allKB.rows.forEach((row: any, idx: number) => {
      console.log(`${idx + 1}. ${row.title}`);
      console.log(`   ID: ${row.id}`);
      console.log(`   Content length: ${row.content_length} 文字`);
      console.log(`   Preview: ${row.content_preview}...`);
      console.log(`   Metadata: ${JSON.stringify(row.metadata)}`);
      console.log('');
    });

    // アクセス情報を含むナレッジベースを検索
    const accessKB = await sql`
      SELECT id, type, title, content, metadata
      FROM document_embeddings
      WHERE type = 'knowledgeBase'
        AND (title LIKE '%アクセス%' OR content LIKE '%新幹線%' OR content LIKE '%博多駅%')
      LIMIT 3;
    `;

    console.log('🚄 アクセス情報を含むナレッジベース:', accessKB.rows.length, '件\n');

    accessKB.rows.forEach((row: any, idx: number) => {
      console.log(`${idx + 1}. ${row.title}`);
      console.log(`   Content:`);
      console.log(row.content);
      console.log('');
    });

  } catch (error) {
    console.error('❌ エラー:', error);
    process.exit(1);
  }
}

main();
