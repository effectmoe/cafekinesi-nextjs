'use client'

import { useEffect } from 'react'
import {
  initPerformanceMonitoring,
  measurePageLoad,
  measureResourceLoading,
  monitorMemoryUsage
} from '@/lib/performance'

interface PerformanceOptimizerProps {
  children: React.ReactNode
}

export function PerformanceOptimizer({ children }: PerformanceOptimizerProps) {
  useEffect(() => {
    // パフォーマンス監視の初期化（一時的に無効化）
    // TODO: web-vitals v4のAPI変更に対応後、再度有効化する
    // initPerformanceMonitoring()
    // measurePageLoad()
    // measureResourceLoading()
    // monitorMemoryUsage()

    console.log('Performance monitoring temporarily disabled due to web-vitals API changes')
  }, [])

  return <>{children}</>
}