import { publicClient } from '@/lib/sanity.client';
import { groq } from 'next-sanity';

async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('現在のイベントデータ:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const events = await publicClient.fetch(groq`
    *[_type == "event" && useForAI == true] | order(startDate asc) {
      title,
      location,
      fee,
      status,
      startDate
    }
  `);

  events.forEach((event: any, idx: number) => {
    console.log(`\n${idx + 1}. ${event.title}`);
    console.log(`   場所: ${event.location}`);
    console.log(`   価格: ¥${event.fee?.toLocaleString() || '無料'}`);
    console.log(`   ステータス: ${event.status}`);
    console.log(`   日時: ${event.startDate}`);
  });

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('条件確認:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const tokyoEventsUnder5000 = events.filter((e: any) =>
    e.location && e.location.includes('東京') &&
    e.fee <= 5000 &&
    e.status === 'open'
  );

  console.log('\n【東京 AND 5000円以下 AND 受付中】のイベント:');
  if (tokyoEventsUnder5000.length === 0) {
    console.log('→ 該当なし ❌');
    console.log('   理由: 東京開催のイベントは「チャクラキネシ実践」(¥8,000) のみで、5000円を超えている');
  } else {
    tokyoEventsUnder5000.forEach((e: any) => {
      console.log(`  - ${e.title} (¥${e.fee}, ${e.location})`);
    });
  }

  const onlineEvents = events.filter((e: any) =>
    e.location && e.location.includes('オンライン') &&
    e.status === 'open'
  );

  console.log('\n【オンライン AND 受付中】のイベント:');
  if (onlineEvents.length === 0) {
    console.log('→ 該当なし');
  } else {
    onlineEvents.forEach((e: any) => {
      console.log(`  - ${e.title} (¥${e.fee})`);
    });
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('結論:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\nQ: 東京で受付中のイベントで、5000円以下のものはありますか？');
  console.log('A: いいえ、ありません。');
  console.log('   - 東京開催: チャクラキネシ実践 (¥8,000) のみ → 5000円超過');
  console.log('   - 5000円以下: ピーチタッチ (¥5,000)、ハッピーオーラス (¥3,000) → オンライン開催');
  console.log('\n   正しい回答例:');
  console.log('   「申し訳ございませんが、東京で開催される5000円以下の受付中イベントは現在ございません。');
  console.log('    オンラインでよろしければ、ピーチタッチ基礎講座（¥5,000）やハッピーオーラス入門（¥3,000、満席）がございます。」');
}

main();
