'use client'

import { useState, useEffect } from 'react'
import { Event } from '@/lib/types/event'
import { startOfMonth, endOfMonth, format, getDaysInMonth, getDay, startOfDay } from 'date-fns'
import { ja } from 'date-fns/locale'
import Link from 'next/link'

export default function SidebarCalendar() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [events, setEvents] = useState<Event[]>([])

  // 月が変更されたときにイベントを取得
  useEffect(() => {
    fetchEvents(currentMonth)
  }, [currentMonth])

  const fetchEvents = async (month: Date) => {
    try {
      const startDate = startOfMonth(month).toISOString()
      const endDate = endOfMonth(month).toISOString()

      const response = await fetch(
        `/api/events?startDate=${startDate}&endDate=${endDate}`
      )

      if (response.ok) {
        const data = await response.json()
        setEvents(data.events || [])
      }
    } catch (err) {
      console.error('Failed to fetch events:', err)
    }
  }

  // イベントがある日付のセットを作成
  const eventDateSet = new Set(
    events.map((event) => {
      const date = startOfDay(new Date(event.startDate))
      return date.getTime()
    })
  )

  // 日付がイベントを持っているかチェック
  const hasEvent = (day: number): boolean => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return eventDateSet.has(startOfDay(date).getTime())
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
    <div className="bg-gray-50 p-4 rounded">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">カレンダー</h3>
        <Link
          href="/calendar"
          className="text-xs text-blue-600 hover:underline"
        >
          全画面で表示
        </Link>
      </div>

      <div className="text-xs text-gray-600">
        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          <div>日</div>
          <div>月</div>
          <div>火</div>
          <div>水</div>
          <div>木</div>
          <div>金</div>
          <div>土</div>
        </div>

        {/* 日付グリッド */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`
                p-1 rounded relative
                ${day ? 'hover:bg-blue-100 cursor-pointer' : ''}
                ${day && hasEvent(day) ? 'bg-blue-50 font-semibold text-blue-600' : ''}
              `}
            >
              {day || ''}
              {day && hasEvent(day) && (
                <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <Link href="/calendar">
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700 transition-colors">
            イベントカレンダーを開く
          </button>
        </Link>
      </div>

      <div className="mt-3 text-xs text-gray-600">
        <p className="flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
          <span>イベント有</span>
        </p>
      </div>
    </div>
  )
}
