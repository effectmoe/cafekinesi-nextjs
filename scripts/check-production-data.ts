import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@sanity/client';
import pkg from 'pg';
const { Client } = pkg;

async function checkProductionData() {
  console.log('🔍 本番環境のデータをチェック...\n');

  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
  });

  try {
    // Sanityから直接インストラクター情報を取得
    console.log('=== Sanityのインストラクター情報 ===\n');
    const instructors = await client.fetch(
      `*[_type == "instructor"] | order(name) {
        _id,
        name,
        specialties,
        bio,
        region,
        profileDetails,
        website,
        email
      }`
    );

    console.log(`📊 Sanityに登録されているインストラクター数: ${instructors.length}\n`);

    instructors.forEach((instructor: any, index: number) => {
      console.log(`${index + 1}. ${instructor.name || '名前なし'}`);
      console.log(`   地域: ${instructor.region || '不明'}`);
      console.log(`   専門分野: ${instructor.specialties?.join(', ') || 'なし'}`);
      console.log(`   経歴: ${instructor.bio ? '登録済み' : '未登録'}`);
      console.log(`   詳細: ${instructor.profileDetails ? '登録済み' : '未登録'}`);
      console.log('');
    });

    // PostgreSQLに直接接続してベクターストアを確認
    console.log('\n=== ベクターストアの内容 ===\n');

    const pgClient = new Client({
      connectionString: process.env.POSTGRES_URL,
    });

    await pgClient.connect();

    // インストラクター関連のドキュメントを検索
    const searchQuery = `
      SELECT id, type, content, metadata
      FROM documents
      WHERE type = 'instructor' OR content LIKE '%インストラクター%'
      ORDER BY created_at DESC
      LIMIT 10
    `;

    const searchResults = await pgClient.query(searchQuery);

    console.log(`📊 インストラクター関連ドキュメント: ${searchResults.rows.length}件\n`);

    searchResults.rows.forEach((result: any, index: number) => {
      console.log(`${index + 1}. [タイプ: ${result.type}]`);
      console.log(`   ID: ${result.id}`);
      console.log(`   コンテンツ: ${result.content.substring(0, 200)}...`);
      console.log('');
    });

    // 特定のインストラクターで検索
    const akoQuery = `
      SELECT id, type, content, metadata
      FROM documents
      WHERE content LIKE '%フェアリーズポット%' OR content LIKE '%AKO%'
      LIMIT 5
    `;

    const akoResults = await pgClient.query(akoQuery);
    console.log(`\n📊 「フェアリーズポット AKO」関連ドキュメント: ${akoResults.rows.length}件\n`);

    if (akoResults.rows.length > 0) {
      console.log('最初の結果の全内容:');
      console.log(akoResults.rows[0].content);
    }

    await pgClient.end();

  } catch (error) {
    console.error('❌ エラー:', error);
  } finally {
    process.exit(0);
  }
}

// 実行
checkProductionData();