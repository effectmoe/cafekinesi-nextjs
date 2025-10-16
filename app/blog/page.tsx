import { client, groq, urlFor, publicClient, previewClient } from '@/lib/sanity.client'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import Script from 'next/script'
import type { BlogPost } from '@/types/sanity.types'
import type { Metadata } from 'next'

const POSTS_QUERY = groq`*[_type == "blogPost"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  mainImage,
  publishedAt,
  author-> {
    name,
    image
  }
}`

async function getPosts() {
  const draft = await draftMode()
  const isPreview = draft.isEnabled

  // プレビューモード時はpreviewClient、通常時はpublicClientを使用
  const selectedClient = isPreview ? previewClient : publicClient

  console.log(`Fetching posts, preview: ${isPreview}`)

  return selectedClient.fetch<BlogPost[]>(POSTS_QUERY)
}

// Metadata生成
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cafekinesi-nextjs.vercel.app'

  try {
    const posts = await publicClient.fetch<BlogPost[]>(POSTS_QUERY)
    const postCount = posts.length

    const title = 'ブログ | Cafe Kinesi - キネシオロジー・ヒーリングの最新情報'
    const description = `カフェキネシオロジーの公式ブログ。キネシオロジーやヒーリング、セラピーに関する最新情報、講座レポート、実践テクニックなど、${postCount}件以上の記事を掲載中。初心者から上級者まで役立つ情報をお届けします。`
    const keywords = 'カフェキネシオロジー, キネシオロジー, ヒーリング, セラピー, ブログ, 最新情報, 講座レポート, 実践テクニック'

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
        url: `${baseUrl}/blog`,
        siteName: 'Cafe Kinesi',
        title,
        description,
        images: [
          {
            url: `${baseUrl}/og-image-blog.jpg`,
            width: 1200,
            height: 630,
            alt: 'Cafe Kinesi Blog - キネシオロジー・ヒーリングの最新情報',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [`${baseUrl}/og-image-blog.jpg`],
        creator: '@cafekinesi',
        site: '@cafekinesi',
      },
      alternates: {
        canonical: `${baseUrl}/blog`,
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
    }
  } catch (error) {
    console.error('Error generating blog metadata:', error)

    // エラー時のフォールバック
    return {
      title: 'ブログ | Cafe Kinesi',
      description: 'カフェキネシオロジーの公式ブログ。キネシオロジーやヒーリングに関する最新情報をお届けします。',
      keywords: 'カフェキネシオロジー, キネシオロジー, ヒーリング, ブログ',
      alternates: {
        canonical: `${baseUrl}/blog`,
      },
    }
  }
}

// ISR設定: 10分ごとに再生成（600秒）
// ブログ一覧は更新頻度が高いため、TOPページより短い間隔
export const revalidate = 600

import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default async function BlogPage() {
  const posts = await getPosts()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cafekinesi-nextjs.vercel.app'

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
        name: 'ブログ',
        item: `${baseUrl}/blog`,
      },
    ],
  }

  // CollectionPage Schema（記事一覧ページとして）
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${baseUrl}/blog#collectionpage`,
    url: `${baseUrl}/blog`,
    name: 'ブログ | Cafe Kinesi',
    description: 'カフェキネシオロジーの公式ブログ。キネシオロジーやヒーリングに関する最新情報をお届けします。',
    inLanguage: 'ja',
    isPartOf: {
      '@id': `${baseUrl}/#website`,
    },
    about: {
      '@type': 'Thing',
      name: 'キネシオロジー',
    },
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
  }

  // ItemList Schema（記事のリスト）
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: posts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${baseUrl}/blog/${post.slug.current}`,
      name: post.title,
      item: {
        '@type': 'BlogPosting',
        '@id': `${baseUrl}/blog/${post.slug.current}#blogposting`,
        headline: post.title,
        description: post.excerpt,
        image: post.mainImage
          ? urlFor(post.mainImage).width(1200).height(630).url()
          : `${baseUrl}/og-image-blog.jpg`,
        datePublished: post.publishedAt,
        author: {
          '@type': 'Person',
          name: post.author?.name || 'Cafe Kinesi',
        },
      },
    })),
  }

  return (
    <>
      {/* Schema.org JSON-LD */}
      <Script
        id="schema-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <Script
        id="schema-collectionpage"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageSchema),
        }}
      />
      <Script
        id="schema-itemlist"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema),
        }}
      />

      <div className="min-h-screen bg-white flex flex-col">
        <Header />
      <main className="flex-grow">
        {/* シンプルなタイトル */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <h1 className="text-3xl font-light text-gray-900 tracking-wide">Blog</h1>
        </div>

        {/* ブログ記事グリッド - シンプルでクリーン */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {posts.length === 0 ? (
            <p className="text-gray-400 text-center py-20">まだブログ記事がありません。</p>
          ) : (
            <div className="grid gap-x-6 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <article key={post._id} className="group">
                  <Link href={`/blog/${post.slug.current}`} className="block focus:outline-none">
                    {/* 画像 - 横長のアスペクト比 */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-50 mb-5">
                      {post.mainImage ? (
                        <img
                          src={urlFor(post.mainImage)
                            .width(800)
                            .height(500)
                            .quality(85)
                            .format('webp')
                            .url()}
                          alt={post.title || ''}
                          loading={index < 3 ? 'eager' : 'lazy'}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-300 text-xs uppercase tracking-wider">No Image</span>
                        </div>
                      )}
                    </div>

                    {/* テキストコンテンツ - よりシンプルに */}
                    <div className="space-y-3">
                      {/* 日付 */}
                      {post.publishedAt && (
                        <time className="text-xs text-gray-400 uppercase tracking-wider">
                          {new Date(post.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </time>
                      )}

                      {/* タイトル */}
                      <h2 className="text-lg font-normal text-gray-900 leading-snug group-hover:text-gray-600 transition-colors duration-300">
                        {post.title}
                      </h2>

                      {/* 説明文 - より簡潔に */}
                      {post.excerpt && (
                        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}

                      {/* Read more リンク */}
                      <div className="pt-1">
                        <span className="text-xs uppercase tracking-wider text-gray-900 group-hover:text-gray-600 transition-colors duration-300">
                          Read More →
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
    </>
  )
}
