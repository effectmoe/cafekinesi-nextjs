import {StructureBuilder} from 'sanity/structure'
import {PreviewPane} from '../components/PreviewPane'

export const structure = (S: StructureBuilder) =>
  S.list()
    .id('root')
    .title('コンテンツ')
    .items([
      // サイト設定（シングルトン）
      S.listItem()
        .title('サイト設定')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .views([
              S.view.form().id('siteSettingsEditor').title('編集'),
              S.view.component(PreviewPane).id('siteSettingsPreview').title('プレビュー')
            ])
        ),

      // ホームページ（シングルトン）
      S.listItem()
        .title('ホームページ')
        .id('homepage')
        .child(
          S.document()
            .schemaType('homepage')
            .documentId('homepage')
        ),

      S.divider(),

      // カフェキネシについて（Aboutページ）シングルトン
      S.listItem()
        .title('カフェキネシについて（Aboutページ）')
        .id('aboutPage')
        .child(
          S.document()
            .schemaType('aboutPage')
            .documentId('aboutPage')
            .views([
              S.view.form().id('aboutPageEditor').title('編集'),
              S.view.component(PreviewPane).id('aboutPagePreview').title('プレビュー')
            ])
        ),

      // チャットモーダル設定（シングルトン）
      S.listItem()
        .title('チャットモーダル設定')
        .id('chatModal')
        .child(
          S.document()
            .schemaType('chatModal')
            .documentId('chatModal-main')
            .views([
              S.view.form().id('chatModalEditor').title('編集'),
              S.view.component(PreviewPane).id('chatModalPreview').title('プレビュー')
            ])
        ),

      S.divider(),

      // ページ
      S.listItem()
        .title('ページ')
        .id('pages')
        .child(
          S.documentTypeList('page')
            .title('ページ')
        ),

      // ブログ記事
      S.listItem()
        .title('ブログ記事')
        .id('blogPosts')
        .child(
          S.documentTypeList('blogPost')
            .title('ブログ記事')
            .filter('_type == "blogPost"')
            .apiVersion('2024-01-01')
            .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
        ),

      S.divider(),

      // 講座を階層的に表示
      S.listItem()
        .title('講座')
        .id('courses')
        .child(
          S.list()
            .title('講座一覧')
            .items([
              // すべての講座
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

              // 主要講座
              S.listItem()
                .title('主要講座')
                .id('main-courses')
                .child(
                  S.documentList()
                    .title('主要講座')
                    .filter('_type == "course" && courseType == "main"')
                    .defaultOrdering([{ field: 'order', direction: 'asc' }])
                ),

              // 補助講座
              S.listItem()
                .title('補助講座')
                .id('auxiliary-courses')
                .child(
                  S.documentList()
                    .title('補助講座')
                    .filter('_type == "course" && courseType == "auxiliary"')
                    .defaultOrdering([{ field: 'order', direction: 'asc' }])
                ),
            ])
        ),

      S.divider(),

      // その他のコンテンツ
      ...S.documentTypeListItems().filter(
        (listItem) => ![
          'siteSettings',
          'homepage',
          'aboutPage',
          'chatModal',
          'page',
          'blogPost',
          'course',  // 講座は上で明示的に定義
          // オブジェクト・コンポーネントスキーマは非表示
          'seo',
          'hero',
          'cta',
          'feature',
          'testimonial',
          'customImage',
          'portableText',
          'videoEmbed',
          'socialEmbed',
          'codeBlock'
        ].includes(listItem.getId() ?? '')
      )
    ])