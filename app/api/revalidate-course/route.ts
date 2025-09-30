import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Sanity Webhook用のRevalidation APIエンドポイント
 * Sanityでコース（course）がパブリッシュされた時に自動的に呼び出される
 */
export async function POST(request: NextRequest) {
  try {
    // セキュリティ: 環境変数で設定したトークンをチェック
    const authHeader = request.headers.get('authorization')
    const token = process.env.SANITY_REVALIDATE_SECRET

    if (!token) {
      console.error('SANITY_REVALIDATE_SECRET is not configured')
      return NextResponse.json(
        { error: 'Revalidation secret not configured' },
        { status: 500 }
      )
    }

    if (authHeader !== `Bearer ${token}`) {
      console.error('Invalid revalidation token')
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // リクエストボディを取得
    const body = await request.json()
    console.log('Revalidation request received:', {
      type: body._type,
      id: body._id,
      action: body._action || 'unknown'
    })

    // 講座一覧ページのキャッシュをクリア
    await revalidatePath('/school')
    console.log('✅ Revalidated: /school')

    // 個別講座ページのキャッシュもクリア（courseIdがある場合）
    if (body.courseId) {
      await revalidatePath(`/school/${body.courseId}`)
      console.log(`✅ Revalidated: /school/${body.courseId}`)
    }

    return NextResponse.json({
      revalidated: true,
      paths: ['/school', body.courseId ? `/school/${body.courseId}` : null].filter(Boolean),
      now: Date.now()
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { error: 'Error revalidating', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GETリクエストでのヘルスチェック
export async function GET() {
  return NextResponse.json({
    message: 'Revalidation endpoint is active',
    timestamp: new Date().toISOString()
  })
}