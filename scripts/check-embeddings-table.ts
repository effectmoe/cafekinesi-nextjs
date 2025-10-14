/**
 * embeddingsテーブルの内容を確認するスクリプト
 */

import { sql } from '@vercel/postgres';

async function main() {
  console.log('🔍 embeddingsテーブルの内容を確認中...\n');

  try {
    // 全ドキュメント数を確認
    const totalCount = await sql`
      SELECT COUNT(*) as count
      FROM embeddings
    `;

    console.log(`📊 全ドキュメント数: ${totalCount.rows[0].count}件`);

    if (totalCount.rows[0].count === '0') {
      console.log('\n⚠️ embeddingsテーブルにデータがありません！');
    } else {
      // タイプ別の件数を確認
      const typeCount = await sql`
        SELECT metadata->>'type' as type, COUNT(*) as count
        FROM embeddings
        GROUP BY metadata->>'type'
        ORDER BY count DESC
      `;

      console.log('\n📊 タイプ別ドキュメント数:');
      typeCount.rows.forEach((row: any) => {
        console.log(`  - ${row.type || 'null'}: ${row.count}件`);
      });

      // イベントデータがあるか確認
      const eventCount = await sql`
        SELECT COUNT(*) as count
        FROM embeddings
        WHERE metadata->>'type' = 'event'
      `;

      if (eventCount.rows[0].count !== '0') {
        console.log(`\n✅ イベントデータ: ${eventCount.rows[0].count}件`);

        // イベントの詳細を表示
        const events = await sql`
          SELECT
            metadata->>'title' as title,
            metadata->>'type' as type,
            LENGTH(content) as content_length,
            source
          FROM embeddings
          WHERE metadata->>'type' = 'event'
          LIMIT 5
        `;

        console.log('\nイベントの詳細（最大5件）:');
        events.rows.forEach((event: any, idx: number) => {
          console.log(`\n  ${idx + 1}. ${event.title || 'タイトルなし'}`);
          console.log(`     タイプ: ${event.type}`);
          console.log(`     コンテンツ長: ${event.content_length}文字`);
          console.log(`     ソース: ${event.source}`);
        });
      } else {
        console.log('\n⚠️ イベントデータが見つかりません');
      }
    }

    console.log('\n✅ 確認完了！');

  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error);
    if (error instanceof Error) {
      console.error('エラーメッセージ:', error.message);
    }
    process.exit(1);
  }
}

main();
