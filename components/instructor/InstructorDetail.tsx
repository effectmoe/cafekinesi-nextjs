'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Instructor } from '@/lib/types/instructor'

interface InstructorDetailProps {
  instructor: Instructor
}

export default function InstructorDetail({ instructor }: InstructorDetailProps) {
  const imageUrl = instructor.image?.asset?.url || '/images/instructor/default.jpg'

  // タグの色設定
  const getTagColor = (tag: string) => {
    if (tag.includes('カフェキネシ')) return 'bg-yellow-100 text-yellow-800'
    if (tag.includes('ピーチタッチ')) return 'bg-pink-100 text-pink-800'
    if (tag.includes('チャクラ')) return 'bg-purple-100 text-purple-800'
    if (tag.includes('ナビゲーター')) return 'bg-green-100 text-green-800'
    if (tag.includes('スタンダード')) return 'bg-blue-100 text-blue-800'
    if (tag.includes('HELP')) return 'bg-indigo-100 text-indigo-800'
    if (tag.includes('TAO')) return 'bg-teal-100 text-teal-800'
    if (tag.includes('星に願いを')) return 'bg-rose-100 text-rose-800'
    return 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="w-full bg-white">
      {/* メインコンテンツエリア */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* モバイル専用レイアウト - 縦積み */}
        <div className="md:hidden mb-16">
          {/* 画像 */}
          <div className="mb-6">
            <div className="relative w-full aspect-square overflow-hidden rounded-lg shadow-lg">
              <Image
                src={imageUrl}
                alt={instructor.name}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
            </div>
          </div>

          {/* 詳細情報 */}
          <div>
            {/* 名前 */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {instructor.name}
            </h1>

            {/* 所在地 */}
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">所在地</h2>
              <div className="flex items-center text-gray-700">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{instructor.region}</span>
              </div>
            </div>

            {/* 対応コース */}
            {instructor.specialties && instructor.specialties.length > 0 && (
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">対応コース</h2>
                <div className="flex flex-wrap gap-2">
                  {instructor.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getTagColor(specialty)}`}
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* プロフィール */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">プロフィール</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {instructor.bio}
              </p>
            </div>
          </div>
        </div>

        {/* PC専用レイアウト - 左右配置 */}
        <div className="hidden md:flex items-start gap-12 mb-16">
          {/* 左側：画像 */}
          <div className="w-80 h-96 flex-shrink-0">
            <div className="relative w-full h-full overflow-hidden rounded-lg shadow-lg">
              <Image
                src={imageUrl}
                alt={instructor.name}
                fill
                className="object-cover"
                priority
                sizes="320px"
              />
            </div>
          </div>

          {/* 右側：詳細情報 */}
          <div className="flex-1 min-w-0">
            {/* 名前 */}
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {instructor.name}
            </h1>

            {/* 所在地 */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">所在地</h2>
              <div className="flex items-center text-gray-700">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{instructor.region}</span>
              </div>
            </div>

            {/* 対応コース */}
            {instructor.specialties && instructor.specialties.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">対応コース</h2>
                <div className="flex flex-wrap gap-2">
                  {instructor.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getTagColor(specialty)}`}
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* プロフィール */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">プロフィール</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {instructor.bio}
              </p>
            </div>
          </div>
        </div>

        {/* 対応可能なコースセクション */}
        {instructor.teachingCourses && instructor.teachingCourses.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">対応可能なコース</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {instructor.teachingCourses.map((course) => (
                <Link
                  key={course._id}
                  href={`/school/${course.courseId}`}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="mb-3">
                    <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${getTagColor(course.title)}`}>
                      {course.title}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}コース</h3>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {course.description || 'このコースでは、基本的な技術から応用まで幅広く学ぶことができます。'}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* セッションのご予約・お問い合わせセクション */}
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">セッションのご予約・お問い合わせ</h2>
          <p className="text-gray-600 mb-8">
            セッションのご予約やご質問など、お気軽にお問い合わせください。
          </p>
          <Link
            href="/contact"
            className="inline-block bg-gray-900 text-white px-12 py-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            お問い合わせフォームへ
          </Link>
        </div>
      </div>

      {/* 北海道の一覧に戻るリンク */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <Link
          href="/instructor/hokkaido"
          className="inline-flex items-center text-blue-600 hover:underline"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          北海道の一覧に戻る
        </Link>
      </div>
    </div>
  )
}
