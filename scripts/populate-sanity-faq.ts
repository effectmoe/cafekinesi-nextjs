import { createClient } from '@sanity/client';
import { config } from 'dotenv';

// .env.localファイルを読み込み
config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
  apiVersion: '2024-01-06'
});

// FAQカードのデータ（フロントエンドから）
const faqCards = [
  {
    _type: 'faqCard',
    title: '営業時間を教えて',
    icon: 'Clock',
    bgColor: 'bg-[hsl(35,22%,91%)]',
    iconColor: 'text-[hsl(35,45%,45%)]',
    order: 0,
    isActive: true
  },
  {
    _type: 'faqCard',
    title: 'アクセス方法は？',
    icon: 'Navigation',
    bgColor: 'bg-[hsl(210,20%,88%)]',
    iconColor: 'text-[hsl(35,45%,45%)]',
    order: 1,
    isActive: true
  },
  {
    _type: 'faqCard',
    title: 'おすすめメニュー',
    icon: 'Coffee',
    bgColor: 'bg-[hsl(260,15%,88%)]',
    iconColor: 'text-[hsl(35,45%,45%)]',
    order: 2,
    isActive: true
  },
  {
    _type: 'faqCard',
    title: '予約について',
    icon: 'CalendarCheck',
    bgColor: 'bg-[hsl(0,0%,91%)]',
    iconColor: 'text-[hsl(35,45%,45%)]',
    order: 3,
    isActive: true
  }
];

// FAQデータ（質問と回答）
const faqs = [
  {
    _type: 'faq',
    question: '営業時間を教えてください',
    answer: 'カフェの営業時間は、平日は午前10時から午後8時まで、土日祝日は午前9時から午後9時までです。定休日は毎週火曜日となっております。',
    category: '営業情報'
  },
  {
    _type: 'faq',
    question: 'アクセス方法は？',
    answer: '最寄り駅から徒歩5分です。JR線をご利用の場合は北口から出て、商店街を通り抜けた先にございます。お車の場合は、近隣のコインパーキングをご利用ください。',
    category: 'アクセス'
  },
  {
    _type: 'faq',
    question: 'おすすめメニューを教えてください',
    answer: '当店のおすすめは自家製のチーズケーキとオリジナルブレンドコーヒーです。季節限定のメニューもございますので、ぜひお試しください。',
    category: 'メニュー'
  },
  {
    _type: 'faq',
    question: '予約はできますか？',
    answer: 'はい、お電話またはウェブサイトからご予約を承っております。団体様のご予約も可能です。詳細はお問い合わせください。',
    category: '予約'
  },
  {
    _type: 'faq',
    question: 'Wi-Fiは利用できますか？',
    answer: '無料Wi-Fiをご用意しております。パスワードは店内に掲示しておりますので、スタッフにお尋ねください。',
    category: '設備'
  },
  {
    _type: 'faq',
    question: 'ペットは入店できますか？',
    answer: 'テラス席のみペット同伴可能です。店内への入店はご遠慮いただいております。',
    category: '利用規約'
  }
];

// チャットモーダル設定
const chatModal = {
  _type: 'chatModal',
  title: 'Cafe Kinesi へようこそ',
  subtitle: '何かお探しですか？AIアシスタントがお答えします',
  welcomeMessage: 'こんにちは！Cafe Kinesiへようこそ。何かお手伝いできることはありますか？',
  placeholder: 'メッセージを入力...',
  quickSuggestions: [
    '営業時間を教えて',
    'アクセス方法は？',
    'おすすめメニューは？',
    '予約はできる？'
  ],
  headerTitle: 'Cafe Kinesi AIアシスタント',
  headerSubtitle: '何でもお気軽にお尋ねください',
  isActive: true
};

async function populateSanityData() {
  console.log('🚀 Sanityデータ投入開始...\n');

  try {
    // 1. FAQカードを作成
    console.log('📄 FAQカードを作成中...');
    for (const card of faqCards) {
      try {
        const result = await client.create(card);
        console.log(`✅ FAQカード作成: ${card.title}`);
      } catch (error: any) {
        if (error.statusCode === 409) {
          console.log(`⚠️ FAQカード既存: ${card.title}`);
        } else {
          console.error(`❌ FAQカード作成エラー: ${card.title}`, error.message);
        }
      }
    }

    // 2. FAQを作成
    console.log('\n📄 FAQを作成中...');
    for (const faq of faqs) {
      try {
        const result = await client.create(faq);
        console.log(`✅ FAQ作成: ${faq.question}`);
      } catch (error: any) {
        if (error.statusCode === 409) {
          console.log(`⚠️ FAQ既存: ${faq.question}`);
        } else {
          console.error(`❌ FAQ作成エラー: ${faq.question}`, error.message);
        }
      }
    }

    // 3. チャットモーダル設定を作成
    console.log('\n📄 チャットモーダル設定を作成中...');
    try {
      const result = await client.create(chatModal);
      console.log(`✅ チャットモーダル設定作成完了`);
    } catch (error: any) {
      if (error.statusCode === 409) {
        // 既存の場合は更新
        const existing = await client.fetch(`*[_type == "chatModal"][0]`);
        if (existing) {
          await client.patch(existing._id)
            .set(chatModal)
            .commit();
          console.log(`✅ チャットモーダル設定更新完了`);
        }
      } else {
        console.error(`❌ チャットモーダル設定作成エラー:`, error.message);
      }
    }

    console.log('\n✅ データ投入完了！');

    // 4. 投入結果を確認
    console.log('\n📊 投入結果確認:');
    const faqCardCount = await client.fetch(`count(*[_type == "faqCard"])`);
    const faqCount = await client.fetch(`count(*[_type == "faq"])`);
    const chatModalCount = await client.fetch(`count(*[_type == "chatModal"])`);

    console.log(`- FAQカード: ${faqCardCount}件`);
    console.log(`- FAQ: ${faqCount}件`);
    console.log(`- チャットモーダル: ${chatModalCount}件`);

  } catch (error) {
    console.error('❌ エラーが発生:', error);
    process.exit(1);
  }
}

// 実行
populateSanityData();