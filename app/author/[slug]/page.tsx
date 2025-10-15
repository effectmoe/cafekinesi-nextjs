import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import { publicClient, previewClient } from '@/lib/sanity.client'
import { draftMode } from 'next/headers'
import { groq } from 'next-sanity'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { urlFor } from '@/lib/sanity.client'

interface PageProps {
  params: Promise<{ slug: string }>
}

// 著者情報を取得するクエリ
const AUTHOR_QUERY = groq`*[_type == "author" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  image,
  bio,
  bioLong,
  specialties,
  location,
  socialLinks,
  faq[] {
    question,
    answer
  },
  "posts": *[_type == "blogPost" && references(^._id)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    category,
    tags
  }
}`

// 著者データを取得
async function getAuthor(slug: string) {
  try {
    const draft = await draftMode()
    const isPreview = draft.isEnabled
    const selectedClient = isPreview ? previewClient : publicClient

    const author = await selectedClient.fetch(
      AUTHOR_QUERY,
      { slug },
      {
        cache: isPreview ? 'no-store' : 'force-cache'
      } as any
    )

    return author
  } catch (error) {
    console.error('Failed to fetch author:', error)
    return null
  }
}

// メタデータ生成
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const author = await getAuthor(slug)

  if (!author) {
    return {
      title: '著者が見つかりません | Cafe Kinesi',
      description: '指定された著者は見つかりませんでした。'
    }
  }

  const postCount = author.posts?.length || 0

  return {
    title: `${author.name} - 著者プロフィール | Cafe Kinesi Blog`,
    description: author.bio || `${author.name}が執筆した記事（${postCount}件）を掲載しています。`,
    openGraph: {
      title: `${author.name} - 著者プロフィール | Cafe Kinesi Blog`,
      description: author.bio || `${author.name}が執筆した記事を掲載しています。`,
      images: author.image ? [urlFor(author.image).width(1200).height(630).url()] : [],
    },
  }
}

// ページコンポーネント
export default async function AuthorPage({ params }: PageProps) {
  const { slug } = await params
  const author = await getAuthor(slug)

  if (!author) {
    notFound()
  }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cafekinesi.com'
  const authorUrl = `${siteUrl}/author/${slug}`

  // SNSリンクの配列を生成
  const sameAsLinks = author.socialLinks ?
    Object.values(author.socialLinks).filter((link): link is string => typeof link === 'string' && link.length > 0) : []

  // Schema.org Person（拡張版）
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    url: authorUrl,
    ...(author.image && {
      image: urlFor(author.image).width(400).height(400).url()
    }),
    ...((author.bioLong || author.bio) && {
      description: author.bioLong || author.bio
    }),
    ...(author.specialties && author.specialties.length > 0 && {
      knowsAbout: author.specialties
    }),
    ...(sameAsLinks.length > 0 && {
      sameAs: sameAsLinks
    }),
    ...(author.location && {
      homeLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressRegion: author.location
        }
      }
    }),
    affiliation: {
      '@type': 'Organization',
      name: 'Cafe Kinesi'
    }
  }

  // Schema.org ProfilePage（拡張版）
  const profilePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: author.name,
      url: authorUrl,
      ...(author.image && {
        image: urlFor(author.image).width(400).height(400).url()
      }),
      ...((author.bioLong || author.bio) && {
        description: author.bioLong || author.bio
      }),
      ...(author.specialties && author.specialties.length > 0 && {
        knowsAbout: author.specialties
      }),
      ...(sameAsLinks.length > 0 && {
        sameAs: sameAsLinks
      }),
      affiliation: {
        '@type': 'Organization',
        name: 'Cafe Kinesi'
      }
    }
  }

  // Schema.org FAQPage（FAQがある場合のみ）
  const faqPageSchema = author.faq && author.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    url: authorUrl,
    mainEntity: author.faq.map((item: any) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  } : null

  // BreadcrumbList Schema.org
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'ホーム',
        item: siteUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'ブログ',
        item: `${siteUrl}/blog`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: author.name,
        item: authorUrl
      }
    ]
  }

  // 画像URL生成
  function getImageUrl(imageAsset: any, width: number = 800, height: number = 600): string {
    if (!imageAsset) return '/images/blog-1.webp'

    try {
      return urlFor(imageAsset)
        .width(width)
        .height(height)
        .quality(80)
        .format('webp')
        .url()
    } catch (error) {
      console.error('Failed to generate image URL:', error)
      return imageAsset?.asset?.url || '/images/blog-1.webp'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org JSON-LD */}
      <Script
        id="person-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema, null, 2)
        }}
      />
      <Script
        id="profile-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(profilePageSchema, null, 2)
        }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema, null, 2)
        }}
      />
      {faqPageSchema && (
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqPageSchema, null, 2)
          }}
        />
      )}

      <Header />

      <main className="pt-20">
        {/* パンくずナビゲーション */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-[#8B5A3C] transition-colors">
              ホーム
            </Link>
            <span className="mx-2">&gt;</span>
            <Link href="/blog" className="hover:text-[#8B5A3C] transition-colors">
              ブログ
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-900 font-medium">{author.name}</span>
          </nav>
        </div>

        {/* 著者プロフィールセクション */}
        <section className="bg-white border-b border-gray-200 py-12 sm:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
              {/* 著者画像 */}
              {author.image && (
                <div className="flex-shrink-0">
                  <img
                    src={getImageUrl(author.image, 200, 200)}
                    alt={author.name}
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-gray-100 shadow-lg"
                  />
                </div>
              )}

              {/* 著者情報 */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4">
                  {author.name}
                </h1>
                {author.bio && (
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    {author.bio}
                  </p>
                )}
                <div className="flex items-center justify-center sm:justify-start gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-medium">{author.posts?.length || 0}件の記事</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* プロフィール詳細セクション */}
        {author.bioLong && (
          <section className="py-12 sm:py-16 bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl sm:text-3xl font-light text-gray-900 mb-8">
                プロフィール
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {author.bioLong}
                </p>
              </div>

              {/* 専門分野 */}
              {author.specialties && author.specialties.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">専門分野</h3>
                  <div className="flex flex-wrap gap-2">
                    {author.specialties.map((specialty: string, i: number) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-[#8B5A3C] text-white rounded-full text-sm font-medium"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 活動拠点 */}
              {author.location && (
                <div className="mt-6 flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>活動拠点: {author.location}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* SNS・外部リンクセクション */}
        {author.socialLinks && Object.values(author.socialLinks).some((link: any) => link) && (
          <section className="py-12 sm:py-16 border-t border-gray-200">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl sm:text-3xl font-light text-gray-900 mb-8">
                SNS・ウェブサイト
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {author.socialLinks.website && (
                  <a
                    href={author.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-[#8B5A3C] transition-all duration-200 group"
                  >
                    <svg className="w-6 h-6 text-gray-600 group-hover:text-[#8B5A3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <span className="text-gray-700 group-hover:text-[#8B5A3C] font-medium">公式サイト</span>
                  </a>
                )}
                {author.socialLinks.facebook && (
                  <a
                    href={author.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-[#1877F2] transition-all duration-200 group"
                  >
                    <svg className="w-6 h-6 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="text-gray-700 group-hover:text-[#1877F2] font-medium">Facebook</span>
                  </a>
                )}
                {author.socialLinks.instagram && (
                  <a
                    href={author.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-[#E4405F] transition-all duration-200 group"
                  >
                    <svg className="w-6 h-6 text-[#E4405F]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span className="text-gray-700 group-hover:text-[#E4405F] font-medium">Instagram</span>
                  </a>
                )}
                {author.socialLinks.twitter && (
                  <a
                    href={author.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-[#000000] transition-all duration-200 group"
                  >
                    <svg className="w-6 h-6 text-[#000000]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span className="text-gray-700 group-hover:text-[#000000] font-medium">X (Twitter)</span>
                  </a>
                )}
                {author.socialLinks.youtube && (
                  <a
                    href={author.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-[#FF0000] transition-all duration-200 group"
                  >
                    <svg className="w-6 h-6 text-[#FF0000]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <span className="text-gray-700 group-hover:text-[#FF0000] font-medium">YouTube</span>
                  </a>
                )}
              </div>
            </div>
          </section>
        )}

        {/* FAQセクション */}
        {author.faq && author.faq.length > 0 && (
          <section className="py-12 sm:py-16 bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl sm:text-3xl font-light text-gray-900 mb-8">
                よくある質問
              </h2>
              <dl className="space-y-8">
                {author.faq.map((item: any, i: number) => (
                  <div key={i} className="border-b border-gray-200 pb-8 last:border-b-0">
                    <dt className="text-xl font-semibold text-gray-900 mb-3 flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-[#8B5A3C] text-white rounded-full flex items-center justify-center text-sm font-bold">
                        Q
                      </span>
                      <span className="pt-1">{item.question}</span>
                    </dt>
                    <dd className="text-gray-700 pl-11 leading-relaxed whitespace-pre-wrap">
                      {item.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        )}

        {/* 著者の記事一覧 */}
        <section className="py-12 sm:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-light text-gray-900 mb-8">
              {author.name}の記事
            </h2>

            {author.posts && author.posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {author.posts.map((post: any) => (
                  <Link
                    key={post._id}
                    href={`/blog/${post.slug?.current}`}
                    className="block group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
                  >
                    {/* 記事画像 */}
                    {post.mainImage && (
                      <div className="aspect-[16/9] relative overflow-hidden bg-gray-100">
                        <img
                          src={getImageUrl(post.mainImage, 600, 400)}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    )}

                    {/* 記事情報 */}
                    <div className="p-6">
                      {/* カテゴリーとタグ */}
                      {(post.category || (post.tags && post.tags.length > 0)) && (
                        <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                          {post.category && (
                            <span className="px-2 py-1 bg-gray-100 rounded">
                              {post.category}
                            </span>
                          )}
                        </div>
                      )}

                      {/* タイトル */}
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#8B5A3C] transition-colors">
                        {post.title}
                      </h3>

                      {/* 抜粋 */}
                      {post.excerpt && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                          {post.excerpt}
                        </p>
                      )}

                      {/* 公開日 */}
                      <time className="text-xs text-gray-500" dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">まだ記事が投稿されていません。</p>
              </div>
            )}
          </div>
        </section>

        {/* ブログ一覧に戻る */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm tracking-wider text-gray-600 uppercase hover:text-gray-900 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              ブログ一覧に戻る
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
