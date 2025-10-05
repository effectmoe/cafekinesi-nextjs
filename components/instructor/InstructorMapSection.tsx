'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import type { Instructor } from '@/lib/types/instructor'

// Dynamically import JapanMap to avoid SSR issues with react-simple-maps
const JapanMap = dynamic(() => import('./JapanMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-400">地図を読み込み中...</p>
    </div>
  ),
})

interface InstructorMapSectionProps {
  instructors?: Instructor[]
}

export default function InstructorMapSection({ instructors = [] }: InstructorMapSectionProps) {
  const [selectedPrefecture, setSelectedPrefecture] = useState<string>('')
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')

  // Separate instructors by location
  const { japanInstructors, overseasInstructors } = useMemo(() => {
    const japan: Instructor[] = []
    const overseas: Instructor[] = []

    instructors.forEach((instructor) => {
      // Check if region is overseas (アメリカ or ヨーロッパ)
      if (instructor.region === 'アメリカ' || instructor.region === 'ヨーロッパ') {
        overseas.push(instructor)
      } else {
        japan.push(instructor)
      }
    })

    return { japanInstructors: japan, overseasInstructors: overseas }
  }, [instructors])

  // Count instructors per prefecture (Japan only)
  const instructorCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    japanInstructors.forEach((instructor) => {
      if (instructor.region) {
        counts[instructor.region] = (counts[instructor.region] || 0) + 1
      }
    })
    return counts
  }, [japanInstructors])

  // Get instructors for selected prefecture
  const selectedInstructors = useMemo(() => {
    if (!selectedPrefecture) return []
    return japanInstructors.filter((instructor) => instructor.region === selectedPrefecture)
  }, [japanInstructors, selectedPrefecture])

  // Group overseas instructors by region
  const overseasByRegion = useMemo(() => {
    const america = overseasInstructors.filter((i) => i.region === 'アメリカ')
    const europe = overseasInstructors.filter((i) => i.region === 'ヨーロッパ')
    return { america, europe }
  }, [overseasInstructors])

  // Get list of prefectures with instructors (sorted)
  const prefecturesWithInstructors = useMemo(() => {
    return Object.keys(instructorCounts).sort()
  }, [instructorCounts])

  // Group prefectures by region
  const prefecturesByRegion = useMemo(() => {
    const regions = {
      '北海道': ['北海道'],
      '東北': ['青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県'],
      '関東': ['茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県'],
      '中部': ['新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県', '愛知県'],
      '近畿': ['三重県', '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県'],
      '中国': ['鳥取県', '島根県', '岡山県', '広島県', '山口県'],
      '四国': ['徳島県', '香川県', '愛媛県', '高知県'],
      '九州・沖縄': ['福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'],
    }

    const result: Record<string, Array<{ name: string; count: number }>> = {}

    Object.entries(regions).forEach(([regionName, prefectures]) => {
      const prefecturesWithCount = prefectures
        .filter((pref) => instructorCounts[pref] > 0)
        .map((pref) => ({ name: pref, count: instructorCounts[pref] }))

      if (prefecturesWithCount.length > 0) {
        result[regionName] = prefecturesWithCount
      }
    })

    return result
  }, [instructorCounts])

  const handlePrefectureClick = (prefectureName: string) => {
    setSelectedPrefecture(prefectureName)
  }

  return (
    <section className="w-full max-w-screen-xl mx-auto px-6 py-16 md:py-24">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
        都道府県から探す
      </h2>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
          <button
            onClick={() => setViewMode('map')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'map'
                ? 'bg-brand-purple text-white'
                : 'text-gray-700 hover:text-brand-purple'
            }`}
          >
            🗾 日本地図から選ぶ
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-brand-purple text-white'
                : 'text-gray-700 hover:text-brand-purple'
            }`}
          >
            📍 都道府県から選ぶ
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Map View */}
        {viewMode === 'map' && (
          <>
            <p className="text-center text-gray-600 mb-2">
              地図から都道府県を選択してください
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500 mb-8">
              <span>💡 地図をクリック・タップで都道府県を選択</span>
              <span>💡 ピンチやスクロールで拡大・縮小</span>
            </div>

            {/* Interactive Japan Map */}
            <div className="relative w-full bg-white rounded-lg shadow-sm mb-8 p-4">
              <JapanMap
                onPrefectureClick={handlePrefectureClick}
                selectedPrefecture={selectedPrefecture}
                instructorCounts={instructorCounts}
              />
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-200 rounded border border-gray-300"></div>
                <span className="text-sm text-gray-600">インストラクターなし</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-200 rounded border border-purple-300"></div>
                <span className="text-sm text-gray-600">インストラクターあり</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-brand-purple rounded border border-purple-400"></div>
                <span className="text-sm text-gray-600">選択中</span>
              </div>
            </div>
          </>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-6">
            <p className="text-center text-gray-600 mb-8">
              地域・都道府県を選択してください（インストラクター在籍: {prefecturesWithInstructors.length}都道府県）
            </p>

            {Object.entries(prefecturesByRegion).map(([region, prefectures]) => {
              // Define region colors using brand colors (subtle and elegant)
              const regionColors: Record<string, { bg: string; border: string; text: string; header: string }> = {
                '北海道': { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', header: 'bg-slate-100' },
                '東北': { bg: 'bg-stone-50', border: 'border-stone-200', text: 'text-stone-700', header: 'bg-stone-100' },
                '関東': { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', header: 'bg-purple-100' },
                '中部': { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700', header: 'bg-sky-100' },
                '近畿': { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', header: 'bg-indigo-100' },
                '中国': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', header: 'bg-amber-100' },
                '四国': { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', header: 'bg-teal-100' },
                '九州・沖縄': { bg: 'bg-neutral-50', border: 'border-neutral-200', text: 'text-neutral-700', header: 'bg-neutral-100' },
              }

              const colors = regionColors[region] || regionColors['九州・沖縄']

              return (
                <div key={region} className={`rounded-lg border ${colors.border} ${colors.bg} p-6`}>
                  <h3 className={`text-xl font-bold ${colors.text} mb-4 pb-2 border-b-2 ${colors.border} ${colors.header} -m-6 mb-4 p-4 rounded-t-lg`}>
                    {region}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {prefectures.map((pref) => (
                      <button
                        key={pref.name}
                        onClick={() => setSelectedPrefecture(pref.name)}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
                          selectedPrefecture === pref.name
                            ? 'bg-slate-700 text-white shadow-md'
                            : `bg-white ${colors.text} hover:bg-slate-50 hover:text-slate-800 border ${colors.border}`
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{pref.name}</span>
                          <span className="text-xs opacity-75">({pref.count})</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Selected Prefecture Info */}
        {selectedPrefecture && (
          <div className="mt-8 p-6 bg-slate-50 rounded-lg border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              {selectedPrefecture}のインストラクター ({selectedInstructors.length}名)
            </h3>
            {selectedInstructors.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {selectedInstructors.map((instructor) => (
                  <Link
                    key={instructor._id}
                    href={`/instructor/${instructor.slug.current}`}
                    className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow border border-slate-200"
                  >
                    <h4 className="font-bold text-gray-900 mb-1">{instructor.name}</h4>
                    {instructor.title && (
                      <p className="text-sm text-brand-purple mb-2">{instructor.title}</p>
                    )}
                    <p className="text-sm text-gray-600 line-clamp-2">{instructor.bio}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">
                現在、{selectedPrefecture}にはインストラクターが登録されていません。
              </p>
            )}
          </div>
        )}
      </div>

      {/* Overseas Instructors Section */}
      {overseasInstructors.length > 0 && (
        <div className="max-w-4xl mx-auto mt-16">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            海外のインストラクター
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* America */}
            {overseasByRegion.america.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">🇺🇸</div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">アメリカ</h4>
                    <p className="text-sm text-gray-600">{overseasByRegion.america.length}名</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {overseasByRegion.america.map((instructor) => (
                    <Link
                      key={instructor._id}
                      href={`/instructor/${instructor.slug.current}`}
                      className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <h5 className="font-bold text-gray-900 mb-1">{instructor.name}</h5>
                      {instructor.title && (
                        <p className="text-xs text-blue-600 mb-1">{instructor.title}</p>
                      )}
                      <p className="text-xs text-gray-600 line-clamp-2">{instructor.bio}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Europe */}
            {overseasByRegion.europe.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">🇪🇺</div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">ヨーロッパ</h4>
                    <p className="text-sm text-gray-600">{overseasByRegion.europe.length}名</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {overseasByRegion.europe.map((instructor) => (
                    <Link
                      key={instructor._id}
                      href={`/instructor/${instructor.slug.current}`}
                      className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <h5 className="font-bold text-gray-900 mb-1">{instructor.name}</h5>
                      {instructor.title && (
                        <p className="text-xs text-blue-600 mb-1">{instructor.title}</p>
                      )}
                      <p className="text-xs text-gray-600 line-clamp-2">{instructor.bio}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
