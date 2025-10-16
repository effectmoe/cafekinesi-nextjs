import { NextResponse } from 'next/server'
import { publicClient } from '@/lib/sanity.client'
import { groq } from 'next-sanity'

// siteConfigからllms.txtの内容を取得
const LLMS_CONTENT_QUERY = groq`
  *[_type == "siteConfig"][0] {
    llmsContent,
    baseUrl
  }
`

// キャッシュ設定: 1時間ごとに再検証
export const revalidate = 3600

export async function GET() {
  try {
    const siteConfig = await publicClient.fetch(LLMS_CONTENT_QUERY)

    if (!siteConfig || !siteConfig.llmsContent) {
      // Sanityにデータがない場合のフォールバック
      return new NextResponse(
        `# llms.txt for Cafe Kinesi

# About
Cafe Kinesi offers comprehensive kinesiology courses, blog articles, and instructor profiles in Japan.

# Organization Information
- Name: Cafe Kinesi
- Type: Educational Institution
- Country: Japan
- Main URL: https://cafekinesi-nextjs.vercel.app
- Content Language: Japanese (日本語)
- Focus: Kinesiology, Aromatherapy, Holistic Wellness

# Technical Details
- Framework: Next.js 15.5.3 with App Router
- CMS: Sanity (Project ID: e4aqw590)
- Deployment: Vercel with Edge Network`,
        {
          status: 200,
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
          },
        }
      )
    }

    // Sanityから取得した内容を返す
    return new NextResponse(siteConfig.llmsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    })
  } catch (error) {
    console.error('Error fetching llms.txt content:', error)

    // エラー時のフォールバック
    return new NextResponse(
      `# llms.txt for Cafe Kinesi

# Error
Failed to load content from CMS. Please try again later.

# Organization Information
- Name: Cafe Kinesi
- Main URL: https://cafekinesi-nextjs.vercel.app`,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    )
  }
}
