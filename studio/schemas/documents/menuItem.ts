export default {
  name: 'menuItem',
  title: 'メニューアイテム',
  type: 'document',
  icon: () => '🍽️',
  description: '📍 使用箇所: 不明確 | ステータス: ⚠️ 確認必要 | カフェメニューの管理（フロントエンドページ未実装？）',
  fields: [
    {
      name: 'name',
      title: '商品名',
      type: 'string',
      description: '🔴 必須',
      placeholder: '【必須】商品名を入力',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'nameEn',
      title: '商品名（英語）',
      type: 'string',
    },
    {
      name: 'description',
      title: '説明',
      type: 'text',
    },
    {
      name: 'descriptionEn',
      title: '説明（英語）',
      type: 'text',
    },
    {
      name: 'price',
      title: '価格',
      type: 'number',
      description: '🔴 必須',
      placeholder: '0',
      validation: (Rule: any) => Rule.required().positive(),
    },
    {
      name: 'category',
      title: 'カテゴリー',
      type: 'reference',
      description: '🔴 必須',
      to: [{type: 'category'}],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'image',
      title: 'メイン画像',
      type: 'image',
      description: '🔴 必須',
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'gallery',
      title: '追加画像',
      type: 'array',
      description: '商品の詳細画像（複数可）',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
            metadata: ['blurhash', 'lqip'],
          },
          fields: [
            {
              name: 'caption',
              title: 'キャプション',
              type: 'string',
            },
          ],
        },
      ],
      options: {
        layout: 'grid',
      },
    },
    {
      name: 'available',
      title: '販売中',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'featured',
      title: 'おすすめ',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'order',
      title: '表示順',
      type: 'number',
      initialValue: 0,
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category.name',
      media: 'image',
    },
  },
}