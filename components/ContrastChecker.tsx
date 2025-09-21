import { useEffect, useState } from 'react'
import { checkContrastCompliance } from '@/lib/accessibility'

interface ContrastCheckerProps {
  enabled?: boolean
}

export function ContrastChecker({ enabled = false }: ContrastCheckerProps) {
  const [violations, setViolations] = useState<Array<{
    element: HTMLElement
    foreground: string
    background: string
    ratio: number
    level: string
  }>>([])

  useEffect(() => {
    if (!enabled) return

    const checkContrasts = () => {
      const violations: Array<{
        element: HTMLElement
        foreground: string
        background: string
        ratio: number
        level: string
      }> = []

      // テキスト要素を取得
      const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, a, button, label, li')

      textElements.forEach(element => {
        const htmlElement = element as HTMLElement
        const computedStyle = window.getComputedStyle(htmlElement)

        const foreground = computedStyle.color
        const background = computedStyle.backgroundColor

        // RGBをHEXに変換
        const rgbToHex = (rgb: string): string => {
          const result = rgb.match(/\d+/g)
          if (!result) return '#000000'

          const [r, g, b] = result.map(x => parseInt(x).toString(16).padStart(2, '0'))
          return `#${r}${g}${b}`
        }

        let foregroundHex = '#000000'
        let backgroundHex = '#ffffff'

        try {
          if (foreground.startsWith('rgb')) {
            foregroundHex = rgbToHex(foreground)
          }

          if (background.startsWith('rgb')) {
            backgroundHex = rgbToHex(background)
          } else if (background === 'rgba(0, 0, 0, 0)' || background === 'transparent') {
            // 透明な背景の場合、親要素の背景色を探す
            let parent = htmlElement.parentElement
            while (parent) {
              const parentStyle = window.getComputedStyle(parent)
              const parentBg = parentStyle.backgroundColor
              if (parentBg !== 'transparent' && parentBg !== 'rgba(0, 0, 0, 0)') {
                backgroundHex = rgbToHex(parentBg)
                break
              }
              parent = parent.parentElement
            }
          }

          const fontSize = parseInt(computedStyle.fontSize)
          const fontWeight = computedStyle.fontWeight
          const isBold = fontWeight === 'bold' || parseInt(fontWeight) >= 700

          const compliance = checkContrastCompliance(foregroundHex, backgroundHex, fontSize, isBold)

          if (!compliance.passAA) {
            violations.push({
              element: htmlElement,
              foreground: foregroundHex,
              background: backgroundHex,
              ratio: compliance.ratio,
              level: compliance.level
            })
          }
        } catch (error) {
          // 色の変換でエラーが発生した場合はスキップ
        }
      })

      setViolations(violations)

      if (violations.length > 0) {
        console.group('🎨 Color Contrast Violations:')
        violations.forEach(violation => {
          console.warn(
            `Contrast ratio: ${violation.ratio.toFixed(2)}:1 (${violation.level})`,
            violation.element,
            `Colors: ${violation.foreground} on ${violation.background}`
          )
        })
        console.groupEnd()
      }
    }

    // 初期チェック
    setTimeout(checkContrasts, 1000)

    // DOM変更時の再チェック
    const observer = new MutationObserver(() => {
      setTimeout(checkContrasts, 500)
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    })

    return () => {
      observer.disconnect()
    }
  }, [enabled])

  if (!enabled || violations.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-red-600 text-white p-4 rounded-lg shadow-lg max-w-sm">
      <h3 className="font-bold text-sm mb-2">
        コントラスト違反: {violations.length}件
      </h3>
      <button
        onClick={() => {
          violations.forEach(v => {
            v.element.style.outline = '2px solid red'
            setTimeout(() => {
              v.element.style.outline = ''
            }, 3000)
          })
        }}
        className="text-xs bg-red-700 px-2 py-1 rounded hover:bg-red-800"
      >
        要素をハイライト
      </button>
    </div>
  )
}

// 開発環境でのみ使用するコントラストチェッカー
export function DevContrastChecker() {
  if (import.meta.env.PROD) return null

  return <ContrastChecker enabled={true} />
}