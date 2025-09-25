import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const secret = searchParams.get('secret')

  // In production, you would want to add a secret check here
  // if (secret !== process.env.SANITY_PREVIEW_SECRET) {
  //   return new Response('Invalid token', { status: 401 })
  // }

  const draft = await draftMode()
  draft.enable()

  // Redirect to the path from the fetched post
  redirect(slug || '/')
}

export async function POST() {
  const draft = await draftMode()
  draft.enable()

  return NextResponse.json({ status: 'Draft mode enabled' })
}