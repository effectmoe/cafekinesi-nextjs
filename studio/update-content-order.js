const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'e4aqw590',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: 'skmH5807aTZkc80e9wXtUGh6YGxvS9fmTcsxwG0vDPy9XPJ3lTpX7wYmAXl5SKy1HEOllZf3NDEg1ULmn'
})

const defaultContentOrder = [
  'title', 'slug', 'featured', 'publishedAt', 'category', 'author',
  'excerpt', 'tags', 'mainImage', 'gallery', 'additionalImages',
  'ogImage', 'tldr', 'toc', 'content', 'keyPoint', 'summary',
  'faq', 'related', 'prevNext'
]

async function updateContentOrder() {
  console.log('Starting content order update...')

  try {
    // 全てのブログ記事を取得
    const posts = await client.fetch('*[_type == "blogPost"]{ _id, title, contentOrder }')
    console.log(`Found ${posts.length} blog posts`)

    const updatePromises = posts.map(async (post) => {
      // contentOrderが未設定または空の場合のみ更新
      if (!post.contentOrder || post.contentOrder.length === 0) {
        console.log(`Updating post: ${post.title}`)
        return client
          .patch(post._id)
          .set({ contentOrder: defaultContentOrder })
          .commit()
      } else {
        console.log(`Skipping post (already has contentOrder): ${post.title}`)
        return Promise.resolve()
      }
    })

    await Promise.all(updatePromises)
    console.log('✅ All posts updated successfully!')

  } catch (error) {
    console.error('❌ Error updating posts:', error)
  }
}

updateContentOrder()