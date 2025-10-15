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

  // Schema.org Person
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    url: authorUrl,
    ...(author.image && {
      image: urlFor(author.image).width(400).height(400).url()
    }),
    ...(author.bio && {
      description: author.bio
    })
  }

  // Schema.org ProfilePage
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
      ...(author.bio && {
        description: author.bio
      })
    }
  }

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
