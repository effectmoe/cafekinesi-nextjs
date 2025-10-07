import { config } from 'dotenv';
config({ path: '.env.local' });

import pkg from 'pg';
const { Client } = pkg;

async function cleanupDatabase() {
  console.log('🧹 データベースクリーンアップ開始...\n');

  const pgClient = new Client({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    await pgClient.connect();

    // 空の専門分野・経歴を持つインストラクターレコードを確認
    console.log('📊 空の内容を持つレコードを確認中...\n');

    const checkQuery = `
      SELECT id, content, metadata, created_at
      FROM embeddings
      WHERE content LIKE '%インストラクター:%'
        AND (content LIKE '%専門分野: \n%' OR content LIKE '%経歴: \n%')
      ORDER BY created_at DESC
    `;

    const emptyRecords = await pgClient.query(checkQuery);
    console.log(`📊 空の内容を持つインストラクターレコード: ${emptyRecords.rows.length}件\n`);

    if (emptyRecords.rows.length > 0) {
      console.log('削除対象のレコード:');
      emptyRecords.rows.forEach((row: any, index: number) => {
        console.log(`${index + 1}. ID: ${row.id}`);
        console.log(`   作成日時: ${row.created_at}`);
        console.log(`   内容プレビュー: ${row.content.substring(0, 150)}...`);
        console.log('');
      });

      // 削除実行
      console.log('\n🗑️ 空のレコードを削除中...');

      const deleteQuery = `
        DELETE FROM embeddings
        WHERE content LIKE '%インストラクター:%'
          AND (content LIKE '%専門分野: \n%' OR content LIKE '%経歴: \n%')
      `;

      const deleteResult = await pgClient.query(deleteQuery);
      console.log(`✅ ${deleteResult.rowCount}件のレコードを削除しました\n`);
    }

    // 残りのインストラクターレコードを確認
    const remainingQuery = `
      SELECT id, content, metadata, created_at
      FROM embeddings
      WHERE content LIKE '%インストラクター:%'
      ORDER BY created_at DESC
      LIMIT 10
    `;

    const remainingRecords = await pgClient.query(remainingQuery);
    console.log(`\n📊 残りのインストラクターレコード: ${remainingRecords.rows.length}件\n`);

    if (remainingRecords.rows.length > 0) {
      console.log('残存レコードのプレビュー:');
      remainingRecords.rows.forEach((row: any, index: number) => {
        console.log(`${index + 1}. ID: ${row.id}`);
        console.log(`   内容: ${row.content.substring(0, 300)}...`);
        console.log('');
      });
    }

    console.log('✅ クリーンアップ完了');

  } catch (error) {
    console.error('❌ エラー:', error);
  } finally {
    await pgClient.end();
    process.exit(0);
  }
}

// 実行
cleanupDatabase();