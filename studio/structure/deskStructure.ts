import {StructureBuilder, StructureResolverContext} from 'sanity/structure'
import {SchemaMapDashboard} from '../components/SchemaMapDashboard'

export const structure = (S: StructureBuilder, context: StructureResolverContext) =>
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
      // 🏠 サイト設定
      // ================================================
      S.listItem()
        .id('site-settings')
        .title('🏠 サイト設定（LLMO/SEO）')
        .child(
          S.documentTypeListItem('siteSettings')
            .title('サイト設定 (LLMO/SEO)')
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
              S.documentTypeListItem('homepage')
                .title('ホームページ｜使用: /'),
              S.documentTypeListItem('aboutPage')
                .title('カフェキネシについて｜使用: /'),
              S.documentTypeListItem('page')
                .title('ページ｜使用: /[slug]'),
              S.documentTypeListItem('schoolPage')
                .title('スクールページ設定｜使用: /school'),
              S.documentTypeListItem('instructorPage')
                .title('インストラクターページ設定｜使用: /instructor'),
              S.documentTypeListItem('profilePage')
                .title('プロフィールページ｜使用: /profile'),
            ])
        ),

      S.divider(),

      // ================================================
      // 📝 ブログ記事
      // ================================================
      S.listItem()
        .id('blog')
        .title('📝 ブログ記事')
        .child(
          S.list()
            .id('blog-list')
            .title('ブログ記事')
            .items([
              S.documentTypeListItem('blogPost')
                .title('ブログ記事｜使用: /blog, /blog/[slug]'),
              S.documentTypeListItem('author')
                .title('著者｜使用: /author/[slug], /blog/*'),
            ])
        ),

      S.divider(),

      // ================================================
      // 🎓 講座
      // ================================================
      S.listItem()
        .id('course')
        .title('🎓 講座')
        .child(
          S.documentTypeListItem('course')
            .title('講座｜使用: /school, /school/[courseId]')
        ),

      S.divider(),

      // ================================================
      // 👨‍🏫 インストラクター
      // ================================================
      S.listItem()
        .id('instructor')
        .title('👨‍🏫 インストラクター')
        .child(
          S.documentTypeListItem('instructor')
            .title('インストラクター｜使用: /instructor, /instructor/[prefecture]/[slug]')
        ),

      S.divider(),

      // ================================================
      // 📅 イベント
      // ================================================
      S.listItem()
        .id('event')
        .title('📅 イベント')
        .child(
          S.documentTypeListItem('event')
            .title('イベント｜使用: /events/[slug], /calendar')
        ),

      S.divider(),

      // ================================================
      // 💬 チャット設定
      // ================================================
      S.listItem()
        .id('chat')
        .title('💬 チャット設定')
        .child(
          S.list()
            .id('chat-list')
            .title('チャット設定')
            .items([
              S.documentTypeListItem('chatModal')
                .title('チャットモーダル設定｜使用: /'),
              S.documentTypeListItem('faqCard')
                .title('FAQ質問カード｜使用: / (チャットモーダル)'),
              S.documentTypeListItem('chatConfiguration')
                .title('チャット設定｜使用: /api/chat/rag'),
            ])
        ),

      S.divider(),

      // ================================================
      // 🤖 AI/RAG設定
      // ================================================
      S.listItem()
        .id('ai-rag')
        .title('🤖 AI/RAG設定')
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
            ])
        ),

      S.divider(),

      // ================================================
      // 👤 代表者
      // ================================================
      S.listItem()
        .id('representative')
        .title('👤 代表者')
        .child(
          S.documentTypeListItem('representative')
            .title('代表者｜使用: API（DB同期）')
        ),

      S.divider(),

      // ================================================
      // 🗂️ その他のコンテンツタイプ
      // ================================================
      S.listItem()
        .id('other')
        .title('🗂️ その他のコンテンツタイプ')
        .child(
          S.list()
            .id('other-list')
            .title('その他')
            .items([
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
                    'representative',
                  ]
                  return id ? !definedTypes.includes(id) : true
                }
              ),
            ])
        ),
    ])
