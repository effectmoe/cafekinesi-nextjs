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
              S.view.form().id('aboutPageEditor'),
              S.view.component(PreviewPane).id('aboutPagePreview').title('プレビュー')
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

      // その他のコンテンツ
      ...S.documentTypeListItems().filter(
        (listItem) => ![
          'siteSettings',
          'homepage',
          'aboutPage',
          'page',
          'blogPost',
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