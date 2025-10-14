'use client'

import Link from 'next/link'
import { CourseDetail } from '@/lib/types/course'
import SidebarCalendar from '@/components/calendar/SidebarCalendar'

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
        <div className="bg-white rounded p-3">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-pink-200 rounded-full mr-2"></div>
            <div>
              <div className="text-xs font-medium">カフェキネシ</div>
              <div className="text-xs text-gray-500">4,760フォロワー</div>
            </div>
          </div>
          <button className="w-full bg-blue-600 text-white py-1 px-3 rounded text-xs hover:bg-blue-700 transition-colors">
            ページをフォロー
          </button>
          <div className="mt-3">
            <div className="w-full h-24 bg-gradient-to-r from-pink-100 to-orange-100 rounded mb-2 flex items-center justify-center">
              <span className="text-xs text-gray-500">Facebook 投稿画像</span>
            </div>
            <div className="text-xs text-gray-600">心も軽やか体も軽やか毎日を♪</div>
          </div>
        </div>
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