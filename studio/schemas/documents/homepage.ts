export default {
  name: 'homepage',
  type: 'document',
  title: 'ホームページ',
  __experimental_actions: ['update', 'publish'], // create, deleteを無効化
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'ページタイトル',
      initialValue: 'ホームページ',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'hero',
      type: 'hero',
      title: 'ヒーローセクション'
    },
    {
      name: 'aboutSection',
      type: 'object',
      title: 'アバウトセクション',
      fields: [
        {
          name: 'title',
          type: 'string',
          title: 'タイトル'
        },
        {
          name: 'subtitle',
          type: 'string',
          title: 'サブタイトル'
        },
        {
          name: 'description',
          type: 'text',
          title: '説明文'
        },
        {
          name: 'image',
          type: 'customImage',
          title: '画像'
        }
      ]
    },
    {
      name: 'servicesSection',
      type: 'object',
      title: 'サービスセクション',
      fields: [
        {
          name: 'title',
          type: 'string',
          title: 'タイトル'
        },
        {
          name: 'services',
          type: 'array',
          title: 'サービス一覧',
          of: [{ type: 'feature' }]
        }
      ]
    },
    {
      name: 'blogSection',
      type: 'object',
      title: 'ブログセクション',
      fields: [
        {
          name: 'title',
          type: 'string',
          title: 'タイトル'
        },
        {
          name: 'showLatest',
          type: 'boolean',
          title: '最新記事を表示',
          initialValue: true
        },
        {
          name: 'postCount',
          type: 'number',
          title: '表示件数',
          initialValue: 9,
          validation: (Rule: any) => Rule.min(1).max(20)
        }
      ]
    },
    {
      name: 'cta',
      type: 'cta',
      title: 'Call to Action'
    },
    {
      name: 'seo',
      type: 'seo',
      title: 'SEO設定'
    }
  ],
  preview: {
    select: {
      title: 'title'
    }
  }
}