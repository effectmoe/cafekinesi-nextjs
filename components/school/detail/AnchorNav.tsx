'use client'

import { useEffect } from 'react'

export default function AnchorNav() {
  useEffect(() => {
    // スクロール関数（シンプルで確実な実装）
    const scrollToElement = (id: string) => {
      const element = document.getElementById(id)

      if (!element) {
        console.error(`Element with id "${id}" not found`)
        // すべてのIDを表示
        const allIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id)
        console.log('Available IDs on page:', allIds)
        return
      }

      console.log(`Found element ${id}:`, {
        element: element.tagName,
        offsetTop: element.offsetTop,
        scrollHeight: element.scrollHeight,
        clientHeight: element.clientHeight,
        innerHTML: element.innerHTML.substring(0, 100)
      })

      // 要素の位置を直接取得して移動
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })

      // ヘッダー分のオフセット調整（80px）
      setTimeout(() => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop
        console.log(`Adjusting scroll position from ${currentScroll} to ${currentScroll - 80}`)
        window.scrollTo({
          top: currentScroll - 80,
          behavior: 'smooth'
        })
      }, 300)
    }

    // アンカーリンクのクリック処理
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a[href^="#"]') as HTMLAnchorElement

      if (link) {
        e.preventDefault()
        const id = link.getAttribute('href')?.substring(1)
        if (id) {
          console.log(`Navigating to section: ${id}`)
          scrollToElement(id)
          // URLのハッシュを更新
          window.history.pushState(null, '', `#${id}`)
        }
      }
    }

    // ページロード時のハッシュ処理
    const handleInitialHash = () => {
      if (window.location.hash) {
        const id = window.location.hash.substring(1)
        setTimeout(() => scrollToElement(id), 500)
      }
    }

    // イベントリスナーを設定
    handleInitialHash()
    document.addEventListener('click', handleAnchorClick)

    return () => {
      document.removeEventListener('click', handleAnchorClick)
    }
  }, [])

  return null
}