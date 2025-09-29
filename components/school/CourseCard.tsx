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
  return (
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
          <div className="inline-block bg-white/80 text-gray-600 px-3 py-0.5 rounded text-xs font-medium mb-3">
            レベル {course.order || 1}
          </div>

          {/* 講座タイトル */}
          <Link href={`/school/${course.courseId}`} className="inline-block hover:opacity-80 transition-opacity">
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
            <p className="text-sm text-gray-700 font-medium">この講座について</p>
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
              <p className="text-xs text-gray-500 mb-4">詳細情報やお申込みはこちら</p>
              <div className="flex-1 flex flex-col justify-center">
                <Link
                  href={`/school/${course.courseId}`}
                  className="inline-block bg-gray-800 text-white px-6 py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors w-full rounded mb-3 text-center"
                >
                  詳細を見る
                </Link>

                <button
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-2 text-xs font-medium hover:bg-gray-50 transition-colors w-full rounded"
                  onClick={() => console.log('講座詳細・お申込み')}
                >
                  講座詳細・お申込み →
                </button>
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
              <p className="text-sm text-gray-700 font-medium mb-1">この講座について</p>
              <p className="text-xs text-gray-500 mb-4">詳細情報やお申込みはこちら</p>

              <Link
                href={`/school/${course.courseId}`}
                className="inline-block bg-gray-800 text-white px-6 py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors w-full rounded mb-3 text-center"
              >
                詳細を見る
              </Link>

              <button
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 text-xs font-medium hover:bg-gray-50 transition-colors w-full rounded"
                onClick={() => console.log('講座詳細・お申込み')}
              >
                講座詳細・お申込み →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}