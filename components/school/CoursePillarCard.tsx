'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Course } from '@/lib/types/course'

interface CoursePillarCardProps {
  course: Course
  isChild?: boolean
}

/**
 * ピラーページ用の講座カード（ミニマル版）
 * - 概要のみを表示
 * - 詳細情報はクラスターページへ誘導
 * - LLMO/SEO最適化
 */
export default function CoursePillarCard({ course, isChild = false }: CoursePillarCardProps) {
  const CardWrapper = isChild ? 'div' : 'article'

  return (
    <CardWrapper
      itemScope
      itemType="https://schema.org/Course"
      className={`
        ${isChild ? 'ml-8 border-l-4 border-gray-300 pl-6' : ''}
        mb-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden
      `}
    >
      <Link
        href={`/school/${course.courseId}`}
        className="block"
        itemProp="url"
      >
        <div className={`flex flex-col md:flex-row ${isChild ? 'gap-4' : 'gap-6'} p-6`}>
          {/* 画像 */}
          {course.image?.asset?.url && (
            <div className={`flex-shrink-0 ${isChild ? 'w-32 h-24' : 'w-48 h-36'}`}>
              <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={course.image.asset.url}
                  alt={course.image.alt || course.title}
                  fill
                  className="object-contain"
                  itemProp="image"
                />
              </div>
            </div>
          )}

          {/* コンテンツ */}
          <div className="flex-1 min-w-0">
            {/* レベルとタイプ */}
            <div className="flex items-center gap-2 mb-2">
              {isChild ? (
                <span className="inline-block px-2 py-1 text-xs font-semibold bg-gray-600 text-white rounded">
                  補助講座
                </span>
              ) : (
                <span className="inline-block px-3 py-1 text-sm font-semibold bg-[#8B5A3C] text-white rounded">
                  レベル {course.order}
                </span>
              )}
            </div>

            {/* タイトル */}
            <h3
              itemProp="name"
              className={`
                ${isChild ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'}
                font-bold text-gray-900 mb-2 hover:text-[#8B5A3C] transition-colors
              `}
            >
              {course.title}
            </h3>

            {/* サブタイトル */}
            <p
              itemProp="description"
              className={`
                ${isChild ? 'text-sm' : 'text-base'}
                text-gray-600 mb-3 line-clamp-2
              `}
            >
              {course.subtitle}
            </p>

            {/* 基本情報 */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
              {course.duration?.note && (
                <span className="flex items-center gap-1" itemProp="timeRequired">
                  ⏱️ {course.duration.note}
                </span>
              )}
              {course.price?.amount && (
                <span className="flex items-center gap-1">
                  💰
                  <span itemProp="offers" itemScope itemType="https://schema.org/Offer">
                    <meta itemProp="price" content={course.price.amount.toString()} />
                    <meta itemProp="priceCurrency" content="JPY" />
                    ¥{course.price.amount.toLocaleString()}
                    {course.price.note && <span className="text-xs ml-1">({course.price.note})</span>}
                  </span>
                </span>
              )}
            </div>

            {/* CTAボタン */}
            <div className="inline-flex items-center text-[#8B5A3C] font-medium hover:text-[#6d4730] transition-colors">
              詳細を見る
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Schema.org 追加情報 */}
        <meta itemProp="provider" content="Cafe Kinesi" />
        <meta itemProp="educationalLevel" content={`Level ${course.order}`} />
      </Link>

      {/* 子講座がある場合 */}
      {!isChild && course.childCourses && course.childCourses.length > 0 && (
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <p className="text-sm text-gray-600 mb-3 font-medium">
            📚 この講座の発展コース（{course.childCourses.length}件）
          </p>
          <div className="space-y-3">
            {course.childCourses.map((childCourse) => (
              <Link
                key={childCourse._id}
                href={`/school/${childCourse.courseId}`}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#8B5A3C] transition-colors"
              >
                <span className="text-gray-400">└</span>
                <span className="font-medium">{childCourse.title}</span>
                <span className="text-xs text-gray-500">({childCourse.subtitle})</span>
                <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      )}
    </CardWrapper>
  )
}
