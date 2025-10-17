import { config } from 'dotenv';
import { resolve } from 'path';
import { publicClient } from '../lib/sanity.client';
import { groq } from 'next-sanity';

config({ path: resolve(process.cwd(), '.env.local') });

async function checkFaq() {
  console.log('🔍 Sanityから「おすすめメニュー」FAQを検索...\n');

  try {
    const faqs = await publicClient.fetch(groq`
      *[_type == "faq" && question match "*おすすめメニュー*"] {
        _id,
        question,
        answer,
        category,
        order
      }
    `);

    console.log('📋 見つかったFAQ:', faqs.length, '件\n');

    faqs.forEach((faq: any) => {
      console.log(`ID: ${faq._id}`);
      console.log(`質問: ${faq.question}`);
      console.log(`回答: ${faq.answer}`);
      console.log(`カテゴリ:`, faq.category);
      console.log('');
    });

    // 全てのFAQを確認
    const allFaqs = await publicClient.fetch(groq`
      *[_type == "faq"] | order(_createdAt desc) [0...20] {
        _id,
        question,
        answer
      }
    `);

    console.log('📚 最新20件のFAQ:\n');
    allFaqs.forEach((faq: any, idx: number) => {
      console.log(`${idx + 1}. ${faq.question}`);
      console.log(`   回答: ${faq.answer?.substring(0, 80)}...`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

checkFaq();
