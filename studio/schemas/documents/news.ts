export default {
  name: 'news',
  title: 'お知らせ',
  type: 'document',
  icon: () => '📢',
  description: '📍 使用箇所: 不明確 | ステータス: ⚠️ 確認必要 | ニュース・お知らせの管理（フロントエンドページ未実装？）',
  fields: [
    {
      name: 'title',
      title: 'タイトル',
      type: 'string',
      description: '🔴 必須',
      placeholder: '【必須】お知らせのタイトルを入力',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'titleEn',
      title: 'タイトル（英語）',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'スラッグ',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      description: '🔴 必須 | タイトルから自動生成されます',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'content',
      title: '内容',
      type: 'array',
      of: [
        {
          type: 'block',
        },
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    },
    {
      name: 'contentEn',
      title: '内容（英語）',
      type: 'array',
      of: [
        {
          type: 'block',
        },
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    },
    {
      name: 'publishedAt',
      title: '公開日',
      type: 'datetime',
      description: '🔴 必須',
      validation: (Rule: any) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    },
    {
      name: 'category',
      title: 'カテゴリー',
      type: 'string',
      options: {
        list: [
          {title: 'お知らせ', value: 'news'},
          {title: 'イベント', value: 'event'},
          {title: 'キャンペーン', value: 'campaign'},
          {title: '新商品', value: 'new_product'},
          {title: 'その他', value: 'other'},
        ],
      },
    },
    {
      name: 'image',
      title: 'メイン画像',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'publishedAt',
      media: 'image',
    },
  },
  orderings: [
    {
      title: '公開日（新しい順）',
      name: 'publishedDateDesc',
      by: [
        {field: 'publishedAt', direction: 'desc'}
      ]
    }
  ],
}