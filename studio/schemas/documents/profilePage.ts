import { defineType, defineField } from 'sanity'
import { User } from 'lucide-react'

export default defineType({
  name: 'profilePage',
  title: 'プロフィールページ設定',
  type: 'document',
  icon: User,
  description: '📍 使用箇所: /profile | ステータス: ✅ 使用中 | API（DB同期） | 代表者のプロフィールページ',
  groups: [
    {
      name: 'profile',
      title: 'プロフィール',
    },
    {
      name: 'history',
      title: 'これまでの歩み',
    },
    {
      name: 'activities',
      title: '現在の活動',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'ページタイトル',
      type: 'string',
      description: '🔴 必須',
      placeholder: '【必須】ページタイトルを入力',
      initialValue: 'プロフィール',
      validation: (Rule) => Rule.required(),
      group: 'profile',
    }),
    defineField({
      name: 'profileSection',
      title: 'プロフィールセクション',
      type: 'object',
      group: 'profile',
      fields: [
        defineField({
          name: 'photo',
          title: 'プロフィール写真',
          type: 'image',
          description: '🔴 必須',
          options: {
            hotspot: true,
          },
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'name',
          title: '名前',
          type: 'string',
          description: '🔴 必須',
          placeholder: '【必須】名前を入力',
          initialValue: '星 ユカリ',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'nameReading',
          title: '名前（ふりがな）',
          type: 'string',
          initialValue: 'ヨシカワ ユカリ',
        }),
        defineField({
          name: 'location',
          title: '所在地',
          type: 'string',
          initialValue: '長野県茅野市在住',
        }),
      ],
    }),
    defineField({
      name: 'historyTitle',
      title: '「これまでの歩み」セクションタイトル',
      type: 'string',
      initialValue: 'これまでの歩み',
      group: 'history',
    }),
    defineField({
      name: 'historyItems',
      title: '経歴項目',
      type: 'array',
      description: '🔴 必須',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'text',
              title: 'テキスト',
              type: 'text',
              rows: 3,
              description: '🔴 必須',
              placeholder: '【必須】経歴テキストを入力',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'order',
              title: '表示順',
              type: 'number',
              description: '🔴 必須',
              placeholder: '1',
              validation: (Rule) => Rule.required().integer().min(1),
            }),
          ],
          preview: {
            select: {
              text: 'text',
              order: 'order',
            },
            prepare(selection) {
              const { text, order } = selection
              return {
                title: `${order}. ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`,
              }
            },
          },
        },
      ],
      group: 'history',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'activitiesTitle',
      title: '「現在の活動」セクションタイトル',
      type: 'string',
      initialValue: '現在の活動',
      group: 'activities',
    }),
    defineField({
      name: 'activitiesDescription',
      title: '「現在の活動」セクション説明',
      type: 'text',
      rows: 2,
      initialValue: 'リトルトリーセミナーの主催、カフェキネシやピーチタッチの講師として活動しています。',
      group: 'activities',
    }),
    defineField({
      name: 'activitiesItems',
      title: '活動項目',
      type: 'array',
      description: '🔴 必須',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'タイトル',
              type: 'string',
              description: '🔴 必須',
              placeholder: '【必須】活動タイトルを入力',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'order',
              title: '表示順',
              type: 'number',
              description: '🔴 必須',
              placeholder: '1',
              validation: (Rule) => Rule.required().integer().min(1),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              order: 'order',
            },
            prepare(selection) {
              const { title, order } = selection
              return {
                title: `${order}. ${title}`,
              }
            },
          },
        },
      ],
      group: 'activities',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO設定',
      type: 'object',
      group: 'seo',
      fields: [
        defineField({
          name: 'title',
          title: 'ページタイトル',
          type: 'string',
          initialValue: 'プロフィール | Cafe Kinesi',
        }),
        defineField({
          name: 'description',
          title: 'メタディスクリプション',
          type: 'text',
          rows: 3,
          initialValue: 'カフェキネシ創始者 星 ユカリのプロフィールをご紹介します。',
        }),
        defineField({
          name: 'keywords',
          title: 'キーワード',
          type: 'string',
          initialValue: 'カフェキネシ, 星ユカリ, プロフィール, キネシオロジー',
        }),
        defineField({
          name: 'ogImage',
          title: 'OGP画像',
          type: 'image',
          options: {
            hotspot: true,
          },
        }),
      ],
    }),
    defineField({
      name: 'isActive',
      title: '公開状態',
      type: 'boolean',
      initialValue: true,
      description: 'チェックを外すとプロフィールページが非公開になります',
      group: 'profile',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      name: 'profileSection.name',
      isActive: 'isActive',
    },
    prepare(selection) {
      const { title, name, isActive } = selection
      return {
        title: title || 'プロフィール',
        subtitle: `${name || ''} | ${!isActive ? '非公開' : '公開中'}`,
      }
    },
  },
})
