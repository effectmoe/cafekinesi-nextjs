import { config } from 'dotenv';
import { RAGEngine } from '../lib/rag/rag-engine';

// .env.localファイルを明示的に読み込み
config({ path: '.env.local' });

async function testInstructorSearch() {
  console.log('🔍 インストラクター検索テスト開始...\n');

  try {
    const ragEngine = new RAGEngine();
    await ragEngine.initialize();

    // 様々なインストラクター関連クエリをテスト
    const queries = [
      'インストラクター',
      'どのようなインストラクターがいますか',
      'インストラクターについて教えて',
      '講師について',
      '先生について',
      'instructor',
      'teacher'
    ];

    for (const query of queries) {
      console.log(`📝 クエリ: "${query}"`);
      const results = await ragEngine.testSearch(query);

      if (results.length === 0) {
        console.log('❌ 検索結果が見つかりませんでした');
      } else {
        console.log(`✅ ${results.length}件の結果が見つかりました:`);
        results.slice(0, 3).forEach((result, index) => {
          console.log(`${index + 1}. スコア: ${result.score?.toFixed(3)} - ${result.title || result.type}`);
          console.log(`   内容: ${result.content.substring(0, 100)}...`);
        });
      }
      console.log('');
    }

  } catch (error) {
    console.error('❌ テスト中にエラーが発生:', error);
  }
}

// 実行
testInstructorSearch();