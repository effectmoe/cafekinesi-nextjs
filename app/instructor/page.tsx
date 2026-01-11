import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import Script from 'next/script'
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

// Helper to safely get prefecture properties
function getPrefectureSlug(prefecture: Instructor['prefecture']): string | undefined {
  if (typeof prefecture === 'object' && prefecture !== null) {
    return prefecture.slug?.current
  }
  return undefined
}

function getPrefectureName(prefecture: Instructor['prefecture']): string | undefined {
  if (typeof prefecture === 'object' && prefecture !== null) {
    return prefecture.name
  }
  return typeof prefecture === 'string' ? prefecture : undefined
}

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

    console.log('[InstructorPage] Draft mode:', isPreview)
    console.log('[InstructorPage] Using client:', isPreview ? 'previewClient' : 'publicClient')

    const data = await selectedClient.fetch(INSTRUCTOR_PAGE_QUERY, {}, {
      cache: isPreview ? 'no-store' : 'force-cache'
    } as any)

    console.log('[InstructorPage] Fetched data:', {
      hasData: !!data,
      title: data?.title,
      heroTitle: data?.heroSection?.title,
      isDraft: isPreview
    })

    return data || null
  } catch (error) {
    console.error('Failed to fetch instructor page data:', error)
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getInstructorPageData()
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cafekinesi.com'
  const pageUrl = `${baseUrl}/instructor`

  const title = pageData?.seo?.title || 'インストラクターを探す | Cafe Kinesi'
  const description = pageData?.seo?.description || 'お近くのカフェキネシインストラクターを見つけましょう。キネシオロジーやセラピーを教える経験豊富な認定インストラクターが全国にいます。'
  const keywords = pageData?.seo?.keywords || 'カフェキネシ, インストラクター, 講師, キネシオロジー, セラピー, 認定講師, 全国, 地域別'
  const ogImageUrl = pageData?.seo?.ogImage?.asset?.url || `${baseUrl}/og-image.jpg`

  // Sanityからデータがある場合はそれを使用、なければデフォルト値
  return {
    title,
    description,
    keywords,

    // SEOメタデータ
    authors: [{ name: 'Cafe Kinesi' }],
    creator: 'Cafe Kinesi',
    publisher: 'Cafe Kinesi',

    // Open Graph (OGP)
    openGraph: {
      type: 'website',
      locale: 'ja_JP',
      url: pageUrl,
      siteName: 'Cafe Kinesi',
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      creator: '@cafekinesi',
      site: '@cafekinesi',
    },

    // Canonical URL（重複コンテンツ対策）
    alternates: {
      canonical: pageUrl,
    },

    // robots制御（検索エンジン向け指示）
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

// ISR設定（30分ごとに再生成）
export const revalidate = 1800

export default async function InstructorPage() {
  const instructors = await getInstructors()
  const pageData = await getInstructorPageData()
  const draft = await draftMode()
  const isPreview = draft.isEnabled

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cafekinesi.com'
  const pageUrl = `${baseUrl}/instructor`

  // 1. BreadcrumbList Schema（パンくずナビゲーション）
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'ホーム',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'インストラクターを探す',
        item: pageUrl,
      },
    ],
  }

  // 2. CollectionPage Schema（ページタイプの明示）
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${pageUrl}#collectionpage`,
    url: pageUrl,
    name: pageData?.seo?.title || 'インストラクターを探す | Cafe Kinesi',
    description: pageData?.seo?.description || 'お近くのカフェキネシインストラクターを見つけましょう。',
    inLanguage: 'ja-JP',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${baseUrl}#website`,
      url: baseUrl,
      name: 'Cafe Kinesi',
    },
    about: {
      '@type': 'Thing',
      name: 'キネシオロジーインストラクター',
      description: 'キネシオロジーやセラピーを教える認定インストラクター',
    },
  }

  // 3. ItemList Schema（インストラクターのリスト構造化）
  const itemListSchema = instructors && instructors.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: instructors.length,
    itemListElement: instructors.map((instructor: Instructor, index: number) => {
      const prefSlug = getPrefectureSlug(instructor.prefecture)
      const prefName = getPrefectureName(instructor.prefecture)
      return {
        '@type': 'ListItem',
        position: index + 1,
        url: `${baseUrl}/instructor/${prefSlug}/${instructor.slug?.current}`,
        name: instructor.name,
        item: {
          '@type': 'Person',
          '@id': `${baseUrl}/instructor/${prefSlug}/${instructor.slug?.current}#person`,
          name: instructor.name,
          description: instructor.description || instructor.name,
          jobTitle: 'キネシオロジーインストラクター',
          url: `${baseUrl}/instructor/${prefSlug}/${instructor.slug?.current}`,
          ...(instructor.email && { email: instructor.email }),
          ...(instructor.phone && { telephone: instructor.phone }),
          address: prefName ? {
            '@type': 'PostalAddress',
            addressRegion: prefName,
            addressCountry: 'JP',
          } : undefined,
        affiliation: {
          '@type': 'Organization',
          name: 'Cafe Kinesi',
          url: baseUrl,
        },
      },
    }}),
  } : null

  return (
    <div className="min-h-screen bg-white">
      {/* Schema.org JSON-LD (BreadcrumbList) */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />

      {/* Schema.org JSON-LD (CollectionPage) */}
      <Script
        id="collectionpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageSchema)
        }}
      />

      {/* Schema.org JSON-LD (ItemList) */}
      {itemListSchema && (
        <Script
          id="itemlist-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(itemListSchema)
          }}
        />
      )}

      {/* Draft Mode インジケーター */}
      {isPreview && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-400 text-black px-4 py-2 text-center font-bold flex items-center justify-center gap-4">
          <span>🔍 プレビューモード - ドラフトの変更を表示中</span>
          <a
            href="/api/draft-disable"
            className="bg-black text-yellow-400 px-3 py-1 rounded text-sm hover:bg-gray-800 transition-colors"
          >
            終了
          </a>
        </div>
      )}
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
