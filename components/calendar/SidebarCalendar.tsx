'use client'

import { useState, useEffect } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Event } from '@/lib/types/event'
import { startOfMonth, endOfMonth } from 'date-fns'
import { ja } from 'date-fns/locale'
import Link from 'next/link'

export default function SidebarCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
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
      color: '#3b82f6', // blue-500
    }
  }

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

      <div className="text-xs">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          locale={ja}
          className="rounded-md border bg-white"
        />
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
          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
          <span className="font-bold underline">イベント有</span>
        </p>
      </div>
    </div>
  )
}
