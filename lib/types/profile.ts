import type { SanityAsset } from '@sanity/image-url/lib/types/types'

// Re-export for compatibility
export type SanityImageAsset = SanityAsset

// プロフィール写真の型
export interface ProfilePhoto {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
}

// プロフィールセクションの型
export interface ProfileSection {
  photo: ProfilePhoto
  name: string
  nameReading?: string
  location?: string
}

// 経歴項目の型
export interface HistoryItem {
  text: string
  order: number
}

// 活動項目の型
export interface ActivityItem {
  title: string
  order: number
}

// SEO設定の型
export interface ProfileSEO {
  title?: string
  description?: string
  keywords?: string
  ogImage?: {
    _type: 'image'
    asset: SanityImageAsset
  }
}

// プロフィールページデータの型
export interface ProfilePage {
  _id: string
  _type: 'profilePage'
  title: string
  profileSection: ProfileSection
  historyTitle: string
  historyItems: HistoryItem[]
  activitiesTitle: string
  activitiesDescription: string
  activitiesItems: ActivityItem[]
  seo?: ProfileSEO
  isActive: boolean
}

// Sanityから取得したプロフィールページデータの型（nullチェック用）
export interface ProfilePageData {
  profilePage: ProfilePage | null
}
