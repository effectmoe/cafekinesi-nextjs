import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'e4aqw590',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  perspective: 'published',
})

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
`

export async function GET() {
  try {
    console.log('[API Route] Fetching blog posts from Sanity...')
    const posts = await client.fetch(BLOG_POSTS_QUERY)
    console.log('[API Route] Successfully fetched posts:', posts?.length || 0)

    return NextResponse.json({
      success: true,
      posts: posts || [],
      count: posts?.length || 0
    })
  } catch (error) {
    console.error('[API Route] Error fetching posts:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch posts',
      posts: []
    }, { status: 500 })
  }
}