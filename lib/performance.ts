// パフォーマンス計測とモニタリング

interface PerformanceMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
}

// Core Web Vitals の閾値
const THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 }
}

// レーティングを計算
function getRating(value: number, thresholds: { good: number; poor: number }): 'good' | 'needs-improvement' | 'poor' {
  if (value <= thresholds.good) return 'good'
  if (value <= thresholds.poor) return 'needs-improvement'
  return 'poor'
}

// メトリクスの送信（本番環境では分析サービスに送信）
function sendToAnalytics(metric: PerformanceMetric) {
  if (import.meta.env.DEV) {
    console.log('Performance Metric:', metric)
  } else {
    // 本番環境では Google Analytics 4 や他の分析サービスに送信
    if (typeof gtag !== 'undefined') {
      gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: metric.name,
        value: Math.round(metric.value),
        custom_map: {
          rating: metric.rating
        }
      })
    }
  }
}

// Web Vitals の計測
export function initPerformanceMonitoring() {
  // 動的インポートでweb-vitalsを読み込み
  if (typeof window !== 'undefined') {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Cumulative Layout Shift
      getCLS((metric) => {
        const perfMetric: PerformanceMetric = {
          name: 'CLS',
          value: metric.value,
          rating: getRating(metric.value, THRESHOLDS.CLS),
          timestamp: Date.now()
        }
        sendToAnalytics(perfMetric)
      })

      // First Input Delay
      getFID((metric) => {
        const perfMetric: PerformanceMetric = {
          name: 'FID',
          value: metric.value,
          rating: getRating(metric.value, THRESHOLDS.FID),
          timestamp: Date.now()
        }
        sendToAnalytics(perfMetric)
      })

      // First Contentful Paint
      getFCP((metric) => {
        const perfMetric: PerformanceMetric = {
          name: 'FCP',
          value: metric.value,
          rating: getRating(metric.value, THRESHOLDS.FCP),
          timestamp: Date.now()
        }
        sendToAnalytics(perfMetric)
      })

      // Largest Contentful Paint
      getLCP((metric) => {
        const perfMetric: PerformanceMetric = {
          name: 'LCP',
          value: metric.value,
          rating: getRating(metric.value, THRESHOLDS.LCP),
          timestamp: Date.now()
        }
        sendToAnalytics(perfMetric)
      })

      // Time to First Byte
      getTTFB((metric) => {
        const perfMetric: PerformanceMetric = {
          name: 'TTFB',
          value: metric.value,
          rating: getRating(metric.value, THRESHOLDS.TTFB),
          timestamp: Date.now()
        }
        sendToAnalytics(perfMetric)
      })
    })
  }
}

// カスタムパフォーマンス計測
export function measureCustomMetric(name: string, startTime: number) {
  const endTime = performance.now()
  const duration = endTime - startTime

  const metric: PerformanceMetric = {
    name: `custom_${name}`,
    value: duration,
    rating: duration < 100 ? 'good' : duration < 300 ? 'needs-improvement' : 'poor',
    timestamp: Date.now()
  }

  sendToAnalytics(metric)
  return duration
}

// ページロード時間の計測
export function measurePageLoad() {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      // Navigation Timing API を使用
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

      if (navigation) {
        // DNS解決時間
        const dnsTime = navigation.domainLookupEnd - navigation.domainLookupStart
        // サーバー応答時間
        const responseTime = navigation.responseEnd - navigation.requestStart
        // DOM構築時間
        const domTime = navigation.domContentLoadedEventEnd - navigation.domLoading
        // 完全ロード時間
        const loadTime = navigation.loadEventEnd - navigation.navigationStart

        console.log('Page Performance:', {
          dns: `${Math.round(dnsTime)}ms`,
          response: `${Math.round(responseTime)}ms`,
          dom: `${Math.round(domTime)}ms`,
          load: `${Math.round(loadTime)}ms`
        })
      }
    })
  }
}

// リソースロード時間の計測
export function measureResourceLoading() {
  if (typeof window !== 'undefined') {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          const resource = entry as PerformanceResourceTiming

          // 特定のリソースタイプのみ追跡
          if (resource.initiatorType === 'img' ||
              resource.initiatorType === 'script' ||
              resource.initiatorType === 'link') {

            const loadTime = resource.responseEnd - resource.startTime

            if (loadTime > 1000) { // 1秒以上のリソースのみログ
              console.log(`Slow resource: ${resource.name} (${Math.round(loadTime)}ms)`)
            }
          }
        }
      })
    })

    observer.observe({ entryTypes: ['resource'] })
  }
}

// メモリ使用量の監視
export function monitorMemoryUsage() {
  if (typeof window !== 'undefined' && 'memory' in performance) {
    const memory = (performance as any).memory

    setInterval(() => {
      const used = memory.usedJSHeapSize / 1048576 // MB
      const total = memory.totalJSHeapSize / 1048576 // MB
      const limit = memory.jsHeapSizeLimit / 1048576 // MB

      if (used > 50) { // 50MB以上の場合は警告
        console.warn(`High memory usage: ${Math.round(used)}MB / ${Math.round(total)}MB (limit: ${Math.round(limit)}MB)`)
      }
    }, 30000) // 30秒ごとにチェック
  }
}