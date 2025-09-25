import { NextRequest, NextResponse } from 'next/server'

// クリックイベントを記録するAPI
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fromPostId, toPostId, timestamp } = body

    // ここで実際の分析サービス（Google Analytics、Mixpanel等）にイベントを送信
    // 現在はコンソールログのみ（実装例として）
    console.log('[Analytics] Related post click:', {
      fromPostId,
      toPostId,
      timestamp: timestamp || new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer'),
    })

    // 将来的にはデータベースに記録
    // await saveClickEvent({ fromPostId, toPostId, timestamp })

    return NextResponse.json({
      success: true,
      message: 'Click event tracked successfully'
    })
  } catch (error) {
    console.error('Failed to track click:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to track click event' },
      { status: 500 }
    )
  }
}

// クリック率統計を取得するAPI
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const postId = searchParams.get('postId')

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      )
    }

    // 仮のデータ（実装例）
    const stats = {
      postId,
      relatedPostClicks: {
        total: 150,
        byPost: [
          { postId: 'post-1', clicks: 45, clickRate: 0.30 },
          { postId: 'post-2', clicks: 38, clickRate: 0.25 },
          { postId: 'post-3', clicks: 32, clickRate: 0.21 },
          { postId: 'post-4', clicks: 20, clickRate: 0.13 },
          { postId: 'post-5', clicks: 15, clickRate: 0.10 },
        ]
      },
      period: '30days',
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Failed to fetch click stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}