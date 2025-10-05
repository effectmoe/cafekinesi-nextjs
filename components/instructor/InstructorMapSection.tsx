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

  // Count instructors per prefecture
  const instructorCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    instructors.forEach((instructor) => {
      if (instructor.region) {
        counts[instructor.region] = (counts[instructor.region] || 0) + 1
      }
    })
    return counts
  }, [instructors])

  // Get instructors for selected prefecture
  const selectedInstructors = useMemo(() => {
    if (!selectedPrefecture) return []
    return instructors.filter((instructor) => instructor.region === selectedPrefecture)
  }, [instructors, selectedPrefecture])

  const handlePrefectureClick = (prefectureName: string) => {
    setSelectedPrefecture(prefectureName)
  }

  return (
    <section className="w-full max-w-screen-xl mx-auto px-6 py-16 md:py-24">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
        都道府県から探す
      </h2>
      <p className="text-center text-gray-600 mb-12">
        地図から都道府県を選択してください
      </p>

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
    </section>
  )
}
