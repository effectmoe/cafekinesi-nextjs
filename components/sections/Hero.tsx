import { SanityImage } from '@/components/SanityImage'
import type { HeroSection } from '@/types/sanity.types'

interface HeroProps extends HeroSection {}

export function Hero({
  title,
  subtitle,
  description,
  backgroundImage,
  overlayOpacity = 0.5,
  textColor = 'white',
  buttons = [],
  alignment = 'center'
}: HeroProps) {
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  }

  const textColorClasses = {
    white: 'text-white',
    black: 'text-black',
    primary: 'text-[hsl(var(--text-primary))]'
  }

  const buttonStyles = {
    primary: 'bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary))]/90',
    secondary: 'bg-[hsl(var(--secondary))] text-white hover:bg-[hsl(var(--secondary))]/90',
    outline: 'border border-current bg-transparent hover:bg-current hover:text-white'
  }

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* 背景画像 */}
      {backgroundImage && (
        <>
          <div className="absolute inset-0 z-0">
            <SanityImage
              image={backgroundImage}
              alt={backgroundImage.alt || ''}
              className="w-full h-full object-cover"
              sizes="100vw"
            />
          </div>
          {/* オーバーレイ */}
          <div
            className="absolute inset-0 z-10 bg-black"
            style={{ opacity: overlayOpacity }}
          />
        </>
      )}

      {/* コンテンツ */}
      <div className={`relative z-20 w-full max-w-screen-xl mx-auto px-6 ${alignmentClasses[alignment]} ${textColorClasses[textColor]}`}>
        <div className="max-w-4xl">
          {subtitle && (
            <p className="text-sm font-medium tracking-[0.2em] uppercase mb-4 opacity-90">
              {subtitle}
            </p>
          )}

          <h1 className="text-4xl md:text-6xl font-noto-serif mb-6 leading-tight">
            {title}
          </h1>

          {description && (
            <p className="text-lg md:text-xl mb-8 opacity-90 leading-relaxed">
              {description}
            </p>
          )}

          {buttons.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {buttons.map((button, index) => (
                <a
                  key={index}
                  href={button.link}
                  className={`inline-flex items-center px-8 py-3 text-sm font-medium rounded-full transition-colors ${buttonStyles[button.style]}`}
                >
                  {button.text}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}