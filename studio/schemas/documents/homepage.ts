import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'homepage',
  title: 'トップページ',
  type: 'document',
  icon: () => '🏠',
  description: '📍 使用箇所: / (トップページ) | ステータス: ✅ 使用中 | トップページの設定（カテゴリーカード、ブログセクションなど）',
  fields: [
    defineField({
      name: 'title',
      title: 'ページタイトル',
      type: 'string',
      description: '🔴 必須',
      placeholder: '【必須】ページタイトルを入力',
      validation: Rule => Rule.required(),
      initialValue: 'カフェキネシ - Cafe Kinesi'
    }),
    defineField({
      name: 'categoryCards',
      title: 'カテゴリーカード',
      type: 'array',
      of: [{ type: 'categoryCard' }],
      description: '🔴 必須 | TOPページに表示する6枚のカテゴリーカード',
      validation: Rule => Rule.required().min(6).max(6).error('6枚のカードを設定してください')
    }),
    defineField({
      name: 'blogSection',
      title: 'ブログセクション設定',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'セクションタイトル',
          type: 'string',
          initialValue: '最新の記事'
        },
        {
          name: 'numberOfPosts',
          title: '表示件数',
          type: 'number',
          initialValue: 3,
          validation: Rule => Rule.min(1).max(12)
        },
        {
          name: 'showLatestPosts',
          title: '最新記事を表示',
          type: 'boolean',
          initialValue: true
        }
      ]
    }),
    defineField({
      name: 'socialLinks',
      title: 'ソーシャルリンク',
      type: 'array',
      of: [{ type: 'socialLink' }],
      description: '右側に縦表示されるソーシャルリンク'
    }),
    defineField({
      name: 'viewAllButton',
      title: 'View Allボタン設定',
      type: 'object',
      fields: [
        {
          name: 'show',
          title: '表示する',
          type: 'boolean',
          initialValue: true
        },
        {
          name: 'text',
          title: 'ボタンテキスト',
          type: 'string',
          initialValue: 'View All →'
        },
        {
          name: 'link',
          title: 'リンク先',
          type: 'string',
          initialValue: '#'
        }
      ]
    }),
    defineField({
      name: 'profileButton',
      title: '代表者プロフィールボタン設定',
      type: 'object',
      fields: [
        {
          name: 'show',
          title: '表示する',
          type: 'boolean',
          initialValue: true,
          description: '「カフェキネシの夢」と「カフェキネシ講座を受講する」の間に表示されます'
        },
        {
          name: 'text',
          title: 'ボタンテキスト',
          type: 'string',
          initialValue: '代表者プロフィール'
        },
        {
          name: 'link',
          title: 'リンク先',
          type: 'string',
          initialValue: '/profile'
        }
      ]
    }),
    defineField({
      name: 'navigationMenu',
      title: 'ハンバーガーメニュー項目',
      type: 'array',
      of: [{ type: 'navigationMenu' }],
      description: 'ヘッダーのハンバーガーメニューに表示される項目',
      validation: Rule => Rule.min(1).error('少なくとも1つのメニュー項目を追加してください')
    }),
    defineField({
      name: 'headerIcons',
      title: 'ヘッダーアイコン設定',
      type: 'object',
      fields: [
        {
          name: 'searchIcon',
          title: '検索アイコン',
          type: 'object',
          fields: [
            {
              name: 'show',
              title: '表示する',
              type: 'boolean',
              initialValue: true
            },
            {
              name: 'link',
              title: 'リンク先',
              type: 'string',
              initialValue: '/search',
              description: '検索ページのURL'
            }
          ]
        },
        {
          name: 'cartIcon',
          title: 'カートアイコン',
          type: 'object',
          fields: [
            {
              name: 'show',
              title: '表示する',
              type: 'boolean',
              initialValue: true
            },
            {
              name: 'link',
              title: 'リンク先',
              type: 'string',
              initialValue: '/cart',
              description: 'カートページのURL'
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'seo',
      title: 'SEO設定',
      type: 'seo',
      description: '検索エンジン最適化のための設定'
    })
  ],
  preview: {
    select: {
      title: 'title'
    },
    prepare(selection) {
      return {
        title: selection.title || 'トップページ',
        subtitle: 'ホームページ設定'
      }
    }
  }
})