import { Metadata } from 'next'
import { groq } from 'next-sanity'
import { draftMode } from 'next/headers'
import { publicClient, previewClient } from '@/lib/sanity.client'
import { INSTRUCTORS_QUERY } from '@/lib/queries'
import type { Instructor } from '@/lib/types/instructor'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialLinks from '@/components/SocialLinks'
import InstructorHero from '@/components/instructor/InstructorHero'
import InstructorCard from '@/components/instructor/InstructorCard'

// Sanityから公開インストラクターを取得
async function getInstructors(): Promise<Instructor[]> {
  try {
    const draft = await draftMode()
    const isPreview = draft.isEnabled
    const selectedClient = isPreview ? previewClient : publicClient

    const data = await selectedClient.fetch(INSTRUCTORS_QUERY, {}, {
      cache: isPreview ? 'no-store' : 'force-cache'
    } as any)

    return data || []
  } catch (error) {
    console.error('Failed to fetch instructors:', error)
    return []
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'インストラクター紹介 | Cafe Kinesi',
    description: 'カフェキネシオロジー公認インストラクターをご紹介します。経験豊富なインストラクターが、あなたの学びをサポートします。',
    keywords: 'カフェキネシ, インストラクター, 講師, キネシオロジー, 認定講師',
    openGraph: {
      title: 'インストラクター紹介 | Cafe Kinesi',
      description: 'カフェキネシオロジー公認インストラクターをご紹介します。',
      images: ['/og-image.jpg'],
    },
  }
}

// ISR設定（30分ごとに再生成）
export const revalidate = 1800

export default async function InstructorPage() {
  const instructors = await getInstructors()

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="relative">
        {/* ヒーローセクション */}
        <InstructorHero />

        {/* メインコンテンツ */}
        <section className="w-full max-w-screen-xl mx-auto px-6 py-12">
          {/* ページタイトル */}
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              公認インストラクター
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              カフェキネシオロジーの技術を習得し、認定を受けた経験豊富なインストラクターです。
              それぞれの地域で講座を開催し、多くの方々の学びをサポートしています。
            </p>
          </div>

          {/* インストラクター一覧 */}
          {instructors.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {instructors.map((instructor) => (
                <InstructorCard key={instructor._id} instructor={instructor} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                現在、インストラクター情報を準備中です。
              </p>
            </div>
          )}

          {/* CTAセクション */}
          <div className="mt-16 bg-gradient-to-br from-pink-50 to-orange-50 rounded-lg p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              インストラクターになりませんか？
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              カフェキネシオロジーのインストラクター認定講座を受講することで、
              あなたも公認インストラクターとして活動できます。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/school/peach-touch"
                className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                インストラクター講座を見る
              </a>
              <a
                href="/contact"
                className="inline-block bg-white hover:bg-gray-50 text-gray-900 font-semibold px-8 py-3 rounded-lg border-2 border-gray-300 transition-colors"
              >
                お問い合わせ
              </a>
            </div>
          </div>
        </section>
      </main>
      <SocialLinks />
      <Footer />
    </div>
  )
}
