import { SchemaValidation } from '@/types/schema.types'

export class SchemaValidator {
  private requiredFields: Record<string, string[]> = {
    Article: ['headline', 'author', 'publisher', 'datePublished'],
    Product: ['name', 'offers'],
    FAQPage: ['mainEntity'],
    Event: ['name', 'startDate', 'location'],
    Person: ['name'],
    Organization: ['name'],
    WebPage: ['name']
  }

  private recommendedFields: Record<string, string[]> = {
    Article: ['image', 'dateModified', 'description', 'url'],
    Product: ['image', 'brand', 'aggregateRating', 'description'],
    FAQPage: [],
    Event: ['description', 'image', 'endDate'],
    Person: ['image', 'jobTitle'],
    Organization: ['logo', 'url'],
    WebPage: ['description', 'url']
  }

  validate(schema: any): SchemaValidation {
    const errors: string[] = []
    const warnings: string[] = []

    if (!schema) {
      return {
        valid: false,
        errors: ['Schema is undefined'],
        warnings: [],
        score: 0
      }
    }

    const schemas = Array.isArray(schema) ? schema : [schema]

    schemas.forEach((s, index) => {
      this.validateSingleSchema(s, errors, warnings, index)
    })

    const score = this.calculateScore(schemas[0], errors, warnings)

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      score
    }
  }

  private validateSingleSchema(schema: any, errors: string[], warnings: string[], index: number = 0): void {
    const prefix = index > 0 ? `Schema ${index + 1}: ` : ''

    // 基本検証
    if (!schema['@context']) {
      errors.push(`${prefix}Missing @context`)
    } else if (schema['@context'] !== 'https://schema.org') {
      warnings.push(`${prefix}@context should be 'https://schema.org'`)
    }

    if (!schema['@type']) {
      errors.push(`${prefix}Missing @type`)
      return
    }

    const type = schema['@type']

    // 必須フィールドチェック
    const required = this.requiredFields[type] || []
    required.forEach(field => {
      if (!this.hasField(schema, field)) {
        errors.push(`${prefix}${type}: Missing required field '${field}'`)
      }
    })

    // 推奨フィールドチェック
    const recommended = this.recommendedFields[type] || []
    recommended.forEach(field => {
      if (!this.hasField(schema, field)) {
        warnings.push(`${prefix}${type}: Recommended field '${field}' is missing`)
      }
    })

    // タイプ別詳細検証
    this.validateByType(schema, errors, warnings, prefix)
  }

  private validateByType(schema: any, errors: string[], warnings: string[], prefix: string): void {
    const type = schema['@type']

    switch (type) {
      case 'Article':
        this.validateArticle(schema, errors, warnings, prefix)
        break
      case 'Product':
        this.validateProduct(schema, errors, warnings, prefix)
        break
      case 'FAQPage':
        this.validateFAQ(schema, errors, warnings, prefix)
        break
      case 'Event':
        this.validateEvent(schema, errors, warnings, prefix)
        break
    }
  }

  private validateArticle(schema: any, errors: string[], warnings: string[], prefix: string): void {
    // 画像検証
    if (schema.image && !Array.isArray(schema.image)) {
      warnings.push(`${prefix}Article: Image should be an array for better compatibility`)
    }

    // 日付フォーマット検証
    if (schema.datePublished && !this.isValidDate(schema.datePublished)) {
      errors.push(`${prefix}Article: Invalid datePublished format (use ISO 8601)`)
    }

    if (schema.dateModified && !this.isValidDate(schema.dateModified)) {
      warnings.push(`${prefix}Article: Invalid dateModified format (use ISO 8601)`)
    }

    // Publisher検証
    if (schema.publisher && !schema.publisher.logo) {
      warnings.push(`${prefix}Article: Publisher should include a logo`)
    }

    // Headline length check
    if (schema.headline && schema.headline.length > 110) {
      warnings.push(`${prefix}Article: Headline is too long (${schema.headline.length} chars, recommended < 110)`)
    }
  }

  private validateProduct(schema: any, errors: string[], warnings: string[], prefix: string): void {
    // Offers検証
    if (schema.offers) {
      if (!schema.offers.price && schema.offers.price !== 0) {
        errors.push(`${prefix}Product: Offers must include price`)
      }
      if (!schema.offers.priceCurrency) {
        warnings.push(`${prefix}Product: Offers should include priceCurrency`)
      }
      if (!schema.offers.availability) {
        warnings.push(`${prefix}Product: Offers should include availability`)
      }
    }

    // 画像検証
    if (!schema.image || (Array.isArray(schema.image) && schema.image.length === 0)) {
      warnings.push(`${prefix}Product: At least one image is highly recommended`)
    }
  }

  private validateFAQ(schema: any, errors: string[], warnings: string[], prefix: string): void {
    if (schema.mainEntity && Array.isArray(schema.mainEntity)) {
      if (schema.mainEntity.length === 0) {
        errors.push(`${prefix}FAQPage: mainEntity array is empty`)
      }

      schema.mainEntity.forEach((item: any, index: number) => {
        if (!item.name) {
          errors.push(`${prefix}FAQPage: Question ${index + 1} missing 'name' field`)
        }
        if (!item.acceptedAnswer || !item.acceptedAnswer.text) {
          errors.push(`${prefix}FAQPage: Question ${index + 1} missing answer text`)
        }
      })
    }
  }

  private validateEvent(schema: any, errors: string[], warnings: string[], prefix: string): void {
    // 日付検証
    if (schema.startDate && !this.isValidDate(schema.startDate)) {
      errors.push(`${prefix}Event: Invalid startDate format (use ISO 8601)`)
    }

    if (schema.endDate && !this.isValidDate(schema.endDate)) {
      warnings.push(`${prefix}Event: Invalid endDate format (use ISO 8601)`)
    }

    // 場所検証
    if (schema.location && typeof schema.location === 'object') {
      if (!schema.location.name) {
        warnings.push(`${prefix}Event: Location should include a name`)
      }
    }
  }

  private hasField(obj: any, field: string): boolean {
    if (field.includes('.')) {
      const parts = field.split('.')
      let current = obj
      for (const part of parts) {
        if (!current || current[part] === undefined || current[part] === null) {
          return false
        }
        current = current[part]
      }
      return current !== ''
    }
    return obj[field] !== undefined && obj[field] !== null && obj[field] !== ''
  }

  private isValidDate(date: string): boolean {
    if (!date) return false
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?([+-]\d{2}:\d{2}|Z)?)?$/
    return iso8601Regex.test(date)
  }

  private calculateScore(schema: any, errors: string[], warnings: string[]): number {
    if (!schema || !schema['@type']) return 0

    const type = schema['@type']
    const required = this.requiredFields[type] || []
    const recommended = this.recommendedFields[type] || []

    const totalFields = required.length + recommended.length
    if (totalFields === 0) return 100

    const missingRequired = errors.filter(e => e.includes('Missing required')).length
    const missingRecommended = warnings.filter(w => w.includes('Recommended field')).length

    // Required fields contribute 70% of the score
    const requiredScore = required.length > 0
      ? ((required.length - missingRequired) / required.length) * 70
      : 70

    // Recommended fields contribute 30% of the score
    const recommendedScore = recommended.length > 0
      ? ((recommended.length - missingRecommended) / recommended.length) * 30
      : 30

    // Deduct points for critical errors
    const errorPenalty = errors.length * 5
    const warningPenalty = warnings.length * 2

    const finalScore = Math.max(0, Math.round(requiredScore + recommendedScore - errorPenalty - warningPenalty))
    return Math.min(100, finalScore)
  }
}

export const schemaValidator = new SchemaValidator()