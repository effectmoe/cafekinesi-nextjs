import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Sanity CDN APIを直接使用（認証不要、CORS対応）
    const projectId = 'e4aqw590'
    const dataset = 'production'
    const query = encodeURIComponent(`
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
    `)

    const url = `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${query}`

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Sanity API error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      posts: data.result || [],
    })
  } catch (error) {
    console.error('[API Route] Error:', error)
    return NextResponse.json({
      success: false,
      posts: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}