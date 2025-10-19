export default {
  name: 'category',
  title: 'カテゴリー',
  type: 'document',
  icon: () => '🏷️',
  description: '📍 使用箇所: menuItem参照 | ステータス: ⚠️ 確認必要 | メニューアイテムのカテゴリー（フロントエンドページ未実装？）',
  fields: [
    {
      name: 'name',
      title: 'カテゴリー名',
      type: 'string',
      description: '🔴 必須',
      placeholder: '【必須】カテゴリー名を入力',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'nameEn',
      title: 'カテゴリー名（英語）',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'スラッグ',
      type: 'slug',
      description: '🔴 必須 | カテゴリー名から自動生成されます',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: '説明',
      type: 'text',
    },
    {
      name: 'image',
      title: 'イメージ画像',
      type: 'image',
      options: {
        hotspot: true,
      },
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
      media: 'image',
    },
  },
}