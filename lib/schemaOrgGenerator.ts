import { urlFor } from '@/lib/sanity.client'

interface SchemaOrgGeneratorProps {
  post: any
  siteUrl: string
  siteName: string
}

export function generateSchemaOrg({ post, siteUrl, siteName }: SchemaOrgGeneratorProps): any {
  // schemaEnabledフィールドを使用
  if (!post?.seo?.schemaEnabled) {
    return null
  }

  // カスタムJSON-LDが設定されている場合は優先
  if (post.seo.schemaCustom) {
    try {
      return JSON.parse(post.seo.schemaCustom)
    } catch (error) {
      console.error('Invalid custom JSON-LD:', error)
    }
  }

  const schemaType = post.seo?.schemaType || 'BlogPosting'
  const baseUrl = siteUrl || 'https://cafekinesi.com'
  const postUrl = `${baseUrl}/blog/${post.slug?.current}`

  // 共通のベース構造
  const baseSchema: any = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    '@id': postUrl,
    headline: post.title,
    url: postUrl,
    datePublished: post.publishedAt,
    dateModified: post._updatedAt || post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Unknown Author',
      ...(post.author?.image && {
        image: urlFor(post.author.image).url()
      })
    },
    publisher: {
      '@type': 'Organization',
      name: siteName || 'Cafe Kinesi',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    },
    ...(post.excerpt && { description: post.excerpt }),
    ...(post.mainImage && {
      image: {
        '@type': 'ImageObject',
        url: urlFor(post.mainImage).url(),
        width: 1200,
        height: 630
      }
    }),
    ...(post.seo?.keywords && { keywords: post.seo.keywords.join(', ') })
  }

  // タイプ別の追加フィールド
  switch (schemaType) {
    case 'Article':
    case 'BlogPosting':
    case 'NewsArticle':
      return {
        ...baseSchema,
        ...(post.seo.schema.articleSection && {
          articleSection: post.seo.schema.articleSection
        }),
        ...(post.seo.schema.wordCount && {
          wordCount: post.seo.schema.wordCount
        }),
        ...(post.content && {
          articleBody: extractTextFromPortableText(post.content)
        })
      }

    case 'HowTo':
      const howToSchema = {
        ...baseSchema,
        ...(post.seo.schema.prepTime && {
          prepTime: post.seo.schema.prepTime
        }),
        ...(post.seo.schema.performTime && {
          performTime: post.seo.schema.performTime
        }),
        ...(post.seo.schema.totalTime && {
          totalTime: post.seo.schema.totalTime
        }),
        ...(post.seo.schema.supply && {
          supply: post.seo.schema.supply.map((item: string) => ({
            '@type': 'HowToSupply',
            name: item
          }))
        }),
        ...(post.seo.schema.tool && {
          tool: post.seo.schema.tool.map((item: string) => ({
            '@type': 'HowToTool',
            name: item
          }))
        })
      }

      // HowToのステップを生成（contentから抽出または手動設定）
      if (post.content) {
        const steps = extractStepsFromContent(post.content)
        if (steps.length > 0) {
          howToSchema.step = steps
        }
      }

      return howToSchema

    case 'Recipe':
      return {
        ...baseSchema,
        ...(post.seo.schema.prepTime && {
          prepTime: post.seo.schema.prepTime
        }),
        ...(post.seo.schema.totalTime && {
          totalTime: post.seo.schema.totalTime
        }),
        ...(post.seo.schema.recipeYield && {
          recipeYield: post.seo.schema.recipeYield
        }),
        ...(post.seo.schema.recipeCuisine && {
          recipeCuisine: post.seo.schema.recipeCuisine
        }),
        ...(post.seo.schema.ingredients && {
          recipeIngredient: post.seo.schema.ingredients
        }),
        ...(post.seo.schema.nutrition && {
          nutrition: {
            '@type': 'NutritionInformation',
            ...post.seo.schema.nutrition
          }
        }),
        ...(post.content && {
          recipeInstructions: extractStepsFromContent(post.content).map((step: any, index: number) => ({
            '@type': 'HowToStep',
            name: `Step ${index + 1}`,
            text: step.text || step.name
          }))
        })
      }

    case 'FAQPage':
      const faqItems = post.faq?.map((item: any) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer
        }
      })) || []

      if (faqItems.length > 0) {
        return {
          ...baseSchema,
          mainEntity: faqItems
        }
      }
      return baseSchema

    case 'Event':
      return {
        ...baseSchema,
        ...(post.seo.schema.eventLocation && {
          location: {
            '@type': 'Place',
            name: post.seo.schema.eventLocation.name,
            address: {
              '@type': 'PostalAddress',
              streetAddress: post.seo.schema.eventLocation.address
            }
          }
        }),
        ...(post.seo.schema.eventStartDate && {
          startDate: post.seo.schema.eventStartDate
        }),
        ...(post.seo.schema.eventEndDate && {
          endDate: post.seo.schema.eventEndDate
        }),
        ...(post.seo.schema.eventStatus && {
          eventStatus: `https://schema.org/${post.seo.schema.eventStatus}`
        })
      }

    case 'Product':
      return {
        ...baseSchema,
        ...(post.seo.schema.productPrice && {
          offers: {
            '@type': 'Offer',
            price: post.seo.schema.productPrice.price,
            priceCurrency: post.seo.schema.productPrice.currency || 'JPY',
            availability: post.seo.schema.productAvailability
              ? `https://schema.org/${post.seo.schema.productAvailability}`
              : 'https://schema.org/InStock'
          }
        })
      }

    case 'Review':
      return {
        ...baseSchema,
        ...(post.seo.schema.itemReviewed && {
          itemReviewed: {
            '@type': post.seo.schema.itemReviewed.type || 'Thing',
            name: post.seo.schema.itemReviewed.name
          }
        }),
        ...(post.seo.schema.reviewRating && {
          reviewRating: {
            '@type': 'Rating',
            ratingValue: post.seo.schema.reviewRating.ratingValue,
            bestRating: post.seo.schema.reviewRating.bestRating || 5,
            worstRating: post.seo.schema.reviewRating.worstRating || 1
          }
        })
      }

    default:
      return baseSchema
  }
}

// PortableTextから純粋なテキストを抽出
function extractTextFromPortableText(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return ''

  return blocks
    .filter(block => block._type === 'block')
    .map(block => {
      if (block.children && Array.isArray(block.children)) {
        return block.children
          .filter((child: any) => child._type === 'span')
          .map((child: any) => child.text)
          .join('')
      }
      return ''
    })
    .join('\n\n')
}

// コンテンツからステップを抽出（h2やh3をステップとして認識）
function extractStepsFromContent(blocks: any[]): any[] {
  if (!blocks || !Array.isArray(blocks)) return []

  const steps: any[] = []
  let currentStep: any = null

  blocks.forEach(block => {
    if (block._type === 'block') {
      // h2またはh3を新しいステップとして認識
      if (block.style === 'h2' || block.style === 'h3') {
        if (currentStep) {
          steps.push(currentStep)
        }
        const stepText = block.children
          ?.filter((child: any) => child._type === 'span')
          ?.map((child: any) => child.text)
          ?.join('') || ''

        currentStep = {
          '@type': 'HowToStep',
          name: stepText,
          text: ''
        }
      } else if (currentStep) {
        // 通常のパラグラフはステップの説明として追加
        const text = block.children
          ?.filter((child: any) => child._type === 'span')
          ?.map((child: any) => child.text)
          ?.join('') || ''

        if (text) {
          currentStep.text += (currentStep.text ? '\n' : '') + text
        }
      }
    }
  })

  if (currentStep) {
    steps.push(currentStep)
  }

  return steps
}

// BreadcrumbList Schema生成
export function generateBreadcrumbSchema(post: any, siteUrl: string, siteName: string): any {
  const baseUrl = siteUrl || 'https://cafekinesi.com'

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@id': baseUrl,
          name: siteName || 'ホーム'
        }
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@id': `${baseUrl}/blog`,
          name: 'ブログ'
        }
      },
      {
        '@type': 'ListItem',
        position: 3,
        item: {
          '@id': `${baseUrl}/blog/${post.slug?.current}`,
          name: post.title
        }
      }
    ]
  }
}