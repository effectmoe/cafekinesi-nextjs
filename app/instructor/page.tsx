import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { publicClient, previewClient } from '@/lib/sanity.client'
import { INSTRUCTORS_QUERY, INSTRUCTOR_PAGE_QUERY } from '@/lib/queries'
import type { Instructor, InstructorPageData } from '@/lib/types/instructor'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialLinks from '@/components/SocialLinks'
import InstructorHeroSection from '@/components/instructor/InstructorHeroSection'
import InstructorAboutSection from '@/components/instructor/InstructorAboutSection'
import InstructorServicesSection from '@/components/instructor/InstructorServicesSection'
import InstructorMapSection from '@/components/instructor/InstructorMapSection'

// Sanityから公開インストラクターを取得
async function getInstructors(): Promise<Instructor[]> {
  try {
    const draft = await draftMode()
    const isPreview = draft.isEnabled
    const selectedClient = isPreview ? previewClient : publicClient

    const data = await selectedClient.fetch(INSTRUCTORS_QUERY, {}, {
      cache: isPreview ? 'no-store' : 'force-cache'
    } as any)

    return data || []
  } catch (error) {
    console.error('Failed to fetch instructors:', error)
    return []
  }
}

// Sanityからインストラクターページ設定を取得
async function getInstructorPageData(): Promise<InstructorPageData | null> {
  try {
    const draft = await draftMode()
    const isPreview = draft.isEnabled
    const selectedClient = isPreview ? previewClient : publicClient

    const data = await selectedClient.fetch(INSTRUCTOR_PAGE_QUERY, {}, {
      cache: isPreview ? 'no-store' : 'force-cache'
    } as any)

    return data || null
  } catch (error) {
    console.error('Failed to fetch instructor page data:', error)
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getInstructorPageData()

  // Sanityからデータがある場合はそれを使用、なければデフォルト値
  return {
    title: pageData?.seo?.title || 'インストラクターを探す | Cafe Kinesi',
    description: pageData?.seo?.description || 'お近くのカフェキネシインストラクターを見つけましょう。キネシオロジーやセラピーを教える経験豊富な認定インストラクターが全国にいます。',
    keywords: pageData?.seo?.keywords || 'カフェキネシ, インストラクター, 講師, キネシオロジー, セラピー, 認定講師',
    openGraph: {
      title: pageData?.seo?.title || 'インストラクターを探す | Cafe Kinesi',
      description: pageData?.seo?.description || 'お近くのカフェキネシインストラクターを見つけましょう。',
      images: pageData?.seo?.ogImage ? [pageData.seo.ogImage.asset.url] : ['/og-image.jpg'],
    },
  }
}

// ISR設定（30分ごとに再生成）
export const revalidate = 1800

export default async function InstructorPage() {
  const instructors = await getInstructors()
  const pageData = await getInstructorPageData()

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="relative">
        {/* ヒーローセクション */}
        <InstructorHeroSection heroSection={pageData?.heroSection} />

        {/* カフェキネシインストラクターとは */}
        <InstructorAboutSection aboutSection={pageData?.aboutSection} />

        {/* 提供サービス */}
        <InstructorServicesSection servicesSection={pageData?.servicesSection} />

        {/* 都道府県から探す */}
        <InstructorMapSection instructors={instructors} />
      </main>
      <SocialLinks />
      <Footer />
    </div>
  )
}
