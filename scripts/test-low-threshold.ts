#!/usr/bin/env npx tsx

import { config } from 'dotenv';
import { VercelVectorStore } from '../lib/vector/vercel-vector-store';

config({ path: '.env.local' });

async function testLowThreshold() {
  console.log('🔍 極低閾値での検索テスト...\n');

  try {
    const vectorStore = new VercelVectorStore();
    await vectorStore.initialize();

    const query = 'どのような講座がありますか？';
    console.log(`クエリ: "${query}"`);

    // 極端に低い閾値でテスト
    const results = await vectorStore.hybridSearch(query, {
      topK: 50,
      threshold: 0.01  // 極低閾値
    });

    console.log(`\n📊 総結果数: ${results.length}`);

    // ソース別集計
    const sourceCounts: Record<string, any[]> = {};

    results.forEach(result => {
      const source = result.source || 'unknown';
      if (!sourceCounts[source]) {
        sourceCounts[source] = [];
      }

      const metadata = typeof result.metadata === 'string' ?
        JSON.parse(result.metadata) : result.metadata;

      sourceCounts[source].push({
        name: metadata?.name || 'unknown',
        score: result.combined_score || result.vector_score || 0,
        type: metadata?.type || 'unknown'
      });
    });

    console.log(`\n📋 ソース別結果:`);
    Object.entries(sourceCounts).forEach(([source, items]) => {
      console.log(`\n📂 ${source}: ${items.length}件`);

      if (source === 'ai-first-service') {
        console.log(`🎯 Service データ発見！`);
        items.forEach((item, index) => {
          console.log(`  ${index + 1}. [${item.score.toFixed(3)}] ${item.name} (${item.type})`);
        });
      } else {
        // 上位3件のみ表示
        items.slice(0, 3).forEach((item, index) => {
          console.log(`  ${index + 1}. [${item.score.toFixed(3)}] ${item.name} (${item.type})`);
        });
        if (items.length > 3) {
          console.log(`  ... および他${items.length - 3}件`);
        }
      }
    });

    // ai-first-service のスコア分析
    if (sourceCounts['ai-first-service']) {
      const serviceScores = sourceCounts['ai-first-service']
        .map(item => item.score)
        .sort((a, b) => b - a);

      console.log(`\n📈 Service データのスコア分析:`);
      console.log(`  最高スコア: ${serviceScores[0]?.toFixed(3)}`);
      console.log(`  最低スコア: ${serviceScores[serviceScores.length - 1]?.toFixed(3)}`);
      console.log(`  平均スコア: ${(serviceScores.reduce((a, b) => a + b, 0) / serviceScores.length).toFixed(3)}`);

      console.log(`\n💡 推奨閾値: ${Math.max(0.05, serviceScores[serviceScores.length - 1] - 0.01).toFixed(3)}`);
    }

  } catch (error) {
    console.error('❌ テストエラー:', error);
  }
}

testLowThreshold();