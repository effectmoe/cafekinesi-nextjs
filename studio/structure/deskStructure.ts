import {StructureBuilder} from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('コンテンツ')
    .items([
      // サイト設定（シングルトン）
      S.listItem()
        .title('サイト設定')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),

      // ホームページ（シングルトン）
      S.listItem()
        .title('ホームページ')
        .child(
          S.document()
            .schemaType('homepage')
            .documentId('homepage')
        ),

      S.divider(),

      // ページ
      S.listItem()
        .title('ページ')
        .child(
          S.documentTypeList('page')
            .title('ページ')
        ),

      // ブログ記事
      S.listItem()
        .title('ブログ記事')
        .child(
          S.documentTypeList('blogPost')
            .title('ブログ記事')
            .filter('_type == "blogPost"')
            .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
        ),

      S.divider(),

      // その他のコンテンツ
      ...S.documentTypeListItems().filter(
        (listItem) => ![
          'siteSettings',
          'homepage',
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