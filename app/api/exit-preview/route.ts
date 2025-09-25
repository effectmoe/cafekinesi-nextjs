import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const draft = await draftMode()
    draft.disable()

    return NextResponse.json({
      message: 'Preview mode disabled',
      success: true
    })
  } catch (error) {
    console.error('Failed to disable preview mode:', error)
    return NextResponse.json({
      message: 'Failed to disable preview mode',
      success: false
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const draft = await draftMode()
    draft.disable()

    // ホームページにリダイレクト
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'))
  } catch (error) {
    console.error('Failed to disable preview mode:', error)
    return NextResponse.json({
      message: 'Failed to disable preview mode',
      success: false
    }, { status: 500 })
  }
}