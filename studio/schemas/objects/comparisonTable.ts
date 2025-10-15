export default {
  name: 'comparisonTable',
  title: '比較表',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'タイトル',
      type: 'string',
      description: '比較表のタイトル（オプション）',
    },
    {
      name: 'items',
      title: '比較項目',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: '項目名',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'before',
              title: '改善前',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'after',
              title: '改善後',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
          ],
          preview: {
            select: {
              label: 'label',
              before: 'before',
              after: 'after',
            },
            prepare({ label, before, after }: any) {
              return {
                title: label,
                subtitle: `${before} → ${after}`,
              }
            },
          },
        },
      ],
      validation: (Rule: any) => Rule.required().min(1),
    },
  ],
  preview: {
    select: {
      title: 'title',
      items: 'items',
    },
    prepare({ title, items }: any) {
      const itemCount = items ? items.length : 0
      return {
        title: title || '比較表',
        subtitle: `${itemCount}項目`,
      }
    },
  },
}
