const fs = require('fs');
const path = require('path');

async function fetchBlogPosts() {
  const projectId = 'e4aqw590';
  const dataset = 'production';

  const query = encodeURIComponent(`
    *[_type == "blogPost"] | order(publishedAt desc) [0...9] {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      publishedAt,
      category,
      featured
    }
  `);

  const url = `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${query}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const posts = data.result || [];

    // publicフォルダにJSONファイルとして保存
    const outputPath = path.join(__dirname, '..', 'public', 'blog-posts.json');
    fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2));

    console.log(`✅ Saved ${posts.length} blog posts to public/blog-posts.json`);

    // 最初の記事のタイトルを表示
    if (posts.length > 0) {
      console.log('First post:', posts[0].title);
    }

    return posts;
  } catch (error) {
    console.error('❌ Error fetching data:', error);
    return [];
  }
}

fetchBlogPosts();