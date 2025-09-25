import { client, groq, urlFor, publicClient, previewClient } from '@/lib/sanity.client'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import type { BlogPost } from '@/types/sanity.types'
import { PortableText } from '@portabletext/react'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import SiteSchemas from '@/components/SiteSchemas'
import AutoSchema from '@/components/AutoSchema'

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

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow max-w-4xl mx-auto px-4 py-8">
          <article>
            <header className="mb-8">
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
              {post.publishedAt && (
                <time className="text-gray-600">
                  {new Date(post.publishedAt).toLocaleDateString('ja-JP')}
                </time>
              )}
            </header>

            {post.mainImage && (
              <div className="mb-8">
                <img
                  src={urlFor(post.mainImage).width(800).height(400).url()}
                  alt={post.title}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}

            {post.excerpt && (
              <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                <p className="text-lg text-blue-900">{post.excerpt}</p>
              </div>
            )}

            {/* TL;DR セクション */}
            {post.tldr && (
              <div className="mb-8 p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                <h2 className="text-2xl font-bold mb-3 text-yellow-800">TL;DR（要約）</h2>
                <p className="text-gray-800 whitespace-pre-wrap">{post.tldr}</p>
              </div>
            )}

            {/* 目次（仮実装） */}
            {post.content && post.content.length > 3 && (
              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h2 className="text-2xl font-bold mb-3">目次</h2>
                <ul className="space-y-2">
                  {post.content
                    .filter((block: any) => block._type === 'block' && block.style === 'h2')
                    .map((heading: any, index: number) => (
                      <li key={index} className="text-blue-600 hover:text-blue-800">
                        • {heading.children?.[0]?.text || ''}
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {post.content && (
              <div className="prose prose-lg max-w-none">
                <PortableText
                  value={post.content}
                  components={{
                    types: {
                      image: ({value}: any) => {
                        if (!value?.asset?._ref) {
                          return null
                        }
                        return (
                          <div className="my-8">
                            <img
                              src={urlFor(value).width(800).url()}
                              alt={value.alt || ''}
                              className="w-full rounded-lg"
                            />
                            {value.caption && (
                              <p className="text-sm text-gray-600 mt-2 text-center">
                                {value.caption}
                              </p>
                            )}
                          </div>
                        )
                      }
                    }
                  }}
                />
              </div>
            )}

            {/* 重要なポイント */}
            {post.keyPoint && (
              <div className="my-8 p-6 bg-green-50 border-l-4 border-green-400 rounded-lg">
                <h2 className="text-2xl font-bold mb-3 text-green-800">
                  {post.keyPoint.title || '重要なポイント'}
                </h2>
                <p className="text-gray-800">{post.keyPoint.content}</p>
              </div>
            )}

            {/* まとめ */}
            {post.summary && (
              <div className="my-8 p-6 bg-purple-50 rounded-lg">
                <h2 className="text-2xl font-bold mb-3 text-purple-800">まとめ</h2>
                <p className="text-gray-800 whitespace-pre-wrap">{post.summary}</p>
              </div>
            )}

            {/* FAQ */}
            {post.faq && post.faq.length > 0 && (
              <div className="my-8">
                <h2 className="text-2xl font-bold mb-6">よくある質問（FAQ）</h2>
                <div className="space-y-4">
                  {post.faq.map((item: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h3 className="font-bold text-lg mb-2">Q: {item.question}</h3>
                      <p className="text-gray-700">A: {item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 関連記事 */}
            {post.relatedArticles && post.relatedArticles.length > 0 && (
              <div className="my-8 p-6 bg-gray-50 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">関連記事</h2>
                <div className="grid gap-4">
                  {post.relatedArticles.map((article: any) => (
                    <a
                      key={article._id}
                      href={`/blog/${article.slug.current}`}
                      className="block p-4 border rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <h3 className="font-bold text-lg mb-1">{article.title}</h3>
                      {article.excerpt && (
                        <p className="text-gray-600 text-sm">{article.excerpt}</p>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </article>
        </main>
      </div>
    </>
  )
}