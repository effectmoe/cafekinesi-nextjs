import AlbumGrid from '@/components/AlbumGrid'
import BlogSectionDynamic from '@/components/BlogSectionDynamic'
import HeroSection from '@/components/HeroSection'
import FeaturesSection from '@/components/FeaturesSection'
import FAQSection from '@/components/FAQSection'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialLinks from '@/components/SocialLinks'
import { client } from '@/lib/sanity.client'
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
    const data = await client.fetch(HOMEPAGE_QUERY, {}, {
      cache: 'no-store',
      next: { revalidate: 0 }
    })
    return data
  } catch (error) {
    console.error('Failed to fetch homepage data:', error)
    return null
  }
}

async function getFAQs() {
  try {
    const data = await client.fetch(FAQ_QUERY, {}, {
      cache: 'no-store',
      next: { revalidate: 0 }
    })
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
    <div className="min-h-screen bg-white">
      <Header />
      <main className="relative">
        {heroSection && (
          <HeroSection
            heading={heroSection.heading}
            subheading={heroSection.subheading}
            backgroundImage={heroSection.backgroundImage}
            cta={heroSection.cta}
          />
        )}

        {featuresSection && (
          <FeaturesSection
            title={featuresSection.title}
            features={featuresSection.features || []}
          />
        )}

        <AlbumGrid />
        <BlogSectionDynamic />
        <FAQSection faqs={faqs} />
      </main>
      <SocialLinks />
      <Footer />
    </div>
  )
}