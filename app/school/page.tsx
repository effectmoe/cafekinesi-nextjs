import { Metadata } from 'next'
import { publicClient, previewClient } from '@/lib/sanity.client'
import { draftMode } from 'next/headers'
import { groq } from 'next-sanity'
import type { Course } from '@/lib/types/course'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialLinks from '@/components/SocialLinks'
import CoursePillarCard from '@/components/school/CoursePillarCard'
import Link from 'next/link'

// GROQクエリ: 主要講座と子講座を取得
const COURSES_QUERY = groq`*[_type == "course" && isActive == true && (!defined(courseType) || courseType == "main")] | order(order asc) {
  _id,
  courseId,
  title,
  subtitle,
  description,
  image {
    asset->,
    alt
  },
  order,
  courseType,
  price,
  duration,
  "childCourses": *[_type == "course" && parentCourse._ref == ^._id && isActive == true] | order(order asc) {
    _id,
    courseId,
    title,
    subtitle,
    image {
      asset->,
      alt
    },
    order,
    courseType,
    price,
    duration
  }
}`

async function getCourses(): Promise<Course[]> {
  try {
    const draft = await draftMode()
    const isPreview = draft.isEnabled
    const selectedClient = isPreview ? previewClient : publicClient

    const data = await selectedClient.fetch(COURSES_QUERY, {}, {
      cache: isPreview ? 'no-store' : 'force-cache'
    } as any)

    return data || []
  } catch (error) {
    console.error('Failed to fetch courses:', error)
    return []
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const courses = await getCourses()
  const totalCourses = courses.reduce((sum, c) => sum + 1 + (c.childCourses?.length || 0), 0)

  return {
    title: 'スクール・講座一覧 | Cafe Kinesi - キネシオロジー講座',
    description: `カフェキネシオロジーのスクールでは、${totalCourses}種類の講座を開講しています。初心者から上級者まで、レベルに合わせて段階的に学べる講座をご用意。基礎から応用、発展コースまで、あなたのペースで学べます。`,
    keywords: 'キネシオロジー講座, スクール, カフェキネシ, ヒーリング, セラピー, 資格, 認定, 初心者, 上級者',
    openGraph: {
      title: 'スクール・講座一覧 | Cafe Kinesi',
      description: `${totalCourses}種類の講座を開講中。初心者から上級者まで段階的に学べます。`,
      type: 'website',
      url: 'https://cafekinesi.com/school',
      images: ['/og-image.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'スクール・講座一覧 | Cafe Kinesi',
      description: `${totalCourses}種類の講座を開講中。初心者から上級者まで段階的に学べます。`,
    },
    alternates: {
      canonical: 'https://cafekinesi.com/school',
    },
  }
}

// ISR設定（30分ごとに再生成）
export const revalidate = 1800

export default async function SchoolPage() {
  const courses = await getCourses()
  const totalCourses = courses.reduce((sum, c) => sum + 1 + (c.childCourses?.length || 0), 0)

  // Schema.org: BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'ホーム',
        item: 'https://cafekinesi.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'スクール',
        item: 'https://cafekinesi.com/school',
      },
    ],
  }

  // Schema.org: ItemList (講座一覧)
  // position値を正しく連番にするため、全ての講座を1つの配列に展開してから番号を振る
  const allCourseItems: any[] = []

  courses.forEach((course) => {
    // 主要講座を追加
    allCourseItems.push({
      '@type': 'Course',
      name: course.title,
      description: course.subtitle,
      url: `https://cafekinesi.com/school/${course.courseId}`,
      provider: {
        '@type': 'EducationalOrganization',
        name: 'Cafe Kinesi',
        url: 'https://cafekinesi.com',
      },
    })

    // 子講座を追加
    if (course.childCourses) {
      course.childCourses.forEach((child) => {
        allCourseItems.push({
          '@type': 'Course',
          name: child.title,
          description: child.subtitle,
          url: `https://cafekinesi.com/school/${child.courseId}`,
          provider: {
            '@type': 'EducationalOrganization',
            name: 'Cafe Kinesi',
            url: 'https://cafekinesi.com',
          },
        })
      })
    }
  })

  const courseListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Cafe Kinesi 講座一覧',
    description: 'カフェキネシオロジーで開講している全講座',
    numberOfItems: totalCourses,
    itemListElement: allCourseItems.map((courseItem, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: courseItem,
    })),
  }

  return (
    <>
      {/* 構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseListSchema) }}
      />

      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="relative">
          {/* ヒーローセクション */}
          <section className="bg-gradient-to-br from-[#8B5A3C]/10 via-orange-50 to-white py-16 md:py-24">
            <div className="max-w-screen-xl mx-auto px-6">
              {/* パンくずリスト */}
              <nav className="mb-6" aria-label="パンくずリスト">
                <ol className="flex items-center gap-2 text-sm text-gray-600" itemScope itemType="https://schema.org/BreadcrumbList">
                  <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    <Link href="/" className="hover:text-[#8B5A3C] transition-colors" itemProp="item">
                      <span itemProp="name">ホーム</span>
                    </Link>
                    <meta itemProp="position" content="1" />
                  </li>
                  <li className="text-gray-400">/</li>
                  <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    <span className="text-gray-900 font-medium" itemProp="name">スクール</span>
                    <meta itemProp="position" content="2" />
                  </li>
                </ol>
              </nav>

              {/* タイトル */}
              <h1 className="font-noto-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                スクール・講座一覧
              </h1>

              {/* 説明 */}
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mb-8">
                カフェキネシオロジーは、どなたでも気軽に始められるヒーリング技術です。
                基礎から応用まで、段階的に学べる<strong className="text-[#8B5A3C]">{totalCourses}種類</strong>の講座をご用意しています。
              </p>

              {/* 統計情報 */}
              <div className="flex flex-wrap gap-6">
                <div className="bg-white rounded-lg shadow-md px-6 py-4">
                  <div className="text-3xl font-bold text-[#8B5A3C] mb-1">{courses.length}</div>
                  <div className="text-sm text-gray-600">主要講座</div>
                </div>
                <div className="bg-white rounded-lg shadow-md px-6 py-4">
                  <div className="text-3xl font-bold text-[#8B5A3C] mb-1">
                    {courses.reduce((sum, c) => sum + (c.childCourses?.length || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600">発展コース</div>
                </div>
                <div className="bg-white rounded-lg shadow-md px-6 py-4">
                  <div className="text-3xl font-bold text-[#8B5A3C] mb-1">{totalCourses}</div>
                  <div className="text-sm text-gray-600">総講座数</div>
                </div>
              </div>
            </div>
          </section>

          {/* 講座一覧セクション */}
          <section className="max-w-screen-xl mx-auto px-6 py-12" itemScope itemType="https://schema.org/ItemList">
            <meta itemProp="name" content="Cafe Kinesi 講座一覧" />
            <meta itemProp="description" content="カフェキネシオロジーで開講している全講座" />

            {/* セクションヘッダー */}
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                開講中の講座
              </h2>
              <p className="text-gray-600">
                各講座の詳細は、カードをクリックしてご確認ください。
                初心者の方は<strong>レベル1</strong>から始めることをおすすめします。
              </p>
            </div>

            {/* 講座カードリスト */}
            <div className="space-y-6">
              {courses.map((course) => (
                <CoursePillarCard key={course._id} course={course} />
              ))}
            </div>

            {/* 空の場合 */}
            {courses.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">現在、開講中の講座はありません。</p>
              </div>
            )}
          </section>

          {/* CTAセクション */}
          <section className="bg-[#8B5A3C] text-white py-16">
            <div className="max-w-screen-xl mx-auto px-6 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                まずは体験してみませんか？
              </h2>
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
                カフェキネシオロジーの魅力を実際に体験していただける、
                体験講座を定期的に開催しています。お気軽にご参加ください。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-block bg-white text-[#8B5A3C] px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
                >
                  お問い合わせ
                </Link>
                <Link
                  href="/events"
                  className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors"
                >
                  イベント一覧を見る
                </Link>
              </div>
            </div>
          </section>
        </main>

        <SocialLinks />
        <Footer />
      </div>
    </>
  )
}
