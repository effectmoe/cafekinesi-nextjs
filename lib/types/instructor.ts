import { Course } from './course'

export interface Certification {
  title: string
  organization?: string
  year?: number
}

export interface Experience {
  year?: string
  description: string
}

export interface SocialLink {
  platform: 'facebook' | 'instagram' | 'twitter' | 'line' | 'youtube' | 'other'
  url: string
}

export interface Instructor {
  _id: string
  name: string
  slug: {
    current: string
  }
  title?: string
  image?: {
    asset: {
      url: string
    }
    alt?: string
  }
  bio: string
  profileDetails?: any[] // PortableText
  region?: string
  certifications?: Certification[]
  experience?: Experience[]
  teachingCourses?: Course[]
  specialties?: string[]
  email?: string
  phone?: string
  website?: string
  socialLinks?: SocialLink[]
  order: number
  isActive: boolean
  featured: boolean
  seo?: {
    title?: string
    description?: string
    keywords?: string
    ogImage?: {
      asset: {
        url: string
      }
    }
  }
}

export interface InstructorPageData {
  _id: string
  title: string
  description?: string
  heroSection?: {
    title: string
    description: string
  }
  instructors?: Instructor[]
  seo?: {
    title: string
    description: string
    keywords?: string
    ogImage?: {
      asset: {
        url: string
      }
    }
  }
}
