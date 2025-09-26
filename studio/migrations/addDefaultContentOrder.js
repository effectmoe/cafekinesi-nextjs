import {defineMigration, at} from 'sanity/migrate'

const defaultContentOrder = [
  'title', 'slug', 'featured', 'publishedAt', 'category', 'author',
  'excerpt', 'tags', 'mainImage', 'gallery', 'additionalImages',
  'ogImage', 'tldr', 'toc', 'content', 'keyPoint', 'summary',
  'faq', 'related', 'prevNext'
]

export default defineMigration({
  title: 'Add default contentOrder to existing blog posts',
  documentTypes: ['blogPost'],
  migrate: {
    document(doc, context) {
      // contentOrderが未設定または空の場合のみ設定
      if (!doc.contentOrder || doc.contentOrder.length === 0) {
        return at('contentOrder', defaultContentOrder)
      }
      return doc
    },
  },
})