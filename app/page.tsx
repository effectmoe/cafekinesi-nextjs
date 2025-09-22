import { connection } from 'next/server'
import { sanityFetch } from '@/lib/sanity.client'
import { sanityServerFetch } from '@/lib/sanity.server'
import AlbumGrid from '@/components/AlbumGrid'
import BlogSection from '@/components/BlogSection'
import BlogSectionServer from '@/components/BlogSectionServer'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialLinks from '@/components/SocialLinks'
import { BLOG_POSTS_QUERY } from '@/lib/queries'
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

// 動的レンダリングを強制（Next.js 15ではこれだけで十分）
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  // Connection APIで動的実行を保証
  await connection()

  const page = await getHomepage()

  // Homepageデータがない場合もデフォルトレイアウトを表示
  if (!page) {
    console.log('[HomePage] No homepage data found, showing default layout')
  }

  // Server Componentでブログ記事を取得
  let blogPosts = []
  try {
    // Sanity CDN APIを直接使用
    const projectId = 'e4aqw590'
    const dataset = 'production'
    const query = encodeURIComponent(BLOG_POSTS_QUERY)
    const url = `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${query}`

    const response = await fetch(url, {
      next: { revalidate: 0 },
      cache: 'no-store'
    })

    if (response.ok) {
      const data = await response.json()
      blogPosts = data.result || []
    }
  } catch (error) {
    console.error('[HomePage] Error fetching blog posts:', error)
  }

  console.log('[HomePage Server] Fetched blog posts:', blogPosts?.length || 0)

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="relative">
        <AlbumGrid />
        <BlogSectionServer posts={blogPosts} />
      </main>
      <SocialLinks />
      <Footer />
    </div>
  )
}