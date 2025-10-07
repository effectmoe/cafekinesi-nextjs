#!/usr/bin/env npx tsx

import { config } from 'dotenv';
import { sql } from '@vercel/postgres';

config({ path: '.env.local' });

async function checkMetadataStructure() {
  console.log('🔍 メタデータ構造を詳細調査中...\n');

  try {
    // 1. ai-first-service のメタデータを詳しく確認
    const serviceData = await sql`
      SELECT
        id,
        content,
        metadata,
        source,
        updated_at
      FROM embeddings
      WHERE source = 'ai-first-service'
      ORDER BY updated_at DESC
    `;

    console.log('📊 ai-first-service データの詳細:');
    serviceData.rows.forEach((row, index) => {
      console.log(`\n${index + 1}. ID: ${row.id}`);
      console.log(`   Source: ${row.source}`);
      console.log(`   Content: ${row.content.substring(0, 100)}...`);

      // メタデータの詳細解析
      let metadata;
      try {
        metadata = typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata;
        console.log(`   Metadata (type: ${typeof row.metadata}):`);
        console.log(`     - Raw: ${JSON.stringify(row.metadata)}`);
        console.log(`     - Parsed: ${JSON.stringify(metadata, null, 6)}`);
        console.log(`     - Type: ${metadata?.type}`);
        console.log(`     - ServiceType: ${metadata?.serviceType}`);
        console.log(`     - Name: ${metadata?.name}`);
        console.log(`     - Category: ${metadata?.category}`);
      } catch (error) {
        console.log(`   ❌ メタデータ解析エラー: ${error}`);
        console.log(`   Raw metadata: ${row.metadata}`);
      }
    });

    // 2. 異なるメタデータタイプの検索テスト
    console.log('\n\n🔎 メタデータフィルター検索テスト:');

    const filterTests = [
      { name: 'type = service', condition: "metadata::jsonb ->> 'type' = 'service'" },
      { name: 'serviceType = course', condition: "metadata::jsonb ->> 'serviceType' = 'course'" },
      { name: 'metadata contains service', condition: "metadata::text LIKE '%service%'" },
      { name: 'metadata contains course', condition: "metadata::text LIKE '%course%'" },
      { name: 'source = ai-first-service', condition: "source = 'ai-first-service'" }
    ];

    for (const test of filterTests) {
      try {
        const results = await sql.unsafe(`
          SELECT COUNT(*) as count, array_agg(metadata::jsonb ->> 'name') as names
          FROM embeddings
          WHERE ${test.condition}
        `);

        console.log(`\n✅ ${test.name}: ${results.rows[0].count}件`);
        if (results.rows[0].count > 0) {
          console.log(`   講座名: ${results.rows[0].names.filter(Boolean).join(', ')}`);
        }
      } catch (error) {
        console.log(`❌ ${test.name}: エラー - ${error}`);
      }
    }

    // 3. 既存のテストスクリプトのフィルター条件をシミュレート
    console.log('\n\n🧪 テストスクリプトフィルター シミュレーション:');

    const allResults = await sql`
      SELECT content, metadata, source
      FROM embeddings
      WHERE source = 'ai-first-service'
      LIMIT 10
    `;

    console.log(`📋 ${allResults.rows.length}件の結果を取得`);

    const serviceResults = allResults.rows.filter((r: any) => {
      const metadata = typeof r.metadata === 'string' ? JSON.parse(r.metadata) : r.metadata;
      return metadata?.type === 'service' || metadata?.serviceType === 'course';
    });

    console.log(`🎯 フィルター後: ${serviceResults.length}件の講座関連結果`);

    if (serviceResults.length > 0) {
      console.log('✅ フィルター成功！講座データが正しく検出されました:');
      serviceResults.forEach((service: any, index: number) => {
        const metadata = typeof service.metadata === 'string' ? JSON.parse(service.metadata) : service.metadata;
        console.log(`  ${index + 1}. ${metadata.name} (type: ${metadata.type}, serviceType: ${metadata.serviceType})`);
      });
    } else {
      console.log('❌ フィルター失敗！講座データが検出されませんでした');
      console.log('🔧 実際のメタデータ構造:');
      allResults.rows.forEach((r: any, index: number) => {
        const metadata = typeof r.metadata === 'string' ? JSON.parse(r.metadata) : r.metadata;
        console.log(`  ${index + 1}. ${metadata.name}: type="${metadata.type}", serviceType="${metadata.serviceType}"`);
      });
    }

  } catch (error) {
    console.error('❌ 調査エラー:', error);
  }
}

checkMetadataStructure();