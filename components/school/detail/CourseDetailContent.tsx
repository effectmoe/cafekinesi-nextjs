'use client'

import { useEffect } from 'react'
import { CourseDetail } from '@/lib/types/course'

interface CourseDetailContentProps {
  course: CourseDetail
}

export default function CourseDetailContent({ course }: CourseDetailContentProps) {
  // sectionsが存在しない場合のフォールバック
  const sections = course.sections || []

  // デバッグ用：ページロード時に要素の状態を確認
  useEffect(() => {
    console.log('=== デバッグ開始 ===')
    console.log('sections:', sections)

    // 各セクションの要素を確認
    sections.forEach(section => {
      const element = document.getElementById(section.id)
      if (element) {
        console.log(`要素 ${section.id}:`, {
          存在: true,
          offsetTop: element.offsetTop,
          offsetHeight: element.offsetHeight,
          getBoundingClientRect: element.getBoundingClientRect(),
          computedStyle: window.getComputedStyle(element).display
        })
      } else {
        console.error(`要素 ${section.id} が見つかりません`)
      }
    })

    // effectsセクションも確認
    const effectsElement = document.getElementById('effects')
    if (effectsElement) {
      console.log('effects要素:', {
        存在: true,
        offsetTop: effectsElement.offsetTop,
        offsetHeight: effectsElement.offsetHeight,
        getBoundingClientRect: effectsElement.getBoundingClientRect()
      })
    }

    console.log('=== デバッグ終了 ===')
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
                    console.log(`クリック: ${section.id}`)
                    const element = document.getElementById(section.id)
                    if (element) {
                      console.log('要素が見つかりました:', {
                        id: section.id,
                        offsetTop: element.offsetTop,
                        scrollY: window.scrollY,
                        getBoundingClientRect: element.getBoundingClientRect()
                      })
                    } else {
                      console.error(`要素が見つかりません: ${section.id}`)
                    }
                    // デフォルトのアンカー動作を使用
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
                  onClick={() => {
                    console.log('クリック: effects')
                    const element = document.getElementById('effects')
                    if (element) {
                      console.log('effects要素が見つかりました:', {
                        offsetTop: element.offsetTop,
                        scrollY: window.scrollY,
                        getBoundingClientRect: element.getBoundingClientRect()
                      })
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
            <section key={section.id}>
              <div className="border-l-4 border-gray-300 pl-6">
                <h2 id={section.id} className="text-xl font-semibold mb-4 text-gray-900 scroll-pt-24">
                  {section.title}
                </h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            </section>
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
        <section>
          <div className="border-l-4 border-gray-300 pl-6">
            <h2 id="effects" className="text-xl font-semibold mb-4 text-gray-900 scroll-pt-24">
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
        </section>
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