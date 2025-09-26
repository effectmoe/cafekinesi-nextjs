// React Component競合防止のため最適化されたSchema.org設定
export default {
  name: 'schemaOrg',
  type: 'object',
  title: 'Schema.org設定',
  // パフォーマンス最適化: previewプロパティを無効化
  preview: {
    prepare() {
      return {
        title: 'Schema.org設定'
      }
    }
  },
  fields: [
    {
      name: 'enabled',
      type: 'boolean',
      title: '🔍 Schema.org構造化データを有効化',
      description: '検索エンジン向けの構造化データ（Schema.org）を出力します',
      initialValue: false
    },
    {
      name: 'type',
      type: 'string',
      title: 'Schema.orgコンテンツタイプ',
      description: 'コンテンツの種類を選択してください',
      options: {
        list: [
          { title: 'BlogPosting（ブログ投稿）', value: 'BlogPosting' },
          { title: 'Article（標準記事）', value: 'Article' },
          { title: 'NewsArticle（ニュース記事）', value: 'NewsArticle' },
          { title: 'HowTo（ハウツー）', value: 'HowTo' },
          { title: 'Recipe（レシピ）', value: 'Recipe' },
          { title: 'FAQPage（FAQ）', value: 'FAQPage' }
        ],
        layout: 'dropdown'
      },
      initialValue: 'BlogPosting',
      // Reactコンポーネント競合を防ぐため関数をシンプル化
      hidden: ({ parent }) => !parent?.enabled
    },
    {
      name: 'custom',
      type: 'text',
      title: 'カスタムJSON-LD',
      description: 'カスタムJSON-LDを直接入力できます（上級者向け）',
      rows: 10,
      // Reactコンポーネント競合を防ぐため関数をシンプル化
      hidden: ({ parent }) => !parent?.enabled,
      validation: (Rule) => Rule.custom((value) => {
        if (!value) return true
        try {
          JSON.parse(value)
          return true
        } catch {
          return 'JSON形式が無効です'
        }
      })
    }
  ]
}