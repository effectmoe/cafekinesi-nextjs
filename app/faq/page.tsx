import { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialLinks from '@/components/SocialLinks'
import { publicClient } from '@/lib/sanity.client'
import { FAQ_LIST_QUERY } from '@/lib/queries'
import { FAQWithCategory } from '@/lib/types/faq'

// ISR設定（30分ごとに再生成）
export const revalidate = 1800

// FAQデータを取得
async function getFAQs(): Promise<FAQWithCategory[]> {
  try {
    const faqs = await publicClient.fetch<FAQWithCategory[]>(FAQ_LIST_QUERY, {}, {
      cache: 'force-cache',
    } as any)
    // カテゴリー情報が正しくpopulateされているFAQのみを返す
    return faqs.filter(faq => faq.category && faq.category.title) || []
  } catch (error) {
    console.error('Failed to fetch FAQs:', error)
    return []
  }
}

// リンクパーサー関数：[[text|/path]] を Next.js Link に変換
function parseAnswerLinks(answer: string): (string | JSX.Element)[] {
  const linkPattern = /\[\[([^\]|]+)\|([^\]]+)\]\]/g
  const parts: (string | JSX.Element)[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let linkIndex = 0

  while ((match = linkPattern.exec(answer)) !== null) {
    // リンク前のテキストを追加
    if (match.index > lastIndex) {
      parts.push(answer.substring(lastIndex, match.index))
    }

    // Link コンポーネントを追加
    const linkText = match[1]
    const linkPath = match[2]
    parts.push(
      <Link
        key={`link-${linkIndex}`}
        href={linkPath}
        className="text-[#8B5A3C] hover:text-[#6D4830] underline font-medium transition-colors"
      >
        {linkText}
      </Link>
    )

    lastIndex = match.index + match[0].length
    linkIndex++
  }

  // 残りのテキストを追加
  if (lastIndex < answer.length) {
    parts.push(answer.substring(lastIndex))
  }

  return parts.length > 0 ? parts : [answer]
}

// メタデータ生成
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cafekinesi.com'
  const pageUrl = `${baseUrl}/faq`

  const title = 'よくある質問（FAQ） | Cafe Kinesi'
  const description = 'カフェキネシに関するよくある質問をまとめました。キネシオロジー、講座、料金、申し込み方法など、50件以上のQ&Aで疑問を解決します。初めての方もお気軽にご覧ください。'
  const keywords = 'カフェキネシ, よくある質問, FAQ, キネシオロジー, 講座, 料金, 申し込み, 初心者, インストラクター, セッション'
  const ogImageUrl = `${baseUrl}/og-image.jpg`

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

export default async function FAQPage() {
  const faqs = await getFAQs()

  // カテゴリー一覧を取得（重複排除してorderでソート）
  const uniqueCategories = Array.from(
    new Map(faqs.map((faq) => [faq.category._id, faq.category])).values()
  ).sort((a, b) => a.order - b.order)

  const categories = uniqueCategories.map((cat) => ({
    id: cat._id,
    slug: cat.slug.current,
    title: cat.title,
    order: cat.order,
  }))

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cafekinesi.com'
  const pageUrl = `${baseUrl}/faq`

  // 現在の日付（更新日時）
  const currentDate = new Date().toISOString()
  // 公開日（FAQページの初回公開日）
  const publishedDate = '2025-01-17T00:00:00+09:00'

  // BreadcrumbList Schema
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
        name: 'よくある質問',
        item: pageUrl,
      },
    ],
  }

  // WebPage Schema（ページタイプの明確化）
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: 'よくある質問（FAQ） | Cafe Kinesi',
    description: `カフェキネシに関するよくある質問をまとめました。キネシオロジー、講座、料金、申し込み方法など、${faqs.length}件のQ&Aで疑問を解決します。`,
    inLanguage: 'ja-JP',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${baseUrl}#website`,
      url: baseUrl,
      name: 'Cafe Kinesi',
    },
    datePublished: publishedDate,
    dateModified: currentDate,
    breadcrumb: {
      '@id': `${pageUrl}#breadcrumb`,
    },
    mainEntity: {
      '@id': `${pageUrl}#faqpage`,
    },
  }

  // FAQPage Schema（LLMO最適化）
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faqpage`,
    url: pageUrl,
    name: 'よくある質問（FAQ）',
    inLanguage: 'ja-JP',
    datePublished: publishedDate,
    dateModified: currentDate,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org JSON-LD (BreadcrumbList) */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* Schema.org JSON-LD (WebPage) */}
      <Script
        id="webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema),
        }}
      />

      {/* Schema.org JSON-LD (FAQPage) */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <Header />

      <main className="relative pt-20">
        {/* パンくずナビゲーション */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-[#8B5A3C] transition-colors">
              ホーム
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-900 font-medium">よくある質問</span>
          </nav>
        </div>

        {/* ページタイトル */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">
            よくある質問（FAQ）
          </h1>
          <p className="text-center text-gray-600 max-w-3xl mx-auto">
            カフェキネシに関するよくある質問をまとめました。
            <br />
            ご不明な点がございましたら、お気軽にお問い合わせください。
          </p>
        </div>

        {/* FAQ コンテンツ */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* カテゴリごとに表示 */}
          {categories.map((category) => (
            <div key={category.id} className="mb-12">
              {/* カテゴリタイトル */}
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-[#8B5A3C]">
                {category.title}
              </h2>

              {/* FAQアコーディオン */}
              <div className="space-y-4">
                {faqs
                  .filter((faq) => faq.category._id === category.id)
                  .map((faq) => (
                    <details
                      key={faq._id}
                      className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                    >
                      <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex items-start gap-4 flex-1">
                          <span className="flex-shrink-0 w-8 h-8 bg-[#8B5A3C] text-white rounded-full flex items-center justify-center text-sm font-bold">
                            Q
                          </span>
                          <h3 className="text-lg font-medium text-gray-900 flex-1 pr-4">
                            {faq.question}
                          </h3>
                        </div>
                        <svg
                          className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </summary>
                      <div className="px-6 pb-6 pt-4">
                        <div className="flex items-start gap-4 pl-12">
                          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {parseAnswerLinks(faq.answer)}
                          </div>
                        </div>
                      </div>
                    </details>
                  ))}
              </div>
            </div>
          ))}

          {/* FAQがない場合の表示 */}
          {faqs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">現在、FAQはありません。</p>
            </div>
          )}

          {/* 問い合わせ誘導 */}
          <div className="mt-16 bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              解決しない疑問がありますか？
            </h2>
            <p className="text-gray-600 mb-6">
              上記以外のご質問やご不明な点がございましたら、
              <br />
              お気軽にお問い合わせください。
            </p>
            <Link
              href="/#contact"
              className="inline-block bg-[#8B5A3C] text-white px-8 py-3 rounded-lg hover:bg-[#6D4830] transition-colors font-medium"
            >
              お問い合わせはこちら
            </Link>
          </div>
        </div>
      </main>

      <SocialLinks />
      <Footer />
    </div>
  )
}
