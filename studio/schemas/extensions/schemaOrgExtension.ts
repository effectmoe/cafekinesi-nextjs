// Schema.org構造化データ用の拡張フィールド
export const schemaOrgExtension = {
  name: 'schema',
  title: 'Schema.org設定',
  type: 'object',
  fields: [
    {
      name: 'enabled',
      title: '構造化データを有効化',
      type: 'boolean',
      initialValue: true,
      description: '検索エンジン向けの構造化データ（Schema.org）を出力します'
    },
    {
      name: 'type',
      title: 'コンテンツタイプ',
      type: 'string',
      options: {
        list: [
          { title: 'Article（標準記事）', value: 'Article' },
          { title: 'BlogPosting（ブログ投稿）', value: 'BlogPosting' },
          { title: 'NewsArticle（ニュース記事）', value: 'NewsArticle' },
          { title: 'HowTo（ハウツー）', value: 'HowTo' },
          { title: 'Recipe（レシピ）', value: 'Recipe' },
          { title: 'FAQPage（FAQ）', value: 'FAQPage' },
          { title: 'Review（レビュー）', value: 'Review' },
          { title: 'Event（イベント）', value: 'Event' },
          { title: 'Product（商品）', value: 'Product' }
        ],
        layout: 'dropdown'
      },
      initialValue: 'BlogPosting',
      description: 'コンテンツの種類を選択してください'
    },
    {
      name: 'customSchema',
      title: 'カスタムJSON-LD',
      type: 'text',
      rows: 10,
      description: 'カスタムJSON-LDを直接入力できます（上級者向け）。有効な場合、自動生成より優先されます。',
      validation: (Rule: any) => Rule.custom((value: string) => {
        if (!value) return true
        try {
          JSON.parse(value)
          return true
        } catch {
          return 'JSON形式が無効です'
        }
      })
    },
    {
      name: 'articleSection',
      title: '記事セクション',
      type: 'string',
      description: '記事のカテゴリーやセクション（例：Technology, Health）',
      hidden: ({ parent }: any) => !['Article', 'BlogPosting', 'NewsArticle'].includes(parent?.type)
    },
    {
      name: 'wordCount',
      title: '文字数',
      type: 'number',
      description: '記事の文字数（自動計算されます）',
      readOnly: true,
      hidden: ({ parent }: any) => !['Article', 'BlogPosting', 'NewsArticle'].includes(parent?.type)
    },
    {
      name: 'prepTime',
      title: '準備時間',
      type: 'string',
      description: 'ISO 8601形式（例：PT15M = 15分）',
      hidden: ({ parent }: any) => !['HowTo', 'Recipe'].includes(parent?.type)
    },
    {
      name: 'performTime',
      title: '実行時間',
      type: 'string',
      description: 'ISO 8601形式（例：PT1H = 1時間）',
      hidden: ({ parent }: any) => !['HowTo', 'Recipe'].includes(parent?.type)
    },
    {
      name: 'totalTime',
      title: '合計時間',
      type: 'string',
      description: 'ISO 8601形式（例：PT1H30M = 1時間30分）',
      hidden: ({ parent }: any) => !['HowTo', 'Recipe'].includes(parent?.type)
    },
    {
      name: 'supply',
      title: '必要な道具・材料',
      type: 'array',
      of: [{ type: 'string' }],
      hidden: ({ parent }: any) => parent?.type !== 'HowTo'
    },
    {
      name: 'tool',
      title: '必要なツール',
      type: 'array',
      of: [{ type: 'string' }],
      hidden: ({ parent }: any) => parent?.type !== 'HowTo'
    },
    {
      name: 'ingredients',
      title: '材料',
      type: 'array',
      of: [{ type: 'string' }],
      hidden: ({ parent }: any) => parent?.type !== 'Recipe'
    },
    {
      name: 'nutrition',
      title: '栄養情報',
      type: 'object',
      fields: [
        { name: 'calories', title: 'カロリー', type: 'string' },
        { name: 'fatContent', title: '脂質', type: 'string' },
        { name: 'proteinContent', title: 'タンパク質', type: 'string' },
        { name: 'carbohydrateContent', title: '炭水化物', type: 'string' }
      ],
      hidden: ({ parent }: any) => parent?.type !== 'Recipe'
    },
    {
      name: 'recipeYield',
      title: '分量',
      type: 'string',
      description: '例：4人分',
      hidden: ({ parent }: any) => parent?.type !== 'Recipe'
    },
    {
      name: 'recipeCuisine',
      title: '料理のジャンル',
      type: 'string',
      description: '例：和食、イタリアン',
      hidden: ({ parent }: any) => parent?.type !== 'Recipe'
    },
    {
      name: 'eventLocation',
      title: 'イベント会場',
      type: 'object',
      fields: [
        { name: 'name', title: '会場名', type: 'string' },
        { name: 'address', title: '住所', type: 'string' }
      ],
      hidden: ({ parent }: any) => parent?.type !== 'Event'
    },
    {
      name: 'eventStartDate',
      title: '開始日時',
      type: 'datetime',
      hidden: ({ parent }: any) => parent?.type !== 'Event'
    },
    {
      name: 'eventEndDate',
      title: '終了日時',
      type: 'datetime',
      hidden: ({ parent }: any) => parent?.type !== 'Event'
    },
    {
      name: 'eventStatus',
      title: 'イベントステータス',
      type: 'string',
      options: {
        list: [
          { title: '開催予定', value: 'EventScheduled' },
          { title: '延期', value: 'EventPostponed' },
          { title: '中止', value: 'EventCancelled' },
          { title: 'オンライン開催に変更', value: 'EventMovedOnline' }
        ]
      },
      initialValue: 'EventScheduled',
      hidden: ({ parent }: any) => parent?.type !== 'Event'
    },
    {
      name: 'productPrice',
      title: '価格',
      type: 'object',
      fields: [
        { name: 'price', title: '金額', type: 'number' },
        { name: 'currency', title: '通貨', type: 'string', initialValue: 'JPY' }
      ],
      hidden: ({ parent }: any) => parent?.type !== 'Product'
    },
    {
      name: 'productAvailability',
      title: '在庫状況',
      type: 'string',
      options: {
        list: [
          { title: '在庫あり', value: 'InStock' },
          { title: '在庫切れ', value: 'OutOfStock' },
          { title: '予約受付中', value: 'PreOrder' }
        ]
      },
      initialValue: 'InStock',
      hidden: ({ parent }: any) => parent?.type !== 'Product'
    },
    {
      name: 'reviewRating',
      title: 'レビュー評価',
      type: 'object',
      fields: [
        { name: 'ratingValue', title: '評価値', type: 'number', validation: (Rule: any) => Rule.min(1).max(5) },
        { name: 'bestRating', title: '最高評価', type: 'number', initialValue: 5 },
        { name: 'worstRating', title: '最低評価', type: 'number', initialValue: 1 }
      ],
      hidden: ({ parent }: any) => parent?.type !== 'Review'
    },
    {
      name: 'itemReviewed',
      title: 'レビュー対象',
      type: 'object',
      fields: [
        { name: 'name', title: '名称', type: 'string' },
        { name: 'type', title: 'タイプ', type: 'string', description: '例：Product, Service, Restaurant' }
      ],
      hidden: ({ parent }: any) => parent?.type !== 'Review'
    }
  ]
}