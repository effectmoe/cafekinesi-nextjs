'use client'

import Link from 'next/link'
import { urlFor } from '@/lib/sanity.client'

interface RelatedPostCardProps {
  post: {
    _id: string
    title: string
    slug: { current: string }
    excerpt?: string
    mainImage?: any
    publishedAt: string
    category?: string
    author?: { name: string }
  }
  className?: string
}

export function RelatedPostCard({ post, className = '' }: RelatedPostCardProps) {
  let imageUrl = '/images/blog-1.webp'

  if (post.mainImage) {
    try {
      imageUrl = urlFor(post.mainImage)
        .width(300)
        .height(200)
        .quality(80)
        .format('webp')
        .url()
    } catch (error) {
      console.warn('Failed to generate image URL for related post:', error)
    }
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '.')

  return (
    <Link href={`/blog/${post.slug.current}`} className={`block group ${className}`}>
      <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div className="aspect-[3/2] relative overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={post.title}
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
            <time>{formattedDate}</time>
            {post.author && (
              <>
                <span>•</span>
                <span>{post.author.name}</span>
              </>
            )}
          </div>

          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {post.excerpt}
            </p>
          )}

          {post.category && (
            <div className="mt-3">
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                {post.category}
              </span>
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}