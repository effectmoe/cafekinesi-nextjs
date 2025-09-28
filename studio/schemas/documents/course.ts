import { defineType, defineField } from 'sanity'
import { BookOpen } from 'lucide-react'

export default defineType({
  name: 'course',
  title: '講座',
  type: 'document',
  icon: BookOpen,
  fields: [
    defineField({
      name: 'courseId',
      title: '講座ID',
      type: 'string',
      description: 'URLに使用される識別子（例：kinesi1, peach-touch）',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: '講座名',
      type: 'string',
      description: '例：カフェキネシⅠ',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'サブタイトル',
      type: 'string',
      description: '例：基礎セラピー講座',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: '講座説明',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'features',
      title: '講座の特徴',
      type: 'array',
      of: [{ type: 'string' }],
      description: '講座の主な特徴をリスト形式で入力',
      validation: (Rule) => Rule.required().min(3),
    }),
    defineField({
      name: 'image',
      title: '講座画像',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: '代替テキスト',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'backgroundClass',
      title: '背景色クラス',
      type: 'string',
      options: {
        list: [
          { title: 'ベージュ', value: 'album-beige' },
          { title: 'ブルーグレー', value: 'album-blue-gray' },
          { title: 'パープル', value: 'album-purple' },
          { title: 'ティール', value: 'album-teal' },
          { title: 'ライトグレー', value: 'album-light-gray' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'recommendations',
      title: 'こんな方におすすめ',
      type: 'array',
      of: [{ type: 'string' }],
      description: '受講を推奨する対象者',
    }),
    defineField({
      name: 'effects',
      title: '受講後の効果',
      type: 'array',
      of: [{ type: 'string' }],
      description: '受講後に期待できる効果',
    }),
    defineField({
      name: 'order',
      title: '表示順序',
      type: 'number',
      description: '講座の表示順序（小さい番号が上に表示）',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'isActive',
      title: '公開状態',
      type: 'boolean',
      initialValue: true,
      description: 'チェックを外すと非公開になります',
    }),
    defineField({
      name: 'price',
      title: '受講料',
      type: 'object',
      fields: [
        defineField({
          name: 'amount',
          title: '金額',
          type: 'number',
        }),
        defineField({
          name: 'unit',
          title: '単位',
          type: 'string',
          initialValue: '円',
        }),
        defineField({
          name: 'note',
          title: '備考',
          type: 'string',
          description: '例：税込、教材費込み',
        }),
      ],
    }),
    defineField({
      name: 'duration',
      title: '講座時間',
      type: 'object',
      fields: [
        defineField({
          name: 'hours',
          title: '時間数',
          type: 'number',
        }),
        defineField({
          name: 'sessions',
          title: '回数',
          type: 'number',
        }),
        defineField({
          name: 'note',
          title: '備考',
          type: 'string',
          description: '例：全6回、1回3時間',
        }),
      ],
    }),
    defineField({
      name: 'prerequisites',
      title: '受講条件',
      type: 'text',
      description: '受講に必要な前提条件がある場合に記入',
    }),
    defineField({
      name: 'applicationLink',
      title: '申込リンク',
      type: 'url',
      description: '外部の申込フォームがある場合のURL',
    }),
    // 講座詳細ページ用フィールド
    defineField({
      name: 'tableOfContents',
      title: '目次',
      type: 'array',
      of: [{ type: 'string' }],
      description: '詳細ページの目次項目',
    }),
    defineField({
      name: 'sections',
      title: '詳細セクション',
      type: 'array',
      of: [
        defineField({
          name: 'section',
          title: 'セクション',
          type: 'object',
          fields: [
            defineField({
              name: 'id',
              title: 'セクションID',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'セクションタイトル',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'content',
              title: 'セクション内容',
              type: 'text',
              rows: 5,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              content: 'content',
            },
            prepare(selection) {
              const { title, content } = selection
              return {
                title: title,
                subtitle: content ? content.substring(0, 100) + '...' : '',
              }
            },
          },
        }),
      ],
      description: '詳細ページで表示するセクション',
    }),
    defineField({
      name: 'gallery',
      title: 'ギャラリー',
      type: 'array',
      of: [
        defineField({
          name: 'image',
          title: '画像',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              title: '代替テキスト',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
      description: '詳細ページで表示する追加画像',
    }),
    defineField({
      name: 'instructorInfo',
      title: 'インストラクター情報',
      type: 'object',
      fields: [
        defineField({
          name: 'name',
          title: 'インストラクター名',
          type: 'string',
        }),
        defineField({
          name: 'bio',
          title: '経歴・紹介',
          type: 'text',
          rows: 3,
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
            }),
          ],
        }),
        defineField({
          name: 'profileUrl',
          title: 'プロフィールページURL',
          type: 'url',
        }),
      ],
      description: '詳細ページで表示するインストラクター情報',
    }),
    defineField({
      name: 'relatedCourses',
      title: '関連講座',
      type: 'array',
      of: [
        defineField({
          name: 'relatedCourse',
          title: '関連講座',
          type: 'reference',
          to: [{ type: 'course' }],
        }),
      ],
      description: '詳細ページで推奨する関連講座',
    }),
    defineField({
      name: 'seo',
      title: 'SEO設定',
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'image',
      order: 'order',
      isActive: 'isActive',
    },
    prepare(selection) {
      const { title, subtitle, media, order, isActive } = selection
      return {
        title: `${order}. ${title}`,
        subtitle: `${subtitle} ${!isActive ? '(非公開)' : ''}`,
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
  ],
})