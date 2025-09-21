import { useEffect } from 'react'

interface PerformanceOptimzerProps {
  children: React.ReactNode
}

export function PerformanceOptimizer({ children }: PerformanceOptimzerProps) {
  useEffect(() => {
    // Critical Resource Hints
    const addResourceHints = () => {
      const head = document.head

      // Preload critical resources
      const preloadFont = document.createElement('link')
      preloadFont.rel = 'preload'
      preloadFont.href = 'https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;500;600;700&display=swap'
      preloadFont.as = 'style'
      preloadFont.crossOrigin = 'anonymous'
      head.appendChild(preloadFont)

      // Prefetch next likely resources
      const prefetchSanity = document.createElement('link')
      prefetchSanity.rel = 'prefetch'
      prefetchSanity.href = 'https://cdn.sanity.io'
      head.appendChild(prefetchSanity)
    }

    // Intersection Observer for lazy loading
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement

          // Lazy load images
          if (element.dataset.src) {
            element.setAttribute('src', element.dataset.src)
            element.removeAttribute('data-src')
          }

          // Lazy load background images
          if (element.dataset.bg) {
            element.style.backgroundImage = `url(${element.dataset.bg})`
            element.removeAttribute('data-bg')
          }

          observer.unobserve(element)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '50px 0px',
      threshold: 0.01
    })

    // Observe all lazy load candidates
    const lazyElements = document.querySelectorAll('[data-src], [data-bg]')
    lazyElements.forEach((el) => observer.observe(el))

    // Performance monitoring
    const reportWebVitals = () => {
      if ('web-vitals' in window) {
        // Web Vitals monitoring would go here
        // import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        //   getCLS(console.log)
        //   getFID(console.log)
        //   getFCP(console.log)
        //   getLCP(console.log)
        //   getTTFB(console.log)
        // })
      }
    }

    // Priority hints for important content
    const optimizeImageLoading = () => {
      const heroImages = document.querySelectorAll('.hero img, .above-fold img')
      heroImages.forEach((img) => {
        if (img instanceof HTMLImageElement) {
          img.loading = 'eager'
          img.fetchPriority = 'high'
        }
      })

      const belowFoldImages = document.querySelectorAll('.below-fold img')
      belowFoldImages.forEach((img) => {
        if (img instanceof HTMLImageElement) {
          img.loading = 'lazy'
          img.fetchPriority = 'low'
        }
      })
    }

    // Execute optimizations
    addResourceHints()
    reportWebVitals()

    // Optimize images after DOM is ready
    const timeoutId = setTimeout(optimizeImageLoading, 100)

    return () => {
      observer.disconnect()
      clearTimeout(timeoutId)
    }
  }, [])

  return <>{children}</>
}

// Critical CSS injection utility
export const injectCriticalCSS = () => {
  const criticalCSS = `
    /* Critical above-the-fold styles */
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
    .hero { min-height: 100vh; }
    .loading-spinner {
      width: 2rem; height: 2rem;
      border: 2px solid #f3f3f3;
      border-top: 2px solid #333;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

    /* Layout shift prevention */
    img { max-width: 100%; height: auto; }
    .aspect-ratio-16-9 { aspect-ratio: 16 / 9; }
    .aspect-ratio-4-3 { aspect-ratio: 4 / 3; }
    .aspect-ratio-1-1 { aspect-ratio: 1 / 1; }
  `

  const style = document.createElement('style')
  style.textContent = criticalCSS
  document.head.appendChild(style)
}