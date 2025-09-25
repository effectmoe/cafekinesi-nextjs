import { Article, Product, FAQPage, Organization, WithContext } from 'schema-dts'

export interface SanityDocument {
  _id: string
  _type: string
  _createdAt: string
  _updatedAt: string
  title?: string
  name?: string
  slug?: { current: string }
  excerpt?: string
  description?: string
  publishedAt?: string
  mainImage?: any
  image?: any
  images?: any[]
  author?: any
  category?: string
  tags?: string[]
  content?: any[]
  [key: string]: any
}

export interface SchemaGeneratorConfig {
  siteName: string
  siteUrl: string
  logo: string
  defaultImage: string
}

export interface SchemaValidation {
  valid: boolean
  errors: string[]
  warnings: string[]
  score: number
}

export interface SchemaStats {
  total: number
  valid: number
  errors: number
  avgScore: number
  byType: Record<string, number>
}