import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialLinks from '@/components/SocialLinks'
import CourseDetailContent from '@/components/school/detail/CourseDetailContent'
import CourseDetailSidebar from '@/components/school/detail/CourseDetailSidebar'
import { courseDetailDataMap } from '@/components/school/detail/CourseDetailData'
import { defaultCoursesData } from '@/components/school/CourseData'
import { CourseDetail } from '@/lib/types/course'
import { client, publicClient, previewClient } from '@/lib/sanity.client'
import { draftMode } from 'next/headers'
import { groq } from 'next-sanity'
import { COURSE_DETAIL_QUERY } from '@/lib/queries'

interface PageProps {
  params: Promise<{ courseId: string }>
}

async function getCourseDetailData(courseId: string): Promise<CourseDetail | null> {
  try {
    const draft = await draftMode()
    const isPreview = draft.isEnabled
    const selectedClient = isPreview ? previewClient : publicClient

    // Sanityからデータを取得
    const sanityData = await selectedClient.fetch(
      COURSE_DETAIL_QUERY,
      { courseId },
      {
        cache: isPreview ? 'no-store' : 'force-cache'
      } as any
    )

    if (sanityData) {
      return sanityData as CourseDetail
    }

    // Sanityにデータがない場合は静的データから取得
    const courseDetailData = courseDetailDataMap[courseId]
    if (courseDetailData) {
      return {
        ...courseDetailData,
        _id: `detail-${courseId}`
      }
    }

    // 基本的な講座データのみの場合は拡張して返す
    const basicCourse = defaultCoursesData.find(course => course.courseId === courseId)
    if (basicCourse) {
      return {
        ...basicCourse,
        _id: `basic-${courseId}`,
        tableOfContents: ['講座概要', '特徴', 'おすすめの方'],
        sections: [
          {
            id: 'overview',
            title: '講座概要',
            content: basicCourse.description
          },
          {
            id: 'features',
            title: '特徴',
            content: basicCourse.features.map(feature => `• ${feature}`).join('\n')
          }
        ]
      }
    }

    return null
  } catch (error) {
    console.error('Failed to fetch course detail data:', error)

    // エラー時は静的データにフォールバック
    const courseDetailData = courseDetailDataMap[courseId]
    if (courseDetailData) {
      return {
        ...courseDetailData,
        _id: `detail-${courseId}`
      }
    }

    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { courseId } = await params
  const course = await getCourseDetailData(courseId)

  if (!course) {
    return {
      title: '講座が見つかりません | Cafe Kinesi',
      description: '指定された講座は見つかりませんでした。'
    }
  }

  return {
    title: `${course.title} ${course.subtitle} | Cafe Kinesi`,
    description: course.description,
    keywords: `${course.title}, キネシオロジー, スクール, 講座, ヒーリング, セラピー`,
    openGraph: {
      title: `${course.title} ${course.subtitle} | Cafe Kinesi`,
      description: course.description,
      images: course.image ? [course.image.asset.url] : ['/og-image.jpg'],
    },
  }
}

// 静的パスの生成（ビルド時の最適化）
export async function generateStaticParams() {
  const courseIds = [
    'kinesi1',
    'peach-touch',
    'chakra-kinesi',
    'help',
    'tao',
    'happy-aura'
  ]

  return courseIds.map((courseId) => ({
    courseId: courseId,
  }))
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { courseId } = await params
  const course = await getCourseDetailData(courseId)

  if (!course) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        {/* パンくずナビゲーション */}
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">
              ホーム
            </Link>
            <span className="mx-2">&gt;</span>
            <Link href="/school" className="hover:text-primary transition-colors">
              講座一覧
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-foreground">{course.title}</span>
          </nav>
        </div>

        {/* 講座ヘッダー */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            {course.image && (
              <img
                src={course.image.asset.url}
                alt={course.image.alt || course.title}
                className="w-full max-w-2xl mx-auto mb-6 rounded-lg"
              />
            )}
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {course.title}
            </h1>
            <p className="text-xl text-gray-700">{course.subtitle}</p>
          </div>
        </div>

        {/* メインコンテンツエリア */}
        <div className="max-w-6xl mx-auto px-6 pb-12">
          {/* モバイル専用レイアウト（縦積み） */}
          <div className="lg:hidden">
            <div className="space-y-8">
              <CourseDetailContent course={course} />
              <CourseDetailSidebar course={course} />
            </div>
          </div>

          {/* PC専用レイアウト（2カラム） */}
          <div className="hidden lg:block">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* 左カラム（メインコンテンツ） - 2/3幅 */}
              <div className="lg:col-span-2">
                <CourseDetailContent course={course} />
              </div>

              {/* 右カラム（サイドバー） - 1/3幅 */}
              <div className="lg:col-span-1">
                <CourseDetailSidebar course={course} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <SocialLinks />
      <Footer />
    </div>
  )
}