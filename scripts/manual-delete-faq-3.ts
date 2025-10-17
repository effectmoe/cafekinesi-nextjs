import { config } from 'dotenv';
import { resolve } from 'path';
import { sql } from '@vercel/postgres';

config({ path: resolve(process.cwd(), '.env.local') });

async function manualDelete() {
  console.log('🗑️  faq-3 をPostgreSQLから手動削除します...\n');

  try {
    const result = await sql`
      DELETE FROM document_embeddings
      WHERE id = 'faq-3'
      RETURNING id, type, title;
    `;

    if (result.rows.length > 0) {
      console.log('✅ 削除しました:');
      console.log(`   ID: ${result.rows[0].id}`);
      console.log(`   タイプ: ${result.rows[0].type}`);
      console.log(`   タイトル: ${result.rows[0].title}`);
    } else {
      console.log('⚠️  削除対象のドキュメントが見つかりませんでした（既に削除済み）');
    }

  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

manualDelete();
