'use client'

import { useEffect } from 'react'

export default function AnchorNav() {
  useEffect(() => {
    // ページロード時のハッシュ処理
    const handleInitialHash = () => {
      if (window.location.hash) {
        const id = window.location.hash.substring(1)
        setTimeout(() => {
          const element = document.getElementById(id)
          if (element) {
            const top = element.offsetTop - 100
            window.scrollTo({ top, behavior: 'smooth' })
          }
        }, 100)
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
            const top = element.offsetTop - 100
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