import { config } from 'dotenv';
import { resolve } from 'path';
import { sql } from '@vercel/postgres';

config({ path: resolve(process.cwd(), '.env.local') });

async function searchWrongContent() {
  console.log('🔍 「チーズケーキ」「コーヒー」を含むドキュメントを検索...\n');

  try {
    // チーズケーキを含むドキュメント
    const cheesecake = await sql`
      SELECT id, type, title,
             LEFT(content, 300) as content_preview,
             metadata
      FROM document_embeddings
      WHERE content ILIKE '%チーズケーキ%' OR content ILIKE '%cheesecake%'
         OR title ILIKE '%チーズケーキ%';
    `;

    console.log('📋 チーズケーキを含むドキュメント:', cheesecake.rows.length, '件\n');
    cheesecake.rows.forEach((row: any) => {
      console.log(`- [${row.type}] ${row.title}`);
      console.log(`  ID: ${row.id}`);
      console.log(`  Preview: ${row.content_preview}`);
      console.log('');
    });

    // コーヒーを含むドキュメント
    const coffee = await sql`
      SELECT id, type, title,
             LEFT(content, 300) as content_preview,
             metadata
      FROM document_embeddings
      WHERE (content ILIKE '%コーヒー%' OR content ILIKE '%coffee%' OR content ILIKE '%ブレンドコーヒー%')
         AND (content ILIKE '%おすすめ%' OR content ILIKE '%メニュー%')
      LIMIT 5;
    `;

    console.log('☕ コーヒー+おすすめ/メニューを含むドキュメント:', coffee.rows.length, '件\n');
    coffee.rows.forEach((row: any) => {
      console.log(`- [${row.type}] ${row.title}`);
      console.log(`  ID: ${row.id}`);
      console.log(`  Preview: ${row.content_preview}`);
      console.log('');
    });

    // 「おすすめメニュー」を含むドキュメント
    const recommend = await sql`
      SELECT id, type, title,
             LEFT(content, 500) as content_preview,
             metadata
      FROM document_embeddings
      WHERE content ILIKE '%おすすめメニュー%' OR content ILIKE '%おすすめ%メニュー%'
      LIMIT 5;
    `;

    console.log('🍽️ おすすめメニューを含むドキュメント:', recommend.rows.length, '件\n');
    recommend.rows.forEach((row: any) => {
      console.log(`- [${row.type}] ${row.title}`);
      console.log(`  ID: ${row.id}`);
      console.log(`  Preview: ${row.content_preview}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

searchWrongContent();
