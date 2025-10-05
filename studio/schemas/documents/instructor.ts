import { defineType, defineField } from 'sanity'
import { User } from 'lucide-react'

export default defineType({
  name: 'instructor',
  title: 'インストラクター',
  type: 'document',
  icon: User,
  groups: [
    {
      name: 'basic',
      title: '基本情報',
      default: true,
    },
    {
      name: 'profile',
      title: 'プロフィール',
    },
    {
      name: 'qualifications',
      title: '資格・経歴',
    },
    {
      name: 'courses',
      title: '担当講座',
    },
    {
      name: 'contact',
      title: '連絡先・SNS',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    defineField({
      name: 'name',
      title: '名前',
      type: 'string',
      description: 'インストラクターの氏名',
      validation: (Rule) => Rule.required(),
      group: 'basic',
    }),
    defineField({
      name: 'slug',
      title: 'スラッグ',
      type: 'slug',
      description: 'URLに使用される識別子',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      group: 'basic',
    }),
    defineField({
      name: 'title',
      title: '肩書き',
      type: 'string',
      description: '例：カフェキネシ公認インストラクター',
      group: 'basic',
    }),
    defineField({
      name: 'image',
      title: 'プロフィール画像',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: '代替テキスト',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
      group: 'basic',
    }),
    defineField({
      name: 'bio',
      title: '自己紹介',
      type: 'text',
      rows: 5,
      description: '短い自己紹介文',
      validation: (Rule) => Rule.required(),
      group: 'profile',
    }),
    defineField({
      name: 'profileDetails',
      title: '詳細プロフィール',
      type: 'array',
      of: [{ type: 'block' }],
      description: '詳細なプロフィール（複数段落可）',
      group: 'profile',
    }),
    defineField({
      name: 'region',
      title: '活動地域',
      type: 'string',
      description: '例：東京都、大阪府、オンライン',
      group: 'basic',
    }),
    defineField({
      name: 'certifications',
      title: '保有資格',
      type: 'array',
      of: [
        defineField({
          name: 'certification',
          title: '資格',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: '資格名',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'organization',
              title: '認定団体',
              type: 'string',
            }),
            defineField({
              name: 'year',
              title: '取得年',
              type: 'number',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              organization: 'organization',
              year: 'year',
            },
            prepare(selection) {
              const { title, organization, year } = selection
              return {
                title: title,
                subtitle: year ? `${organization} (${year}年取得)` : organization,
              }
            },
          },
        }),
      ],
      group: 'qualifications',
    }),
    defineField({
      name: 'experience',
      title: '経歴',
      type: 'array',
      of: [
        defineField({
          name: 'experienceItem',
          title: '経歴項目',
          type: 'object',
          fields: [
            defineField({
              name: 'year',
              title: '年',
              type: 'string',
              description: '例：2020年、2020-2022',
            }),
            defineField({
              name: 'description',
              title: '内容',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              year: 'year',
              description: 'description',
            },
            prepare(selection) {
              const { year, description } = selection
              return {
                title: year || '未設定',
                subtitle: description ? description.substring(0, 100) : '',
              }
            },
          },
        }),
      ],
      group: 'qualifications',
    }),
    defineField({
      name: 'teachingCourses',
      title: '担当講座',
      type: 'array',
      of: [
        defineField({
          name: 'course',
          title: '講座',
          type: 'reference',
          to: [{ type: 'course' }],
        }),
      ],
      description: '担当している講座を選択',
      group: 'courses',
    }),
    defineField({
      name: 'specialties',
      title: '専門分野',
      type: 'array',
      of: [{ type: 'string' }],
      description: '専門としている分野（例：アロマセラピー、キネシオロジー）',
      group: 'courses',
    }),
    defineField({
      name: 'email',
      title: 'メールアドレス',
      type: 'string',
      validation: (Rule) => Rule.email(),
      group: 'contact',
    }),
    defineField({
      name: 'phone',
      title: '電話番号',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'website',
      title: 'ウェブサイト',
      type: 'url',
      group: 'contact',
    }),
    defineField({
      name: 'socialLinks',
      title: 'SNSリンク',
      type: 'array',
      of: [
        defineField({
          name: 'socialLink',
          title: 'SNSリンク',
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'プラットフォーム',
              type: 'string',
              options: {
                list: [
                  { title: 'Facebook', value: 'facebook' },
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'Twitter/X', value: 'twitter' },
                  { title: 'LINE', value: 'line' },
                  { title: 'YouTube', value: 'youtube' },
                  { title: 'その他', value: 'other' },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              platform: 'platform',
              url: 'url',
            },
            prepare(selection) {
              const { platform, url } = selection
              return {
                title: platform,
                subtitle: url,
              }
            },
          },
        }),
      ],
      group: 'contact',
    }),
    defineField({
      name: 'order',
      title: '表示順序',
      type: 'number',
      description: 'インストラクターの表示順序（小さい番号が上に表示）',
      validation: (Rule) => Rule.required().min(0),
      initialValue: 0,
      group: 'basic',
    }),
    defineField({
      name: 'isActive',
      title: '公開状態',
      type: 'boolean',
      initialValue: true,
      description: 'チェックを外すと非公開になります',
      group: 'basic',
    }),
    defineField({
      name: 'featured',
      title: '注目インストラクター',
      type: 'boolean',
      initialValue: false,
      description: 'トップページなどに表示する注目インストラクター',
      group: 'basic',
    }),
    defineField({
      name: 'seo',
      title: 'SEO設定',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'title',
      media: 'image',
      order: 'order',
      isActive: 'isActive',
    },
    prepare(selection) {
      const { title, subtitle, media, order, isActive } = selection
      return {
        title: `${order}. ${title}`,
        subtitle: `${subtitle || ''} ${!isActive ? '(非公開)' : ''}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: '表示順序',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: '名前順',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
})
