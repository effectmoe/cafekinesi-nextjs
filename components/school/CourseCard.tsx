'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Course } from '@/lib/types/course'
import CourseImagePlaceholder from './CourseImagePlaceholder'

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  // CTAボックスの設定（Sanityから取得、なければデフォルト）
  const ctaTitle = course.ctaBox?.title || 'この講座について'
  const ctaSubtitle = course.ctaBox?.subtitle || '詳細情報やお申込みはこちら'
  const primaryButtonText = course.ctaBox?.primaryButtonText || '詳細を見る'
  const primaryButtonLink = course.ctaBox?.primaryButtonLink || `/school/${course.courseId}`
  const secondaryButtonText = course.ctaBox?.secondaryButtonText || '講座詳細・お申込み →'
  const secondaryButtonLink = course.ctaBox?.secondaryButtonLink || ''

  return (
    <>
    <div id={course.courseId} className="mb-6 border border-gray-200 overflow-hidden">
      {/* メインカード - 各カードに個別の背景色 */}
      <div className={`${course.backgroundClass} py-8 px-6 md:px-10 flex flex-col md:flex-row items-center`}>
        {/* 画像 */}
        <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-10">
          {course.image?.asset?.url ? (
            <div className="bg-white p-4 rounded-lg mx-auto">
              <Image
                src={course.image.asset.url}
                alt={course.image.alt || `${course.title} ${course.subtitle}`}
                width={260}
                height={180}
                className="w-[220px] md:w-[260px] h-[150px] md:h-[180px] object-contain"
              />
            </div>
          ) : (
            <div className="bg-white p-4 rounded-lg mx-auto">
              <div className="w-[220px] md:w-[260px] h-[150px] md:h-[180px] flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-700">{course.title}</p>
                  <p className="text-sm text-gray-500 mt-2">{course.subtitle}</p>
                  <p className="text-xs text-gray-400 mt-3">Sample Image</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* コンテンツ */}
        <div className="flex-1 text-center md:text-left">
          {/* レベル表示 */}
          <div className="mb-3">
            <span className="inline-block bg-white/80 text-gray-600 px-3 py-1 rounded text-xs font-medium">
              レベル {course.order || 1}
            </span>
          </div>

          {/* 講座タイトル */}
          <Link href={`/school/${course.courseId}`} className="block hover:opacity-80 transition-opacity">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              {course.title}
            </h2>

            {/* サブタイトル */}
            <h3 className="text-sm md:text-base text-gray-700 mb-3">
              {course.subtitle}
            </h3>
          </Link>

          {/* 説明文 */}
          {course.description && (
            <p className="text-gray-600 leading-relaxed text-sm">
              {course.description}
            </p>
          )}
        </div>
      </div>

      {/* 詳細セクション */}
      <div className="bg-white px-6 md:px-10 py-8">
        {/* PC：タイトル行を分離 */}
        <div className="hidden md:flex items-start gap-8 mb-4">
          <div className="flex-1">
            <h4 className="text-sm font-bold text-gray-900 flex items-center">
              <span className="text-lg mr-2">●</span> 講座の特徴
            </h4>
          </div>
          <div className="w-72 text-center">
            <p className="text-sm text-gray-700 font-medium">{ctaTitle}</p>
          </div>
        </div>

        {/* PC：コンテンツ行 */}
        <div className="hidden md:flex items-stretch gap-8">
          {/* 左側：講座の特徴リスト */}
          <div className="flex-1">
            {course.features && course.features.length > 0 && (
              <div className="space-y-3 h-full">
                {course.features.map((feature, index) => (
                  <div key={index} className="bg-gray-100 p-4 rounded-lg flex items-center">
                    <span className="bg-gray-800 text-white rounded-full min-w-[20px] w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="ml-3 text-gray-700 text-sm leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 右側：CTAボックス */}
          <div className="w-72 flex-shrink-0">
            <div className="bg-gray-100 p-6 rounded-lg text-center h-full flex flex-col">
              <p className="text-xs text-gray-500 mb-4">{ctaSubtitle}</p>
              <div className="flex-1 flex flex-col justify-center">
                <Link
                  href={primaryButtonLink}
                  className="inline-block bg-gray-800 text-white px-6 py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors w-full rounded mb-3 text-center"
                >
                  {primaryButtonText}
                </Link>

                {secondaryButtonLink ? (
                  <Link
                    href={secondaryButtonLink}
                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 text-xs font-medium hover:bg-gray-50 transition-colors w-full rounded inline-block"
                  >
                    {secondaryButtonText}
                  </Link>
                ) : (
                  <button
                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 text-xs font-medium hover:bg-gray-50 transition-colors w-full rounded"
                    onClick={() => console.log(secondaryButtonText)}
                  >
                    {secondaryButtonText}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* モバイル：縦並び */}
        <div className="flex flex-col md:hidden">
          {/* 講座の特徴 */}
          <div className="mb-8">
            <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-lg mr-2">●</span> 講座の特徴
            </h4>
            {course.features && course.features.length > 0 && (
              <div className="space-y-3">
                {course.features.map((feature, index) => (
                  <div key={index} className="bg-gray-100 p-4 rounded-lg flex items-center">
                    <span className="bg-gray-800 text-white rounded-full min-w-[20px] w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="ml-3 text-gray-700 text-sm leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CTAボックス */}
          <div className="w-full">
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <p className="text-sm text-gray-700 font-medium mb-1">{ctaTitle}</p>
              <p className="text-xs text-gray-500 mb-4">{ctaSubtitle}</p>

              <Link
                href={primaryButtonLink}
                className="inline-block bg-gray-800 text-white px-6 py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors w-full rounded mb-3 text-center"
              >
                {primaryButtonText}
              </Link>

              {secondaryButtonLink ? (
                <Link
                  href={secondaryButtonLink}
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-2 text-xs font-medium hover:bg-gray-50 transition-colors w-full rounded inline-block"
                >
                  {secondaryButtonText}
                </Link>
              ) : (
                <button
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-2 text-xs font-medium hover:bg-gray-50 transition-colors w-full rounded"
                  onClick={() => console.log(secondaryButtonText)}
                >
                  {secondaryButtonText}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* 子講座（補助講座）がある場合は表示 */}
    {course.childCourses && course.childCourses.length > 0 && (
      <div className="ml-8 mb-6 space-y-4">
        {course.childCourses.map((childCourse) => {
          const childCtaTitle = childCourse.ctaBox?.title || 'この講座について'
          const childCtaSubtitle = childCourse.ctaBox?.subtitle || '詳細情報やお申込みはこちら'
          const childPrimaryButtonText = childCourse.ctaBox?.primaryButtonText || '詳細を見る'
          const childPrimaryButtonLink = childCourse.ctaBox?.primaryButtonLink || `/school/${childCourse.courseId}`

          return (
            <div key={childCourse._id} id={childCourse.courseId} className="border border-gray-300 overflow-hidden bg-gray-50 relative">
              {/* 階層を示す視覚的な線 */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-400"></div>

              {/* 補助講座のコンパクトなカード */}
              <div className="pl-4">
                <div className={`${childCourse.backgroundClass || 'bg-gray-100'} py-6 px-6 md:px-8 flex flex-col md:flex-row items-center opacity-90`}>
                  {/* 画像（小さめ） */}
                  {childCourse.image?.asset?.url && (
                    <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                      <div className="bg-white p-3 rounded-lg">
                        <Image
                          src={childCourse.image.asset.url}
                          alt={childCourse.image.alt || `${childCourse.title} ${childCourse.subtitle}`}
                          width={180}
                          height={120}
                          className="w-[150px] md:w-[180px] h-[100px] md:h-[120px] object-contain"
                        />
                      </div>
                    </div>
                  )}

                  {/* コンテンツ */}
                  <div className="flex-1 text-center md:text-left">
                    {/* 補助講座ラベル */}
                    <div className="mb-2">
                      <span className="inline-block bg-gray-600 text-white px-3 py-1 rounded text-xs font-medium">
                        補助講座 - レベル {childCourse.order || 1}
                      </span>
                    </div>

                    {/* 講座タイトル */}
                    <Link href={`/school/${childCourse.courseId}`} className="block hover:opacity-80 transition-opacity">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                        {childCourse.title}
                      </h3>
                      <h4 className="text-sm text-gray-700 mb-2">
                        {childCourse.subtitle}
                      </h4>
                    </Link>

                    {/* 説明文 */}
                    {childCourse.description && (
                      <p className="text-gray-600 leading-relaxed text-xs md:text-sm">
                        {childCourse.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* 詳細セクション（簡易版） */}
                {childCourse.features && childCourse.features.length > 0 && (
                  <div className="bg-white px-6 md:px-8 py-6">
                    <div className="md:flex items-stretch gap-6">
                      {/* 講座の特徴 */}
                      <div className="flex-1 mb-6 md:mb-0">
                        <h5 className="text-xs font-bold text-gray-900 mb-3 flex items-center">
                          <span className="text-base mr-2">●</span> 講座の特徴
                        </h5>
                        <div className="space-y-2">
                          {childCourse.features.slice(0, 3).map((feature, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded flex items-center">
                              <span className="bg-gray-600 text-white rounded-full min-w-[18px] w-[18px] h-[18px] flex items-center justify-center text-xs flex-shrink-0">
                                {index + 1}
                              </span>
                              <span className="ml-3 text-gray-700 text-xs leading-relaxed">{feature}</span>
                            </div>
                          ))}
                          {childCourse.features.length > 3 && (
                            <p className="text-xs text-gray-500 ml-7">他 {childCourse.features.length - 3}件</p>
                          )}
                        </div>
                      </div>

                      {/* CTAボックス（小） */}
                      <div className="w-full md:w-56 flex-shrink-0">
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                          <p className="text-xs text-gray-700 font-medium mb-1">{childCtaTitle}</p>
                          <p className="text-xs text-gray-500 mb-3">{childCtaSubtitle}</p>
                          <Link
                            href={childPrimaryButtonLink}
                            className="inline-block bg-gray-700 text-white px-4 py-2 text-xs font-medium hover:bg-gray-600 transition-colors w-full rounded text-center"
                          >
                            {childPrimaryButtonText}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )}
    </>
  )
}