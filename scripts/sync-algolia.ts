/**
 * Sanity → Algolia データ同期スクリプト
 *
 * このスクリプトは、Sanityからすべてのコンテンツを取得し、
 * Algoliaの検索インデックスに同期します。
 */

import { algoliasearch } from 'algoliasearch'
import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import { resolve } from 'path'

// 環境変数を読み込み
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

// Algoliaクライアントの初期化
const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const algoliaAdminKey = process.env.ALGOLIA_ADMIN_API_KEY
const algoliaIndexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'cafekinesi_content'

if (!algoliaAppId || !algoliaAdminKey) {
  console.error('❌ Algolia環境変数が設定されていません')
  console.error('必要な環境変数:')
  console.error('- NEXT_PUBLIC_ALGOLIA_APP_ID')
  console.error('- ALGOLIA_ADMIN_API_KEY')
  console.error('- NEXT_PUBLIC_ALGOLIA_INDEX_NAME (オプション)')
  process.exit(1)
}

const algoliaClient = algoliasearch(algoliaAppId, algoliaAdminKey)

// Sanityクライアントの初期化
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'e4aqw590',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
})

// Algolia検索用のレコード型定義
interface AlgoliaRecord {
  objectID: string
  title: string
  content: string
  type: 'blog' | 'course' | 'instructor' | 'page'
  url: string
  excerpt?: string
  image?: string
  publishedAt?: string
  category?: string
  tags?: string[]
}

/**
 * ブログ記事を取得してAlgolia形式に変換
 */
async function indexBlogPosts(): Promise<AlgoliaRecord[]> {
  console.log('📝 ブログ記事を取得中...')

  const posts = await sanityClient.fetch(`
    *[_type == "blogPost"] {
      _id,
      title,
      slug,
      excerpt,
      content,
      publishedAt,
      category,
      tags,
      mainImage {
        asset-> {
          url
        }
      }
    }
  `)

  return posts.map((post: any) => ({
    objectID: post._id,
    title: post.title,
    content: post.excerpt || '',
    type: 'blog' as const,
    url: `/blog/${post.slug.current}`,
    excerpt: post.excerpt,
    image: post.mainImage?.asset?.url,
    publishedAt: post.publishedAt,
    category: post.category,
    tags: post.tags || []
  }))
}

/**
 * コース情報を取得してAlgolia形式に変換
 */
async function indexCourses(): Promise<AlgoliaRecord[]> {
  console.log('🎓 コース情報を取得中...')

  const courses = await sanityClient.fetch(`
    *[_type == "course" && isActive == true] {
      _id,
      courseId,
      title,
      subtitle,
      description,
      features,
      image {
        asset-> {
          url
        }
      }
    }
  `)

  return courses.map((course: any) => ({
    objectID: course._id,
    title: course.title,
    content: course.description || course.subtitle || '',
    type: 'course' as const,
    url: `/school/${course.courseId}`,
    excerpt: course.subtitle,
    image: course.image?.asset?.url,
    tags: course.features || []
  }))
}

/**
 * インストラクター情報を取得してAlgolia形式に変換
 */
async function indexInstructors(): Promise<AlgoliaRecord[]> {
  console.log('👥 インストラクター情報を取得中...')

  const instructors = await sanityClient.fetch(`
    *[_type == "instructor" && isActive == true] {
      _id,
      name,
      slug,
      title,
      bio,
      region,
      specialties,
      image {
        asset-> {
          url
        }
      }
    }
  `)

  // 都道府県名からスラッグへのマッピング
  const prefectureToSlug: Record<string, string> = {
    '北海道': 'hokkaido',
    '青森県': 'aomori',
    '岩手県': 'iwate',
    '宮城県': 'miyagi',
    '秋田県': 'akita',
    '山形県': 'yamagata',
    '福島県': 'fukushima',
    '茨城県': 'ibaraki',
    '栃木県': 'tochigi',
    '群馬県': 'gunma',
    '埼玉県': 'saitama',
    '千葉県': 'chiba',
    '東京都': 'tokyo',
    '神奈川県': 'kanagawa',
    '新潟県': 'niigata',
    '富山県': 'toyama',
    '石川県': 'ishikawa',
    '福井県': 'fukui',
    '山梨県': 'yamanashi',
    '長野県': 'nagano',
    '岐阜県': 'gifu',
    '静岡県': 'shizuoka',
    '愛知県': 'aichi',
    '三重県': 'mie',
    '滋賀県': 'shiga',
    '京都府': 'kyoto',
    '大阪府': 'osaka',
    '兵庫県': 'hyogo',
    '奈良県': 'nara',
    '和歌山県': 'wakayama',
    '鳥取県': 'tottori',
    '島根県': 'shimane',
    '岡山県': 'okayama',
    '広島県': 'hiroshima',
    '山口県': 'yamaguchi',
    '徳島県': 'tokushima',
    '香川県': 'kagawa',
    '愛媛県': 'ehime',
    '高知県': 'kochi',
    '福岡県': 'fukuoka',
    '佐賀県': 'saga',
    '長崎県': 'nagasaki',
    '熊本県': 'kumamoto',
    '大分県': 'oita',
    '宮崎県': 'miyazaki',
    '鹿児島県': 'kagoshima',
    '沖縄県': 'okinawa'
  }

  return instructors.map((instructor: any) => {
    const prefectureSlug = instructor.region
      ? prefectureToSlug[instructor.region] || 'hokkaido'
      : 'hokkaido'

    return {
      objectID: instructor._id,
      title: instructor.name,
      content: instructor.bio || instructor.title || '',
      type: 'instructor' as const,
      url: `/instructor/${prefectureSlug}/${instructor.slug.current}`,
      excerpt: instructor.title,
      image: instructor.image?.asset?.url,
      tags: instructor.specialties || [],
      category: instructor.region
    }
  })
}

/**
 * ページ情報を取得してAlgolia形式に変換
 */
async function indexPages(): Promise<AlgoliaRecord[]> {
  console.log('📄 ページ情報を取得中...')

  const pages = await sanityClient.fetch(`
    *[_type == "page"] {
      _id,
      title,
      slug,
      excerpt,
      content
    }
  `)

  return pages.map((page: any) => ({
    objectID: page._id,
    title: page.title,
    content: page.excerpt || '',
    type: 'page' as const,
    url: `/${page.slug.current}`,
    excerpt: page.excerpt
  }))
}

/**
 * Algoliaインデックスの設定
 */
async function configureIndex() {
  console.log('⚙️  インデックスの設定中...')

  await algoliaClient.setSettings({
    indexName: algoliaIndexName,
    indexSettings: {
      searchableAttributes: [
        'title',
        'content',
        'excerpt',
        'tags',
        'category'
      ],
      attributesForFaceting: [
        'type',
        'category',
        'tags'
      ],
      customRanking: [
        'desc(publishedAt)'
      ],
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>'
    }
  })

  console.log('✅ インデックス設定完了')
}

/**
 * メイン処理
 */
async function main() {
  console.log('🚀 Algolia同期を開始します...\n')

  try {
    // 各コンテンツタイプのデータを取得
    const [blogPosts, courses, instructors, pages] = await Promise.all([
      indexBlogPosts(),
      indexCourses(),
      indexInstructors(),
      indexPages()
    ])

    // すべてのレコードを結合
    const allRecords = [
      ...blogPosts,
      ...courses,
      ...instructors,
      ...pages
    ]

    console.log(`\n📊 取得したデータ:`)
    console.log(`   - ブログ記事: ${blogPosts.length}件`)
    console.log(`   - コース: ${courses.length}件`)
    console.log(`   - インストラクター: ${instructors.length}件`)
    console.log(`   - ページ: ${pages.length}件`)
    console.log(`   - 合計: ${allRecords.length}件\n`)

    // Algoliaに送信
    console.log('📤 Algoliaにデータを送信中...')
    const response = await algoliaClient.saveObjects({
      indexName: algoliaIndexName,
      objects: allRecords
    })

    console.log('✅ データ送信完了')
    console.log(`   ObjectIDs: ${response.taskID}\n`)

    // インデックス設定
    await configureIndex()

    console.log('🎉 Algolia同期が完了しました!\n')
    console.log(`インデックス名: ${algoliaIndexName}`)
    console.log(`総レコード数: ${allRecords.length}件`)

  } catch (error) {
    console.error('❌ エラーが発生しました:', error)
    process.exit(1)
  }
}

// スクリプト実行
main()
