import { config } from 'dotenv';
import { resolve } from 'path';
import { publicClient } from '@/lib/sanity.client';
import { groq } from 'next-sanity';

config({ path: resolve(process.cwd(), '.env.local') });

async function main() {
  console.log('🔍 Sanityからアクセス情報を確認...\n');

  try {
    // 1. aboutページを取得
    const aboutPage = await publicClient.fetch(groq`
      *[_type == "aboutPage"][0] {
        title,
        heroSection,
        sections
      }
    `);

    console.log('📄 aboutPage:');
    console.log(JSON.stringify(aboutPage, null, 2));

    // 2. companyInfoを取得
    const companyInfo = await publicClient.fetch(groq`
      *[_type == "companyInfo"][0] {
        name,
        address,
        phone,
        email,
        description,
        location,
        access
      }
    `);

    console.log('\n🏢 companyInfo:');
    console.log(JSON.stringify(companyInfo, null, 2));

    // 3. contactページを取得
    const contactPage = await publicClient.fetch(groq`
      *[_type == "contactPage"][0] {
        title,
        description,
        contactInfo
      }
    `);

    console.log('\n📧 contactPage:');
    console.log(JSON.stringify(contactPage, null, 2));

    // 4. すべてのドキュメントタイプを確認
    const allTypes = await publicClient.fetch(groq`
      array::unique(*[]._type)
    `);

    console.log('\n📋 利用可能なドキュメントタイプ:');
    console.log(allTypes);

  } catch (error) {
    console.error('\n❌ エラー:', error);
    process.exit(1);
  }
}

main();
