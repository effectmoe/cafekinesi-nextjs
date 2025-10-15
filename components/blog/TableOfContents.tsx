'use client'

import { useEffect, useState } from 'react'
import { PortableTextBlock } from '@portabletext/types'

interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: PortableTextBlock[]
}

// PortableTextからh2, h3見出しを抽出
function extractHeadings(content: PortableTextBlock[]): Heading[] {
  const headings: Heading[] = []

  content.forEach((block, index) => {
    if (block._type === 'block' && (block.style === 'h2' || block.style === 'h3')) {
      const text = block.children?.map((child: any) => child.text).join('') || ''
      const id = `heading-${index}`

      headings.push({
        id,
        text,
        level: block.style === 'h2' ? 2 : 3
      })
    }
  })

  return headings
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const extracted = extractHeadings(content)
    setHeadings(extracted)

    // IntersectionObserverでアクティブな見出しを追跡
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-80px 0px -80% 0px'
      }
    )

    // 実際のDOM要素を監視
    extracted.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [content])

  if (headings.length === 0) {
    return null
  }

  return (
    <nav className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">目次</h2>
      <ol className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={heading.level === 3 ? 'ml-4' : ''}
          >
            <a
              href={`#${heading.id}`}
              className={`block py-1 transition-colors hover:text-[#8B5A3C] ${
                activeId === heading.id
                  ? 'text-[#8B5A3C] font-medium'
                  : 'text-gray-600'
              }`}
              onClick={(e) => {
                e.preventDefault()
                const element = document.getElementById(heading.id)
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
