#!/usr/bin/env npx tsx

import { config } from 'dotenv';
import { VercelVectorStore } from '../lib/vector/vercel-vector-store';

config({ path: '.env.local' });

async function debugSearchResults() {
  console.log('🔍 検索結果を詳細調査中...\n');

  try {
    const vectorStore = new VercelVectorStore();
    await vectorStore.initialize();

    const queries = [
      'どのような講座がありますか？',
      'カフェキネシの講座を教えて',
      '6つの講座について詳しく教えて'
    ];

    for (const query of queries) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`🔍 クエリ: "${query}"`);
      console.log('='.repeat(60));

      // 異なる設定でハイブリッド検索をテスト
      const configs = [
        { name: '厳しい設定', topK: 10, threshold: 0.15 },
        { name: '標準設定', topK: 10, threshold: 0.1 },
        { name: '緩い設定', topK: 20, threshold: 0.05 }
      ];

      for (const config of configs) {
        console.log(`\n📊 ${config.name} (topK: ${config.topK}, threshold: ${config.threshold}):`);

        const results = await vectorStore.hybridSearch(query, {
          topK: config.topK,
          threshold: config.threshold
        });

        console.log(`  総結果数: ${results.length}`);

        // ソース別集計
        const sourceCounts: Record<string, number> = {};
        const sourceDetails: Record<string, any[]> = {};

        results.forEach((result, index) => {
          // 結果オブジェクトの構造を詳しく調べる
          if (index === 0) {
            console.log(`    🔍 結果オブジェクトの構造:`)
            console.log(`       Keys: ${Object.keys(result).join(', ')}`);
            console.log(`       source プロパティ: ${result.source}`);
            console.log(`       metadata: ${JSON.stringify(result.metadata)}`);

            if (typeof result.metadata === 'string') {
              try {
                const parsedMetadata = JSON.parse(result.metadata);
                console.log(`       metadata.source: ${parsedMetadata?.source}`);
              } catch (e) {
                console.log(`       metadata解析エラー`);
              }
            }
          }

          // ソースを複数の方法で取得を試行
          const source = result.source || result.metadata?.source ||
            (typeof result.metadata === 'string' ?
              (() => {
                try {
                  return JSON.parse(result.metadata)?.source;
                } catch { return null; }
              })() : null
            ) || 'unknown';

          sourceCounts[source] = (sourceCounts[source] || 0) + 1;

          if (!sourceDetails[source]) {
            sourceDetails[source] = [];
          }

          const metadata = typeof result.metadata === 'string' ?
            (() => {
              try { return JSON.parse(result.metadata); } catch { return {}; }
            })() : (result.metadata || {});

          sourceDetails[source].push({
            name: metadata?.name || 'unknown',
            score: result.combined_score || result.vector_score || 0,
            content: result.content.substring(0, 50) + '...'
          });
        });

        console.log(`  ソース別結果:`)
        Object.entries(sourceCounts).forEach(([source, count]) => {
          console.log(`    📂 ${source}: ${count}件`);

          if (source === 'ai-first-service') {
            console.log(`      🎯 講座データが見つかりました！`);
            sourceDetails[source].forEach((detail, index) => {
              console.log(`        ${index + 1}. ${detail.name} (スコア: ${detail.score.toFixed(3)})`);
            });
          }
        });

        // ai-first-service が含まれているかチェック
        const hasServiceData = results.some(r => {
          const metadata = typeof r.metadata === 'string' ? JSON.parse(r.metadata) : r.metadata;
          return metadata?.type === 'service' || r.metadata?.source === 'ai-first-service';
        });

        if (!hasServiceData) {
          console.log(`    ❌ ai-first-service データが含まれていません`);

          // 上位3件の詳細を表示
          console.log(`    📋 上位3件の詳細:`);
          results.slice(0, 3).forEach((result, index) => {
            console.log(`      ${index + 1}. スコア: ${(result.combined_score || result.vector_score || 0).toFixed(3)}`);
            console.log(`         ソース: ${result.metadata?.source || 'unknown'}`);
            console.log(`         内容: ${result.content.substring(0, 100)}...`);
          });
        } else {
          console.log(`    ✅ ai-first-service データが含まれています！`);
        }
      }
    }

    // 直接 ai-first-service を検索
    console.log(`\n\n${'='.repeat(60)}`);
    console.log(`🎯 ai-first-service 直接検索テスト`);
    console.log('='.repeat(60));

    const directQuery = 'course cafekinesi service 講座';
    console.log(`クエリ: "${directQuery}"`);

    const directResults = await vectorStore.hybridSearch(directQuery, {
      topK: 10,
      threshold: 0.05
    });

    console.log(`結果数: ${directResults.length}`);
    directResults.forEach((result, index) => {
      const metadata = typeof result.metadata === 'string' ? JSON.parse(result.metadata) : result.metadata;
      const source = metadata?.source || 'unknown';
      const score = result.combined_score || result.vector_score || 0;

      console.log(`${index + 1}. [${score.toFixed(3)}] ${source}: ${metadata?.name || 'unknown'}`);

      if (source === 'ai-first-service') {
        console.log(`    🎯 講座データ: ${metadata.name} (type: ${metadata.type})`);
      }
    });

  } catch (error) {
    console.error('❌ 調査エラー:', error);
  }
}

debugSearchResults();