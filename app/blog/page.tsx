import { client, groq, urlFor, publicClient, previewClient } from '@/lib/sanity.client'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import type { BlogPost } from '@/types/sanity.types'

// 動的レンダリングを強制（Next.js 15ではこれだけで十分）
export const dynamic = 'force-dynamic'

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

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SiteSchemas from '@/components/SiteSchemas'

export default async function BlogPage() {
  const posts = await getPosts()

  // パンくずリストを生成
  const breadcrumbs = [
    { name: 'ホーム', url: '/' },
    { name: 'ブログ', url: '/blog' }
  ]

  return (
    <>
      {/* Schema.org構造化データ */}
      <SiteSchemas
        currentPage={{
          title: 'ブログ一覧 - Cafe Kinesi',
          url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://cafekinesi-nextjs.vercel.app'}/blog`,
          breadcrumbs
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

// export const revalidate = 60 // 上部で定義済み