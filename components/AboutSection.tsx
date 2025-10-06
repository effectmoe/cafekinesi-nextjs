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

      {/* Sections */}
      {aboutData.sections?.map((section: AboutSectionType, index: number) => (
        <div key={index} className="mb-16" id={section.id}>
          <h3 className="font-noto-serif text-3xl font-medium text-[hsl(var(--text-primary))] mb-8 text-center">
            {section.title}
          </h3>

          {/* Layout: Image Left */}
          {section.layout === 'image-left' && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center mb-8">
                <div className="lg:col-span-2">
                  {section.image?.asset && (
                    <Image
                      src={urlForImage(section.image)?.width(600).height(450).url() || ''}
                      alt={section.image.alt || section.title}
                      width={600}
                      height={450}
                      className="w-full aspect-[4/3] object-cover rounded-lg"
                    />
                  )}
                </div>
                <div className="lg:col-span-3">
                  <div className="space-y-4 text-[hsl(var(--text-secondary))] leading-relaxed prose prose-lg max-w-none">
                    {section.content && <PortableText value={section.content} />}
                  </div>
                </div>
              </div>

              {section.highlightBox?.show && section.highlightBox.content && (
                <div className="bg-gradient-to-r from-[hsl(var(--brand-beige))] to-white rounded-lg p-8 md:p-10">
                  <div className="max-w-3xl mx-auto text-center space-y-4 prose prose-lg max-w-none">
                    <PortableText value={section.highlightBox.content} />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Layout: Image Right */}
          {section.layout === 'image-right' && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
              <div className="lg:col-span-3">
                <div className="space-y-4 text-[hsl(var(--text-secondary))] leading-relaxed prose prose-lg max-w-none">
                  {section.content && <PortableText value={section.content} />}
                </div>
              </div>
              <div className="lg:col-span-2">
                {section.image?.asset && (
                  <Image
                    src={urlForImage(section.image)?.width(600).height(450).url() || ''}
                    alt={section.image.alt || section.title}
                    width={600}
                    height={450}
                    className="w-full aspect-[4/3] object-cover rounded-lg"
                  />
                )}
              </div>
            </div>
          )}

          {/* Layout: Text Only */}
          {section.layout === 'text-only' && (
            <div className="max-w-4xl mx-auto">
              <div className="space-y-4 text-[hsl(var(--text-secondary))] leading-relaxed prose prose-lg max-w-none">
                {section.content && <PortableText value={section.content} />}
              </div>
            </div>
          )}

          {/* Layout: Cards */}
          {section.layout === 'cards' && section.cards && (
            <div className="space-y-6">
              {section.cards.map((card, cardIndex) => {
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
          )}
        </div>
      ))}
    </section>
  )
}
