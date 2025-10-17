import { config } from 'dotenv';
import { resolve } from 'path';
import { hybridSearch } from '@/lib/db/document-vector-operations';

config({ path: resolve(process.cwd(), '.env.local') });

async function main() {
  const query = '大阪から新幹線でカフェキネシに行きたいです。どこの駅で降りたらいいですか？';

  console.log('🔍 ハイブリッド検索テスト');
  console.log('質問:', query);
  console.log('\n--- knowledgeBase タイプでの検索 ---\n');

  try {
    const resultsKB = await hybridSearch(query, {
      topK: 5,
      threshold: 0.03,
      type: 'knowledgeBase'
    });

    console.log(`📚 knowledgeBase 検索結果: ${resultsKB.length}件\n`);

    resultsKB.forEach((result: any, idx: number) => {
      console.log(`${idx + 1}. ${result.title}`);
      console.log(`   スコア: vector=${result.vector_score?.toFixed(4)}, text=${result.text_score?.toFixed(4)}, combined=${result.combined_score?.toFixed(4)}`);
      console.log(`   Content preview: ${result.content?.substring(0, 200)}...`);
      console.log('');
    });

    console.log('\n--- タイプ指定なしでの検索 ---\n');

    const resultsAll = await hybridSearch(query, {
      topK: 5,
      threshold: 0.03
    });

    console.log(`📋 全体検索結果: ${resultsAll.length}件\n`);

    resultsAll.forEach((result: any, idx: number) => {
      console.log(`${idx + 1}. [${result.type}] ${result.title}`);
      console.log(`   スコア: vector=${result.vector_score?.toFixed(4)}, text=${result.text_score?.toFixed(4)}, combined=${result.combined_score?.toFixed(4)}`);
      console.log(`   Content preview: ${result.content?.substring(0, 200)}...`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ エラー:', error);
    process.exit(1);
  }
}

main();
