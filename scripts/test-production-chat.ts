import { config } from 'dotenv';
config({ path: '.env.local' });

async function testProductionChat() {
  console.log('🔍 本番環境のチャットAPIをテスト...\n');

  const queries = [
    'インストラクターについて教えて',
    'どのようなインストラクターがいますか',
    'フェアリーズポット AKOについて',
    '北海道のインストラクター'
  ];

  for (const query of queries) {
    console.log(`\n📝 質問: "${query}"`);
    console.log('------------------------------');

    try {
      // 本番環境のAPIを直接テスト
      const response = await fetch('https://cafekinesi-nextjs.vercel.app/api/chat/rag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query,
          sessionId: 'test-prod-' + Date.now()
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ HTTPエラー: ${response.status}`);
        console.error('エラー内容:', errorText);
        continue;
      }

      const data = await response.json();
      console.log('✅ 回答:');
      console.log(data.response);

      if (data.debug) {
        console.log('\n🔍 デバッグ情報:');
        console.log('- 検索結果数:', data.debug.searchResultsCount);
        console.log('- 信頼度:', data.debug.confidence);
        if (data.debug.topResults) {
          console.log('- 上位結果:');
          data.debug.topResults.forEach((r: any, i: number) => {
            console.log(`  ${i + 1}. スコア: ${r.score} - ${r.title || r.type}`);
          });
        }
      }
    } catch (error) {
      console.error('❌ エラー:', error);
    }
  }

  console.log('\n\n🎉 本番環境テスト完了');
}

// 実行
testProductionChat();