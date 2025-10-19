export default {
  name: 'page',
  type: 'document',
  title: 'ページ',
  icon: () => '📄',
  description: '📍 使用箇所: /[slug] (動的ページ) | ステータス: ✅ 使用中 | ページビルダーを使用したカスタムページ',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'ページタイトル',
      description: '🔴 必須',
      placeholder: '【必須】ページタイトルを入力',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'スラッグ',
      description: '🔴 必須 | タイトルから自動生成されます',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'pageBuilder',
      type: 'array',
      title: 'ページビルダー',
      of: [
        { type: 'hero' },
        { type: 'feature' },
        { type: 'cta' },
        { type: 'testimonial' }
        // { type: 'reference', to: [{ type: 'globalWidget' }] } // globalWidgetは未実装
      ]
    },
    {
      name: 'seo',
      type: 'seo',
      title: 'SEO設定'
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current'
    }
  }
}