import {
  Article, Product, FAQPage, BreadcrumbList,
  Organization, WebSite, Person, Event,
  WithContext, Thing
} from 'schema-dts'
import { urlFor } from '@/lib/sanity.client'
import { SanityDocument, SchemaGeneratorConfig } from '@/types/schema.types'

export class SchemaGenerator {
  private config: SchemaGeneratorConfig

  constructor(config: SchemaGeneratorConfig) {
    this.config = config
  }

  // 汎用生成メソッド
  generate(document: SanityDocument): WithContext<Thing> | WithContext<Thing>[] | null {
    if (!document) {
      return null
    }

    const type = document._type
    const generator = this.getGenerator(type)

    if (!generator) {
      return this.generateDefault(document)
    }

    try {
      return generator(document)
    } catch (error) {
      console.error(`Schema generation error for type ${type}:`, error)
      return this.generateDefault(document)
    }
  }

  // タイプ別ジェネレーター取得
  private getGenerator(type: string): ((doc: SanityDocument) => WithContext<Thing>) | null {
    const generators: Record<string, (doc: SanityDocument) => WithContext<Thing>> = {
      'blogPost': (doc) => this.generateArticle(doc),
      'post': (doc) => this.generateArticle(doc),
      'article': (doc) => this.generateArticle(doc),
      'product': (doc) => this.generateProduct(doc),
      'faq': (doc) => this.generateFAQ(doc),
      'event': (doc) => this.generateEvent(doc),
      'person': (doc) => this.generatePerson(doc),
      'author': (doc) => this.generatePerson(doc),
    }

    return generators[type] || null
  }

  // Article Schema生成
  private generateArticle(doc: SanityDocument): WithContext<Article> {
    const images = this.generateImages(doc.mainImage || doc.image)
    const url = this.generateUrl(doc)

    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: doc.seo?.title || doc.title || doc.name || '',
      description: doc.seo?.description || doc.excerpt || doc.description || '',
      image: images,
      datePublished: doc.publishedAt || doc._createdAt,
      dateModified: doc._updatedAt,
      author: doc.author ? this.generateAuthor(doc.author) : {
        '@type': 'Organization',
        name: this.config.siteName
      },
      publisher: {
        '@type': 'Organization',
        name: this.config.siteName,
        logo: {
          '@type': 'ImageObject',
          url: `${this.config.siteUrl}${this.config.logo}`
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url
      },
      url: url,
      keywords: doc.tags?.join(', ') || doc.seo?.keywords?.join(', ') || doc.category
    }
  }

  // Product Schema生成
  private generateProduct(doc: SanityDocument): WithContext<Product> {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: doc.name || doc.title,
      description: doc.description || doc.excerpt,
      image: this.generateImages(doc.images || doc.image),
      brand: doc.brand ? {
        '@type': 'Brand',
        name: doc.brand
      } : undefined,
      offers: {
        '@type': 'Offer',
        url: this.generateUrl(doc),
        priceCurrency: doc.currency || 'JPY',
        price: doc.price?.toString() || '0',
        availability: this.getAvailability(doc.inStock),
        seller: {
          '@type': 'Organization',
          name: this.config.siteName
        }
      },
      aggregateRating: this.generateRating(doc.reviews || doc.ratings),
      sku: doc.sku,
      mpn: doc.mpn
    }
  }

  // FAQ Schema生成
  private generateFAQ(doc: SanityDocument): WithContext<FAQPage> {
    const questions = doc.questions || doc.items || doc.faqs || doc.faq || []

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: questions.map((q: any) => ({
        '@type': 'Question',
        name: q.question || q.title || '',
        acceptedAnswer: {
          '@type': 'Answer',
          text: q.answer || q.content || ''
        }
      }))
    }
  }

  // Event Schema生成
  private generateEvent(doc: SanityDocument): WithContext<Event> {
    return {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: doc.title || doc.name,
      description: doc.description || doc.excerpt,
      startDate: doc.startDate || doc.date,
      endDate: doc.endDate,
      location: doc.location ? {
        '@type': 'Place',
        name: doc.location.name || doc.location,
        address: doc.location.address ? {
          '@type': 'PostalAddress',
          streetAddress: doc.location.address.street,
          addressLocality: doc.location.address.city,
          postalCode: doc.location.address.zip,
          addressCountry: doc.location.address.country || 'JP'
        } : doc.location.address
      } : undefined,
      image: this.generateImages(doc.image),
      organizer: {
        '@type': 'Organization',
        name: doc.organizer?.name || this.config.siteName
      }
    }
  }

  // Person Schema生成
  private generatePerson(doc: SanityDocument): WithContext<Person> {
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: doc.name,
      description: doc.bio || doc.description,
      image: doc.image ? urlFor(doc.image).url() : undefined,
      url: doc.website || this.generateUrl(doc),
      sameAs: doc.socialLinks || [],
      jobTitle: doc.jobTitle || doc.role,
      worksFor: doc.company ? {
        '@type': 'Organization',
        name: doc.company
      } : undefined
    }
  }

  // ヘルパーメソッド
  private generateImages(imageData: any): string[] | undefined {
    if (!imageData) return undefined

    try {
      if (Array.isArray(imageData)) {
        return imageData.map(img => urlFor(img).url())
      }

      return [
        urlFor(imageData).width(1200).height(630).url(),
        urlFor(imageData).width(900).height(900).url(),
        urlFor(imageData).width(1200).height(1200).url()
      ]
    } catch (error) {
      console.warn('Error generating images:', error)
      return undefined
    }
  }

  private generateAuthor(author: any): any {
    if (typeof author === 'string') {
      return { '@type': 'Person', name: author }
    }

    return {
      '@type': 'Person',
      name: author.name,
      description: author.bio,
      image: author.image ? urlFor(author.image).url() : undefined,
      url: author.website
    }
  }

  private generateUrl(doc: SanityDocument): string {
    if (doc.slug?.current) {
      const typeSlug = doc._type === 'blogPost' ? 'blog' : doc._type
      return `${this.config.siteUrl}/${typeSlug}/${doc.slug.current}`
    }
    return `${this.config.siteUrl}/${doc._type}/${doc._id}`
  }

  private getAvailability(inStock?: boolean): string {
    return inStock
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock'
  }

  private generateRating(reviews?: any[]): any {
    if (!reviews || reviews.length === 0) return undefined

    const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0)
    const averageRating = totalRating / reviews.length

    return {
      '@type': 'AggregateRating',
      ratingValue: averageRating.toFixed(1),
      reviewCount: reviews.length
    }
  }

  // デフォルトSchema生成
  private generateDefault(doc: SanityDocument): WithContext<Thing> {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: doc.title || doc.name || 'Untitled',
      description: doc.description || doc.excerpt || '',
      url: this.generateUrl(doc),
      datePublished: doc.publishedAt || doc._createdAt,
      dateModified: doc._updatedAt
    }
  }
}

// シングルトンインスタンス
export const schemaGenerator = new SchemaGenerator({
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Cafe Kinesi',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://cafekinesi-nextjs.vercel.app',
  logo: '/logo.jpeg',
  defaultImage: '/og-image.jpg'
})