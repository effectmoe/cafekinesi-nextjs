#!/usr/bin/env npx tsx

import { config } from 'dotenv';
import { VercelVectorStore } from '../lib/vector/vercel-vector-store';
import { sql } from '@vercel/postgres';

config({ path: '.env.local' });

async function testDirectKeywords() {
  console.log('🔍 直接キーワードでの検索テスト...\n');

  try {
    // 1. まず、データベースの状況を再確認
    console.log('📊 データベース状況確認:');
    const dbCheck = await sql`
      SELECT source, COUNT(*) as count
      FROM embeddings
      GROUP BY source
      ORDER BY count DESC
    `;

    dbCheck.rows.forEach(row => {
      console.log(`  ${row.source}: ${row.count}件`);
    });

    // 2. ai-first-serviceの実際のコンテンツを確認
    console.log('\n📄 ai-first-service コンテンツ確認:');
    const serviceContent = await sql`
      SELECT content, metadata
      FROM embeddings
      WHERE source = 'ai-first-service'
      LIMIT 3
    `;

    serviceContent.rows.forEach((row, index) => {
      const metadata = typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata;
      console.log(`\n${index + 1}. ${metadata.name}:`);
      console.log(`   Content: ${row.content.substring(0, 200)}...`);
    });

    // 3. ベクトルストアで異なるクエリをテスト
    const vectorStore = new VercelVectorStore();
    await vectorStore.initialize();

    const testQueries = [
      'service',
      'course',
      'cafekinesi',
      'カフェキネシ',
      '講座',
      'コース',
      'kinesi',
      'チャクラ',
      'ピーチタッチ',
      'どのような講座',
      'どんな講座',
      'どのような講座がありますか',
      'カフェキネシオロジー',
      'カフェキネシオロジーの講座'
    ];

    for (const query of testQueries) {
      console.log(`\n🔍 クエリ: "${query}"`);

      // 最低閾値（0.0）で検索
      const results = await vectorStore.hybridSearch(query, {
        topK: 10,
        threshold: 0.0  // 最低閾値
      });

      const serviceResults = results.filter(r => r.source === 'ai-first-service');
      console.log(`  全結果: ${results.length}件, Service結果: ${serviceResults.length}件`);

      if (serviceResults.length > 0) {
        console.log('  🎯 Service検索成功！');
        serviceResults.forEach((result, index) => {
          const metadata = typeof result.metadata === 'string' ?
            JSON.parse(result.metadata) : result.metadata;
          const score = result.combined_score || result.vector_score || 0;
          console.log(`    ${index + 1}. [${score.toFixed(3)}] ${metadata.name}`);
        });

        // 成功した場合は、詳細を表示して終了
        break;
      }
    }

    // 4. 全データの上位10件を表示（閾値なし）
    console.log('\n📋 全データの上位10件（閾値なし）:');
    const allResults = await vectorStore.hybridSearch('講座', {
      topK: 10,
      threshold: 0.0
    });

    allResults.forEach((result, index) => {
      const metadata = typeof result.metadata === 'string' ?
        JSON.parse(result.metadata) : result.metadata;
      const score = result.combined_score || result.vector_score || 0;
      console.log(`${index + 1}. [${score.toFixed(3)}] ${result.source}: ${metadata.name || 'unknown'}`);
    });

  } catch (error) {
    console.error('❌ テストエラー:', error);
  }
}

testDirectKeywords();