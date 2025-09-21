'use client'

import { urlFor } from '@/lib/sanity.client'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface SanityImageProps {
  image: SanityImageSource
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
  width = 1200,
  height = 800,
  quality = 80,
  priority = false,
  placeholder = 'blur',
  onLoad,
}: SanityImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  if (!image) return null

  const src = urlFor(image)
    .width(width)
    .height(height)
    .quality(quality)
    .auto('format')
    .url()

  const blurDataURL = placeholder === 'blur'
    ? urlFor(image).width(20).quality(20).blur(50).url()
    : undefined

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        quality={quality}
        priority={priority}
        placeholder={blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  )
}