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

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-12">ブログ</h1>

      {posts.length === 0 ? (
        <p className="text-gray-600">まだブログ記事がありません。</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post._id} className="group">
              <Link href={`/blog/${post.slug.current}`}>
                {post.mainImage && (
                  <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
                    <SanityImage
                      image={post.mainImage}
                      alt={post.title}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <h2 className="text-2xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
                )}
                {post.publishedAt && (
                  <time className="text-sm text-gray-500 mt-2 block">
                    {new Date(post.publishedAt).toLocaleDateString('ja-JP')}
                  </time>
                )}
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

// export const revalidate = 60 // 上部で定義済み