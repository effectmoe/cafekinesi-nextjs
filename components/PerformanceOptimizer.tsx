'use client'

interface PerformanceOptimizerProps {
  children: React.ReactNode
}

// パフォーマンス監視を完全に無効化（web-vitalsのインポートエラーを回避）
export function PerformanceOptimizer({ children }: PerformanceOptimizerProps) {
  // パフォーマンス監視機能は一時的に削除
  // TODO: 将来的に再実装する場合は、web-vitals v4の新しいAPIに対応する必要がある
  return <>{children}</>
}