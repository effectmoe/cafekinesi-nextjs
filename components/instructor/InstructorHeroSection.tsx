import Image from 'next/image'
import { urlForImage } from '@/lib/sanity.fetch'

interface HeroSectionProps {
  heroSection?: {
    title: string
    description: string
    backgroundImage?: {
      asset: {
        url: string
      }
      alt?: string
    }
  }
}

export default function InstructorHeroSection({ heroSection }: HeroSectionProps) {
  // デフォルト値
  const title = heroSection?.title || 'インストラクターを探す'
  const description = heroSection?.description || 'お近くのカフェキネシインストラクターを見つけましょう'
  const backgroundImageUrl = heroSection?.backgroundImage?.asset?.url
    ? urlForImage(heroSection.backgroundImage)?.url()
    : '/images/instructor/hero-bg.webp'
  const backgroundImageAlt = heroSection?.backgroundImage?.alt || 'インストラクターセッション風景'

  return (
    <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
      {/* 背景画像 */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImageUrl || '/images/instructor/hero-bg.webp'}
          alt={backgroundImageAlt}
          fill
          className="object-cover"
          priority
        />
        {/* オーバーレイ */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* コンテンツ */}
      <div className="relative h-full flex items-center justify-start px-6 md:px-12 lg:px-24">
        <div className="text-white max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {title}
          </h1>
          <p className="text-lg md:text-xl">
            {description}
          </p>
        </div>
      </div>
    </section>
  )
}
