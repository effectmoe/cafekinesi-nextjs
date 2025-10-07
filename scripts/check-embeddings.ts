import { config } from 'dotenv';
config({ path: '.env.local' });

import pkg from 'pg';
const { Client } = pkg;

async function checkEmbeddings() {
  console.log('🔍 embeddingsテーブルの内容を確認...\n');

  const pgClient = new Client({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    await pgClient.connect();

    // テーブル構造を確認
    const columnsQuery = `
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'embeddings'
      ORDER BY ordinal_position
    `;

    const columns = await pgClient.query(columnsQuery);
    console.log('📊 embeddingsテーブルの構造:\n');

    columns.rows.forEach((col: any) => {
      console.log(`- ${col.column_name}: ${col.data_type}`);
    });

    // 総レコード数を確認
    const countQuery = `SELECT COUNT(*) as total FROM embeddings`;
    const countResult = await pgClient.query(countQuery);
    console.log(`\n📊 総レコード数: ${countResult.rows[0].total}\n`);

    // sourceごとの集計
    const sourceQuery = `
      SELECT source, COUNT(*) as count
      FROM embeddings
      GROUP BY source
      ORDER BY count DESC
    `;

    const sourceResult = await pgClient.query(sourceQuery);
    console.log('📊 ソース別レコード数:\n');

    sourceResult.rows.forEach((row: any) => {
      console.log(`- ${row.source || '(null)'}: ${row.count}件`);
    });

    // インストラクター関連のレコードを確認
    console.log('\n=== インストラクター関連レコード ===\n');

    const instructorQuery = `
      SELECT id, source, content, metadata, created_at
      FROM embeddings
      WHERE content LIKE '%インストラクター%'
      ORDER BY created_at DESC
      LIMIT 10
    `;

    const instructorResult = await pgClient.query(instructorQuery);
    console.log(`📊 インストラクター関連: ${instructorResult.rows.length}件\n`);

    instructorResult.rows.forEach((row: any, index: number) => {
      console.log(`${index + 1}. [ID: ${row.id}] [ソース: ${row.source}]`);
      console.log(`   作成日時: ${row.created_at}`);
      console.log(`   内容: ${row.content.substring(0, 200)}...`);
      if (row.metadata) {
        console.log(`   メタデータ: ${JSON.stringify(row.metadata).substring(0, 100)}...`);
      }
      console.log('');
    });

    // 特定のインストラクターで検索
    console.log('\n=== 特定のインストラクター検索 ===\n');

    const akoQuery = `
      SELECT id, content, created_at
      FROM embeddings
      WHERE content LIKE '%フェアリーズポット%' OR content LIKE '%AKO%'
      ORDER BY created_at DESC
      LIMIT 5
    `;

    const akoResult = await pgClient.query(akoQuery);
    console.log(`📊 「フェアリーズポット AKO」関連: ${akoResult.rows.length}件\n`);

    if (akoResult.rows.length > 0) {
      console.log('最初のレコードの全内容:');
      console.log(akoResult.rows[0].content);
    }

    // 最新のレコードを確認
    console.log('\n=== 最新のレコード (5件) ===\n');

    const latestQuery = `
      SELECT id, source, created_at, content
      FROM embeddings
      ORDER BY created_at DESC
      LIMIT 5
    `;

    const latestResult = await pgClient.query(latestQuery);

    latestResult.rows.forEach((row: any, index: number) => {
      console.log(`${index + 1}. [ID: ${row.id}] [ソース: ${row.source}]`);
      console.log(`   作成日時: ${row.created_at}`);
      console.log(`   内容: ${row.content.substring(0, 150)}...`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ エラー:', error);
  } finally {
    await pgClient.end();
    process.exit(0);
  }
}

// 実行
checkEmbeddings();