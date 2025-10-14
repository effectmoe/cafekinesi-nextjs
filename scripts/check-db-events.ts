/**
 * データベース内のイベントデータを確認するスクリプト
 */

import { sql } from '@vercel/postgres';

async function main() {
  console.log('🔍 データベース内のイベントデータを確認中...\n');

  try {
    // イベントタイプのドキュメント数を確認
    const eventCount = await sql`
      SELECT COUNT(*) as count
      FROM document_embeddings
      WHERE metadata->>'type' = 'event'
    `;

    console.log(`📊 イベントタイプのドキュメント数: ${eventCount.rows[0].count}件`);

    if (eventCount.rows[0].count === '0') {
      console.log('\n⚠️ イベントデータが見つかりません！');

      // 全体のドキュメント数も確認
      const totalCount = await sql`
        SELECT COUNT(*) as count
        FROM document_embeddings
      `;
      console.log(`📊 全ドキュメント数: ${totalCount.rows[0].count}件`);

      // タイプ別の件数を確認
      const typeCount = await sql`
        SELECT metadata->>'type' as type, COUNT(*) as count
        FROM document_embeddings
        GROUP BY metadata->>'type'
        ORDER BY count DESC
      `;

      console.log('\n📊 タイプ別ドキュメント数:');
      typeCount.rows.forEach((row: any) => {
        console.log(`  - ${row.type || 'null'}: ${row.count}件`);
      });
    } else {
      // イベントデータの詳細を表示
      const events = await sql`
        SELECT
          id,
          metadata->>'title' as title,
          metadata->>'id' as sanity_id,
          metadata->>'updatedAt' as updated_at,
          LENGTH(content) as content_length,
          embedding IS NOT NULL as has_embedding
        FROM document_embeddings
        WHERE metadata->>'type' = 'event'
        ORDER BY updated_at DESC
      `;

      console.log('\n📋 イベントデータの詳細:');
      events.rows.forEach((event: any, idx: number) => {
        console.log(`\n  ${idx + 1}. ${event.title || 'タイトルなし'}`);
        console.log(`     ID: ${event.id}`);
        console.log(`     Sanity ID: ${event.sanity_id || 'N/A'}`);
        console.log(`     更新日時: ${event.updated_at || 'N/A'}`);
        console.log(`     コンテンツ長: ${event.content_length}文字`);
        console.log(`     埋め込みあり: ${event.has_embedding ? 'はい' : 'いいえ'}`);
      });
    }

    console.log('\n✅ 確認完了！');

  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error);
    if (error instanceof Error) {
      console.error('エラーメッセージ:', error.message);
      console.error('スタックトレース:', error.stack);
    }
    process.exit(1);
  }
}

main();
