// CTAボックス用の型定義
export interface CourseCTABox {
  title?: string
  subtitle?: string
  primaryButtonText?: string
  primaryButtonLink?: string
  secondaryButtonText?: string
  secondaryButtonLink?: string
}

export interface Course {
  _id: string
  courseId: string
  title: string
  subtitle: string
  description: string
  features: string[]
  image?: {
    asset: {
      url: string
    }
    alt?: string
  }
  backgroundClass: string
  recommendations?: string[]
  effects?: string[]
  order: number
  isActive: boolean
  price?: {
    amount: number
    unit: string
    note?: string
  }
  duration?: {
    hours: number
    sessions: number
    note?: string
  }
  prerequisites?: string
  applicationLink?: string
  ctaBox?: CourseCTABox // CTAボックス設定
  courseType?: 'main' | 'auxiliary' // 講座タイプ（主要講座 or 補助講座）
  parentCourse?: {
    _ref: string
    _type: string
  }
  childCourses?: Course[] // 子講座（補助講座）のリスト
  recommendations?: string[] // こんな方におすすめ
}

// 講座詳細ページ用のセクション定義
export interface CourseSection {
  id: string
  title: string
  content: string
}

// サイドバー用の型定義
export interface SidebarItem {
  text: string
  link?: string
}

export interface SidebarSection {
  title: string
  items?: SidebarItem[]
}

export interface CourseSidebar {
  showContactButton?: boolean
  contactButtonText?: string
  contactButtonLink?: string
  customSections?: SidebarSection[]
}

// 講座詳細ページ用の拡張インターフェース
export interface CourseDetail extends Course {
  tableOfContents?: string[]
  sections?: CourseSection[]
  gallery?: {
    asset: {
      url: string
    }
    alt?: string
  }[]
  instructorInfo?: {
    name: string
    bio: string
    image?: {
      asset: {
        url: string
      }
      alt?: string
    }
    profileUrl?: string
  }
  relatedCourses?: Course[] // 実際の講座オブジェクト
  sidebar?: CourseSidebar // サイドバー設定
  faq?: FAQItem[] // クラスターページ用FAQ
  isClusterPage?: boolean // クラスターページフラグ
}

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

export interface SchoolPageData {
  _id: string
  title: string
  heroSection: {
    title: string
    description: string
  }
  courseListTitle: string
  ctaSection: {
    title: string
    description: string
    primaryButton: {
      text: string
      link?: string
    }
    secondaryButton: {
      text: string
      link?: string
    }
  }
  featuredCourses?: Course[]
  // ピラーページコンテンツ
  selectionGuide?: SelectionGuide
  learningFlow?: LearningFlow
  faq?: FAQ
  certification?: Certification
  seo?: {
    title: string
    description: string
    keywords: string
    ogImage?: {
      asset: {
        url: string
      }
    }
  }
  isActive: boolean
}