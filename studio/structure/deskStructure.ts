import {StructureBuilder, StructureResolverContext} from 'sanity/structure'
import {SchemaMapDashboard} from '../components/SchemaMapDashboard'

export const structure = (S: StructureBuilder, context: StructureResolverContext) =>
  S.list()
    .title('コンテンツ')
    .items([
      // ================================================
      // 📊 スキーママップ（ダッシュボード）
      // ================================================
      S.listItem()
        .title('📊 スキーママップ')
        .child(
          S.component(SchemaMapDashboard)
            .title('スキーママップ')
        ),

      S.divider(),

      // ================================================
      // 🏠 サイト設定
      // ================================================
      S.listItem()
        .title('🏠 サイト設定（LLMO/SEO）')
        .child(
          S.list()
            .title('サイト設定')
            .items([
              S.documentTypeListItem('siteSettings')
                .title('📱 サイト設定 (LLMO/SEO)')
                .child(
                  S.documentList()
                    .title('サイト設定')
                    .filter('_type == "siteSettings"')
                ),
            ])
        ),

      S.divider(),

      // ================================================
      // 📄 ページ管理
      // ================================================
      S.listItem()
        .title('📄 ページ管理')
        .child(
          S.list()
            .title('ページ')
            .items([
              S.documentTypeListItem('homepage')
                .title('🏠 ホームページ｜使用: /')
                .child(
                  S.documentList()
                    .title('ホームページ')
                    .filter('_type == "homepage"')
                ),
              S.documentTypeListItem('aboutPage')
                .title('ℹ️ カフェキネシについて｜使用: /')
                .child(
                  S.documentList()
                    .title('カフェキネシについて')
                    .filter('_type == "aboutPage"')
                ),
              S.documentTypeListItem('page')
                .title('📄 ページ｜使用: /[slug]')
                .child(
                  S.documentList()
                    .title('ページ')
                    .filter('_type == "page"')
                ),
              S.documentTypeListItem('schoolPage')
                .title('🎓 スクールページ設定｜使用: /school')
                .child(
                  S.documentList()
                    .title('スクールページ設定')
                    .filter('_type == "schoolPage"')
                ),
              S.documentTypeListItem('instructorPage')
                .title('👨‍🏫 インストラクターページ設定｜使用: /instructor')
                .child(
                  S.documentList()
                    .title('インストラクターページ設定')
                    .filter('_type == "instructorPage"')
                ),
              S.documentTypeListItem('profilePage')
                .title('👤 プロフィールページ｜使用: /profile')
                .child(
                  S.documentList()
                    .title('プロフィールページ')
                    .filter('_type == "profilePage"')
                ),
            ])
        ),

      S.divider(),

      // ================================================
      // 📝 ブログ記事
      // ================================================
      S.listItem()
        .title('📝 ブログ記事')
        .child(
          S.list()
            .title('ブログ記事')
            .items([
              S.documentTypeListItem('blogPost')
                .title('📝 ブログ記事｜使用: /blog, /blog/[slug]')
                .child(
                  S.documentList()
                    .title('ブログ記事')
                    .filter('_type == "blogPost"')
                ),
              S.documentTypeListItem('author')
                .title('✏️ 著者｜使用: /author/[slug], /blog/*')
                .child(
                  S.documentList()
                    .title('著者')
                    .filter('_type == "author"')
                ),
            ])
        ),

      S.divider(),

      // ================================================
      // 🎓 講座
      // ================================================
      S.listItem()
        .title('🎓 講座')
        .child(
          S.documentTypeListItem('course')
            .title('📚 講座｜使用: /school, /school/[courseId]')
        ),

      S.divider(),

      // ================================================
      // 👨‍🏫 インストラクター
      // ================================================
      S.listItem()
        .title('👨‍🏫 インストラクター')
        .child(
          S.documentTypeListItem('instructor')
            .title('👨‍🏫 インストラクター｜使用: /instructor, /instructor/[prefecture]/[slug]')
        ),

      S.divider(),

      // ================================================
      // 📅 イベント
      // ================================================
      S.listItem()
        .title('📅 イベント')
        .child(
          S.documentTypeListItem('event')
            .title('📅 イベント｜使用: /events/[slug], /calendar')
        ),

      S.divider(),

      // ================================================
      // 💬 チャット設定
      // ================================================
      S.listItem()
        .title('💬 チャット設定')
        .child(
          S.list()
            .title('チャット設定')
            .items([
              S.documentTypeListItem('chatModal')
                .title('💬 チャットモーダル設定｜使用: /')
                .child(
                  S.documentList()
                    .title('チャットモーダル設定')
                    .filter('_type == "chatModal"')
                ),
              S.documentTypeListItem('faqCard')
                .title('❓ FAQ質問カード｜使用: / (チャットモーダル)')
                .child(
                  S.documentList()
                    .title('FAQ質問カード')
                    .filter('_type == "faqCard"')
                ),
              S.documentTypeListItem('chatConfiguration')
                .title('⚙️ チャット設定｜使用: /api/chat/rag')
                .child(
                  S.documentList()
                    .title('チャット設定')
                    .filter('_type == "chatConfiguration"')
                ),
            ])
        ),

      S.divider(),

      // ================================================
      // 🤖 AI/RAG設定
      // ================================================
      S.listItem()
        .title('🤖 AI/RAG設定')
        .child(
          S.list()
            .title('AI/RAG設定')
            .items([
              S.documentTypeListItem('ragConfiguration')
                .title('🔧 RAG設定｜使用: /api/chat/rag')
                .child(
                  S.documentList()
                    .title('RAG設定')
                    .filter('_type == "ragConfiguration"')
                ),
              S.documentTypeListItem('aiGuardrails')
                .title('🛡️ AIガードレール設定｜使用: /api/chat/rag')
                .child(
                  S.documentList()
                    .title('AIガードレール設定')
                    .filter('_type == "aiGuardrails"')
                ),
              S.documentTypeListItem('aiProviderSettings')
                .title('🔌 AIプロバイダー設定｜使用: /api/chat/rag')
                .child(
                  S.documentList()
                    .title('AIプロバイダー設定')
                    .filter('_type == "aiProviderSettings"')
                ),
              S.documentTypeListItem('knowledgeBase')
                .title('📚 ナレッジベース')
                .child(
                  S.documentList()
                    .title('ナレッジベース')
                    .filter('_type == "knowledgeBase"')
                ),
            ])
        ),

      S.divider(),

      // ================================================
      // 👤 代表者
      // ================================================
      S.listItem()
        .title('👤 代表者')
        .child(
          S.documentTypeListItem('representative')
            .title('👤 代表者｜使用: API（DB同期）')
        ),

      S.divider(),

      // ================================================
      // 📋 AI context
      // ================================================
      S.listItem()
        .title('📋 AI context')
        .child(
          S.documentTypeListItem('aiContext')
            .title('📋 AI context')
        ),

      S.divider(),

      // ================================================
      // ❓ FAQ
      // ================================================
      S.listItem()
        .title('❓ FAQ')
        .child(
          S.list()
            .title('FAQ')
            .items([
              S.documentTypeListItem('faq')
                .title('❓ FAQ')
                .child(
                  S.documentList()
                    .title('FAQ')
                    .filter('_type == "faq"')
                ),
              S.documentTypeListItem('faqCategory')
                .title('📁 FAQカテゴリー')
                .child(
                  S.documentList()
                    .title('FAQカテゴリー')
                    .filter('_type == "faqCategory"')
                ),
            ])
        ),

      S.divider(),

      // ================================================
      // 📢 お知らせ
      // ================================================
      S.listItem()
        .title('📢 お知らせ')
        .child(
          S.documentTypeListItem('announcement')
            .title('📢 お知らせ')
        ),

      S.divider(),

      // ================================================
      // 🗂️ その他のコンテンツタイプ
      // ================================================
      S.listItem()
        .title('🗂️ その他のコンテンツタイプ')
        .child(
          S.list()
            .title('その他')
            .items([
              S.documentTypeListItem('seoSettings')
                .title('🔍 SEO設定')
                .child(
                  S.documentList()
                    .title('SEO設定')
                    .filter('_type == "seoSettings"')
                ),
              S.documentTypeListItem('redirects')
                .title('🔀 リダイレクト設定')
                .child(
                  S.documentList()
                    .title('リダイレクト設定')
                    .filter('_type == "redirects"')
                ),
              S.documentTypeListItem('sitemap')
                .title('🗺️ サイトマップ設定')
                .child(
                  S.documentList()
                    .title('サイトマップ設定')
                    .filter('_type == "sitemap"')
                ),
              // すべてのスキーマを表示するオプション
              ...S.documentTypeListItems().filter(
                (listItem) => {
                  const id = listItem.getId()
                  // すでに上で定義したスキーマは除外
                  const definedTypes = [
                    'siteSettings',
                    'homepage',
                    'aboutPage',
                    'page',
                    'schoolPage',
                    'instructorPage',
                    'profilePage',
                    'blogPost',
                    'author',
                    'course',
                    'instructor',
                    'event',
                    'chatModal',
                    'faqCard',
                    'chatConfiguration',
                    'ragConfiguration',
                    'aiGuardrails',
                    'aiProviderSettings',
                    'knowledgeBase',
                    'representative',
                    'aiContext',
                    'faq',
                    'faqCategory',
                    'announcement',
                    'seoSettings',
                    'redirects',
                    'sitemap',
                  ]
                  return id ? !definedTypes.includes(id) : true
                }
              ),
            ])
        ),
    ])
