import { NextRequest, NextResponse } from 'next/server'
import { publicClient } from '@/lib/sanity.client'
import { groq } from 'next-sanity'

// レート制限設定
const RATE_LIMIT = 100 // 1時間あたりのリクエスト数
const RATE_LIMIT_WINDOW = 3600000 // 1時間（ミリ秒）

// レート制限マップ（本番環境ではRedisやVercel KVを推奨）
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

/**
 * レート制限チェック
 * @param ip - クライアントIPアドレス
 * @returns 制限内ならtrue、超過ならfalse
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetAt) {
    // 新規または期限切れ - リセット
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT) {
    // レート制限超過
    return false
  }

  // カウントアップ
  record.count++
  return true
}

/**
 * クリーンアップ（古いレート制限レコードを削除）
 */
function cleanupRateLimitMap() {
  const now = Date.now()
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetAt) {
      rateLimitMap.delete(ip)
    }
  }
}

// 定期的にクリーンアップ（5分ごと）
setInterval(cleanupRateLimitMap, 300000)

/**
 * AI Knowledge API
 *
 * AIエージェント向けの公開APIエンドポイント
 * Sanityのコンテンツ（blogPost, course, instructor, event）をJSON形式で提供
 *
 * クエリパラメータ:
 * - type: 'blog' | 'course' | 'instructor' | 'event' | 'all'
 * - q: 検索クエリ（部分一致）
 * - limit: 取得件数（デフォルト: 10、最大: 100）
 *
 * 使用例:
 * GET /api/ai-knowledge?type=blog&limit=20
 * GET /api/ai-knowledge?type=course&q=キネシオロジー
 * GET /api/ai-knowledge?type=instructor&q=東京
 * GET /api/ai-knowledge?type=event&limit=10
 * GET /api/ai-knowledge?type=all
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    // クエリパラメータ取得
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'all'
    const query = searchParams.get('q') || ''
    const limitParam = searchParams.get('limit') || '10'
    const limit = Math.min(Math.max(parseInt(limitParam, 10), 1), 100) // 1-100の範囲

    // IPアドレス取得
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'

    console.log(`[AI Knowledge API] Request from ${ip}: type=${type}, q=${query}, limit=${limit}`)

    // レート制限チェック
    if (!checkRateLimit(ip)) {
      console.warn(`[AI Knowledge API] Rate limit exceeded for IP: ${ip}`)
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded',
          message: 'リクエスト数が制限を超えました。1時間後に再試行してください。',
          retryAfter: 3600,
        },
        {
          status: 429,
          headers: {
            'Retry-After': '3600',
            'X-RateLimit-Limit': RATE_LIMIT.toString(),
            'X-RateLimit-Remaining': '0',
          },
        }
      )
    }

    let data: any[] = []
    let contentType = type

    switch (type) {
      case 'blog': {
        // ブログ記事取得
        const searchFilter = query
          ? `&& (title match "*${query}*" || excerpt match "*${query}*" || pt::text(content) match "*${query}*")`
          : ''

        data = await publicClient.fetch(groq`
          *[_type == "blogPost" && !(_id in path("drafts.*")) ${searchFilter}]
          | order(publishedAt desc) [0...${limit}] {
            _id,
            _type,
            title,
            "slug": slug.current,
            excerpt,
            publishedAt,
            _updatedAt,
            "url": "/blog/" + slug.current,
            tags,
            category,
            "author": author->name,
            "imageUrl": mainImage.asset->url
          }
        `)
        break
      }

      case 'course': {
        // 講座情報取得
        const searchFilter = query
          ? `&& (title match "*${query}*" || description match "*${query}*" || subtitle match "*${query}*")`
          : ''

        data = await publicClient.fetch(groq`
          *[_type == "course" ${searchFilter}] [0...${limit}] {
            _id,
            _type,
            title,
            subtitle,
            "slug": slug.current,
            description,
            _updatedAt,
            "url": "/school/" + slug.current,
            features,
            "imageUrl": image.asset->url
          }
        `)
        break
      }

      case 'instructor': {
        // 講師情報取得
        const searchFilter = query
          ? `&& (name match "*${query}*" || bio match "*${query}*" || region match "*${query}*" || specialties[] match "*${query}*")`
          : ''

        data = await publicClient.fetch(groq`
          *[_type == "instructor" ${searchFilter}] [0...${limit}] {
            _id,
            _type,
            name,
            "slug": slug.current,
            bio,
            region,
            specialties,
            _updatedAt,
            "url": "/instructor/" + lower(region) + "/" + slug.current,
            "imageUrl": image.asset->url
          }
        `)
        break
      }

      case 'event': {
        // イベント情報取得
        const searchFilter = query
          ? `&& (title match "*${query}*" || description match "*${query}*" || location match "*${query}*")`
          : ''

        data = await publicClient.fetch(groq`
          *[_type == "event" && useForAI == true ${searchFilter}]
          | order(startDate asc) [0...${limit}] {
            _id,
            _type,
            title,
            "slug": slug.current,
            description,
            startDate,
            endDate,
            location,
            fee,
            capacity,
            currentParticipants,
            status,
            category,
            tags,
            registrationUrl,
            _updatedAt,
            "url": "/event/" + slug.current
          }
        `)
        break
      }

      case 'all':
      default: {
        // 全タイプから取得
        const perTypeLimit = Math.ceil(limit / 4)

        const [blogs, courses, instructors, events] = await Promise.all([
          publicClient.fetch(groq`
            *[_type == "blogPost" && !(_id in path("drafts.*"))]
            | order(publishedAt desc) [0...${perTypeLimit}] {
              _id,
              _type,
              title,
              "slug": slug.current,
              excerpt,
              publishedAt,
              "url": "/blog/" + slug.current,
              tags
            }
          `),
          publicClient.fetch(groq`
            *[_type == "course"] [0...${perTypeLimit}] {
              _id,
              _type,
              title,
              subtitle,
              "slug": slug.current,
              description,
              "url": "/school/" + slug.current
            }
          `),
          publicClient.fetch(groq`
            *[_type == "instructor"] [0...${perTypeLimit}] {
              _id,
              _type,
              name,
              "slug": slug.current,
              bio,
              region,
              "url": "/instructor/" + lower(region) + "/" + slug.current
            }
          `),
          publicClient.fetch(groq`
            *[_type == "event" && useForAI == true]
            | order(startDate asc) [0...${perTypeLimit}] {
              _id,
              _type,
              title,
              "slug": slug.current,
              startDate,
              location,
              fee,
              status,
              "url": "/event/" + slug.current
            }
          `),
        ])

        data = [...blogs, ...courses, ...instructors, ...events]
        contentType = 'all'
        break
      }
    }

    const processingTime = Date.now() - startTime
    console.log(`[AI Knowledge API] Success: ${data.length} items in ${processingTime}ms`)

    return NextResponse.json(
      {
        success: true,
        data,
        meta: {
          count: data.length,
          type: contentType,
          query: query || null,
          limit,
          processingTime,
          timestamp: new Date().toISOString(),
        },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          'X-Response-Time': `${processingTime}ms`,
        },
      }
    )
  } catch (error) {
    console.error('[AI Knowledge API] Error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'データの取得に失敗しました。',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    )
  }
}

// Edge Runtimeで実行（低レイテンシー）
export const runtime = 'edge'

// 5分ごとにキャッシュ再検証
export const revalidate = 300
