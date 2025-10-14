'use client'

import { Event } from '@/lib/types/event'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import Link from 'next/link'

interface EventCardProps {
  event: Event
  isHighlighted?: boolean
}

export default function EventCard({ event, isHighlighted = false }: EventCardProps) {
  // ステータスに応じた表示
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'open':
        return {
          label: '受付中',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-300'
        }
      case 'full':
        return {
          label: '満席',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-300'
        }
      case 'closed':
        return {
          label: '終了',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-300'
        }
      case 'cancelled':
        return {
          label: 'キャンセル',
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-800',
          borderColor: 'border-orange-300'
        }
      default:
        return {
          label: status,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-300'
        }
    }
  }

  // カテゴリーに応じた表示
  const getCategoryDisplay = (category?: string) => {
    switch (category) {
      case 'course':
        return '講座'
      case 'session':
        return 'セッション'
      case 'information':
        return '説明会'
      case 'workshop':
        return 'ワークショップ'
      case 'other':
        return 'その他'
      default:
        return category || ''
    }
  }

  // 空き状況の計算
  const availableSeats = event.capacity && event.currentParticipants !== undefined
    ? event.capacity - event.currentParticipants
    : null

  const statusDisplay = getStatusDisplay(event.status)

  return (
    <div className={`border-l-4 ${statusDisplay.borderColor} ${isHighlighted ? 'bg-blue-50 ring-2 ring-blue-400' : 'bg-white'} rounded-lg shadow-sm hover:shadow-md transition-all p-4`}>
      {/* ステータスとカテゴリー */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`${statusDisplay.bgColor} ${statusDisplay.textColor} text-xs font-semibold px-2.5 py-0.5 rounded`}>
          {statusDisplay.label}
        </span>
        {event.category && (
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            {getCategoryDisplay(event.category)}
          </span>
        )}
      </div>

      {/* イベントタイトル */}
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        {event.title}
      </h3>

      {/* 開催日時 */}
      <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
        <svg
          className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0"
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
        <div>
          <div>{format(new Date(event.startDate), 'M月d日 (E) HH:mm', { locale: ja })}</div>
          <div className="text-xs">〜 {format(new Date(event.endDate), 'M月d日 (E) HH:mm', { locale: ja })}</div>
        </div>
      </div>

      {/* 開催場所 */}
      {event.location && (
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <svg
            className="h-5 w-5 text-gray-400 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>{event.location}</span>
        </div>
      )}

      {/* 講師情報 */}
      {event.instructor && (
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <svg
            className="h-5 w-5 text-gray-400 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span>講師: {event.instructor.name}</span>
        </div>
      )}

      {/* 定員・参加費情報 */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
        {availableSeats !== null && (
          <div className="flex items-center gap-1">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span>
              定員: {event.capacity}名
              {availableSeats > 0 && (
                <span className="text-green-600 font-semibold ml-1">
                  (残り{availableSeats}席)
                </span>
              )}
            </span>
          </div>
        )}
        {event.fee !== undefined && (
          <div className="flex items-center gap-1">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              {event.fee === 0 ? '無料' : `¥${event.fee.toLocaleString()}`}
            </span>
          </div>
        )}
      </div>

      {/* アクションボタン */}
      <div className="flex gap-2 pt-3 border-t">
        <Link
          href={`/events/${event.slug.current}`}
          className="flex-1 bg-primary text-white text-center py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold"
        >
          詳細を見る
        </Link>
        {event.registrationUrl && event.status === 'open' && (
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-green-600 text-white text-center py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
          >
            申し込む
          </a>
        )}
      </div>
    </div>
  )
}
