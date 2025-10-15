'use client'

import { CourseDetail } from '@/lib/types/course'
import { useEffect } from 'react'

interface CourseDetailContentProps {
  course: CourseDetail
}

// 簡易マークダウンパーサー（HTML table対応）
function parseMarkdown(text: string): string {
  // HTMLテーブルが含まれている場合は特別処理
  if (text.includes('<table')) {
    // テーブルにTailwindスタイルを追加
    let processedText = text
      .replace(/<table class="([^"]+)">/g, '<table class="$1 w-full border-collapse border border-gray-300 my-6 text-sm">')
      .replace(/<thead>/g, '<thead class="bg-gray-100">')
      .replace(/<th>/g, '<th class="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">')
      .replace(/<td>/g, '<td class="border border-gray-300 px-4 py-3">')
      .replace(/<tr>/g, '<tr class="hover:bg-gray-50">')

    // テーブル以外の部分（段落や見出し）も処理
    const parts = processedText.split(/(<table[\s\S]*?<\/table>)/)
    return parts.map((part, index) => {
      if (part.includes('<table')) {
        // テーブル部分はそのまま
        return part
      } else {
        // それ以外はマークダウン処理
        return processMarkdownText(part)
      }
    }).join('')
  }

  // テーブルがない場合は通常のマークダウン処理
  return processMarkdownText(text)
}

// マークダウンテキスト処理関数
function processMarkdownText(text: string): string {
  return text
    // 太字 **text** -> <strong>text</strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // リンク [text](url) -> <a href="url">text</a>
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')
    // 段落分け
    .split('\n\n')
    .map(para => {
      if (!para.trim()) return ''

      // リスト項目の処理
      if (para.startsWith('・') || para.startsWith('-')) {
        const items = para.split('\n').map(item =>
          item.replace(/^[・\-]\s*/, '').trim()
        ).filter(item => item)
        return `<ul class="list-disc list-inside space-y-1 mb-4">${items.map(item => `<li>${item}</li>`).join('')}</ul>`
      }
      // 見出しの処理
      if (para.startsWith('**') && para.endsWith('**')) {
        return `<h3 class="font-semibold text-lg mt-6 mb-3">${para.replace(/\*\*/g, '')}</h3>`
      }
      return `<p class="mb-4">${para}</p>`
    })
    .filter(p => p)
    .join('')
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
      // 同じIDを持つすべての要素を取得
      const elements = document.querySelectorAll(`#${targetId}`)
      console.log(`Found ${elements.length} elements with id="${targetId}"`)

      // 表示されている要素を探す
      let visibleElement: Element | null = null
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        const style = window.getComputedStyle(el)
        console.log(`Element check:`, {
          id: targetId,
          display: style.display,
          visibility: style.visibility,
          height: rect.height,
          offsetParent: (el as HTMLElement).offsetParent !== null
        })

        // 要素が表示されているかチェック
        if (style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            rect.height > 0) {
          visibleElement = el
        }
      })

      if (!visibleElement) {
        console.error(`No visible element found with id: ${targetId}`)
        return
      }

      console.log(`Using visible element: ${targetId}`)

      // 要素の位置を取得
      const rect = visibleElement.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop

      // スクロール位置を計算（ヘッダーの高さを考慮）
      const targetPosition = rect.top + scrollTop - 100

      console.log('Scroll to position:', targetPosition)

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
    <article className="space-y-8">
      {/* 目次セクション */}
      {sections.length > 0 && (
        <nav className="mb-8 p-6 bg-gray-50 rounded-lg" aria-label="目次">
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
            {/* FAQ */}
            {course.faq && course.faq.length > 0 && (
              <li className="flex items-start">
                <span className="font-medium mr-2">
                  {sections.length + (course.effects && course.effects.length > 0 ? 2 : 1)}.
                </span>
                <a
                  href="#faq"
                  onClick={(e) => handleAnchorClick(e, 'faq')}
                  className="text-blue-600 hover:underline transition-colors cursor-pointer"
                >
                  よくある質問（FAQ）
                </a>
              </li>
            )}
          </ol>
        </nav>
      )}

      {/* 講座セクション */}
      {sections.length > 0 && (
        <div className="space-y-12">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24 border-l-4 border-gray-300 pl-6 min-h-[200px]">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                  {section.title}
                </h2>
                <div
                  className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(section.content) }}
                />
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
        <section id="effects" className="scroll-mt-24 border-l-4 border-gray-300 pl-6 min-h-[200px]">
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
        </section>
      )}

      {/* FAQセクション */}
      {course.faq && course.faq.length > 0 && (
        <section id="faq" className="scroll-mt-24 border-l-4 border-blue-300 pl-6 min-h-[200px]">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">
            よくある質問（FAQ）
          </h2>
          <dl className="space-y-6">
            {course.faq.map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <dt className="text-lg font-semibold text-gray-900 mb-3 flex items-start">
                  <span className="text-blue-600 mr-2">Q{index + 1}.</span>
                  <span>{item.question}</span>
                </dt>
                <dd className="text-gray-700 leading-relaxed pl-8">
                  <span className="font-semibold text-gray-600 mr-2">A.</span>
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* インストラクターリンクセクション */}
      {course.instructorInfo && (
        <aside className="mt-8 p-6 bg-white border rounded">
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
        </aside>
      )}
    </article>
  )
}