/**
 * イベントデータをSanityからRAGエンジンのデータベースに同期するスクリプト
 *
 * 使用方法:
 * npx tsx scripts/sync-events.ts
 */

import { ContentSynchronizer } from '../lib/rag/content-synchronizer';

async function main() {
  console.log('🚀 イベントデータ同期を開始...\n');

  try {
    const synchronizer = new ContentSynchronizer();

    console.log('📡 ContentSynchronizerを初期化中...');
    await synchronizer.initialize();
    console.log('✅ 初期化完了\n');

    console.log('🔄 Sanityコンテンツを同期中...');
    await synchronizer.syncSanityContent();

    console.log('\n✨ イベントデータ同期が完了しました！');
    console.log('💡 AIチャットでイベント情報を質問してテストしてください。');

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
