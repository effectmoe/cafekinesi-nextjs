// 本番環境と同じ設定でSanityから直接データを取得するテスト
const { createClient } = require('next-sanity');

// ハードコードされた設定（環境変数の問題を回避）
const config = {
  projectId: 'e4aqw590',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
};

console.log('=== Sanity Production Test ===');
console.log('Config:', config);

const client = createClient(config);

const BLOG_POSTS_QUERY = `
  *[_type == "blogPost"] | order(publishedAt desc) [0...9] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    category,
    featured,
    "author": author->{
      name,
      image
    }
  }
`;

async function testFetch() {
  try {
    console.log('\n実行中のクエリ:', BLOG_POSTS_QUERY);

    const posts = await client.fetch(BLOG_POSTS_QUERY);

    console.log('\n=== 取得結果 ===');
    console.log('投稿数:', posts.length);

    if (posts.length > 0) {
      console.log('\n最初の3件の投稿:');
      posts.slice(0, 3).forEach((post, index) => {
        console.log(`\n[${index + 1}] ${post.title}`);
        console.log('  ID:', post._id);
        console.log('  Slug:', JSON.stringify(post.slug));
        console.log('  Excerpt:', post.excerpt ? post.excerpt.substring(0, 50) + '...' : 'なし');
        console.log('  PublishedAt:', post.publishedAt);
        console.log('  MainImage:', post.mainImage ? 'あり' : 'なし');
      });
    } else {
      console.log('\n⚠️ 投稿が見つかりませんでした');
    }
  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error);
    console.error('エラー詳細:', JSON.stringify(error, null, 2));
  }
}

testFetch();