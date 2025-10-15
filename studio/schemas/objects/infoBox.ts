export default {
  name: 'infoBox',
  title: '情報ボックス',
  type: 'object',
  fields: [
    {
      name: 'type',
      title: 'タイプ',
      type: 'string',
      options: {
        list: [
          {title: '情報', value: 'info'},
          {title: '警告', value: 'warning'},
          {title: '成功', value: 'success'},
          {title: 'ヒント', value: 'tip'},
          {title: 'メモ', value: 'note'},
        ],
      },
      initialValue: 'info',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'title',
      title: 'タイトル',
      type: 'string',
      description: 'ボックスのタイトル（オプション）',
    },
    {
      name: 'content',
      title: '内容',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{title: '通常', value: 'normal'}],
          marks: {
            decorators: [
              {title: '太字', value: 'strong'},
              {title: '斜体', value: 'em'},
            ],
          },
        },
      ],
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
      type: 'type',
    },
    prepare({ title, type }: any) {
      const typeLabels: { [key: string]: string } = {
        info: '情報',
        warning: '警告',
        success: '成功',
        tip: 'ヒント',
        note: 'メモ',
      }
      return {
        title: title || '情報ボックス',
        subtitle: typeLabels[type] || type,
      }
    },
  },
}
