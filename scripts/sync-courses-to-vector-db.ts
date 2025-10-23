import { config } from 'dotenv'
import { createClient } from '@sanity/client'
import { upsertDocumentEmbedding, getVectorDBStats } from '../lib/db/document-vector-operations'

// .env.localファイルを明示的に読み込み
config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: false,
})

/**
 * courseドキュメントをAI埋め込み用テキストに変換
 */
function courseToEmbeddingContent(course: any): string {
  const parts: string[] = []

  // 基本情報
  if (course.title) parts.push(`講座名: ${course.title}`)
  if (course.subtitle) parts.push(`サブタイトル: ${course.subtitle}`)
  if (course.description) parts.push(`説明: ${course.description}`)

  // AI最適化フィールド
  if (course.aiQuickAnswer) parts.push(`概要: ${course.aiQuickAnswer}`)
  if (course.aiSearchKeywords && course.aiSearchKeywords.length > 0) {
    parts.push(`キーワード: ${course.aiSearchKeywords.join(', ')}`)
  }
  if (course.conversationalQueries && course.conversationalQueries.length > 0) {
    parts.push(`よくある質問: ${course.conversationalQueries.join(', ')}`)
  }

  // 特徴
  if (course.features && course.features.length > 0) {
    parts.push(`特徴: ${course.features.join(', ')}`)
  }

  // 推奨対象
  if (course.recommendations && course.recommendations.length > 0) {
    parts.push(`おすすめ: ${course.recommendations.join(', ')}`)
  }

  // 効果
  if (course.effects && course.effects.length > 0) {
    parts.push(`効果: ${course.effects.join(', ')}`)
  }

  // 料金
  if (course.price?.amount) {
    parts.push(`料金: ${course.price.amount}円`)
  }

  // 時間
  if (course.duration?.hours || course.duration?.sessions) {
    const duration = course.duration.note ||
      `${course.duration.hours || 0}時間、${course.duration.sessions || 0}回`
    parts.push(`所要時間: ${duration}`)
  }

  return parts.join('\n')
}

/**
 * instructorドキュメントをAI埋め込み用テキストに変換
 */
function instructorToEmbeddingContent(instructor: any): string {
  const parts: string[] = []

  // 基本情報
  if (instructor.name) parts.push(`名前: ${instructor.name}`)
  if (instructor.title) parts.push(`肩書き: ${instructor.title}`)
  if (instructor.bio) parts.push(`プロフィール: ${instructor.bio}`)

  // AI最適化フィールド
  if (instructor.aiQuickAnswer) parts.push(`概要: ${instructor.aiQuickAnswer}`)
  if (instructor.aiSearchKeywords && instructor.aiSearchKeywords.length > 0) {
    parts.push(`キーワード: ${instructor.aiSearchKeywords.join(', ')}`)
  }

  // 専門分野
  if (instructor.profile?.specialties && instructor.profile.specialties.length > 0) {
    parts.push(`専門分野: ${instructor.profile.specialties.join(', ')}`)
  }

  // 資格
  if (instructor.profile?.qualifications && instructor.profile.qualifications.length > 0) {
    parts.push(`資格: ${instructor.profile.qualifications.join(', ')}`)
  }

  // 所在地
  if (instructor.prefecture) {
    parts.push(`所在地: ${instructor.prefecture}`)
  }

  return parts.join('\n')
}

async function syncCoursesToVectorDB() {
  console.log('🚀 Syncing courses to Vector DB...\n')

  try {
    // 1. courseドキュメントを取得
    console.log('📚 Fetching courses from Sanity...')
    const courses = await client.fetch(`
      *[_type == "course" && isActive == true && useForAI == true] {
        _id,
        courseId,
        title,
        subtitle,
        description,
        features,
        recommendations,
        effects,
        price,
        duration,
        aiSearchKeywords,
        aiQuickAnswer,
        conversationalQueries,
        topicClusters
      }
    `)

    console.log(`✅ Found ${courses.length} active courses\n`)

    // 2. 各courseをベクトルDBに同期
    for (const course of courses) {
      const content = courseToEmbeddingContent(course)
      const url = `/school/${course.courseId}`

      await upsertDocumentEmbedding(
        course._id,
        'course',
        course.title,
        content,
        url,
        {
          courseId: course.courseId,
          aiSearchKeywords: course.aiSearchKeywords || [],
          topicClusters: course.topicClusters || [],
        }
      )

      console.log(`  ✅ ${course.title}`)
    }

    console.log(`\n✅ Successfully synced ${courses.length} courses\n`)

    // 3. 統計情報表示
    const stats = await getVectorDBStats('course')
    console.log('📊 Course Vector DB Stats:')
    console.log(`  Total courses: ${stats.total_count}`)
    console.log(`  Last updated: ${stats.last_updated}\n`)

  } catch (error) {
    console.error('\n❌ Sync failed:', error)
    throw error
  }
}

async function syncInstructorsToVectorDB() {
  console.log('🚀 Syncing instructors to Vector DB...\n')

  try {
    // 1. instructorドキュメントを取得
    console.log('👥 Fetching instructors from Sanity...')
    const instructors = await client.fetch(`
      *[_type == "instructor" && isActive == true && useForAI == true] {
        _id,
        slug,
        name,
        title,
        bio,
        prefecture,
        profile,
        aiSearchKeywords,
        aiQuickAnswer,
        conversationalQueries
      }
    `)

    console.log(`✅ Found ${instructors.length} active instructors\n`)

    // 2. 各instructorをベクトルDBに同期
    for (const instructor of instructors) {
      const content = instructorToEmbeddingContent(instructor)
      const url = `/instructor/${instructor.prefecture || 'unknown'}/${instructor.slug?.current}`

      await upsertDocumentEmbedding(
        instructor._id,
        'instructor',
        instructor.name,
        content,
        url,
        {
          prefecture: instructor.prefecture,
          aiSearchKeywords: instructor.aiSearchKeywords || [],
        }
      )

      console.log(`  ✅ ${instructor.name}`)
    }

    console.log(`\n✅ Successfully synced ${instructors.length} instructors\n`)

    // 3. 統計情報表示
    const stats = await getVectorDBStats('instructor')
    console.log('📊 Instructor Vector DB Stats:')
    console.log(`  Total instructors: ${stats.total_count}`)
    console.log(`  Last updated: ${stats.last_updated}\n`)

  } catch (error) {
    console.error('\n❌ Sync failed:', error)
    throw error
  }
}

async function syncAll() {
  console.log('='.repeat(60))
  console.log('🎯 Syncing Sanity Content to Vector DB (DeepSeek)')
  console.log('='.repeat(60))
  console.log('')

  try {
    await syncCoursesToVectorDB()
    await syncInstructorsToVectorDB()

    // 全体統計
    const totalStats = await getVectorDBStats()
    console.log('📊 Total Vector DB Stats:')
    console.log(`  Total documents: ${totalStats.total_count}`)
    console.log(`  Document types: ${totalStats.type_count}`)
    console.log(`  Last updated: ${totalStats.last_updated}`)

    console.log('\n🎉 All content synced successfully!\n')
    console.log('💡 Next steps:')
    console.log('  1. Test vector search: npx tsx scripts/test-vector-search.ts')
    console.log('  2. Test AI chatbot with updated vector DB')
    console.log('  3. Verify all 6 courses are searchable\n')

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Sync failed:', error)
    process.exit(1)
  }
}

syncAll()
