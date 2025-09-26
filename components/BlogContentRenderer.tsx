'use client'

import React from 'react'
import { PortableText } from '@portabletext/react'
import { urlFor } from '@/lib/sanity.client'

interface BlogContentRendererProps {
  post: any
  relatedPosts: any[]
  prevPost: any
  nextPost: any
}

export default function BlogContentRenderer({
  post,
  relatedPosts,
  prevPost,
  nextPost
}: BlogContentRendererProps) {

  // デフォルトの表示順序（全項目を含む）
  const defaultOrder = ['title', 'slug', 'featured', 'publishedAt', 'category', 'author', 'excerpt', 'tags', 'mainImage', 'gallery', 'additionalImages', 'ogImage', 'tldr', 'toc', 'content', 'keyPoint', 'summary', 'faq', 'related', 'prevNext']

  // contentOrderが設定されていればそれを使用、なければデフォルト
  // 空文字列のみの配列や無効な値の場合もデフォルトを使用
  const contentOrder = post.contentOrder &&
                      post.contentOrder.length > 0 &&
                      post.contentOrder.some((item: string) => item && item.trim() !== '')
                      ? post.contentOrder.filter((item: string) => item && item.trim() !== '')
                      : defaultOrder

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

  // 各コンテンツブロックのレンダリング関数
  const renderContentBlock = (blockType: string) => {
    switch (blockType) {
      case 'title':
        // タイトルは既にページのヘッダーセクションで表示されているため、ここでは何も表示しない
        return null

      case 'slug':
        // スラッグは通常表示しないが、デバッグ目的で表示可能
        return null

      case 'ogImage':
        if (!post.ogImage) return null
        return (
          <div key="ogImage" className="mb-8">
            <div className="text-xs text-gray-500 mb-2">OGP画像</div>
            <div className="relative aspect-[1200/630] overflow-hidden bg-gray-100 rounded-lg">
              <img
                src={getImageUrl(post.ogImage, 1200, 630)}
                alt="OGP画像"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )

      case 'featured':
        if (!post.featured) return null
        return (
          <div key="featured" className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-full">
            <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium text-yellow-700">注目の記事</span>
          </div>
        )

      case 'publishedAt':
        if (!post.publishedAt) return null
        return (
          <div key="publishedAt" className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            <time className="text-xs tracking-wider text-gray-500 uppercase">
              {new Date(post.publishedAt).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        )

      case 'category':
        if (!post.category) return null
        return (
          <div key="category" className="mb-4">
            <span className="text-xs tracking-wider text-gray-500 uppercase">
              {post.category}
            </span>
          </div>
        )

      case 'author':
        if (!post.author) return null
        return (
          <div key="author" className="flex items-center gap-3 sm:gap-4 mb-6">
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
        )

      case 'excerpt':
        if (!post.excerpt) return null
        return (
          <div key="excerpt" className="mb-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700">{post.excerpt}</p>
          </div>
        )

      case 'mainImage':
        if (!post.mainImage) return null
        return (
          <div key="mainImage" className="-mx-4 sm:-mx-6 lg:-mx-8 mb-8 sm:mb-12 lg:mb-16">
            <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] overflow-hidden bg-gray-100">
              <img
                src={getImageUrl(post.mainImage, 1400, 600)}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )

      case 'gallery':
        if (!post.gallery || post.gallery.length === 0) return null
        return (
          <div key="gallery" className="mb-12">
            <h2 className="text-xs tracking-[0.2em] uppercase text-gray-900 mb-4 font-light">ギャラリー</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {post.gallery.map((image: any, index: number) => (
                <div key={index} className="relative aspect-square overflow-hidden bg-gray-100 rounded-lg">
                  <img
                    src={getImageUrl(image, 400, 400)}
                    alt={image.caption || `ギャラリー画像 ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  {image.caption && (
                    <p className="text-xs text-gray-600 mt-2">{image.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )

      case 'additionalImages':
        if (!post.additionalImages || post.additionalImages.length === 0) return null
        return (
          <div key="additionalImages" className="mb-12">
            <div className="space-y-6">
              {post.additionalImages.map((image: any, index: number) => (
                <img
                  key={index}
                  src={getImageUrl(image, 800, 450)}
                  alt={`追加画像 ${index + 1}`}
                  className="w-full h-auto rounded-lg"
                />
              ))}
            </div>
          </div>
        )

      case 'tldr':
        if (!post.tldr) return null
        return (
          <section key="tldr" className="mb-12 sm:mb-16">
            <div className="border-l-2 border-gray-900 pl-6">
              <h2 className="text-xs tracking-[0.2em] uppercase text-gray-900 mb-4 font-light">要約</h2>
              <p className="text-lg font-light text-gray-700 leading-relaxed">{post.tldr}</p>
            </div>
          </section>
        )

      case 'toc':
        // 目次の実装は別途必要
        return null

      case 'tags':
        if (!post.tags || post.tags.length === 0) return null
        return (
          <div key="tags" className="flex flex-wrap gap-4 mb-12 pb-12 border-b border-gray-200">
            {post.tags.map((tag: string, index: number) => (
              <span key={`tag-${index}`} className="text-sm text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        )

      case 'content':
        if (!post.content) return null
        return (
          <div key="content" className="prose prose-lg prose-gray max-w-none mb-16
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
        )

      case 'keyPoint':
        if (!post.keyPoint) return null
        return (
          <section key="keyPoint" className="mb-12 py-8 border-t border-b border-gray-200">
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
        )

      case 'summary':
        if (!post.summary) return null
        return (
          <section key="summary" className="mb-12 p-8 bg-gray-50">
            <h2 className="text-xs tracking-[0.2em] uppercase text-gray-900 mb-4 font-light">まとめ</h2>
            <p className="text-lg text-gray-700 leading-relaxed font-light">{post.summary}</p>
          </section>
        )

      case 'faq':
        if (!post.faq || post.faq.length === 0) return null
        return (
          <section key="faq" className="mb-16">
            <h2 className="text-xs tracking-[0.2em] uppercase text-gray-900 mb-8 font-light">よくある質問</h2>
            <div className="space-y-8">
              {post.faq.map((item: any, index: number) => {
                if (!item || typeof item !== 'object') return null
                return (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <h3 className="text-base font-normal text-gray-900 mb-3">
                      Q: {item.question || '質問'}
                    </h3>
                    <p className="text-base text-gray-600 leading-relaxed font-light">
                      A: {item.answer || '回答'}
                    </p>
                  </div>
                )
              })}
            </div>
          </section>
        )

      case 'prevNext':
        return (
          <nav key="prevNext" className="mt-16 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-left">
                {prevPost ? (
                  <a
                    href={`/blog/${prevPost.slug?.current}`}
                    className="group inline-flex flex-col"
                  >
                    <span className="text-xs text-gray-500 mb-2 uppercase tracking-wider">← 前の記事</span>
                    <span className="text-base text-gray-900 group-hover:text-blue-600 transition-colors font-medium">
                      {prevPost.title}
                    </span>
                  </a>
                ) : (
                  <div className="text-gray-400">
                    <span className="text-xs uppercase tracking-wider">前の記事はありません</span>
                  </div>
                )}
              </div>

              <div className="text-right">
                {nextPost ? (
                  <a
                    href={`/blog/${nextPost.slug?.current}`}
                    className="group inline-flex flex-col items-end"
                  >
                    <span className="text-xs text-gray-500 mb-2 uppercase tracking-wider">次の記事 →</span>
                    <span className="text-base text-gray-900 group-hover:text-blue-600 transition-colors font-medium">
                      {nextPost.title}
                    </span>
                  </a>
                ) : (
                  <div className="text-gray-400">
                    <span className="text-xs uppercase tracking-wider">次の記事はありません</span>
                  </div>
                )}
              </div>
            </div>
          </nav>
        )

      case 'related':
        if (!relatedPosts || relatedPosts.length === 0) return null
        return (
          <section key="related" className="mt-12 pt-8 border-t border-gray-200">
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
        )

      default:
        return null
    }
  }

  return (
    <div className="w-full">
      {contentOrder.map((blockType: string) => renderContentBlock(blockType))}
    </div>
  )
}