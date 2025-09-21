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
    // パフォーマンス監視の初期化
    initPerformanceMonitoring()
    measurePageLoad()
    measureResourceLoading()
    monitorMemoryUsage()
  }, [])

  return <>{children}</>
}