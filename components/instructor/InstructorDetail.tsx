import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Mail, Phone, Globe, Calendar, Award } from 'lucide-react'
import type { Instructor } from '@/lib/types/instructor'

interface InstructorDetailProps {
  instructor: Instructor
}

export default function InstructorDetail({ instructor }: InstructorDetailProps) {
  const imageUrl = instructor.image?.asset?.url || '/images/placeholder-instructor.jpg'
  const imageAlt = instructor.image?.alt || `${instructor.name}のプロフィール画像`

  return (
    <div className="w-full">
      {/* ヒーローセクション */}
      <section className="bg-gradient-to-br from-pink-50 to-orange-50 py-12 md:py-16">
        <div className="max-w-screen-xl mx-auto px-6">
          {/* パンくずナビ */}
          <nav className="text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-pink-600">ホーム</Link>
            <span className="mx-2">&gt;</span>
            <Link href="/instructor" className="hover:text-pink-600">インストラクター</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-900">{instructor.name}</span>
          </nav>

          {/* プロフィールヘッダー */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* プロフィール画像 */}
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* 基本情報 */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {instructor.name}
              </h1>
              {instructor.title && (
                <p className="text-lg text-blue-600 font-medium mb-4">
                  {instructor.title}
                </p>
              )}

              {/* メタ情報 */}
              <div className="space-y-2 mb-4">
                {instructor.region && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-5 h-5" />
                    <span>{instructor.region}</span>
                  </div>
                )}
              </div>

              {/* 専門分野 */}
              {instructor.specialties && instructor.specialties.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">専門分野</h3>
                  <div className="flex flex-wrap gap-2">
                    {instructor.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="bg-white text-gray-700 px-3 py-1 rounded-full text-sm border border-gray-300"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 自己紹介 */}
              <p className="text-gray-700 leading-relaxed">
                {instructor.bio}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* メインコンテンツ */}
      <section className="max-w-screen-xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 左カラム - メインコンテンツ */}
          <div className="lg:col-span-2 space-y-8">
            {/* 保有資格 */}
            {instructor.certifications && instructor.certifications.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-pink-600" />
                  保有資格
                </h2>
                <div className="space-y-3">
                  {instructor.certifications.map((cert, index) => (
                    <div key={index} className="border-l-4 border-pink-500 pl-4">
                      <h3 className="font-semibold text-gray-900">{cert.title}</h3>
                      {cert.organization && (
                        <p className="text-sm text-gray-600">{cert.organization}</p>
                      )}
                      {cert.year && (
                        <p className="text-sm text-gray-500">{cert.year}年取得</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 経歴 */}
            {instructor.experience && instructor.experience.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-pink-600" />
                  経歴
                </h2>
                <div className="space-y-4">
                  {instructor.experience.map((exp, index) => (
                    <div key={index} className="flex gap-4">
                      {exp.year && (
                        <div className="flex-shrink-0 text-pink-600 font-semibold min-w-[100px]">
                          {exp.year}
                        </div>
                      )}
                      <p className="text-gray-700">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 担当講座 */}
            {instructor.teachingCourses && instructor.teachingCourses.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  担当講座
                </h2>
                <div className="grid gap-4">
                  {instructor.teachingCourses.map((course) => (
                    <Link
                      key={course._id}
                      href={`/school/${course.courseId}`}
                      className={`${course.backgroundClass} p-4 rounded-lg hover:shadow-md transition-shadow`}
                    >
                      <h3 className="font-bold text-gray-900 mb-1">{course.title}</h3>
                      <p className="text-sm text-gray-700">{course.subtitle}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 右カラム - サイドバー */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* 連絡先情報 */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">連絡先</h3>
                <div className="space-y-3">
                  {instructor.email && (
                    <a
                      href={`mailto:${instructor.email}`}
                      className="flex items-center gap-2 text-sm text-gray-700 hover:text-pink-600"
                    >
                      <Mail className="w-4 h-4" />
                      <span>{instructor.email}</span>
                    </a>
                  )}
                  {instructor.phone && (
                    <a
                      href={`tel:${instructor.phone}`}
                      className="flex items-center gap-2 text-sm text-gray-700 hover:text-pink-600"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{instructor.phone}</span>
                    </a>
                  )}
                  {instructor.website && (
                    <a
                      href={instructor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-700 hover:text-pink-600"
                    >
                      <Globe className="w-4 h-4" />
                      <span>ウェブサイト</span>
                    </a>
                  )}
                </div>
              </div>

              {/* SNSリンク */}
              {instructor.socialLinks && instructor.socialLinks.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">SNS</h3>
                  <div className="space-y-2">
                    {instructor.socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-blue-600 hover:underline capitalize"
                      >
                        {social.platform}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* お問い合わせボタン */}
              <Link
                href="/contact"
                className="block w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold text-center px-6 py-3 rounded-lg transition-colors"
              >
                お問い合わせ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
