export default {
  name: 'siteSettings',
  type: 'document',
  title: 'サイト設定',
  icon: () => '⚙️',
  description: '📍 使用箇所: 全ページ（グローバル設定） | ステータス: ⚠️ 確認必要 | サイト全体の設定（シングルトン）',
  __experimental_actions: ['update', 'publish'], // create, deleteを無効化
  fields: [
    {
      name: 'siteName',
      type: 'string',
      title: 'サイト名',
      initialValue: 'Cafe Kinesi'
    },
    {
      name: 'siteDescription',
      type: 'text',
      title: 'サイト説明',
      rows: 3
    },
    {
      name: 'siteUrl',
      type: 'url',
      title: 'サイトURL'
    },
    {
      name: 'logo',
      type: 'customImage',
      title: 'ロゴ'
    },
    {
      name: 'navigation',
      type: 'array',
      title: 'ナビゲーション',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'タイトル'
            },
            {
              name: 'link',
              type: 'string',
              title: 'リンク'
            },
            {
              name: 'subItems',
              type: 'array',
              title: 'サブメニュー',
              of: [{
                type: 'object',
                fields: [
                  {
                    name: 'title',
                    type: 'string',
                    title: 'タイトル'
                  },
                  {
                    name: 'link',
                    type: 'string',
                    title: 'リンク'
                  }
                ]
              }]
            }
          ]
        }
      ]
    },
    {
      name: 'footer',
      type: 'object',
      title: 'フッター設定',
      fields: [
        {
          name: 'copyright',
          type: 'string',
          title: 'コピーライト'
        },
        {
          name: 'description',
          type: 'text',
          title: 'フッター説明文',
          rows: 3
        },
        {
          name: 'links',
          type: 'array',
          title: 'フッターリンク',
          of: [{
            type: 'object',
            fields: [
              {
                name: 'title',
                type: 'string',
                title: 'タイトル'
              },
              {
                name: 'url',
                type: 'url',
                title: 'URL'
              }
            ]
          }]
        },
        {
          name: 'socialMedia',
          type: 'array',
          title: 'ソーシャルメディア',
          of: [{
            type: 'object',
            fields: [
              {
                name: 'platform',
                type: 'string',
                title: 'プラットフォーム',
                options: {
                  list: [
                    { title: 'Twitter', value: 'twitter' },
                    { title: 'Facebook', value: 'facebook' },
                    { title: 'Instagram', value: 'instagram' },
                    { title: 'YouTube', value: 'youtube' },
                    { title: 'LinkedIn', value: 'linkedin' }
                  ]
                }
              },
              {
                name: 'url',
                type: 'url',
                title: 'URL'
              }
            ]
          }]
        }
      ]
    },
    {
      name: 'seo',
      type: 'seo',
      title: 'デフォルトSEO設定'
    }
  ],
  preview: {
    select: {
      title: 'siteName'
    }
  }
}