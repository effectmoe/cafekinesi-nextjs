import { config } from 'dotenv';
import { resolve } from 'path';
import { groq } from 'next-sanity';
import { publicClient } from '../lib/sanity.client';

config({ path: resolve(process.cwd(), '.env.local') });

async function checkAllFields() {
  console.log('🔍 dental記事の全フィールドを確認中...\n');

  try {
    const post = await publicClient.fetch(groq`
      *[_type == "blogPost" && slug.current == "dental"][0] {
        _id,
        _type,
        _createdAt,
        _updatedAt,
        title,
        slug,
        excerpt,
        tldr,
        mainImage,
        gallery,
        additionalImages,
        content,
        keyPoint,
        summary,
        faq,
        category,
        tags,
        publishedAt,
        featured,
        contentOrder,
        relatedArticles,
        author,
        internalLinks,
        externalReferences
      }
    `);

    if (!post) {
      console.log('❌ 記事が見つかりません');
      return;
    }

    console.log('✅ 記事が見つかりました\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('全フィールドの型チェック:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');

    Object.keys(post).forEach(key => {
      const value = post[key];
      const type = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
      const display = type === 'array' ? `array (length: ${value.length})` : type;
      console.log(`${key}: ${display}`);
      
      if (value === null) {
        console.log(`  ⚠️  NULL値 - .lengthを呼ぶとエラー`);
      }
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

checkAllFields();
