import type { Metadata } from 'next'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: {
    asset?: {
      url?: string
    }
  }
  url?: string
  type?: 'website' | 'article'
  author?: string
  publishedTime?: string
  modifiedTime?: string
}

export function generateSEOMetadata(props: SEOProps = {}): Metadata {
  const {
    title = 'Cafe Kinesi',
    description = 'Welcome to Cafe Kinesi - Your relaxation space',
    keywords = [],
    ogImage,
    url = 'https://cafekinesi.com',
    type = 'website',
    author,
    publishedTime,
    modifiedTime,
  } = props

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords.join(', '),
    openGraph: {
      title,
      description,
      type: type as any,
      url,
      siteName: 'Cafe Kinesi',
      locale: 'ja_JP',
      ...(ogImage?.asset?.url && {
        images: [
          {
            url: ogImage.asset.url,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      }),
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage?.asset?.url && {
        images: [ogImage.asset.url],
      }),
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }

  return metadata
}

// JSON-LD structured data generator
export function generateJSONLD(props: {
  type: 'WebPage' | 'BlogPosting' | 'Organization'
  title?: string
  description?: string
  url?: string
  datePublished?: string
  dateModified?: string
  author?: {
    name: string
    url?: string
  }
  image?: string
}) {
  const baseLD: any = {
    '@context': 'https://schema.org',
    '@type': props.type,
  }

  if (props.type === 'Organization') {
    return {
      ...baseLD,
      name: 'Cafe Kinesi',
      url: 'https://cafekinesi.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://cafekinesi.com/logo.png',
      },
      sameAs: [
        // ソーシャルメディアのURLをここに追加
      ],
    }
  }

  if (props.type === 'BlogPosting') {
    return {
      ...baseLD,
      headline: props.title,
      description: props.description,
      url: props.url,
      datePublished: props.datePublished,
      dateModified: props.dateModified || props.datePublished,
      author: props.author
        ? {
            '@type': 'Person',
            name: props.author.name,
            ...(props.author.url && { url: props.author.url }),
          }
        : undefined,
      ...(props.image && {
        image: {
          '@type': 'ImageObject',
          url: props.image,
        },
      }),
      publisher: {
        '@type': 'Organization',
        name: 'Cafe Kinesi',
        logo: {
          '@type': 'ImageObject',
          url: 'https://cafekinesi.com/logo.png',
        },
      },
    }
  }

  return {
    ...baseLD,
    name: props.title,
    description: props.description,
    url: props.url,
  }
}