import { defineField, defineType } from 'sanity'

// AI-First: 統合された人物エンティティ
export default defineType({
  name: 'person',
  title: '人物 (AI-First)',
  type: 'document',
  icon: () => '⚠️',
  description: '📍 使用箇所: なし | ステータス: ⚠️ 未実装 | 注意: instructorスキーマと重複の可能性',

  // AI最適化グループ
  groups: [
    { name: 'ai', title: 'AI検索情報' },
    { name: 'basic', title: '基本情報' },
    { name: 'detail', title: '詳細情報' },
    { name: 'relations', title: '関連情報' }
  ],

  fields: [
    // ========== AI検索最適化フィールド ==========
    defineField({
      name: 'aiSearchKeywords',
      title: 'AI検索キーワード',
      description: '「代表者は？」「創業者は誰？」などの質問に対応',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'ai',
      validation: Rule => Rule.required(),
      initialValue: []
    }),

    defineField({
      name: 'aiContext',
      title: 'AI文脈情報',
      description: 'この人物について聞かれる可能性のある質問パターン',
      type: 'object',
      group: 'ai',
      fields: [
        {
          name: 'commonQuestions',
          title: 'よくある質問',
          type: 'array',
          of: [{ type: 'string' }]
        },
        {
          name: 'responseTemplate',
          title: 'AI回答テンプレート',
          type: 'text',
          description: 'AIが回答する際の基本形'
        }
      ]
    }),

    defineField({
      name: 'aiPriority',
      title: 'AI検索優先度',
      type: 'number',
      group: 'ai',
      validation: Rule => Rule.min(0).max(10),
      initialValue: 5,
      description: '10が最高。代表者なら10、一般インストラクターなら5'
    }),

    // ========== 基本情報 ==========
    defineField({
      name: 'name',
      title: '名前',
      type: 'string',
      group: 'basic',
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'roles',
      title: '役割',
      type: 'array',
      group: 'basic',
      of: [
        {
          type: 'string',
          options: {
            list: [
              { title: '代表者', value: 'representative' },
              { title: '創業者', value: 'founder' },
              { title: 'インストラクター', value: 'instructor' },
              { title: '講師', value: 'teacher' },
              { title: '著者', value: 'author' },
              { title: 'スタッフ', value: 'staff' }
            ]
          }
        }
      ],
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'primaryRole',
      title: '主要な役割',
      type: 'string',
      group: 'basic',
      description: 'AIが最初に言及する役割'
    }),

    // ========== 詳細情報 ==========
    defineField({
      name: 'profile',
      title: 'プロフィール',
      type: 'object',
      group: 'detail',
      fields: [
        { name: 'birthName', type: 'string', title: '本名' },
        { name: 'location', type: 'string', title: '所在地' },
        { name: 'specialties', type: 'array', of: [{ type: 'string' }], title: '専門分野' },
        { name: 'qualifications', type: 'array', of: [{ type: 'string' }], title: '資格' },
        { name: 'biography', type: 'text', title: '経歴' },
        { name: 'philosophy', type: 'text', title: '理念・哲学' },
        { name: 'message', type: 'text', title: 'メッセージ' }
      ]
    }),

    defineField({
      name: 'activities',
      title: '活動内容',
      type: 'array',
      group: 'detail',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: '活動名' },
            { name: 'description', type: 'text', title: '説明' },
            { name: 'isActive', type: 'boolean', title: '現在も活動中' }
          ]
        }
      ]
    }),

    // ========== 関連情報（グラフ構造） ==========
    defineField({
      name: 'relatedServices',
      title: '提供サービス',
      type: 'array',
      group: 'relations',
      of: [
        {
          type: 'reference',
          to: [
            { type: 'course' },
            { type: 'event' }
          ]
        }
      ]
    }),

    defineField({
      name: 'relatedContent',
      title: '関連コンテンツ',
      type: 'array',
      group: 'relations',
      of: [
        {
          type: 'reference',
          to: [
            { type: 'blogPost' },
            { type: 'page' },
            { type: 'news' }
          ]
        }
      ]
    }),

    defineField({
      name: 'relatedOrganization',
      title: '所属組織',
      type: 'reference',
      group: 'relations',
      to: [{ type: 'organization' }]
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

  // プレビュー設定
  preview: {
    select: {
      title: 'name',
      subtitle: 'primaryRole',
      keywords: 'aiSearchKeywords'
    },
    prepare(selection) {
      const { title, subtitle, keywords } = selection
      return {
        title,
        subtitle: `${subtitle || '役割未設定'} | AI: ${keywords?.slice(0, 3).join(', ') || 'キーワード未設定'}`
      }
    }
  }
})