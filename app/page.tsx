import BlogCard from '@/components/BlogCard'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialLinks from '@/components/SocialLinks'
import AboutSection from '@/components/AboutSection'
import { ChatSectionWrapper } from '@/components/ChatSectionWrapper'
import { sanityFetch, urlForImage } from '@/lib/sanity.fetch'
import { HOMEPAGE_QUERY, RECENT_POSTS_QUERY, ABOUT_PAGE_QUERY, FAQ_CARDS_QUERY, CHAT_MODAL_QUERY } from '@/lib/queries'
import { Homepage, Post } from '@/types/homepage.types'
import { AboutPage } from '@/lib/types/about'
import { FAQCard, ChatModalSettings } from '@/types/chat.types'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import type { Metadata } from 'next'

async function getAboutPageData(): Promise<AboutPage | null> {
  try {
    const draft = await draftMode()
    const isPreview = draft.isEnabled

    const data = await sanityFetch<AboutPage>({
      query: ABOUT_PAGE_QUERY,
      preview: isPreview,
      tags: ['aboutPage']
    })
    return data
  } catch (error) {
    console.error('Failed to fetch About page data:', error)
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cafekinesi-nextjs.vercel.app'

  try {
    const homepage = await sanityFetch<Homepage>({
      query: HOMEPAGE_QUERY,
      tags: ['homepage'],
    })

    // Sanityから取得したデータまたはデフォルト値
    const title = homepage?.seo?.title || homepage?.title || 'Cafe Kinesi - カフェキネシオロジー | 心と身体を整えるヒーリングスクール'
    const description = homepage?.seo?.description || 'カフェキネシオロジーは、誰でも気軽に学べるヒーリング技術です。キネシオロジーの基礎から応用まで、段階的に学べる講座を全国で開講中。初心者から上級者まで、あなたのペースで心と身体を整える技術を習得できます。'
    const keywords = homepage?.seo?.keywords || 'カフェキネシオロジー, キネシオロジー, ヒーリング, スクール, 講座, セラピー, 心と身体, アロマ, 認定資格, 初心者歓迎'

    // OGP画像（Sanityにあれば使用、なければデフォルト）
    const ogImage = homepage?.seo?.ogImage
      ? urlForImage(homepage.seo.ogImage)?.width(1200).height(630).url()
      : `${baseUrl}/og-image.jpg`

    return {
      title,
      description,
      keywords,
      authors: [{ name: 'Cafe Kinesi' }],
      creator: 'Cafe Kinesi',
      publisher: 'Cafe Kinesi',
      openGraph: {
        type: 'website',
        locale: 'ja_JP',
        url: baseUrl,
        siteName: 'Cafe Kinesi',
        title,
        description,
        images: [
          {
            url: ogImage || `${baseUrl}/og-image.jpg`,
            width: 1200,
            height: 630,
            alt: 'Cafe Kinesi - カフェキネシオロジー',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImage || `${baseUrl}/og-image.jpg`],
        creator: '@cafekinesi',
        site: '@cafekinesi',
      },
      alternates: {
        canonical: baseUrl,
      },
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
      verification: {
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      },
    }
  } catch (error) {
    console.error('Error generating homepage metadata:', error)

    // エラー時のフォールバック
    return {
      title: 'Cafe Kinesi - カフェキネシオロジー | 心と身体を整えるヒーリングスクール',
      description: 'カフェキネシオロジーは、誰でも気軽に学べるヒーリング技術です。キネシオロジーの基礎から応用まで、段階的に学べる講座を全国で開講中。',
      keywords: 'カフェキネシオロジー, キネシオロジー, ヒーリング, スクール',
      alternates: {
        canonical: baseUrl,
      },
    }
  }
}

// ISR設定: 1時間ごとに再生成（3600秒）
// TOPページは高トラフィックのため、適切なキャッシュ戦略でパフォーマンス向上
export const revalidate = 3600

export default async function HomePage() {
  const draft = await draftMode()
  const isPreview = draft.isEnabled

  try {
    // Sanityからホームページデータ取得
    const homepage = await sanityFetch<Homepage>({
      query: HOMEPAGE_QUERY,
      preview: isPreview,
      tags: ['homepage'],
    })

    if (!homepage) {
      console.error('Homepage data not found')
      // フォールバック用の静的コンテンツを表示
      return (
        <div className="min-h-screen bg-white">
          <Header />
          <main className="relative">
            <div className="w-full max-w-screen-xl mx-auto px-6 py-12">
              <div className="text-center">
                <h1 className="text-2xl font-medium mb-4">Cafe Kinesi</h1>
                <p className="text-gray-600">ホームページ設定が見つかりません。Sanity Studioでデータを作成してください。</p>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      )
    }

    // ブログ記事取得
    const posts = await sanityFetch<Post[]>({
      query: RECENT_POSTS_QUERY,
      params: { limit: homepage.blogSection?.numberOfPosts || 3 },
      preview: isPreview,
      tags: ['post'],
    })

    // Aboutページデータ取得
    const aboutPage = await getAboutPageData()
    console.log('[HomePage] About page data:', {
      exists: !!aboutPage,
      isActive: aboutPage?.isActive,
      title: aboutPage?.title,
      sectionsCount: aboutPage?.sections?.length
    })

    // FAQ質問カード取得
    const faqCards = await sanityFetch<FAQCard[]>({
      query: FAQ_CARDS_QUERY,
      preview: isPreview,
      tags: ['faqCard']
    })

    // チャットモーダル設定取得
    const chatSettings = await sanityFetch<ChatModalSettings>({
      query: CHAT_MODAL_QUERY,
      preview: isPreview,
      tags: ['chatModal']
    })

    // アクティブなナビゲーションメニュー項目のみフィルタリング
    const activeNavigationItems = homepage.navigationMenu?.filter(item => item.isActive).sort((a, b) => a.order - b.order) || []

    // Schema.org構造化データ生成
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cafekinesi-nextjs.vercel.app'

    // WebSite schema（サイト全体の情報）
    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      url: baseUrl,
      name: 'Cafe Kinesi - カフェキネシオロジー',
      description: 'カフェキネシオロジーは、誰でも気軽に学べるヒーリング技術です。キネシオロジーの基礎から応用まで、段階的に学べる講座を全国で開講中。',
      inLanguage: 'ja',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${baseUrl}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
      publisher: {
        '@id': `${baseUrl}/#organization`,
      },
    }

    // Organization schema（組織情報）
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: 'Cafe Kinesi',
      legalName: 'カフェキネシオロジー',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
        width: 512,
        height: 512,
      },
      description: 'カフェキネシオロジーは、心と身体を整えるヒーリング技術を提供するスクールです。初心者から上級者まで、誰でも気軽に学べる講座を全国で開講しています。',
      foundingDate: '2015',
      sameAs: [
        'https://www.facebook.com/cafekinesi',
        'https://www.instagram.com/cafekinesi',
        'https://twitter.com/cafekinesi',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: ['Japanese'],
      },
    }

    return (
      <>
        {/* Schema.org JSON-LD */}
        <Script
          id="schema-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <Script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        <div className="min-h-screen bg-white">
          <Header navigationItems={activeNavigationItems} headerIcons={homepage.headerIcons} />
          <main className="relative">
            {/* カテゴリーカードグリッド - 既存のデザインを完全維持 */}
            <div className="w-full max-w-screen-xl mx-auto px-6 py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {homepage.categoryCards?.map((card, index) => {
                  // Sanityの画像を使用、ない場合はローカル画像にフォールバック
                  const fallbackImageMap: { [key: string]: string } = {
                    'カフェキネシについて': '/images/about.webp',
                    'スクール': '/images/school.webp',
                    'インストラクター': '/images/instructor.webp',
                    'ブログ': '/images/blog.webp',
                    'アロマ購入': '/images/aroma.webp',
                    'メンバー': '/images/member.webp'
                  }

                  // Sanityの画像があれば使用、なければフォールバック
                  const imageSrc = card.image
                    ? urlForImage(card.image)?.url() || fallbackImageMap[card.titleJa] || '/images/placeholder.svg'
                    : fallbackImageMap[card.titleJa] || '/images/placeholder.svg'

                  // リンク先を決定
                  const linkHref = card.titleJa === 'カフェキネシについて' ? '#about-section' : card.link

                  // 外部リンクかどうかを判定
                  const isExternalLink = linkHref?.startsWith('http://') || linkHref?.startsWith('https://')

                  const cardContent = (
                    <div className={`album-card ${card.colorScheme} p-8 rounded-none aspect-square`}>
                      <div className="aspect-square relative mb-6 pointer-events-none">
                        <Image
                          alt={card.image?.alt || card.titleJa || ''}
                          src={imageSrc}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="space-y-1 pointer-events-none">
                        <h3 className="album-title">{card.titleJa || ''}</h3>
                        <p className="album-title opacity-80">{card.titleEn || ''}</p>
                      </div>
                    </div>
                  )

                  return card.isActive !== false ? (
                    isExternalLink ? (
                      <a
                        key={index}
                        className="album-link"
                        href={linkHref}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {cardContent}
                      </a>
                    ) : (
                      <Link
                        key={index}
                        className="album-link"
                        href={linkHref || '#'}
                      >
                        {cardContent}
                      </Link>
                    )
                  ) : (
                    <div key={index} className={`album-card ${card.colorScheme} p-8 rounded-none aspect-square`}>
                      <div className="aspect-square relative mb-6">
                        <Image
                          alt={card.image?.alt || card.titleJa || ''}
                          src={imageSrc}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="space-y-1">
                        <h3 className="album-title">{card.titleJa || ''}</h3>
                        <p className="album-title opacity-80">{card.titleEn || ''}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* View Allボタン - 既存デザイン維持 */}
              {homepage.viewAllButton?.show && (
                <div className="flex justify-center mt-12">
                  <button className="view-all-button">
                    {homepage.viewAllButton.text}
                  </button>
                </div>
              )}
            </div>


            {/* FAQ & Chat Section - 統合コンポーネント */}
            <ChatSectionWrapper
              faqCards={faqCards}
              chatSettings={chatSettings}
            />

            {/* About Section - カフェキネシについて */}
            {aboutPage && aboutPage.isActive ? (
              <AboutSection aboutData={aboutPage} />
            ) : (
              <section id="about-section" className="w-full max-w-screen-xl mx-auto px-6 py-16">
                <div className="text-center py-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">カフェキネシについて</h2>
                  <p className="text-gray-600 mb-4">
                    Aboutページのデータを読み込んでいます...
                  </p>
                  <p className="text-sm text-gray-500">
                    データ取得状態: {aboutPage ? 'データあり' : 'データなし'} /
                    有効化: {aboutPage?.isActive ? 'ON' : 'OFF'}
                  </p>
                </div>
              </section>
            )}

            {/* ブログセクション - 既存のデザインを完全維持 */}
            {homepage.blogSection?.showLatestPosts && (
              <section className="w-full max-w-screen-xl mx-auto px-6 py-16">
                <div className="text-center mb-12">
                  <h2 className="font-noto-serif text-sm font-medium text-[hsl(var(--text-primary))] tracking-[0.2em] uppercase mb-2">
                    {homepage.blogSection?.title || '最新の記事'}
                  </h2>
                  <div className="w-12 h-px bg-[hsl(var(--border))] mx-auto"></div>
                </div>

                {posts?.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {posts.map((post) => (
                        <BlogCard
                          key={post._id}
                          image={urlForImage(post.mainImage)?.url() || '/images/blog-1.webp'}
                          title={post.title}
                          excerpt={post.excerpt}
                          date={new Date(post.publishedAt).toLocaleDateString('ja-JP')}
                          author={post.author}
                          slug={post.slug}
                        />
                      ))}
                    </div>

                    <div className="text-center mt-12">
                      <p className="text-sm text-[hsl(var(--text-secondary))] mb-4">
                        ※ 最新の{homepage.blogSection.numberOfPosts}件を表示しています
                      </p>
                      <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-[hsl(var(--text-primary))] border border-[hsl(var(--border))] rounded-full hover:bg-[hsl(var(--background-secondary))] transition-colors"
                      >
                        すべての記事を見る
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-[hsl(var(--text-secondary))]">
                      記事がまだありません
                    </p>
                  </div>
                )}
              </section>
            )}
          </main>
          <SocialLinks />
          <Footer />
        </div>
      </>
    )
  } catch (error) {
    console.error('Error loading homepage:', error)
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="relative">
          <div className="w-full max-w-screen-xl mx-auto px-6 py-12">
            <div className="text-center">
              <h1 className="text-2xl font-medium mb-4">Cafe Kinesi</h1>
              <p className="text-gray-600">データの読み込みに失敗しました。</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }
}