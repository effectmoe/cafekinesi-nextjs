#!/usr/bin/env npx tsx

import { config } from 'dotenv';
import { sql } from '@vercel/postgres';

config({ path: '.env.local' });

async function debugVectorDB() {
  console.log('🔍 ベクトルデータベースの状況を調査中...\n');

  try {
    // 1. 全データ統計
    const stats = await sql`
      SELECT
        COUNT(*) as total_documents,
        COUNT(DISTINCT source) as sources,
        MAX(updated_at) as last_update
      FROM embeddings
    `;

    console.log('📊 データベース統計:');
    console.log(`  総ドキュメント数: ${stats.rows[0].total_documents}`);
    console.log(`  データソース数: ${stats.rows[0].sources}`);
    console.log(`  最終更新: ${stats.rows[0].last_update}`);

    // 2. ソース別統計
    const sourceStats = await sql`
      SELECT
        source,
        COUNT(*) as count,
        MAX(updated_at) as last_update
      FROM embeddings
      GROUP BY source
      ORDER BY count DESC
    `;

    console.log('\n📋 ソース別データ:');
    sourceStats.rows.forEach(row => {
      console.log(`  ${row.source}: ${row.count}件 (最終更新: ${row.last_update})`);
    });

    // 3. Service関連データを検索
    const serviceData = await sql`
      SELECT
        content,
        metadata,
        source,
        updated_at
      FROM embeddings
      WHERE
        source LIKE '%service%'
        OR metadata::text LIKE '%service%'
        OR content LIKE '%講座%'
        OR content LIKE '%コース%'
      ORDER BY updated_at DESC
      LIMIT 10
    `;

    console.log('\n🎓 Service/講座関連データ:');
    if (serviceData.rows.length > 0) {
      serviceData.rows.forEach((row, index) => {
        const metadata = typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata;
        console.log(`\n${index + 1}. ソース: ${row.source}`);
        console.log(`   メタデータタイプ: ${metadata?.type || 'Unknown'}`);
        console.log(`   名前: ${metadata?.name || 'Unknown'}`);
        console.log(`   更新日: ${row.updated_at}`);
        console.log(`   内容: ${row.content.substring(0, 150)}...`);
      });
    } else {
      console.log('  ❌ Service/講座関連データが見つかりません！');
    }

    // 4. AI-First関連データを検索
    const aiFirstData = await sql`
      SELECT
        content,
        metadata,
        source
      FROM embeddings
      WHERE source LIKE '%ai-first%'
      ORDER BY updated_at DESC
      LIMIT 5
    `;

    console.log('\n🤖 AI-First関連データ:');
    if (aiFirstData.rows.length > 0) {
      aiFirstData.rows.forEach((row, index) => {
        const metadata = typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata;
        console.log(`\n${index + 1}. ソース: ${row.source}`);
        console.log(`   タイプ: ${metadata?.type || 'Unknown'}`);
        console.log(`   名前: ${metadata?.name || 'Unknown'}`);
        console.log(`   内容: ${row.content.substring(0, 100)}...`);
      });
    } else {
      console.log('  ⚠️  AI-Firstデータが見つかりません');
    }

    // 5. 最新のembeddingsを確認
    const latestData = await sql`
      SELECT
        content,
        metadata,
        source,
        updated_at
      FROM embeddings
      ORDER BY updated_at DESC
      LIMIT 5
    `;

    console.log('\n⏰ 最新のデータ (上位5件):');
    latestData.rows.forEach((row, index) => {
      const metadata = typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata;
      console.log(`\n${index + 1}. ${row.updated_at}`);
      console.log(`   ソース: ${row.source}`);
      console.log(`   タイプ: ${metadata?.type || 'Unknown'}`);
      console.log(`   名前: ${metadata?.name || 'Unknown'}`);
    });

    // 6. 検索キーワードテスト
    console.log('\n🔎 キーワード検索テスト:');

    const keywords = ['講座', 'コース', 'カフェキネシ', 'service', 'course'];
    for (const keyword of keywords) {
      const keywordResults = await sql`
        SELECT COUNT(*) as count
        FROM embeddings
        WHERE
          content ILIKE ${`%${keyword}%`}
          OR metadata::text ILIKE ${`%${keyword}%`}
      `;
      console.log(`  "${keyword}": ${keywordResults.rows[0].count}件`);
    }

  } catch (error) {
    console.error('❌ デバッグエラー:', error);
  }
}

debugVectorDB();