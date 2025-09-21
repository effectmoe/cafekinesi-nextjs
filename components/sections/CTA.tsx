import { SanityImage } from '@/components/SanityImage'
import type { CtaSection } from '@/types/sanity.types'

interface CTAProps extends CtaSection {}

export function CTA({
  title,
  subtitle,
  description,
  buttonText,
  buttonLink,
  buttonStyle = 'primary',
  backgroundImage,
  backgroundColor = 'primary',
  customBackgroundColor,
  textColor = 'white',
  layout = 'center'
}: CTAProps) {
  const backgroundClasses = {
    primary: 'bg-[hsl(var(--primary))]',
    secondary: 'bg-[hsl(var(--secondary))]',
    gray: 'bg-gray-100',
    white: 'bg-white',
    custom: ''
  }

  const textColorClasses = {
    white: 'text-white',
    black: 'text-black',
    primary: 'text-[hsl(var(--text-primary))]'
  }

  const buttonStyles = {
    primary: 'bg-white text-[hsl(var(--primary))] hover:bg-gray-100',
    secondary: 'bg-[hsl(var(--secondary))] text-white hover:bg-[hsl(var(--secondary))]/90',
    outline: 'border-2 border-current bg-transparent hover:bg-current hover:text-white'
  }

  const layoutClasses = {
    center: 'text-center items-center',
    split: 'md:flex-row md:text-left md:items-center md:justify-between',
    stacked: 'text-center'
  }

  const backgroundStyle = backgroundColor === 'custom' && customBackgroundColor
    ? { backgroundColor: customBackgroundColor }
    : {}

  return (
    <section className={`relative py-16 overflow-hidden ${backgroundClasses[backgroundColor]} ${textColorClasses[textColor]}`} style={backgroundStyle}>
      {/* 背景画像 */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <SanityImage
            image={backgroundImage}
            alt={backgroundImage.alt || ''}
            className="w-full h-full object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-6">
        <div className={`flex flex-col gap-8 ${layoutClasses[layout]}`}>
          <div className="flex-1">
            {subtitle && (
              <p className="text-sm font-medium tracking-[0.2em] uppercase mb-4 opacity-90">
                {subtitle}
              </p>
            )}

            <h2 className="text-3xl md:text-4xl font-noto-serif mb-4">
              {title}
            </h2>

            {description && (
              <p className="text-lg opacity-90 leading-relaxed">
                {description}
              </p>
            )}
          </div>

          <div className="flex-shrink-0">
            <a
              href={buttonLink}
              className={`inline-flex items-center px-8 py-3 text-sm font-medium rounded-full transition-colors ${buttonStyles[buttonStyle]}`}
            >
              {buttonText}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}