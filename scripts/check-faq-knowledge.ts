import { config } from 'dotenv';
import { resolve } from 'path';
import { publicClient } from '@/lib/sanity.client';
import { groq } from 'next-sanity';

config({ path: resolve(process.cwd(), '.env.local') });

async function main() {
  console.log('🔍 FAQとKnowledge Baseを確認...\n');

  try {
    // 1. FAQを取得（アクセス関連）
    const faqs = await publicClient.fetch(groq`
      *[_type == "faq" && (question match "*アクセス*" || question match "*場所*" || question match "*住所*" || question match "*駅*" || question match "*行き方*")] {
        question,
        answer
      }
    `);

    console.log('📋 アクセス関連FAQ:', faqs.length, '件');
    faqs.forEach((faq: any, idx: number) => {
      console.log(`\n${idx + 1}. ${faq.question}`);
      console.log(`   回答: ${faq.answer}`);
    });

    // 2. すべてのFAQを取得
    const allFaqs = await publicClient.fetch(groq`
      *[_type == "faq"] | order(_createdAt desc) [0...10] {
        question,
        answer
      }
    `);

    console.log('\n\n📋 最新のFAQ (10件):');
    allFaqs.forEach((faq: any, idx: number) => {
      console.log(`\n${idx + 1}. ${faq.question}`);
      console.log(`   回答: ${faq.answer?.substring(0, 100)}...`);
    });

    // 3. Knowledge Baseを取得
    const knowledgeBase = await publicClient.fetch(groq`
      *[_type == "knowledgeBase"] [0...5] {
        title,
        content
      }
    `);

    console.log('\n\n📚 Knowledge Base:', knowledgeBase.length, '件');
    knowledgeBase.forEach((kb: any, idx: number) => {
      console.log(`\n${idx + 1}. ${kb.title}`);
      console.log(`   内容: ${kb.content?.substring(0, 200)}...`);
    });

  } catch (error) {
    console.error('\n❌ エラー:', error);
    process.exit(1);
  }
}

main();
