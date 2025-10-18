'use client'

import Link from 'next/link'
import { CourseDetail } from '@/lib/types/course'
import SidebarCalendar from '@/components/calendar/SidebarCalendar'
import { useEffect } from 'react'

interface CourseDetailSidebarProps {
  course: CourseDetail
}

export default function CourseDetailSidebar({ course }: CourseDetailSidebarProps) {
  // デフォルトの講座メニュー
  const defaultCourseMenu = [
    { text: '講座一覧', link: '/school' },
    { text: 'カフェキネシⅠ', link: '/school/kinesi1' },
    { text: 'ピーチタッチ', link: '/school/peach-touch' },
    { text: 'チャクラキネシ', link: '/school/chakra-kinesi' },
    { text: 'カフェキネシⅣ HELP', link: '/school/help' },
    { text: 'カフェキネシⅤ TAO', link: '/school/tao' },
    { text: 'カフェキネシⅥ ハッピーオーラ', link: '/school/happy-aura' },
  ]

  // Sanityからのサイドバー設定を取得、なければデフォルト
  const showContactButton = course.sidebar?.showContactButton ?? true
  const contactButtonText = course.sidebar?.contactButtonText || 'お問い合わせ・お申し込み'
  const contactButtonLink = course.sidebar?.contactButtonLink || '/contact'
  const customSections = course.sidebar?.customSections || []

  // Facebook SDK の読み込み
  useEffect(() => {
    // Facebook SDK がすでに読み込まれている場合は何もしない
    if ((window as any).FB) {
      (window as any).FB.XFBML.parse()
      return
    }

    // Facebook SDK を読み込む
    const script = document.createElement('script')
    script.src = 'https://connect.facebook.net/ja_JP/sdk.js#xfbml=1&version=v18.0'
    script.async = true
    script.defer = true
    script.crossOrigin = 'anonymous'
    document.body.appendChild(script)

    return () => {
      // クリーンアップは不要（SDKは一度読み込めば再利用される）
    }
  }, [])

  return (
    <div className="space-y-6 lg:sticky lg:top-24">
      {/* 講座メニューセクション */}
      <div className="bg-blue-50 p-4 rounded mb-6">
        <h3 className="font-semibold text-sm mb-3 text-blue-800">
          カフェキネシ講座
        </h3>
        <div className="space-y-2 text-sm">
          {defaultCourseMenu.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="block text-blue-600 hover:underline transition-colors"
            >
              {item.text}
            </Link>
          ))}
        </div>
      </div>

      {/* カスタムセクション（Sanityから） */}
      {customSections.map((section, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded mb-6">
          <h3 className="font-semibold text-sm mb-3">{section.title}</h3>
          <div className="space-y-2 text-sm text-blue-600">
            {section.items?.map((item, itemIndex) => (
              item.link ? (
                <Link
                  key={itemIndex}
                  href={item.link}
                  className="block hover:underline cursor-pointer"
                >
                  {item.text}
                </Link>
              ) : (
                <div key={itemIndex} className="hover:underline cursor-pointer">
                  {item.text}
                </div>
              )
            ))}
          </div>
        </div>
      ))}

      {/* Facebookセクション */}
      <div className="bg-gray-50 p-4 rounded mb-6">
        <h3 className="font-semibold text-sm mb-3">Facebook</h3>
        <div id="fb-root"></div>
        <div
          className="fb-page"
          data-href="https://www.facebook.com/cafekinesi/"
          data-tabs="timeline"
          data-width="340"
          data-height="500"
          data-small-header="false"
          data-adapt-container-width="true"
          data-hide-cover="false"
          data-show-facepile="true"
        >
          <blockquote cite="https://www.facebook.com/cafekinesi/" className="fb-xfbml-parse-ignore">
            <a href="https://www.facebook.com/cafekinesi/">カフェキネシ</a>
          </blockquote>
        </div>
      </div>

      {/* Instagramセクション */}
      <div className="bg-gray-50 p-4 rounded mb-6">
        <h3 className="font-semibold text-sm mb-3">Instagram</h3>
        <a
          href="https://www.instagram.com/cafekinesi/"
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded text-center hover:from-purple-600 hover:to-pink-600 transition-all"
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span className="font-medium">Instagramをフォロー</span>
          </div>
        </a>
      </div>

      {/* YouTubeセクション */}
      <div className="bg-gray-50 p-4 rounded mb-6">
        <h3 className="font-semibold text-sm mb-3">YouTube</h3>
        <a
          href="https://www.youtube.com/@cafekinesi4298"
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-red-600 text-white py-3 px-4 rounded text-center hover:bg-red-700 transition-colors"
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span className="font-medium">YouTubeチャンネル</span>
          </div>
        </a>
      </div>

      {/* お問い合わせボタン（Sanityから制御） */}
      {showContactButton && (
        <Link href={contactButtonLink}>
          <button className="w-full bg-pink-500 text-white py-3 px-4 rounded hover:bg-pink-600 transition-colors mb-6">
            {contactButtonText}
          </button>
        </Link>
      )}

      {/* カレンダーセクション */}
      <SidebarCalendar />
    </div>
  )
}