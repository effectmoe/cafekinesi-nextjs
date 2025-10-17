import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@sanity/client';

config({ path: resolve(process.cwd(), '.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
});

async function createTestFaq() {
  console.log('🧪 テスト用FAQを作成中...\n');

  try {
    const testFaq = await client.create({
      _type: 'faq',
      _id: 'test-delete-sync-faq',
      question: '【テスト】自動削除同期のテスト',
      answer: 'このFAQは削除同期のテスト用です。Sanityから削除すると、PostgreSQLからも自動的に削除されるはずです。',
      category: 'テスト',
      isActive: true
    });

    console.log('✅ テスト用FAQを作成しました:');
    console.log(`   ID: ${testFaq._id}`);
    console.log(`   質問: ${testFaq.question}`);
    console.log(`   回答: ${testFaq.answer}`);
    console.log('');
    console.log('📝 次のステップ:');
    console.log('   1. 数秒待ってから verify-test-faq.ts を実行し、PostgreSQLに同期されたか確認');
    console.log('   2. Sanity StudioでこのFAQを削除');
    console.log('   3. 再度 verify-test-faq.ts を実行し、PostgreSQLからも削除されたか確認');

  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

createTestFaq();
