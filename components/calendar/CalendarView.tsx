'use client'

import { useState, useEffect } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Event } from '@/lib/types/event'
import EventCard from './EventCard'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { ja } from 'date-fns/locale'

export default function CalendarView() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 月が変更されたときにイベントを取得
  useEffect(() => {
    fetchEvents(currentMonth)
  }, [currentMonth])

  const fetchEvents = async (month: Date) => {
    setLoading(true)
    setError(null)

    try {
      const startDate = startOfMonth(month).toISOString()
      const endDate = endOfMonth(month).toISOString()

      const response = await fetch(
        `/api/events?startDate=${startDate}&endDate=${endDate}`
      )

      if (!response.ok) {
        throw new Error('イベントの取得に失敗しました')
      }

      const data = await response.json()
      setEvents(data.events || [])
    } catch (err) {
      console.error('Failed to fetch events:', err)
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  // 選択された日のイベントをフィルタリング
  const selectedDayEvents = selectedDate
    ? events.filter((event) => {
        const eventStart = new Date(event.startDate)
        const eventEnd = new Date(event.endDate)
        const selected = new Date(selectedDate)

        // 日付のみで比較（時間を無視）
        selected.setHours(0, 0, 0, 0)
        eventStart.setHours(0, 0, 0, 0)
        eventEnd.setHours(0, 0, 0, 0)

        return selected >= eventStart && selected <= eventEnd
      })
    : []

  // イベントがある日付を取得
  const eventDates = events.map((event) => {
    const start = new Date(event.startDate)
    start.setHours(0, 0, 0, 0)
    return start.getTime()
  })

  // カスタムモディファイア：イベントがある日
  const modifiers = {
    hasEvent: (date: Date) => {
      const checkDate = new Date(date)
      checkDate.setHours(0, 0, 0, 0)
      return eventDates.includes(checkDate.getTime())
    }
  }

  const modifiersStyles = {
    hasEvent: {
      fontWeight: 'bold',
      textDecoration: 'underline',
    }
  }

  return (
    <div className="space-y-8">
      {/* カレンダー表示エリア */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          {format(currentMonth, 'yyyy年 M月', { locale: ja })}
        </h2>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="mt-2 text-gray-600">読み込み中...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {!loading && (
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              locale={ja}
              className="rounded-md border"
            />
          </div>
        )}

        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span>今日</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-gray-400"></div>
              <span className="font-bold underline">イベント有</span>
            </div>
          </div>
        </div>
      </div>

      {/* イベント一覧表示エリア */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          {selectedDate ? (
            <>
              {format(selectedDate, 'M月d日 (E)', { locale: ja })}のイベント
            </>
          ) : (
            <>
              {format(currentMonth, 'M月', { locale: ja })}の全イベント
            </>
          )}
        </h2>

        {selectedDate && selectedDayEvents.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-4 text-gray-600">この日のイベントはありません</p>
            <button
              onClick={() => setSelectedDate(undefined)}
              className="mt-4 text-blue-600 hover:text-blue-800 underline"
            >
              全イベントを表示
            </button>
          </div>
        ) : (
          <>
            {selectedDate && selectedDayEvents.length > 0 && (
              <button
                onClick={() => setSelectedDate(undefined)}
                className="mb-4 text-sm text-blue-600 hover:text-blue-800 underline"
              >
                ← 全イベントを表示
              </button>
            )}
            <div className="grid md:grid-cols-2 gap-6">
              {(selectedDate ? selectedDayEvents : events).map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  isHighlighted={selectedDate ? true : false}
                />
              ))}
            </div>
            {!selectedDate && events.length === 0 && (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="mt-4 text-gray-600">この月のイベントはありません</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
