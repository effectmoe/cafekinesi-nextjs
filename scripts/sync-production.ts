import { config } from 'dotenv';
config({ path: '.env.local' });

async function syncProduction() {
  console.log('🔄 本番環境のデータベース同期を開始...\n');

  const token = process.env.SANITY_REVALIDATE_SECRET;

  if (!token) {
    console.error('❌ SANITY_REVALIDATE_SECRETが設定されていません');
    return;
  }

  try {
    const response = await fetch('https://cafekinesi-nextjs.vercel.app/api/admin/sync-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ 同期エラー: ${response.status} ${response.statusText}`);
      console.error('エラー詳細:', errorText);
      return;
    }

    const data = await response.json();

    console.log('✅ 同期成功！');
    console.log('\n📊 統計情報:');
    console.log(`- 総ドキュメント数: ${data.stats.totalDocuments}`);
    console.log(`- ソース数: ${data.stats.sources}`);
    console.log(`- 最終更新: ${data.stats.lastUpdate}`);

  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

// 実行
syncProduction();