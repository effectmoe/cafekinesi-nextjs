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
      type: 'string',
      options: {
        list: [
          {title: 'キネシオロジーについて', value: 'kinesi'},
          {title: '初心者向け', value: 'beginner'},
          {title: '講座について', value: 'course'},
          {title: '料金・支払い', value: 'price'},
          {title: 'キャンセル・変更', value: 'cancel'},
          {title: 'インストラクターについて', value: 'instructor'},
          {title: 'セッションについて', value: 'session'},
          {title: '予約・申込について', value: 'booking'},
          {title: '会場・アクセスについて', value: 'venue'},
          {title: 'その他', value: 'other'}
        ]
      },
      validation: Rule => Rule.required()
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
      subtitle: 'category'
    }
  }
})