import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { draftMode } from 'next/headers'
import { publicClient, previewClient } from '@/lib/sanity.client'
import { INSTRUCTORS_QUERY } from '@/lib/queries'
import type { Instructor } from '@/lib/types/instructor'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialLinks from '@/components/SocialLinks'
import InstructorRegionCard from '@/components/instructor/InstructorRegionCard'

interface PrefecturePageProps {
  params: Promise<{
    prefecture: string
  }>
}

// 都道府県名のマッピング（URLパラメータ → 表示名）
const PREFECTURE_NAMES: Record<string, string> = {
  'hokkaido': '北海道',
  'aomori': '青森県',
  'iwate': '岩手県',
  'miyagi': '宮城県',
  'akita': '秋田県',
  'yamagata': '山形県',
  'fukushima': '福島県',
  'ibaraki': '茨城県',
  'tochigi': '栃木県',
  'gunma': '群馬県',
  'saitama': '埼玉県',
  'chiba': '千葉県',
  'tokyo': '東京都',
  'kanagawa': '神奈川県',
  'niigata': '新潟県',
  'toyama': '富山県',
  'ishikawa': '石川県',
  'fukui': '福井県',
  'yamanashi': '山梨県',
  'nagano': '長野県',
  'gifu': '岐阜県',
  'shizuoka': '静岡県',
  'aichi': '愛知県',
  'mie': '三重県',
  'shiga': '滋賀県',
  'kyoto': '京都府',
  'osaka': '大阪府',
  'hyogo': '兵庫県',
  'nara': '奈良県',
  'wakayama': '和歌山県',
  'tottori': '鳥取県',
  'shimane': '島根県',
  'okayama': '岡山県',
  'hiroshima': '広島県',
  'yamaguchi': '山口県',
  'tokushima': '徳島県',
  'kagawa': '香川県',
  'ehime': '愛媛県',
  'kochi': '高知県',
  'fukuoka': '福岡県',
  'saga': '佐賀県',
  'nagasaki': '長崎県',
  'kumamoto': '熊本県',
  'oita': '大分県',
  'miyazaki': '宮崎県',
  'kagoshima': '鹿児島県',
  'okinawa': '沖縄県',
  // 海外
  'america': 'アメリカ',
  'europe': 'ヨーロッパ',
}

// Sanityから都道府県別インストラクターを取得
async function getInstructorsByPrefecture(prefecture: string): Promise<Instructor[]> {
  try {
    const draft = await draftMode()
    const isPreview = draft.isEnabled
    const selectedClient = isPreview ? previewClient : publicClient

    const data = await selectedClient.fetch(
      INSTRUCTORS_QUERY,
      {},
      {
        cache: isPreview ? 'no-store' : 'force-cache',
      } as any
    )

    // 都道府県でフィルタリング
    return (data || []).filter((instructor: Instructor) => instructor.region === prefecture)
  } catch (error) {
    console.error('Failed to fetch instructors:', error)
    return []
  }
}

export async function generateMetadata({ params }: PrefecturePageProps): Promise<Metadata> {
  const { prefecture } = await params
  const prefectureName = PREFECTURE_NAMES[prefecture]

  if (!prefectureName) {
    return {
      title: 'インストラクターが見つかりません | Cafe Kinesi',
    }
  }

  return {
    title: `${prefectureName}のインストラクター | Cafe Kinesi`,
    description: `${prefectureName}で活動するカフェキネシ公認インストラクターをご紹介します。`,
    keywords: `カフェキネシ, インストラクター, ${prefectureName}, キネシオロジー, セラピー`,
    openGraph: {
      title: `${prefectureName}のインストラクター | Cafe Kinesi`,
      description: `${prefectureName}で活動するカフェキネシ公認インストラクターをご紹介します。`,
      images: ['/og-image.jpg'],
    },
  }
}

// ISR設定（キャッシュなし - デバッグ用）
export const revalidate = 0

export default async function PrefecturePage({ params }: PrefecturePageProps) {
  const { prefecture } = await params
  const prefectureName = PREFECTURE_NAMES[prefecture]

  // 都道府県が存在しない場合は404
  if (!prefectureName) {
    notFound()
  }

  const instructors = await getInstructorsByPrefecture(prefectureName)

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="relative pt-20">
        {/* パンくずナビゲーション */}
        <div className="max-w-screen-xl mx-auto px-6 py-4">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              ホーム
            </Link>
            <span className="mx-2">&gt;</span>
            <Link href="/instructor" className="hover:text-gray-900">
              インストラクター
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-900">{prefectureName}</span>
          </nav>
        </div>

        {/* ヘッダーセクション */}
        <div className="max-w-screen-xl mx-auto px-6 py-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {prefectureName}のインストラクター
          </h1>
          <p className="text-gray-600">
            {prefectureName}で活動するカフェキネシ公認インストラクターをご紹介します
          </p>
        </div>

        {/* インストラクター一覧 */}
        <div className="max-w-screen-xl mx-auto px-6 pb-16">
          {instructors.length > 0 ? (
            <div className="space-y-6">
              {instructors.map((instructor) => (
                <InstructorRegionCard
                  key={instructor._id}
                  instructor={instructor}
                  prefecture={prefecture}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-6">
                現在、{prefectureName}にはインストラクターが登録されていません。
              </p>
              <Link
                href="/instructor"
                className="inline-flex items-center text-gray-900 hover:text-gray-700"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                地図に戻る
              </Link>
            </div>
          )}
        </div>

        {/* 地図に戻るリンク */}
        {instructors.length > 0 && (
          <div className="max-w-screen-xl mx-auto px-6 pb-16 text-center">
            <Link
              href="/instructor"
              className="inline-flex items-center text-gray-900 hover:text-gray-700"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              地図に戻る
            </Link>
          </div>
        )}
      </main>
      <SocialLinks />
      <Footer />
    </div>
  )
}
