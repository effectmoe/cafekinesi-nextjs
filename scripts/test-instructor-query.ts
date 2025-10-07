import { config } from 'dotenv';
config({ path: '.env.local' });

import { VercelVectorStore } from '../lib/vector/vercel-vector-store';

async function testInstructorQuery() {
  const vectorStore = new VercelVectorStore();
  await vectorStore.initialize();

  const query = 'どのようなインストラクターがいますか';
  console.log(`🔍 クエリ: "${query}"\n`);

  const results = await vectorStore.hybridSearch(query, {
    topK: 20,
    threshold: 0.15
  });

  console.log(`📊 検索結果数: ${results.length}\n`);
  console.log('全検索結果:');
  console.log('============\n');

  results.forEach((result: any, index: number) => {
    const score = result.combined_score || result.vector_score;
    const meta = result.metadata || {};
    console.log(`${index + 1}. [スコア: ${score?.toFixed(4)}] ${meta.title || meta.name || 'Unknown'}`);
    console.log(`   タイプ: ${meta.type}`);
    if (meta.type === 'instructor') {
      console.log(`   ✅ インストラクターデータ`);
    }
    console.log('');
  });

  // インストラクターデータの数をカウント
  const instructorCount = results.filter((r: any) => r.metadata?.type === 'instructor').length;
  console.log(`\n📊 インストラクターデータ: ${instructorCount}件 / ${results.length}件`);
}

testInstructorQuery();