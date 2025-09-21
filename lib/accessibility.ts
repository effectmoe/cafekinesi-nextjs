// WCAG 2.2 アクセシビリティユーティリティ

// カラーコントラスト比の計算
export function calculateContrastRatio(color1: string, color2: string): number {
  const getLuminance = (color: string): number => {
    // Hex色をRGB値に変換
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16) / 255
    const g = parseInt(hex.substr(2, 2), 16) / 255
    const b = parseInt(hex.substr(4, 2), 16) / 255

    // 相対輝度の計算
    const toLinear = (value: number) =>
      value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4)

    const rLinear = toLinear(r)
    const gLinear = toLinear(g)
    const bLinear = toLinear(b)

    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear
  }

  const luminance1 = getLuminance(color1)
  const luminance2 = getLuminance(color2)

  const lighter = Math.max(luminance1, luminance2)
  const darker = Math.min(luminance1, luminance2)

  return (lighter + 0.05) / (darker + 0.05)
}

// WCAG AA/AAA準拠チェック
export function checkContrastCompliance(
  foreground: string,
  background: string,
  fontSize?: number,
  isBold?: boolean
): {
  ratio: number
  passAA: boolean
  passAAA: boolean
  level: 'AA' | 'AAA' | 'fail'
} {
  const ratio = calculateContrastRatio(foreground, background)

  // 大きいテキスト（18pt以上または14pt以上の太字）は基準が緩い
  const isLargeText = (fontSize && fontSize >= 18) || (fontSize && fontSize >= 14 && isBold)

  const aaThreshold = isLargeText ? 3 : 4.5
  const aaaThreshold = isLargeText ? 4.5 : 7

  const passAA = ratio >= aaThreshold
  const passAAA = ratio >= aaaThreshold

  return {
    ratio,
    passAA,
    passAAA,
    level: passAAA ? 'AAA' : passAA ? 'AA' : 'fail'
  }
}

// フォーカス管理
export class FocusManager {
  private focusStack: HTMLElement[] = []

  // フォーカストラップ（モーダルなどで使用）
  trapFocus(container: HTMLElement) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)
    firstElement.focus()

    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }

  // フォーカスの保存と復元
  saveFocus() {
    const activeElement = document.activeElement as HTMLElement
    if (activeElement) {
      this.focusStack.push(activeElement)
    }
  }

  restoreFocus() {
    const lastFocused = this.focusStack.pop()
    if (lastFocused && document.contains(lastFocused)) {
      lastFocused.focus()
    }
  }
}

// スクリーンリーダー用のライブリージョン
export class LiveRegion {
  private element: HTMLElement

  constructor(ariaLive: 'polite' | 'assertive' = 'polite') {
    this.element = document.createElement('div')
    this.element.setAttribute('aria-live', ariaLive)
    this.element.setAttribute('aria-atomic', 'true')
    this.element.style.position = 'absolute'
    this.element.style.left = '-10000px'
    this.element.style.width = '1px'
    this.element.style.height = '1px'
    this.element.style.overflow = 'hidden'

    document.body.appendChild(this.element)
  }

  announce(message: string) {
    this.element.textContent = message

    // テキストをクリアして再度アナウンスできるようにする
    setTimeout(() => {
      this.element.textContent = ''
    }, 1000)
  }

  destroy() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element)
    }
  }
}

// キーボードナビゲーション支援
export function addKeyboardNavigation(element: HTMLElement) {
  const handleKeyDown = (event: KeyboardEvent) => {
    // Escapeキーでの閉じる動作
    if (event.key === 'Escape') {
      const closeButton = element.querySelector('[data-close]') as HTMLElement
      if (closeButton) {
        closeButton.click()
      }
    }

    // Enterキーでのボタン実行
    if (event.key === 'Enter' && event.target instanceof HTMLElement) {
      if (event.target.role === 'button' || event.target.tagName === 'BUTTON') {
        event.target.click()
      }
    }

    // 矢印キーでのナビゲーション（リストなど）
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const focusableItems = element.querySelectorAll('[role="menuitem"], [role="option"]') as NodeListOf<HTMLElement>
      if (focusableItems.length === 0) return

      const currentIndex = Array.from(focusableItems).indexOf(event.target as HTMLElement)
      if (currentIndex === -1) return

      event.preventDefault()

      let nextIndex
      if (event.key === 'ArrowDown') {
        nextIndex = (currentIndex + 1) % focusableItems.length
      } else {
        nextIndex = currentIndex === 0 ? focusableItems.length - 1 : currentIndex - 1
      }

      focusableItems[nextIndex].focus()
    }
  }

  element.addEventListener('keydown', handleKeyDown)

  return () => {
    element.removeEventListener('keydown', handleKeyDown)
  }
}

// ARIA属性の動的管理
export function updateAriaAttributes(element: HTMLElement, attributes: Record<string, string | boolean | null>) {
  Object.entries(attributes).forEach(([key, value]) => {
    const ariaKey = key.startsWith('aria-') ? key : `aria-${key}`

    if (value === null || value === false) {
      element.removeAttribute(ariaKey)
    } else {
      element.setAttribute(ariaKey, String(value))
    }
  })
}

// スクリーンリーダー検出
export function isScreenReaderActive(): boolean {
  // 一般的なスクリーンリーダーの検出
  return !!(
    window.navigator.userAgent.match(/NVDA|JAWS|VoiceOver|TalkBack/) ||
    window.speechSynthesis?.speaking ||
    window.navigator.userAgent.includes('Accessibility')
  )
}

// アクセシビリティエラーの自動検出
export function auditAccessibility(container: HTMLElement = document.body): Array<{
  element: HTMLElement
  issue: string
  severity: 'error' | 'warning'
  wcagRule: string
}> {
  const issues: Array<{
    element: HTMLElement
    issue: string
    severity: 'error' | 'warning'
    wcagRule: string
  }> = []

  // 画像のalt属性チェック
  const images = container.querySelectorAll('img')
  images.forEach(img => {
    if (!img.getAttribute('alt')) {
      issues.push({
        element: img,
        issue: '画像にalt属性がありません',
        severity: 'error',
        wcagRule: '1.1.1'
      })
    }
  })

  // フォームラベルのチェック
  const inputs = container.querySelectorAll('input, select, textarea')
  inputs.forEach(input => {
    const id = input.getAttribute('id')
    const ariaLabel = input.getAttribute('aria-label')
    const ariaLabelledby = input.getAttribute('aria-labelledby')

    if (id) {
      const label = container.querySelector(`label[for="${id}"]`)
      if (!label && !ariaLabel && !ariaLabelledby) {
        issues.push({
          element: input as HTMLElement,
          issue: 'フォーム要素にラベルがありません',
          severity: 'error',
          wcagRule: '3.3.2'
        })
      }
    }
  })

  // 見出しの階層チェック
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
  let lastLevel = 0
  headings.forEach(heading => {
    const level = parseInt(heading.tagName.substring(1))
    if (level > lastLevel + 1) {
      issues.push({
        element: heading as HTMLElement,
        issue: `見出しレベルが飛んでいます (h${lastLevel} → h${level})`,
        severity: 'warning',
        wcagRule: '1.3.1'
      })
    }
    lastLevel = level
  })

  return issues
}

// checkAccessibility関数の追加（AccessibilityProviderで使用）
export function checkAccessibility(): Array<{
  element: HTMLElement
  message: string
  type: string
  severity: 'error' | 'warning'
}> {
  const auditResults = auditAccessibility()

  return auditResults.map(result => ({
    element: result.element,
    message: `${result.issue} (WCAG ${result.wcagRule})`,
    type: 'accessibility',
    severity: result.severity
  }))
}