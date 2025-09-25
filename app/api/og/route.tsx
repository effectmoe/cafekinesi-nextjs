import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'
import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'

export const runtime = 'edge'

// フォントデータの読み込み
const fontPromise = fetch(
  new URL('/fonts/NotoSansJP-Bold.ttf', process.env.NEXT_PUBLIC_APP_URL || 'https://cafekinesi-nextjs.vercel.app')
).then((res) => res.arrayBuffer())

export async function GET(request: NextRequest) {
  try {
    const fontData = await fontPromise
    const searchParams = request.nextUrl.searchParams
    const slug = searchParams.get('slug')
    const type = searchParams.get('type') || 'post'

    if (!slug) {
      return new ImageResponse(
        (
          <div
            style={{
              fontSize: 48,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            Cafe Kinesi
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      )
    }

    // Sanityからコンテンツを取得
    const query = groq`*[_type == "${type}" && slug.current == $slug][0] {
      title,
      excerpt,
      mainImage,
      author-> {
        name,
        image
      },
      category,
      categories[]-> {
        title
      },
      tags
    }`

    const data = await client.fetch(query, { slug })

    if (!data) {
      return new ImageResponse(
        (
          <div
            style={{
              fontSize: 48,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            Content Not Found
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      )
    }

    // OG画像のレンダリング
    const response = new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '60px',
            fontFamily: 'Noto Sans JP',
          }}
        >
          {/* カテゴリタグ */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
            {data.categories?.map((cat: any, index: number) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '18px',
                  color: 'white',
                  display: 'flex',
                }}
              >
                {cat.title}
              </div>
            )) || (data.category && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '18px',
                  color: 'white',
                  display: 'flex',
                }}
              >
                {data.category}
              </div>
            ))}
          </div>

          {/* タイトル */}
          <div
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: 'white',
              lineHeight: 1.2,
              marginBottom: '30px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {data.title}
          </div>

          {/* 概要 */}
          {data.excerpt && (
            <div
              style={{
                fontSize: '24px',
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: 1.5,
                marginBottom: 'auto',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {data.excerpt}
            </div>
          )}

          {/* 著者情報 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 'auto',
            }}
          >
            {data.author && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {data.author.image && (
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'white',
                      display: 'flex',
                    }}
                  />
                )}
                <div style={{ color: 'white', fontSize: '20px' }}>
                  {data.author.name}
                </div>
              </div>
            )}

            {/* サイト名 */}
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '20px',
                fontWeight: 'bold',
              }}
            >
              Cafe Kinesi
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Noto Sans JP',
            data: fontData,
            style: 'normal',
            weight: 700,
          },
        ],
      }
    )

    // キャッシュ制御ヘッダーを追加（1時間キャッシュ、再検証）
    return new Response(response.body, {
      headers: {
        ...Object.fromEntries(response.headers.entries()),
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        'CDN-Cache-Control': 'public, max-age=86400',
        'Vercel-CDN-Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (error) {
    console.error('OG Image Generation Error:', error)

    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          Cafe Kinesi
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  }
}