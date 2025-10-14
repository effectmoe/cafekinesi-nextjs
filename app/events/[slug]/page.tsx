import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialLinks from '@/components/SocialLinks'
import { Event } from '@/lib/types/event'
import { publicClient } from '@/lib/sanity.client'
import { EVENT_DETAIL_QUERY } from '@/lib/queries'
import { SchemaOrgGenerator } from '@/lib/schemaOrgGenerator'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { PortableText } from '@portabletext/react'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getEventData(slug: string): Promise<Event | null> {
  try {
    const event = await publicClient.fetch(
      EVENT_DETAIL_QUERY,
      { slug },
      {
        cache: 'no-store'
      } as any
    )

    return event
  } catch (error) {
    console.error('Failed to fetch event data:', error)
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const event = await getEventData(slug)

  if (!event) {
    return {
      title: 'イベントが見つかりません | Cafe Kinesi',
      description: '指定されたイベントは見つかりませんでした。'
    }
  }

  return {
    title: `${event.title} | Cafe Kinesi`,
    description: event.description ? 'イベントの詳細情報をご覧いただけます。' : event.title,
    keywords: `${event.title}, イベント, 講座, キネシオロジー${event.tags ? ', ' + event.tags.join(', ') : ''}`,
    openGraph: {
      title: `${event.title} | Cafe Kinesi`,
      description: event.description ? 'イベントの詳細情報をご覧いただけます。' : event.title,
      images: event.image ? [event.image.asset.url] : ['/og-image.jpg'],
    },
  }
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params
  const event = await getEventData(slug)

  if (!event) {
    notFound()
  }

  // ステータス表示
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'open':
        return { label: '受付中', bgColor: 'bg-green-100', textColor: 'text-green-800' }
      case 'full':
        return { label: '満席', bgColor: 'bg-red-100', textColor: 'text-red-800' }
      case 'closed':
        return { label: '終了', bgColor: 'bg-gray-100', textColor: 'text-gray-800' }
      case 'cancelled':
        return { label: 'キャンセル', bgColor: 'bg-orange-100', textColor: 'text-orange-800' }
      default:
        return { label: status, bgColor: 'bg-gray-100', textColor: 'text-gray-800' }
    }
  }

  const statusDisplay = getStatusDisplay(event.status)
  const availableSeats = event.capacity && event.currentParticipants !== undefined
    ? event.capacity - event.currentParticipants
    : null

  // Schema.org JSON-LD生成
  const schemaGenerator = new SchemaOrgGenerator({
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://cafekinesi.com',
    siteName: 'Cafe Kinesi',
    organizationName: 'Cafe Kinesi',
  })

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.startDate,
    endDate: event.endDate,
    location: event.location ? {
      '@type': 'Place',
      name: event.location
    } : undefined,
    image: event.image?.asset.url,
    description: event.title,
    offers: event.fee !== undefined ? {
      '@type': 'Offer',
      price: event.fee,
      priceCurrency: 'JPY',
      availability: event.status === 'open' ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut'
    } : undefined,
    performer: event.instructor ? {
      '@type': 'Person',
      name: event.instructor.name
    } : undefined,
    organizer: {
      '@type': 'Organization',
      name: 'Cafe Kinesi',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://cafekinesi.com'
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Schema.org JSON-LD */}
      <Script
        id="schema-event"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData, null, 2)
        }}
      />

      <Header />
      <main className="pt-20">
        {/* パンくずナビゲーション */}
        <div className="max-w-4xl mx-auto px-6 py-4">
          <nav className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">
              ホーム
            </Link>
            <span className="mx-2">&gt;</span>
            <Link href="/calendar" className="hover:text-primary transition-colors">
              カレンダー
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-foreground">{event.title}</span>
          </nav>
        </div>

        {/* イベント詳細 */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* ヘッダー画像 */}
          {event.image && (
            <img
              src={event.image.asset.url}
              alt={event.image.alt || event.title}
              className="w-full max-h-96 object-cover rounded-lg mb-8"
            />
          )}

          {/* ステータスバッジ */}
          <div className="flex gap-2 mb-4">
            <span className={`${statusDisplay.bgColor} ${statusDisplay.textColor} text-sm font-semibold px-3 py-1 rounded`}>
              {statusDisplay.label}
            </span>
            {event.category && (
              <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded">
                {event.category === 'course' ? '講座' :
                 event.category === 'session' ? 'セッション' :
                 event.category === 'information' ? '説明会' :
                 event.category === 'workshop' ? 'ワークショップ' : 'その他'}
              </span>
            )}
          </div>

          {/* タイトル */}
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            {event.title}
          </h1>

          {/* イベント情報カード */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">開催日時</h3>
                <p className="text-gray-900">
                  {format(new Date(event.startDate), 'yyyy年M月d日 (E) HH:mm', { locale: ja })}
                  <br />
                  〜 {format(new Date(event.endDate), 'yyyy年M月d日 (E) HH:mm', { locale: ja })}
                </p>
              </div>

              {event.location && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">開催場所</h3>
                  <p className="text-gray-900">{event.location}</p>
                </div>
              )}

              {event.instructor && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">講師</h3>
                  <Link
                    href={`/instructor/${event.instructor.slug.current}`}
                    className="text-primary hover:underline"
                  >
                    {event.instructor.name}
                  </Link>
                </div>
              )}

              {availableSeats !== null && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">定員</h3>
                  <p className="text-gray-900">
                    {event.capacity}名
                    {availableSeats > 0 && (
                      <span className="text-green-600 font-semibold ml-2">
                        (残り{availableSeats}席)
                      </span>
                    )}
                  </p>
                </div>
              )}

              {event.fee !== undefined && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">参加費</h3>
                  <p className="text-gray-900 text-xl font-bold">
                    {event.fee === 0 ? '無料' : `¥${event.fee.toLocaleString()}`}
                  </p>
                </div>
              )}
            </div>

            {/* 申込みボタン */}
            {event.registrationUrl && event.status === 'open' && (
              <div className="mt-6 pt-6 border-t">
                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-green-600 text-white text-center py-3 px-6 rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold"
                >
                  このイベントに申し込む
                </a>
              </div>
            )}
          </div>

          {/* イベント説明 */}
          {event.description && (
            <div className="prose prose-lg max-w-none mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">イベント詳細</h2>
              <PortableText value={event.description} />
            </div>
          )}

          {/* タグ */}
          {event.tags && event.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">タグ</h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 戻るボタン */}
          <div className="mt-12 pt-8 border-t">
            <Link
              href="/calendar"
              className="inline-flex items-center text-primary hover:underline"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              カレンダーに戻る
            </Link>
          </div>
        </div>
      </main>
      <SocialLinks />
      <Footer />
    </div>
  )
}
