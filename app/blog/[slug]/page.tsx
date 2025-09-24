import { client, groq, urlFor } from '@/lib/sanity.client'

// 動的レンダリングを強制（Next.js 15ではこれだけで十分）
export const dynamic = 'force-dynamic'
import { SanityImage } from '@/components/SanityImage'
import { RelatedPostCard } from '@/components/RelatedPostCard'
import { PostNavigation } from '@/components/PostNavigation'
import { notFound } from 'next/navigation'
import type { BlogPost } from '@/types/sanity.types'
import { PortableText } from '@portabletext/react'

// ヘルパーコンポーネント
function MainImageComponent({ image, title }: { image: any, title: string }) {
  let imageUrl = '/images/blog-1.webp'
  try {
    imageUrl = urlFor(image)
      .width(1200)
      .height(630)
      .quality(80)
      .format('webp')
      .url()
  } catch (error) {
    console.error('Failed to generate main image URL:', error)
  }

  return (
    <div className="mb-8 rounded-lg overflow-hidden">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-auto rounded-lg"
        onError={(e) => {
          const target = e.target as HTMLImageElement
          if (!target.src.includes('/images/blog-1.webp')) {
            target.src = '/images/blog-1.webp'
          }
        }}
      />
    </div>
  )
}

function AuthorImageComponent({ image, name }: { image: any, name: string }) {
  let imageUrl = '/images/blog-1.webp'
  try {
    imageUrl = urlFor(image)
      .width(48)
      .height(48)
      .quality(80)
      .format('webp')
      .url()
  } catch (error) {
    console.error('Failed to generate author image URL:', error)
  }

  return (
    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
      <img
        src={imageUrl}
        alt={name}
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
        }}
      />
    </div>
  )
}

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

// 関連記事取得クエリ
const RELATED_POSTS_QUERY = groq`*[_type == "blogPost" && slug.current != $slug] | order(publishedAt desc) [0...6] {
  _id,
  title,
  slug,
  excerpt,
  mainImage,
  publishedAt,
  category,
  author-> {
    name,
    image {
      asset-> {
        url
      }
    }
  }
}`

// 前後の記事取得クエリ
const ADJACENT_POSTS_QUERY = groq`{
  "previous": *[_type == "blogPost" && publishedAt < $currentDate] | order(publishedAt desc) [0] {
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
  "next": *[_type == "blogPost" && publishedAt > $currentDate] | order(publishedAt asc) [0] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    author-> {
      name
    }
  }
}`

async function getPost(slug: string) {
  return client.fetch<BlogPost>(POST_QUERY, { slug })
}

async function getRelatedPosts(slug: string, category?: string) {
  try {
    console.log('[getRelatedPosts] Fetching for slug:', slug, 'category:', category)

    // まず一般的な関連記事を取得
    const posts = await client.fetch(RELATED_POSTS_QUERY, { slug })
    console.log('[getRelatedPosts] Found posts:', posts.length)

    return posts.slice(0, 3)
  } catch (error) {
    console.error('[getRelatedPosts] Error:', error)
    return []
  }
}

async function getAdjacentPosts(currentDate: string) {
  try {
    console.log('[getAdjacentPosts] Fetching for date:', currentDate)
    const result = await client.fetch(ADJACENT_POSTS_QUERY, { currentDate })
    console.log('[getAdjacentPosts] Result:', result)
    return result
  } catch (error) {
    console.error('[getAdjacentPosts] Error:', error)
    return { previous: null, next: null }
  }
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

  // 関連記事と前後ナビゲーションのデータを並行取得
  let relatedPosts = []
  let adjacentPosts = { previous: null, next: null }

  try {
    const results = await Promise.all([
      getRelatedPosts(slug, post.category),
      getAdjacentPosts(post.publishedAt)
    ])
    relatedPosts = results[0] || []
    adjacentPosts = results[1] || { previous: null, next: null }

    console.log('[BlogPost] Related posts:', relatedPosts?.length || 0)
    console.log('[BlogPost] Adjacent posts:', adjacentPosts)
  } catch (error) {
    console.error('[BlogPost] Error fetching related content:', error)
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
          <div className="flex items-center gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
            {post.author.image && (
              <AuthorImageComponent image={post.author.image} name={post.author.name} />
            )}
            <div>
              <p className="font-medium text-gray-900">著者: {post.author.name}</p>
              {post.author.bio && (
                <p className="text-sm text-gray-600 mt-1">{post.author.bio}</p>
              )}
            </div>
          </div>
        )}
      </header>

      {post.mainImage && (
        <MainImageComponent image={post.mainImage} title={post.title} />
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

      {/* 前後ナビゲーション */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">記事ナビゲーション</h2>
        <PostNavigation
          previousPost={adjacentPosts?.previous}
          nextPost={adjacentPosts?.next}
        />
      </div>

      {/* 関連記事セクション */}
      <section className="mt-16 pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">関連記事</h2>
        {relatedPosts && relatedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost: any) => (
              <RelatedPostCard
                key={relatedPost._id}
                post={relatedPost}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">関連記事が見つかりませんでした</p>
            <p className="text-sm text-gray-400 mt-2">他の記事もぜひご覧ください</p>
          </div>
        )}
      </section>

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