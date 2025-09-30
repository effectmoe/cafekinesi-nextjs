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