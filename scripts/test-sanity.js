const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'e4aqw590',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function testSanity() {
  try {
    console.log('🔍 Testing Sanity connection...');

    // Simple test query
    const result = await client.fetch('*[_type == "blogPost"] | order(publishedAt desc) [0...3]');

    console.log('✅ Sanity connection successful!');
    console.log('📊 Number of blog posts found:', result.length);

    if (result.length > 0) {
      console.log('📝 First post:', {
        title: result[0].title,
        slug: result[0].slug?.current,
        publishedAt: result[0].publishedAt
      });
    }

    return result;
  } catch (error) {
    console.error('❌ Sanity connection failed:', error.message);
    if (error.details) {
      console.error('📋 Error details:', error.details);
    }
    throw error;
  }
}

testSanity()
  .then(result => {
    console.log('🎉 Test completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Test failed');
    process.exit(1);
  });