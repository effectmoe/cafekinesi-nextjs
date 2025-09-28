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
      sections.forEach(section => {
        const element = document.getElementById(section.id)
        if (element) {
          const rect = element.getBoundingClientRect()
          console.log(`セクション [${section.id}]:`, {
            'offsetTop': element.offsetTop,
            'offsetParent': element.offsetParent?.tagName,
            'getBoundingClientRect.top': rect.top,
            'absolute位置': rect.top + window.scrollY
          })
        }
      })
    }, 500)
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
                      const sectionElement = element.closest('section')
                      const targetElement = sectionElement || element
                      const rect = targetElement.getBoundingClientRect()
                      const elementRect = element.getBoundingClientRect()

                      console.log('要素情報:', {
                        'H2要素のrect.top': elementRect.top,
                        'Section要素のrect.top': sectionElement ? sectionElement.getBoundingClientRect().top : 'なし',
                        '現在のスクロール位置': window.scrollY,
                        'rect.top + scrollY': rect.top + window.scrollY,
                        '目標スクロール位置': Math.max(0, rect.top + window.scrollY - 100)
                      })

                      const targetScrollY = Math.max(0, rect.top + window.scrollY - 100)

                      window.scrollTo({
                        top: targetScrollY,
                        behavior: 'smooth'
                      })

                      // スクロール後の確認
                      setTimeout(() => {
                        console.log('スクロール後の位置:', window.scrollY)
                        console.log('差分:', window.scrollY - targetScrollY)
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
                      const sectionElement = element.closest('section')
                      const targetElement = sectionElement || element
                      const rect = targetElement.getBoundingClientRect()

                      console.log('effects要素情報:', {
                        'rect.top': rect.top,
                        '現在のスクロール位置': window.scrollY,
                        'rect.top + scrollY': rect.top + window.scrollY,
                        '目標スクロール位置': Math.max(0, rect.top + window.scrollY - 100)
                      })

                      const targetScrollY = Math.max(0, rect.top + window.scrollY - 100)

                      window.scrollTo({
                        top: targetScrollY,
                        behavior: 'smooth'
                      })

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
            <section key={section.id}>
              <div className="border-l-4 border-gray-300 pl-6">
                <h2 id={section.id} className="text-xl font-semibold mb-4 text-gray-900">
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
            <h2 id="effects" className="text-xl font-semibold mb-4 text-gray-900">
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