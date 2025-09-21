import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'e4aqw590',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: 'skmH5807aTZkc80e9wXtUGh6YGxvS9fmTcsxwG0vDPy9XPJ3lTpX7wYmAXl5SKy1HEOllZf3NDEg1ULmn'
})

// マーカー付きコンテンツでテスト記事を作成
const testPost = {
  _type: 'blogPost',
  title: 'マーカー機能テスト記事',
  slug: {
    _type: 'slug',
    current: 'marker-test-post'
  },
  excerpt: 'マーカー機能のテスト用記事です',
  category: 'wellness',
  publishedAt: new Date().toISOString(),
  featured: false,
  content: [
    {
      _type: 'block',
      _key: 'block1',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'span1',
          text: 'これは通常のテキストです。',
          marks: []
        },
        {
          _type: 'span',
          _key: 'span2',
          text: 'これはマーカーでハイライトされたテキストです。',
          marks: ['highlight']
        },
        {
          _type: 'span',
          _key: 'span3',
          text: 'そして再び通常のテキストです。',
          marks: []
        }
      ]
    }
  ]
}

client.create(testPost)
  .then(result => {
    console.log('テスト記事作成成功:', result._id)
    console.log('URL: http://localhost:8082/blog/marker-test-post')
  })
  .catch(error => {
    console.error('テスト記事作成エラー:', error)
  })