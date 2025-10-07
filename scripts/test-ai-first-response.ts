#!/usr/bin/env npx tsx

import { config } from 'dotenv';
import { RAGEngine } from '../lib/rag/rag-engine';

// .env.localファイルを明示的に読み込み
config({ path: '.env.local' });

async function testAIFirstResponse() {
  console.log('🤖 AI-First構造のテスト開始...\n');

  try {
    const ragEngine = new RAGEngine();
    await ragEngine.initialize();

    // テストクエリ（問題だった質問）
    const queries = [
      '代表者はどんな人ですか？',
      '創業者について教えて',
      'カフェキネシは誰が作ったの？',
      '星ユカリさんについて',
      'どんなインストラクターがいますか？',
      'カフェキネシについて教えて',
      '会社について教えて'
    ];

    // RAG設定
    const config = {
      vectorSearch: {
        topK: 10,
        threshold: 0.1  // 低めの閾値で幅広く取得
      },
      webSearch: {
        enabled: false
      },
      integration: {
        internalWeight: 0.7,
        externalWeight: 0.3
      }
    };

    console.log('⚙️ テスト設定:', JSON.stringify(config, null, 2));
    console.log('\n' + '='.repeat(80));

    for (const query of queries) {
      console.log(`\n🔍 テスト: "${query}"`);
      console.log('-'.repeat(50));

      const result = await ragEngine.generateAugmentedResponse(query, config);

      console.log(`📊 結果統計:`);
      console.log(`  - 検索結果数: ${result.searchResults.length}`);
      console.log(`  - 信頼度: ${(result.confidence * 100).toFixed(1)}%`);
      console.log(`  - 情報源数: ${result.sources.length}`);

      if (result.searchResults.length > 0) {
        console.log(`\n🎯 上位検索結果:`);
        result.searchResults.slice(0, 3).forEach((r: any, index: number) => {
          const score = r.combined_score || r.vector_score || 0;
          const metadata = typeof r.metadata === 'string' ? JSON.parse(r.metadata) : r.metadata;
          console.log(`  ${index + 1}. [${score.toFixed(3)}] ${metadata?.type || 'Unknown'}: ${metadata?.name || 'Unknown'}`);
          console.log(`     优先度: ${metadata?.aiPriority || 'N/A'} | 役割: ${metadata?.primaryRole || metadata?.roles?.[0] || 'N/A'}`);
          console.log(`     内容: ${r.content.substring(0, 120)}...`);
        });

        // 代表者や創業者に関する質問の場合、特別にチェック
        if (query.includes('代表者') || query.includes('創業者') || query.includes('誰が作った')) {
          const representativeResults = result.searchResults.filter((r: any) => {
            const metadata = typeof r.metadata === 'string' ? JSON.parse(r.metadata) : r.metadata;
            return metadata?.isRepresentative || metadata?.isFounder ||
                   metadata?.roles?.includes('representative') || metadata?.roles?.includes('founder');
          });

          console.log(`\n⭐ 代表者/創業者関連結果: ${representativeResults.length}件`);
          if (representativeResults.length > 0) {
            const topRepresentative = representativeResults[0];
            const metadata = typeof topRepresentative.metadata === 'string'
              ? JSON.parse(topRepresentative.metadata)
              : topRepresentative.metadata;
            console.log(`    最高スコア: ${metadata.name} (${(topRepresentative.combined_score || topRepresentative.vector_score).toFixed(3)})`);
          }
        }

        // インストラクターに関する質問の場合、特別にチェック
        if (query.includes('インストラクター')) {
          const instructorResults = result.searchResults.filter((r: any) => {
            const metadata = typeof r.metadata === 'string' ? JSON.parse(r.metadata) : r.metadata;
            return metadata?.isInstructor || metadata?.roles?.includes('instructor');
          });

          console.log(`\n👩‍🏫 インストラクター関連結果: ${instructorResults.length}件`);
          if (instructorResults.length > 0) {
            instructorResults.slice(0, 3).forEach((instructor: any, index: number) => {
              const metadata = typeof instructor.metadata === 'string'
                ? JSON.parse(instructor.metadata)
                : instructor.metadata;
              console.log(`    ${index + 1}. ${metadata.name} (${metadata.location || '場所不明'})`);
            });
          }
        }

      } else {
        console.log(`⚠️  検索結果なし - AI最適化が必要な可能性があります`);
      }

      console.log(`\n📄 生成されたプロンプト (先頭500文字):`);
      console.log(result.prompt.substring(0, 500) + '...');
    }

    console.log('\n' + '='.repeat(80));
    console.log('📈 総合評価:');

    // 代表者質問のテスト結果
    const representativeQuery = '代表者はどんな人ですか？';
    const representativeResult = await ragEngine.generateAugmentedResponse(representativeQuery, config);
    const hasRepresentativeData = representativeResult.searchResults.some((r: any) => {
      const metadata = typeof r.metadata === 'string' ? JSON.parse(r.metadata) : r.metadata;
      return metadata?.isRepresentative || metadata?.isFounder;
    });

    console.log(`✅ 代表者質問対応: ${hasRepresentativeData ? '成功' : '要改善'}`);
    console.log(`✅ 全体的な検索品質: ${representativeResult.confidence > 0.3 ? '良好' : '要改善'}`);

    if (hasRepresentativeData) {
      console.log('\n🎉 AI-First構造の実装が成功しました！');
      console.log('📝 次回は実際のチャットボットでユーザーテストを実施してください。');
    } else {
      console.log('\n⚠️  まだ改善が必要です。AI検索キーワードやコンテンツを調整してください。');
    }

  } catch (error) {
    console.error('❌ テスト中にエラーが発生:', error);
  }
}

// 実行
testAIFirstResponse();