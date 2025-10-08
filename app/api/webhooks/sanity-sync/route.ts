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

/**
 * Portable TextをプレーンテキストOに変換
 */
function portableTextToPlainText(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return ''

  return blocks
    .map(block => {
      if (block._type === 'block' && block.children) {
        return block.children
          .map((child: any) => child.text || '')
          .join('')
      }
      return ''
    })
    .filter(Boolean)
    .join('\n')
}

/**
 * ブログ記事をembedding用テキストに変換
 */
function blogPostToEmbeddingContent(post: any): string {
  const parts: string[] = []

  if (post.title) parts.push(`タイトル: ${post.title}`)
  if (post.category) parts.push(`カテゴリ: ${post.category}`)
  if (post.excerpt) parts.push(`抜粋: ${post.excerpt}`)
  if (post.tldr) parts.push(`要約: ${post.tldr}`)
  if (post.tags && post.tags.length > 0) {
    parts.push(`タグ: ${post.tags.join(', ')}`)
  }
  if (post.content) {
    const contentText = portableTextToPlainText(post.content)
    if (contentText) parts.push(`本文: ${contentText}`)
  }
  if (post.keyPoint && post.keyPoint.content) {
    parts.push(`重要ポイント: ${post.keyPoint.content}`)
  }
  if (post.summary) parts.push(`まとめ: ${post.summary}`)
  if (post.faq && Array.isArray(post.faq)) {
    const faqText = post.faq
      .map((item: any) => `Q: ${item.question}\nA: ${item.answer}`)
      .join('\n')
    if (faqText) parts.push(`FAQ:\n${faqText}`)
  }

  return parts.join('\n')
}

/**
 * ページをembedding用テキストに変換
 */
function pageToEmbeddingContent(page: any): string {
  const parts: string[] = []

  if (page.title) parts.push(`ページタイトル: ${page.title}`)

  // pageBuilderの各セクションからテキスト抽出
  if (page.pageBuilder && Array.isArray(page.pageBuilder)) {
    page.pageBuilder.forEach((section: any) => {
      if (section.heading) parts.push(section.heading)
      if (section.text) parts.push(section.text)
      if (section.description) parts.push(section.description)
      if (section.content) {
        const contentText = portableTextToPlainText(section.content)
        if (contentText) parts.push(contentText)
      }
    })
  }

  return parts.join('\n')
}

/**
 * イベントをembedding用テキストに変換
 */
function eventToEmbeddingContent(event: any): string {
  const parts: string[] = []

  if (event.title) parts.push(`イベント名: ${event.title}`)
  if (event.location) parts.push(`開催場所: ${event.location}`)
  if (event.startDate) {
    const startDate = new Date(event.startDate).toLocaleDateString('ja-JP')
    parts.push(`開始日: ${startDate}`)
  }
  if (event.endDate) {
    const endDate = new Date(event.endDate).toLocaleDateString('ja-JP')
    parts.push(`終了日: ${endDate}`)
  }
  if (event.description) {
    const descText = portableTextToPlainText(event.description)
    if (descText) parts.push(`説明: ${descText}`)
  }

  return parts.join('\n')
}

/**
 * お知らせをembedding用テキストに変換
 */
function newsToEmbeddingContent(news: any): string {
  const parts: string[] = []

  if (news.title) parts.push(`タイトル: ${news.title}`)
  if (news.category) parts.push(`カテゴリ: ${news.category}`)
  if (news.publishedAt) {
    const pubDate = new Date(news.publishedAt).toLocaleDateString('ja-JP')
    parts.push(`公開日: ${pubDate}`)
  }
  if (news.content) {
    const contentText = portableTextToPlainText(news.content)
    if (contentText) parts.push(`内容: ${contentText}`)
  }

  return parts.join('\n')
}

/**
 * FAQカードをembedding用テキストに変換
 */
function faqCardToEmbeddingContent(faqCard: any): string {
  const parts: string[] = []

  if (faqCard.title) parts.push(`質問: ${faqCard.title}`)
  // FAQカードは質問のみで回答は含まれていないが、タイトルだけでも検索可能にする

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

    console.log(`[Webhook DEBUG] Raw body:`, JSON.stringify(body, null, 2))

    const { _type, _id, slug } = body as any

    console.log(`[Webhook] Received: ${_type} - ${_id}`)
    console.log(`[Webhook DEBUG] Body keys:`, Object.keys(body))

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

      case 'blogPost': {
        console.log(`[Webhook DEBUG] blogPost case triggered for ID: ${_id}`)

        // ブログ記事の詳細情報を取得
        const post = await client.fetch(`
          *[_type == "blogPost" && _id == $id][0] {
            _id,
            slug,
            title,
            excerpt,
            tldr,
            summary,
            category,
            tags,
            content,
            keyPoint,
            faq,
            publishedAt,
            isActive
          }
        `, { id: _id })

        console.log(`[Webhook DEBUG] Fetched post:`, JSON.stringify(post, null, 2))

        if (!post) {
          console.warn(`[Webhook] Blog post not found: ${_id}`)
          break
        }

        console.log(`[Webhook DEBUG] isActive value:`, post.isActive)

        if (post.isActive === false) {
          await deleteDocumentEmbedding(_id)
          console.log(`[Webhook] Deleted inactive blog post: ${_id}`)
        } else {
          const content = blogPostToEmbeddingContent(post)
          console.log(`[Webhook DEBUG] Generated content length: ${content.length} chars`)

          const url = `/blog/${post.slug?.current || _id}`

          await upsertDocumentEmbedding(
            _id,
            'blogPost',
            post.title,
            content,
            url,
            {
              category: post.category,
              tags: post.tags || [],
              publishedAt: post.publishedAt
            }
          )

          console.log(`[Webhook] Synced blog post to vector DB: ${post.title}`)
        }

        if (slug?.current) {
          revalidatePath(`/blog/${slug.current}`)
          revalidatePath('/blog')
          revalidatePath('/')
        }
        revalidateTag('blogPost')

        break
      }

      case 'page': {
        // ページの詳細情報を取得
        const page = await client.fetch(`
          *[_type == "page" && _id == $id][0] {
            _id,
            slug,
            title,
            pageBuilder
          }
        `, { id: _id })

        if (!page) {
          console.warn(`[Webhook] Page not found: ${_id}`)
          break
        }

        const content = pageToEmbeddingContent(page)
        const url = `/${page.slug?.current || _id}`

        await upsertDocumentEmbedding(
          _id,
          'page',
          page.title,
          content,
          url,
          {}
        )

        console.log(`[Webhook] Synced page to vector DB: ${page.title}`)

        if (slug?.current) {
          revalidatePath(`/${slug.current}`)
          revalidatePath('/')
        }
        revalidateTag('page')

        break
      }

      case 'event': {
        // イベントの詳細情報を取得
        const event = await client.fetch(`
          *[_type == "event" && _id == $id][0] {
            _id,
            slug,
            title,
            description,
            startDate,
            endDate,
            location,
            isActive
          }
        `, { id: _id })

        if (!event) {
          console.warn(`[Webhook] Event not found: ${_id}`)
          break
        }

        if (event.isActive === false) {
          await deleteDocumentEmbedding(_id)
          console.log(`[Webhook] Deleted inactive event: ${_id}`)
        } else {
          const content = eventToEmbeddingContent(event)
          const url = `/event/${event.slug?.current || _id}`

          await upsertDocumentEmbedding(
            _id,
            'event',
            event.title,
            content,
            url,
            {
              startDate: event.startDate,
              endDate: event.endDate,
              location: event.location
            }
          )

          console.log(`[Webhook] Synced event to vector DB: ${event.title}`)
        }

        if (slug?.current) {
          revalidatePath(`/event/${slug.current}`)
          revalidatePath('/event')
          revalidatePath('/')
        }
        revalidateTag('event')

        break
      }

      case 'news': {
        // お知らせの詳細情報を取得
        const news = await client.fetch(`
          *[_type == "news" && _id == $id][0] {
            _id,
            slug,
            title,
            content,
            category,
            publishedAt,
            isActive
          }
        `, { id: _id })

        if (!news) {
          console.warn(`[Webhook] News not found: ${_id}`)
          break
        }

        if (news.isActive === false) {
          await deleteDocumentEmbedding(_id)
          console.log(`[Webhook] Deleted inactive news: ${_id}`)
        } else {
          const content = newsToEmbeddingContent(news)
          const url = `/news/${news.slug?.current || _id}`

          await upsertDocumentEmbedding(
            _id,
            'news',
            news.title,
            content,
            url,
            {
              category: news.category,
              publishedAt: news.publishedAt
            }
          )

          console.log(`[Webhook] Synced news to vector DB: ${news.title}`)
        }

        if (slug?.current) {
          revalidatePath(`/news/${slug.current}`)
          revalidatePath('/news')
          revalidatePath('/')
        }
        revalidateTag('news')

        break
      }

      case 'faqCard': {
        // FAQカードの詳細情報を取得
        const faqCard = await client.fetch(`
          *[_type == "faqCard" && _id == $id][0] {
            _id,
            title,
            isActive
          }
        `, { id: _id })

        if (!faqCard) {
          console.warn(`[Webhook] FAQ card not found: ${_id}`)
          break
        }

        if (faqCard.isActive === false) {
          await deleteDocumentEmbedding(_id)
          console.log(`[Webhook] Deleted inactive FAQ card: ${_id}`)
        } else {
          const content = faqCardToEmbeddingContent(faqCard)
          const url = '/' // FAQカードは特定のURLを持たない

          await upsertDocumentEmbedding(
            _id,
            'faqCard',
            faqCard.title,
            content,
            url,
            {}
          )

          console.log(`[Webhook] Synced FAQ card to vector DB: ${faqCard.title}`)
        }

        revalidatePath('/')
        revalidateTag('faqCard')

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
