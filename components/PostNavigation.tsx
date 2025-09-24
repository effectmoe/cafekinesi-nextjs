'use client'

import Link from 'next/link'
import { urlFor } from '@/lib/sanity.client'

interface PostNavigationProps {
  previousPost?: {
    _id: string
    title: string
    slug: { current: string }
    excerpt?: string
    mainImage?: any
    author?: { name: string }
  }
  nextPost?: {
    _id: string
    title: string
    slug: { current: string }
    excerpt?: string
    mainImage?: any
    author?: { name: string }
  }
}

export function PostNavigation({ previousPost, nextPost }: PostNavigationProps) {
  if (!previousPost && !nextPost) return null

  return (
    <nav className="flex flex-col sm:flex-row gap-4 my-12">
      {/* 前の記事 */}
      <div className="flex-1">
        {previousPost ? (
          <Link
            href={`/blog/${previousPost.slug.current}`}
            className="block group p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500 mb-1">前の記事</p>
                <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {previousPost.title}
                </h4>
                {previousPost.author && (
                  <p className="text-xs text-gray-400 mt-1">
                    by {previousPost.author.name}
                  </p>
                )}
              </div>
              {previousPost.mainImage && (
                <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={(() => {
                      try {
                        return urlFor(previousPost.mainImage)
                          .width(64)
                          .height(64)
                          .quality(80)
                          .format('webp')
                          .url()
                      } catch {
                        return '/images/blog-1.webp'
                      }
                    })()}
                    alt={previousPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </Link>
        ) : (
          <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
            <div className="flex items-center gap-3 opacity-50">
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <p className="text-sm text-gray-400">前の記事はありません</p>
            </div>
          </div>
        )}
      </div>

      {/* 次の記事 */}
      <div className="flex-1">
        {nextPost ? (
          <Link
            href={`/blog/${nextPost.slug.current}`}
            className="block group p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-center gap-3">
              {nextPost.mainImage && (
                <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={(() => {
                      try {
                        return urlFor(nextPost.mainImage)
                          .width(64)
                          .height(64)
                          .quality(80)
                          .format('webp')
                          .url()
                      } catch {
                        return '/images/blog-1.webp'
                      }
                    })()}
                    alt={nextPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500 mb-1">次の記事</p>
                <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {nextPost.title}
                </h4>
                {nextPost.author && (
                  <p className="text-xs text-gray-400 mt-1">
                    by {nextPost.author.name}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ) : (
          <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
            <div className="flex items-center gap-3 justify-end opacity-50">
              <p className="text-sm text-gray-400">次の記事はありません</p>
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}