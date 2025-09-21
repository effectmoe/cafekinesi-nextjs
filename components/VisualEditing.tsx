'use client'

import { useEffect } from 'react'
import { enableVisualEditing } from '@sanity/visual-editing'

export function VisualEditingProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Visual Editingの有効化（Sanity Studioでのプレビュー時）
    const isInIframe = window.parent !== window
    const isStudioPreview = window.location.search.includes('preview=true')

    if (isInIframe || isStudioPreview) {
      const cleanup = enableVisualEditing({
        refresh: async (payload) => {
          // ページのリフレッシュまたはナビゲーション
          if (!payload?.source) return

          // Vercelのリロード
          if (typeof window !== 'undefined') {
            window.location.reload()
          }
        },
        zIndex: 9999,
      })

      return () => {
        cleanup()
      }
    }
  }, [])

  return <>{children}</>
}