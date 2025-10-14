import { NextRequest, NextResponse } from 'next/server'
import { publicClient } from '@/lib/sanity.client'
import { EVENTS_BY_DATE_RANGE_QUERY, EVENTS_QUERY, AVAILABLE_EVENTS_QUERY } from '@/lib/queries'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // クエリパラメータの取得
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const availableOnly = searchParams.get('availableOnly') === 'true'

    let events

    if (availableOnly) {
      // AI用：空きがあるイベントのみ取得
      events = await publicClient.fetch(
        AVAILABLE_EVENTS_QUERY,
        {},
        {
          cache: 'no-store'
        } as any
      )
    } else if (startDate && endDate) {
      // 期間指定でイベント取得
      events = await publicClient.fetch(
        EVENTS_BY_DATE_RANGE_QUERY,
        {
          startDate: startDate,
          endDate: endDate
        },
        {
          cache: 'no-store'
        } as any
      )
    } else {
      // すべての今後のイベントを取得
      events = await publicClient.fetch(
        EVENTS_QUERY,
        {},
        {
          cache: 'no-store'
        } as any
      )
    }

    return NextResponse.json({
      success: true,
      events: events || [],
      count: events?.length || 0
    })

  } catch (error) {
    console.error('Failed to fetch events:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'イベントの取得に失敗しました',
        events: [],
        count: 0
      },
      { status: 500 }
    )
  }
}

// OPTIONS メソッドのサポート（CORS対応）
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    }
  )
}
