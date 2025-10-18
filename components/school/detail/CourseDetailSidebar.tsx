'use client'

import Link from 'next/link'
import { CourseDetail } from '@/lib/types/course'
import SidebarCalendar from '@/components/calendar/SidebarCalendar'
import { useEffect } from 'react'
import { YouTubeEmbed } from 'react-social-media-embed'

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
        <div className="flex justify-center">
          <iframe
            src="https://www.instagram.com/p/DP3vzmOD-ZK/embed"
            width="328"
            height="450"
            frameBorder="0"
            scrolling="no"
            allowTransparency
            className="border-0"
          />
        </div>
      </div>

      {/* YouTubeセクション */}
      <div className="bg-gray-50 p-4 rounded mb-6">
        <h3 className="font-semibold text-sm mb-3">YouTube</h3>
        <div className="flex justify-center">
          <YouTubeEmbed
            url="https://www.youtube.com/watch?v=6HjtOD8NzYY"
            width={325}
            height={220}
          />
        </div>
      </div>

      {/* カレンダーセクション */}
      <SidebarCalendar />
    </div>
  )
}