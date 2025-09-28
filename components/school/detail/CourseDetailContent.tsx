'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CourseDetail } from '@/lib/types/course'

interface CourseDetailContentProps {
  course: CourseDetail
}

export default function CourseDetailContent({ course }: CourseDetailContentProps) {
  const [activeSection, setActiveSection] = useState<string>("")

  return (
    <div className="space-y-8">
      {/* 目次セクション */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">目次</h2>
        <ol className="space-y-2 text-sm">
          {course.sections.map((section, index) => (
            <li key={section.id} className="flex items-start">
              <span className="font-medium mr-2">{index + 1}.</span>
              <a
                href={`#${section.id}`}
                className="text-blue-600 hover:underline transition-colors cursor-pointer"
                onClick={(e) => {
                  e.preventDefault()
                  const element = document.getElementById(section.id)
                  if (element) {
                    const yOffset = -100; // ヘッダーの高さを考慮
                    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
                    window.scrollTo({ top: y, behavior: 'smooth' })
                    setActiveSection(section.id)
                  }
                }}
              >
                {section.title}
              </a>
            </li>
          ))}
        </ol>
      </div>

      {/* 講座セクション */}
      <div className="space-y-8">
        {course.sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-24"
          >
            <div className="border-l-4 border-gray-300 pl-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                {section.title}
              </h2>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* おすすめ対象セクション */}
      {course.recommendations && course.recommendations.length > 0 && (
        <section className="border-l-4 border-gray-300 pl-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            このような方におすすめです
          </h2>
          <ul className="text-gray-700 leading-relaxed space-y-2">
            {course.recommendations.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 受講後の効果セクション */}
      {course.effects && course.effects.length > 0 && (
        <section className="border-l-4 border-gray-300 pl-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            受講後の効果
          </h2>
          <ul className="text-gray-700 leading-relaxed space-y-2">
            {course.effects.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ソーシャルシェアセクション */}
      <div className="mt-12 p-6 bg-gray-50 rounded">
        <h3 className="text-lg font-semibold mb-4 text-center">
          よろしければシェアお願いします
        </h3>
        <div className="flex flex-wrap gap-2 justify-center">
          <button className="bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors rounded">
            Twitter
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors rounded">
            Facebook
          </button>
          <button className="bg-red-600 text-white px-4 py-2 text-sm font-medium hover:bg-red-700 transition-colors rounded">
            Pin it
          </button>
          <button className="bg-green-500 text-white px-4 py-2 text-sm font-medium hover:bg-green-600 transition-colors rounded">
            LINE
          </button>
          <button className="bg-yellow-600 text-white px-4 py-2 text-sm font-medium hover:bg-yellow-700 transition-colors rounded">
            Copy
          </button>
        </div>
      </div>

      {/* インストラクターリンクセクション */}
      {course.instructorInfo && (
        <div className="mt-8 p-6 bg-white border rounded">
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-20 bg-gradient-to-br from-pink-100 to-orange-100 rounded flex items-center justify-center"
            >
              <span className="text-2xl">👩‍🏫</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-600 mb-2">
                {course.instructorInfo.name}
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                {course.instructorInfo.bio}
              </p>
              {course.instructorInfo.profileUrl && (
                <div className="flex items-center text-xs text-gray-500">
                  <span className="mr-2">🔗</span>
                  <a
                    href={course.instructorInfo.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {course.instructorInfo.profileUrl}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}