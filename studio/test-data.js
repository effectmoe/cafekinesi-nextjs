import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'e4aqw590',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false
})

client.fetch('*[_type == "blogPost"] | order(publishedAt desc)')
  .then(posts => {
    console.log('Found', posts.length, 'blog posts:')
    posts.forEach(post => {
      console.log(`- ${post.title} (slug: ${post.slug?.current})`)
    })
  })
  .catch(error => {
    console.error('Error fetching posts:', error)
  })