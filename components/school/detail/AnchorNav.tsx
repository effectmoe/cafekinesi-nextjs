'use client'

import { useEffect } from 'react'

export default function AnchorNav() {
  useEffect(() => {
    console.log('AnchorNav mounted')

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')

      if (link && link.getAttribute('href')?.startsWith('#')) {
        e.preventDefault()

        const id = link.getAttribute('href')!.slice(1)
        console.log(`Anchor link clicked: #${id}`)

        // レンダリング完了を待つためにrequestAnimationFrameを使用
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const element = document.getElementById(id)

            if (element) {
              console.log(`Found element with id="${id}"`)

              // 要素の実際の位置を取得
              const yOffset = -100 // ヘッダーの高さ分のオフセット
              const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset

              console.log(`Scrolling to element "${id}" at position ${y}`)
              console.log(`Element rect:`, element.getBoundingClientRect())
              console.log(`Window pageYOffset: ${window.pageYOffset}`)

              window.scrollTo({
                top: y,
                behavior: 'smooth'
              })
            } else {
              console.error(`Element with id="${id}" not found`)

              // IDを持つ要素をすべて表示してデバッグ
              const allElements = document.querySelectorAll('[id]')
              const ids = Array.from(allElements).map(el => el.id).filter(id => id)
              console.log('Available element IDs:', ids)
            }
          })
        })
      }
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  return null
}