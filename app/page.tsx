import { sanityFetch } from '@/lib/sanity.client'
import { simpleFetch } from '@/lib/sanity.simple'
import AlbumGrid from '@/components/AlbumGrid'
import BlogSection from '@/components/BlogSection'
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

// 動的レンダリングを強制してSanityデータを確実に取得
export const dynamic = 'force-dynamic'
export const revalidate = 0 // キャッシュを完全に無効化
export const fetchCache = 'force-no-store' // fetchキャッシュを無効化

export default async function HomePage() {
  const page = await getHomepage()

  // Homepageデータがない場合もデフォルトレイアウトを表示
  if (!page) {
    console.log('[HomePage] No homepage data found, showing default layout')
  }

  // ブログ記事を取得
  let blogPosts = []
  try {
    console.log('[HomePage] Fetching blog posts with simpleFetch')
    blogPosts = await simpleFetch(BLOG_POSTS_QUERY)
    console.log('[HomePage] Fetched blog posts:', blogPosts?.length || 0)
  } catch (error) {
    console.error('[HomePage] Error fetching blog posts:', error)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="relative">
        <AlbumGrid />
        <BlogSection posts={blogPosts} />
      </main>
      <SocialLinks />
      <Footer />
    </div>
  )
}