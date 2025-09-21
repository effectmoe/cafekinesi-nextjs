'use client'

import { urlFor } from '@/lib/sanity.client'
import type { SanityImage as SanityImageType } from '@/types/sanity.types'
import { useState, useRef, useEffect } from 'react'

interface SanityImageProps {
  image: SanityImageType
  alt: string
  sizes?: string
  className?: string
  width?: number
  height?: number
  quality?: number
  priority?: boolean
  placeholder?: 'blur' | 'empty'
  onLoad?: () => void
}

export function SanityImage({
  image,
  alt,
  sizes = '100vw',
  className = '',
  width,
  height,
  quality = 80,
  priority = false,
  placeholder = 'empty',
  onLoad,
  ...props
}: SanityImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const imgRef = useRef<HTMLImageElement>(null)

  if (!image?.asset) return null

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01
      }
    )

    const currentRef = imgRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [priority, isInView])

  // レスポンシブ画像のsrcSetを生成
  const breakpoints = [320, 640, 768, 1024, 1280, 1536]

  let imageBuilder = urlFor(image).auto('format').quality(quality)

  if (width) imageBuilder = imageBuilder.width(width)
  if (height) imageBuilder = imageBuilder.height(height)

  const srcSet = breakpoints
    .map(breakpoint => {
      const url = urlFor(image)
        .width(breakpoint)
        .auto('format')
        .quality(quality)
        .url()
      return `${url} ${breakpoint}w`
    })
    .join(', ')

  const src = imageBuilder.url()

  // ブラープレースホルダー用の低解像度画像
  const blurSrc = placeholder === 'blur'
    ? urlFor(image).width(20).quality(20).blur(50).url()
    : undefined

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  // アスペクト比を保持するためのスタイル
  const aspectRatio = width && height ? `${width} / ${height}` : undefined

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio }}
    >
      {/* ブラープレースホルダー */}
      {placeholder === 'blur' && blurSrc && !isLoaded && (
        <img
          src={blurSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          style={{ filter: 'blur(10px)' }}
          aria-hidden="true"
        />
      )}

      {/* メイン画像 */}
      {(isInView || priority) && (
        <img
          ref={imgRef}
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt || image.alt || ''}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          role={alt || image.alt ? 'img' : 'presentation'}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={handleLoad}
          {...props}
        />
      )}

      {/* ロード状態のプレースホルダー */}
      {!isInView && !priority && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ aspectRatio }}
        />
      )}
    </div>
  )
}