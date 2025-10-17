import {defineField, defineType} from 'sanity'

export const faqCategory = defineType({
  name: 'faqCategory',
  title: 'FAQカテゴリー',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'カテゴリー名',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'スラッグ（英語）',
      type: 'slug',
      description: 'URLやコードで使用される英語の識別子（例：kinesi, beginner）',
      options: {
        source: 'title',
        maxLength: 50,
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: '説明',
      type: 'text',
      rows: 3,
      description: 'このカテゴリーの説明（任意）'
    }),
    defineField({
      name: 'order',
      title: '表示順',
      type: 'number',
      initialValue: 0,
      description: '小さい数字ほど上に表示されます'
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
      order: 'order'
    },
    prepare({title, subtitle, order}) {
      return {
        title: title,
        subtitle: `${subtitle} (順序: ${order})`
      }
    }
  }
})
