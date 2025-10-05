import Image from 'next/image'
import Link from 'next/link'
import type { Instructor } from '@/lib/types/instructor'

interface InstructorListSectionProps {
  instructors: Instructor[]
}

export default function InstructorListSection({ instructors }: InstructorListSectionProps) {
  // 地域ごとにグループ化（例：高知のインストラクター）
  const instructorsByRegion = instructors.reduce((acc, instructor) => {
    const region = instructor.region || 'その他'
    if (!acc[region]) {
      acc[region] = []
    }
    acc[region].push(instructor)
    return acc
  }, {} as Record<string, Instructor[]>)

  return (
    <section className="w-full max-w-screen-xl mx-auto px-6 py-16 md:py-24">
      {Object.keys(instructorsByRegion).length > 0 ? (
        Object.entries(instructorsByRegion).map(([region, regionInstructors]) => (
          <div key={region} className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              {region}のインストラクター
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {regionInstructors.map((instructor) => {
                const imageUrl = instructor.image?.asset?.url || '/images/placeholder-instructor.jpg'
                const imageAlt = instructor.image?.alt || `${instructor.name}のプロフィール画像`

                return (
                  <div
                    key={instructor._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* インストラクター画像 */}
                    <div className="relative aspect-[4/3] bg-gray-100">
                      <Image
                        src={imageUrl}
                        alt={imageAlt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>

                    {/* インストラクター情報 */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {instructor.name}
                      </h3>
                      {instructor.title && (
                        <p className="text-sm text-blue-600 font-medium mb-3">
                          {instructor.title}
                        </p>
                      )}
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {instructor.bio}
                      </p>

                      {/* 専門分野タグ */}
                      {instructor.specialties && instructor.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {instructor.specialties.slice(0, 3).map((specialty, index) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* 詳細ページへのリンク */}
                      <Link
                        href={`/instructor/${instructor.slug.current}`}
                        className="inline-block w-full text-center bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded transition-colors"
                      >
                        詳しく見る
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            現在、インストラクター情報を準備中です。
          </p>
        </div>
      )}
    </section>
  )
}
