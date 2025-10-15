export default {
  name: 'table',
  title: 'テーブル（表）',
  type: 'object',
  fields: [
    {
      name: 'caption',
      title: 'キャプション',
      type: 'string',
      description: '表のタイトル・説明（オプション）',
    },
    {
      name: 'rows',
      title: '行',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'cells',
              title: 'セル',
              type: 'array',
              of: [{type: 'string'}],
              validation: (Rule: any) => Rule.required().min(1),
            },
          ],
        },
      ],
      validation: (Rule: any) => Rule.required().min(2).warning('最低でもヘッダー行とデータ行が必要です'),
    },
  ],
  preview: {
    select: {
      caption: 'caption',
      rows: 'rows',
    },
    prepare({ caption, rows }: any) {
      const rowCount = rows ? rows.length : 0
      return {
        title: caption || 'テーブル',
        subtitle: `${rowCount}行`,
      }
    },
  },
}
