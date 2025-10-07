import { config } from 'dotenv';
import { RAGEngine } from '../lib/rag/rag-engine';

// .env.localファイルを明示的に読み込み
config({ path: '.env.local' });

async function testRAGDirect() {
  console.log('🔍 RAGエンジン直接テスト開始...\n');

  try {
    const ragEngine = new RAGEngine();
    await ragEngine.initialize();

    const query = 'どのようなインストラクターがいますか';
    console.log(`📝 クエリ: "${query}"`);

    // 実際のRAGレスポンス生成をテスト
    const mockConfig = {
      vectorSearch: {
        topK: 5,
        threshold: 0.3
      },
      webSearch: {
        enabled: false
      },
      integration: {
        internalWeight: 0.7,
        externalWeight: 0.3
      }
    };

    console.log('⚙️ 設定:', JSON.stringify(mockConfig, null, 2));

    const result = await ragEngine.generateAugmentedResponse(query, mockConfig);

    console.log('\n📊 RAG結果:');
    console.log('- プロンプト長:', result.prompt.length);
    console.log('- 情報源数:', result.sources.length);
    console.log('- 信頼度:', result.confidence);
    console.log('- 検索結果数:', result.searchResults.length);

    if (result.searchResults.length > 0) {
      console.log('\n🔍 検索結果の詳細:');
      result.searchResults.forEach((r: any, index: number) => {
        console.log(`${index + 1}. タイトル: ${r.title || 'N/A'}`);
        console.log(`   スコア: ${r.combined_score || r.vector_score || 'N/A'}`);
        console.log(`   内容: ${r.content.substring(0, 100)}...`);
        console.log('');
      });
    }

    if (result.sources.length > 0) {
      console.log('\n📚 情報源の詳細:');
      result.sources.forEach((s: any, index: number) => {
        console.log(`${index + 1}. タイプ: ${s.type}`);
        console.log(`   スコア: ${s.score || 'N/A'}`);
        console.log(`   内容: ${s.content || 'N/A'}`);
        console.log('');
      });
    }

    console.log('\n📄 構築されたプロンプト:');
    console.log(result.prompt.substring(0, 500) + '...');

  } catch (error) {
    console.error('❌ テスト中にエラーが発生:', error);
  }
}

// 実行
testRAGDirect();