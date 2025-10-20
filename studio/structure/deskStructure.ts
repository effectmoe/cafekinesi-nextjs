import {StructureBuilder} from 'sanity/structure'
import {PreviewPane} from '../components/PreviewPane'
import {SchemaMapDashboard} from '../components/SchemaMapDashboard'

export const structure = (S: StructureBuilder) =>
  S.list()
    .id('root')
    .title('コンテンツ')
    .items([
      // ================================================
      // 📊 スキーママップ（ダッシュボード）
      // ================================================
      S.listItem()
        .id('schema-map')
        .title('📊 スキーママップ')
        .child(
          S.component(SchemaMapDashboard)
            .id('schema-map-dashboard')
            .title('スキーママップ')
        ),

      S.divider(),

      // ================================================
      // 📄 ページ管理
      // ================================================
      S.listItem()
        .id('pages')
        .title('📄 ページ管理')
        .child(
          S.list()
            .id('pages-list')
            .title('ページ')
            .items([
              S.listItem()
                .id('homepage')
                .title('トップページ｜使用: /')
                .child(
                  S.document()
                    .schemaType('homepage')
                    .documentId('homepage')
                ),
              S.listItem()
                .id('aboutPage')
                .title('カフェキネシについて（Aboutページ）｜使用: /about')
                .child(
                  S.document()
                    .schemaType('aboutPage')
                    .documentId('aboutPage')
                    .views([
                      S.view.form().id('aboutPageEditor').title('編集'),
                      S.view.component(PreviewPane).id('aboutPagePreview').title('プレビュー')
                    ])
                ),
              S.documentTypeListItem('page')
                .title('ページ｜使用: /[slug]（動的ページ）'),
              S.listItem()
                .id('schoolPage')
                .title('スクールページ設定｜使用: /school')
                .child(
                  S.document()
                    .schemaType('schoolPage')
                    .documentId('schoolPage')
                    .views([
                      S.view.form().id('schoolPageEditor').title('編集'),
                      S.view.component(PreviewPane).id('schoolPagePreview').title('プレビュー')
                    ])
                ),
              S.documentTypeListItem('schoolPageContent')
                .title('スクールページコンテンツ｜使用: /school'),
              S.documentTypeListItem('instructorPage')
                .title('インストラクターページ設定｜使用: /instructor'),
              S.documentTypeListItem('profilePage')
                .title('プロフィールページ｜使用: /profile'),
            ])
        ),

      S.divider(),

      // ================================================
      // 📝 コンテンツ
      // ================================================
      S.listItem()
        .id('content')
        .title('📝 コンテンツ')
        .child(
          S.list()
            .id('content-list')
            .title('コンテンツ')
            .items([
              // ブログ記事
              S.listItem()
                .id('blogPost')
                .title('ブログ記事｜使用: /blog, /blog/[slug]')
                .child(
                  S.documentTypeList('blogPost')
                    .title('ブログ記事')
                    .filter('_type == "blogPost"')
                    .apiVersion('2024-01-01')
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
                ),
              S.documentTypeListItem('author')
                .title('著者｜使用: /author/[slug], /blog/*'),
              S.documentTypeListItem('category')
                .title('カテゴリー｜使用: menuItem参照（フロントエンドページ未実装？）'),

              S.divider(),

              // 講座
              S.listItem()
                .id('course')
                .title('講座｜使用: /school, /school/[courseId]')
                .child(
                  S.list()
                    .id('courses-list')
                    .title('講座一覧')
                    .items([
                      S.listItem()
                        .title('すべての講座')
                        .id('all-courses')
                        .child(
                          S.documentTypeList('course')
                            .title('すべての講座')
                            .filter('_type == "course"')
                            .defaultOrdering([{ field: 'order', direction: 'asc' }])
                        ),
                      S.divider(),
                      S.listItem()
                        .title('主要講座')
                        .id('main-courses')
                        .child(
                          S.documentList()
                            .id('main-courses-list')
                            .title('主要講座')
                            .filter('_type == "course" && courseType == "main"')
                            .defaultOrdering([{ field: 'order', direction: 'asc' }])
                        ),
                      S.listItem()
                        .title('補助講座')
                        .id('auxiliary-courses')
                        .child(
                          S.documentList()
                            .id('auxiliary-courses-list')
                            .title('補助講座')
                            .filter('_type == "course" && courseType == "auxiliary"')
                            .defaultOrdering([{ field: 'order', direction: 'asc' }])
                        ),
                    ])
                ),

              S.divider(),

              // イベント
              S.documentTypeListItem('event')
                .title('イベント｜使用: /events/[slug], /calendar'),

              // インストラクター
              S.documentTypeListItem('instructor')
                .title('インストラクター｜使用: /instructor, /instructor/[prefecture]/[slug]'),
            ])
        ),

      S.divider(),

      // ================================================
      // ⚙️ 設定
      // ================================================
      S.listItem()
        .id('settings')
        .title('⚙️ 設定')
        .child(
          S.list()
            .id('settings-list')
            .title('設定')
            .items([
              // サイト設定
              S.listItem()
                .id('site-settings')
                .title('サイト設定（LLMO/SEO）｜使用: 全ページ')
                .child(
                  S.document()
                    .schemaType('siteSettings')
                    .documentId('siteSettings')
                    .views([
                      S.view.form().id('siteSettingsEditor').title('編集'),
                      S.view.component(PreviewPane).id('siteSettingsPreview').title('プレビュー')
                    ])
                ),

              S.divider(),

              // チャット設定
              S.listItem()
                .id('chatModal')
                .title('チャットモーダル設定｜使用: /')
                .child(
                  S.document()
                    .schemaType('chatModal')
                    .documentId('chatModal-main')
                    .views([
                      S.view.form().id('chatModalEditor').title('編集'),
                      S.view.component(PreviewPane).id('chatModalPreview').title('プレビュー')
                    ])
                ),
              S.documentTypeListItem('faqCard')
                .title('FAQ質問カード｜使用: / (チャットモーダル)'),
              S.documentTypeListItem('chatConfiguration')
                .title('チャット設定｜使用: /api/chat/rag'),

              S.divider(),

              // FAQ
              S.documentTypeListItem('faq')
                .title('FAQ｜使用: / (FAQ機能)'),
              S.documentTypeListItem('faqCategory')
                .title('FAQカテゴリ｜使用: / (FAQ機能)'),

              S.divider(),

              // PWA設定
              S.listItem()
                .id('pwa-settings')
                .title('PWA設定｜使用: /api/manifest（アプリインストール）')
                .child(
                  S.document()
                    .schemaType('pwaSettings')
                    .documentId('pwaSettings')
                ),

              S.divider(),

              // その他設定
              S.documentTypeListItem('menuItem')
                .title('メニューアイテム｜使用: menuItem参照（フロントエンドページ未実装？）'),
              S.documentTypeListItem('shopInfo')
                .title('店舗情報｜使用: 店舗情報の管理（フロントエンドページ未実装？）'),
            ])
        ),

      S.divider(),

      // ================================================
      // 🤖 AI/RAG
      // ================================================
      S.listItem()
        .id('ai-rag')
        .title('🤖 AI/RAG')
        .child(
          S.list()
            .id('ai-rag-list')
            .title('AI/RAG設定')
            .items([
              S.documentTypeListItem('ragConfiguration')
                .title('RAG設定｜使用: /api/chat/rag'),
              S.documentTypeListItem('aiGuardrails')
                .title('AIガードレール設定｜使用: /api/chat/rag'),
              S.documentTypeListItem('aiProviderSettings')
                .title('AIプロバイダー設定｜使用: /api/chat/rag'),
              S.documentTypeListItem('knowledgeBase')
                .title('ナレッジベース｜使用: RAG'),
            ])
        ),

      S.divider(),

      // ================================================
      // 🤖 AI-First（非推奨・参照用）
      // ================================================
      S.listItem()
        .id('ai-first')
        .title('🤖 AI-First（非推奨・参照用）')
        .child(
          S.list()
            .id('ai-first-list')
            .title('AI-First')
            .items([
              S.documentTypeListItem('person')
                .title('個人情報（DB同期）｜ステータス: ⚠️ 非推奨（instructorと重複）'),
              S.documentTypeListItem('service')
                .title('サービス情報（DB同期）｜ステータス: ⚠️ 非推奨（フロントエンド未実装）'),
              S.documentTypeListItem('organization')
                .title('組織情報（DB同期）｜ステータス: ⚠️ 非推奨（将来用に保持）'),
              S.documentTypeListItem('aiContent')
                .title('AI生成コンテンツ｜ステータス: ⚠️ 非推奨（AI検索最適化用・将来）'),
            ])
        ),

      S.divider(),

      // ================================================
      // 👤 その他
      // ================================================
      S.listItem()
        .id('other')
        .title('👤 その他')
        .child(
          S.list()
            .id('other-list')
            .title('その他')
            .items([
              S.documentTypeListItem('representative')
                .title('代表者｜使用: API（DB同期）'),
            ])
        ),

      S.divider(),

      // ================================================
      // その他のコンテンツ（自動表示）
      // ================================================
      ...S.documentTypeListItems().filter(
        (listItem) => ![
          // スキーママップ
          'schemaMap',

          // ページ管理
          'homepage',
          'aboutPage',
          'page',
          'schoolPage',
          'schoolPageContent',
          'instructorPage',
          'profilePage',

          // コンテンツ
          'blogPost',
          'author',
          'course',
          'event',
          'instructor',
          'category',
          'news',

          // 設定
          'siteSettings',
          'pwaSettings',
          'chatModal',
          'faqCard',
          'chatConfiguration',
          'faq',
          'faqCategory',
          'menuItem',
          'shopInfo',

          // AI/RAG
          'ragConfiguration',
          'aiGuardrails',
          'aiProviderSettings',
          'knowledgeBase',

          // AI-First（非推奨・非表示）
          'person',
          'service',
          'organization',
          'aiContent',

          // その他
          'representative',

          // オブジェクト・コンポーネントスキーマは非表示
          'seo',
          'hero',
          'cta',
          'feature',
          'testimonial',
          'categoryCard',
          'socialLink',
          'navigationMenu',
          'table',
          'infoBox',
          'comparisonTable',
          'internalLink',
          'externalReference',
          'customImage',
          'portableText',
          'videoEmbed',
          'socialEmbed',
          'codeBlock'
        ].includes(listItem.getId() ?? '')
      )
    ])
