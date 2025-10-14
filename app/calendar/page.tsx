import { Metadata } from 'next'
import Script from 'next/script'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialLinks from '@/components/SocialLinks'
import CalendarView from '@/components/calendar/CalendarView'

export const metadata: Metadata = {
  title: 'イベントカレンダー | Cafe Kinesi',
  description: 'Cafe Kinesiの講座・イベントスケジュールをご確認いただけます。',
  keywords: 'カレンダー, イベント, 講座, スケジュール, キネシオロジー',
  openGraph: {
    title: 'イベントカレンダー | Cafe Kinesi',
    description: 'Cafe Kinesiの講座・イベントスケジュールをご確認いただけます。',
    images: ['/og-image.jpg'],
  },
}

export default function CalendarPage() {
  // Schema.org JSON-LD生成
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cafekinesi.com'

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'イベントカレンダー',
    description: 'Cafe Kinesiの講座・イベントスケジュールをご確認いただけます。',
    url: `${siteUrl}/calendar`,
    publisher: {
      '@type': 'Organization',
      name: 'Cafe Kinesi',
      url: siteUrl
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Schema.org JSON-LD */}
      <Script
        id="schema-calendar"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData, null, 2)
        }}
      />

      <Header />
      <main className="pt-20">
        {/* ページヘッダー */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12">
          <div className="max-w-5xl mx-auto px-8 md:px-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              イベントカレンダー
            </h1>
            <p className="text-lg text-gray-700">
              講座・イベントのスケジュールをご確認いただけます
            </p>
          </div>
        </div>

        {/* カレンダービュー */}
        <div className="max-w-5xl mx-auto px-8 md:px-12 py-12">
          <CalendarView />
        </div>
      </main>
      <SocialLinks />
      <Footer />
    </div>
  )
}
