import { config } from 'dotenv';
import { resolve } from 'path';
import { sql } from '@vercel/postgres';

// .env.localを読み込む
config({ path: resolve(process.cwd(), '.env.local') });

async function main() {
  console.log('🔍 「ハッピーオーラス」イベントの確認...\n');

  // 接続確認
  if (!process.env.POSTGRES_URL) {
    console.error('❌ POSTGRES_URL環境変数が設定されていません');
    process.exit(1);
  }

  try {
    // 1. イベント全体を確認
    const allEvents = await sql`
      SELECT id, title, type, metadata->>'status' as status
      FROM document_embeddings
      WHERE type = 'event'
      ORDER BY title;
    `;

    console.log(`📊 全イベント数: ${allEvents.rows.length}件\n`);

    if (allEvents.rows.length > 0) {
      console.log('📋 イベント一覧:');
      allEvents.rows.forEach((event: any, idx: number) => {
        console.log(`  ${idx + 1}. ${event.title} [${event.status || 'N/A'}]`);
      });
    }

    // 2. 「ハッピー」を含むイベントを確認
    const happyEvents = await sql`
      SELECT id, title, type, content, metadata->>'status' as status
      FROM document_embeddings
      WHERE type = 'event' AND (title LIKE '%ハッピー%' OR content LIKE '%ハッピー%');
    `;

    console.log(`\n🎉 「ハッピー」を含むイベント: ${happyEvents.rows.length}件`);

    if (happyEvents.rows.length > 0) {
      happyEvents.rows.forEach((event: any) => {
        console.log(`\nタイトル: ${event.title}`);
        console.log(`ステータス: ${event.status}`);
        console.log(`コンテンツ（最初の300文字）:\n${event.content.substring(0, 300)}...\n`);
      });
    } else {
      console.log('\n⚠️  「ハッピー」を含むイベントが見つかりません！');
      console.log('💡 Sanityからデータを同期する必要があります。');
    }

  } catch (error) {
    console.error('\n❌ エラー:', error);
    process.exit(1);
  }
}

main();
