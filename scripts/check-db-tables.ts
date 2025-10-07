import { config } from 'dotenv';
config({ path: '.env.local' });

import pkg from 'pg';
const { Client } = pkg;

async function checkDatabaseTables() {
  console.log('🔍 データベーステーブルを確認...\n');

  const pgClient = new Client({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    await pgClient.connect();

    // テーブル一覧を取得
    const tablesQuery = `
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename
    `;

    const tables = await pgClient.query(tablesQuery);
    console.log('📊 公開スキーマのテーブル一覧:\n');

    tables.rows.forEach((row: any) => {
      console.log(`- ${row.tablename}`);
    });

    // documentsに似た名前のテーブルを探す
    const documentsTable = tables.rows.find((row: any) =>
      row.tablename.includes('document') ||
      row.tablename.includes('rag') ||
      row.tablename.includes('vector')
    );

    if (documentsTable) {
      console.log(`\n✅ ベクターストア関連テーブル発見: ${documentsTable.tablename}`);

      // テーブルの構造を確認
      const columnsQuery = `
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position
      `;

      const columns = await pgClient.query(columnsQuery, [documentsTable.tablename]);
      console.log('\nテーブル構造:');

      columns.rows.forEach((col: any) => {
        console.log(`  - ${col.column_name}: ${col.data_type}`);
      });

      // サンプルデータを取得
      const sampleQuery = `
        SELECT * FROM ${documentsTable.tablename}
        LIMIT 3
      `;

      const sample = await pgClient.query(sampleQuery);
      console.log(`\n📝 サンプルデータ (${sample.rows.length}件):`);

      sample.rows.forEach((row: any, index: number) => {
        console.log(`\n${index + 1}. ${JSON.stringify(row, null, 2).substring(0, 500)}...`);
      });
    } else {
      console.log('\n⚠️ ベクターストア関連のテーブルが見つかりません');
    }

  } catch (error) {
    console.error('❌ エラー:', error);
  } finally {
    await pgClient.end();
    process.exit(0);
  }
}

// 実行
checkDatabaseTables();