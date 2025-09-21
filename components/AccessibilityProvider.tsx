'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { checkAccessibility } from '@/lib/accessibility'

interface AccessibilityContextType {
  highContrast: boolean
  reducedMotion: boolean
  fontSize: 'normal' | 'large' | 'extra-large'
  toggleHighContrast: () => void
  toggleReducedMotion: () => void
  setFontSize: (size: 'normal' | 'large' | 'extra-large') => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider')
  }
  return context
}

interface AccessibilityProviderProps {
  children: React.ReactNode
  enableDevAudit?: boolean
}

export function AccessibilityProvider({
  children,
  enableDevAudit = false,
}: AccessibilityProviderProps) {
  const [highContrast, setHighContrast] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'extra-large'>('normal')

  useEffect(() => {
    // ブラウザ環境でのみ実行
    if (typeof window === 'undefined') return

    // メディアクエリの監視
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)')

    setReducedMotion(prefersReducedMotion.matches)
    setHighContrast(prefersHighContrast.matches)

    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    const handleContrastChange = (e: MediaQueryListEvent) => setHighContrast(e.matches)

    // addEventListenerメソッドの存在確認
    if (prefersReducedMotion.addEventListener) {
      prefersReducedMotion.addEventListener('change', handleMotionChange)
    }
    if (prefersHighContrast.addEventListener) {
      prefersHighContrast.addEventListener('change', handleContrastChange)
    }

    // 開発環境でのアクセシビリティ監査
    if (enableDevAudit) {
      const intervalId = setInterval(() => {
        const issues = checkAccessibility()
        if (issues.length > 0) {
          console.group('🚨 アクセシビリティ問題を検出')
          issues.forEach(issue => {
            console.warn(issue.message, {
              element: issue.element,
              type: issue.type,
              severity: issue.severity
            })
          })
          console.groupEnd()
        }
      }, 5000)

      return () => {
        clearInterval(intervalId)
        if (prefersReducedMotion.removeEventListener) {
          prefersReducedMotion.removeEventListener('change', handleMotionChange)
        }
        if (prefersHighContrast.removeEventListener) {
          prefersHighContrast.removeEventListener('change', handleContrastChange)
        }
      }
    }

    return () => {
      if (prefersReducedMotion?.removeEventListener) {
        prefersReducedMotion.removeEventListener('change', handleMotionChange)
      }
      if (prefersHighContrast?.removeEventListener) {
        prefersHighContrast.removeEventListener('change', handleContrastChange)
      }
    }
  }, [enableDevAudit])

  useEffect(() => {
    // CSSクラスの適用
    if (highContrast) {
      document.body.classList.add('high-contrast')
    } else {
      document.body.classList.remove('high-contrast')
    }

    if (reducedMotion) {
      document.body.classList.add('reduced-motion')
    } else {
      document.body.classList.remove('reduced-motion')
    }

    // フォントサイズクラスの適用
    document.body.classList.remove('font-size-normal', 'font-size-large', 'font-size-extra-large')
    document.body.classList.add(`font-size-${fontSize}`)
  }, [highContrast, reducedMotion, fontSize])

  const toggleHighContrast = () => setHighContrast(prev => !prev)
  const toggleReducedMotion = () => setReducedMotion(prev => !prev)

  const contextValue: AccessibilityContextType = {
    highContrast,
    reducedMotion,
    fontSize,
    toggleHighContrast,
    toggleReducedMotion,
    setFontSize,
  }

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function SkipToContent() {
  return (
    <a href="#main-content" className="skip-to-content">
      メインコンテンツへスキップ
    </a>
  )
}