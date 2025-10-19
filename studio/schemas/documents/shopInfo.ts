export default {
  name: 'shopInfo',
  title: '店舗情報',
  type: 'document',
  icon: () => '🏪',
  description: '📍 使用箇所: 不明確 | ステータス: ⚠️ 確認必要 | 店舗情報の管理（フロントエンドページ未実装？）',
  fields: [
    {
      name: 'name',
      title: '店舗名',
      type: 'string',
      description: '🔴 必須',
      placeholder: '【必須】店舗名を入力',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'nameEn',
      title: '店舗名（英語）',
      type: 'string',
    },
    {
      name: 'description',
      title: '店舗説明',
      type: 'text',
    },
    {
      name: 'descriptionEn',
      title: '店舗説明（英語）',
      type: 'text',
    },
    {
      name: 'address',
      title: '住所',
      type: 'string',
    },
    {
      name: 'addressEn',
      title: '住所（英語）',
      type: 'string',
    },
    {
      name: 'phone',
      title: '電話番号',
      type: 'string',
    },
    {
      name: 'email',
      title: 'メールアドレス',
      type: 'string',
    },
    {
      name: 'businessHours',
      title: '営業時間',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'day',
              title: '曜日',
              type: 'string',
              options: {
                list: [
                  {title: '月曜日', value: 'monday'},
                  {title: '火曜日', value: 'tuesday'},
                  {title: '水曜日', value: 'wednesday'},
                  {title: '木曜日', value: 'thursday'},
                  {title: '金曜日', value: 'friday'},
                  {title: '土曜日', value: 'saturday'},
                  {title: '日曜日', value: 'sunday'},
                ],
              },
            },
            {
              name: 'open',
              title: '開店時間',
              type: 'string',
            },
            {
              name: 'close',
              title: '閉店時間',
              type: 'string',
            },
            {
              name: 'isClosed',
              title: '定休日',
              type: 'boolean',
              initialValue: false,
            },
          ],
        },
      ],
    },
    {
      name: 'holidays',
      title: '休業日',
      type: 'text',
    },
    {
      name: 'socialMedia',
      title: 'ソーシャルメディア',
      type: 'object',
      fields: [
        {
          name: 'instagram',
          title: 'Instagram',
          type: 'url',
        },
        {
          name: 'facebook',
          title: 'Facebook',
          type: 'url',
        },
        {
          name: 'twitter',
          title: 'Twitter/X',
          type: 'url',
        },
        {
          name: 'line',
          title: 'LINE',
          type: 'url',
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
    },
  },
}