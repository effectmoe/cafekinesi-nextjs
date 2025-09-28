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