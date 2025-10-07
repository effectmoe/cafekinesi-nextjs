import type { Course, EducationalOrganization } from 'schema-dts'
import { urlFor } from '@/lib/sanity.client'

export interface SchemaGeneratorConfig {
  siteName: string
  siteUrl: string
  logo: string
  defaultImage: string
}

/**
 * Schema.org自動生成エンジン
 * DeepSeekで動作するように設計
 */
export class SchemaGenerator {
  private config: SchemaGeneratorConfig

  constructor(config: SchemaGeneratorConfig) {
    this.config = config
  }

  /**
   * ドキュメントタイプに応じてSchema.orgを生成
   */
  generate(document: any): any {
    const type = document._type

    switch (type) {
      case 'course':
        return this.generateCourse(document)
      case 'instructor':
        return this.generatePerson(document)
      case 'blogPost':
      case 'article':
        return this.generateArticle(document)
      default:
        return this.generateDefault(document)
    }
  }

  /**
   * 講座（Course）のSchema.org生成
   */
  private generateCourse(doc: any): Course {
    const url = `${this.config.siteUrl}/school/${doc.courseId || doc.slug?.current}`

    const schema: Course = {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: doc.title,
      description: doc.description || doc.aiQuickAnswer || '',
      provider: {
        '@type': 'Organization',
        name: this.config.siteName,
        url: this.config.siteUrl,
      },
      url,
    }

    // 画像
    if (doc.image) {
      schema.image = this.generateImageUrl(doc.image)
    }

    // 料金情報
    if (doc.price?.amount) {
      schema.offers = {
        '@type': 'Offer',
        price: doc.price.amount.toString(),
        priceCurrency: 'JPY',
      }
    }

    // 所要時間
    if (doc.duration?.hours || doc.duration?.sessions) {
      const hours = doc.duration.hours || 0
      const sessions = doc.duration.sessions || 1
      schema.timeRequired = `PT${hours * sessions}H`
    }

    // インストラクター
    if (doc.instructorInfo?.name) {
      schema.instructor = {
        '@type': 'Person',
        name: doc.instructorInfo.name,
        ...(doc.instructorInfo.image && {
          image: this.generateImageUrl(doc.instructorInfo.image),
        }),
      }
    }

    return schema
  }

  /**
   * インストラクター（Person）のSchema.org生成
   */
  private generatePerson(doc: any): any {
    const url = doc.slug?.current
      ? `${this.config.siteUrl}/instructor/${doc.prefecture || 'unknown'}/${doc.slug.current}`
      : `${this.config.siteUrl}/instructor`

    const schema: any = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: doc.name,
      url,
    }

    // 肩書き
    if (doc.title) {
      schema.jobTitle = doc.title
    }

    // プロフィール画像
    if (doc.image) {
      schema.image = this.generateImageUrl(doc.image)
    }

    // 経歴
    if (doc.bio || doc.profile?.biography) {
      schema.description = doc.bio || doc.profile.biography
    }

    // 専門分野
    if (doc.profile?.specialties && doc.profile.specialties.length > 0) {
      schema.knowsAbout = doc.profile.specialties
    }

    // 資格
    if (doc.profile?.qualifications && doc.profile.qualifications.length > 0) {
      schema.hasCredential = doc.profile.qualifications.map((qual: string) => ({
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: qual,
      }))
    }

    // 所在地
    if (doc.prefecture) {
      schema.address = {
        '@type': 'PostalAddress',
        addressRegion: doc.prefecture,
        addressCountry: 'JP',
      }
    }

    // 連絡先
    if (doc.email || doc.contact?.email) {
      schema.email = doc.email || doc.contact.email
    }

    if (doc.phone || doc.contact?.phone) {
      schema.telephone = doc.phone || doc.contact.phone
    }

    // SNS
    if (doc.contact?.socialLinks && doc.contact.socialLinks.length > 0) {
      schema.sameAs = doc.contact.socialLinks
        .filter((link: any) => link.url)
        .map((link: any) => link.url)
    }

    return schema
  }

  /**
   * ブログ記事（Article）のSchema.org生成
   */
  private generateArticle(doc: any): any {
    const url = `${this.config.siteUrl}/blog/${doc.slug?.current}`

    const schema: any = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: doc.title,
      description: doc.excerpt || '',
      url,
      datePublished: doc.publishedAt || doc._createdAt,
      dateModified: doc._updatedAt,
      author: {
        '@type': 'Person',
        name: doc.author?.name || 'Unknown',
      },
      publisher: {
        '@type': 'Organization',
        name: this.config.siteName,
        logo: {
          '@type': 'ImageObject',
          url: `${this.config.siteUrl}${this.config.logo}`,
        },
      },
    }

    // メイン画像
    if (doc.mainImage) {
      schema.image = {
        '@type': 'ImageObject',
        url: this.generateImageUrl(doc.mainImage),
        width: 1200,
        height: 630,
      }
    }

    return schema
  }

  /**
   * デフォルトのSchema.org生成
   */
  private generateDefault(doc: any): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: doc.title || doc.name || 'Untitled',
      description: doc.description || doc.excerpt || '',
      url: `${this.config.siteUrl}/${doc._type}/${doc.slug?.current || doc._id}`,
    }
  }

  /**
   * Sanity画像URLを生成
   */
  private generateImageUrl(image: any): string {
    if (!image) return this.config.defaultImage

    try {
      return urlFor(image).width(1200).height(630).url()
    } catch {
      return this.config.defaultImage
    }
  }

  /**
   * Schema.orgをJSON文字列として生成
   */
  generateJsonLd(document: any): string {
    const schema = this.generate(document)
    return JSON.stringify(schema, null, 2)
  }
}

// シングルトンインスタンス
export const schemaGenerator = new SchemaGenerator({
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Café Kinesi',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://cafekinesi-nextjs.vercel.app',
  logo: '/logo.png',
  defaultImage: '/og-image.jpg',
})
