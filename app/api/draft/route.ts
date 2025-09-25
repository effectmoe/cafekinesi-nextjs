import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const secret = searchParams.get('secret')
  const preview = searchParams.get('preview')
  const redirectPath = searchParams.get('redirect')

  // Sanity Presentation用のパラメータ
  const sanitySecret = searchParams.get('sanity-preview-secret')
  const sanityPerspective = searchParams.get('sanity-preview-perspective')
  const sanityPathname = searchParams.get('sanity-preview-pathname')

  // プレビューリクエストの検証
  // Presentation機能からのリクエスト、または通常のプレビューリクエストを許可
  const isValidPreview = preview === 'true' || secret || sanitySecret

  if (!isValidPreview) {
    return new Response('Invalid preview request', { status: 401 })
  }

  const draft = await draftMode()
  draft.enable()

  // リダイレクト先の決定
  // Presentation機能からの場合はsanityPathnameを使用
  const path = redirectPath || sanityPathname || slug || '/'
  redirect(path)
}

export async function POST() {
  const draft = await draftMode()
  draft.enable()

  return NextResponse.json({ status: 'Draft mode enabled' })
}