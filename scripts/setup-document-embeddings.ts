import { config } from 'dotenv';
import { initDocumentEmbeddingsTable, getDocumentEmbeddingsStats } from '../lib/db/init-document-embeddings';

// .env.localファイルを明示的に読み込み
config({ path: '.env.local' });

async function setup() {
  console.log('🚀 Setting up document_embeddings table...\n');
  console.log('📊 Environment check:');
  console.log('  POSTGRES_URL:', process.env.POSTGRES_URL ? '✅ 設定済み' : '❌ 未設定');
  console.log('  OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✅ 設定済み' : '⚠️ 未設定（ローカルモデル使用）');
  console.log('');

  try {
    // テーブル初期化
    await initDocumentEmbeddingsTable();

    // 統計情報取得
    console.log('\n📊 Table statistics:');
    const stats = await getDocumentEmbeddingsStats();
    if (stats) {
      console.log('  Total documents:', stats.total_count);
      console.log('  Document types:', stats.type_count);
      console.log('  Last updated:', stats.last_updated || 'N/A');
      console.log('  Table size:', stats.table_size);
    }

    console.log('\n✅ Setup completed successfully!');
    console.log('\n💡 Next steps:');
    console.log('  1. 環境変数を設定（OPENAI_API_KEY）');
    console.log('  2. Sanityコンテンツを同期: npm run sanity:sync');
    console.log('  3. AIチャットボットをテスト');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    process.exit(1);
  }
}

setup();
