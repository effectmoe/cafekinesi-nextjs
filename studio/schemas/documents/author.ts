export default {
  name: 'author',
  title: '著者',
  type: 'document',
  groups: [
    {
      name: 'basic',
      title: '基本情報',
      default: true,
    },
    {
      name: 'profile',
      title: 'プロフィール',
    },
    {
      name: 'social',
      title: 'SNS・外部リンク',
    },
    {
      name: 'content',
      title: 'コンテンツ',
    },
  ],
  fields: [
    {
      name: 'name',
      title: '名前',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
      group: 'basic',
    },
    {
      name: 'slug',
      title: 'スラッグ',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
      group: 'basic',
    },
    {
      name: 'image',
      title: 'プロフィール画像',
      type: 'image',
      options: {
        hotspot: true,
      },
      group: 'basic',
    },
    {
      name: 'bio',
      title: '紹介文（簡潔版）',
      type: 'text',
      rows: 4,
      description: '著者カード等に表示される簡潔な紹介文（1-2行）',
      group: 'basic',
    },
    {
      name: 'bioLong',
      title: '詳細プロフィール',
      type: 'text',
      rows: 8,
      description: '著者ページに表示される詳細なプロフィール（3-5段落推奨）。経歴、専門性、活動内容などを記載してください。',
      group: 'profile',
    },
    {
      name: 'specialties',
      title: '専門分野',
      type: 'array',
      of: [{ type: 'string' }],
      description: '著者の専門分野をリストで入力（例：キネシオロジー、ヒーリング、ストレス解放）',
      group: 'profile',
    },
    {
      name: 'location',
      title: '活動拠点',
      type: 'string',
      description: '例：東京都、大阪府',
      group: 'profile',
    },
    {
      name: 'socialLinks',
      title: 'SNS・ウェブサイト',
      type: 'object',
      description: '著者のSNSアカウントや公式サイトのURL',
      fields: [
        {
          name: 'website',
          title: '公式サイト',
          type: 'url',
          description: 'https://example.com',
        },
        {
          name: 'facebook',
          title: 'Facebook',
          type: 'url',
          description: 'https://www.facebook.com/...',
        },
        {
          name: 'instagram',
          title: 'Instagram',
          type: 'url',
          description: 'https://www.instagram.com/...',
        },
        {
          name: 'twitter',
          title: 'Twitter/X',
          type: 'url',
          description: 'https://twitter.com/... または https://x.com/...',
        },
        {
          name: 'youtube',
          title: 'YouTube',
          type: 'url',
          description: 'https://www.youtube.com/...',
        },
      ],
      group: 'social',
    },
    {
      name: 'faq',
      title: 'よくある質問（FAQ）',
      type: 'array',
      of: [
        {
          name: 'faqItem',
          title: 'FAQ項目',
          type: 'object',
          fields: [
            {
              name: 'question',
              title: '質問',
              type: 'string',
              description: '例：「どのような講座を担当していますか？」',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'answer',
              title: '回答',
              type: 'text',
              rows: 4,
              description: '質問に対する詳しい回答',
              validation: (Rule: any) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'question',
              subtitle: 'answer',
            },
          },
        },
      ],
      description: 'LLMO最適化のため5-10個推奨。著者に関するよくある質問を設定します。',
      group: 'content',
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
      subtitle: 'bio',
    },
  },
}