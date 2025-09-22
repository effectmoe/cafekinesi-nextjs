import { NextResponse } from 'next/server'

// Vercel環境で確実に実行するため動的にする
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    // 環境変数の値を直接使用（フォールバック付き）
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || 'e4aqw590'
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || 'production'

    console.log('[API Route] Using config:', { projectId, dataset })

    // SanityのCDN APIを直接使用（認証不要）
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

    console.log('[API Route] Fetching from URL:', url)

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error('[API Route] Sanity API error:', response.status, response.statusText)
      throw new Error(`Sanity API error: ${response.status}`)
    }

    const data = await response.json()

    console.log('[API Route] Sanity response:', {
      hasResult: !!data.result,
      resultLength: data.result?.length || 0,
      firstPost: data.result?.[0]?.title
    })

    // CORSヘッダーを追加
    return NextResponse.json(
      {
        success: true,
        posts: data.result || [],
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Cache-Control': 'no-store, must-revalidate',
        },
      }
    )
  } catch (error) {
    console.error('[API Route] Error:', error)
    return NextResponse.json(
      {
        success: false,
        posts: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store',
        },
      }
    )
  }
}

// CORSプリフライトリクエストの処理
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  )
}