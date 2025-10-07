import { config } from 'dotenv';
config({ path: '.env.local' });

async function testChatInstructor() {
  console.log('🔍 インストラクター情報をチャットAPIでテスト...\n');

  const queries = [
    'どのようなインストラクターがいますか',
    'インストラクターの一覧を教えて',
    '北海道のインストラクターについて',
    'フェアリーズポットについて教えて'
  ];

  for (const query of queries) {
    console.log(`\n📝 質問: "${query}"`);
    console.log('------------------------------');

    try {
      const response = await fetch('http://localhost:3000/api/chat/rag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query,
          sessionId: 'test-session-' + Date.now()
        })
      });

      if (!response.ok) {
        console.error(`❌ HTTPエラー: ${response.status}`);
        continue;
      }

      const data = await response.json();
      console.log('✅ 回答:');
      console.log(data.response);

      if (data.sources && data.sources.length > 0) {
        console.log('\n📚 情報源:');
        data.sources.forEach((source: any, index: number) => {
          console.log(`${index + 1}. ${source.title || source.type}`);
        });
      }
    } catch (error) {
      console.error('❌ エラー:', error);
    }
  }

  console.log('\n\n🎉 テスト完了');
}

// 実行
testChatInstructor();