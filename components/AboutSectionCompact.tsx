'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { AboutPage, AboutSection as AboutSectionType } from '@/lib/types/about'
import { urlForImage } from '@/lib/sanity.fetch'

interface AboutSectionCompactProps {
  aboutData: AboutPage
}

// 淡いカラーパレット（サイトのトーンに合わせた自然な色合い）
const cardColors = [
  'bg-[#f8f6f3]', // warm beige (カテゴリカードと同系色)
  'bg-[#f5f7f6]', // soft sage
  'bg-[#f6f5f8]', // lavender mist
  'bg-[#f7f6f4]', // cream
  'bg-[#f4f7f7]', // pale teal
  'bg-[#f8f7f5]', // ivory
  'bg-[#f5f6f8]', // cool gray
  'bg-[#f7f8f6]', // mint cream
  'bg-[#f8f5f6]', // blush
  'bg-[#f6f8f7]', // seafoam
]

export default function AboutSectionCompact({ aboutData }: AboutSectionCompactProps) {
  const [expandedCard, setExpandedCard] = useState<number | null>(null)

  const toggleCard = (index: number) => {
    setExpandedCard(prev => prev === index ? null : index)
  }

  const closeModal = () => {
    setExpandedCard(null)
  }

  if (!aboutData) {
    return null
  }

  return (
    <section id="about-section" className="w-full max-w-screen-xl mx-auto px-6 pt-12 pb-16">
      {/* Hero Section - コンパクト化 */}
      <div className="relative mb-10 text-center">
        <h2 className="font-noto-serif text-xl md:text-3xl font-medium text-[hsl(var(--text-primary))] mb-3">
          {aboutData.heroSection?.title || 'カフェキネシへようこそ'}
        </h2>
        <p className="text-sm md:text-base text-[hsl(var(--text-secondary))] leading-relaxed max-w-2xl mx-auto">
          {aboutData.heroSection?.subtitle || 'だれでもどこでも簡単にできるキネシオロジーとアロマを使った健康法'}
        </p>
      </div>

      {/* 3カラムグリッド */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aboutData.sections?.map((section: AboutSectionType, index: number) => {
          // Sanityで設定されたカード背景色を優先、なければデフォルトパレットを使用
          const getCardBgColor = () => {
            if (section.cardBgColor === 'custom' && section.customCardBgColor) {
              return section.customCardBgColor
            }
            if (section.cardBgColor && section.cardBgColor !== 'auto') {
              return section.cardBgColor
            }
            // デフォルト：パレットから順番に適用
            return null
          }

          const customBgColor = getCardBgColor()
          const bgColorClass = customBgColor ? '' : cardColors[index % cardColors.length]

          return (
            <button
              key={index}
              onClick={() => toggleCard(index)}
              className={`${bgColorClass} rounded-lg p-6 text-left hover:shadow-lg transition-all duration-300 group border border-transparent hover:border-[hsl(var(--border))]`}
              style={customBgColor ? { backgroundColor: customBgColor } : undefined}
            >
              {/* カードアイコンまたは番号 */}
              <div className="w-10 h-10 rounded-full bg-white/70 flex items-center justify-center mb-4 group-hover:bg-white transition-colors">
                <span className="font-noto-serif text-lg font-medium text-[hsl(var(--text-primary))]">
                  {index + 1}
                </span>
              </div>

              {/* タイトル */}
              <h3 className="font-noto-serif text-base md:text-lg font-medium text-[hsl(var(--text-primary))] mb-2 group-hover:text-[hsl(var(--brand-purple))] transition-colors">
                {section.title}
              </h3>

              {/* 簡易説明（最初の段落を抜粋） */}
              <p className="text-xs md:text-sm text-[hsl(var(--text-secondary))] line-clamp-2 leading-relaxed">
                {getFirstParagraph(section)}
              </p>

              {/* 展開アイコン */}
              <div className="mt-4 flex items-center text-xs text-[hsl(var(--text-secondary))] group-hover:text-[hsl(var(--text-primary))] transition-colors">
                <span>詳しく見る</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1 group-hover:translate-x-1 transition-transform"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </button>
          )
        })}
      </div>

      {/* 展開モーダル */}
      {expandedCard !== null && aboutData.sections && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* モーダルヘッダー */}
            {(() => {
              const currentSection = aboutData.sections[expandedCard]
              const getModalBgColor = () => {
                if (currentSection.cardBgColor === 'custom' && currentSection.customCardBgColor) {
                  return { style: { backgroundColor: currentSection.customCardBgColor }, className: '' }
                }
                if (currentSection.cardBgColor && currentSection.cardBgColor !== 'auto') {
                  return { style: { backgroundColor: currentSection.cardBgColor }, className: '' }
                }
                return { style: undefined, className: cardColors[expandedCard % cardColors.length] }
              }
              const modalBg = getModalBgColor()
              return (
                <div
                  className={`sticky top-0 ${modalBg.className} px-6 py-4 border-b border-[hsl(var(--border))] flex items-center justify-between`}
                  style={modalBg.style}
                >
              <h3 className="font-noto-serif text-xl font-medium text-[hsl(var(--text-primary))]">
                {aboutData.sections[expandedCard].title}
              </h3>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-white/70 hover:bg-white flex items-center justify-center transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
              )
            })()}

            {/* モーダルコンテンツ */}
            <div className="p-6">
              <ExpandedSectionContent section={aboutData.sections[expandedCard]} />
            </div>

            {/* モーダルフッター（ナビゲーション） */}
            <div className="sticky bottom-0 bg-white border-t border-[hsl(var(--border))] px-6 py-3 flex items-center justify-between">
              <button
                onClick={() => setExpandedCard(prev => prev !== null && prev > 0 ? prev - 1 : (aboutData.sections?.length || 1) - 1)}
                className="text-sm text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] flex items-center gap-1 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
                前へ
              </button>
              <span className="text-xs text-[hsl(var(--text-secondary))]">
                {expandedCard + 1} / {aboutData.sections?.length}
              </span>
              <button
                onClick={() => setExpandedCard(prev => prev !== null && prev < (aboutData.sections?.length || 1) - 1 ? prev + 1 : 0)}
                className="text-sm text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] flex items-center gap-1 transition-colors"
              >
                次へ
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

// セクションの最初の段落を取得するヘルパー関数
function getFirstParagraph(section: AboutSectionType): string {
  // Link cards の場合
  if (section.layout === 'link-cards' && section.linkCards?.length) {
    return section.linkCards[0]?.description || section.linkCards[0]?.title || ''
  }
  // Cards の場合
  if (section.layout === 'cards' && section.cards?.length) {
    return section.cards[0]?.description || section.cards[0]?.title || ''
  }
  // PortableText content の場合
  if (section.content && Array.isArray(section.content)) {
    const firstBlock = section.content.find((block: any) => block._type === 'block' && block.children)
    if (firstBlock && firstBlock.children) {
      return firstBlock.children.map((child: any) => child.text || '').join('')
    }
  }
  return ''
}

// 展開されたセクションのコンテンツコンポーネント
function ExpandedSectionContent({ section }: { section: AboutSectionType }) {
  // Link Cards Layout
  if (section.layout === 'link-cards') {
    return (
      <div className={`grid grid-cols-1 ${
        section.linkCards && section.linkCards.length === 1
          ? 'sm:grid-cols-1 max-w-sm mx-auto'
          : section.linkCards && section.linkCards.length === 2
          ? 'sm:grid-cols-2'
          : 'sm:grid-cols-2'
      } gap-4`}>
        {section.linkCards?.map((card, cardIndex) => {
          const bgColorMap: Record<string, string> = {
            'white': 'bg-white',
            'teal': 'bg-[hsl(var(--brand-teal))]',
            'purple': 'bg-[hsl(var(--brand-purple))]',
            'blue-gray': 'bg-[hsl(var(--brand-blue-gray))]',
            'beige': 'bg-[hsl(var(--brand-beige))]'
          }
          const bgColor = bgColorMap[card.bgColor || 'white'] || 'bg-white'
          const isExternal = card.link?.startsWith('http')

          return (
            <Link
              key={cardIndex}
              href={card.link}
              target={isExternal ? '_blank' : '_self'}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className={`${bgColor} border border-[hsl(var(--border))] rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group`}
            >
              {card.image?.asset && (
                <div className="relative w-full aspect-video overflow-hidden">
                  <Image
                    src={urlForImage(card.image)?.width(400).height(250).url() || ''}
                    alt={card.image.alt || card.title}
                    width={400}
                    height={250}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-4">
                <h4 className="font-noto-serif text-base font-medium text-[hsl(var(--text-primary))] mb-1 group-hover:text-[hsl(var(--brand-purple))] transition-colors">
                  {card.title}
                </h4>
                {card.description && (
                  <p className="text-[hsl(var(--text-secondary))] text-sm leading-relaxed">
                    {card.description}
                  </p>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    )
  }

  // Cards Layout
  if (section.layout === 'cards') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {section.cards?.map((card, cardIndex) => {
          let circleBgColor = 'hsl(var(--brand-teal))'
          let textColor = 'text-white'

          if (card.bgColor === 'custom' && card.customBgColor) {
            circleBgColor = card.customBgColor
          } else if (card.bgColor) {
            const match = card.bgColor.match(/bg-\[hsl\(var\(--brand-(\w+)\)\)\]/)
            if (match) {
              circleBgColor = `hsl(var(--brand-${match[1]}))`
              textColor = match[1] === 'beige' ? 'text-gray-800' : 'text-white'
            }
          }

          return (
            <div
              key={cardIndex}
              className="bg-[#f8f6f3] border border-[hsl(var(--border))] rounded-lg p-4"
            >
              <div className="flex items-start space-x-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: circleBgColor }}
                >
                  <span className={`text-sm font-bold ${textColor}`}>
                    {card.number}
                  </span>
                </div>
                <div>
                  <h4 className="font-noto-serif text-sm font-medium text-[hsl(var(--text-primary))] mb-1">
                    {card.title}
                  </h4>
                  <p className="text-[hsl(var(--text-secondary))] text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Default text content layout
  return (
    <>
      {section.image?.asset ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className={`${section.layout === 'image-right' ? 'md:order-2' : ''}`}>
            <Image
              src={urlForImage(section.image)?.width(500).height(375).url() || ''}
              alt={section.image.alt || section.title}
              width={500}
              height={375}
              className="w-full aspect-[4/3] object-cover rounded-lg"
            />
          </div>
          <div className={`${section.layout === 'image-right' ? 'md:order-1' : ''}`}>
            <div className="space-y-3 text-[hsl(var(--text-secondary))] leading-relaxed text-sm">
              {section.content && <PortableText value={section.content} />}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3 text-[hsl(var(--text-secondary))] leading-relaxed text-sm">
          {section.content && <PortableText value={section.content} />}
        </div>
      )}

      {/* Button Link */}
      {section.button?.show && section.button.text && section.button.link && (
        <div className="flex justify-center mt-6">
          {(() => {
            // ボタン背景色の取得
            const getButtonBgStyle = () => {
              const bgColor = section.button?.bgColor
              if (bgColor === 'custom' && section.button?.customBgColor) {
                return { backgroundColor: section.button.customBgColor }
              }
              const bgColorMap: Record<string, string> = {
                'stone': '#e7e5e4',
                'dark': '#374151',
                'primary': '#22c55e',
                'secondary': '#3b82f6',
                'accent': '#f97316',
                'teal': 'hsl(var(--brand-teal))',
                'purple': 'hsl(var(--brand-purple))'
              }
              if (bgColor && bgColorMap[bgColor]) {
                return { backgroundColor: bgColorMap[bgColor] }
              }
              return { backgroundColor: '#e7e5e4' } // デフォルト: stone
            }

            // ボタンテキスト色の取得
            const getButtonTextStyle = () => {
              const textColor = section.button?.textColor
              if (textColor === 'custom' && section.button?.customTextColor) {
                return { color: section.button.customTextColor }
              }
              const textColorMap: Record<string, string> = {
                'brown': 'hsl(35,45%,45%)',
                'white': '#ffffff',
                'black': '#000000'
              }
              if (textColor && textColorMap[textColor]) {
                return { color: textColorMap[textColor] }
              }
              return { color: 'hsl(35,45%,45%)' } // デフォルト: brown
            }

            const bgStyle = getButtonBgStyle()
            const textStyle = getButtonTextStyle()

            return (
              <Link
                href={section.button.link}
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 hover:opacity-90 hover:shadow-md transition-all duration-200 rounded-full text-sm"
                style={{ ...bgStyle, ...textStyle }}
              >
                <span className="font-medium">{section.button.text}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:translate-x-1 transition-transform"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            )
          })()}
        </div>
      )}
    </>
  )
}
