import { SanityDocument } from '@sanity/types'

// Sanity Image型定義
export interface SanityImageObject {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
    url?: string
  }
  alt?: string
}

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
  title: string
  numberOfPosts: number
  showLatestPosts: boolean
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

export interface NavigationMenuItem {
  label: string
  link: string
  order: number
  isActive: boolean
}

export interface HeaderIconConfig {
  show: boolean
  link: string
}

export interface HeaderIcons {
  searchIcon: HeaderIconConfig
  cartIcon: HeaderIconConfig
}

export interface SEO {
  title?: string
  description?: string
  keywords?: string
  ogImage?: SanityImageObject
}

export interface Homepage extends SanityDocument {
  _type: 'homepage'
  title: string
  categoryCards: CategoryCard[]
  blogSection: BlogSectionConfig
  socialLinks: SocialLink[]
  viewAllButton: ViewAllButton
  profileButton?: ProfileButton
  navigationMenu?: NavigationMenuItem[]
  headerIcons?: HeaderIcons
  seo?: SEO
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