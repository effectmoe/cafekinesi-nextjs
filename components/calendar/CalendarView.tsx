'use client'

import { useState, useEffect } from 'react'
import { Event } from '@/lib/types/event'
import EventCard from './EventCard'
import { format, startOfMonth, endOfMonth, getDaysInMonth, getDay, startOfDay, addMonths, subMonths } from 'date-fns'
import { ja } from 'date-fns/locale'
import Holidays from 'date-holidays'

export default function CalendarView() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const holidays = new Holidays('JP')

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

  // イベントがある日付のセットを作成
  const eventDateMap = new Map<number, Event[]>()
  events.forEach((event) => {
    const date = startOfDay(new Date(event.startDate))
    const dateTime = date.getTime()
    if (!eventDateMap.has(dateTime)) {
      eventDateMap.set(dateTime, [])
    }
    eventDateMap.get(dateTime)?.push(event)
  })

  // 日付がイベントを持っているかチェック
  const getEventsForDay = (day: number): Event[] => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const dateTime = startOfDay(date).getTime()
    return eventDateMap.get(dateTime) || []
  }

  // 祝日かどうかをチェック
  const isHoliday = (day: number): boolean => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return holidays.isHoliday(date) !== false
  }

  // 曜日を取得（0: 日曜日, 6: 土曜日）
  const getDayOfWeek = (day: number): number => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return date.getDay()
  }

  // 前月へ移動
  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
    setSelectedDate(undefined)
  }

  // 次月へ移動
  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
    setSelectedDate(undefined)
  }

  // 日付クリック時のハンドラー
  const handleDayClick = (day: number) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    setSelectedDate(clickedDate)
  }

  // カレンダーの日付配列を生成
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDayOfMonth = getDay(new Date(year, month, 1))

    const days: (number | null)[] = []

    // 月の最初の日までの空白を追加
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null)
    }

    // 月の日付を追加
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const calendarDays = generateCalendarDays()

  return (
    <div className="space-y-8">
      {/* カレンダー表示エリア */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* 年月表示と切り替えボタン */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={goToPreviousMonth}
            className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="前月"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-3xl font-bold text-gray-900">
            {format(currentMonth, 'yyyy年 M月', { locale: ja })}
          </h2>
          <button
            onClick={goToNextMonth}
            className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="次月"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {loading && (
          <div className="text-center py-16">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="mt-4 text-gray-600 text-lg">読み込み中...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {!loading && (
          <>
            {/* 曜日ヘッダー */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              <div className="text-center font-bold text-lg py-3 text-red-600">日</div>
              <div className="text-center font-bold text-lg py-3">月</div>
              <div className="text-center font-bold text-lg py-3">火</div>
              <div className="text-center font-bold text-lg py-3">水</div>
              <div className="text-center font-bold text-lg py-3">木</div>
              <div className="text-center font-bold text-lg py-3">金</div>
              <div className="text-center font-bold text-lg py-3 text-blue-600">土</div>
            </div>

            {/* 日付グリッド */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, index) => {
                const dayOfWeek = day ? getDayOfWeek(day) : -1
                const isSunday = dayOfWeek === 0
                const isSaturday = dayOfWeek === 6
                const isHolidayDay = day ? isHoliday(day) : false
                const dayEvents = day ? getEventsForDay(day) : []
                const hasEvents = dayEvents.length > 0

                return (
                  <div
                    key={index}
                    onClick={() => day && handleDayClick(day)}
                    className={`
                      min-h-[120px] border rounded-lg p-3 transition-all
                      ${day ? 'hover:bg-gray-50 cursor-pointer hover:shadow-md' : 'bg-gray-50'}
                      ${isSunday || isHolidayDay ? 'bg-red-50' : ''}
                      ${isSaturday && !isHolidayDay ? 'bg-blue-50' : ''}
                      ${selectedDate && day === selectedDate.getDate() && currentMonth.getMonth() === selectedDate.getMonth() ? 'ring-2 ring-blue-500 bg-blue-100' : ''}
                    `}
                  >
                    {day && (
                      <>
                        <div className={`
                          text-lg font-semibold mb-2
                          ${isSunday || isHolidayDay ? 'text-red-600' : ''}
                          ${isSaturday && !isHolidayDay ? 'text-blue-600' : ''}
                        `}>
                          {day}
                        </div>
                        {hasEvents && (
                          <div className="space-y-1">
                            {dayEvents.slice(0, 3).map((event) => (
                              <div
                                key={event._id}
                                className={`
                                  text-xs px-2 py-1 rounded text-white truncate font-medium
                                  ${event.status === 'open' ? 'bg-green-500' : ''}
                                  ${event.status === 'full' ? 'bg-red-500' : ''}
                                  ${event.status === 'closed' ? 'bg-gray-500' : ''}
                                `}
                                title={event.title}
                              >
                                {event.title}
                              </div>
                            ))}
                            {dayEvents.length > 3 && (
                              <div className="text-xs text-gray-600 px-2">
                                +{dayEvents.length - 3}件
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )
              })}
            </div>

            {/* 凡例 */}
            <div className="mt-8 pt-6 border-t flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
                <span>日曜・祝日</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded"></div>
                <span>土曜日</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>受付中</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>満席</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-500 rounded"></div>
                <span>終了</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* イベント一覧表示エリア */}
      <div className="bg-white rounded-lg shadow-lg p-8">
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
              className="mt-4 text-blue-600 hover:text-blue-800 underline font-semibold"
            >
              全イベントを表示
            </button>
          </div>
        ) : (
          <>
            {selectedDate && selectedDayEvents.length > 0 && (
              <button
                onClick={() => setSelectedDate(undefined)}
                className="mb-4 text-sm text-blue-600 hover:text-blue-800 underline font-semibold"
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
