'use client'

import { useState, useEffect, useCallback } from 'react'
import { client } from '@/lib/sanity.client'
import { schemaValidator } from '@/lib/schema-validator'
import { schemaGenerator } from '@/lib/schema-generator'

interface DocumentWithValidation {
  _id: string
  _type: string
  title?: string
  name?: string
  url?: string
  schema: any
  validation: {
    valid: boolean
    errors: string[]
    warnings: string[]
    score: number
  }
}

export default function SchemaDashboard() {
  const [data, setData] = useState<DocumentWithValidation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedDoc, setSelectedDoc] = useState<DocumentWithValidation | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    valid: 0,
    errors: 0,
    avgScore: 0
  })

  const fetchData = useCallback(async () => {
    setLoading(true)

    try {
      // Sanityからデータ取得
      const query = `*[${filter === 'all' ? 'defined(title) || defined(name)' : `_type == "${filter}"`}][0...100]{
        _id,
        _type,
        title,
        name,
        slug,
        excerpt,
        description,
        publishedAt,
        mainImage,
        image,
        author->,
        category,
        tags,
        content,
        seo
      }`

      const documents = await client.fetch(query)

      // 各ドキュメントのスキーマを生成・検証
      const processedData = documents.map((doc: any) => {
        const generatedSchema = schemaGenerator.generate(doc)
        const validation = schemaValidator.validate(generatedSchema)

        return {
          ...doc,
          url: doc.slug?.current,
          schema: generatedSchema,
          validation
        }
      })

      // 統計計算
      const validCount = processedData.filter(d => d.validation.valid).length
      const totalScore = processedData.reduce((sum, d) => sum + d.validation.score, 0)

      setStats({
        total: processedData.length,
        valid: validCount,
        errors: processedData.length - validCount,
        avgScore: processedData.length > 0 ? Math.round(totalScore / processedData.length) : 0
      })

      setData(processedData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const exportData = () => {
    const exportableData = data.map(item => ({
      id: item._id,
      type: item._type,
      title: item.title || item.name,
      url: item.url,
      schema: item.schema,
      validation: item.validation
    }))

    const dataStr = JSON.stringify(exportableData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)

    const exportFileDefaultName = `schema-export-${new Date().toISOString().split('T')[0]}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const openGoogleTest = (url: string) => {
    if (!url) return
    const fullUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${url}`
    window.open(
      `https://search.google.com/test/rich-results?url=${encodeURIComponent(fullUrl)}`,
      '_blank'
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Schema.org Dashboard
        </h1>
        <p className="mt-1 text-gray-500">
          構造化データの生成状況と品質を監視
        </p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="総ドキュメント"
          value={stats.total}
          color="blue"
          icon="📄"
        />
        <StatCard
          title="検証OK"
          value={stats.valid}
          color="green"
          icon="✅"
        />
        <StatCard
          title="エラー"
          value={stats.errors}
          color="red"
          icon="❌"
        />
        <StatCard
          title="平均スコア"
          value={`${stats.avgScore}%`}
          color="purple"
          icon="📊"
        />
      </div>

      {/* フィルター・アクション */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">すべてのドキュメント</option>
              <option value="blogPost">ブログ記事</option>
              <option value="product">商品</option>
              <option value="page">ページ</option>
              <option value="author">著者</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {loading ? '更新中...' : '更新'}
            </button>
            <button
              onClick={exportData}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              エクスポート
            </button>
          </div>
        </div>
      </div>

      {/* データテーブル */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  タイトル
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  タイプ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  検証
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  スコア
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  アクション
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {item.title || item.name}
                    </div>
                    {item.url && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        /{item._type === 'blogPost' ? 'blog/' : ''}{item.url}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {item._type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.validation.valid ? (
                      <span className="text-green-600 text-sm">✅ Valid</span>
                    ) : (
                      <div>
                        <span className="text-red-600 text-sm">
                          ❌ {item.validation.errors.length} errors
                        </span>
                        {item.validation.warnings.length > 0 && (
                          <div className="text-yellow-600 text-xs">
                            ⚠️ {item.validation.warnings.length} warnings
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${item.validation.score}%` }}
                        />
                      </div>
                      <span className={`text-sm px-2 py-1 rounded ${getScoreColor(item.validation.score)}`}>
                        {item.validation.score}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedDoc(item)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        詳細
                      </button>
                      {item.url && (
                        <button
                          onClick={() => openGoogleTest(item.url!)}
                          className="text-green-600 hover:text-green-900 transition-colors"
                        >
                          テスト
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 詳細モーダル */}
      {selectedDoc && (
        <DetailModal
          document={selectedDoc}
          onClose={() => setSelectedDoc(null)}
        />
      )}
    </div>
  )
}

function StatCard({ title, value, color, icon }: any) {
  const bgColor = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    red: 'bg-red-100',
    purple: 'bg-purple-100'
  }[color]

  const textColor = {
    blue: 'text-blue-800',
    green: 'text-green-800',
    red: 'text-red-800',
    purple: 'text-purple-800'
  }[color]

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center">
        <div className={`inline-flex rounded-lg p-3 ${bgColor}`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4">
          <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
      </div>
    </div>
  )
}

function DetailModal({ document, onClose }: { document: DocumentWithValidation; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-900">
              {document.title || document.name}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="space-y-6">
            {/* 検証結果 */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">検証結果</h4>
              <div className="bg-gray-50 p-4 rounded">
                <div className="flex items-center gap-4 mb-2">
                  <span className={`px-2 py-1 rounded text-sm ${
                    document.validation.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {document.validation.valid ? '✅ Valid' : '❌ Invalid'}
                  </span>
                  <span className="text-sm text-gray-600">
                    Score: {document.validation.score}%
                  </span>
                </div>

                {document.validation.errors.length > 0 && (
                  <div className="mb-3">
                    <h5 className="text-sm font-medium text-red-800 mb-1">Errors:</h5>
                    <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                      {document.validation.errors.map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {document.validation.warnings.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-yellow-800 mb-1">Warnings:</h5>
                    <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                      {document.validation.warnings.map((warning, i) => (
                        <li key={i}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* 生成されたスキーマ */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">生成されたSchema.org</h4>
              <pre className="bg-gray-50 p-4 rounded text-xs overflow-x-auto">
                {JSON.stringify(document.schema, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}