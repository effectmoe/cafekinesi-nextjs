export default function DebugPage() {
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">環境変数デバッグ情報</h1>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Sanity環境変数</h2>
            <div className="bg-gray-50 p-4 rounded font-mono text-sm">
              <p>NEXT_PUBLIC_SANITY_PROJECT_ID: {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '❌ 未設定'}</p>
              <p>NEXT_PUBLIC_SANITY_DATASET: {process.env.NEXT_PUBLIC_SANITY_DATASET || '❌ 未設定'}</p>
              <p>NEXT_PUBLIC_SANITY_API_VERSION: {process.env.NEXT_PUBLIC_SANITY_API_VERSION || '❌ 未設定'}</p>
              <p>NEXT_PUBLIC_SANITY_USE_CDN: {process.env.NEXT_PUBLIC_SANITY_USE_CDN || '❌ 未設定'}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">ビルド情報</h2>
            <div className="bg-gray-50 p-4 rounded font-mono text-sm">
              <p>NODE_ENV: {process.env.NODE_ENV}</p>
              <p>VERCEL: {process.env.VERCEL || 'false'}</p>
              <p>VERCEL_ENV: {process.env.VERCEL_ENV || 'N/A'}</p>
              <p>VERCEL_URL: {process.env.VERCEL_URL || 'N/A'}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">期待される値</h2>
            <div className="bg-green-50 p-4 rounded font-mono text-sm">
              <p>NEXT_PUBLIC_SANITY_PROJECT_ID: e4aqw590</p>
              <p>NEXT_PUBLIC_SANITY_DATASET: production</p>
              <p>NEXT_PUBLIC_SANITY_API_VERSION: 2024-01-01</p>
              <p>NEXT_PUBLIC_SANITY_USE_CDN: false</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}