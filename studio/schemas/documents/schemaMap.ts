import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'schemaMap',
  type: 'document',
  title: '📋 スキーママップ',
  icon: () => '📋',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'タイトル',
      initialValue: 'Sanity Schema Map',
      readOnly: true
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: '説明',
      rows: 3,
      initialValue: 'このドキュメントはSanity Studioの全スキーマ構成を管理します。',
      readOnly: true
    }),
    defineField({
      name: 'lastUpdated',
      type: 'datetime',
      title: '最終更新日時',
      initialValue: () => new Date().toISOString()
    }),
    defineField({
      name: 'documentTypes',
      type: 'object',
      title: 'ドキュメントタイプ',
      fields: [
        {
          name: 'aifirst',
          type: 'array',
          title: '🤖 AI-First ドキュメント',
          of: [{ type: 'string' }],
          initialValue: ['person', 'service', 'organization', 'aiContent']
        },
        {
          name: 'pages',
          type: 'array',
          title: '📄 ページ管理',
          of: [{ type: 'string' }],
          initialValue: ['homepage', 'aboutPage', 'page', 'schoolPage', 'schoolPageContent', 'instructorPage', 'profilePage']
        },
        {
          name: 'blog',
          type: 'array',
          title: '📝 ブログ・コンテンツ',
          of: [{ type: 'string' }],
          initialValue: ['blogPost', 'author', 'category', 'news']
        },
        {
          name: 'courses',
          type: 'array',
          title: '🎓 講座・イベント',
          of: [{ type: 'string' }],
          initialValue: ['course', 'instructor', 'event']
        },
        {
          name: 'chat',
          type: 'array',
          title: '💬 チャット・FAQ',
          of: [{ type: 'string' }],
          initialValue: ['chatModal', 'faqCard', 'faq', 'faqCategory', 'chatConfiguration']
        },
        {
          name: 'ai',
          type: 'array',
          title: '🤖 AI/RAG設定',
          of: [{ type: 'string' }],
          initialValue: ['ragConfiguration', 'aiGuardrails', 'aiProviderSettings', 'knowledgeBase']
        },
        {
          name: 'settings',
          type: 'array',
          title: '⚙️ その他設定',
          of: [{ type: 'string' }],
          initialValue: ['siteSettings', 'menuItem', 'shopInfo']
        },
        {
          name: 'organization',
          type: 'array',
          title: '👤 組織・代表者',
          of: [{ type: 'string' }],
          initialValue: ['representative']
        }
      ]
    }),
    defineField({
      name: 'objectTypes',
      type: 'object',
      title: 'オブジェクト/コンポーネント',
      fields: [
        {
          name: 'ui',
          type: 'array',
          title: '🎨 UI コンポーネント',
          of: [{ type: 'string' }],
          initialValue: [
            'seo', 'schemaOrg', 'hero', 'cta', 'feature', 'testimonial',
            'categoryCard', 'socialLink', 'navigationMenu', 'table',
            'infoBox', 'comparisonTable', 'internalLink', 'externalReference'
          ]
        },
        {
          name: 'media',
          type: 'array',
          title: '📸 メディアコンポーネント',
          of: [{ type: 'string' }],
          initialValue: [
            'customImage', 'portableText', 'videoEmbed', 'socialEmbed',
            'codeBlock', 'blockContent', 'customBlock', 'descriptionBlock'
          ]
        }
      ]
    }),
    defineField({
      name: 'studioDisplay',
      type: 'object',
      title: 'Sanity Studio表示構成',
      fields: [
        {
          name: 'explicitSections',
          type: 'array',
          title: '明示的に定義されたセクション',
          of: [{ type: 'string' }],
          initialValue: [
            '🏠 サイト設定',
            '📄 ページ管理',
            '📝 ブログ記事',
            '🎓 講座',
            '💬 チャット設定',
            '🤖 AI/RAG設定'
          ]
        },
        {
          name: 'autoDisplay',
          type: 'array',
          title: '自動表示（その他のコンテンツ）',
          of: [{ type: 'string' }],
          initialValue: [
            'category', 'event', 'news', 'menuItem', 'shopInfo',
            'schoolPageContent', 'instructor', 'instructorPage', 'profilePage',
            'representative', 'faq', 'faqCategory',
            'person', 'service', 'organization', 'aiContent'
          ]
        },
        {
          name: 'hidden',
          type: 'array',
          title: '非表示（オブジェクト/コンポーネント）',
          of: [{ type: 'string' }],
          initialValue: [
            'seo', 'hero', 'cta', 'feature', 'testimonial',
            'categoryCard', 'socialLink', 'navigationMenu', 'table',
            'infoBox', 'comparisonTable', 'internalLink', 'externalReference',
            'customImage', 'portableText', 'videoEmbed', 'socialEmbed', 'codeBlock',
            'blockContent', 'customBlock', 'descriptionBlock'
          ]
        }
      ]
    }),
    defineField({
      name: 'notes',
      type: 'array',
      title: 'メモ・備考',
      of: [{ type: 'block' }]
    })
  ],
  preview: {
    select: {
      title: 'title',
      lastUpdated: 'lastUpdated'
    },
    prepare({ title, lastUpdated }) {
      return {
        title: title || 'スキーママップ',
        subtitle: lastUpdated ? `最終更新: ${new Date(lastUpdated).toLocaleString('ja-JP')}` : '未更新'
      }
    }
  }
})
