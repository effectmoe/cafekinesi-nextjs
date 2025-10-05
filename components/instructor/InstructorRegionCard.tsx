'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Instructor } from '@/lib/types/instructor'

interface InstructorRegionCardProps {
  instructor: Instructor
  prefecture: string
}

export default function InstructorRegionCard({ instructor, prefecture }: InstructorRegionCardProps) {
  const imageUrl = instructor.image?.asset?.url || '/images/instructor/default.jpg'
  const instructorSlug = instructor.slug.current

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* モバイル専用レイアウト - 縦積み */}
      <div className="md:hidden p-6">
        {/* 画像 */}
        <div className="mb-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            <Image
              src={imageUrl}
              alt={instructor.name}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </div>

        {/* コンテンツ */}
        <div>
          {/* インストラクター名 */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {instructor.name}
            {instructor.title && (
              <span className="block text-sm font-normal text-gray-600 mt-1">
                « {instructor.title} »
              </span>
            )}
          </h3>

          {/* 所在地 */}
          {instructor.region && (
            <div className="flex items-center text-gray-700 mb-3">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm">{instructor.region}</span>
            </div>
          )}

          {/* タグ */}
          {instructor.specialties && instructor.specialties.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {instructor.specialties.map((specialty, index) => {
                const getTagColor = (tag: string) => {
                  if (tag.includes('カフェキネシ')) return 'bg-orange-500 text-white'
                  if (tag.includes('ピーチタッチ')) return 'bg-pink-400 text-white'
                  if (tag.includes('チャクラ')) return 'bg-purple-400 text-white'
                  if (tag.includes('ナビゲーター')) return 'bg-green-500 text-white'
                  if (tag.includes('スタンダード')) return 'bg-cyan-400 text-white'
                  if (tag.includes('HELP')) return 'bg-indigo-400 text-white'
                  if (tag.includes('TAO')) return 'bg-teal-600 text-white'
                  if (tag.includes('星に願いを')) return 'bg-rose-300 text-white'
                  return 'bg-gray-100 text-gray-800'
                }

                return (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(specialty)}`}
                  >
                    {specialty}
                  </span>
                )
              })}
            </div>
          )}

          {/* 略歴 */}
          <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
            {instructor.bio}
          </p>

          {/* 詳細情報ボタン */}
          <Link
            href={`/instructor/${prefecture}/${instructorSlug}`}
            className="inline-block w-full text-center bg-gray-900 text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            詳細情報を表示
          </Link>
        </div>
      </div>

      {/* PC専用レイアウト - 左右配置 */}
      <div className="hidden md:flex items-start gap-8 p-6">
        {/* 左側：画像 */}
        <div className="w-80 flex-shrink-0">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            <Image
              src={imageUrl}
              alt={instructor.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 320px"
            />
          </div>
        </div>

        {/* 右側：コンテンツ */}
        <div className="flex-1 min-w-0">
          {/* インストラクター名 */}
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {instructor.name}
            {instructor.title && (
              <span className="text-base font-normal text-gray-600 ml-2">
                « {instructor.title} »
              </span>
            )}
          </h3>

          {/* 所在地 */}
          {instructor.region && (
            <div className="flex items-center text-gray-700 mb-4">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm">{instructor.region}</span>
            </div>
          )}

          {/* タグ（資格・専門分野） */}
          {instructor.specialties && instructor.specialties.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {instructor.specialties.map((specialty, index) => {
                // タグの色を分類
                const getTagColor = (tag: string) => {
                  if (tag.includes('カフェキネシ')) return 'bg-orange-500 text-white'
                  if (tag.includes('ピーチタッチ')) return 'bg-pink-400 text-white'
                  if (tag.includes('チャクラ')) return 'bg-purple-400 text-white'
                  if (tag.includes('ナビゲーター')) return 'bg-green-500 text-white'
                  if (tag.includes('スタンダード')) return 'bg-cyan-400 text-white'
                  if (tag.includes('HELP')) return 'bg-indigo-400 text-white'
                  if (tag.includes('TAO')) return 'bg-teal-600 text-white'
                  if (tag.includes('星に願いを')) return 'bg-rose-300 text-white'
                  return 'bg-gray-100 text-gray-800'
                }

                return (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getTagColor(specialty)}`}
                  >
                    {specialty}
                  </span>
                )
              })}
            </div>
          )}

          {/* 略歴 */}
          <p className="text-gray-700 text-sm leading-relaxed mb-6 line-clamp-3">
            {instructor.bio}
          </p>

          {/* 詳細情報ボタン */}
          <Link
            href={`/instructor/${prefecture}/${instructorSlug}`}
            className="inline-block bg-gray-900 text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            詳細情報を表示
          </Link>
        </div>
      </div>
    </div>
  )
}
