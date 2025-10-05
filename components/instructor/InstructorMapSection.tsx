'use client'

import { useState } from 'react'

export default function InstructorMapSection() {
  const [selectedRegion, setSelectedRegion] = useState<string>('')

  // 日本の地域区分
  const regions = [
    { id: 'hokkaido', name: '北海道' },
    { id: 'tohoku', name: '東北' },
    { id: 'kanto', name: '関東' },
    { id: 'chubu', name: '中部' },
    { id: 'kinki', name: '近畿' },
    { id: 'chugoku', name: '中国' },
    { id: 'shikoku', name: '四国' },
    { id: 'kyushu', name: '九州・沖縄' },
  ]

  return (
    <section className="w-full max-w-screen-xl mx-auto px-6 py-16 md:py-24">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
        都道府県から探す
      </h2>
      <p className="text-center text-gray-600 mb-12">
        地図から都道府県を選択
      </p>

      <div className="max-w-4xl mx-auto">
        {/* 日本地図プレースホルダー */}
        <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-lg mb-8 flex items-center justify-center">
          {/* SVG日本地図をここに配置 */}
          <div className="text-gray-400 text-center">
            <svg
              className="w-full h-full p-8"
              viewBox="0 0 800 600"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* シンプルな日本地図のプレースホルダー */}
              <rect x="200" y="100" width="400" height="400" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" rx="10"/>
              <text x="400" y="300" textAnchor="middle" fill="#6b7280" fontSize="20">
                日本地図
              </text>
              <text x="400" y="330" textAnchor="middle" fill="#9ca3af" fontSize="14">
                （インタラクティブマップは今後実装予定）
              </text>
            </svg>
          </div>
        </div>

        {/* 地域選択ボタン */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {regions.map((region) => (
            <button
              key={region.id}
              onClick={() => setSelectedRegion(region.id)}
              className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                selectedRegion === region.id
                  ? 'bg-pink-500 text-white'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-pink-500 hover:text-pink-500'
              }`}
            >
              {region.name}
            </button>
          ))}
        </div>

        {selectedRegion && (
          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <p className="text-center text-gray-700">
              {regions.find(r => r.id === selectedRegion)?.name}地方のインストラクターを表示
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
