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

async function checkBlogPost() {
  console.log('🔍 ブログ記事を確認中...\n')

  const slug = 'breathing-stress-relief'

  try {
    const post = await sanityClient.fetch(`
      *[_type == "blogPost" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        excerpt,
        tldr,
        content,
        faq,
        tags,
        category,
        publishedAt,
        author-> {
          name
        }
      }
    `, { slug })

    if (!post) {
      console.log(`❌ ブログ記事が見つかりません: ${slug}`)
      console.log('\n既存のブログ記事一覧:')
      const allPosts = await sanityClient.fetch(`
        *[_type == "blogPost"][0...10] {
          slug,
          title
        }
      `)
      allPosts.forEach((p: any) => {
        console.log(`  - ${p.slug?.current}: ${p.title}`)
      })
      return
    }

    console.log('📊 ブログ記事情報:')
    console.log('  ID:', post._id)
    console.log('  タイトル:', post.title)
    console.log('  スラッグ:', post.slug?.current)
    console.log('  カテゴリー:', post.category)
    console.log('  タグ:', post.tags?.join(', ') || 'なし')
    console.log('  抜粋:', post.excerpt ? `${post.excerpt.substring(0, 50)}...` : 'なし')
    console.log('  TL;DR:', post.tldr ? '✅ あり' : '❌ なし')
    console.log('  本文ブロック数:', post.content?.length || 0)
    console.log('  FAQ数:', post.faq?.length || 0)
    console.log('  著者:', post.author?.name || 'なし')
    console.log('  公開日:', post.publishedAt || '未設定')

  } catch (error) {
    console.error('\n💥 エラー:', error)
    process.exit(1)
  }
}

checkBlogPost()
