import { defineType, defineField } from 'sanity'
import { GraduationCap } from 'lucide-react'

export default defineType({
  name: 'schoolPage',
  title: 'スクールページ設定',
  type: 'document',
  icon: GraduationCap,
  groups: [
    {
      name: 'content',
      title: 'コンテンツ',
      default: true,
    },
    {
      name: 'pillar',
      title: 'ピラーページコンテンツ',
    },
    {
      name: 'courses',
      title: '講座設定',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'ページタイトル',
      type: 'string',
      initialValue: 'スクール',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'heroSection',
      title: 'ヒーローセクション',
      type: 'object',
      group: 'content',
      fields: [
        defineField({
          name: 'title',
          title: 'タイトル',
          type: 'string',
          initialValue: 'スクール',
        }),
        defineField({
          name: 'description',
          title: '説明文',
          type: 'text',
          rows: 4,
          initialValue: 'カフェキネシオロジーは、どなたでも気軽に始められるヒーリング技術です。基礎から応用まで、段階的に学べる6つの講座をご用意しています。あなたのペースで、楽しみながら技術を身につけていきましょう。',
        }),
      ],
    }),
    defineField({
      name: 'courseListTitle',
      title: '講座一覧セクションタイトル',
      type: 'string',
      initialValue: '講座一覧',
      group: 'content',
    }),
    defineField({
      name: 'ctaSection',
      title: 'CTAセクション',
      type: 'object',
      group: 'content',
      fields: [
        defineField({
          name: 'title',
          title: 'タイトル',
          type: 'string',
          initialValue: 'まずは体験してみませんか？',
        }),
        defineField({
          name: 'description',
          title: '説明文',
          type: 'text',
          rows: 3,
          initialValue: 'カフェキネシオロジーの魅力を実際に体験していただける、体験講座を定期的に開催しています。お気軽にご参加ください。',
        }),
        defineField({
          name: 'primaryButton',
          title: 'プライマリボタン',
          type: 'object',
          fields: [
            defineField({
              name: 'text',
              title: 'ボタンテキスト',
              type: 'string',
              initialValue: '体験講座のご案内',
            }),
            defineField({
              name: 'link',
              title: 'リンク先',
              type: 'string',
            }),
          ],
        }),
        defineField({
          name: 'secondaryButton',
          title: 'セカンダリボタン',
          type: 'object',
          fields: [
            defineField({
              name: 'text',
              title: 'ボタンテキスト',
              type: 'string',
              initialValue: 'お問い合わせ',
            }),
            defineField({
              name: 'link',
              title: 'リンク先',
              type: 'string',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'featuredCourses',
      title: '注目講座',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'course' }],
        },
      ],
      description: '特に推薦したい講座を選択（空の場合は全講座を表示順で表示）',
      group: 'courses',
    }),

    // ピラーページコンテンツ
    defineField({
      name: 'selectionGuide',
      title: '講座の選び方ガイド',
      type: 'object',
      group: 'pillar',
      fields: [
        {
          name: 'title',
          title: 'タイトル',
          type: 'string',
          initialValue: 'あなたに合った講座の選び方',
        },
        {
          name: 'description',
          title: '説明文',
          type: 'text',
          rows: 8,
        },
        {
          name: 'image',
          title: '画像',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              title: '代替テキスト',
              type: 'string',
            },
          ],
        },
        {
          name: 'points',
          title: 'ポイント',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', title: 'タイトル', type: 'string' },
                { name: 'description', title: '説明', type: 'text', rows: 3 },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'learningFlow',
      title: '学習の流れ',
      type: 'object',
      group: 'pillar',
      fields: [
        {
          name: 'title',
          title: 'タイトル',
          type: 'string',
          initialValue: '学習の流れ・ステップ',
        },
        {
          name: 'description',
          title: '説明文',
          type: 'text',
          rows: 4,
        },
        {
          name: 'steps',
          title: 'ステップ',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'number', title: 'ステップ番号', type: 'number' },
                { name: 'title', title: 'タイトル', type: 'string' },
                { name: 'description', title: '説明', type: 'text', rows: 3 },
                {
                  name: 'image',
                  title: '画像',
                  type: 'image',
                  options: { hotspot: true },
                  fields: [{ name: 'alt', title: '代替テキスト', type: 'string' }],
                },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'faq',
      title: 'よくある質問（FAQ）',
      type: 'object',
      group: 'pillar',
      fields: [
        {
          name: 'title',
          title: 'タイトル',
          type: 'string',
          initialValue: 'よくある質問',
        },
        {
          name: 'items',
          title: '質問と回答',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'question', title: '質問', type: 'string' },
                { name: 'answer', title: '回答', type: 'text', rows: 4 },
              ],
              preview: {
                select: {
                  title: 'question',
                  subtitle: 'answer',
                },
              },
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'certification',
      title: '資格・認定について',
      type: 'object',
      group: 'pillar',
      fields: [
        {
          name: 'title',
          title: 'タイトル',
          type: 'string',
          initialValue: '資格・認定について',
        },
        {
          name: 'description',
          title: '説明文',
          type: 'text',
          rows: 8,
        },
        {
          name: 'image',
          title: '画像',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              title: '代替テキスト',
              type: 'string',
            },
          ],
        },
        {
          name: 'benefits',
          title: '認定取得のメリット',
          type: 'array',
          of: [{ type: 'string' }],
        },
      ],
    }),

    defineField({
      name: 'seo',
      title: 'SEO設定',
      type: 'object',
      group: 'seo',
      fields: [
        defineField({
          name: 'title',
          title: 'ページタイトル',
          type: 'string',
          initialValue: 'スクール | Cafe Kinesi',
        }),
        defineField({
          name: 'description',
          title: 'メタディスクリプション',
          type: 'text',
          rows: 3,
          initialValue: 'カフェキネシオロジーの各講座をご紹介します。どなたでも気軽に始められる講座から、専門的な技術まで幅広く学べます。',
        }),
        defineField({
          name: 'keywords',
          title: 'キーワード',
          type: 'string',
          initialValue: 'キネシオロジー, スクール, 講座, ヒーリング, セラピー',
        }),
        defineField({
          name: 'ogImage',
          title: 'OGP画像',
          type: 'image',
          options: {
            hotspot: true,
          },
        }),
      ],
    }),
    defineField({
      name: 'isActive',
      title: '公開状態',
      type: 'boolean',
      initialValue: true,
      description: 'チェックを外すとスクールページが非公開になります',
      group: 'content',
    }),
    defineField({
      name: 'lastUpdated',
      title: '最終更新日',
      type: 'datetime',
      description: 'ページに表示される最終更新日（手動で設定可能。未設定の場合は自動更新日が使用されます）',
      group: 'content',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
      },
    }),
  ],
  orderings: [
    {
      title: '最終更新日（新しい順）',
      name: 'lastUpdatedDesc',
      by: [
        { field: 'lastUpdated', direction: 'desc' },
        { field: '_updatedAt', direction: 'desc' },
      ],
    },
    {
      title: '最終更新日（古い順）',
      name: 'lastUpdatedAsc',
      by: [
        { field: 'lastUpdated', direction: 'asc' },
        { field: '_updatedAt', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      isActive: 'isActive',
    },
    prepare(selection) {
      const { title, isActive } = selection
      return {
        title,
        subtitle: !isActive ? '非公開' : '公開中',
      }
    },
  },
})