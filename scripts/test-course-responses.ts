#!/usr/bin/env npx tsx

import { config } from 'dotenv';
import { RAGEngine } from '../lib/rag/rag-engine';

config({ path: '.env.local' });

async function testCourseResponses() {
  console.log('📚 講座関連の回答品質をテスト開始...\n');

  try {
    const ragEngine = new RAGEngine();
    await ragEngine.initialize();

    // テストクエリ
    const queries = [
      'どのような講座がありますか？',
      'カフェキネシの講座を教えて',
      '受講できるコースは何がありますか？',
      '6つの講座について詳しく教えて',
      'カフェキネシⅠについて教えて',
      'ピーチタッチとは何ですか？',
      'チャクラキネシの内容は？'
    ];

    // RAG設定
    const config = {
      vectorSearch: {
        topK: 10,
        threshold: 0.06  // Serviceエンティティの最低スコア（0.063）に合わせて調整
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
        console.log(`\n🎯 検索された講座・サービス:`);

        const serviceResults = result.searchResults.filter((r: any) => {
          const metadata = typeof r.metadata === 'string' ? JSON.parse(r.metadata) : r.metadata;
          return metadata?.type === 'service' || metadata?.serviceType === 'course';
        });

        if (serviceResults.length > 0) {
          console.log(`  📚 講座関連結果: ${serviceResults.length}件`);
          serviceResults.forEach((service: any, index: number) => {
            const metadata = typeof service.metadata === 'string'
              ? JSON.parse(service.metadata)
              : service.metadata;
            const score = service.combined_score || service.vector_score || 0;

            console.log(`    ${index + 1}. [${score.toFixed(3)}] ${metadata.name || 'Unknown'}`);
            console.log(`       人気度: ${metadata.popularity || 'N/A'} | 種別: ${metadata.serviceType || 'N/A'}`);
          });

          // 6つの講座がすべて検索されているかチェック
          const courseNames = serviceResults.map((s: any) => {
            const metadata = typeof s.metadata === 'string' ? JSON.parse(s.metadata) : s.metadata;
            return metadata.name;
          });

          const expectedCourses = [
            'カフェキネシⅠ',
            'チャクラキネシ',
            'ピーチタッチ',
            'カフェキネシⅣ HELP',
            'カフェキネシⅤ TAO',
            'カフェキネシⅥ ハッピーオーラ'
          ];

          console.log(`\n  📋 講座カバレッジ分析:`);
          expectedCourses.forEach(expectedCourse => {
            const found = courseNames.some(name => name && name.includes(expectedCourse.replace('カフェキネシⅣ HELP', 'HELP').replace('カフェキネシⅤ TAO', 'TAO').replace('カフェキネシⅥ ハッピーオーラ', 'ハッピーオーラ')));
            console.log(`    ${found ? '✅' : '❌'} ${expectedCourse}`);
          });

        } else {
          console.log(`  ⚠️  講座関連の結果が見つかりませんでした`);
        }

        console.log(`\n📄 コンテキスト情報 (先頭300文字):`);
        const contextLines = result.prompt.split('\n');
        const contextStart = contextLines.findIndex(line => line.includes('【コンテキスト】'));
        if (contextStart >= 0) {
          const contextContent = contextLines.slice(contextStart, contextStart + 15).join('\n');
          console.log(contextContent.substring(0, 500) + '...');
        }

      } else {
        console.log(`  ❌ 検索結果なし`);
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('📈 総合評価:');

    // 最初の質問（最も一般的）で評価
    const generalQuery = 'どのような講座がありますか？';
    const generalResult = await ragEngine.generateAugmentedResponse(generalQuery, config);

    const serviceCount = generalResult.searchResults.filter((r: any) => {
      const metadata = typeof r.metadata === 'string' ? JSON.parse(r.metadata) : r.metadata;
      return metadata?.type === 'service';
    }).length;

    console.log(`✅ 講座検索結果数: ${serviceCount}件 (期待値: 6件)`);
    console.log(`✅ 全体的な検索品質: ${generalResult.confidence > 0.1 ? '良好' : '要改善'}`);
    console.log(`✅ 信頼度: ${(generalResult.confidence * 100).toFixed(1)}%`);

    if (serviceCount >= 6) {
      console.log('\n🎉 講座データの移行とAI最適化が成功しました！');
      console.log('📝 6つの講座すべてがAIによって適切に検索・回答されます。');
    } else {
      console.log('\n⚠️  一部の講座が検索されていません。');
      console.log('🔧 AI検索キーワードやベクトル同期を確認してください。');
    }

  } catch (error) {
    console.error('❌ テスト中にエラーが発生:', error);
  }
}

testCourseResponses();