import {createClient} from '@sanity/client'

// Sanityクライアントの設定
const client = createClient({
  projectId: 'e4aqw590',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN, // 書き込み権限のあるトークンが必要
  useCdn: false,
})

// FAQを最初に表示する新しいデフォルト順序
const DEFAULT_CONTENT_ORDER = ['faq', 'tldr', 'toc', 'content', 'keyPoint', 'summary']

async function setDefaultContentOrder() {
  try {
    console.log('既存のブログ記事を取得中...')

    // contentOrderが未設定の記事を取得
    const posts = await client.fetch(
      `*[_type == "blogPost" && !defined(contentOrder)]{ _id, title }`
    )

    if (posts.length === 0) {
      console.log('contentOrderが未設定の記事はありません。')
      return
    }

    console.log(`${posts.length}件の記事にデフォルトのcontentOrderを設定します...`)

    // 各記事にデフォルトのcontentOrderを設定
    for (const post of posts) {
      try {
        await client
          .patch(post._id)
          .set({ contentOrder: DEFAULT_CONTENT_ORDER })
          .commit()

        console.log(`✅ ${post.title} にcontentOrderを設定しました`)
      } catch (error) {
        console.error(`❌ ${post.title} の更新に失敗:`, error)
      }
    }

    console.log('完了！')
  } catch (error) {
    console.error('エラーが発生しました:', error)
  }
}

// スクリプトを実行
setDefaultContentOrder()