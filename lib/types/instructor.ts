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
  description?: string
  image?: {
    asset: {
      url: string
    }
    alt?: string
  }
  bio: string
  profileDetails?: any[] // PortableText
  region?: string
  prefecture?: string
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

export interface Service {
  title: string
  description: string
  icon?: string
}

export interface InstructorPageData {
  _id: string
  title: string
  heroSection?: {
    title: string
    description: string
    backgroundImage?: {
      asset: {
        url: string
      }
      alt?: string
    }
  }
  aboutSection?: {
    title: string
    description?: any[] // PortableText
    image?: {
      asset: {
        url: string
      }
      alt?: string
    }
  }
  servicesSection?: {
    title: string
    services?: Service[]
  }
  mapSection?: {
    title: string
    description?: string
  }
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
  isActive: boolean
}
