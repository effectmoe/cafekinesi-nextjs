import Link from 'next/link'
import { urlFor } from '@/lib/sanity.client'

interface HeroSectionProps {
  heading: string
  subheading: string
  backgroundImage?: any
  cta?: {
    text: string
    link: string
  }
}

export default function HeroSection({ heading, subheading, backgroundImage, cta }: HeroSectionProps) {
  const bgImageUrl = backgroundImage ? urlFor(backgroundImage).width(1920).height(1080).url() : null

  return (
    <section
      className="relative h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50"
      style={{
        backgroundImage: bgImageUrl ? `url(${bgImageUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {bgImageUrl && (
        <div className="absolute inset-0 bg-black/40" />
      )}

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-noto-serif font-bold text-gray-900 mb-6">
          {heading}
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-8">
          {subheading}
        </p>

        {cta && (
          <Link
            href={cta.link}
            className="inline-block px-8 py-4 bg-amber-600 text-white font-medium rounded-full hover:bg-amber-700 transition-colors"
          >
            {cta.text}
          </Link>
        )}
      </div>
    </section>
  )
}