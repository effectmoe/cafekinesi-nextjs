import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'schoolPageContent',
  title: 'スクールページコンテンツ',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'ページタイトル',
      type: 'string',
      initialValue: 'スクールページコンテンツ',
      hidden: true,
    }),

    // 講座の選び方ガイド
    defineField({
      name: 'selectionGuide',
      title: '講座の選び方ガイド',
      type: 'object',
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

    // 学習の流れ
    defineField({
      name: 'learningFlow',
      title: '学習の流れ',
      type: 'object',
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

    // よくある質問
    defineField({
      name: 'faq',
      title: 'よくある質問（FAQ）',
      type: 'object',
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

    // 資格・認定について
    defineField({
      name: 'certification',
      title: '資格・認定について',
      type: 'object',
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

    // 公開状態
    defineField({
      name: 'isActive',
      title: '公開状態',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'スクールページコンテンツ',
      }
    },
  },
})
