import { draftMode } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const secret = searchParams.get('secret')
  const preview = searchParams.get('preview')
  const redirectPath = searchParams.get('redirect')
  const documentType = searchParams.get('type')
  const documentId = searchParams.get('id')
  const isDraft = searchParams.get('isDraft')

  // Sanity Presentation用のパラメータ
  const sanitySecret = searchParams.get('sanity-preview-secret')
  const sanityPerspective = searchParams.get('sanity-preview-perspective')
  const sanityPathname = searchParams.get('sanity-preview-pathname')

  console.log('[Draft API] Request params:', {
    slug,
    secret,
    preview,
    redirectPath,
    documentType,
    documentId,
    isDraft,
    sanitySecret: !!sanitySecret,
    sanityPerspective,
    sanityPathname
  })

  // プレビューリクエストの検証
  // Presentation機能からのリクエスト、または通常のプレビューリクエストを許可
  const isValidPreview = preview === 'true' || secret || sanitySecret

  if (!isValidPreview) {
    console.error('[Draft API] Invalid preview request')
    return new Response('Invalid preview request', { status: 401 })
  }

  try {
    const draft = await draftMode()
    draft.enable()
    console.log('[Draft API] Draft mode enabled')

    // リダイレクト先の決定
    // Presentation機能からの場合はsanityPathnameを使用
    const path = redirectPath || sanityPathname || slug || '/'
    console.log('[Draft API] Redirecting to:', path)

    // リダイレクトレスポンスを作成
    const response = NextResponse.redirect(new URL(path, request.url), 307)

    // draft modeが有効になったことを確認するためのヘッダーを追加
    response.headers.set('x-draft-mode', 'enabled')

    return response
  } catch (error) {
    console.error('[Draft API] Error:', error)
    // エラーが発生した場合、手動でリダイレクトレスポンスを返す
    const path = redirectPath || sanityPathname || slug || '/'
    const response = NextResponse.redirect(new URL(path, request.url), 307)
    response.headers.set('x-draft-mode', 'error')
    return response
  }
}

export async function POST() {
  const draft = await draftMode()
  draft.enable()

  return NextResponse.json({ status: 'Draft mode enabled' })
}