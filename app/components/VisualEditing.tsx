'use client'

import { useEffect } from 'react'

export default function VisualEditing() {
  useEffect(() => {
    // Visual Editing の簡単な実装
    if (process.env.NODE_ENV === 'development') {
      console.log('Visual Editing mode enabled')

      // Studio への参照を作成
      const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'http://localhost:3333'
      console.log('Studio URL:', studioUrl)
    }
  }, [])

  return null
}