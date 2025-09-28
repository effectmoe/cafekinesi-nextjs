import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'socialLink',
  title: 'ソーシャルリンク',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'プラットフォーム',
      type: 'string',
      options: {
        list: [
          { title: 'Facebook', value: 'Facebook' },
          { title: 'Instagram', value: 'Instagram' },
          { title: 'Twitter', value: 'Twitter' },
          { title: 'YouTube', value: 'YouTube' },
          { title: 'Bandcamp', value: 'Bandcamp' }
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: Rule => Rule.required().uri({
        scheme: ['http', 'https']
      })
    }),
    defineField({
      name: 'displayText',
      title: '表示テキスト',
      type: 'string',
      description: '未入力の場合はプラットフォーム名を使用'
    }),
    defineField({
      name: 'isActive',
      title: '表示する',
      type: 'boolean',
      initialValue: true
    }),
    defineField({
      name: 'order',
      title: '表示順',
      type: 'number',
      validation: Rule => Rule.required().min(1)
    })
  ],
  preview: {
    select: {
      title: 'platform',
      subtitle: 'url',
      order: 'order',
      isActive: 'isActive'
    },
    prepare(selection) {
      return {
        title: `${selection.order}. ${selection.title}`,
        subtitle: selection.isActive ? selection.subtitle : '(非表示)'
      }
    }
  }
})