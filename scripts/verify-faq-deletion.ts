import { config } from 'dotenv';
import { resolve } from 'path';
import { sql } from '@vercel/postgres';
import { publicClient } from '../lib/sanity.client';
import { groq } from 'next-sanity';

config({ path: resolve(process.cwd(), '.env.local') });

async function verifyDeletion() {
  console.log('🔍 faq-3 の削除を確認中...\n');

  try {
    // 1. PostgreSQLで確認
    console.log('【PostgreSQL】');
    const pgResult = await sql`
      SELECT id, type, title
      FROM document_embeddings
      WHERE id = 'faq-3';
    `;

    if (pgResult.rows.length === 0) {
      console.log('✅ PostgreSQLから削除されています\n');
    } else {
      console.log('❌ PostgreSQLにまだ存在しています');
      console.log('   ID:', pgResult.rows[0].id);
      console.log('   タイトル:', pgResult.rows[0].title);
      console.log('');
    }

    // 2. Sanityで確認
    console.log('【Sanity CMS】');
    const sanityResult = await publicClient.fetch(groq`
      *[_id == "faq-3"][0] {
        _id,
        question,
        answer
      }
    `);

    if (!sanityResult) {
      console.log('✅ Sanityから削除されています\n');
    } else {
      console.log('❌ Sanityにまだ存在しています');
      console.log('   ID:', sanityResult._id);
      console.log('   質問:', sanityResult.question);
      console.log('');
    }

    // 3. 「チーズケーキ」を含むドキュメントを再確認
    console.log('【再確認: チーズケーキを含むドキュメント】');
    const cheesecakeCheck = await sql`
      SELECT id, type, title
      FROM document_embeddings
      WHERE content ILIKE '%チーズケーキ%';
    `;

    if (cheesecakeCheck.rows.length === 0) {
      console.log('✅ チーズケーキを含むドキュメントは0件です\n');
    } else {
      console.log(`❌ まだ ${cheesecakeCheck.rows.length} 件のドキュメントが見つかりました`);
      cheesecakeCheck.rows.forEach((row: any) => {
        console.log(`   - [${row.type}] ${row.title} (ID: ${row.id})`);
      });
      console.log('');
    }

    // 4. 総括
    const allDeleted = pgResult.rows.length === 0 && !sanityResult && cheesecakeCheck.rows.length === 0;

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
    if (allDeleted) {
      console.log('✅ 削除成功！すべてのデータが正しく削除されました');
    } else {
      console.log('⚠️  まだ一部のデータが残っています。手動で削除が必要です。');
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

verifyDeletion();
