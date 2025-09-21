'use client'

import { useEffect, useState } from 'react'
import { enableVisualEditing } from '@sanity/visual-editing'
import { VisualEditingWrapper } from './VisualEditingWrapper'

export function VisualEditingProvider({ children }: { children: React.ReactNode }) {
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const checkPreviewMode = () => {
    if (typeof window === 'undefined') return false
    return window.location.search.includes('preview=true') ||
           window.parent !== window ||
           window.location.pathname.includes('/studio')
  }

  useEffect(() => {
    const previewMode = checkPreviewMode()
    setIsPreviewMode(previewMode)

    // プレビューモード時のメッセージリスナー設定
    if (previewMode && typeof window !== 'undefined') {
      // Sanity Studioとの双方向通信を設定
      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === 'presentation/navigate') {
          const url = event.data.url
          if (url && url !== window.location.href) {
            window.history.pushState({}, '', url)
            window.dispatchEvent(new PopStateEvent('popstate'))
          }
        }
      }

      window.addEventListener('message', handleMessage)

      // Sanity Studioに準備完了を通知
      window.parent.postMessage(
        {
          type: 'presentation/ready',
          payload: {
            projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'e4aqw590',
            dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
            url: window.location.href
          }
        },
        '*'
      )

      return () => {
        window.removeEventListener('message', handleMessage)
      }
    }
  }, [])

  return (
    <>
      {children}
      {isPreviewMode && <VisualEditingWrapper />}
      {isPreviewMode && (
        <div className="fixed top-0 right-0 z-50 bg-blue-500 text-white px-2 py-1 text-xs">
          プレビューモード
        </div>
      )}
    </>
  )
}