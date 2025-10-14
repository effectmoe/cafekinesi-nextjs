export default {
  name: 'event',
  title: 'イベント',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'イベント名',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'titleEn',
      title: 'イベント名（英語）',
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
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: '説明',
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
      name: 'descriptionEn',
      title: '説明（英語）',
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
      name: 'startDate',
      title: '開始日時',
      type: 'datetime',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'endDate',
      title: '終了日時',
      type: 'datetime',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'location',
      title: '開催場所',
      type: 'string',
    },
    {
      name: 'image',
      title: 'イベント画像',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'registrationUrl',
      title: '申込みURL',
      type: 'url',
    },
    {
      name: 'capacity',
      title: '定員',
      type: 'number',
    },
    {
      name: 'fee',
      title: '参加費',
      type: 'number',
    },
    {
      name: 'status',
      title: 'ステータス',
      type: 'string',
      options: {
        list: [
          {title: '受付中', value: 'open'},
          {title: '満席', value: 'full'},
          {title: '終了', value: 'closed'},
          {title: 'キャンセル', value: 'cancelled'},
        ],
      },
      initialValue: 'open',
    },
    {
      name: 'currentParticipants',
      title: '現在の参加者数',
      type: 'number',
      initialValue: 0,
      description: '現在の参加者数（定員と比較して空き状況を判定）',
    },
    {
      name: 'category',
      title: 'カテゴリ',
      type: 'string',
      options: {
        list: [
          {title: '講座', value: 'course'},
          {title: 'セッション', value: 'session'},
          {title: '説明会', value: 'information'},
          {title: 'ワークショップ', value: 'workshop'},
          {title: 'その他', value: 'other'},
        ],
      },
    },
    {
      name: 'instructor',
      title: '講師',
      type: 'reference',
      to: [{type: 'instructor'}],
      description: 'イベントを担当する講師',
    },
    {
      name: 'tags',
      title: 'タグ',
      type: 'array',
      of: [{type: 'string'}],
      description: 'AI検索用のキーワード（例: ピーチタッチ, 初心者向け, 福岡）',
      options: {
        layout: 'tags'
      }
    },
    {
      name: 'useForAI',
      title: 'AI学習に使用',
      type: 'boolean',
      initialValue: true,
      description: 'AIチャットボットでこのイベント情報を参照可能にする',
    },
    {
      name: 'aiSearchText',
      title: 'AI検索用テキスト（自動生成）',
      type: 'text',
      readOnly: true,
      description: 'AIが検索するためのテキスト（自動生成されます）',
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'startDate',
      media: 'image',
      status: 'status',
    },
    prepare({title, subtitle, media, status}) {
      const statusLabel = {
        open: '受付中',
        full: '満席',
        closed: '終了',
        cancelled: 'キャンセル',
      }[status] || status

      return {
        title,
        subtitle: `${new Date(subtitle).toLocaleDateString('ja-JP')} - ${statusLabel}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: '開始日（近い順）',
      name: 'startDateAsc',
      by: [
        {field: 'startDate', direction: 'asc'}
      ]
    }
  ],
}