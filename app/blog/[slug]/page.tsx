import { client, groq, urlFor, publicClient, previewClient } from '@/lib/sanity.client'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import type { BlogPost } from '@/types/sanity.types'
import { PortableText } from '@portabletext/react'

// 動的レンダリングを強制
export const dynamic = 'force-dynamic'

const POST_QUERY = groq`*[_type == "blogPost" && slug.current == $slug] | order(_updatedAt desc) [0] {
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

// 静的パラメータを生成（動的レンダリング時は効果なしだが、型の整合性のため）
export async function generateStaticParams() {
  try {
    const posts = await publicClient.fetch<{ slug: { current: string } }[]>(ALL_POSTS_QUERY)
    return posts.map((post) => ({
      slug: post.slug.current,
    }))
  } catch (error) {
    console.error('Failed to generate static params:', error)
    return []
  }
}

async function getPost(slug: string) {
  const draft = await draftMode()
  const isPreview = draft.isEnabled

  // プレビューモード時はpreviewClient、通常時はpublicClientを使用
  const selectedClient = isPreview ? previewClient : publicClient

  console.log(`Fetching post: ${slug}, preview: ${isPreview}, client: ${selectedClient === previewClient ? 'preview' : 'public'}`)

  try {
    const result = await selectedClient.fetch<BlogPost>(POST_QUERY, { slug })
    console.log(`Post result for ${slug}:`, result ? `Found: ${result._id}` : 'Not found')
    return result
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error)
    return null
  }
}

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PreviewModeIndicator from '@/components/PreviewModeIndicator'

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

  // 関連記事を取得（同じクライアントを使用）
  let relatedPosts: any[] = []
  try {
    const draft = await draftMode()
    const isPreview = draft.isEnabled
    const selectedClient = isPreview ? previewClient : publicClient

    relatedPosts = await selectedClient.fetch(
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

  // 画像URL生成のヘルパー関数
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PreviewModeIndicator />
      <Header />
      <article className="flex-grow">
        {/* ヒーローセクション - より洗練されたデザイン */}
        <header className="bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            {/* 日付とカテゴリー */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
              {post.publishedAt && (
                <time className="text-xs tracking-wider text-gray-500 uppercase">
                  {new Date(post.publishedAt).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              )}
              {post.category && (
                <>
                  <span className="text-xs tracking-wider text-gray-500 uppercase hidden sm:inline">•</span>
                  <span className="text-xs tracking-wider text-gray-500 uppercase">
                    {post.category}
                  </span>
                </>
              )}
            </div>

            {/* タイトル */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light leading-tight text-gray-900 mb-6 sm:mb-8">
              {post.title}
            </h1>

            {/* 著者情報 */}
            {post.author && (
              <div className="flex items-center gap-3 sm:gap-4">
                {post.author.image && (
                  <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full overflow-hidden bg-gray-100">
                    <img
                      src={getImageUrl(post.author.image, 48, 48)}
                      alt={post.author.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="text-sm font-light text-gray-700">{post.author.name}</p>
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">

      {/* メイン画像 - レスポンシブ対応 */}
      {post.mainImage && (
        <div className="-mx-4 sm:-mx-6 lg:-mx-8 mb-8 sm:mb-12 lg:mb-16">
          <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] overflow-hidden bg-gray-100">
            <img
              src={getImageUrl(post.mainImage, 1400, 600)}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* TL;DR セクション - エレガントなスタイル */}
      {post.tldr && (
        <section className="mb-12 sm:mb-16">
          <div className="border-l-2 border-gray-900 pl-6">
            <h2 className="text-xs tracking-[0.2em] uppercase text-gray-900 mb-4 font-light">要約</h2>
            <p className="text-lg font-light text-gray-700 leading-relaxed">{post.tldr}</p>
          </div>
        </section>
      )}

      {/* タグ表示 - ミニマルスタイル */}
      {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-12 pb-12 border-b border-gray-200">
          {post.tags.map((tag: string, index: number) => (
            <span key={`tag-${index}`} className="text-sm text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* メインコンテンツ - 洗練されたタイポグラフィ */}
      {post.content && (
        <div className="prose prose-lg prose-gray max-w-none mb-16
                       prose-headings:font-light prose-headings:text-gray-900 prose-headings:tracking-tight
                       prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
                       prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                       prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                       prose-a:text-gray-900 prose-a:underline-offset-4 prose-a:decoration-gray-400
                       prose-strong:font-medium prose-strong:text-gray-900
                       prose-ul:my-6 prose-li:text-gray-700
                       prose-blockquote:border-gray-300 prose-blockquote:italic prose-blockquote:text-gray-600">
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
                      src={getImageUrl(value, 800, 450)}
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

      {/* 重要なポイント - モダンなアクセント */}
      {post.keyPoint && (
        <section className="mb-12 py-8 border-t border-b border-gray-200">
          <h2 className="text-xs tracking-[0.2em] uppercase text-gray-900 mb-4 font-light">
            {typeof post.keyPoint === 'object' && post.keyPoint.title
              ? post.keyPoint.title
              : '重要なポイント'}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed font-light">
            {typeof post.keyPoint === 'string'
              ? post.keyPoint
              : (typeof post.keyPoint === 'object' && post.keyPoint.content
                  ? post.keyPoint.content
                  : '')}
          </p>
        </section>
      )}

      {/* まとめ - クリーンなデザイン */}
      {post.summary && (
        <section className="mb-12 p-8 bg-gray-50">
          <h2 className="text-xs tracking-[0.2em] uppercase text-gray-900 mb-4 font-light">まとめ</h2>
          <p className="text-lg text-gray-700 leading-relaxed font-light">{post.summary}</p>
        </section>
      )}

      {/* FAQ - ミニマルスタイル */}
      {post.faq && Array.isArray(post.faq) && post.faq.length > 0 && (
        <section className="mb-16">
          <h2 className="text-xs tracking-[0.2em] uppercase text-gray-900 mb-8 font-light">よくある質問</h2>
          <div className="space-y-8">
            {post.faq.map((item: any, index: number) => {
              if (!item || typeof item !== 'object') return null;
              return (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <h3 className="text-base font-normal text-gray-900 mb-3">
                    Q: {item.question || '質問'}
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed font-light">
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
                    src={getImageUrl(relatedPost.mainImage, 400, 267)}
                    alt={relatedPost.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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

      {/* ブログ一覧に戻るボタン - ミニマルに */}
      <div className="mt-12 sm:mt-16 lg:mt-20 text-center">
        <a
          href="/blog"
          className="inline-flex items-center gap-2 sm:gap-3 text-xs sm:text-sm tracking-wider text-gray-600 uppercase hover:text-gray-900 transition-colors"
        >
          <svg className="w-3 sm:w-4 h-3 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          ブログ一覧に戻る
        </a>
      </div>
        </div>
      </article>
      <Footer />
    </div>
  )
}

// export const revalidate = 60 // 上部で定義済み