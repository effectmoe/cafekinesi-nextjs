import { config } from 'dotenv';
import { resolve } from 'path';
import { sql } from '@vercel/postgres';

config({ path: resolve(process.cwd(), '.env.local') });

async function main() {
  console.log('🔍 データベース接続確認...\n');

  try {
    // 1. ハッピーオーラス入門を検索
    const happyEvents = await sql`
      SELECT id, type, title, content, metadata->>'status' as status
      FROM document_embeddings
      WHERE title LIKE '%ハッピー%'
      ORDER BY updated_at DESC
      LIMIT 3;
    `;

    console.log(`📊 「ハッピー」を含むイベント: ${happyEvents.rows.length}件\n`);

    if (happyEvents.rows.length > 0) {
      happyEvents.rows.forEach((event: any) => {
        console.log(`タイトル: ${event.title}`);
        console.log(`タイプ: ${event.type}`);
        console.log(`ステータス: ${event.status}`);
        console.log(`コンテンツ（最初の200文字）:\n${event.content.substring(0, 200)}...\n`);
      });
    } else {
      console.log('⚠️ データが見つかりません！');
    }

    // 2. 全イベント数を確認
    const allEvents = await sql`
      SELECT COUNT(*) as count
      FROM document_embeddings
      WHERE type = 'event';
    `;

    console.log(`\n📊 全イベント数: ${allEvents.rows[0].count}件`);

  } catch (error) {
    console.error('\n❌ エラー:', error);
    process.exit(1);
  }
}

main();
