import { client, groq, urlFor, publicClient, previewClient } from '@/lib/sanity.client'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import type { BlogPost } from '@/types/sanity.types'
import { PortableText } from '@portabletext/react'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import PreviewModeIndicator from '@/components/PreviewModeIndicator'
import BlogContentRenderer from '@/components/BlogContentRenderer'
import RelatedPosts from '@/app/components/RelatedPosts'
import { generateBlogSchemas, generateBreadcrumbSchema } from '@/lib/schemaOrgGenerator'
import Script from 'next/script'

// 動的レンダリングを強制
export const dynamic = 'force-dynamic'

// プレビューモードと通常モードで異なるqueryを使用
const POST_QUERY = groq`*[_type == "blogPost" && slug.current == $slug][0] {
  _id,
  _type,
  title,
  slug,
  excerpt,
  tldr,
  mainImage,
  gallery,
  additionalImages,
  content,
  keyPoint,
  summary,
  faq,
  category,
  tags,
  publishedAt,
  featured,
  contentOrder,
  relatedArticles[]-> {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    author-> {
      name
    }
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
    ogImage,
    schema
  },
  "isDraft": _id in path("drafts.*")
}`

// ドラフトを優先的に取得するquery（同じ構造でdrafts perspectiveが自動処理）
const DRAFT_POST_QUERY = groq`*[_type == "blogPost" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  excerpt,
  tldr,
  mainImage,
  gallery,
  additionalImages,
  content,
  keyPoint,
  summary,
  faq,
  category,
  tags,
  publishedAt,
  featured,
  contentOrder,
  relatedArticles[]-> {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    author-> {
      name
    }
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
    ogImage,
    schema
  }
}`

const ALL_POSTS_QUERY = groq`*[_type == "blogPost"] {
  slug
}`

// メタデータを動的生成
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

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cafekinesi-nextjs.vercel.app'
    const ogImageUrl = `${baseUrl}/api/og?type=blogPost&slug=${slug}`

    return {
      title: post.seo?.title || post.title || 'Cafe Kinesi Blog',
      description: post.seo?.description || post.excerpt || '',
      keywords: post.seo?.keywords || post.tags?.join(', ') || '',
      openGraph: {
        title: post.seo?.title || post.title || 'Cafe Kinesi Blog',
        description: post.seo?.description || post.excerpt || '',
        type: 'article',
        publishedTime: post.publishedAt,
        authors: post.author?.name ? [post.author.name] : undefined,
        tags: post.tags || undefined,
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: post.title || 'Cafe Kinesi',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.seo?.title || post.title || 'Cafe Kinesi Blog',
        description: post.seo?.description || post.excerpt || '',
        images: [ogImageUrl],
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Cafe Kinesi Blog',
      description: '心と身体を整えるブログ',
    }
  }
}

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
  const query = isPreview ? DRAFT_POST_QUERY : POST_QUERY

  console.log(`Fetching post: ${slug}, preview: ${isPreview}, client: ${selectedClient === previewClient ? 'preview' : 'public'}`)

  // デバッグ用：クライアント設定を確認
  if (isPreview) {
    console.log('Preview client config:', {
      perspective: previewClient.config().perspective,
      useCdn: previewClient.config().useCdn,
      hasToken: !!previewClient.config().token,
      apiVersion: previewClient.config().apiVersion,
    })
  }

  try {
    const result = await selectedClient.fetch<BlogPost>(query, { slug }, {
      // キャッシュを無効化してリアルタイムデータを取得
      cache: 'no-store'  // 常に最新データを取得
    } as any)
    console.log(`Post result for ${slug}:`, result ? `Found: ${result._id}, isDraft: ${result._id?.startsWith('drafts.')}` : 'Not found')
    return result
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error)
    return null
  }
}

// 前後の記事を取得
async function getAdjacentPosts(currentDate: string, currentSlug: string) {
  const draft = await draftMode()
  const isPreview = draft.isEnabled
  const selectedClient = isPreview ? previewClient : publicClient

  try {
    // 前の記事（より新しい記事）
    const prevPost = await selectedClient.fetch(
      `*[_type == "blogPost" && publishedAt > $currentDate && slug.current != $currentSlug] | order(publishedAt asc) [0] {
        title,
        slug
      }`,
      { currentDate, currentSlug }
    )

    // 次の記事（より古い記事）
    const nextPost = await selectedClient.fetch(
      `*[_type == "blogPost" && publishedAt < $currentDate && slug.current != $currentSlug] | order(publishedAt desc) [0] {
        title,
        slug
      }`,
      { currentDate, currentSlug }
    )

    return { prevPost, nextPost }
  } catch (error) {
    console.error('Failed to fetch adjacent posts:', error)
    return { prevPost: null, nextPost: null }
  }
}


export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  console.log('[BlogPostPage] Rendering with slug:', slug)

  // ドラフトモードの状態を確認
  const draft = await draftMode()
  console.log('[BlogPostPage] Draft mode status:', draft.isEnabled)

  const post = await getPost(slug)

  if (!post) {
    console.error(`[BlogPostPage] Post not found for slug: ${slug}, preview mode: ${draft.isEnabled}`)

    // デバッグ用にすべてのドラフトを取得
    let debugDrafts: any[] = []
    if (draft.isEnabled) {
      try {
        debugDrafts = await previewClient.fetch(
          `*[_id in path("drafts.*") && _type == "blogPost"][0...5] {
            _id,
            title,
            slug
          }`
        )
      } catch (err) {
        console.error('Failed to fetch debug drafts:', err)
      }
    }

    // デバッグ用: Vercel環境でのみ詳細を表示
    if (process.env.VERCEL) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
          <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">404 - 記事が見つかりません</h1>
            <div className="bg-gray-100 rounded p-4 mb-4">
              <p className="text-sm text-gray-700">
                <strong>Slug:</strong> {slug}<br/>
                <strong>Preview Mode:</strong> {draft.isEnabled ? '有効' : '無効'}<br/>
                <strong>Environment:</strong> {process.env.NODE_ENV}<br/>
                <strong>API Token:</strong> {(process.env.NEXT_PUBLIC_SANITY_API_TOKEN || process.env.SANITY_API_READ_TOKEN) ? '設定済み' : '未設定'}<br/>
              </p>
            </div>

            {debugDrafts.length > 0 && (
              <div className="bg-blue-50 rounded p-4 mb-4">
                <p className="text-sm font-semibold text-blue-900 mb-2">利用可能なドラフト:</p>
                <ul className="text-sm text-blue-700">
                  {debugDrafts.map((d: any) => (
                    <li key={d._id}>
                      {d.title} (slug: {d.slug?.current || 'none'})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-yellow-50 rounded p-4 mb-4">
              <p className="text-sm text-yellow-800">
                <a href="/api/debug-sanity?slug={slug}" target="_blank" className="underline">
                  デバッグ情報を表示
                </a>
              </p>
            </div>
            <p className="text-gray-600 mb-4">
              この記事はSanity Studioで公開されているか確認してください。
            </p>
            <a href="/blog" className="text-blue-600 hover:underline">
              ブログ一覧に戻る
            </a>
          </div>
        </div>
      )
    }
    notFound()
  }

  // 関連記事はpostオブジェクトから取得
  const relatedPosts = post.relatedArticles || []

  // 前後の記事を取得
  const { prevPost, nextPost } = await getAdjacentPosts(post.publishedAt, slug)

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

  // デバッグ情報
  const debugInfo = {
    slug,
    postId: post._id,
    isDraft: post._id.startsWith('drafts.'),
    previewEnabled: draft.isEnabled
  }

  // Schema.org JSON-LDを生成（BlogPosting + FAQPage）
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cafekinesi.com'
  const siteName = 'Cafe Kinesi'
  const blogSchemas = generateBlogSchemas(post, siteUrl, siteName)
  const breadcrumbSchema = generateBreadcrumbSchema(post, siteUrl, siteName)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Schema.org JSON-LD (BlogPosting + FAQPage) */}
      {blogSchemas.map((schema, index) => (
        <Script
          key={`schema-${index}`}
          id={`schema-${schema['@type'].toLowerCase()}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema)
          }}
        />
      ))}
      {breadcrumbSchema && (
        <Script
          id="breadcrumb-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema)
          }}
        />
      )}
      {/* デバッグ表示 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-0 left-0 z-50 bg-black text-white text-xs p-2 font-mono">
          Debug: {JSON.stringify(debugInfo)}
        </div>
      )}
      <PreviewModeIndicator />
      <Header />
      <article className="flex-grow">
        {/* ヒーローセクション - タイトルのみ */}
        <header className="bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light leading-tight text-gray-900 mb-6 sm:mb-8">
              {post.title}
            </h1>
          </div>
        </header>

        {/* 動的コンテンツレンダラー */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <BlogContentRenderer
            post={post}
            relatedPosts={relatedPosts}
            prevPost={prevPost}
            nextPost={nextPost}
          />
        </div>

        {/* 関連記事セクション（自動取得） */}
        <RelatedPosts
          currentPostId={post._id}
          category={post.category}
          tags={post.tags}
        />

        {/* ブログ一覧に戻るボタン */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
    </div>
  )
}

// export const revalidate = 60 // 上部で定義済み