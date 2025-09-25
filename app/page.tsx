import AlbumGrid from '@/components/AlbumGrid'
import BlogSectionDynamic from '@/components/BlogSectionDynamic'
import HeroSection from '@/components/HeroSection'
import FeaturesSection from '@/components/FeaturesSection'
import FAQSection from '@/components/FAQSection'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialLinks from '@/components/SocialLinks'
import SiteSchemas from '@/components/SiteSchemas'
import { client, publicClient, previewClient } from '@/lib/sanity.client'
import { draftMode } from 'next/headers'
import { groq } from 'next-sanity'
import type { Metadata } from 'next'

const HOMEPAGE_QUERY = groq`*[_type == "homepage"][0] {
  title,
  sections,
  seo
}`

const FAQ_QUERY = groq`*[_type == "faq"] | order(order asc) {
  _id,
  question,
  answer,
  category
}`

async function getHomepageData() {
  try {
    const draft = await draftMode()
    const isPreview = draft.isEnabled
    const selectedClient = isPreview ? previewClient : publicClient

    console.log(`Fetching homepage data, preview: ${isPreview}`)

    const data = await selectedClient.fetch(HOMEPAGE_QUERY, {}, {
      cache: isPreview ? 'no-store' : 'force-cache'
    } as any)
    return data
  } catch (error) {
    console.error('Failed to fetch homepage data:', error)
    return null
  }
}

async function getFAQs() {
  try {
    const draft = await draftMode()
    const isPreview = draft.isEnabled
    const selectedClient = isPreview ? previewClient : publicClient

    const data = await selectedClient.fetch(FAQ_QUERY, {}, {
      cache: isPreview ? 'no-store' : 'force-cache'
    } as any)
    return data
  } catch (error) {
    console.error('Failed to fetch FAQs:', error)
    return []
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getHomepageData()

  if (homepage?.seo) {
    return {
      title: homepage.seo.title || 'Cafe Kinesi',
      description: homepage.seo.description || 'アロマテラピーとキネシオロジーが融合した新しい体験',
      keywords: homepage.seo.keywords || '',
    }
  }

  return {
    title: 'Cafe Kinesi - 心と身体を整える空間',
    description: 'アロマテラピーとキネシオロジーが融合した新しい体験',
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function HomePage() {
  const [homepage, faqs] = await Promise.all([
    getHomepageData(),
    getFAQs()
  ])

  console.log('[HomePage] Homepage data:', JSON.stringify(homepage, null, 2))
  console.log('[HomePage] FAQs:', faqs?.length || 0)

  // ヒーローセクションとフィーチャーセクションのデータを抽出
  const heroSection = homepage?.sections?.find((s: any) => s._type === 'hero')
  const featuresSection = homepage?.sections?.find((s: any) => s._type === 'featuresSection')

  console.log('[HomePage] Hero section:', heroSection ? 'Found' : 'Not found')
  console.log('[HomePage] Features section:', featuresSection ? 'Found' : 'Not found')

  return (
    <>
      {/* Schema.org構造化データ */}
      <SiteSchemas
        currentPage={{
          title: homepage?.title || 'Cafe Kinesi - 心と身体を整える空間',
          url: process.env.NEXT_PUBLIC_SITE_URL || 'https://cafekinesi-nextjs.vercel.app'
        }}
      />

      <div className="min-h-screen bg-white">
        <Header />
        <main className="relative">
          <AlbumGrid />
          <BlogSectionDynamic />
          <FAQSection faqs={faqs} />
        </main>
        <SocialLinks />
        <Footer />
      </div>
    </>
  )
}