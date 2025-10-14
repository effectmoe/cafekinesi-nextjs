/**
 * テーブルスキーマを確認するスクリプト
 */

import { sql } from '@vercel/postgres';

async function main() {
  console.log('🔍 テーブルスキーマを確認中...\n');

  try {
    // document_embeddingsテーブルのカラムを確認
    const docEmbColumns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'document_embeddings'
      ORDER BY ordinal_position
    `;

    console.log('📋 document_embeddingsテーブルのカラム:');
    docEmbColumns.rows.forEach((col: any) => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });

    // embeddingsテーブルのカラムを確認
    console.log('\n📋 embeddingsテーブルのカラム:');
    const embColumns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'embeddings'
      ORDER BY ordinal_position
    `;

    embColumns.rows.forEach((col: any) => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });

    console.log('\n✅ 確認完了！');

  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error);
    if (error instanceof Error) {
      console.error('エラーメッセージ:', error.message);
    }
    process.exit(1);
  }
}

main();
