'use client'

import { useEffect } from 'react'

export default function AnchorNav() {
  useEffect(() => {
    // 要素の絶対位置を取得する関数
    const getElementTop = (element: HTMLElement): number => {
      const rect = element.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      return rect.top + scrollTop
    }

    // ページロード時のハッシュ処理
    const handleInitialHash = () => {
      if (window.location.hash) {
        const id = window.location.hash.substring(1)
        setTimeout(() => {
          const element = document.getElementById(id)
          if (element) {
            console.log(`Initial hash: ${id}`)
            const top = getElementTop(element) - 100
            console.log(`Scrolling to: ${top}`)
            window.scrollTo({ top, behavior: 'smooth' })
          }
        }, 500) // より長く待機
      }
    }

    // アンカーリンクのクリック処理
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a[href^="#"]') as HTMLAnchorElement

      if (link) {
        e.preventDefault()
        const id = link.getAttribute('href')?.substring(1)
        if (id) {
          const element = document.getElementById(id)
          if (element) {
            console.log(`Clicked: ${id}`)
            const top = getElementTop(element) - 100
            console.log(`Element position: ${getElementTop(element)}, Scrolling to: ${top}`)
            window.scrollTo({ top, behavior: 'smooth' })
            window.history.pushState(null, '', `#${id}`)
          }
        }
      }
    }

    handleInitialHash()
    document.addEventListener('click', handleAnchorClick)

    return () => {
      document.removeEventListener('click', handleAnchorClick)
    }
  }, [])

  return null
}