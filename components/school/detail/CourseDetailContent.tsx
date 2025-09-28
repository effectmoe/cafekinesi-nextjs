'use client'

import { useEffect } from 'react'
import { CourseDetail } from '@/lib/types/course'

interface CourseDetailContentProps {
  course: CourseDetail
}

export default function CourseDetailContent({ course }: CourseDetailContentProps) {
  // sectionsが存在しない場合のフォールバック
  const sections = course.sections || []

  // デバッグ：ページロード時の要素確認
  useEffect(() => {
    console.log('=== ページロード時のデバッグ ===')
    console.log('現在のURL:', window.location.href)
    console.log('現在のハッシュ:', window.location.hash)
    console.log('初期スクロール位置:', window.scrollY)

    // 全セクションの位置を確認
    setTimeout(() => {
      console.log('\n=== 全セクションの位置情報 ===')
      sections.forEach(section => {
        const element = document.getElementById(section.id)
        if (element) {
          const rect = element.getBoundingClientRect()
          console.log(`[${section.id}]:`, {
            'タグ': element.tagName,
            'クラス': element.className,
            'offsetTop': element.offsetTop,
            'scrollHeight': element.scrollHeight,
            'clientHeight': element.clientHeight,
            '画面からの位置': rect.top,
            '絶対位置': rect.top + window.scrollY
          })
        }
      })

      // effectsセクションも確認
      const effectsEl = document.getElementById('effects')
      if (effectsEl) {
        const rect = effectsEl.getBoundingClientRect()
        console.log('[effects]:', {
          'タグ': effectsEl.tagName,
          'クラス': effectsEl.className,
          '絶対位置': rect.top + window.scrollY
        })
      }
      console.log('=== デバッグ終了 ===')
    }, 2000) // 2秒待機に変更
  }, [sections])

  return (
    <div className="space-y-8">
      {/* 目次セクション */}
      {sections.length > 0 && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">目次</h2>
          <ol className="space-y-2 text-sm">
            {sections.map((section, index) => (
              <li key={section.id} className="flex items-start">
                <span className="font-medium mr-2">{index + 1}.</span>
                <a
                  href={`#${section.id}`}
                  className="text-blue-600 hover:underline transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault()
                    console.log(`\n=== クリック: ${section.id} ===`)
                    const element = document.getElementById(section.id)
                    if (element) {
                      const beforeRect = element.getBoundingClientRect()
                      const beforeScrollY = window.scrollY

                      console.log('クリック前:', {
                        'タグ名': element.tagName,
                        'クラス': element.className,
                        '現在のスクロール位置': beforeScrollY,
                        '要素の画面上の位置': beforeRect.top,
                        '要素の絶対位置': beforeRect.top + beforeScrollY
                      })

                      // scrollIntoViewを使用
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' })

                      // スクロール後の確認
                      setTimeout(() => {
                        const afterRect = element.getBoundingClientRect()
                        const afterScrollY = window.scrollY
                        console.log('スクロール後:', {
                          'スクロール位置': afterScrollY,
                          '要素の画面上の位置': afterRect.top,
                          'スクロール移動量': afterScrollY - beforeScrollY,
                          '成功': Math.abs(afterRect.top) < 10 ? '○' : '×'
                        })
                      }, 1000)
                    } else {
                      console.error(`要素が見つかりません: ${section.id}`)
                    }
                  }}
                >
                  {section.title}
                </a>
              </li>
            ))}
            {/* 受講後の効果 - recommendationsは既にsectionsに含まれている */}
            {course.effects && course.effects.length > 0 && (
              <li className="flex items-start">
                <span className="font-medium mr-2">{sections.length + 1}.</span>
                <a
                  href="#effects"
                  className="text-blue-600 hover:underline transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault()
                    console.log('\n=== クリック: effects ===')
                    const element = document.getElementById('effects')
                    if (element) {
                      console.log('effects要素情報（修正版）:', {
                        'タグ名': element.tagName,
                        '現在のスクロール位置': window.scrollY,
                        'getBoundingClientRect.top': element.getBoundingClientRect().top
                      })

                      element.scrollIntoView({ behavior: 'smooth', block: 'start' })

                      setTimeout(() => {
                        console.log('スクロール後の位置:', window.scrollY)
                      }, 1000)
                    } else {
                      console.error('effects要素が見つかりません')
                    }
                  }}
                >
                  受講後の効果
                </a>
              </li>
            )}
          </ol>
        </div>
      )}

      {/* 講座セクション */}
      {sections.length > 0 && (
        <div className="space-y-12">
          {sections.map((section) => (
            <div key={section.id} id={section.id} className="scroll-mt-24 pt-24 -mt-24">
              <div className="border-l-4 border-gray-300 pl-6 min-h-[200px]">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                  {section.title}
                </h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* デバッグ用: sectionsが空の場合の表示 */}
      {sections.length === 0 && (
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-yellow-800">
            セクションデータがありません。course.sectionsが定義されていない可能性があります。
          </p>
        </div>
      )}

      {/* 受講後の効果セクション */}
      {course.effects && course.effects.length > 0 && (
        <div id="effects" className="scroll-mt-24 pt-24 -mt-24">
          <div className="border-l-4 border-gray-300 pl-6 min-h-[200px]">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              受講後の効果
            </h2>
            <ul className="text-gray-700 leading-relaxed space-y-2">
              {course.effects.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ソーシャルシェアセクション */}
      <div className="mt-12 p-6 bg-gray-50 rounded">
        <h3 className="text-lg font-semibold mb-4 text-center">
          よろしければシェアお願いします
        </h3>
        <div className="flex flex-wrap gap-2 justify-center">
          <button className="bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors rounded">
            Twitter
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors rounded">
            Facebook
          </button>
          <button className="bg-red-600 text-white px-4 py-2 text-sm font-medium hover:bg-red-700 transition-colors rounded">
            Pin it
          </button>
          <button className="bg-green-500 text-white px-4 py-2 text-sm font-medium hover:bg-green-600 transition-colors rounded">
            LINE
          </button>
          <button className="bg-yellow-600 text-white px-4 py-2 text-sm font-medium hover:bg-yellow-700 transition-colors rounded">
            Copy
          </button>
        </div>
      </div>

      {/* インストラクターリンクセクション */}
      {course.instructorInfo && (
        <div className="mt-8 p-6 bg-white border rounded">
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-20 bg-gradient-to-br from-pink-100 to-orange-100 rounded flex items-center justify-center"
            >
              <span className="text-2xl">👩‍🏫</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-600 mb-2">
                {course.instructorInfo.name}
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                {course.instructorInfo.bio}
              </p>
              {course.instructorInfo.profileUrl && (
                <div className="flex items-center text-xs text-gray-500">
                  <span className="mr-2">🔗</span>
                  <a
                    href={course.instructorInfo.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {course.instructorInfo.profileUrl}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}