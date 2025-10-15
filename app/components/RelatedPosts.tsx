import { client, previewClient } from '@/lib/sanity.client'
import { draftMode } from 'next/headers'
import { groq } from 'next-sanity'
import { urlFor } from '@/lib/sanity.client'
import Link from 'next/link'

interface RelatedPost {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  mainImage?: any
  publishedAt?: string
  category?: string
  tags?: string[]
  author?: {
    name: string
  }
}

interface RelatedPostsProps {
  currentPostId: string
  category?: string
  tags?: string[]
}

// 読了時間を計算する関数
function calculateReadingTime(content?: any[]): number {
  if (!content) return 5

  // コンテンツから文字数を概算
  const textContent = content.reduce((acc, block) => {
    if (block._type === 'block' && block.children) {
      return acc + block.children.reduce((text: string, child: any) => {
        return text + (child.text || '')
      }, '')
    }
    return acc
  }, '')

  // 日本語の平均読書速度: 400-600文字/分
  const wordsPerMinute = 500
  return Math.max(1, Math.ceil(textContent.length / wordsPerMinute))
}

export default async function RelatedPosts({
  currentPostId,
  category,
  tags = [],
}: RelatedPostsProps) {
  // プレビューモードの確認
  const draft = await draftMode()
  const isDraftMode = draft.isEnabled
  const sanityClient = isDraftMode ? previewClient : client

  // 関連記事を取得するGROQクエリ
  const RELATED_POSTS_QUERY = groq`
    *[_type == "blogPost" && _id != $currentPostId && !(_id in path("drafts.*"))] {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      publishedAt,
      category,
      tags,
      author-> {
        name
      },
      content,
      "score": 0
        ${category ? '+ select(category == $category => 2, 0)' : ''}
        ${tags.length > 0 ? '+ count((tags[])[@ in $tags])' : ''}
    } | order(score desc, publishedAt desc) [0...5]
  `

  // フォールバック：最新記事を取得
  const LATEST_POSTS_QUERY = groq`
    *[_type == "blogPost" && _id != $currentPostId && !(_id in path("drafts.*"))] {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      publishedAt,
      category,
      tags,
      author-> {
        name
      },
      content
    } | order(publishedAt desc) [0...5]
  `

  try {
    console.log(`[RelatedPosts] Fetching related posts for ${currentPostId}, isDraftMode: ${isDraftMode}`)

    let relatedPosts = await sanityClient.fetch<RelatedPost[]>(
      RELATED_POSTS_QUERY,
      {
        currentPostId,
        category: category || null,
        tags: tags || [],
      }
    )

    console.log(`[RelatedPosts] Found ${relatedPosts?.length || 0} related posts`)

    // 関連記事が見つからない場合は、最新記事を取得
    if (!relatedPosts || relatedPosts.length === 0) {
      console.log('[RelatedPosts] No related posts found, fetching latest posts instead')
      relatedPosts = await sanityClient.fetch<RelatedPost[]>(
        LATEST_POSTS_QUERY,
        { currentPostId }
      )
      console.log(`[RelatedPosts] Found ${relatedPosts?.length || 0} latest posts`)
    }

    if (!relatedPosts || relatedPosts.length === 0) {
      console.log('[RelatedPosts] No posts found at all')
      return null
    }

    return (
      <section className="mt-16 pt-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">関連記事</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((post) => (
              <article
                key={post._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100"
              >
                <Link href={`/blog/${post.slug.current}`} data-related-post-id={post._id}>
                  {/* 画像 */}
                  <div className="aspect-[16/10] relative overflow-hidden bg-gray-100">
                    {post.mainImage ? (
                      <img
                        src={urlFor(post.mainImage)
                          .width(640)
                          .height(400)
                          .quality(85)
                          .format('webp')
                          .url()}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <span className="text-gray-400 text-sm">No Image</span>
                      </div>
                    )}

                    {/* カテゴリバッジ */}
                    {post.category && (
                      <div className="absolute top-3 left-3">
                        <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-purple-600 bg-opacity-90 rounded-full">
                          {post.category}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* コンテンツ */}
                  <div className="p-5">
                    {/* 日付と著者 */}
                    <div className="flex items-center text-xs text-gray-500 mb-3">
                      {post.publishedAt && (
                        <time>
                          {new Date(post.publishedAt).toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </time>
                      )}
                      {post.author && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{post.author.name}</span>
                        </>
                      )}
                    </div>

                    {/* タイトル */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-purple-600 transition-colors">
                      {post.title}
                    </h3>

                    {/* 概要 */}
                    {post.excerpt && (
                      <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                        {post.excerpt}
                      </p>
                    )}

                    {/* タグ */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    )
  } catch (error) {
    console.error('[RelatedPosts] Error details:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      currentPostId,
      category,
      tags,
      isDraftMode,
    })

    // 開発環境でのみエラー表示
    if (process.env.NODE_ENV === 'development') {
      return (
        <section className="mt-16 pt-16 border-t border-red-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-red-800 font-semibold">関連記事の読み込みエラー</h3>
              <p className="text-red-600 text-sm mt-2">
                {error instanceof Error ? error.message : '不明なエラーが発生しました'}
              </p>
            </div>
          </div>
        </section>
      )
    }

    return null
  }
}