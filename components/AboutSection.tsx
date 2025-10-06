import Image from 'next/image'
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

      {/* Sections - Unified block design with alternating backgrounds */}
      {aboutData.sections?.map((section: AboutSectionType, index: number) => {
        // Alternating subtle background colors
        const isEven = index % 2 === 0
        const bgColor = isEven ? 'bg-white' : 'bg-[hsl(35,22%,97%)]' // Very subtle beige for alternating sections

        return (
          <div
            key={index}
            className={`${bgColor} -mx-6 px-6 py-12 mb-8 rounded-lg transition-colors`}
            id={section.id}
          >
            <div className="max-w-screen-xl mx-auto">
              {/* Section Title */}
              <h3 className="font-noto-serif text-2xl md:text-3xl font-medium text-[hsl(var(--text-primary))] mb-8 text-center">
                {section.title}
              </h3>

              {/* Unified Content Block - Image and Text Together */}
              {section.layout === 'cards' ? (
                // Special layout for cards (e.g., courses section)
                <div className="space-y-6">
                  {section.cards?.map((card, cardIndex) => {
                    const bgColorClass = card.bgColor === 'custom' && card.customBgColor
                      ? `bg-[${card.customBgColor}]`
                      : card.bgColor

                    return (
                      <div
                        key={cardIndex}
                        className="bg-white border border-[hsl(var(--border))] rounded-lg p-6 md:p-8 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`w-10 h-10 ${bgColorClass} rounded-full flex items-center justify-center flex-shrink-0 mt-1`}>
                            <span className={`font-bold ${bgColorClass.includes('beige') ? 'text-[hsl(var(--text-primary))]' : 'text-white'}`}>
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
                // Standard layout - Image and text in one unified block
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                  {/* Image */}
                  {section.image?.asset && (
                    <div className={`${section.layout === 'image-right' ? 'lg:order-2' : ''}`}>
                      <Image
                        src={urlForImage(section.image)?.width(700).height(500).url() || ''}
                        alt={section.image.alt || section.title}
                        width={700}
                        height={500}
                        className="w-full aspect-[4/3] object-cover rounded-lg shadow-sm"
                      />
                    </div>
                  )}

                  {/* Text Content */}
                  <div className={`${section.layout === 'image-right' ? 'lg:order-1' : ''} ${!section.image?.asset ? 'lg:col-span-2 max-w-4xl mx-auto' : ''}`}>
                    <div className="space-y-4 text-[hsl(var(--text-secondary))] leading-relaxed prose prose-lg max-w-none">
                      {section.content && <PortableText value={section.content} />}
                    </div>
                  </div>
                </div>
              )}

              {/* Highlight Box */}
              {section.highlightBox?.show && section.highlightBox.content && (
                <div className="mt-8 bg-gradient-to-r from-[hsl(var(--brand-beige))] to-white rounded-lg p-8 md:p-10 shadow-sm">
                  <div className="max-w-3xl mx-auto text-center space-y-4 prose prose-lg max-w-none">
                    <PortableText value={section.highlightBox.content} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </section>
  )
}
