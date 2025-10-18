import { Metadata } from 'next'
import { publicClient, previewClient } from '@/lib/sanity.client'
import { draftMode } from 'next/headers'
import { groq } from 'next-sanity'
import type { Course, SchoolPageData } from '@/lib/types/course'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialLinks from '@/components/SocialLinks'
import CoursePillarCard from '@/components/school/CoursePillarCard'
import CourseComparisonTable from '@/components/school/CourseComparisonTable'
import Link from 'next/link'
import Image from 'next/image'

// GROQクエリ: 主要講座と子講座を取得
const COURSES_QUERY = groq`*[_type == "course" && isActive == true && (!defined(courseType) || courseType == "main")] | order(order asc) {
  _id,
  courseId,
  title,
  subtitle,
  description,
  recommendations,
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
    recommendations,
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

// スクールページ取得（ピラーページコンテンツ含む）
const SCHOOL_PAGE_QUERY = groq`*[_type == "schoolPage" && isActive == true][0] {
  _id,
  title,
  lastUpdated,
  _updatedAt,
  selectionGuide {
    title,
    description,
    image {
      asset->,
      alt
    },
    points[] {
      title,
      description
    }
  },
  learningFlow {
    title,
    description,
    steps[] {
      number,
      title,
      description,
      image {
        asset->,
        alt
      }
    }
  },
  faq {
    title,
    items[] {
      question,
      answer
    }
  },
  certification {
    title,
    description,
    image {
      asset->,
      alt
    },
    benefits[]
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

async function getSchoolPage(): Promise<SchoolPageData | null> {
  try {
    const draft = await draftMode()
    const isPreview = draft.isEnabled
    const selectedClient = isPreview ? previewClient : publicClient

    const data = await selectedClient.fetch(SCHOOL_PAGE_QUERY, {}, {
      cache: isPreview ? 'no-store' : 'force-cache'
    } as any)

    return data
  } catch (error) {
    console.error('Failed to fetch school page:', error)
    return null
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
  const [courses, pageContent] = await Promise.all([
    getCourses(),
    getSchoolPage()
  ])

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

  // Schema.org: ItemList (価格・時間情報を含む)
  const allCourseItems: any[] = []
  courses.forEach((course) => {
    const courseSchema: any = {
      '@type': 'Course',
      name: course.title,
      description: course.subtitle || course.description,
      url: `https://cafekinesi.com/school/${course.courseId}`,
      provider: {
        '@type': 'EducationalOrganization',
        name: 'Cafe Kinesi',
        url: 'https://cafekinesi.com',
      },
    }

    // 価格情報を追加
    if (course.price) {
      const priceAmount = typeof course.price === 'object' && 'amount' in course.price
        ? course.price.amount
        : course.price
      courseSchema.offers = {
        '@type': 'Offer',
        price: priceAmount,
        priceCurrency: 'JPY',
      }
    }

    // 所要時間を追加
    if (course.duration) {
      const hours = typeof course.duration === 'object' && 'hours' in course.duration
        ? course.duration.hours
        : course.duration
      courseSchema.timeRequired = `PT${hours}H`
    }

    allCourseItems.push(courseSchema)

    if (course.childCourses) {
      course.childCourses.forEach((child) => {
        const childSchema: any = {
          '@type': 'Course',
          name: child.title,
          description: child.subtitle || child.description,
          url: `https://cafekinesi.com/school/${child.courseId}`,
          provider: {
            '@type': 'EducationalOrganization',
            name: 'Cafe Kinesi',
            url: 'https://cafekinesi.com',
          },
        }

        // 子講座の価格情報
        if (child.price) {
          const priceAmount = typeof child.price === 'object' && 'amount' in child.price
            ? child.price.amount
            : child.price
          childSchema.offers = {
            '@type': 'Offer',
            price: priceAmount,
            priceCurrency: 'JPY',
          }
        }

        // 子講座の所要時間
        if (child.duration) {
          const hours = typeof child.duration === 'object' && 'hours' in child.duration
            ? child.duration.hours
            : child.duration
          childSchema.timeRequired = `PT${hours}H`
        }

        allCourseItems.push(childSchema)
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

  // Schema.org: FAQPage
  const faqSchema = pageContent?.faq?.items ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pageContent.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  } : null

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
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="relative">
          {/* ヒーローセクション */}
          <section className="bg-gradient-to-br from-[#8B5A3C]/10 via-orange-50 to-white py-16 md:py-24">
            <div className="max-w-screen-xl mx-auto px-6">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <nav aria-label="パンくずリスト">
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
                {(pageContent?.lastUpdated || pageContent?._updatedAt) && (
                  <time className="text-xs text-gray-500" dateTime={pageContent.lastUpdated || pageContent._updatedAt}>
                    最終更新: {new Date(pageContent.lastUpdated || pageContent._updatedAt || '').toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                )}
              </div>

              <h1 className="font-noto-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                スクール・講座一覧
              </h1>

              <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mb-8">
                カフェキネシオロジーは、どなたでも気軽に始められるヒーリング技術です。
                基礎から応用まで、段階的に学べる<strong className="text-[#8B5A3C]">{totalCourses}種類</strong>の講座をご用意しています。
              </p>

              <div className="flex flex-wrap gap-2 sm:gap-4 md:gap-6">
                <div className="bg-white rounded-lg shadow-md px-3 py-3 sm:px-6 sm:py-4">
                  <div className="text-2xl sm:text-3xl font-bold text-[#8B5A3C] mb-1">{courses.length}</div>
                  <div className="text-xs sm:text-sm text-gray-600">主要講座</div>
                </div>
                <div className="bg-white rounded-lg shadow-md px-3 py-3 sm:px-6 sm:py-4">
                  <div className="text-2xl sm:text-3xl font-bold text-[#8B5A3C] mb-1">
                    {courses.reduce((sum, c) => sum + (c.childCourses?.length || 0), 0)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">発展コース</div>
                </div>
                <div className="bg-white rounded-lg shadow-md px-3 py-3 sm:px-6 sm:py-4">
                  <div className="text-2xl sm:text-3xl font-bold text-[#8B5A3C] mb-1">{totalCourses}</div>
                  <div className="text-xs sm:text-sm text-gray-600">総講座数</div>
                </div>
              </div>
            </div>
          </section>

          {/* 講座の選び方ガイド */}
          {pageContent?.selectionGuide && (
            <section className="max-w-screen-xl mx-auto px-6 py-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                {pageContent.selectionGuide.title}
              </h2>

              {pageContent.selectionGuide.description && (
                <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto mb-12 text-center">
                  {pageContent.selectionGuide.description}
                </p>
              )}

              {pageContent.selectionGuide.image && (
                <div className="relative w-full max-w-2xl mx-auto h-64 md:h-96 mb-12 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={pageContent.selectionGuide.image.asset.url}
                    alt={pageContent.selectionGuide.image.alt || '講座の選び方'}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {pageContent.selectionGuide.points && pageContent.selectionGuide.points.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {pageContent.selectionGuide.points.map((point, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
                      <div className="text-[#8B5A3C] text-4xl font-bold mb-4">{index + 1}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{point.title}</h3>
                      <p className="text-gray-700 leading-relaxed">{point.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* 学習の流れ */}
          {pageContent?.learningFlow && (
            <section className="bg-white py-16">
              <div className="max-w-screen-xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                  {pageContent.learningFlow.title}
                </h2>

                {pageContent.learningFlow.description && (
                  <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto mb-12 text-center">
                    {pageContent.learningFlow.description}
                  </p>
                )}

                {pageContent.learningFlow.steps && pageContent.learningFlow.steps.length > 0 && (
                  <div className="space-y-8">
                    {pageContent.learningFlow.steps.map((step, index) => (
                      <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}>
                        {step.image && (
                          <div className="relative w-full md:w-1/2 h-64 rounded-lg overflow-hidden shadow-lg">
                            <Image
                              src={step.image.asset.url}
                              alt={step.image.alt || `ステップ${step.number}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="w-full md:w-1/2">
                          <div className="inline-block bg-[#8B5A3C] text-white px-4 py-2 rounded-full font-bold mb-4">
                            STEP {step.number}
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                          <p className="text-gray-700 leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 講座比較表 */}
          <div className="max-w-screen-xl mx-auto px-6">
            <CourseComparisonTable courses={courses} />
          </div>

          {/* 講座一覧セクション */}
          <section className="max-w-screen-xl mx-auto px-6 py-12" itemScope itemType="https://schema.org/ItemList">
            <meta itemProp="name" content="Cafe Kinesi 講座一覧" />
            <meta itemProp="description" content="カフェキネシオロジーで開講している全講座" />

            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                開講中の講座
              </h2>
              <p className="text-gray-600">
                各講座の詳細は、カードをクリックしてご確認ください。
                初心者の方は<strong>レベル1</strong>から始めることをおすすめします。
              </p>
            </div>

            <div className="space-y-6">
              {courses.map((course) => (
                <CoursePillarCard key={course._id} course={course} />
              ))}
            </div>

            {courses.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">現在、開講中の講座はありません。</p>
              </div>
            )}
          </section>

          {/* FAQ */}
          {pageContent?.faq && pageContent.faq.items && pageContent.faq.items.length > 0 && (
            <section className="bg-white py-16" id="faq">
              <div className="max-w-screen-xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                  {pageContent.faq.title}
                </h2>

                <dl className="max-w-3xl mx-auto space-y-6">
                  {pageContent.faq.items.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                      <dt className="font-bold text-lg text-gray-900 mb-3 flex items-start">
                        <span className="text-[#8B5A3C] mr-2 flex-shrink-0">Q{index + 1}.</span>
                        <span>{item.question}</span>
                      </dt>
                      <dd className="text-gray-700 leading-relaxed pl-8 whitespace-pre-wrap">
                        <span className="font-semibold text-gray-600 mr-2">A.</span>
                        {item.answer}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </section>
          )}

          {/* 資格・認定 */}
          {pageContent?.certification && (
            <section className="max-w-screen-xl mx-auto px-6 py-16">
              <div className="bg-gradient-to-br from-[#8B5A3C]/5 to-orange-50 rounded-2xl p-8 md:p-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                  {pageContent.certification.title}
                </h2>

                {pageContent.certification.description && (
                  <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto mb-8 text-center">
                    {pageContent.certification.description}
                  </p>
                )}

                {pageContent.certification.image && (
                  <div className="relative w-full max-w-2xl mx-auto h-64 md:h-80 mb-8 rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src={pageContent.certification.image.asset.url}
                      alt={pageContent.certification.image.alt || '資格・認定'}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {pageContent.certification.benefits && pageContent.certification.benefits.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                    {pageContent.certification.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm">
                        <span className="text-[#8B5A3C] text-xl">✓</span>
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

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
