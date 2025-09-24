import { client, groq, urlFor } from '@/lib/sanity.client'

// 動的レンダリングを強制（Next.js 15ではこれだけで十分）
export const dynamic = 'force-dynamic'
import { SanityImage } from '@/components/SanityImage'
import { notFound } from 'next/navigation'
import type { BlogPost } from '@/types/sanity.types'
import { PortableText } from '@portabletext/react'

const POST_QUERY = groq`*[_type == "blogPost" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  excerpt,
  tldr,
  mainImage,
  content,
  keyPoint,
  summary,
  faq,
  category,
  tags,
  publishedAt,
  author-> {
    name,
    image,
    bio
  },
  seo {
    title,
    description,
    keywords,
    ogImage
  }
}`

const ALL_POSTS_QUERY = groq`*[_type == "blogPost"] {
  slug
}`

async function getPost(slug: string) {
  return client.fetch<BlogPost>(POST_QUERY, { slug })
}

async function getAllPosts() {
  return client.fetch<{ slug: { current: string } }[]>(ALL_POSTS_QUERY)
}

// generateStaticParamsを削除して完全に動的レンダリングに
// export async function generateStaticParams() {
//   const posts = await getAllPosts()
//   return posts.map((post) => ({
//     slug: post.slug.current,
//   }))
// }

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  // 関連記事を取得（エラーが発生しても継続）
  let relatedPosts = []
  try {
    relatedPosts = await client.fetch(
      `*[_type == "blogPost" && slug.current != $slug] | order(publishedAt desc) [0...3] {
        _id,
        title,
        slug,
        excerpt,
        mainImage {
          asset-> {
            url
          }
        },
        publishedAt,
        author-> {
          name
        }
      }`,
      { slug }
    )
  } catch (error) {
    console.error('Failed to fetch related posts:', error)
  }

  return (
    <article className="container mx-auto px-4 py-16 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        {post.publishedAt && (
          <time className="text-gray-600">
            {new Date(post.publishedAt).toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        )}

        {post.author && (
          <div className="flex items-center gap-4 mt-6">
            {post.author.image && (
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                <img
                  src={(() => {
                    try {
                      return urlFor(post.author.image)
                        .width(48)
                        .height(48)
                        .quality(80)
                        .format('webp')
                        .url()
                    } catch (error) {
                      console.error('Failed to generate author image URL:', error)
                      return post.author.image?.asset?.url || '/images/blog-1.webp'
                    }
                  })()}
                  alt={post.author.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    console.error('Author image failed to load:', target.src)
                    if (post.author.image?.asset?.url && !target.src.includes(post.author.image.asset.url)) {
                      target.src = post.author.image.asset.url
                    } else {
                      target.style.display = 'none'
                    }
                  }}
                />
              </div>
            )}
            <div>
              <p className="font-medium">{post.author.name}</p>
            </div>
          </div>
        )}
      </header>

      {post.mainImage && (
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={(() => {
              try {
                return urlFor(post.mainImage)
                  .width(1200)
                  .height(630)
                  .quality(80)
                  .format('webp')
                  .url()
              } catch (error) {
                console.error('Failed to generate main image URL:', error)
                // フォールバック: 直接URLを使用
                return post.mainImage?.asset?.url || '/images/blog-1.webp'
              }
            })()}
            alt={post.title}
            className="w-full h-auto rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              console.error('Main image failed to load:', target.src)
              // Sanityの直接URLにフォールバック
              if (post.mainImage?.asset?.url && !target.src.includes(post.mainImage.asset.url)) {
                target.src = post.mainImage.asset.url
              } else if (!target.src.includes('/images/blog-1.webp')) {
                target.src = '/images/blog-1.webp'
              }
            }}
          />
        </div>
      )}

      {/* TL;DR セクション */}
      {post.tldr && (
        <section className="mb-8 p-6 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
          <h2 className="text-xl font-semibold mb-3 text-blue-700">TL;DR（要約）</h2>
          <p className="text-gray-700">{post.tldr}</p>
        </section>
      )}

      {/* カテゴリー・タグ表示 */}
      <div className="flex flex-wrap gap-2 mb-8">
        {post.category && (
          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
            {post.category}
          </span>
        )}
        {post.tags && Array.isArray(post.tags) && post.tags.length > 0 &&
          post.tags.map((tag: string, index: number) => (
            <span key={`tag-${index}`} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
              {tag}
            </span>
          ))
        }
      </div>

      {/* メインコンテンツ */}
      {post.content && (
        <div className="prose prose-lg max-w-none mb-12">
          <PortableText
            value={post.content}
            components={{
              types: {
                image: ({value}: any) => {
                  if (!value?.asset?._ref) {
                    return null
                  }
                  return (
                    <img
                      src={urlFor(value).width(800).height(450).url()}
                      alt={value.alt || ''}
                      className="w-full h-auto rounded-lg my-8"
                    />
                  )
                }
              }
            }}
          />
        </div>
      )}

      {/* 重要なポイント */}
      {post.keyPoint && (
        <section className="mb-8 p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
          <h2 className="text-xl font-semibold mb-3 text-yellow-700">
            {typeof post.keyPoint === 'object' && post.keyPoint.title
              ? post.keyPoint.title
              : '重要なポイント'}
          </h2>
          <p className="text-gray-700">
            {typeof post.keyPoint === 'string'
              ? post.keyPoint
              : (typeof post.keyPoint === 'object' && post.keyPoint.content
                  ? post.keyPoint.content
                  : '')}
          </p>
        </section>
      )}

      {/* まとめ */}
      {post.summary && (
        <section className="mb-8 p-6 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
          <h2 className="text-xl font-semibold mb-3 text-green-700">まとめ</h2>
          <p className="text-gray-700">{post.summary}</p>
        </section>
      )}

      {/* FAQ */}
      {post.faq && Array.isArray(post.faq) && post.faq.length > 0 && (
        <section className="mb-8 p-6 bg-gray-50 border-l-4 border-gray-400 rounded-r-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">よくある質問</h2>
          <div className="space-y-4">
            {post.faq.map((item: any, index: number) => {
              if (!item || typeof item !== 'object') return null;
              return (
                <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0">
                  <h3 className="font-medium text-gray-800 mb-2">
                    Q: {item.question || '質問'}
                  </h3>
                  <p className="text-gray-600">
                    A: {item.answer || '回答'}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 関連記事セクション */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="mt-16 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">関連記事</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost: any) => (
              <a
                key={relatedPost._id}
                href={`/blog/${relatedPost.slug?.current}`}
                className="block group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <div className="aspect-[3/2] relative overflow-hidden bg-gray-100">
                  <img
                    src={relatedPost.mainImage?.asset?.url || '/images/blog-1.webp'}
                    alt={relatedPost.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      if (!target.src.includes('/images/blog-1.webp')) {
                        target.src = '/images/blog-1.webp'
                      }
                    }}
                  />
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                    <time>
                      {new Date(relatedPost.publishedAt).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      }).replace(/\//g, '.')}
                    </time>
                    {relatedPost.author && (
                      <>
                        <span>•</span>
                        <span>{relatedPost.author.name}</span>
                      </>
                    )}
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {relatedPost.title}
                  </h3>

                  {relatedPost.excerpt && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ブログ一覧に戻るボタン */}
      <div className="mt-12 text-center">
        <a
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          ブログ一覧に戻る
        </a>
      </div>
    </article>
  )
}

// export const revalidate = 60 // 上部で定義済み