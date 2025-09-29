'use client'

import { useEffect } from 'react'

export default function AnchorNav() {
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a[href^="#"]') as HTMLAnchorElement

      if (link && !link.classList.contains('no-scroll')) {
        const href = link.getAttribute('href')
        if (href && href.startsWith('#')) {
          e.preventDefault()
          const id = href.substring(1)

          console.log(`Anchor clicked: ${id}`)

          // 少し待ってから要素を探す（レンダリング待機）
          setTimeout(() => {
            const element = document.getElementById(id)

            if (element) {
              console.log(`Scrolling to element: ${id}`)
              const yOffset = -100 // ヘッダーの高さ分オフセット
              const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset

              window.scrollTo({ top: y, behavior: 'smooth' })
            } else {
              console.error(`Element not found: ${id}`)
              // 利用可能なIDを表示
              const allIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id).filter(id => id)
              console.log('Available IDs:', allIds)
            }
          }, 100)
        }
      }
    }

    // ページロード時のハッシュ処理
    if (window.location.hash) {
      const id = window.location.hash.substring(1)
      setTimeout(() => {
        const element = document.getElementById(id)
        if (element) {
          const yOffset = -100
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
          window.scrollTo({ top: y, behavior: 'smooth' })
        }
      }, 500)
    }

    document.addEventListener('click', handleAnchorClick)
    return () => document.removeEventListener('click', handleAnchorClick)
  }, [])

  return null
}