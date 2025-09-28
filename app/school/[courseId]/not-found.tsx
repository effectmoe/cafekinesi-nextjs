import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialLinks from '@/components/SocialLinks'

export default function CourseNotFound() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        <div className="max-w-6xl mx-auto px-6 py-32 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            講座が見つかりません
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            指定された講座は存在しないか、現在公開されていません。
          </p>
          <div className="space-x-4">
            <Link
              href="/school"
              className="inline-block bg-gray-900 text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors"
            >
              講座一覧に戻る
            </Link>
            <Link
              href="/"
              className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded hover:bg-gray-50 transition-colors"
            >
              ホームに戻る
            </Link>
          </div>
        </div>
      </main>
      <SocialLinks />
      <Footer />
    </div>
  )
}