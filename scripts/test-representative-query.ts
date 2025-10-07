#!/usr/bin/env npx tsx

import { config } from 'dotenv';
import { RAGEngine } from '../lib/rag/rag-engine';

config({ path: '.env.local' });

async function testRepresentativeQuery() {
  console.log('🤖 代表者質問テスト開始...\n');

  try {
    const ragEngine = new RAGEngine();
    await ragEngine.initialize();

    const query = '代表者はどんな人ですか？';
    console.log(`📝 テストクエリ: "${query}"`);

    const config = {
      vectorSearch: {
        topK: 5,
        threshold: 0.1
      },
      webSearch: {
        enabled: false
      },
      integration: {
        internalWeight: 0.7,
        externalWeight: 0.3
      }
    };

    const result = await ragEngine.generateAugmentedResponse(query, config);

    console.log('\n📊 結果:');
    console.log(`- 検索結果数: ${result.searchResults.length}`);
    console.log(`- 信頼度: ${(result.confidence * 100).toFixed(1)}%`);

    if (result.searchResults.length > 0) {
      console.log('\n🔍 検索結果詳細:');
      result.searchResults.forEach((r: any, index: number) => {
        const metadata = typeof r.metadata === 'string' ? JSON.parse(r.metadata) : r.metadata;
        const score = r.combined_score || r.vector_score || 0;

        console.log(`\n${index + 1}. スコア: ${score.toFixed(3)}`);
        console.log(`   データソース: ${r.source || 'Unknown'}`);
        console.log(`   タイプ: ${metadata?.type || 'Unknown'}`);
        console.log(`   名前: ${metadata?.name || 'Unknown'}`);
        console.log(`   役割: ${metadata?.primaryRole || metadata?.roles || 'Unknown'}`);

        if (metadata?.isRepresentative || metadata?.isFounder) {
          console.log(`   ⭐ 代表者/創業者データ: YES`);
        }

        console.log(`   内容: ${r.content.substring(0, 200)}...`);
      });

      // 代表者データが見つかったかチェック
      const representativeData = result.searchResults.filter((r: any) => {
        const metadata = typeof r.metadata === 'string' ? JSON.parse(r.metadata) : r.metadata;
        return metadata?.isRepresentative || metadata?.isFounder ||
               (metadata?.roles && (metadata.roles.includes('representative') || metadata.roles.includes('founder')));
      });

      console.log(`\n⭐ 代表者関連データ: ${representativeData.length}件`);

      if (representativeData.length > 0) {
        console.log('✅ 成功: 代表者情報が正しく検索されました！');

        const topRepresentative = representativeData[0];
        const metadata = typeof topRepresentative.metadata === 'string'
          ? JSON.parse(topRepresentative.metadata)
          : topRepresentative.metadata;

        console.log(`\n👤 代表者情報:`);
        console.log(`   名前: ${metadata.name}`);
        console.log(`   役割: ${metadata.primaryRole}`);
        console.log(`   所在地: ${metadata.location || '情報なし'}`);
        console.log(`   AI優先度: ${metadata.aiPriority || 'N/A'}`);
      } else {
        console.log('❌ 失敗: 代表者情報が見つかりませんでした');
      }

    } else {
      console.log('❌ 検索結果が見つかりませんでした');
    }

    console.log('\n📄 生成されたプロンプト (先頭1000文字):');
    console.log(result.prompt.substring(0, 1000) + '...');

    // 実際のAI回答を想定してサマリー
    console.log('\n🤖 予想されるAI回答の品質:');
    if (result.searchResults.some((r: any) => {
      const metadata = typeof r.metadata === 'string' ? JSON.parse(r.metadata) : r.metadata;
      return metadata?.isRepresentative || metadata?.isFounder;
    })) {
      console.log('✅ 優秀: 代表者について具体的で詳細な回答が可能です');
    } else {
      console.log('⚠️  改善必要: 代表者情報が不十分、一般的な回答になる可能性があります');
    }

  } catch (error) {
    console.error('❌ テストエラー:', error);
  }
}

testRepresentativeQuery();