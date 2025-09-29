'use client'

import { useEffect } from 'react'

export default function AnchorNav() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // href="#xxx"のリンクを探す
      const target = e.target as HTMLElement
      const link = target.closest('a')

      if (link && link.getAttribute('href')?.startsWith('#')) {
        e.preventDefault()

        const id = link.getAttribute('href')!.slice(1)
        const element = document.getElementById(id)

        if (element) {
          // 要素の位置を取得
          const rect = element.getBoundingClientRect()
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop

          // ヘッダーの高さ分（100px）オフセット
          window.scrollTo({
            top: rect.top + scrollTop - 100,
            behavior: 'smooth'
          })
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