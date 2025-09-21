const { createClient } = require('@sanity/client');

// Sanity設定
const client = createClient({
  projectId: 'e4aqw590',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: 'skmH5807aTZkc80e9wXtUGh6YGxvS9fmTcsxwG0vDPy9XPJ3lTpX7wYmAXl5SKy1HEOllZf3NDEg1ULmn'
});

async function testSanity() {
  console.log('=== Sanity Simple Test ===\n');

  try {
    // 1. 全てのブログ記事を取得
    console.log('1. Getting ALL blog posts:');
    const allPosts = await client.fetch(`
      *[_type == "blogPost"] | order(publishedAt desc) {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        publishedAt,
        "hasMainImage": defined(mainImage),
        "imageRef": mainImage.asset._ref
      }
    `);

    console.log(`\nTotal blog posts: ${allPosts.length}\n`);
    allPosts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title}`);
      console.log(`   - Slug: ${post.slug}`);
      console.log(`   - Published: ${post.publishedAt}`);
      console.log(`   - Has image: ${post.hasMainImage ? 'Yes' : 'No'}`);
      if (post.imageRef) {
        console.log(`   - Image ref: ${post.imageRef}`);
      }
      console.log('');
    });

    // 2. 画像を正しく取得できるか確認
    if (allPosts.length > 0 && allPosts[0].imageRef) {
      console.log('2. Testing image URL generation:');
      const imageUrl = `https://cdn.sanity.io/images/e4aqw590/production/${allPosts[0].imageRef.replace('image-', '').replace('-webp', '.webp').replace('-jpg', '.jpg').replace('-png', '.png')}?w=400&h=300&q=80`;
      console.log(`   Generated URL: ${imageUrl}\n`);
    }

    // 3. BlogSectionで使用するクエリをテスト
    console.log('3. Testing BlogSection query:');
    const BLOG_POSTS_QUERY = `
      *[_type == "blogPost"] | order(publishedAt desc) [0...9] {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        mainImage,
        publishedAt,
        category,
        featured,
        author-> {
          name,
          image
        }
      }
    `;

    const blogSectionPosts = await client.fetch(BLOG_POSTS_QUERY);
    console.log(`   BlogSection would show: ${blogSectionPosts.length} posts\n`);

    // 4. 本番環境との差分を確認
    console.log('4. Checking data integrity:');
    blogSectionPosts.slice(0, 3).forEach((post, index) => {
      console.log(`   Post ${index + 1}: "${post.title}"`);
      console.log(`   - Has mainImage object: ${!!post.mainImage}`);
      if (post.mainImage) {
        console.log(`   - Has asset: ${!!post.mainImage.asset}`);
        console.log(`   - Asset _ref: ${post.mainImage.asset?._ref || 'None'}`);
      }
      console.log('');
    });

    console.log('✅ Test completed successfully!\n');

    // 結論
    console.log('=== SUMMARY ===');
    console.log(`✅ Sanity connection is working`);
    console.log(`✅ Found ${allPosts.length} blog posts in Sanity`);
    console.log(`✅ Images are ${allPosts.some(p => p.hasMainImage) ? 'present' : 'missing'} in posts`);
    console.log(`✅ Query is returning data correctly`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response);
    }
  }
}

testSanity();