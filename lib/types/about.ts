import type { SanityDocument } from '@sanity/types'

// Custom image type since SanityImageObject is not exported from @sanity/types
interface SanityImageObject {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
}
import { PortableTextBlock } from '@portabletext/types'

export interface AboutHeroSection {
  image: SanityImageObject & {
    alt: string
  }
  title: string
  subtitle: string
}

export interface AboutTableOfContentsItem {
  text: string
  link?: string
}

export interface AboutFeatureCard {
  number: number
  title: string
  description: string
  bgColor: string
  customBgColor?: string
}

export interface AboutLinkCard {
  title: string
  description?: string
  link: string
  image?: SanityImageObject & {
    alt: string
  }
  bgColor?: string
}

export interface AboutSection {
  id: string
  title: string
  cardBgColor?: string
  customCardBgColor?: string
  layout: 'image-left' | 'image-right' | 'text-only' | 'cards' | 'link-cards'
  backgroundColor?: string
  customBackgroundColor?: string
  image?: SanityImageObject & {
    alt: string
  }
  content?: PortableTextBlock[]
  highlightBox?: {
    show: boolean
    content?: PortableTextBlock[]
  }
  button?: {
    show: boolean
    text?: string
    link?: string
    bgColor?: string
    customBgColor?: string
    textColor?: string
    customTextColor?: string
  }
  cards?: AboutFeatureCard[]
  linkCards?: AboutLinkCard[]
}

export interface AboutPage extends SanityDocument {
  _type: 'aboutPage'
  title: string
  heroSection: AboutHeroSection
  tableOfContents: AboutTableOfContentsItem[]
  sections: AboutSection[]
  isActive: boolean
  seo?: {
    title?: string
    description?: string
    keywords?: string
    ogImage?: SanityImageObject
  }
}
