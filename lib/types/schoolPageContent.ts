// スクールページコンテンツの型定義

export interface SelectionPoint {
  title: string
  description: string
}

export interface SelectionGuide {
  title: string
  description: string
  image?: {
    asset: {
      url: string
    }
    alt?: string
  }
  points?: SelectionPoint[]
}

export interface LearningStep {
  number: number
  title: string
  description: string
  image?: {
    asset: {
      url: string
    }
    alt?: string
  }
}

export interface LearningFlow {
  title: string
  description: string
  steps?: LearningStep[]
}

export interface FAQItem {
  question: string
  answer: string
}

export interface FAQ {
  title: string
  items?: FAQItem[]
}

export interface Certification {
  title: string
  description: string
  image?: {
    asset: {
      url: string
    }
    alt?: string
  }
  benefits?: string[]
}

export interface SchoolPageContent {
  _id: string
  title: string
  selectionGuide?: SelectionGuide
  learningFlow?: LearningFlow
  faq?: FAQ
  certification?: Certification
  isActive: boolean
  lastUpdated?: string // 手動設定の最終更新日
  _updatedAt?: string // Sanityの自動更新日
}
