import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'registrationPage',
  title: 'カフェキネシ登録のご案内',
  type: 'document',
  icon: () => '📝',
  description: '📍 使用箇所: /registration | ステータス: ✅ 使用中 | 会員登録案内ページ',
  fields: [
    defineField({
      name: 'title',
      title: 'ページタイトル（日本語）',
      type: 'string',
      description: '🔴 必須',
      validation: Rule => Rule.required(),
      initialValue: 'カフェキネシ登録のご案内'
    }),
    defineField({
      name: 'titleEn',
      title: 'ページタイトル（英語）',
      type: 'string',
      initialValue: 'REGISTRATION'
    }),
    defineField({
      name: 'showTableOfContents',
      title: '目次を表示',
      type: 'boolean',
      initialValue: true
    }),
    defineField({
      name: 'sections',
      title: 'セクション',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'id',
              title: 'セクションID',
              type: 'string',
              description: 'アンカーリンク用（例: what-is-lovers）'
            },
            {
              name: 'title',
              title: 'セクションタイトル',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'content',
              title: '本文',
              type: 'array',
              of: [
                {
                  type: 'block',
                  marks: {
                    decorators: [
                      { title: '太字', value: 'strong' },
                      { title: '斜体', value: 'em' },
                    ],
                    annotations: [
                      {
                        name: 'link',
                        type: 'object',
                        title: 'リンク',
                        fields: [
                          {
                            name: 'href',
                            type: 'string',
                            title: 'URL'
                          },
                          {
                            name: 'isExternal',
                            type: 'boolean',
                            title: '外部リンク',
                            initialValue: false
                          }
                        ]
                      }
                    ]
                  },
                }
              ]
            },
            {
              name: 'button',
              title: 'リンクボタン（オプション）',
              type: 'object',
              fields: [
                {
                  name: 'show',
                  title: '表示する',
                  type: 'boolean',
                  initialValue: false
                },
                {
                  name: 'text',
                  title: 'ボタンテキスト',
                  type: 'string'
                },
                {
                  name: 'url',
                  title: 'リンク先URL',
                  type: 'string'
                },
                {
                  name: 'isExternal',
                  title: '外部リンク',
                  type: 'boolean',
                  initialValue: true
                },
                {
                  name: 'bgColor',
                  title: '背景色',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'ダークグレー（デフォルト）', value: 'dark' },
                      { title: 'プライマリ（緑）', value: 'primary' },
                      { title: 'セカンダリ（青）', value: 'secondary' },
                      { title: 'アクセント（オレンジ）', value: 'accent' },
                      { title: 'カスタム', value: 'custom' }
                    ]
                  },
                  initialValue: 'dark'
                },
                {
                  name: 'customBgColor',
                  title: 'カスタム背景色',
                  type: 'string',
                  description: 'HEXカラーコード（例: #3B82F6）。背景色で「カスタム」を選択した場合に使用',
                  hidden: ({ parent }: { parent?: { bgColor?: string } }) => parent?.bgColor !== 'custom'
                },
                {
                  name: 'textColor',
                  title: 'テキスト色',
                  type: 'string',
                  options: {
                    list: [
                      { title: '白（デフォルト）', value: 'white' },
                      { title: '黒', value: 'black' },
                      { title: 'カスタム', value: 'custom' }
                    ]
                  },
                  initialValue: 'white'
                },
                {
                  name: 'customTextColor',
                  title: 'カスタムテキスト色',
                  type: 'string',
                  description: 'HEXカラーコード（例: #1F2937）。テキスト色で「カスタム」を選択した場合に使用',
                  hidden: ({ parent }: { parent?: { textColor?: string } }) => parent?.textColor !== 'custom'
                }
              ]
            }
          ],
          preview: {
            select: {
              title: 'title'
            }
          }
        }
      ]
    }),
    defineField({
      name: 'isActive',
      title: '有効化',
      type: 'boolean',
      initialValue: true,
      description: 'このページを公開する場合はONにしてください'
    }),
    defineField({
      name: 'seo',
      title: 'SEO設定',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'SEOタイトル',
          type: 'string',
          initialValue: 'カフェキネシ登録のご案内 | Cafe Kinesi'
        },
        {
          name: 'description',
          title: 'SEO説明文',
          type: 'text',
          rows: 3,
          initialValue: 'カフェキネシオロジーへの会員登録方法のご案内です。会員登録いただくと、講座情報や特典をいち早くお届けします。'
        },
        {
          name: 'keywords',
          title: 'キーワード',
          type: 'string',
          initialValue: 'カフェキネシ, 登録, 会員, キネシオロジー, ヒーリング'
        }
      ]
    })
  ],
  preview: {
    select: {
      title: 'title'
    },
    prepare(selection) {
      return {
        title: selection.title || 'カフェキネシ登録のご案内',
        subtitle: '登録ページ設定'
      }
    }
  }
})
