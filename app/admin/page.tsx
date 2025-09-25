import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          管理ダッシュボード
        </h1>
        <p className="mt-1 text-gray-500">
          サイト全体の状況とSchema.org構造化データを監視
        </p>
      </div>

      {/* 機能カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/schema-dashboard" className="group">
          <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-md bg-purple-500 text-white">
                  📊
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-purple-600">
                  Schema.org ダッシュボード
                </h3>
                <p className="text-sm text-gray-500">
                  構造化データの生成状況と品質を監視
                </p>
              </div>
            </div>
          </div>
        </Link>

        <a
          href="https://cafekinesi.sanity.studio"
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-500 text-white">
                  ⚙️
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                  Sanity Studio
                </h3>
                <p className="text-sm text-gray-500">
                  コンテンツ管理システム
                </p>
              </div>
            </div>
          </div>
        </a>

        <a
          href="https://vercel.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-md bg-green-500 text-white">
                  🚀
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-green-600">
                  Vercel Dashboard
                </h3>
                <p className="text-sm text-gray-500">
                  デプロイメント状況とパフォーマンス
                </p>
              </div>
            </div>
          </div>
        </a>
      </div>

      {/* 便利なリンク */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">便利なツール</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="https://search.google.com/test/rich-results"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            📋 Google Rich Results Test
          </a>
          <a
            href="https://validator.schema.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            ✅ Schema.org Validator
          </a>
          <a
            href="https://developers.google.com/search/docs/guides/search-gallery"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            📖 Google Search Gallery
          </a>
          <a
            href="https://search.google.com/search-console"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            📈 Google Search Console
          </a>
        </div>
      </div>
    </div>
  )
}