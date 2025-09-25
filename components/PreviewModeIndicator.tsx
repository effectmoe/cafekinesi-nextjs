'use client'

import { useEffect, useState } from 'react'

export default function PreviewModeIndicator() {
  const [isPreview, setIsPreview] = useState(false)

  useEffect(() => {
    // URLパラメータやCookieからプレビューモードを検知
    const checkPreviewMode = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const hasPreviewParam = urlParams.get('preview') === 'true'
      const hasPreviewCookie = document.cookie.includes('__prerender_bypass')

      return hasPreviewParam || hasPreviewCookie
    }

    setIsPreview(checkPreviewMode())
  }, [])

  if (!isPreview) return null

  const exitPreview = async () => {
    try {
      await fetch('/api/exit-preview', { method: 'POST' })
      window.location.reload()
    } catch (error) {
      console.error('Failed to exit preview:', error)
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-orange-500 text-white px-4 py-2 text-sm flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span>プレビューモード - 編集内容がリアルタイムで反映されています</span>
      </div>
      <button
        onClick={exitPreview}
        className="text-white hover:text-orange-200 underline text-sm"
      >
        プレビューを終了
      </button>
    </div>
  )
}