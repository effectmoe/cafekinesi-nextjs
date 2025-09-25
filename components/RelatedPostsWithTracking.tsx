'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface RelatedPostsWithTrackingProps {
  children: React.ReactNode
  currentPostId: string
}

export default function RelatedPostsWithTracking({
  children,
  currentPostId
}: RelatedPostsWithTrackingProps) {
  const pathname = usePathname()

  useEffect(() => {
    // 関連記事のクリックイベントをトラッキング
    const handleRelatedPostClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a[data-related-post-id]')

      if (link) {
        const toPostId = link.getAttribute('data-related-post-id')

        if (toPostId) {
          // クリックイベントをAPIに送信（非同期で送信、ナビゲーションをブロックしない）
          fetch('/api/analytics/track-click', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fromPostId: currentPostId,
              toPostId,
              timestamp: new Date().toISOString(),
            }),
          }).catch(error => {
            console.error('Failed to track click:', error)
          })
        }
      }
    }

    // イベントリスナーを追加
    document.addEventListener('click', handleRelatedPostClick)

    // ページビューイベントを記録（オプション）
    const trackPageView = async () => {
      try {
        await fetch('/api/analytics/track-view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            postId: currentPostId,
            timestamp: new Date().toISOString(),
          }),
        })
      } catch (error) {
        console.error('Failed to track page view:', error)
      }
    }

    trackPageView()

    // クリーンアップ
    return () => {
      document.removeEventListener('click', handleRelatedPostClick)
    }
  }, [currentPostId, pathname])

  return <>{children}</>
}