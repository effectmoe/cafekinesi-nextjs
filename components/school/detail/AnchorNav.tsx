'use client'

import { useEffect, useState } from 'react'

export default function AnchorNav() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // ページが完全に読み込まれた後に実行
    const handleLoad = () => {
      setIsReady(true)
    }

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
      return () => window.removeEventListener('load', handleLoad)
    }
  }, [])

  useEffect(() => {
    if (!isReady) return

    // シンプルなスクロール関数
    const scrollToElement = (id: string) => {
      // 複数の方法で要素を探す
      const methods = [
        () => document.getElementById(id),
        () => document.querySelector(`#${id}`),
        () => document.querySelector(`[id="${id}"]`)
      ]

      let element: HTMLElement | null = null
      for (const method of methods) {
        element = method() as HTMLElement
        if (element) break
      }

      if (!element) {
        console.error(`Element ${id} not found`)
        return
      }

      console.log(`Found element ${id}`, {
        element: element.tagName,
        id: element.id,
        offsetTop: element.offsetTop,
        scrollHeight: element.scrollHeight,
        clientHeight: element.clientHeight
      })

      // 複数の方法で位置を取得
      let targetPosition = 0

      // 方法1: offsetTop を使用
      if (element.offsetTop > 0) {
        targetPosition = element.offsetTop - 100
        console.log(`Using offsetTop: ${targetPosition}`)
      }
      // 方法2: getBoundingClientRect を使用
      else {
        const rect = element.getBoundingClientRect()
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        targetPosition = rect.top + scrollTop - 100
        console.log(`Using getBoundingClientRect: ${targetPosition}`)
      }

      // スクロール実行
      if (targetPosition > 0) {
        window.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: 'smooth'
        })
        console.log(`Scrolled to position: ${targetPosition}`)
      } else {
        // 位置が0の場合、要素を表示可能にしてからスクロール
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        // ヘッダー分のオフセット調整
        setTimeout(() => {
          window.scrollBy(0, -100)
        }, 100)
        console.log('Used scrollIntoView as fallback')
      }
    }

    // ページロード時のハッシュ処理
    const handleInitialHash = () => {
      if (window.location.hash) {
        const id = window.location.hash.substring(1)
        // 少し待ってから実行
        setTimeout(() => scrollToElement(id), 100)
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
  }, [isReady])

  return null
}