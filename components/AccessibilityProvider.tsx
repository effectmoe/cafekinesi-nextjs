'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { FocusManager, LiveRegion, auditAccessibility } from '@/lib/accessibility'

interface AccessibilityContextType {
  focusManager: FocusManager
  liveRegion: LiveRegion
  announceToScreenReader: (message: string) => void
  saveFocus: () => void
  restoreFocus: () => void
  isHighContrastMode: boolean
  prefersReducedMotion: boolean
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null)

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider')
  }
  return context
}

interface AccessibilityProviderProps {
  children: ReactNode
  enableDevAudit?: boolean
}

export function AccessibilityProvider({
  children,
  enableDevAudit = false
}: AccessibilityProviderProps) {
  const [focusManager] = useState(() => new FocusManager())
  const [liveRegion] = useState(() => new LiveRegion('polite'))
  const [isHighContrastMode, setIsHighContrastMode] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // ユーザーの設定を検出
    const checkHighContrast = () => {
      const highContrastMedia = window.matchMedia('(prefers-contrast: high)')
      setIsHighContrastMode(highContrastMedia.matches)
    }

    const checkReducedMotion = () => {
      const reducedMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)')
      setPrefersReducedMotion(reducedMotionMedia.matches)
    }

    checkHighContrast()
    checkReducedMotion()

    // メディアクエリの変更を監視
    const highContrastMedia = window.matchMedia('(prefers-contrast: high)')
    const reducedMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)')

    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      setIsHighContrastMode(e.matches)
    }

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    highContrastMedia.addEventListener('change', handleHighContrastChange)
    reducedMotionMedia.addEventListener('change', handleReducedMotionChange)

    // 開発環境でのアクセシビリティ監査
    if (enableDevAudit && process.env.NODE_ENV === 'development') {
      const runAudit = () => {
        const issues = auditAccessibility()
        if (issues.length > 0) {
          console.group('🔍 Accessibility Issues Found:')
          issues.forEach(issue => {
            const level = issue.severity === 'error' ? 'error' : 'warn'
            console[level](
              `${issue.wcagRule}: ${issue.issue}`,
              issue.element
            )
          })
          console.groupEnd()
        } else {
          console.log('✅ No accessibility issues found')
        }
      }

      // DOM変更を監視してAuditを実行
      const observer = new MutationObserver(() => {
        setTimeout(runAudit, 1000) // 1秒遅延してから実行
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true
      })

      return () => {
        observer.disconnect()
        highContrastMedia.removeEventListener('change', handleHighContrastChange)
        reducedMotionMedia.removeEventListener('change', handleReducedMotionChange)
      }
    }

    return () => {
      highContrastMedia.removeEventListener('change', handleHighContrastChange)
      reducedMotionMedia.removeEventListener('change', handleReducedMotionChange)
    }
  }, [enableDevAudit])

  // クリーンアップ
  useEffect(() => {
    return () => {
      liveRegion.destroy()
    }
  }, [liveRegion])

  const announceToScreenReader = (message: string) => {
    liveRegion.announce(message)
  }

  const saveFocus = () => {
    focusManager.saveFocus()
  }

  const restoreFocus = () => {
    focusManager.restoreFocus()
  }

  const contextValue: AccessibilityContextType = {
    focusManager,
    liveRegion,
    announceToScreenReader,
    saveFocus,
    restoreFocus,
    isHighContrastMode,
    prefersReducedMotion
  }

  return (
    <AccessibilityContext.Provider value={contextValue}>
      <div
        className={`accessibility-root ${isHighContrastMode ? 'high-contrast' : ''} ${
          prefersReducedMotion ? 'reduced-motion' : ''
        }`}
      >
        {children}
      </div>
    </AccessibilityContext.Provider>
  )
}

// スキップリンク用コンポーネント
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="skip-to-content sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded"
    >
      メインコンテンツにスキップ
    </a>
  )
}

// アクセシブルなボタンコンポーネント
interface AccessibleButtonProps {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  ariaLabel?: string
  ariaDescribedBy?: string
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function AccessibleButton({
  children,
  onClick,
  disabled = false,
  ariaLabel,
  ariaDescribedBy,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: AccessibleButtonProps) {
  const { announceToScreenReader } = useAccessibility()

  const handleClick = () => {
    if (disabled) return
    onClick?.()

    // ボタンが押されたことをスクリーンリーダーに通知
    if (ariaLabel) {
      announceToScreenReader(`${ariaLabel}が実行されました`)
    }
  }

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors'

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-gray-300',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-gray-300'
  }

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <button
      type="button"
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      {...props}
    >
      {children}
    </button>
  )
}