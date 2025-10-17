import {defineField, defineType} from 'sanity'

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: '質問',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'answer',
      title: '回答',
      type: 'text',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'category',
      title: 'カテゴリー',
      type: 'reference',
      to: [{type: 'faqCategory'}],
      validation: Rule => Rule.required(),
      description: 'FAQのカテゴリーを選択してください。カテゴリーは「FAQカテゴリー」から追加・編集できます。'
    }),
    defineField({
      name: 'order',
      title: '表示順',
      type: 'number',
      initialValue: 0
    })
  ],
  preview: {
    select: {
      title: 'question',
      categoryTitle: 'category.title',
      categorySlug: 'category.slug.current'
    },
    prepare({title, categoryTitle, categorySlug}) {
      return {
        title: title,
        subtitle: categoryTitle || categorySlug || 'カテゴリーなし'
      }
    }
  }
})