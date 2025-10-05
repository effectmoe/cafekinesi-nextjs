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

  const handlePrefectureClick = (prefectureName: string) => {
    setSelectedPrefecture(prefectureName)
  }

  return (
    <section className="w-full max-w-screen-xl mx-auto px-6 py-16 md:py-24">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
        都道府県から探す
      </h2>
      <p className="text-center text-gray-600 mb-2">
        地図から都道府県を選択してください
      </p>
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500 mb-12">
        <span>💡 地図をクリック・タップで都道府県を選択</span>
        <span>💡 ピンチやスクロールで拡大・縮小</span>
        <span>💡 ドラッグで地図を移動</span>
      </div>

      <div className="max-w-4xl mx-auto">
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
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
            <span className="text-sm text-gray-600">インストラクターなし</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-pink-300 rounded"></div>
            <span className="text-sm text-gray-600">インストラクターあり</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-pink-500 rounded"></div>
            <span className="text-sm text-gray-600">選択中</span>
          </div>
        </div>

        {/* Prefectures with Instructors List */}
        {prefecturesWithInstructors.length > 0 && (
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
              インストラクターが在籍している都道府県 ({prefecturesWithInstructors.length}件)
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {prefecturesWithInstructors.map((prefecture) => (
                <button
                  key={prefecture}
                  onClick={() => setSelectedPrefecture(prefecture)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedPrefecture === prefecture
                      ? 'bg-pink-500 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-pink-500 hover:text-pink-500'
                  }`}
                >
                  {prefecture}
                  <span className="ml-1 text-xs opacity-75">({instructorCounts[prefecture]})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected Prefecture Info */}
        {selectedPrefecture && (
          <div className="mt-8 p-6 bg-pink-50 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {selectedPrefecture}のインストラクター ({selectedInstructors.length}名)
            </h3>
            {selectedInstructors.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {selectedInstructors.map((instructor) => (
                  <Link
                    key={instructor._id}
                    href={`/instructor/${instructor.slug.current}`}
                    className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-bold text-gray-900 mb-1">{instructor.name}</h4>
                    {instructor.title && (
                      <p className="text-sm text-blue-600 mb-2">{instructor.title}</p>
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
