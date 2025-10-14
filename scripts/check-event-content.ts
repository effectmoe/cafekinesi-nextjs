/**
 * イベントデータの内容を詳細確認するスクリプト
 */

import { sql } from '@vercel/postgres';

async function main() {
  console.log('🔍 イベントデータの内容を詳細確認中...\n');

  try {
    // イベントデータを取得
    const events = await sql`
      SELECT
        id,
        type,
        title,
        content,
        metadata
      FROM document_embeddings
      WHERE type = 'event'
      ORDER BY title
    `;

    console.log(`📊 イベント件数: ${events.rows.length}件\n`);

    events.rows.forEach((event: any, idx: number) => {
      console.log(`${'='.repeat(80)}`);
      console.log(`イベント ${idx + 1}: ${event.title}`);
      console.log(`${'='.repeat(80)}`);
      console.log(`ID: ${event.id}`);
      console.log(`\n【メタデータ】`);
      const metadata = event.metadata;
      console.log(JSON.stringify(metadata, null, 2));
      console.log(`\n【コンテンツ全文】`);
      console.log(event.content);
      console.log('\n');
    });

    console.log('✅ 確認完了！');

  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error);
    if (error instanceof Error) {
      console.error('エラーメッセージ:', error.message);
    }
    process.exit(1);
  }
}

main();
