import { client, groq, urlFor, publicClient, previewClient } from '@/lib/sanity.client'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import type { BlogPost } from '@/types/sanity.types'
import { PortableText } from '@portabletext/react'
import type { Metadata } from 'next'
import SiteSchemas from '@/components/SiteSchemas'
import AutoSchema from '@/components/AutoSchema'

// 動的レンダリングを強制
export const dynamic = 'force-dynamic'

const POST_QUERY = groq`*[_type == "blogPost" && slug.current == $slug][0] {
  _id,
  _type,
  title,
  slug,
  excerpt,
  mainImage,
  content,
  tldr,
  summary,
  keyPoint,
  faq,
  contentOrder,
  gallery,
  additionalImages,
  category,
  tags,
  publishedAt,
  featured,
  relatedArticles[]-> {
    _id,
    title,
    slug,
    excerpt,
    mainImage
  },
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
  },
  customSchema
}`

async function getPost(slug: string) {
  const draft = await draftMode()
  const isPreview = draft.isEnabled
  const selectedClient = isPreview ? previewClient : publicClient

  try {
    const result = await selectedClient.fetch<BlogPost>(POST_QUERY, { slug }, {
      cache: isPreview ? 'no-store' : 'force-cache'
    } as any)
    return result
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error)
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  try {
    const post = await publicClient.fetch<BlogPost>(POST_QUERY, { slug })

    if (!post) {
      return {
        title: 'Not Found',
        description: 'The page you are looking for does not exist.',
      }
    }

    return {
      title: post.seo?.title || post.title || 'Cafe Kinesi Blog',
      description: post.seo?.description || post.excerpt || '',
      keywords: post.seo?.keywords || post.tags?.join(', ') || '',
    }
  } catch (error) {
    return {
      title: 'Cafe Kinesi Blog',
      description: '心と身体を整えるブログ',
    }
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  // 関連記事を取得（relatedArticles フィールドがない場合のフォールバック）
  let relatedPosts = post.relatedArticles || []

  // 関連記事が指定されていない場合は最新記事を取得
  if ((!relatedPosts || relatedPosts.length === 0)) {
    try {
      relatedPosts = await client.fetch(
        `*[_type == "blogPost" && slug.current != $slug] | order(publishedAt desc) [0...3] {
          _id,
          title,
          slug,
          excerpt,
          mainImage,
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
  }

  const breadcrumbs = [
    { name: 'ホーム', url: '/' },
    { name: 'ブログ', url: '/blog' },
    { name: post.title, url: `/blog/${slug}` }
  ]

  return (
    <>
      <SiteSchemas
        currentPage={{
          title: post.title,
          url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://cafekinesi-nextjs.vercel.app'}/blog/${slug}`,
          breadcrumbs
        }}
      />
      <AutoSchema document={post} />

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
                {post.author.bio && (
                  <p className="text-sm text-gray-600">{post.author.bio}</p>
                )}
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
                  return post.mainImage?.asset?.url || '/images/blog-1.webp'
                }
              })()}
              alt={post.title}
              className="w-full h-auto rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                console.error('Main image failed to load:', target.src)
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
            <p className="text-gray-700 whitespace-pre-wrap">{post.tldr}</p>
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
            <p className="text-gray-700 whitespace-pre-wrap">{post.summary}</p>
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

        {/* ギャラリー画像 */}
        {post.gallery && Array.isArray(post.gallery) && post.gallery.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">ギャラリー</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {post.gallery.map((image: any, index: number) => (
                <div key={index} className="relative">
                  <img
                    src={(() => {
                      try {
                        if (image?._ref || image?.asset?._ref) {
                          return urlFor(image)
                            .width(400)
                            .height(300)
                            .quality(80)
                            .format('webp')
                            .url()
                        }
                        return image?.asset?.url || '/images/blog-1.webp'
                      } catch (error) {
                        return '/images/blog-1.webp'
                      }
                    })()}
                    alt={image.alt || `ギャラリー画像 ${index + 1}`}
                    className="w-full h-auto rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      if (!target.src.includes('/images/blog-1.webp')) {
                        target.src = '/images/blog-1.webp'
                      }
                    }}
                  />
                  {image.caption && (
                    <p className="text-sm text-gray-600 mt-2 text-center">
                      {image.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 追加画像 */}
        {post.additionalImages && Array.isArray(post.additionalImages) && post.additionalImages.length > 0 && (
          <section className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {post.additionalImages.map((image: any, index: number) => (
                <div key={index}>
                  <img
                    src={(() => {
                      try {
                        if (image?._ref || image?.asset?._ref) {
                          return urlFor(image)
                            .width(600)
                            .height(400)
                            .quality(80)
                            .format('webp')
                            .url()
                        }
                        return image?.asset?.url || '/images/blog-1.webp'
                      } catch (error) {
                        return '/images/blog-1.webp'
                      }
                    })()}
                    alt={`追加画像 ${index + 1}`}
                    className="w-full h-auto rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      if (!target.src.includes('/images/blog-1.webp')) {
                        target.src = '/images/blog-1.webp'
                      }
                    }}
                  />
                </div>
              ))}
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
                  href={`/blog/${relatedPost.slug?.current || ''}`}
                  className="block group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <div className="aspect-[3/2] relative overflow-hidden bg-gray-100">
                    <img
                      src={(() => {
                        try {
                          if (relatedPost.mainImage?._ref || relatedPost.mainImage?.asset?._ref) {
                            return urlFor(relatedPost.mainImage)
                              .width(400)
                              .height(267)
                              .quality(80)
                              .format('webp')
                              .url()
                          }
                          return relatedPost.mainImage?.asset?.url || '/images/blog-1.webp'
                        } catch (error) {
                          return '/images/blog-1.webp'
                        }
                      })()}
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
                      {relatedPost.publishedAt && (
                        <time>
                          {new Date(relatedPost.publishedAt).toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                          }).replace(/\//g, '.')}
                        </time>
                      )}
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
    </>
  )
}