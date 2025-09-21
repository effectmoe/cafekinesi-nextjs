'use client'

import { useEffect } from 'react'
// import { enableVisualEditing } from '@sanity/visual-editing'

export function VisualEditingWrapper() {
  useEffect(() => {
    // Temporarily disable visual editing to fix auth error
    // const disable = enableVisualEditing({
    //   history: {
    //     subscribe: (callback) => {
    //       const handler = () => {
    //         callback(location.href)
    //         // Sanity Studioにナビゲーション変更を通知
    //         window.parent.postMessage(
    //           {
    //             type: 'presentation/navigate',
    //             url: location.href
    //           },
    //           '*'
    //         )
    //       }
    //       window.addEventListener('popstate', handler)
    //       return () => window.removeEventListener('popstate', handler)
    //     },
    //     update: (href) => {
    //       window.history.pushState({}, '', href)
    //       // Sanity Studioにナビゲーション変更を通知
    //       window.parent.postMessage(
    //         {
    //           type: 'presentation/navigate',
    //           url: href
    //         },
    //         '*'
    //       )
    //     }
    //   },
    //   zIndex: 9999,
    //   // より詳細なデバッグ情報
    //   debug: process.env.NODE_ENV === 'development'
    // })

    // return () => disable()
  }, [])

  return null
}