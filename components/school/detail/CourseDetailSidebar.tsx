'use client'

import Link from 'next/link'
import { CourseDetail } from '@/lib/types/course'

interface CourseDetailSidebarProps {
  course: CourseDetail
}

export default function CourseDetailSidebar({ course }: CourseDetailSidebarProps) {
  return (
    <div className="space-y-6 lg:sticky lg:top-24">
      {/* 講座メニューセクション */}
      <div className="bg-blue-50 p-4 rounded mb-6">
        <h3 className="font-semibold text-sm mb-3 text-blue-800">
          カフェキネシ講座
        </h3>
        <div className="space-y-2 text-sm">
          <Link
            href="/school"
            className="block text-blue-600 hover:underline transition-colors"
          >
            講座一覧
          </Link>
          <Link
            href="/school/kinesi1"
            className="block text-blue-600 hover:underline transition-colors"
          >
            カフェキネシⅠ
          </Link>
          <Link
            href="/school/peach-touch"
            className="block text-blue-600 hover:underline transition-colors"
          >
            ピーチタッチ
          </Link>
          <Link
            href="/school/chakra-kinesi"
            className="block text-blue-600 hover:underline transition-colors"
          >
            チャクラキネシ
          </Link>
          <Link
            href="/school/help"
            className="block text-blue-600 hover:underline transition-colors"
          >
            カフェキネシⅣ HELP
          </Link>
          <Link
            href="/school/tao"
            className="block text-blue-600 hover:underline transition-colors"
          >
            カフェキネシⅤ TAO
          </Link>
          <Link
            href="/school/happy-aura"
            className="block text-blue-600 hover:underline transition-colors"
          >
            カフェキネシⅥ ハッピーオーラ
          </Link>
        </div>
      </div>

      {/* カテゴリーセクション */}
      <div className="bg-gray-50 p-4 rounded mb-6">
        <h3 className="font-semibold text-sm mb-3">カテゴリー</h3>
        <div className="space-y-2 text-sm text-blue-600">
          <div className="hover:underline cursor-pointer">クチカフェ</div>
          <div className="hover:underline cursor-pointer">チャクラキネシ</div>
          <div className="hover:underline cursor-pointer">カフェキネシアドバンス</div>
          <div className="hover:underline cursor-pointer">カフェキネシ</div>
          <div className="hover:underline cursor-pointer">お知らせ</div>
          <div className="hover:underline cursor-pointer">動画</div>
        </div>
      </div>

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

      {/* お問い合わせボタン */}
      <button className="w-full bg-pink-500 text-white py-3 px-4 rounded hover:bg-pink-600 transition-colors mb-6">
        お問い合わせ・お申し込み
      </button>

      {/* カレンダーセクション */}
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-semibold text-sm mb-3">カレンダー</h3>
        <div className="text-xs text-gray-600">
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            <div>日</div>
            <div>月</div>
            <div>火</div>
            <div>水</div>
            <div>木</div>
            <div>金</div>
            <div>土</div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            <div></div>
            <div></div>
            <div></div>
            <div className="hover:bg-blue-100 cursor-pointer p-1 rounded">1</div>
            <div className="hover:bg-blue-100 cursor-pointer p-1 rounded">2</div>
            <div className="hover:bg-blue-100 cursor-pointer p-1 rounded">3</div>
            <div className="hover:bg-blue-100 cursor-pointer p-1 rounded">4</div>
            <div className="hover:bg-blue-100 cursor-pointer p-1 rounded">5</div>
            <div className="hover:bg-blue-100 cursor-pointer p-1 rounded">6</div>
            <div className="hover:bg-blue-100 cursor-pointer p-1 rounded">7</div>
            <div className="hover:bg-blue-100 cursor-pointer p-1 rounded">8</div>
            <div className="hover:bg-blue-100 cursor-pointer p-1 rounded">9</div>
            <div className="hover:bg-blue-100 cursor-pointer p-1 rounded">10</div>
            <div className="hover:bg-blue-100 cursor-pointer p-1 rounded">11</div>
            <div className="hover:bg-blue-100 cursor-pointer p-1 rounded">12</div>
            <div className="hover:bg-blue-100 cursor-pointer p-1 rounded">13</div>
            <div className="hover:bg-blue-100 cursor-pointer p-1 rounded">14</div>
            <div className="hover:bg-blue-100 cursor-pointer p-1 rounded">15</div>
            <div className="hover:bg-blue-100 cursor-pointer p-1 rounded">16</div>
            <div className="hover:bg-blue-100 cursor-pointer p-1 rounded">17</div>
            <div className="hover:bg-blue-100 cursor-pointer p-1 rounded">18</div>
            <div className="hover:bg-blue-100 cursor-pointer p-1 rounded">19</div>
            <div className="hover:bg-blue-100 cursor-pointer p-1 rounded">20</div>
            <div className="hover:bg-blue-100 cursor-pointer p-1 rounded">21</div>
            <div className="hover:bg-blue-100 cursor-pointer p-1 rounded">22</div>
            <div className="hover:bg-blue-100 cursor-pointer p-1 rounded">23</div>
            <div className="hover:bg-blue-100 cursor-pointer p-1 rounded">24</div>
            <div className="hover:bg-blue-100 cursor-pointer p-1 rounded">25</div>
            <div className="hover:bg-blue-100 cursor-pointer p-1 rounded">26</div>
            <div className="hover:bg-blue-100 cursor-pointer p-1 rounded">27</div>
            <div className="hover:bg-blue-100 cursor-pointer p-1 rounded">28</div>
            <div className="hover:bg-blue-100 cursor-pointer p-1 rounded">29</div>
            <div className="hover:bg-blue-100 cursor-pointer p-1 rounded">30</div>
            <div className="hover:bg-blue-100 cursor-pointer p-1 rounded">31</div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  )
}