'use client'

import { Course } from '@/lib/types/course'
import Link from 'next/link'

interface CourseComparisonTableProps {
  courses: Course[]
}

export default function CourseComparisonTable({ courses }: CourseComparisonTableProps) {
  // 全講座（親講座+子講座）をフラット化
  const allCourses: Course[] = []

  courses.forEach(course => {
    allCourses.push(course)
    if (course.childCourses && course.childCourses.length > 0) {
      allCourses.push(...course.childCourses)
    }
  })

  // 難易度を計算（orderベース）
  const getDifficulty = (order: number) => {
    if (order <= 2) return '★☆☆☆☆'
    if (order <= 4) return '★★☆☆☆'
    if (order <= 6) return '★★★☆☆'
    if (order <= 8) return '★★★★☆'
    return '★★★★★'
  }

  // 対象者を判定
  const getTarget = (course: Course) => {
    if ((course.courseId && course.courseId.includes('kinesi1')) || course.order === 1) {
      return '初心者・誰でもOK'
    }
    return 'カフェキネシⅠ修了者'
  }

  return (
    <section className="my-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        全講座比較表
      </h2>
      <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
        すべての講座を一覧で比較できます。あなたに合った講座を見つけてください。
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm bg-white shadow-lg">
          <thead style={{ backgroundColor: '#8B5A3C' }}>
            <tr>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-white">講座名</th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-white">タイプ</th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-white">難易度</th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-white">受講料</th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-white">所要時間</th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-white">対象者</th>
            </tr>
          </thead>
          <tbody>
            {allCourses.map((course, index) => (
              <tr key={course._id} className="hover:bg-gray-50 transition-colors">
                <td className="border border-gray-300 px-4 py-3">
                  <Link href={`/school/${course.courseId}`} className="block hover:text-[#8B5A3C] transition-colors">
                    <div className="font-semibold text-gray-900">{course.title}</div>
                    {course.subtitle && (
                      <div className="text-xs text-gray-600 mt-1">{course.subtitle}</div>
                    )}
                  </Link>
                </td>
                <td className="border border-gray-300 px-2 py-3 text-center min-w-[90px]">
                  <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap inline-block ${course.courseType === 'auxiliary' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {course.courseType === 'auxiliary' ? '発展コース' : '主要講座'}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  <span className="text-yellow-500 text-base">{getDifficulty(course.order || index + 1)}</span>
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  {course.price ? (
                    <div>
                      <div className="font-bold text-[#8B5A3C]">
                        {typeof course.price === 'object' && 'amount' in course.price
                          ? `${course.price.amount.toLocaleString()}円`
                          : `${course.price}円`}
                      </div>
                      {typeof course.price === 'object' && 'note' in course.price && course.price.note && (
                        <div className="text-xs text-gray-500 mt-1">{course.price.note.split('｜')[0]}</div>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400">お問い合わせ</span>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  {course.duration ? (
                    <div>
                      {typeof course.duration === 'object' && 'hours' in course.duration
                        ? `${course.duration.hours}時間`
                        : course.duration}
                      {typeof course.duration === 'object' && 'sessions' in course.duration && (
                        <div className="text-xs text-gray-500 mt-1">全{course.duration.sessions}回</div>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm">
                  {getTarget(course)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* モバイル向けカード表示 */}
      <div className="md:hidden mt-8 space-y-4">
        {allCourses.map((course, index) => (
          <div key={course._id} className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
            <Link href={`/school/${course.courseId}`} className="block hover:text-[#8B5A3C] transition-colors">
              <div className="font-bold text-lg text-gray-900 mb-2">{course.title}</div>
              {course.subtitle && (
                <div className="text-sm text-gray-600 mb-3">{course.subtitle}</div>
              )}
            </Link>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">タイプ：</span>
                <span className={`text-xs px-2 py-1 rounded-full ${course.courseType === 'auxiliary' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                  {course.courseType === 'auxiliary' ? '発展コース' : '主要講座'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">難易度：</span>
                <span className="text-yellow-500">{getDifficulty(course.order || index + 1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">受講料：</span>
                <span className="font-bold text-[#8B5A3C]">
                  {course.price
                    ? typeof course.price === 'object' && 'amount' in course.price
                      ? `${course.price.amount.toLocaleString()}円`
                      : `${course.price}円`
                    : 'お問い合わせ'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">所要時間：</span>
                <span>
                  {course.duration
                    ? typeof course.duration === 'object' && 'hours' in course.duration
                      ? `${course.duration.hours}時間`
                      : course.duration
                    : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">対象者：</span>
                <span>{getTarget(course)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
