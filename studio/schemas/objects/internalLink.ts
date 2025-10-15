export default {
  name: 'internalLink',
  title: '内部リンク',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'タイトル',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'url',
      title: 'URL',
      type: 'string',
      description: 'サイト内の相対パス（例: /school/peach-touch）',
      validation: (Rule: any) => Rule.required().regex(/^\//, {
        name: 'relative-path',
        invert: false,
      }).error('スラッシュ（/）で始まる相対パスを入力してください'),
    },
    {
      name: 'description',
      title: '説明',
      type: 'text',
      rows: 2,
      description: 'リンク先の簡単な説明（オプション）',
    },
    {
      name: 'type',
      title: 'タイプ',
      type: 'string',
      options: {
        list: [
          {title: 'ピラーページ', value: 'pillar'},
          {title: 'クラスターページ', value: 'cluster'},
          {title: 'ブログ記事', value: 'blog'},
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
      type: 'type',
      url: 'url',
    },
    prepare({ title, type, url }: any) {
      const typeLabels: { [key: string]: string } = {
        pillar: 'ピラーページ',
        cluster: 'クラスターページ',
        blog: 'ブログ記事',
      }
      return {
        title,
        subtitle: `${typeLabels[type] || type} - ${url}`,
      }
    },
  },
}
