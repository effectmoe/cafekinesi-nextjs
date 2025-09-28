'use client'

import { enableOverlays, HistoryAdapterNavigate } from '@sanity/overlays'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

// 履歴スタック管理
const history: {
  index: number
  stack: string[]
} = {
  index: 0,
  stack: [],
}

export default function VisualEditing() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const routerRef = useRef(useRouter())
  const [navigate, setNavigate] = useState<HistoryAdapterNavigate | undefined>()

  useEffect(() => {
    routerRef.current = useRouter()
  }, [])

  useEffect(() => {
    const unsub = enableOverlays({
      allowStudioOrigin: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'http://localhost:3333',
      zIndex: 999999,
      history: {
        subscribe: (navigate) => {
          setNavigate(() => navigate)
          return () => {
            setNavigate(undefined)
          }
        },
        update: (update) => {
          if (history.index === update.index) return
          history.index = update.index

          if (update.type === 'push' || update.type === 'replace') {
            routerRef.current[update.type](update.url)
          } else if (update.type === 'pop') {
            routerRef.current.back()
          }
        },
      },
    })

    return () => unsub()
  }, [])

  useEffect(() => {
    const url = `${pathname}${searchParams?.toString() ? `?${searchParams}` : ''}`

    if (navigate) {
      navigate({
        type: 'push',
        url,
      })
    }
  }, [pathname, searchParams, navigate])

  return null
}