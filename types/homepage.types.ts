import { SanityDocument, SanityImageObject } from '@sanity/types'

export interface CategoryCard {
  titleJa: string
  titleEn: string
  image: SanityImageObject & {
    alt: string
  }
  colorScheme: 'album-beige' | 'album-blue-gray' | 'album-light-gray' | 'album-purple' | 'album-teal' | 'album-pink'
  link: string
  isActive: boolean
  displayOrder: number
}

export interface BlogSectionConfig {
  sectionTitle: string
  displayCount: number
  showAllButton: boolean
  noPostsMessage: string
}

export interface SocialLink {
  platform: string
  url: string
  displayText?: string
  isActive: boolean
  order: number
}

export interface ViewAllButton {
  show: boolean
  text: string
  link: string
}

export interface ProfileButton {
  show: boolean
  text: string
  link: string
}

export interface Homepage extends SanityDocument {
  _type: 'homepage'
  title: string
  categoryCards: CategoryCard[]
  blogSection: BlogSectionConfig
  socialLinks: SocialLink[]
  viewAllButton: ViewAllButton
  profileButton?: ProfileButton
}

// ブログ記事用の型定義
export interface Post {
  _id: string
  title: string
  slug: {
    current: string
  }
  excerpt: string
  mainImage: SanityImageObject & {
    alt: string
  }
  publishedAt: string
  author?: {
    name: string
  }
}