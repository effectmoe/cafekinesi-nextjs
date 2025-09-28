import { revalidateTag, revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

// Webhookシークレットの検証
const secret = process.env.SANITY_REVALIDATE_SECRET || process.env.SANITY_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  try {
    // Webhookシークレットの検証
    const signature = request.headers.get('sanity-webhook-signature')
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      )
    }

    const body = await parseBody(request, secret)

    if (!body) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const { _type, slug, _id } = body as any

    // タイプに応じて適切な再検証を実行
    switch (_type) {
      case 'blogPost':
        if (slug?.current) {
          // 個別記事ページの再検証
          revalidatePath(`/blog/${slug.current}`)
          // ブログ一覧ページの再検証
          revalidatePath('/blog')
          // ホームページも再検証（最新記事が表示される場合）
          revalidatePath('/')
        }
        // タグベースの再検証
        revalidateTag('blogPost')
        break

      case 'page':
        if (slug?.current) {
          revalidatePath(`/${slug.current}`)
        }
        revalidateTag('page')
        break

      case 'homepage':
        revalidatePath('/')
        revalidateTag('homepage')
        break

      case 'post':
        if (slug?.current) {
          // 個別記事ページの再検証
          revalidatePath(`/blog/${slug.current}`)
          // ブログ一覧ページの再検証
          revalidatePath('/blog')
          // ホームページも再検証（最新記事が表示される場合）
          revalidatePath('/')
        }
        // タグベースの再検証
        revalidateTag('post')
        break

      case 'album':
        if (slug?.current) {
          revalidatePath(`/albums/${slug.current}`)
          revalidatePath('/albums')
        }
        revalidateTag('album')
        break

      case 'author':
        // 著者が更新された場合、全ブログ記事を再検証
        revalidateTag('blogPost')
        revalidatePath('/blog')
        break

      case 'category':
        // カテゴリが更新された場合、関連する全ページを再検証
        revalidateTag('blogPost')
        revalidateTag('category')
        break

      default:
        // その他のコンテンツタイプの場合、全体を再検証
        revalidatePath('/', 'layout')
        break
    }

    // 成功ログ
    console.log(`[Webhook] Revalidated ${_type}: ${slug?.current || _id}`)

    return NextResponse.json({
      revalidated: true,
      type: _type,
      slug: slug?.current,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('[Webhook] Revalidation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
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
  const type = searchParams.get('type') || 'blogPost'
  const slug = searchParams.get('slug')

  if (!slug) {
    return NextResponse.json(
      { error: 'Slug is required' },
      { status: 400 }
    )
  }

  try {
    // テスト用の再検証実行
    revalidatePath(`/blog/${slug}`)
    revalidateTag(type)

    return NextResponse.json({
      revalidated: true,
      type,
      slug,
      timestamp: new Date().toISOString(),
      message: 'Test revalidation successful'
    })
  } catch (error) {
    console.error('[Webhook Test] Error:', error)
    return NextResponse.json(
      { error: 'Revalidation failed' },
      { status: 500 }
    )
  }
}