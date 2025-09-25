import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const secret = searchParams.get('secret')
  const preview = searchParams.get('preview')
  const redirectPath = searchParams.get('redirect')

  // プレビューリクエストの簡単な検証
  if (preview !== 'true' && !secret) {
    return new Response('Invalid preview request', { status: 401 })
  }

  const draft = await draftMode()
  draft.enable()

  // redirectパラメータがある場合はそれを使用、なければslugを使用
  const path = redirectPath || slug || '/'
  redirect(path)
}

export async function POST() {
  const draft = await draftMode()
  draft.enable()

  return NextResponse.json({ status: 'Draft mode enabled' })
}