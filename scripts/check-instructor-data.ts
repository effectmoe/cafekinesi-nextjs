import { config } from 'dotenv';
config({ path: '.env.local' });

import pkg from 'pg';
const { Client } = pkg;

async function checkInstructorData() {
  const pgClient = new Client({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    await pgClient.connect();

    console.log('🔍 インストラクターデータを確認中...\n');

    // インストラクター関連のデータをすべて取得
    const query = `
      SELECT
        id,
        content,
        metadata,
        created_at
      FROM embeddings
      WHERE content LIKE '%インストラクター:%'
      ORDER BY created_at DESC
      LIMIT 20
    `;

    const result = await pgClient.query(query);

    console.log(`📊 インストラクター関連レコード: ${result.rows.length}件\n`);

    result.rows.forEach((row: any, index: number) => {
      console.log(`\n====== レコード ${index + 1} ======`);
      console.log('ID:', row.id);
      console.log('作成日時:', row.created_at);
      console.log('メタデータ:', JSON.stringify(row.metadata, null, 2));
      console.log('内容 (最初の500文字):');
      console.log(row.content.substring(0, 500));
      console.log('');
    });

    // 検索テスト
    console.log('\n\n🔍 「インストラクター」で検索テスト...\n');

    const searchQuery = `
      SELECT
        id,
        content,
        metadata,
        1 - (embedding <=> (
          SELECT embedding FROM embeddings WHERE content LIKE '%インストラクター:%' LIMIT 1
        )) as similarity
      FROM embeddings
      WHERE content LIKE '%インストラクター%'
      ORDER BY similarity DESC
      LIMIT 10
    `;

    const searchResult = await pgClient.query(searchQuery);

    console.log('検索結果:');
    searchResult.rows.forEach((row: any, index: number) => {
      const meta = row.metadata || {};
      console.log(`${index + 1}. [類似度: ${row.similarity?.toFixed(4)}] ${meta.title || meta.name || 'タイトルなし'}`);
      console.log(`   タイプ: ${meta.type}`);
      console.log(`   内容プレビュー: ${row.content.substring(0, 150)}...`);
    });

  } catch (error) {
    console.error('❌ エラー:', error);
  } finally {
    await pgClient.end();
  }
}

checkInstructorData();