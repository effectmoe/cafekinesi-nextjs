import { config } from 'dotenv';
import { resolve } from 'path';
import { sql } from '@vercel/postgres';
import { publicClient } from '../lib/sanity.client';
import { groq } from 'next-sanity';

config({ path: resolve(process.cwd(), '.env.local') });

async function verifyTestFaq() {
  console.log('🔍 テスト用FAQの状態を確認中...\n');

  try {
    // 1. PostgreSQLで確認
    console.log('【PostgreSQL】');
    const pgResult = await sql`
      SELECT id, type, title, content
      FROM document_embeddings
      WHERE id = 'test-delete-sync-faq';
    `;

    if (pgResult.rows.length === 0) {
      console.log('❌ PostgreSQLに存在しません（まだ同期されていないか、既に削除されています）\n');
    } else {
      console.log('✅ PostgreSQLに存在しています');
      console.log(`   ID: ${pgResult.rows[0].id}`);
      console.log(`   タイプ: ${pgResult.rows[0].type}`);
      console.log(`   タイトル: ${pgResult.rows[0].title}`);
      console.log(`   コンテンツ: ${pgResult.rows[0].content.substring(0, 100)}...`);
      console.log('');
    }

    // 2. Sanityで確認
    console.log('【Sanity CMS】');
    const sanityResult = await publicClient.fetch(groq`
      *[_id == "test-delete-sync-faq"][0] {
        _id,
        question,
        answer
      }
    `);

    if (!sanityResult) {
      console.log('❌ Sanityに存在しません（削除されました）\n');
    } else {
      console.log('✅ Sanityに存在しています');
      console.log(`   ID: ${sanityResult._id}`);
      console.log(`   質問: ${sanityResult.question}`);
      console.log(`   回答: ${sanityResult.answer}`);
      console.log('');
    }

    // 3. 総括
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
    if (pgResult.rows.length > 0 && sanityResult) {
      console.log('✅ 両方に存在：正常に同期されています');
    } else if (pgResult.rows.length === 0 && !sanityResult) {
      console.log('✅ 両方から削除：削除同期が正常に動作しています！');
    } else if (pgResult.rows.length > 0 && !sanityResult) {
      console.log('❌ PostgreSQLに残っています：削除同期が動作していません');
    } else if (pgResult.rows.length === 0 && sanityResult) {
      console.log('⚠️  Sanityにのみ存在：まだPostgreSQLに同期されていません（数秒待ってから再確認してください）');
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

verifyTestFaq();
