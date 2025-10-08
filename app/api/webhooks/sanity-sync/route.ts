import { revalidateTag, revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'
import { createClient } from '@sanity/client'
import { upsertDocumentEmbedding, deleteDocumentEmbedding } from '@/lib/db/document-vector-operations'

// Webhookシークレットの検証
const secret = process.env.SANITY_REVALIDATE_SECRET || process.env.SANITY_WEBHOOK_SECRET

// Sanityクライアント
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Webhookで最新データを取得するためtokenが必要
})

/**
 * 講座コンテンツをembedding用テキストに変換
 */
function courseToEmbeddingContent(course: any): string {
  const parts: string[] = []

  if (course.title) parts.push(`講座名: ${course.title}`)
  if (course.aiQuickAnswer) parts.push(`概要: ${course.aiQuickAnswer}`)
  if (course.aiSearchKeywords && course.aiSearchKeywords.length > 0) {
    parts.push(`キーワード: ${course.aiSearchKeywords.join(', ')}`)
  }
  if (course.description) parts.push(`説明: ${course.description}`)
  if (course.overview) parts.push(`詳細: ${course.overview}`)
  if (course.conversationalQueries && course.conversationalQueries.length > 0) {
    parts.push(`よくある質問: ${course.conversationalQueries.join(', ')}`)
  }

  return parts.join('\n')
}

/**
 * インストラクターコンテンツをembedding用テキストに変換
 */
function instructorToEmbeddingContent(instructor: any): string {
  const parts: string[] = []

  if (instructor.name) parts.push(`名前: ${instructor.name}`)
  if (instructor.title) parts.push(`肩書き: ${instructor.title}`)
  if (instructor.prefecture) parts.push(`所在地: ${instructor.prefecture}`)
  if (instructor.aiQuickAnswer) parts.push(`概要: ${instructor.aiQuickAnswer}`)
  if (instructor.aiSearchKeywords && instructor.aiSearchKeywords.length > 0) {
    parts.push(`キーワード: ${instructor.aiSearchKeywords.join(', ')}`)
  }
  if (instructor.bio) parts.push(`経歴: ${instructor.bio}`)
  if (instructor.profile) parts.push(`プロフィール: ${instructor.profile}`)
  if (instructor.conversationalQueries && instructor.conversationalQueries.length > 0) {
    parts.push(`よくある質問: ${instructor.conversationalQueries.join(', ')}`)
  }

  return parts.join('\n')
}

export async function POST(request: NextRequest) {
  try {
    // Webhookシークレットの検証（parseBodyが自動で署名を検証）
    const body = await parseBody(request, secret)

    if (!body) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const { _type, _id, slug } = body as any

    console.log(`[Webhook] Received: ${_type} - ${_id}`)

    // タイプに応じて処理
    switch (_type) {
      case 'course': {
        // 講座の詳細情報を取得
        const course = await client.fetch(`
          *[_type == "course" && _id == $id][0] {
            _id,
            slug,
            title,
            description,
            overview,
            isActive,
            aiSearchKeywords,
            aiQuickAnswer,
            conversationalQueries,
            topicClusters
          }
        `, { id: _id })

        if (!course) {
          console.warn(`[Webhook] Course not found: ${_id}`)
          break
        }

        if (course.isActive === false) {
          // 非アクティブな講座は削除
          await deleteDocumentEmbedding(_id)
          console.log(`[Webhook] Deleted inactive course: ${_id}`)
        } else {
          // ベクトルDBに同期
          const content = courseToEmbeddingContent(course)
          const url = `/school/${course.slug?.current || _id}`

          await upsertDocumentEmbedding(
            _id,
            'course',
            course.title,
            content,
            url,
            {
              aiSearchKeywords: course.aiSearchKeywords || [],
              topicClusters: course.topicClusters || [],
            }
          )

          console.log(`[Webhook] Synced course to vector DB: ${course.title}`)
        }

        // Revalidation
        if (slug?.current) {
          revalidatePath(`/school/${slug.current}`)
          revalidatePath('/school')
          revalidatePath('/')
        }
        revalidateTag('course')

        break
      }

      case 'instructor': {
        // インストラクターの詳細情報を取得
        const instructor = await client.fetch(`
          *[_type == "instructor" && _id == $id][0] {
            _id,
            slug,
            name,
            title,
            bio,
            prefecture,
            profile,
            isActive,
            aiSearchKeywords,
            aiQuickAnswer,
            conversationalQueries
          }
        `, { id: _id })

        if (!instructor) {
          console.warn(`[Webhook] Instructor not found: ${_id}`)
          break
        }

        if (instructor.isActive === false) {
          // 非アクティブなインストラクターは削除
          await deleteDocumentEmbedding(_id)
          console.log(`[Webhook] Deleted inactive instructor: ${_id}`)
        } else {
          // ベクトルDBに同期
          const content = instructorToEmbeddingContent(instructor)
          const url = `/instructor/${instructor.prefecture || 'unknown'}/${instructor.slug?.current || _id}`

          await upsertDocumentEmbedding(
            _id,
            'instructor',
            instructor.name,
            content,
            url,
            {
              prefecture: instructor.prefecture,
              aiSearchKeywords: instructor.aiSearchKeywords || [],
            }
          )

          console.log(`[Webhook] Synced instructor to vector DB: ${instructor.name}`)
        }

        // Revalidation
        if (slug?.current && instructor.prefecture) {
          revalidatePath(`/instructor/${instructor.prefecture}/${slug.current}`)
          revalidatePath('/instructor')
          revalidatePath('/')
        }
        revalidateTag('instructor')

        break
      }

      default:
        console.log(`[Webhook] Unsupported type: ${_type}`)
        break
    }

    return NextResponse.json({
      success: true,
      type: _type,
      id: _id,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('[Webhook] Sync error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Webhookのテスト用エンドポイント（開発環境のみ）
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 404 }
    )
  }

  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type') || 'course'
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { error: 'ID is required' },
      { status: 400 }
    )
  }

  try {
    // テスト用の同期実行
    if (type === 'course') {
      const course = await client.fetch(`
        *[_type == "course" && _id == $id][0] {
          _id, slug, title, description, overview, isActive,
          aiSearchKeywords, aiQuickAnswer, conversationalQueries, topicClusters
        }
      `, { id })

      if (!course) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 })
      }

      const content = courseToEmbeddingContent(course)
      const url = `/school/${course.slug?.current || id}`

      await upsertDocumentEmbedding(
        id,
        'course',
        course.title,
        content,
        url,
        {
          aiSearchKeywords: course.aiSearchKeywords || [],
          topicClusters: course.topicClusters || [],
        }
      )

      return NextResponse.json({
        success: true,
        type: 'course',
        title: course.title,
        timestamp: new Date().toISOString(),
        message: 'Test sync successful'
      })
    }

    if (type === 'instructor') {
      const instructor = await client.fetch(`
        *[_type == "instructor" && _id == $id][0] {
          _id, slug, name, title, bio, prefecture, profile, isActive,
          aiSearchKeywords, aiQuickAnswer, conversationalQueries
        }
      `, { id })

      if (!instructor) {
        return NextResponse.json({ error: 'Instructor not found' }, { status: 404 })
      }

      const content = instructorToEmbeddingContent(instructor)
      const url = `/instructor/${instructor.prefecture || 'unknown'}/${instructor.slug?.current || id}`

      await upsertDocumentEmbedding(
        id,
        'instructor',
        instructor.name,
        content,
        url,
        {
          prefecture: instructor.prefecture,
          aiSearchKeywords: instructor.aiSearchKeywords || [],
        }
      )

      return NextResponse.json({
        success: true,
        type: 'instructor',
        name: instructor.name,
        timestamp: new Date().toISOString(),
        message: 'Test sync successful'
      })
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })

  } catch (error) {
    console.error('[Webhook Test] Error:', error)
    return NextResponse.json(
      { error: 'Sync failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
