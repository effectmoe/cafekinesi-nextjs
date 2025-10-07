import { config } from 'dotenv';
config({ path: '.env.local' });

import { ContentSynchronizer } from '../lib/rag/content-synchronizer';

async function syncData() {
  console.log('🔄 データ同期開始...');

  const syncer = new ContentSynchronizer();
  await syncer.initialize();
  await syncer.syncSanityContent();

  console.log('✅ 完了');
  process.exit(0);
}

syncData();