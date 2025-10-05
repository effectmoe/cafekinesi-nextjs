import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { publicClient, previewClient } from '@/lib/sanity.client'
import { INSTRUCTORS_QUERY } from '@/lib/queries'
import type { Instructor } from '@/lib/types/instructor'
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

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'インストラクターを探す | Cafe Kinesi',
    description: 'お近くのカフェキネシインストラクターを見つけましょう。キネシオロジーやセラピーを教える経験豊富な認定インストラクターが全国にいます。',
    keywords: 'カフェキネシ, インストラクター, 講師, キネシオロジー, セラピー, 認定講師',
    openGraph: {
      title: 'インストラクターを探す | Cafe Kinesi',
      description: 'お近くのカフェキネシインストラクターを見つけましょう。',
      images: ['/og-image.jpg'],
    },
  }
}

// ISR設定（30分ごとに再生成）
export const revalidate = 1800

export default async function InstructorPage() {
  const instructors = await getInstructors()

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="relative">
        {/* ヒーローセクション */}
        <InstructorHeroSection />

        {/* カフェキネシインストラクターとは */}
        <InstructorAboutSection />

        {/* 提供サービス */}
        <InstructorServicesSection />

        {/* 都道府県から探す */}
        <InstructorMapSection instructors={instructors} />
      </main>
      <SocialLinks />
      <Footer />
    </div>
  )
}
