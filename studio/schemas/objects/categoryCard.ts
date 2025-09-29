import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'categoryCard',
  title: 'カテゴリーカード',
  type: 'object',
  fields: [
    defineField({
      name: 'titleJa',
      title: '日本語タイトル',
      type: 'string',
      validation: Rule => Rule.required().error('日本語タイトルは必須です')
    }),
    defineField({
      name: 'titleEn',
      title: '英語タイトル',
      type: 'string',
      validation: Rule => Rule.required().error('英語タイトルは必須です')
    }),
    defineField({
      name: 'image',
      title: 'カード画像',
      type: 'image',
      options: {
        hotspot: true
      },
      // 画像は任意フィールドに変更（ホームページで画像をアップロードするまで）
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: '代替テキスト',
          validation: Rule => Rule.required()
        }
      ]
    }),
    defineField({
      name: 'colorScheme',
      title: 'カラーテーマ',
      type: 'string',
      options: {
        list: [
          { title: 'ベージュ', value: 'album-beige' },
          { title: 'ブルーグレー', value: 'album-blue-gray' },
          { title: 'ライトグレー', value: 'album-light-gray' },
          { title: 'パープル', value: 'album-purple' },
          { title: 'ティール', value: 'album-teal' },
          { title: 'ピンク', value: 'album-pink' }
        ],
        layout: 'radio'
      },
      validation: Rule => Rule.required().error('カラーテーマを選択してください'),
      description: '既存のCSSクラスと完全一致させてください'
    }),
    defineField({
      name: 'link',
      title: 'リンク先',
      type: 'string',
      validation: Rule => Rule.required(),
      description: '例: /about, /school, /instructor など'
    }),
    defineField({
      name: 'isActive',
      title: 'リンクを有効にする',
      type: 'boolean',
      initialValue: true,
      description: 'OFFにするとカードがクリックできなくなります'
    }),
    defineField({
      name: 'order',
      title: '表示順（旧）',
      type: 'number',
      validation: Rule => Rule.min(1).max(6),
      description: '互換性のため残しています',
      hidden: true
    }),
    defineField({
      name: 'displayOrder',
      title: '表示順',
      type: 'number',
      validation: Rule => Rule.required().min(1).max(6),
      description: '1-6の順番を指定'
    })
  ],
  preview: {
    select: {
      title: 'titleJa',
      subtitle: 'titleEn',
      media: 'image',
      displayOrder: 'displayOrder'
    },
    prepare(selection) {
      return {
        title: `${selection.displayOrder}. ${selection.title}`,
        subtitle: selection.subtitle,
        media: selection.media
      }
    }
  }
})