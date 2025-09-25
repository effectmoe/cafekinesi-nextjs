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

    // iframe内でのみVisual Editingを有効化
    const isInIframe = window !== window.parent
    if (isInIframe) {
      const disable = enableVisualEditing({
        history: {
          subscribe: (callback) => {
            const handler = () => callback(location.href)
            window.addEventListener('popstate', handler)
            return () => window.removeEventListener('popstate', handler)
          },
          update: (update) => {
            if (update.url !== location.href) {
              window.history.pushState(null, '', update.url)
            }
          },
        },
        refresh: (payload) => {
          // ページをリフレッシュ
          if (payload?.source === 'mutation' && payload?.type === 'visual-editing') {
            window.location.reload()
          }
        },
      })

      return () => {
        disable()
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