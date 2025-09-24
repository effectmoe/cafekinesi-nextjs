import { client, groq } from '@/lib/sanity.client'
import Link from 'next/link'
import { SanityImage } from '@/components/SanityImage'
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
  return client.fetch<BlogPost[]>(POSTS_QUERY)
}

import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* ヒーローセクション - エディトリアルスタイル */}
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif tracking-tight text-gray-900">
              Journal
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-gray-600 font-light leading-relaxed max-w-3xl">
              カフェキネシの物語、アロマセラピー、そして日々の気づき
            </p>
          </div>
        </div>

        {/* ブログ記事グリッド - 洗練されたレイアウト */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          {posts.length === 0 ? (
            <p className="text-gray-500 text-center py-20 text-lg">まだブログ記事がありません。</p>
          ) : (
            <div className="grid gap-8 sm:gap-12 lg:gap-16 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article key={post._id} className="group cursor-pointer">
                  <Link href={`/blog/${post.slug.current}`} className="block focus:outline-none">
                    {/* 画像 - スクエア比率でモダンに */}
                    <div className="relative aspect-square overflow-hidden bg-gray-50 mb-6 rounded-sm">
                      {post.mainImage ? (
                        <SanityImage
                          image={post.mainImage}
                          alt={post.title}
                          width={600}
                          height={600}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-90"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50" />
                      )}
                    </div>

                    {/* テキストコンテンツ - ミニマルでエレガント */}
                    <div className="space-y-4">
                      {/* メタ情報 */}
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        {post.publishedAt && (
                          <time className="tracking-wide">
                            {new Date(post.publishedAt).toLocaleDateString('ja-JP', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                            }).replace(/\//g, '.')}
                          </time>
                        )}
                        {post.author?.name && (
                          <>
                            <span className="text-gray-400">/</span>
                            <span className="tracking-wide">{post.author.name}</span>
                          </>
                        )}
                      </div>

                      {/* タイトル */}
                      <h2 className="text-xl sm:text-2xl font-serif text-gray-900 leading-tight group-hover:text-gray-700 transition-colors duration-500">
                        {post.title}
                      </h2>

                      {/* 説明文 */}
                      {post.excerpt && (
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}

                      {/* リードモア */}
                      <div className="pt-2">
                        <span className="text-sm font-medium text-gray-900 border-b border-gray-900 pb-1 group-hover:border-gray-400 transition-colors duration-500">
                          Read Article
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
  )
}

// export const revalidate = 60 // 上部で定義済み