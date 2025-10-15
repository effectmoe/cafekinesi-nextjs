#!/usr/bin/env tsx

/**
 * ブログ投稿への参照を削除するスクリプト
 *
 * 使用方法:
 * npx tsx scripts/remove-blog-references.ts <削除したいブログ投稿のID>
 *
 * 例:
 * npx tsx scripts/remove-blog-references.ts XAQEqtwWGfwaiZX4sDipwF
 */

import { createClient } from '@sanity/client'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '../.env.local') })

const sanityClient = createClient({
  projectId: 'e4aqw590',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
})

async function removeBlogReferences(blogPostId: string) {
  console.log(`\n🔍 ブログ投稿への参照を検索中: ${blogPostId}\n`)

  try {
    // 削除対象のブログ投稿情報を取得
    const targetPost = await sanityClient.getDocument(blogPostId)

    if (!targetPost) {
      console.error(`❌ ブログ投稿が見つかりません: ${blogPostId}`)
      return
    }

    console.log(`📝 削除対象: ${targetPost.title || 'タイトルなし'}`)
    console.log(`   ID: ${blogPostId}\n`)

    // このブログ投稿を参照しているドキュメントを検索
    const postsWithReferences = await sanityClient.fetch(
      `*[_type == "blogPost" && references($blogPostId)] {
        _id,
        title,
        slug,
        relatedArticles
      }`,
      { blogPostId }
    )

    console.log(`📊 参照しているドキュメント: ${postsWithReferences.length}件\n`)

    if (postsWithReferences.length === 0) {
      console.log('✅ 参照がありません。Sanity Studioから直接削除できます。')
      return
    }

    // 各ドキュメントから参照を削除
    for (const post of postsWithReferences) {
      console.log(`📄 処理中: ${post.title}`)
      console.log(`   ID: ${post._id}`)
      console.log(`   Slug: ${post.slug?.current || 'なし'}`)

      // relatedArticlesから該当のブログを削除
      const updatedRelatedArticles = post.relatedArticles
        ?.filter((article: any) => {
          const refId = article._ref || article
          return refId !== blogPostId
        })
        .map((article: any) => {
          // 既にreferenceオブジェクトの場合はそのまま、IDのみの場合は変換
          if (typeof article === 'object' && article._ref) {
            return article
          }
          return {
            _type: 'reference',
            _ref: article,
            _key: Math.random().toString(36).substr(2, 9)
          }
        }) || []

      console.log(`   変更前: ${post.relatedArticles?.length || 0}件の関連記事`)
      console.log(`   変更後: ${updatedRelatedArticles.length}件の関連記事`)

      // ドキュメントを更新
      await sanityClient
        .patch(post._id)
        .set({ relatedArticles: updatedRelatedArticles })
        .commit()

      console.log(`   ✅ 参照を削除しました\n`)
    }

    console.log('━'.repeat(60))
    console.log('✅ すべての参照を削除しました！')
    console.log('━'.repeat(60))
    console.log('\n📌 次のステップ:')
    console.log('   1. Sanity Studioをリフレッシュ（F5キー）')
    console.log('   2. 削除したいブログ投稿を開く')
    console.log('   3. 右上の「…」メニューから「Delete」を選択')
    console.log('   4. 削除を確認\n')

  } catch (error) {
    console.error('❌ エラーが発生しました:', error)
  }
}

// コマンドライン引数からブログ投稿IDを取得
const blogPostId = process.argv[2]

if (!blogPostId) {
  console.error('❌ エラー: ブログ投稿のIDを指定してください')
  console.log('\n使用方法:')
  console.log('  npx tsx scripts/remove-blog-references.ts <ブログ投稿ID>')
  console.log('\n例:')
  console.log('  npx tsx scripts/remove-blog-references.ts XAQEqtwWGfwaiZX4sDipwF')
  process.exit(1)
}

// スクリプト実行
removeBlogReferences(blogPostId)
