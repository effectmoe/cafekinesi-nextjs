import { defineType, defineField } from 'sanity'
import { User } from 'lucide-react'
import { instructorSlugify } from '../../utils/slugify'

export default defineType({
  name: 'instructor',
  title: 'インストラクター',
  type: 'document',
  icon: User,
  description: '📍 使用箇所: /instructor, /instructor/[prefecture]/[slug] | ステータス: ✅ 使用中 | AI検索対応 | インストラクター情報の管理',
  groups: [
    {
      name: 'ai',
      title: 'AI最適化',
      default: false,
    },
    {
      name: 'basic',
      title: '基本情報',
      default: true,
    },
    {
      name: 'profile',
      title: 'プロフィール',
    },
    {
      name: 'qualifications',
      title: '資格・経歴',
    },
    {
      name: 'courses',
      title: '担当講座',
    },
    {
      name: 'contact',
      title: '連絡先・SNS',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    // ========== AI最適化フィールド ==========
    defineField({
      name: 'useForAI',
      title: 'AI学習に使用',
      type: 'boolean',
      group: 'ai',
      initialValue: true,
      description: 'AIチャットボットでこのインストラクター情報を参照可能にする（デフォルト: ON）',
    }),
    defineField({
      name: 'aiSearchKeywords',
      title: 'AI検索キーワード',
      description: 'AIチャットで検索されるキーワード（例：「インストラクター名」「専門分野」）',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'ai',
    }),
    defineField({
      name: 'aiQuickAnswer',
      title: 'AIクイック回答',
      description: 'このインストラクターについて聞かれたときのAI回答（100文字以内）',
      type: 'text',
      group: 'ai',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'conversationalQueries',
      title: '想定される質問',
      description: 'AIチャットで聞かれそうな質問（「どんな先生？」「専門は？」など）',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'ai',
    }),

    // ========== 既存フィールド ==========
    defineField({
      name: 'name',
      title: '名前',
      type: 'string',
      description: '🔴 必須 | インストラクターの氏名',
      placeholder: '【必須】インストラクター名を入力',
      validation: (Rule) => Rule.required(),
      group: 'basic',
    }),
    defineField({
      name: 'slug',
      title: 'スラッグ',
      type: 'slug',
      description: '🔴 必須 | URLに使用される識別子（名前から自動生成）',
      options: {
        source: 'name',
        maxLength: 96,
        slugify: instructorSlugify,
      },
      validation: (Rule) => Rule.required(),
      group: 'basic',
    }),
    defineField({
      name: 'title',
      title: '肩書き',
      type: 'string',
      description: '例：カフェキネシ公認インストラクター',
      group: 'basic',
    }),
    defineField({
      name: 'image',
      title: 'プロフィール画像',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: '代替テキスト',
          type: 'string',
          description: '🔴 必須',
          placeholder: '【必須】画像の代替テキストを入力',
          validation: (Rule) => Rule.required().error('画像の代替テキスト（アクセシビリティ用）は必須です。'),
        }),
      ],
      group: 'basic',
    }),
    defineField({
      name: 'bio',
      title: '自己紹介',
      type: 'text',
      rows: 5,
      description: '🔴 必須 | 短い自己紹介文',
      placeholder: '【必須】自己紹介を入力',
      validation: (Rule) => Rule.required(),
      group: 'profile',
    }),
    defineField({
      name: 'profileDetails',
      title: '詳細プロフィール',
      type: 'array',
      of: [{
        type: 'block',
        marks: {
          decorators: [
            { title: '太字', value: 'strong' },
            { title: '斜体', value: 'em' },
          ],
        },
      }],
      description: '詳細なプロフィール（複数段落可）',
      group: 'profile',
    }),
    defineField({
      name: 'region',
      title: '活動地域',
      type: 'string',
      description: '🔴 必須 | インストラクターの主な活動地域を選択（地図のフィルタリングに使用されます）',
      options: {
        list: [
          // 北海道
          { title: '北海道', value: '北海道' },
          // 東北
          { title: '青森県', value: '青森県' },
          { title: '岩手県', value: '岩手県' },
          { title: '宮城県', value: '宮城県' },
          { title: '秋田県', value: '秋田県' },
          { title: '山形県', value: '山形県' },
          { title: '福島県', value: '福島県' },
          // 関東
          { title: '茨城県', value: '茨城県' },
          { title: '栃木県', value: '栃木県' },
          { title: '群馬県', value: '群馬県' },
          { title: '埼玉県', value: '埼玉県' },
          { title: '千葉県', value: '千葉県' },
          { title: '東京都', value: '東京都' },
          { title: '神奈川県', value: '神奈川県' },
          // 中部
          { title: '新潟県', value: '新潟県' },
          { title: '富山県', value: '富山県' },
          { title: '石川県', value: '石川県' },
          { title: '福井県', value: '福井県' },
          { title: '山梨県', value: '山梨県' },
          { title: '長野県', value: '長野県' },
          { title: '岐阜県', value: '岐阜県' },
          { title: '静岡県', value: '静岡県' },
          { title: '愛知県', value: '愛知県' },
          // 近畿
          { title: '三重県', value: '三重県' },
          { title: '滋賀県', value: '滋賀県' },
          { title: '京都府', value: '京都府' },
          { title: '大阪府', value: '大阪府' },
          { title: '兵庫県', value: '兵庫県' },
          { title: '奈良県', value: '奈良県' },
          { title: '和歌山県', value: '和歌山県' },
          // 中国
          { title: '鳥取県', value: '鳥取県' },
          { title: '島根県', value: '島根県' },
          { title: '岡山県', value: '岡山県' },
          { title: '広島県', value: '広島県' },
          { title: '山口県', value: '山口県' },
          // 四国
          { title: '徳島県', value: '徳島県' },
          { title: '香川県', value: '香川県' },
          { title: '愛媛県', value: '愛媛県' },
          { title: '高知県', value: '高知県' },
          // 九州・沖縄
          { title: '福岡県', value: '福岡県' },
          { title: '佐賀県', value: '佐賀県' },
          { title: '長崎県', value: '長崎県' },
          { title: '熊本県', value: '熊本県' },
          { title: '大分県', value: '大分県' },
          { title: '宮崎県', value: '宮崎県' },
          { title: '鹿児島県', value: '鹿児島県' },
          { title: '沖縄県', value: '沖縄県' },
          // 海外
          { title: 'アメリカ', value: 'アメリカ' },
          { title: 'ヨーロッパ', value: 'ヨーロッパ' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required().error('活動地域を選択してください。'),
      group: 'basic',
    }),
    defineField({
      name: 'certifications',
      title: '保有資格',
      type: 'array',
      of: [
        defineField({
          name: 'certification',
          title: '資格',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: '資格名',
              type: 'string',
              description: '🔴 必須',
              placeholder: '【必須】資格名を入力',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'organization',
              title: '認定団体',
              type: 'string',
            }),
            defineField({
              name: 'year',
              title: '取得年',
              type: 'number',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              organization: 'organization',
              year: 'year',
            },
            prepare(selection) {
              const { title, organization, year } = selection
              return {
                title: title,
                subtitle: year ? `${organization} (${year}年取得)` : organization,
              }
            },
          },
        }),
      ],
      group: 'qualifications',
    }),
    defineField({
      name: 'experience',
      title: '経歴',
      type: 'array',
      of: [
        defineField({
          name: 'experienceItem',
          title: '経歴項目',
          type: 'object',
          fields: [
            defineField({
              name: 'year',
              title: '年',
              type: 'string',
              description: '例：2020年、2020-2022',
            }),
            defineField({
              name: 'description',
              title: '内容',
              type: 'text',
              rows: 3,
              description: '🔴 必須',
              placeholder: '【必須】経歴の内容を入力',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              year: 'year',
              description: 'description',
            },
            prepare(selection) {
              const { year, description } = selection
              return {
                title: year || '未設定',
                subtitle: description ? description.substring(0, 100) : '',
              }
            },
          },
        }),
      ],
      group: 'qualifications',
    }),
    defineField({
      name: 'teachingCourses',
      title: '担当講座',
      type: 'array',
      of: [
        defineField({
          name: 'course',
          title: '講座',
          type: 'reference',
          to: [{ type: 'course' }],
        }),
      ],
      description: '担当している講座を選択',
      group: 'courses',
    }),
    defineField({
      name: 'specialties',
      title: '専門分野',
      type: 'array',
      of: [{ type: 'string' }],
      description: '専門としている分野（例：アロマセラピー、キネシオロジー）',
      group: 'courses',
    }),
    defineField({
      name: 'email',
      title: 'メールアドレス',
      type: 'string',
      validation: (Rule) => Rule.email(),
      group: 'contact',
    }),
    defineField({
      name: 'phone',
      title: '電話番号',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'website',
      title: 'ウェブサイト',
      type: 'url',
      group: 'contact',
    }),
    defineField({
      name: 'socialLinks',
      title: 'SNSリンク',
      type: 'array',
      of: [
        defineField({
          name: 'socialLink',
          title: 'SNSリンク',
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'プラットフォーム',
              type: 'string',
              description: '🔴 必須',
              options: {
                list: [
                  { title: 'Facebook', value: 'facebook' },
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'Twitter/X', value: 'twitter' },
                  { title: 'LINE', value: 'line' },
                  { title: 'YouTube', value: 'youtube' },
                  { title: 'その他', value: 'other' },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              description: '🔴 必須',
              placeholder: 'https://...',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              platform: 'platform',
              url: 'url',
            },
            prepare(selection) {
              const { platform, url } = selection
              return {
                title: platform,
                subtitle: url,
              }
            },
          },
        }),
      ],
      group: 'contact',
    }),
    defineField({
      name: 'order',
      title: '表示順序',
      type: 'number',
      description: '🔴 必須 | インストラクターの表示順序（小さい番号が上に表示）',
      placeholder: '0',
      validation: (Rule) => Rule.required().min(0),
      initialValue: 0,
      group: 'basic',
    }),
    defineField({
      name: 'isActive',
      title: '公開状態',
      type: 'boolean',
      initialValue: true,
      description: 'チェックを外すと非公開になります',
      group: 'basic',
    }),
    defineField({
      name: 'featured',
      title: '注目インストラクター',
      type: 'boolean',
      initialValue: false,
      description: 'トップページなどに表示する注目インストラクター',
      group: 'basic',
    }),
    defineField({
      name: 'seo',
      title: 'SEO設定',
      type: 'seo',
      group: 'seo',
    }),

    // ========== Schema.org自動生成フィールド（読み取り専用） ==========
    defineField({
      name: 'structuredData',
      title: '構造化データ（自動生成）',
      type: 'object',
      group: 'seo',
      readOnly: true,
      description: 'Webhook経由で自動生成されるSchema.org JSON-LD',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          name: 'schemaOrgType',
          title: 'Schema.orgタイプ',
          type: 'string',
          readOnly: true,
        }),
        defineField({
          name: 'jsonLd',
          title: 'JSON-LD',
          type: 'text',
          rows: 10,
          readOnly: true,
        }),
        defineField({
          name: 'generatedAt',
          title: '生成日時',
          type: 'datetime',
          readOnly: true,
        }),
      ],
    }),

    // ========== AI埋め込み用コンテンツ（自動生成） ==========
    defineField({
      name: 'aiEmbeddingContent',
      title: 'AI埋め込み用コンテンツ（自動生成）',
      type: 'text',
      group: 'ai',
      rows: 5,
      readOnly: true,
      description: 'ベクトルDBに保存されるテキスト（自動生成）',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'title',
      media: 'image',
      order: 'order',
      isActive: 'isActive',
    },
    prepare(selection) {
      const { title, subtitle, media, order, isActive } = selection
      return {
        title: `${order}. ${title}`,
        subtitle: `${subtitle || ''} ${!isActive ? '(非公開)' : ''}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: '表示順序',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: '名前順',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
})
