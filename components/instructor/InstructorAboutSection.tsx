import Image from 'next/image'
import { urlForImage } from '@/lib/sanity.fetch'
import { PortableText } from '@portabletext/react'

interface AboutSectionProps {
  aboutSection?: {
    title: string
    description?: any[] // PortableText
    image?: {
      asset: {
        url: string
      }
      alt?: string
    }
  }
}

export default function InstructorAboutSection({ aboutSection }: AboutSectionProps) {
  // デフォルト値
  const title = aboutSection?.title || 'カフェキネシインストラクターとは'
  const description = aboutSection?.description
  const imageUrl = aboutSection?.image?.asset?.url
    ? urlForImage(aboutSection.image)?.url()
    : '/images/instructor/about-image.jpg'
  const imageAlt = aboutSection?.image?.alt || 'カフェキネシセッション風景'

  return (
    <section className="w-full max-w-screen-xl mx-auto px-6 py-16 md:py-24">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
        {title}
      </h2>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* 左側：テキスト */}
        <div className="space-y-6">
          {description && description.length > 0 ? (
            <div className="text-gray-700 leading-relaxed prose prose-lg max-w-none">
              <PortableText value={description} />
            </div>
          ) : (
            <>
              <p className="text-gray-700 leading-relaxed">
                カフェキネシインストラクターは、キネシオロジーやセラピーを教える資格を持った認定講師です。
                心と身体の健康をサポートし、一人ひとりに合わせたセッションやワークショップを開催しています。
              </p>
              <p className="text-gray-700 leading-relaxed">
                全国各地で活動するインストラクターが、あなたのためにマンツーマンセッションやグループワークショップを開催していますので、
                地域から最適なインストラクターを選び、初心者の方でもセッションやワークショップに参加して楽しめます。
              </p>
            </>
          )}
        </div>

        {/* 右側：画像 */}
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
          <Image
            src={imageUrl || '/images/instructor/about-image.jpg'}
            alt={imageAlt}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}
