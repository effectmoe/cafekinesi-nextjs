const { createClient } = require('@sanity/client');

// Sanity設定（.env.localから）
const client = createClient({
  projectId: 'e4aqw590',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: 'skmH5807aTZkc80e9wXtUGh6YGxvS9fmTcsxwG0vDPy9XPJ3lTpX7wYmAXl5SKy1HEOllZf3NDEg1ULmn'
});

async function testSanityConnection() {
  console.log('=== Sanity Connection Test ===\n');

  try {
    // 1. ブログ記事を取得
    console.log('1. Fetching blog posts...');
    const blogPosts = await client.fetch('*[_type == "blogPost"] | order(publishedAt desc) [0...5] { _id, title, slug, publishedAt }');
    console.log(`Found ${blogPosts.length} blog posts:`);
    blogPosts.forEach(post => {
      console.log(`  - ${post.title} (${post.publishedAt})`);
    });

    // 2. 全ドキュメントタイプを確認
    console.log('\n2. Checking all document types...');
    const types = await client.fetch('*[defined(_type)] { _type } | order(_type) | {"types": array::unique([._type])}');
    console.log('Document types in Sanity:', types.types);

    // 3. 各タイプのドキュメント数を確認
    console.log('\n3. Document count by type:');
    const blogPostCount = await client.fetch('count(*[_type == "blogPost"])');
    console.log(`  blogPost: ${blogPostCount} documents`);
    const pageCount = await client.fetch('count(*[_type == "page"])');
    console.log(`  page: ${pageCount} documents`);
    const homepageCount = await client.fetch('count(*[_type == "homepage"])');
    console.log(`  homepage: ${homepageCount} documents`);

    // 4. 画像アセットの確認
    console.log('\n4. Checking image assets...');
    const imagesCount = await client.fetch('count(*[_type == "sanity.imageAsset"])');
    console.log(`Total image assets: ${imagesCount}`);

    // 5. 最新のブログ記事の詳細
    if (blogPosts.length > 0) {
      console.log('\n5. Latest blog post details:');
      const latestPost = await client.fetch(`*[_type == "blogPost"] | order(publishedAt desc) [0] {
        _id,
        title,
        slug,
        excerpt,
        "hasMainImage": defined(mainImage),
        "imageRef": mainImage.asset._ref,
        publishedAt,
        "contentBlocks": count(content[]),
        author-> { name }
      }`);
      console.log(JSON.stringify(latestPost, null, 2));
    }

    console.log('\n✅ Sanity connection successful!');

  } catch (error) {
    console.error('\n❌ Error connecting to Sanity:', error);
    console.error('Error details:', error.message);
  }
}

testSanityConnection();