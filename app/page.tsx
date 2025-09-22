import { client, groq } from '@/lib/sanity.client'
import AlbumGrid from '@/components/AlbumGrid'
import BlogSectionServer from '@/components/BlogSectionServer'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialLinks from '@/components/SocialLinks'
import type { Metadata } from 'next'

// 公式推奨のGROQクエリ
const blogPostsQuery = groq`
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

const homepageQuery = groq`
  *[_type == "homepage"][0] {
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
  }
`

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await client.fetch(homepageQuery)
    return {
      title: page?.seo?.title || 'Cafe Kinesi - 心と身体を整える空間',
      description: page?.seo?.description || 'アロマテラピーとキネシオロジーが融合した新しい体験',
    }
  } catch {
    return {
      title: 'Cafe Kinesi - 心と身体を整える空間',
      description: 'アロマテラピーとキネシオロジーが融合した新しい体験',
    }
  }
}

// 公式ドキュメント推奨パターン（シンプルに）
export default async function HomePage() {
  // 公式推奨パターンでデータ取得
  const [homepage, blogPosts] = await Promise.all([
    client.fetch(homepageQuery).catch(() => null),
    client.fetch(blogPostsQuery).catch(() => [])
  ])

  console.log('[HomePage] Fetched data:', {
    hasHomepage: !!homepage,
    blogPostsCount: blogPosts?.length || 0,
    firstPost: blogPosts?.[0]?.title
  })

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