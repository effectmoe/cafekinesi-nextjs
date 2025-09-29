'use client'

import { CourseDetail } from '@/lib/types/course'
import { useEffect } from 'react'

interface CourseDetailContentProps {
  course: CourseDetail
}

export default function CourseDetailContent({ course }: CourseDetailContentProps) {
  // sectionsが存在しない場合のフォールバック
  const sections = course.sections || []

  useEffect(() => {
    console.log('CourseDetailContent mounted, setting up anchor handlers')

    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash) {
        const targetId = hash.substring(1)
        const element = document.getElementById(targetId)
        if (element) {
          const yOffset = -100
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
          window.scrollTo({ top: y, behavior: 'smooth' })
        }
      }
    }

    // 初期ロード時のハッシュ処理
    if (window.location.hash) {
      setTimeout(handleHashChange, 100)
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    console.log(`Anchor clicked: #${targetId}`)

    // 少し待ってから処理
    setTimeout(() => {
      const element = document.getElementById(targetId)
      if (!element) {
        console.error(`Element not found: ${targetId}`)
        const allIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id)
        console.log('Available IDs on page:', allIds)
        return
      }

      console.log(`Found element: ${targetId}`)
      console.log('Element details:', {
        tagName: element.tagName,
        className: element.className,
        innerHTML: element.innerHTML.substring(0, 100) + '...',
        offsetHeight: element.offsetHeight,
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight,
        style: window.getComputedStyle(element).display
      })

      // 要素自体の位置を取得
      const rect = element.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop

      // スクロール位置を計算（ヘッダーの高さを考慮）
      const targetPosition = rect.top + scrollTop - 100

      console.log('Scroll calculation:', {
        rectTop: rect.top,
        scrollTop: scrollTop,
        targetPosition: targetPosition
      })

      // スクロール実行
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      })

      // URLにハッシュを追加
      window.history.pushState(null, '', `#${targetId}`)
    }, 100)
  }

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
                  onClick={(e) => handleAnchorClick(e, section.id)}
                  className="text-blue-600 hover:underline transition-colors cursor-pointer"
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
                  onClick={(e) => handleAnchorClick(e, 'effects')}
                  className="text-blue-600 hover:underline transition-colors cursor-pointer"
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
            <div key={section.id} id={section.id} className="scroll-mt-24 border-l-4 border-gray-300 pl-6 min-h-[200px]">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                  {section.title}
                </h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {section.content}
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
        <div id="effects" className="scroll-mt-24 border-l-4 border-gray-300 pl-6 min-h-[200px]">
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