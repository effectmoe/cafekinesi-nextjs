import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'siteConfig',
  title: 'サイト設定 (LLMO/SEO)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '設定名',
      type: 'string',
      validation: Rule => Rule.required(),
      initialValue: 'Cafe Kinesi サイト設定',
      readOnly: true,
      description: 'この設定は1つのみ存在します'
    }),
    defineField({
      name: 'baseUrl',
      title: 'ベースURL',
      type: 'string',
      validation: Rule => Rule.required().uri({ scheme: ['http', 'https'] }),
      initialValue: 'https://cafekinesi-nextjs.vercel.app',
      description: 'サイトのベースURL（独自ドメイン設定時に変更）'
    }),
    defineField({
      name: 'llmsContent',
      title: 'llms.txt の内容',
      type: 'text',
      rows: 30,
      validation: Rule => Rule.required(),
      description: 'AI向けのサイト情報（llms.txt）。AI クローラーが参照する構造化された情報を記述します。',
      initialValue: `# llms.txt for Cafe Kinesi

# About
Cafe Kinesi offers comprehensive kinesiology courses, blog articles, and instructor profiles in Japan.

# Site Structure
## Main Pages
- Homepage: https://cafekinesi-nextjs.vercel.app/
- School (Course Listing): https://cafekinesi-nextjs.vercel.app/school
- Blog: https://cafekinesi-nextjs.vercel.app/blog
- Instructors: https://cafekinesi-nextjs.vercel.app/instructor
- About: https://cafekinesi-nextjs.vercel.app/about
- Profile: https://cafekinesi-nextjs.vercel.app/profile

# Organization Information
- Name: Cafe Kinesi
- Type: Educational Institution
- Country: Japan
- Main URL: https://cafekinesi-nextjs.vercel.app
- Content Language: Japanese (日本語)
- Focus: Kinesiology, Aromatherapy, Holistic Wellness

# Technical Details
- Framework: Next.js 15.5.3 with App Router
- CMS: Sanity (Project ID: e4aqw590)
- Deployment: Vercel with Edge Network`
    }),
    defineField({
      name: 'robotsRules',
      title: 'robots.txt のルール',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'userAgent',
            title: 'User Agent',
            type: 'string',
            validation: Rule => Rule.required(),
            description: 'クローラーの名前（例: GPTBot, ClaudeBot, *）'
          },
          {
            name: 'allow',
            title: 'Allow',
            type: 'string',
            description: 'アクセス許可するパス（例: /）',
            initialValue: '/'
          },
          {
            name: 'disallow',
            title: 'Disallow',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'アクセス禁止するパス（例: /api/, /admin/）'
          },
          {
            name: 'crawlDelay',
            title: 'Crawl Delay (秒)',
            type: 'number',
            description: 'クロール間隔（秒）。サーバー負荷軽減のため設定'
          }
        ],
        preview: {
          select: {
            userAgent: 'userAgent',
            allow: 'allow',
            crawlDelay: 'crawlDelay'
          },
          prepare(selection) {
            const { userAgent, allow, crawlDelay } = selection
            return {
              title: userAgent,
              subtitle: `Allow: ${allow || '未設定'}${crawlDelay ? ` | Delay: ${crawlDelay}s` : ''}`
            }
          }
        }
      }],
      description: 'クローラー制御ルール（robots.txt）。AI クローラーごとの設定を管理します。',
      initialValue: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/api/', '/admin/', '/_next/', '/private/']
        },
        {
          userAgent: 'GPTBot',
          allow: '/',
          crawlDelay: 1
        },
        {
          userAgent: 'ChatGPT-User',
          allow: '/'
        },
        {
          userAgent: 'Claude-Web',
          allow: '/',
          crawlDelay: 1
        },
        {
          userAgent: 'ClaudeBot',
          allow: '/',
          crawlDelay: 1
        },
        {
          userAgent: 'Google-Extended',
          allow: '/'
        },
        {
          userAgent: 'Bingbot',
          allow: '/'
        },
        {
          userAgent: 'PerplexityBot',
          allow: '/',
          crawlDelay: 1
        },
        {
          userAgent: 'FacebookBot',
          allow: '/'
        }
      ]
    }),
    defineField({
      name: 'sitemapEnabled',
      title: 'サイトマップを有効化',
      type: 'boolean',
      initialValue: true,
      description: 'sitemap.xml の生成を有効化'
    })
  ],
  preview: {
    select: {
      title: 'title',
      baseUrl: 'baseUrl'
    },
    prepare(selection) {
      const { title, baseUrl } = selection
      return {
        title: title || 'サイト設定',
        subtitle: baseUrl || 'URL未設定'
      }
    }
  }
})
