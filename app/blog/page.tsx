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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* ヒーローセクション */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-8 py-20">
            <h1 className="text-5xl font-light tracking-tight text-gray-900 mb-4">Blog</h1>
            <p className="text-lg text-gray-600 font-light">カフェキネシの最新情報とストーリー</p>
          </div>
        </div>

        {/* ブログ記事グリッド */}
        <div className="max-w-7xl mx-auto px-8 py-16">
          {posts.length === 0 ? (
            <p className="text-gray-500 text-center py-12">まだブログ記事がありません。</p>
          ) : (
            <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article key={post._id} className="group">
                  <Link href={`/blog/${post.slug.current}`} className="block focus:outline-none">
                    {/* 画像 - 縦長の比率 */}
                    {post.mainImage && (
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-6">
                        <SanityImage
                          image={post.mainImage}
                          alt={post.title}
                          width={400}
                          height={533}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      </div>
                    )}

                    {/* テキストコンテンツ */}
                    <div className="space-y-3">
                      {/* 日付 */}
                      {post.publishedAt && (
                        <time className="text-xs tracking-wider text-gray-500 uppercase">
                          {new Date(post.publishedAt).toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                      )}

                      {/* タイトル */}
                      <h2 className="text-xl font-light text-gray-900 leading-tight group-hover:text-gray-600 transition-colors duration-300">
                        {post.title}
                      </h2>

                      {/* 説明文 */}
                      {post.excerpt && (
                        <p className="text-sm text-gray-600 font-light leading-relaxed line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}

                      {/* Read More リンク */}
                      <span className="inline-block text-xs tracking-wider text-gray-900 uppercase mt-4 group-hover:text-gray-600 transition-colors duration-300">
                        続きを読む →
                      </span>
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