const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'e4aqw590',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function checkData() {
  const post = await client.fetch(`*[_type == "blogPost" && slug.current == "breathing-stress-relief"][0]{
    title,
    content,
    body,
    excerpt
  }`);
  console.log('Post data:', JSON.stringify(post, null, 2));
}

checkData();