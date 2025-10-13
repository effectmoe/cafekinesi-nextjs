import { sql } from '@vercel/postgres';

/**
 * 古いチャンクデータを削除するスクリプト
 * 旧システムで作成された `-chunk-` パターンのIDを持つレコードを削除します
 */
async function cleanupOldChunks() {
  console.log('🧹 Starting cleanup of old chunk data...\n');

  try {
    // 削除対象のチャンクを確認
    const chunks = await sql`
      SELECT id, type, title, updated_at
      FROM document_embeddings
      WHERE id LIKE '%-chunk-%'
      ORDER BY updated_at DESC;
    `;

    console.log(`📊 Found ${chunks.rows.length} old chunk(s) to delete:\n`);

    if (chunks.rows.length === 0) {
      console.log('✅ No old chunks found. Database is clean!');
      return;
    }

    // チャンク一覧を表示
    chunks.rows.forEach((chunk, index) => {
      console.log(`${index + 1}. ID: ${chunk.id}`);
      console.log(`   Title: ${chunk.title}`);
      console.log(`   Updated: ${chunk.updated_at}`);
      console.log('');
    });

    // 削除実行
    console.log('🗑️  Deleting old chunks...\n');

    const deleteResult = await sql`
      DELETE FROM document_embeddings
      WHERE id LIKE '%-chunk-%';
    `;

    console.log(`✅ Successfully deleted ${deleteResult.rowCount} old chunk(s)!\n`);

    // 削除後の確認
    const remaining = await sql`
      SELECT COUNT(*) as count
      FROM document_embeddings;
    `;

    console.log(`📊 Remaining documents in vector DB: ${remaining.rows[0].count}`);

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  }
}

// スクリプト実行
cleanupOldChunks()
  .then(() => {
    console.log('\n✅ Cleanup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Cleanup failed:', error);
    process.exit(1);
  });
