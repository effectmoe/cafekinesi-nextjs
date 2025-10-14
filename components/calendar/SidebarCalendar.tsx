'use client'

import { useState, useEffect } from 'react'
import { Event } from '@/lib/types/event'
import { startOfMonth, endOfMonth, format, getDaysInMonth, getDay, startOfDay, addMonths, subMonths } from 'date-fns'
import { ja } from 'date-fns/locale'
import Link from 'next/link'
import Holidays from 'date-holidays'

export default function SidebarCalendar() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const holidays = new Holidays('JP')

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
  }

  // 次月へ移動
  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
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

      {/* 年月表示と切り替えボタン */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={goToPreviousMonth}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
          aria-label="前月"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="text-sm font-semibold">
          {format(currentMonth, 'yyyy年 M月', { locale: ja })}
        </div>
        <button
          onClick={goToNextMonth}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
          aria-label="次月"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="text-xs text-gray-600">
        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2 font-semibold">
          <div className="text-red-600">日</div>
          <div>月</div>
          <div>火</div>
          <div>水</div>
          <div>木</div>
          <div>金</div>
          <div className="text-blue-600">土</div>
        </div>

        {/* 日付グリッド */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {calendarDays.map((day, index) => {
            const dayOfWeek = day ? getDayOfWeek(day) : -1
            const isSunday = dayOfWeek === 0
            const isSaturday = dayOfWeek === 6
            const isHolidayDay = day ? isHoliday(day) : false
            const hasEventDay = day ? hasEvent(day) : false

            return (
              <div
                key={index}
                className={`
                  p-1 rounded relative min-h-[24px] flex items-center justify-center
                  ${day ? 'hover:bg-blue-100 cursor-pointer' : ''}
                  ${hasEventDay ? 'bg-blue-50 font-bold' : ''}
                  ${isSunday || isHolidayDay ? 'text-red-600' : ''}
                  ${isSaturday && !isHolidayDay ? 'text-blue-600' : ''}
                `}
              >
                {day || ''}
                {hasEventDay && (
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-orange-500 rounded-full border border-white"></div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-4">
        <Link href="/calendar">
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700 transition-colors">
            イベントカレンダーを開く
          </button>
        </Link>
      </div>

      <div className="mt-3 text-xs text-gray-600 space-y-1">
        <p className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-orange-500 rounded-full"></span>
          <span>イベント有</span>
        </p>
        <p className="flex items-center gap-2">
          <span className="text-red-600 font-semibold">●</span>
          <span>日曜・祝日</span>
        </p>
        <p className="flex items-center gap-2">
          <span className="text-blue-600 font-semibold">●</span>
          <span>土曜日</span>
        </p>
      </div>
    </div>
  )
}
