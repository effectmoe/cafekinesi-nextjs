'use client'

import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import type { Instructor } from '@/lib/types/instructor'

interface InstructorDetailProps {
  instructor: Instructor
}

export default function InstructorDetail({ instructor }: InstructorDetailProps) {
  const imageUrl = instructor.image?.asset?.url || '/images/instructor/default.jpg'

  // タグの色設定（パステルカラー）
  const getTagColor = (tag: string) => {
    if (tag.includes('カフェキネシ')) return 'bg-yellow-50 text-yellow-700 border border-yellow-200'
    if (tag.includes('ピーチタッチ')) return 'bg-pink-50 text-pink-700 border border-pink-200'
    if (tag.includes('チャクラ')) return 'bg-purple-50 text-purple-700 border border-purple-200'
    if (tag.includes('ナビゲーター')) return 'bg-green-50 text-green-700 border border-green-200'
    if (tag.includes('スタンダード')) return 'bg-blue-50 text-blue-700 border border-blue-200'
    if (tag.includes('HELP')) return 'bg-indigo-50 text-indigo-700 border border-indigo-200'
    if (tag.includes('TAO')) return 'bg-teal-50 text-teal-700 border border-teal-200'
    if (tag.includes('星に願いを')) return 'bg-rose-50 text-rose-700 border border-rose-200'
    return 'bg-gray-50 text-gray-700 border border-gray-200'
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
              <div className="text-gray-700 leading-relaxed prose prose-sm max-w-none">
                {instructor.profileDetails ? (
                  <PortableText value={instructor.profileDetails} />
                ) : (
                  <p className="whitespace-pre-line">{instructor.bio}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ウェブサイト・SNSリンクセクション */}
        {(instructor.website || (instructor.socialLinks && instructor.socialLinks.length > 0)) && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">ウェブサイト・SNS</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ウェブサイト */}
              {instructor.website && (
                <a
                  href={instructor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </div>
                      <h3 className="ml-3 text-base font-semibold text-gray-900">ウェブサイト</h3>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors truncate">
                    {instructor.website}
                  </p>
                </a>
              )}

              {/* SNSリンク */}
              {instructor.socialLinks && instructor.socialLinks.map((social, index) => {
                const getSocialIcon = (platform: string) => {
                  switch (platform) {
                    case 'facebook':
                      return (
                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      )
                    case 'instagram':
                      return (
                        <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      )
                    case 'twitter':
                      return (
                        <svg className="w-6 h-6 text-sky-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                        </svg>
                      )
                    case 'youtube':
                      return (
                        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      )
                    case 'line':
                      return (
                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.373 0 0 4.975 0 11.111c0 5.497 4.898 10.104 11.516 11.015.449.096.938.293 1.076.673.125.342.082.878.041 1.224l-.194 1.167c-.059.347-.271 1.36 1.193.742 1.464-.619 7.894-4.651 10.769-7.964C23.613 15.871 24 13.5 24 11.111 24 4.975 18.627 0 12 0zm-2.857 14.929H6.429a.375.375 0 0 1-.375-.375V8.571a.375.375 0 0 1 .75 0v5.608h2.339a.375.375 0 0 1 0 .75zm2.411-.375a.375.375 0 0 1-.75 0V8.571a.375.375 0 0 1 .75 0v5.983zm5.125 0a.375.375 0 0 1-.612.291l-3.054-2.544v2.253a.375.375 0 0 1-.75 0V8.571a.375.375 0 0 1 .612-.291l3.054 2.544V8.571a.375.375 0 0 1 .75 0v5.983zm2.411-.375h-2.714a.375.375 0 0 1-.375-.375V8.571a.375.375 0 0 1 .375-.375h2.714a.375.375 0 0 1 0 .75h-2.339v1.929h2.339a.375.375 0 0 1 0 .75h-2.339v1.929h2.339a.375.375 0 0 1 0 .75z"/>
                        </svg>
                      )
                    default:
                      return (
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      )
                  }
                }

                const getPlatformName = (platform: string) => {
                  switch (platform) {
                    case 'facebook': return 'Facebook'
                    case 'instagram': return 'Instagram'
                    case 'twitter': return 'Twitter/X'
                    case 'line': return 'LINE'
                    case 'youtube': return 'YouTube'
                    default: return 'その他'
                  }
                }

                const getPlatformColor = (platform: string) => {
                  switch (platform) {
                    case 'facebook': return 'bg-blue-50 group-hover:bg-blue-100'
                    case 'instagram': return 'bg-pink-50 group-hover:bg-pink-100'
                    case 'twitter': return 'bg-sky-50 group-hover:bg-sky-100'
                    case 'line': return 'bg-green-50 group-hover:bg-green-100'
                    case 'youtube': return 'bg-red-50 group-hover:bg-red-100'
                    default: return 'bg-gray-50 group-hover:bg-gray-100'
                  }
                }

                const getBorderHoverColor = (platform: string) => {
                  switch (platform) {
                    case 'facebook': return 'hover:border-blue-400'
                    case 'instagram': return 'hover:border-pink-400'
                    case 'twitter': return 'hover:border-sky-400'
                    case 'line': return 'hover:border-green-400'
                    case 'youtube': return 'hover:border-red-400'
                    default: return 'hover:border-gray-400'
                  }
                }

                const getTextHoverColor = (platform: string) => {
                  switch (platform) {
                    case 'facebook': return 'group-hover:text-blue-600'
                    case 'instagram': return 'group-hover:text-pink-600'
                    case 'twitter': return 'group-hover:text-sky-600'
                    case 'line': return 'group-hover:text-green-600'
                    case 'youtube': return 'group-hover:text-red-600'
                    default: return 'group-hover:text-gray-600'
                  }
                }

                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group block p-6 bg-white border-2 border-gray-200 rounded-xl ${getBorderHoverColor(social.platform)} hover:shadow-lg transition-all duration-200`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className={`p-2 ${getPlatformColor(social.platform)} rounded-lg transition-colors`}>
                          {getSocialIcon(social.platform)}
                        </div>
                        <h3 className="ml-3 text-base font-semibold text-gray-900">{getPlatformName(social.platform)}</h3>
                      </div>
                      <svg className={`w-5 h-5 text-gray-400 ${getTextHoverColor(social.platform)} transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className={`text-sm text-gray-600 ${getTextHoverColor(social.platform)} transition-colors truncate`}>
                      {social.url}
                    </p>
                  </a>
                )
              })}
            </div>
          </div>
        )}

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
