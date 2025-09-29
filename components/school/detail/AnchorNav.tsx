'use client'

import { useEffect } from 'react'

export default function AnchorNav() {
  useEffect(() => {
    // スクロール関数
    const scrollToElement = (id: string) => {
      // 要素が完全にレンダリングされるまで待つ
      let attempts = 0
      const maxAttempts = 20

      const tryScroll = () => {
        attempts++
        const element = document.getElementById(id)

        if (!element) {
          console.log(`Attempt ${attempts}: Element ${id} not found`)

          // 全てのIDを持つ要素を表示（デバッグ用）
          if (attempts === 1) {
            const allIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id)
            console.log('All element IDs on page:', allIds)
          }

          if (attempts < maxAttempts) {
            setTimeout(tryScroll, 100)
          }
          return
        }

        // 要素の実際の位置を取得
        const rect = element.getBoundingClientRect()
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const elementTop = rect.top + scrollTop

        console.log(`Attempt ${attempts}: Element ${id} found`, {
          element: element.tagName,
          id: element.id,
          rect: {
            top: rect.top,
            height: rect.height,
            bottom: rect.bottom
          },
          scrollTop: scrollTop,
          elementTop: elementTop,
          windowHeight: window.innerHeight,
          computedDisplay: window.getComputedStyle(element).display,
          computedVisibility: window.getComputedStyle(element).visibility,
          offsetParent: element.offsetParent?.tagName || 'none',
          offsetTop: element.offsetTop
        })

        // 要素の高さが0で表示されていない場合はまだレンダリングされていない可能性がある
        if (rect.height === 0 && window.getComputedStyle(element).display !== 'none' && attempts < maxAttempts) {
          console.log(`Element ${id} has height 0, retrying...`)
          setTimeout(tryScroll, 100)
          return
        }

        // 要素の位置が取得できた場合のみスクロール
        if (elementTop > 0 || rect.top !== 0) {
          // ヘッダー分のオフセット（80px）を考慮
          const targetPosition = elementTop - 80

          console.log(`Scrolling to ${id} at position ${targetPosition}`)

          window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: 'smooth'
          })
        } else if (attempts < maxAttempts) {
          // 位置が0の場合はリトライ
          console.log(`Position is 0, retrying...`)
          setTimeout(tryScroll, 100)
        } else {
          console.error(`Failed to get valid position for ${id} after ${maxAttempts} attempts`)
          console.error('Final element state:', {
            element: element,
            innerHTML: element.innerHTML.substring(0, 100),
            parentElement: element.parentElement?.tagName,
            nextSibling: element.nextSibling,
            previousSibling: element.previousSibling
          })
        }
      }

      // 初回実行を少し遅らせる（DOMの準備を待つ）
      setTimeout(tryScroll, 50)
    }

    // ページロード時のハッシュ処理
    const handleInitialHash = () => {
      if (window.location.hash) {
        const id = window.location.hash.substring(1)
        // ページロード完了後に実行
        setTimeout(() => scrollToElement(id), 1000)
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
          console.log(`Anchor clicked: ${id}`)
          scrollToElement(id)
          // URLのハッシュを更新
          window.history.pushState(null, '', `#${id}`)
        }
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