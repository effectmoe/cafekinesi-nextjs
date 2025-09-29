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

        // 少し遅延を入れて要素を探す
        setTimeout(() => {
          const element = document.getElementById(id)

          if (element) {
            console.log(`Found element with id="${id}"`)

            // 要素の位置を計算
            const rect = element.getBoundingClientRect()
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop
            const targetPosition = rect.top + scrollTop - 100 // ヘッダー分のオフセット

            console.log(`Element position - top: ${rect.top}, scrollTop: ${scrollTop}, targetPosition: ${targetPosition}`)

            // スムーズスクロール
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            })
          } else {
            console.error(`Element with id="${id}" not found`)
          }
        }, 0)
      }
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  return null
}