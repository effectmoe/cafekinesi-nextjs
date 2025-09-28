import { Metadata } from 'next'
import SchoolHero from '@/components/school/SchoolHero'
import CourseList from '@/components/school/CourseList'
import CourseCard from '@/components/school/CourseCard'
import CourseCTA from '@/components/school/CourseCTA'
import { defaultCoursesData } from '@/components/school/CourseData'
import { client, publicClient, previewClient } from '@/lib/sanity.client'
import { draftMode } from 'next/headers'
import { groq } from 'next-sanity'
import type { Course, SchoolPageData } from '@/lib/types/course'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialLinks from '@/components/SocialLinks'

// Sanityクエリ
const SCHOOL_PAGE_QUERY = groq`*[_type == "schoolPage"][0] {
  _id,
  title,
  heroSection,
  courseListTitle,
  ctaSection,
  featuredCourses[]-> {
    _id,
    courseId,
    title,
    subtitle,
    description,
    features,
    image {
      asset->,
      alt
    },
    backgroundClass,
    recommendations,
    effects,
    order,
    isActive,
    price,
    duration,
    prerequisites,
    applicationLink
  },
  seo,
  isActive
}`

const COURSES_QUERY = groq`*[_type == "course" && isActive == true] | order(order asc) {
  _id,
  courseId,
  title,
  subtitle,
  description,
  features,
  image {
    asset->,
    alt
  },
  backgroundClass,
  recommendations,
  effects,
  order,
  isActive,
  price,
  duration,
  prerequisites,
  applicationLink
}`

async function getSchoolPageData(): Promise<SchoolPageData | null> {
  try {
    const draft = await draftMode()
    const isPreview = draft.isEnabled
    const selectedClient = isPreview ? previewClient : publicClient

    const data = await selectedClient.fetch(SCHOOL_PAGE_QUERY, {}, {
      cache: isPreview ? 'no-store' : 'force-cache'
    } as any)

    return data
  } catch (error) {
    console.error('Failed to fetch school page data:', error)
    return null
  }
}

async function getCourses(): Promise<Course[]> {
  try {
    const draft = await draftMode()
    const isPreview = draft.isEnabled
    const selectedClient = isPreview ? previewClient : publicClient

    const data = await selectedClient.fetch(COURSES_QUERY, {}, {
      cache: isPreview ? 'no-store' : 'force-cache'
    } as any)

    // Sanityからデータがない場合はデフォルトを使用
    if (!data || data.length === 0) {
      return defaultCoursesData.map((course, index) => ({
        ...course,
        _id: `default-${course.courseId}`
      })) as Course[]
    }

    return data
  } catch (error) {
    console.error('Failed to fetch courses:', error)
    // エラー時はデフォルトデータを返す
    return defaultCoursesData.map((course, index) => ({
      ...course,
      _id: `default-${course.courseId}`
    })) as Course[]
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const schoolPage = await getSchoolPageData()

  if (schoolPage?.seo) {
    return {
      title: schoolPage.seo.title || 'スクール | Cafe Kinesi',
      description: schoolPage.seo.description || 'カフェキネシオロジーの各講座をご紹介します。どなたでも気軽に始められる講座から、専門的な技術まで幅広く学べます。',
      keywords: schoolPage.seo.keywords || 'キネシオロジー, スクール, 講座, ヒーリング, セラピー',
      openGraph: {
        title: schoolPage.seo.title || 'スクール | Cafe Kinesi',
        description: schoolPage.seo.description || 'カフェキネシオロジーの各講座をご紹介します。',
        images: schoolPage.seo.ogImage ? [schoolPage.seo.ogImage.asset.url] : ['/og-image.jpg'],
      },
    }
  }

  return {
    title: 'スクール | Cafe Kinesi',
    description: 'カフェキネシオロジーの各講座をご紹介します。どなたでも気軽に始められる講座から、専門的な技術まで幅広く学べます。',
    keywords: 'キネシオロジー, スクール, 講座, ヒーリング, セラピー',
    openGraph: {
      title: 'スクール | Cafe Kinesi',
      description: 'カフェキネシオロジーの各講座をご紹介します。',
      images: ['/og-image.jpg'],
    },
  }
}

// ISR設定（30分ごとに再生成）
export const revalidate = 1800

export default async function SchoolPage() {
  const [schoolPageData, courses] = await Promise.all([
    getSchoolPageData(),
    getCourses()
  ])

  // ページ設定がない、または非公開の場合はデフォルト値を使用
  const heroSection = schoolPageData?.heroSection || {
    title: 'スクール',
    description: 'カフェキネシオロジーは、どなたでも気軽に始められるヒーリング技術です。基礎から応用まで、段階的に学べる6つの講座をご用意しています。あなたのペースで、楽しみながら技術を身につけていきましょう。'
  }

  const ctaSection = schoolPageData?.ctaSection || {
    title: 'まずは体験してみませんか？',
    description: 'カフェキネシオロジーの魅力を実際に体験していただける、体験講座を定期的に開催しています。お気軽にご参加ください。',
    primaryButton: { text: '体験講座のご案内' },
    secondaryButton: { text: 'お問い合わせ' }
  }

  const courseListTitle = schoolPageData?.courseListTitle || '講座一覧'

  // 注目講座が設定されている場合はそれを使用、なければ全講座を使用
  const displayCourses = schoolPageData?.featuredCourses && schoolPageData.featuredCourses.length > 0
    ? schoolPageData.featuredCourses
    : courses

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="relative">
        {/* ヒーローセクション */}
        <SchoolHero
          title={heroSection.title}
          description={heroSection.description}
        />

        {/* メインコンテンツ */}
        <section className="w-full max-w-screen-xl mx-auto px-6 pb-12">
          {/* 講座一覧（目次） */}
          <CourseList courses={displayCourses} title={courseListTitle} />

          {/* 各講座の詳細 */}
          <div className="space-y-8">
            {displayCourses.map((course) => (
              <CourseCard key={course._id || course.courseId} course={course} />
            ))}
          </div>
        </section>

        {/* CTAセクション */}
        <CourseCTA
          title={ctaSection.title}
          description={ctaSection.description}
          primaryButton={ctaSection.primaryButton}
          secondaryButton={ctaSection.secondaryButton}
        />
      </main>
      <SocialLinks />
      <Footer />
    </div>
  )
}