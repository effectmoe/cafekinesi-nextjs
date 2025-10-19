import { defineField, defineType } from 'sanity'

// AI-First: 組織エンティティ
export default defineType({
  name: 'organization',
  title: '組織 (AI-First)',
  type: 'document',
  icon: () => '⚠️',
  description: '📍 使用箇所: なし | ステータス: ⚠️ 未実装 | AI検索用の組織情報（将来的な実装を想定）',

  groups: [
    { name: 'ai', title: 'AI検索情報' },
    { name: 'basic', title: '基本情報' },
    { name: 'detail', title: '詳細情報' },
    { name: 'relations', title: '関連情報' }
  ],

  fields: [
    // ========== AI検索最適化 ==========
    defineField({
      name: 'aiSearchKeywords',
      title: 'AI検索キーワード',
      description: '「会社について」「どんな組織？」などの質問に対応',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'ai',
      validation: Rule => Rule.required(),
      initialValue: ['カフェキネシ', 'Cafe Kinesi', '会社', '組織']
    }),

    defineField({
      name: 'aiElevatorPitch',
      title: 'AIエレベーターピッチ',
      description: '30秒で説明する組織概要',
      type: 'text',
      group: 'ai',
      validation: Rule => Rule.required()
    }),

    // ========== 基本情報 ==========
    defineField({
      name: 'name',
      title: '組織名',
      type: 'string',
      group: 'basic',
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'tagline',
      title: 'タグライン',
      type: 'string',
      group: 'basic',
      description: '一言で表すと'
    }),

    defineField({
      name: 'established',
      title: '設立年',
      type: 'string',
      group: 'basic'
    }),

    // ========== 詳細情報 ==========
    defineField({
      name: 'mission',
      title: 'ミッション',
      type: 'text',
      group: 'detail'
    }),

    defineField({
      name: 'vision',
      title: 'ビジョン',
      type: 'text',
      group: 'detail'
    }),

    defineField({
      name: 'values',
      title: '価値観',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'detail'
    }),

    defineField({
      name: 'history',
      title: '歴史',
      type: 'array',
      group: 'detail',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'year', type: 'string', title: '年' },
            { name: 'event', type: 'string', title: '出来事' }
          ]
        }
      ]
    }),

    defineField({
      name: 'achievements',
      title: '実績',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'detail'
    }),

    defineField({
      name: 'contact',
      title: '連絡先',
      type: 'object',
      group: 'detail',
      fields: [
        { name: 'address', type: 'string', title: '住所' },
        { name: 'phone', type: 'string', title: '電話番号' },
        { name: 'email', type: 'string', title: 'メールアドレス' },
        { name: 'website', type: 'url', title: 'ウェブサイト' }
      ]
    }),

    // ========== 関連情報 ==========
    defineField({
      name: 'founder',
      title: '創業者',
      type: 'reference',
      to: [{ type: 'person' }],
      group: 'relations'
    }),

    defineField({
      name: 'representatives',
      title: '代表者',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'person' }]
        }
      ],
      group: 'relations'
    }),

    defineField({
      name: 'staff',
      title: 'スタッフ',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'person' }]
        }
      ],
      group: 'relations'
    }),

    defineField({
      name: 'services',
      title: '提供サービス',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [
            { type: 'course' },
            { type: 'event' }
          ]
        }
      ],
      group: 'relations'
    }),

    // ========== メタデータ ==========
    defineField({
      name: 'slug',
      title: 'スラッグ',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      }
    }),

    defineField({
      name: 'isActive',
      title: '有効',
      type: 'boolean',
      initialValue: true
    })
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'tagline',
      keywords: 'aiSearchKeywords'
    },
    prepare(selection) {
      const { title, subtitle, keywords } = selection
      return {
        title,
        subtitle: `${subtitle || 'タグライン未設定'} | AI: ${keywords?.slice(0, 2).join(', ')}`
      }
    }
  }
})