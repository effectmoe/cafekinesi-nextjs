import { config } from 'dotenv';
import { resolve } from 'path';
import { groq } from 'next-sanity';
import { publicClient } from '../lib/sanity.client';

config({ path: resolve(process.cwd(), '.env.local') });

async function checkDentalContent() {
  console.log('🔍 dental記事のコンテンツを詳しく確認中...\n');

  try {
    const post = await publicClient.fetch(groq`
      *[_type == "blogPost" && slug.current == "dental"][0] {
        _id,
        title,
        content,
        contentOrder,
        relatedArticles,
        author
      }
    `);

    if (!post) {
      console.log('❌ 記事が見つかりません');
      return;
    }

    console.log('✅ 記事が見つかりました\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('コンテンツ詳細:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('タイトル:', post.title);
    console.log('');

    console.log('content:', post.content ? `${post.content.length}ブロック` : '未設定');
    if (post.content && post.content.length > 0) {
      console.log('');
      console.log('コンテンツブロック:');
      post.content.forEach((block: any, index: number) => {
        console.log(`  ${index + 1}. タイプ: ${block._type}, キー: ${block._key}`);
        if (block.children && block.children.length > 0) {
          const text = block.children.map((c: any) => c.text).join('').substring(0, 50);
          console.log(`     テキスト: ${text}...`);
        }
      });
    }
    console.log('');

    console.log('contentOrder:', post.contentOrder || '未設定');
    if (post.contentOrder && post.contentOrder.length > 0) {
      console.log('  設定された順序:', post.contentOrder.join(', '));
    }
    console.log('');

    console.log('relatedArticles:', post.relatedArticles || '未設定');
    if (post.relatedArticles) {
      console.log('  タイプ:', typeof post.relatedArticles);
      console.log('  is Array:', Array.isArray(post.relatedArticles));
      console.log('  長さ:', Array.isArray(post.relatedArticles) ? post.relatedArticles.length : 'N/A');
      if (Array.isArray(post.relatedArticles) && post.relatedArticles.length > 0) {
        post.relatedArticles.forEach((article: any, index: number) => {
          console.log(`  ${index + 1}. ${JSON.stringify(article)}`);
        });
      }
    }
    console.log('');

    console.log('author:', post.author || '未設定');
    console.log('  タイプ:', typeof post.author);
    if (post.author) {
      console.log('  内容:', JSON.stringify(post.author));
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // JSONで全データを出力
    console.log('\n完全なJSONデータ:');
    console.log(JSON.stringify(post, null, 2));

  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

checkDentalContent();
