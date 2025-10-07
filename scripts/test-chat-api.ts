import { config } from 'dotenv';

// .env.localファイルを明示的に読み込み
config({ path: '.env.local' });

async function testChatAPI() {
  console.log('🔍 チャットAPI実際のテスト開始...\n');

  const queries = [
    'どのようなインストラクターがいますか',
    'インストラクターについて教えて',
    'インストラクター情報を教えて',
    'Harmony Lightについて教えて'
  ];

  for (const query of queries) {
    console.log(`📝 クエリ: "${query}"`);

    try {
      const response = await fetch('http://localhost:3000/api/chat/rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          sessionId: 'test-instructor-search'
        })
      });

      if (!response.ok) {
        console.log(`❌ APIエラー: ${response.status} ${response.statusText}`);
        continue;
      }

      const data = await response.json();

      console.log(`✅ レスポンス受信:`);
      console.log(`   メッセージ: ${data.response?.substring(0, 200)}...`);

      if (data.sources && data.sources.length > 0) {
        console.log(`   情報源 (${data.sources.length}件):`);
        data.sources.slice(0, 3).forEach((source: any, index: number) => {
          console.log(`   ${index + 1}. ${source.type}: ${source.content?.substring(0, 80)}...`);
        });
      } else {
        console.log(`   ❌ 情報源が見つかりません`);
      }

      if (data.metadata) {
        console.log(`   検索統計: 内部${data.metadata.searchResults || 0}件, Web${data.metadata.webResults || 0}件`);
        console.log(`   信頼度: ${data.metadata.confidence ? Math.round(data.metadata.confidence * 100) : '不明'}%`);
      }

    } catch (error) {
      console.log(`❌ リクエストエラー:`, error.message);
    }

    console.log('');
  }
}

// 実行
testChatAPI();