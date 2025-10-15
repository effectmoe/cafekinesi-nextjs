export default {
  name: 'externalReference',
  title: '外部リンク（参考文献）',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'タイトル',
      type: 'string',
      description: '参考文献のタイトル',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'url',
      title: 'URL',
      type: 'url',
      description: '外部サイトのURL',
      validation: (Rule: any) => Rule.required().uri({
        scheme: ['http', 'https'],
      }),
    },
    {
      name: 'publisher',
      title: '発行元・サイト名',
      type: 'string',
      description: '例: 厚生労働省、Wikipediaなど（オプション）',
    },
    {
      name: 'date',
      title: '公開日・アクセス日',
      type: 'date',
      description: '参考文献の公開日または最終アクセス日（オプション）',
      options: {
        dateFormat: 'YYYY年MM月DD日',
      },
    },
  ],
  preview: {
    select: {
      title: 'title',
      publisher: 'publisher',
      url: 'url',
    },
    prepare({ title, publisher, url }: any) {
      return {
        title,
        subtitle: publisher ? `${publisher} - ${url}` : url,
      }
    },
  },
}
