import { config } from 'dotenv';
config({ path: '.env.local' });

import pkg from 'pg';
const { Client } = pkg;
import { pipeline } from '@xenova/transformers';

async function testInstructorScores() {
  const pgClient = new Client({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    await pgClient.connect();

    // 埋め込みモデル初期化
    const embedder = await pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2'
    );

    // テストクエリ
    const query = "どのようなインストラクターがいますか";

    // クエリ埋め込み生成
    const output = await embedder(query, {
      pooling: 'mean',
      normalize: true
    });
    const queryEmbedding = Array.from(output.data);

    console.log(`🔍 クエリ: "${query}"`);
    console.log('📊 インストラクターデータのスコアを計算中...\n');

    // インストラクターデータのスコアを取得
    const instructorQuery = `
      SELECT
        id,
        content,
        metadata,
        1 - (embedding <=> $1::vector) as similarity
      FROM embeddings
      WHERE content LIKE '%インストラクター:%'
      ORDER BY similarity DESC
      LIMIT 20
    `;

    const result = await pgClient.query(instructorQuery, [JSON.stringify(queryEmbedding)]);

    console.log('インストラクターデータの類似度スコア:');
    console.log('================================\n');

    result.rows.forEach((row: any, index: number) => {
      const meta = row.metadata || {};
      const name = meta.name || meta.title || 'Unknown';
      console.log(`${index + 1}. ${name}`);
      console.log(`   類似度スコア: ${row.similarity?.toFixed(4)}`);
      console.log(`   タイプ: ${meta.type}`);
      console.log(`   内容プレビュー: ${row.content.substring(0, 100)}...`);
      console.log('');
    });

    // 閾値ごとの結果数を表示
    const thresholds = [0.3, 0.25, 0.2, 0.15, 0.1, 0.05];
    console.log('\n閾値ごとの結果数:');
    console.log('================');

    for (const threshold of thresholds) {
      const count = result.rows.filter((r: any) => r.similarity > threshold).length;
      console.log(`閾値 ${threshold}: ${count}件`);
    }

  } catch (error) {
    console.error('❌ エラー:', error);
  } finally {
    await pgClient.end();
  }
}

testInstructorScores();