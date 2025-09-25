'use client'

import { useEffect, useState } from 'react'

export default function PreviewModeIndicator() {
  const [isPreview, setIsPreview] = useState(false)
  const [isDraft, setIsDraft] = useState(false)

  useEffect(() => {
    // URLパラメータやCookieからプレビューモードを検知
    const checkPreviewMode = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const hasPreviewParam = urlParams.get('preview') === 'true'
        const hasPreviewCookie = document.cookie.includes('__prerender_bypass')

        // ドキュメントIDからドラフトかどうか判定
        const docId = document.querySelector('[data-sanity-id]')?.getAttribute('data-sanity-id')
        const isDocDraft = Boolean(docId?.startsWith && docId.startsWith('drafts.'))

        setIsDraft(isDocDraft)
        return hasPreviewParam || hasPreviewCookie
      } catch (error) {
        console.warn('Preview mode detection error:', error)
        return false
      }
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
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span>🔴 プレビューモード - 編集内容を表示中</span>
        {isDraft && (
          <span className="bg-yellow-600 text-white px-2 py-1 rounded text-xs">下書き</span>
        )}
      </div>
      <button
        onClick={exitPreview}
        className="text-white hover:text-orange-200 underline text-sm font-medium"
      >
        プレビューを終了
      </button>
    </div>
  )
}