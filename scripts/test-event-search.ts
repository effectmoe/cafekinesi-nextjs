/**
 * イベント検索のテストスクリプト
 */

import 'dotenv/config';
import { RAGEngine } from '../lib/rag/rag-engine';

async function main() {
  console.log('🔍 イベント検索テスト開始...\n');

  try {
    const ragEngine = new RAGEngine();

    console.log('📡 RAGエンジンを初期化中...');
    await ragEngine.initialize();
    console.log('✅ 初期化完了\n');

    const testQueries = [
      '今月のイベントはありますか？',
      'イベント情報を教えてください',
      '開催予定のセッションについて',
    ];

    for (const query of testQueries) {
      console.log(`\n🔎 質問: "${query}"`);
      console.log('─'.repeat(60));

      const searchConfig = {
        vectorSearch: {
          topK: 30,
          threshold: 0.05
        }
      };

      const result = await ragEngine.generateAugmentedResponse(query, searchConfig);

      console.log(`📊 検索結果: ${result.searchResults?.length || 0}件`);

      if (result.searchResults && result.searchResults.length > 0) {
        console.log('\n検索結果の詳細:');
        result.searchResults.slice(0, 5).forEach((item: any, idx: number) => {
          console.log(`\n  ${idx + 1}. タイプ: ${item.metadata?.type || 'unknown'}`);
          console.log(`     タイトル: ${item.metadata?.title || item.metadata?.name || 'N/A'}`);
          console.log(`     類似度スコア: ${item.similarity?.toFixed(4) || 'N/A'}`);
          console.log(`     コンテンツ(最初の100文字): ${item.content?.substring(0, 100) || 'N/A'}...`);
        });
      } else {
        console.log('⚠️ 検索結果なし');
      }

      console.log('\n生成されたプロンプト（最初の200文字）:');
      console.log(result.prompt.substring(0, 200) + '...');
    }

    console.log('\n\n✨ テスト完了！');

  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error);
    if (error instanceof Error) {
      console.error('エラーメッセージ:', error.message);
      console.error('スタックトレース:', error.stack);
    }
    process.exit(1);
  }
}

main();
