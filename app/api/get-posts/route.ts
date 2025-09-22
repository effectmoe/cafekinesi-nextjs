import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 直接値を使用（環境変数の問題を完全に回避）
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
        featured
      }
    `)

    const url = `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${query}`

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Sanity API error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      posts: data.result || [],
    })
  } catch (error) {
    console.error('[API] Error:', error)
    return NextResponse.json({
      posts: [],
    })
  }
}