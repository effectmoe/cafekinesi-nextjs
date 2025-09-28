'use client'

import { useEffect } from 'react'
import { CourseDetail } from '@/lib/types/course'

interface CourseDetailContentProps {
  course: CourseDetail
}

export default function CourseDetailContent({ course }: CourseDetailContentProps) {
  // sectionsが存在しない場合のフォールバック
  const sections = course.sections || []

  // ページロード時にハッシュがある場合の処理
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.substring(1)
      // ページロード後に少し待ってからスクロール
      setTimeout(() => {
        const element = document.getElementById(hash)
        if (element) {
          const yOffset = -100
          const rect = element.getBoundingClientRect()
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop
          const targetY = rect.top + scrollTop + yOffset

          window.scrollTo({
            top: targetY,
            behavior: 'smooth'
          })
        }
      }, 500) // ページロード時は少し長めに待機
    }
  }, [])

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()

    console.log('=== アンカークリック開始 ===')
    console.log('ターゲットID:', sectionId)
    console.log('現在のスクロール位置:', window.pageYOffset)

    // 少し待ってから実行（レンダリング完了を待つ）
    setTimeout(() => {
      const element = document.getElementById(sectionId)
      console.log('要素を検索:', element)

      if (element) {
        // デバッグ情報を詳細に出力
        let rect = element.getBoundingClientRect()
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop

        console.log('要素の位置情報:')
        console.log('  - rect.top (ビューポートからの相対位置):', rect.top)
        console.log('  - rect.height (要素の高さ):', rect.height)
        console.log('  - scrollTop (現在のスクロール位置):', scrollTop)
        console.log('  - offsetTop (要素の絶対位置):', element.offsetTop)

        // 要素が非表示の場合、親要素または近い要素を探す
        let targetElement = element
        let attempts = 0

        while (rect.height === 0 && attempts < 5) {
          console.log(`  - 試行 ${attempts + 1}: 要素の高さが0、別の要素を探索`)

          // 親要素を試す
          if (targetElement.parentElement) {
            targetElement = targetElement.parentElement
            rect = targetElement.getBoundingClientRect()
            console.log(`    親要素を使用:`, targetElement.className, 'height:', rect.height)
          }

          // それでもダメなら最も近い次の兄弟要素を試す
          if (rect.height === 0 && element.nextElementSibling) {
            targetElement = element.nextElementSibling as HTMLElement
            rect = targetElement.getBoundingClientRect()
            console.log(`    次の兄弟要素を使用:`, targetElement.className, 'height:', rect.height)
          }

          attempts++
        }

        // 最終的な計算
        const targetY = rect.top + scrollTop - 100

        console.log('最終計算:')
        console.log('  - 使用する要素:', targetElement.tagName, targetElement.className)
        console.log('  - rect.top:', rect.top)
        console.log('  - rect.height:', rect.height)
        console.log('  - スクロール先:', targetY)

        // スムーススクロール実行
        window.scrollTo({
          top: Math.max(0, targetY), // 負の値を防ぐ
          behavior: 'smooth'
        })

        // 1秒後に結果を確認
        setTimeout(() => {
          console.log('スクロール後の位置:', window.pageYOffset)
          console.log('=== アンカークリック終了 ===')
        }, 1000)

        // URLにハッシュを追加（履歴管理）
        window.history.pushState(null, '', `#${sectionId}`)
      } else {
        console.error('要素が見つかりません:', sectionId)
      }
    }, 100) // 100ms待機
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
                  className="text-blue-600 hover:underline transition-colors cursor-pointer"
                  onClick={(e) => handleAnchorClick(e, section.id)}
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
                  onClick={(e) => handleAnchorClick(e, 'effects')}
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
                <h2
                  id={section.id}
                  className="text-xl font-semibold mb-4 text-gray-900"
                >
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
        <section className="border-l-4 border-gray-300 pl-6">
          <h2
            id="effects"
            className="text-xl font-semibold mb-4 text-gray-900"
          >
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