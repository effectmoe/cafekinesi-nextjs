'use client'

import { useEffect } from 'react'

export default function AnchorNav() {
  useEffect(() => {
    console.log('AnchorNav mounted')

    const handleClick = (e: MouseEvent) => {
      // href="#xxx"のリンクを探す
      const target = e.target as HTMLElement
      const link = target.closest('a')

      console.log('Click detected:', { target: target.tagName, link: link?.getAttribute('href') })

      if (link && link.getAttribute('href')?.startsWith('#')) {
        e.preventDefault()
        console.log('Anchor link clicked:', link.getAttribute('href'))

        const id = link.getAttribute('href')!.slice(1)
        const element = document.getElementById(id)

        if (element) {
          console.log(`Found element with id="${id}"`)
          // 要素の位置を取得
          const rect = element.getBoundingClientRect()
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop
          const targetPosition = rect.top + scrollTop - 100

          console.log(`Scrolling to position: ${targetPosition}`)
          // ヘッダーの高さ分（100px）オフセット
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          })
        } else {
          console.error(`Element with id="${id}" not found`)
        }
      }
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  return null
}