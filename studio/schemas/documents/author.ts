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
      name: 'credentials',
      title: '資格・実績',
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
    // Phase 2: 資格・実績フィールド
    {
      name: 'credentials',
      title: '資格・認定証',
      type: 'array',
      of: [
        {
          name: 'credential',
          title: '資格',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: '資格名',
              type: 'string',
              description: '例：国際キネシオロジー協会認定インストラクター',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'issuer',
              title: '発行機関',
              type: 'string',
              description: '例：日本キネシオロジー協会',
            },
            {
              name: 'year',
              title: '取得年',
              type: 'number',
              description: '例：2015',
            },
            {
              name: 'url',
              title: '証明書URL',
              type: 'url',
              description: '認定証やバッジのURL（任意）',
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'issuer',
            },
          },
        },
      ],
      description: 'E-E-A-T向上のため、保有資格・認定証を入力（3-5個推奨）',
      group: 'credentials',
    },
    {
      name: 'awards',
      title: '受賞歴',
      type: 'array',
      of: [
        {
          name: 'award',
          title: '賞',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: '賞の名称',
              type: 'string',
              description: '例：2020年度ベストヒーラー賞',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'organization',
              title: '授与団体',
              type: 'string',
              description: '例：日本ヒーリング協会',
            },
            {
              name: 'year',
              title: '受賞年',
              type: 'number',
              description: '例：2020',
            },
            {
              name: 'description',
              title: '詳細',
              type: 'text',
              rows: 3,
              description: '受賞内容の説明（任意）',
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'organization',
            },
          },
        },
      ],
      description: '権威性向上のため、受賞歴を入力（任意）',
      group: 'credentials',
    },
    {
      name: 'achievements',
      title: '活動実績',
      type: 'object',
      description: '数値で示せる実績（セミナー開催数、指導実績など）',
      fields: [
        {
          name: 'seminarsHeld',
          title: 'セミナー開催数',
          type: 'number',
          description: '例：150',
        },
        {
          name: 'studentsTotal',
          title: '総指導人数',
          type: 'number',
          description: '例：1000',
        },
        {
          name: 'satisfactionRate',
          title: '満足度',
          type: 'number',
          description: '例：98（パーセント）',
          validation: (Rule: any) => Rule.min(0).max(100),
        },
        {
          name: 'yearsOfExperience',
          title: '活動年数',
          type: 'number',
          description: '例：15',
        },
        {
          name: 'certificationsIssued',
          title: '発行した認定証数',
          type: 'number',
          description: '例：500',
        },
      ],
      group: 'credentials',
    },
    {
      name: 'testimonials',
      title: 'お客様の声',
      type: 'array',
      of: [
        {
          name: 'testimonial',
          title: '推薦文',
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'お名前',
              type: 'string',
              description: '例：山田花子',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'role',
              title: '肩書き',
              type: 'string',
              description: '例：会社員、セラピスト、主婦など',
            },
            {
              name: 'content',
              title: '推薦文',
              type: 'text',
              rows: 4,
              description: '受講者の感想や推薦文',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'rating',
              title: '評価',
              type: 'number',
              description: '5段階評価（1-5）',
              validation: (Rule: any) => Rule.min(1).max(5),
            },
            {
              name: 'date',
              title: '投稿日',
              type: 'date',
              description: '推薦文の投稿日（任意）',
            },
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'content',
            },
          },
        },
      ],
      description: '信頼性向上のため、受講者の声を5-10件入力推奨',
      group: 'content',
    },
    {
      name: 'mediaFeatures',
      title: 'メディア掲載',
      type: 'array',
      of: [
        {
          name: 'mediaFeature',
          title: 'メディア',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: '記事タイトル',
              type: 'string',
              description: '例：キネシオロジーで人生が変わった！',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'mediaName',
              title: 'メディア名',
              type: 'string',
              description: '例：健康雑誌○○、TV番組○○',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'date',
              title: '掲載日',
              type: 'date',
              description: '掲載された日付',
            },
            {
              name: 'url',
              title: '記事URL',
              type: 'url',
              description: 'オンライン記事のURL（任意）',
            },
            {
              name: 'type',
              title: 'メディアタイプ',
              type: 'string',
              options: {
                list: [
                  { title: '雑誌', value: 'magazine' },
                  { title: 'テレビ', value: 'tv' },
                  { title: 'ラジオ', value: 'radio' },
                  { title: 'ウェブメディア', value: 'web' },
                  { title: '新聞', value: 'newspaper' },
                ],
              },
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'mediaName',
            },
          },
        },
      ],
      description: '権威性向上のため、メディア掲載実績を入力（任意）',
      group: 'credentials',
    },
    {
      name: 'careerTimeline',
      title: '経歴タイムライン',
      type: 'array',
      of: [
        {
          name: 'timelineItem',
          title: '経歴項目',
          type: 'object',
          fields: [
            {
              name: 'year',
              title: '年',
              type: 'number',
              description: '例：2015',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'title',
              title: 'タイトル',
              type: 'string',
              description: '例：キネシオロジー講師として独立',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'description',
              title: '詳細',
              type: 'text',
              rows: 3,
              description: 'その年の活動内容や実績の詳細',
            },
          ],
          preview: {
            select: {
              title: 'year',
              subtitle: 'title',
            },
          },
        },
      ],
      description: 'E-E-A-T向上のため、キャリアの主要なマイルストーンを入力（5-10件推奨）',
      group: 'credentials',
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