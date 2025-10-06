import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { AboutPage, AboutSection as AboutSectionType } from '@/lib/types/about'
import { urlForImage } from '@/lib/sanity.fetch'

interface AboutSectionProps {
  aboutData: AboutPage
}

export default function AboutSection({ aboutData }: AboutSectionProps) {
  console.log('[AboutSection] Received data:', {
    exists: !!aboutData,
    title: aboutData?.title,
    sectionsCount: aboutData?.sections?.length,
    tocCount: aboutData?.tableOfContents?.length
  })

  if (!aboutData) {
    console.log('[AboutSection] No data - returning null')
    return null
  }

  console.log('[AboutSection] Rendering with', aboutData.sections?.length, 'sections')

  return (
    <section id="about-section" className="w-full max-w-screen-xl mx-auto px-6 py-16">
      {/* Hero Section - Simple title and subtitle only */}
      <div className="relative mb-16 text-center">
        <h2 className="font-noto-serif text-3xl md:text-5xl font-medium text-[hsl(var(--text-primary))] mb-6">
          {aboutData.heroSection?.title || 'カフェキネシのページにようこそ'}
        </h2>
        <p className="text-lg text-[hsl(var(--text-secondary))] leading-relaxed max-w-3xl mx-auto">
          {aboutData.heroSection?.subtitle || 'だれでもどこでも簡単にできるキネシオロジーとアロマを使った健康法'}
        </p>
      </div>

      {/* Sections */}
      {aboutData.sections?.map((section: AboutSectionType, index: number) => (
        <div key={index} className="mb-16" id={section.id}>
          {/* Section Title */}
          <h3 className="font-noto-serif text-2xl md:text-3xl font-medium text-[hsl(var(--text-primary))] mb-8 text-center">
            {section.title}
          </h3>

          {/* Card Layout */}
          {section.layout === 'cards' ? (
            <div className="space-y-6">
              {section.cards?.map((card, cardIndex) => {
                // Parse background color for number circle
                let circleBgColor = 'hsl(var(--brand-teal))'
                let textColor = 'text-white'

                if (card.bgColor === 'custom' && card.customBgColor) {
                  circleBgColor = card.customBgColor
                  textColor = 'text-white'
                } else if (card.bgColor) {
                  // Extract HSL value from CSS class
                  const match = card.bgColor.match(/bg-\[hsl\(var\(--brand-(\w+)\)\)\]/)
                  if (match) {
                    circleBgColor = `hsl(var(--brand-${match[1]}))`
                    textColor = match[1] === 'beige' ? 'text-gray-800' : 'text-white'
                  }
                }

                return (
                  <div
                    key={cardIndex}
                    className="bg-white border border-[hsl(var(--border))] rounded-lg p-6 md:p-8 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start space-x-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1`}
                        style={{ backgroundColor: circleBgColor }}
                      >
                        <span className={`font-bold ${textColor}`}>
                          {card.number}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-noto-serif text-xl font-medium text-[hsl(var(--text-primary))] mb-3">
                          {card.title}
                        </h4>
                        <p className="text-[hsl(var(--text-secondary))] leading-relaxed whitespace-pre-line">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <>
              {/* Content with optional image - 2 columns if image, 1 column if no image */}
              {section.image?.asset ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-8">
                  {/* Image */}
                  <div className={`${section.layout === 'image-right' ? 'lg:order-2' : ''}`}>
                    <Image
                      src={urlForImage(section.image)?.width(700).height(500).url() || ''}
                      alt={section.image.alt || section.title}
                      width={700}
                      height={500}
                      className="w-full aspect-[4/3] object-cover rounded-lg"
                    />
                  </div>

                  {/* Text Content */}
                  <div className={`${section.layout === 'image-right' ? 'lg:order-1' : ''}`}>
                    <div className="space-y-4 text-[hsl(var(--text-secondary))] leading-relaxed text-base">
                      {section.content && <PortableText value={section.content} />}
                    </div>
                  </div>
                </div>
              ) : (
                /* Text only - 1 column centered */
                <div className="max-w-4xl mx-auto mb-8">
                  <div className="space-y-4 text-[hsl(var(--text-secondary))] leading-relaxed text-base">
                    {section.content && <PortableText value={section.content} />}
                  </div>
                </div>
              )}

              {/* Highlight Box */}
              {section.highlightBox?.show && section.highlightBox.content && (
                <div className="bg-[hsl(35,22%,95%)] rounded-lg p-8 md:p-10 mb-6">
                  <div className="max-w-3xl mx-auto text-center space-y-4 text-[hsl(var(--text-secondary))] leading-relaxed text-base">
                    <PortableText value={section.highlightBox.content} />
                  </div>
                </div>
              )}

              {/* Button Link */}
              {section.button?.show && section.button.text && section.button.link && (
                <div className="flex justify-center mt-6">
                  <Link
                    href={section.button.link}
                    className="inline-flex items-center gap-2 text-[hsl(var(--text-primary))] hover:text-[hsl(var(--text-secondary))] transition-colors"
                  >
                    <span className="text-base">{section.button.text}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </section>
  )
}
