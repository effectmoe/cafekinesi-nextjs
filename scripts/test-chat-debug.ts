import { config } from 'dotenv';
config({ path: '.env.local' });

async function testChatDebug() {
  console.log('🔍 チャットAPIのデバッグテスト...\n');

  const queries = [
    'フェアリーズポット AKOの詳細を教えて',
    'HSK Kinesiologyのプロフィールを教えて'
  ];

  for (const query of queries) {
    console.log(`\n📝 質問: "${query}"`);
    console.log('='.repeat(60));

    try {
      // ローカルのAPIをテスト（デバッグ情報付き）
      const response = await fetch('http://localhost:3000/api/chat/rag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query,
          sessionId: 'debug-' + Date.now(),
          debug: true  // デバッグ情報を要求
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ HTTPエラー: ${response.status}`);
        console.error('エラー内容:', errorText);
        continue;
      }

      const data = await response.json();

      console.log('\n📤 AI回答:');
      console.log(data.response);

      if (data.debug) {
        console.log('\n🔍 デバッグ情報:');
        console.log('- 検索結果数:', data.debug.searchResultsCount);
        console.log('- 信頼度:', data.debug.confidence);

        if (data.debug.searchResults) {
          console.log('\n📊 検索結果の詳細:');
          data.debug.searchResults.forEach((result: any, index: number) => {
            console.log(`\n${index + 1}. [スコア: ${result.combined_score || result.vector_score}]`);
            console.log('   内容:', result.content.substring(0, 300));
            if (result.metadata) {
              console.log('   メタデータ:', JSON.stringify(result.metadata).substring(0, 100));
            }
          });
        }

        if (data.debug.context) {
          console.log('\n📝 AIに渡されたコンテキスト:');
          console.log(data.debug.context.substring(0, 1000));
        }
      }
    } catch (error) {
      console.error('❌ エラー:', error);
    }
  }

  console.log('\n\n🎉 デバッグテスト完了');
}

// 実行
testChatDebug();