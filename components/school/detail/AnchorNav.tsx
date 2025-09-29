'use client'

import { useEffect } from 'react'

export default function AnchorNav() {
  useEffect(() => {
    // 要素までスクロールする関数
    const scrollToElement = (id: string) => {
      // 何度か試行して要素を探す
      let attempts = 0
      const maxAttempts = 10

      const tryScroll = () => {
        const element = document.getElementById(id)
        if (element) {
          // 要素の位置を複数の方法で取得
          let top = 0

          // 方法1: offsetTop を累積
          let currentElement: HTMLElement | null = element
          while (currentElement) {
            top += currentElement.offsetTop
            currentElement = currentElement.offsetParent as HTMLElement
          }

          // offsetTopが0の場合、getBoundingClientRectを使用
          if (top === 0) {
            const rect = element.getBoundingClientRect()
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop
            top = rect.top + scrollTop
          }

          console.log(`Element ${id} found at position: ${top}`)

          if (top > 0) {
            // 正常な位置が取得できた場合のみスクロール
            window.scrollTo({
              top: Math.max(0, top - 100),
              behavior: 'smooth'
            })
            return true
          }
        }

        attempts++
        if (attempts < maxAttempts) {
          setTimeout(tryScroll, 100)
        } else {
          console.error(`Could not find valid position for element: ${id}`)
        }
        return false
      }

      tryScroll()
    }

    // ページロード時のハッシュ処理
    const handleInitialHash = () => {
      if (window.location.hash) {
        const id = window.location.hash.substring(1)
        setTimeout(() => scrollToElement(id), 500)
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
          console.log(`Clicked: ${id}`)
          scrollToElement(id)
          window.history.pushState(null, '', `#${id}`)
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