import { connection } from 'next/server'
import { unstable_noStore } from 'next/cache'
import { sanityFetch } from '@/lib/sanity.client'
import AlbumGrid from '@/components/AlbumGrid'
import BlogSectionServer from '@/components/BlogSectionServer'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialLinks from '@/components/SocialLinks'
import type { Homepage } from '@/types/sanity.types'
import type { Metadata } from 'next'

const HOMEPAGE_QUERY = `*[_type == "homepage"][0] {
  _id,
  _type,
  title,
  sections[] {
    _key,
    _type,
    ...
  },
  seo {
    title,
    description,
    keywords,
    ogImage
  }
}`

async function getHomepage() {
  try {
    const result = await sanityFetch<Homepage>(HOMEPAGE_QUERY)
    return result
  } catch (error) {
    console.error('[Sanity] Error fetching homepage:', error)
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomepage()

  return {
    title: page?.seo?.title || 'Cafe Kinesi - 心と身体を整える空間',
    description: page?.seo?.description || 'アロマテラピーとキネシオロジーが融合した新しい体験',
  }
}

// 動的レンダリングを強制
export const dynamic = 'force-dynamic'
export const runtime = 'edge' // Edge Runtimeで実行

export default async function HomePage() {
  // キャッシュを完全に無効化
  unstable_noStore()

  // Connection APIで動的実行を保証
  await connection()

  // デバッグ用メタデータ
  const debugInfo = {
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    hasProjectId: !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    hasDataset: !!process.env.NEXT_PUBLIC_SANITY_DATASET,
  }

  console.log('[HomePage Debug]', JSON.stringify(debugInfo))

  const page = await getHomepage()

  // Homepageデータがない場合もデフォルトレイアウトを表示
  if (!page) {
    console.log('[HomePage] No homepage data found, showing default layout')
  }

  // Sanity CDN APIから直接ブログデータを取得
  let blogPosts = []
  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || 'e4aqw590'
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || 'production'
    const apiVersion = '2024-01-01'

    // URLを明示的に構築
    const query = encodeURIComponent(`*[_type == "blogPost"] | order(publishedAt desc) [0...9] {
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
    }`)

    const url = `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}?query=${query}`

    console.log('[HomePage] Fetching from:', url)

    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      },
    })

    console.log('[HomePage] Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[HomePage] API Error:', errorText)
      throw new Error(`API responded with ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    blogPosts = data?.result || []
    console.log('[HomePage] Data received:', blogPosts.length, 'items')

    if (blogPosts.length > 0) {
      console.log('[HomePage] First post:', blogPosts[0].title)
    }
  } catch (error) {
    console.error('[HomePage] Fatal error:', error)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="relative">
        <AlbumGrid />
        <BlogSectionServer posts={blogPosts} />
      </main>
      <SocialLinks />
      <Footer />

      {/* デバッグ情報を非表示で埋め込み（本番では削除） */}
      <div style={{ display: 'none' }}>
        <meta name="debug-timestamp" content={debugInfo.timestamp} />
        <meta name="debug-data-count" content={String(blogPosts.length)} />
        <meta name="debug-env" content={debugInfo.env || 'unknown'} />
      </div>
    </div>
  )
}