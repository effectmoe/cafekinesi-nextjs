import { config } from 'dotenv';
import { ContentSynchronizer } from '../lib/rag/content-synchronizer';

// .env.localファイルを明示的に読み込み
config({ path: '.env.local' });

async function syncContent() {
  console.log('🚀 コンテンツ同期開始...');

  try {
    const synchronizer = new ContentSynchronizer();
    console.log('⚙️ ContentSynchronizer初期化中...');
    await synchronizer.initialize();

    console.log('📊 同期前の統計情報を取得中...');
    // 同期前の状態を確認
    try {
      const beforeStats = await synchronizer['vectorStore'].getStats();
      console.log('📈 同期前:', beforeStats);
    } catch (error) {
      console.log('📈 同期前の統計取得でエラー（初回同期の場合は正常）:', error.message);
    }

    // Sanityコンテンツ同期実行
    await synchronizer.syncSanityContent();

    // 同期後の統計情報
    console.log('📊 同期後の統計情報を取得中...');
    const afterStats = await synchronizer['vectorStore'].getStats();
    console.log('📈 同期後:', afterStats);

    console.log('✅ 同期完了！');
    console.log(`📊 合計ドキュメント数: ${afterStats.total_documents}`);
    console.log(`📚 ソース数: ${afterStats.sources}`);
    console.log(`⏰ 最終更新: ${afterStats.last_update}`);

  } catch (error) {
    console.error('❌ 同期中にエラーが発生しました:', error);
    throw error;
  }
}

// スクリプト実行
if (require.main === module) {
  syncContent()
    .then(() => {
      console.log('🎉 スクリプト正常終了');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 スクリプト異常終了:', error);
      process.exit(1);
    });
}

export { syncContent };