'use client'

import { PortableTextBlock } from '@portabletext/types'

interface ArticleMetaInfoProps {
  publishedAt: string
  updatedAt?: string
  content: PortableTextBlock[]
  authorName?: string
}

// テキストから読了時間を計算（日本語は文字数、英語は単語数）
function calculateReadingTime(content: PortableTextBlock[]): number {
  let totalChars = 0
  let totalWords = 0

  content.forEach(block => {
    if (block._type === 'block' && block.children) {
      block.children.forEach((child: any) => {
        if (child.text) {
          const text = child.text
          // 日本語文字数（ひらがな、カタカナ、漢字）
          const japaneseChars = (text.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g) || []).length
          // 英単語数
          const englishWords = (text.match(/[a-zA-Z]+/g) || []).length

          totalChars += japaneseChars
          totalWords += englishWords
        }
      })
    }
  })

  // 日本語: 400-600文字/分、英語: 200-250語/分
  const japaneseMinutes = totalChars / 500
  const englishMinutes = totalWords / 225

  const totalMinutes = Math.ceil(japaneseMinutes + englishMinutes)
  return Math.max(1, totalMinutes) // 最低1分
}

export default function ArticleMetaInfo({
  publishedAt,
  updatedAt,
  content,
  authorName
}: ArticleMetaInfoProps) {
  const readingTime = calculateReadingTime(content)
  const isUpdated = updatedAt && updatedAt !== publishedAt

  return (
    <div className="mb-8 pb-6 border-b border-gray-200">
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-600">
        {/* 公開日 */}
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider block">公開日</span>
            <time dateTime={publishedAt} className="font-medium text-gray-700">
              {new Date(publishedAt).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
        </div>

        {/* 最終更新日 */}
        {isUpdated && (
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <div>
              <span className="text-xs text-amber-600 uppercase tracking-wider block">最終更新</span>
              <time dateTime={updatedAt} className="font-medium text-gray-700">
                {new Date(updatedAt).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
          </div>
        )}

        {/* 読了時間 */}
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider block">読了時間</span>
            <span className="font-medium text-gray-700">約 {readingTime} 分</span>
          </div>
        </div>

        {/* 著者 */}
        {authorName && (
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider block">著者</span>
              <span className="font-medium text-gray-700">{authorName}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
