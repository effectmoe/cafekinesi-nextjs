import { config } from 'dotenv';
config({ path: '.env.local' });

import { VercelVectorStore } from '../lib/vector/vercel-vector-store';
import { RAGEngine } from '../lib/rag/rag-engine';

async function debugSearch() {
  console.log('🔍 検索デバッグ開始...\n');

  const vectorStore = new VercelVectorStore();
  await vectorStore.initialize();

  const queries = [
    'インストラクター',
    'どのようなインストラクターがいますか',
    'フェアリーズポット',
    'AKO'
  ];

  for (const query of queries) {
    console.log(`\n========================================`);
    console.log(`📝 クエリ: "${query}"`);
    console.log(`========================================\n`);

    try {
      // 直接ベクター検索
      const results = await vectorStore.hybridSearch(query, {
        topK: 10,
        threshold: 0.2
      });

      console.log(`📊 検索結果数: ${results.length}\n`);

      if (results.length > 0) {
        console.log('🔝 上位3件の結果:\n');
        results.slice(0, 3).forEach((result: any, index: number) => {
          console.log(`${index + 1}. [スコア: ${result.combined_score?.toFixed(3) || result.vector_score?.toFixed(3)}]`);
          console.log(`   内容: ${result.content.substring(0, 200)}...`);
          if (result.metadata) {
            console.log(`   メタデータ: ${JSON.stringify(result.metadata).substring(0, 100)}...`);
          }
          console.log('');
        });
      } else {
        console.log('⚠️ 検索結果が見つかりませんでした');
      }

      // RAGエンジンでのテスト
      console.log('\n--- RAGエンジン経由での処理 ---\n');
      const ragEngine = new RAGEngine();
      await ragEngine.initialize();

      const augmentedData = await ragEngine.generateAugmentedResponse(query, {
        vectorSearch: {
          topK: 10,
          threshold: 0.2
        }
      });

      console.log('📝 生成されたコンテキスト（最初の500文字）:');
      console.log(augmentedData.prompt.substring(0, 500) + '...\n');

      console.log(`📊 ソース数: ${augmentedData.sources?.length || 0}`);
      console.log(`📊 信頼度: ${augmentedData.confidence?.toFixed(3) || 0}`);

    } catch (error) {
      console.error('❌ エラー:', error);
    }
  }

  console.log('\n\n✅ デバッグ完了');
  process.exit(0);
}

// 実行
debugSearch();