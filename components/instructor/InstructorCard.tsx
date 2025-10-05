import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Award } from 'lucide-react'
import type { Instructor } from '@/lib/types/instructor'

interface InstructorCardProps {
  instructor: Instructor
}

export default function InstructorCard({ instructor }: InstructorCardProps) {
  const imageUrl = instructor.image?.asset?.url || '/images/instructor/instructor-default.jpg'
  const imageAlt = instructor.image?.alt || `${instructor.name}のプロフィール画像`

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
      {/* プロフィール画像 */}
      <div className="relative aspect-[4/3] bg-gray-100">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* コンテンツ */}
      <div className="p-6">
        {/* 名前と肩書き */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {instructor.name}
          </h3>
          {instructor.title && (
            <p className="text-sm text-blue-600 font-medium">
              {instructor.title}
            </p>
          )}
        </div>

        {/* 活動地域 */}
        {instructor.region && (
          <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
            <MapPin className="w-4 h-4" />
            <span>{instructor.region}</span>
          </div>
        )}

        {/* 専門分野 */}
        {instructor.specialties && instructor.specialties.length > 0 && (
          <div className="flex items-start gap-2 mb-4">
            <Award className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
            <div className="flex flex-wrap gap-1">
              {instructor.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 自己紹介 */}
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {instructor.bio}
        </p>

        {/* 詳細ページへのリンク */}
        <Link
          href={`/instructor/${instructor.slug.current}`}
          className="inline-block w-full text-center bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded transition-colors"
        >
          詳しく見る
        </Link>
      </div>
    </div>
  )
}
