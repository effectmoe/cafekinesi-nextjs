import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import { draftMode } from 'next/headers'
import { publicClient, previewClient } from '@/lib/sanity.client'
import { PROFILE_PAGE_QUERY } from '@/lib/queries'
import { urlForImage } from '@/lib/sanity.fetch'
import type { ProfilePage } from '@/lib/types/profile'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialLinks from '@/components/SocialLinks'

// プロフィールページデータを取得
async function getProfilePageData(): Promise<ProfilePage | null> {
  try {
    const draft = await draftMode()
    const isPreview = draft.isEnabled
    const selectedClient = isPreview ? previewClient : publicClient

    console.log('[ProfilePage] Draft mode:', isPreview)

    const data = await selectedClient.fetch<ProfilePage>(
      PROFILE_PAGE_QUERY,
      {},
      {
        cache: isPreview ? 'no-store' : 'force-cache',
      } as any
    )

    console.log('[ProfilePage] Fetched data:', {
      hasData: !!data,
      title: data?.title,
    })

    return data || null
  } catch (error) {
    console.error('Failed to fetch profile page data:', error)
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const profilePage = await getProfilePageData()
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cafekinesi.com'
  const pageUrl = `${baseUrl}/profile`

  if (!profilePage) {
    return {
      title: 'プロフィール | Cafe Kinesi',
    }
  }

  const title = profilePage.seo?.title || `${profilePage.profileSection.name} - プロフィール | Cafe Kinesi`
  const description = profilePage.seo?.description || `カフェキネシ創始者 ${profilePage.profileSection.name} のプロフィールをご紹介します。キネシオロジーの第一人者として、全国で講座やセッションを提供しています。`
  const keywords = profilePage.seo?.keywords || `カフェキネシ, ${profilePage.profileSection.name}, プロフィール, キネシオロジー, 創始者, インストラクター`

  // プロフィール写真のURL
  const photoUrl = profilePage.profileSection.photo?.asset
    ? urlForImage(profilePage.profileSection.photo)?.width(1200).height(630).url()
    : `${baseUrl}/og-image.jpg`

  return {
    title,
    description,
    keywords,

    // SEOメタデータ
    authors: [{ name: profilePage.profileSection.name }],
    creator: profilePage.profileSection.name,
    publisher: 'Cafe Kinesi',

    // Open Graph (OGP) - Profileタイプ
    openGraph: {
      type: 'profile',
      locale: 'ja_JP',
      url: pageUrl,
      siteName: 'Cafe Kinesi',
      title,
      description,
      images: [
        {
          url: photoUrl || `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: profilePage.profileSection.name,
        },
      ],
      // Profile固有のプロパティ
      profile: {
        firstName: profilePage.profileSection.name.split(' ')[0] || profilePage.profileSection.name,
        lastName: profilePage.profileSection.name.split(' ').slice(1).join(' ') || '',
      },
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [photoUrl || `${baseUrl}/og-image.jpg`],
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

// ISR設定（30分ごとに再検証）
export const revalidate = 1800

export default async function ProfilePage() {
  const profilePage = await getProfilePageData()

  // データがない場合は404
  if (!profilePage || !profilePage.isActive) {
    notFound()
  }

  const draft = await draftMode()
  const isPreview = draft.isEnabled

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cafekinesi.com'
  const pageUrl = `${baseUrl}/profile`

  // プロフィール写真のURL取得
  const photoUrl = profilePage.profileSection.photo?.asset
    ? urlForImage(profilePage.profileSection.photo)?.width(400).height(500).url()
    : null

  // OG Image用の写真URL（1200x630）
  const photoUrlOg = profilePage.profileSection.photo?.asset
    ? urlForImage(profilePage.profileSection.photo)?.width(1200).height(630).url()
    : null

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
        name: profilePage.title,
        item: pageUrl,
      },
    ],
  }

  // 2. Person Schema（星ユカリさんの情報）
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${pageUrl}#person`,
    name: profilePage.profileSection.name,
    ...(profilePage.profileSection.nameReading && {
      alternateName: profilePage.profileSection.nameReading,
    }),
    jobTitle: 'カフェキネシ創始者・キネシオロジーインストラクター',
    description: `カフェキネシ創始者。キネシオロジーの第一人者として、全国で講座やセッションを提供。${profilePage.historyItems.length}年以上の経験を持つ。`,
    ...(photoUrlOg && {
      image: {
        '@type': 'ImageObject',
        url: photoUrlOg,
        width: 1200,
        height: 630,
      },
    }),
    ...(profilePage.profileSection.location && {
      address: {
        '@type': 'PostalAddress',
        addressLocality: profilePage.profileSection.location,
        addressCountry: 'JP',
      },
    }),
    affiliation: {
      '@type': 'Organization',
      name: 'Cafe Kinesi',
      url: baseUrl,
    },
    founder: {
      '@type': 'Organization',
      name: 'Cafe Kinesi',
      url: baseUrl,
    },
    url: pageUrl,
    sameAs: [
      baseUrl,
    ],
    knowsAbout: [
      'キネシオロジー',
      'タッチフォーヘルス',
      'ブレインジム',
      'ピーチタッチ',
      'ヒーリング',
      'セラピー',
    ],
  }

  // 3. ProfilePage Schema（ページタイプの明示）
  const profilePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${pageUrl}#profilepage`,
    url: pageUrl,
    name: profilePage.title,
    description: `カフェキネシ創始者 ${profilePage.profileSection.name} のプロフィールページ`,
    inLanguage: 'ja-JP',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${baseUrl}#website`,
      url: baseUrl,
      name: 'Cafe Kinesi',
    },
    mainEntity: {
      '@id': `${pageUrl}#person`,
    },
    about: {
      '@id': `${pageUrl}#person`,
    },
  }

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

      {/* Schema.org JSON-LD (Person) */}
      <Script
        id="person-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema)
        }}
      />

      {/* Schema.org JSON-LD (ProfilePage) */}
      <Script
        id="profilepage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(profilePageSchema)
        }}
      />
      {/* プレビューモード表示 */}
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

      <main className="relative pt-20">
        {/* パンくずナビゲーション */}
        <div className="max-w-screen-xl mx-auto px-6 py-4">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              ホーム
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-900">{profilePage.title}</span>
          </nav>
        </div>

        {/* ページタイトル */}
        <div className="max-w-screen-xl mx-auto px-6 py-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 text-center">
            {profilePage.title}
          </h1>
        </div>

        {/* メインコンテンツエリア */}
        <div className="max-w-screen-xl mx-auto px-6 pb-16">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* 左カラム - プロフィール情報 */}
            <div className="lg:col-span-4">
              <div className="sticky top-24">
                {/* プロフィール写真 */}
                {photoUrl && (
                  <div className="bg-pink-50 rounded-lg p-8 mb-6">
                    <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden">
                      <Image
                        src={photoUrl}
                        alt={profilePage.profileSection.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                    </div>
                  </div>
                )}

                {/* 名前と所在地 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {profilePage.profileSection.name}
                  </h2>
                  {profilePage.profileSection.nameReading && (
                    <p className="text-gray-600 mb-4">
                      （{profilePage.profileSection.nameReading}）
                    </p>
                  )}
                  {profilePage.profileSection.location && (
                    <p className="text-gray-700">
                      {profilePage.profileSection.location}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 右カラム - メインコンテンツ */}
            <div className="lg:col-span-8">
              {/* これまでの歩みセクション */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {profilePage.historyTitle}
                </h2>
                <div className="space-y-4">
                  {profilePage.historyItems.map((item, index) => (
                    <p key={index} className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {item.text}
                    </p>
                  ))}
                </div>
              </section>

              {/* 現在の活動セクション */}
              <section className="bg-gray-50 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {profilePage.activitiesTitle}
                </h2>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {profilePage.activitiesDescription}
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {profilePage.activitiesItems.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg">
                      <span className="text-gray-700 mt-1">•</span>
                      <p className="text-gray-700 flex-1">{item.title}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <SocialLinks />
      <Footer />
    </div>
  )
}
