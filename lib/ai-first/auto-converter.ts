import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'e4aqw590',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
})

/**
 * AI-First自動変換システム
 */
export class AIFirstAutoConverter {

  /**
   * Course → Service自動変換
   */
  async convertCourseToService(courseId: string): Promise<any | null> {
    try {
      console.log(`[Auto Converter] Converting course ${courseId} to service...`)

      // 講座データを取得
      const course = await client.fetch(`*[_type == "course" && _id == $id][0] {
        _id,
        title,
        courseId,
        description,
        price,
        duration,
        isActive,
        slug
      }`, { id: courseId })

      if (!course) {
        console.log(`[Auto Converter] Course ${courseId} not found`)
        return null
      }

      // AI検索キーワードを生成
      const aiSearchKeywords = this.generateCourseKeywords(course.title, course.courseId)

      // よくある質問を生成
      const aiFAQ = [
        {
          question: `${course.title}とはどのような講座ですか？`,
          answer: course.description || `${course.title}について詳しくはお問い合わせください。`
        },
        {
          question: `${course.title}の料金はいくらですか？`,
          answer: course.price ? `${course.price}円です。` : '料金についてはお問い合わせください。'
        },
        {
          question: `${course.title}の期間はどのくらいですか？`,
          answer: course.duration || '期間についてはお問い合わせください。'
        }
      ]

      // Serviceエンティティを作成
      const service = {
        _id: `service-${course.courseId || course._id.replace('drafts.', '')}`,
        _type: 'service',
        name: course.title,
        serviceType: 'course',
        category: 'cafekinesi',

        // AI検索最適化
        aiSearchKeywords,
        aiQuickAnswer: course.description ? course.description.substring(0, 100) : `${course.title}について詳しくご案内いたします。`,
        aiFAQ,

        // 詳細情報
        description: course.description ? [
          {
            _type: 'block',
            style: 'normal',
            children: [{ _type: 'span', text: course.description }]
          }
        ] : [],

        targetAudience: this.getTargetAudience(course.title),
        benefits: this.getBenefits(course.title),

        pricing: {
          price: course.price ? parseFloat(course.price.replace(/[^0-9]/g, '')) : null,
          currency: 'JPY',
          unit: 'コース',
          notes: course.price ? '' : '料金はお問い合わせください'
        },

        duration: this.parseDuration(course.duration),

        schedule: {
          frequency: '定期開催',
          isOnline: true,
          location: 'オンライン・対面'
        },

        // メタデータ
        slug: course.slug || {
          _type: 'slug',
          current: course.courseId || course.title.toLowerCase().replace(/\s+/g, '-')
        },
        isActive: course.isActive !== false,
        popularity: this.getPopularity(course.title)
      }

      // Serviceエンティティを作成または更新
      await client.createOrReplace(service)
      console.log(`[Auto Converter] ✅ Service created: ${service.name}`)

      return service

    } catch (error) {
      console.error(`[Auto Converter] Error converting course ${courseId}:`, error)
      return null
    }
  }

  /**
   * BlogPost → AI最適化コンテンツ変換
   */
  async convertBlogPostToAIContent(postId: string): Promise<any | null> {
    try {
      console.log(`[Auto Converter] Converting blog post ${postId} to AI content...`)

      const post = await client.fetch(`*[_type == "blogPost" && _id == $id][0] {
        _id,
        title,
        content,
        excerpt,
        slug,
        author,
        category,
        publishedAt,
        isActive
      }`, { id: postId })

      if (!post) {
        console.log(`[Auto Converter] Blog post ${postId} not found`)
        return null
      }

      // AI検索キーワードを生成
      const aiSearchKeywords = [
        'ブログ',
        '記事',
        post.title,
        post.category?.title || '',
        ...this.extractKeywordsFromText(post.title + ' ' + (post.excerpt || ''))
      ].filter(Boolean)

      // AI最適化コンテンツを作成
      const aiContent = {
        _id: `ai-content-${post._id.replace('drafts.', '')}`,
        _type: 'aiContent',
        title: post.title,
        contentType: 'blog',

        // AI検索最適化
        aiSearchKeywords,
        aiSummary: post.excerpt || this.generateSummary(post.content),

        // 元データの参照
        originalContent: {
          _type: 'reference',
          _ref: post._id
        },

        // メタデータ
        isActive: post.isActive !== false,
        publishedAt: post.publishedAt
      }

      await client.createOrReplace(aiContent)
      console.log(`[Auto Converter] ✅ AI Content created: ${aiContent.title}`)

      return aiContent

    } catch (error) {
      console.error(`[Auto Converter] Error converting blog post ${postId}:`, error)
      return null
    }
  }

  /**
   * 講座向けAI検索キーワード生成
   */
  private generateCourseKeywords(title: string, courseId?: string): string[] {
    const baseKeywords = [
      '講座',
      'コース',
      'どんな講座',
      'どのような講座',
      'カフェキネシ講座',
      title,
      courseId || ''
    ]

    // 講座別の特有キーワード
    const specificKeywords: string[] = []

    if (title.includes('カフェキネシⅠ')) {
      specificKeywords.push('基礎', '入門', '初心者', 'カフェキネシ1')
    }
    if (title.includes('チャクラ')) {
      specificKeywords.push('チャクラ', 'chakra', 'バランス')
    }
    if (title.includes('ピーチタッチ')) {
      specificKeywords.push('ピーチタッチ', 'セルフケア', '自分で')
    }
    if (title.includes('HELP')) {
      specificKeywords.push('HELP', 'ヘルプ', 'セルフケア')
    }
    if (title.includes('TAO')) {
      specificKeywords.push('TAO', 'タオ', '五行', '日本人')
    }
    if (title.includes('ハッピーオーラ')) {
      specificKeywords.push('ハッピーオーラ', 'オーラ', 'エネルギー')
    }

    return [...baseKeywords, ...specificKeywords].filter(Boolean)
  }

  /**
   * テキストからキーワード抽出（簡易版）
   */
  private extractKeywordsFromText(text: string): string[] {
    // 簡易的なキーワード抽出
    const words = text.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF\w]+/g) || []
    return words
      .filter(word => word.length >= 2)
      .slice(0, 10) // 上位10個まで
  }

  /**
   * 要約生成（簡易版）
   */
  private generateSummary(content: any): string {
    if (typeof content === 'string') {
      return content.substring(0, 200) + '...'
    }
    if (Array.isArray(content)) {
      const text = content.map(block =>
        block.children?.map((child: any) => child.text).join('') || ''
      ).join(' ')
      return text.substring(0, 200) + '...'
    }
    return 'コンテンツの要約'
  }

  /**
   * 対象者決定
   */
  private getTargetAudience(title: string): string {
    if (title.includes('カフェキネシⅠ')) return '初心者・セラピストを目指す方'
    if (title.includes('チャクラ')) return 'より深いスキルを求める方'
    if (title.includes('ピーチタッチ')) return 'セルフケアを学びたい方'
    if (title.includes('HELP')) return 'セルフケアに興味のある方'
    if (title.includes('TAO')) return '東洋思想に興味のある方'
    if (title.includes('ハッピーオーラ')) return 'エネルギーワークに興味のある方'
    return 'キネシオロジーに興味のある方'
  }

  /**
   * メリット生成
   */
  private getBenefits(title: string): string[] {
    const commonBenefits = ['ストレス軽減', '心身のバランス向上', '実践的スキル習得']

    if (title.includes('カフェキネシⅠ')) return [...commonBenefits, 'セラピストとしての基礎', '人を癒すスキル']
    if (title.includes('チャクラ')) return [...commonBenefits, 'チャクラバランス', 'エネルギー調整']
    if (title.includes('ピーチタッチ')) return [...commonBenefits, 'セルフケア能力', '日常でのケア']
    if (title.includes('HELP')) return [...commonBenefits, '自己肯定感向上', 'インナーチャイルド癒し']
    if (title.includes('TAO')) return [...commonBenefits, '五行理論の理解', '日本人の精神性']
    if (title.includes('ハッピーオーラ')) return [...commonBenefits, 'オーラの輝き', 'エネルギーの活性化']

    return commonBenefits
  }

  /**
   * 期間解析
   */
  private parseDuration(duration: string | null): any {
    if (!duration) return { hours: 2, minutes: 0, sessions: 1 }

    const hours = duration.match(/(\d+)時間/) ? parseInt(duration.match(/(\d+)時間/)![1]) : 2
    return { hours, minutes: 0, sessions: 1 }
  }

  /**
   * 人気度算出
   */
  private getPopularity(title: string): number {
    if (title.includes('カフェキネシⅠ')) return 85
    if (title.includes('チャクラ')) return 75
    if (title.includes('ピーチタッチ')) return 80
    if (title.includes('HELP')) return 70
    if (title.includes('TAO')) return 65
    if (title.includes('ハッピーオーラ')) return 60
    return 50
  }
}