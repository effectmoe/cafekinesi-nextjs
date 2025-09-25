'use client'

import { useState, useEffect } from 'react'
import { client } from '@/lib/sanity.client'
import { schemaValidator } from '@/lib/schema-validator'
import { groq } from 'next-sanity'

interface DocumentItem {
  _id: string
  _type: string
  title?: string
  name?: string
  slug?: { current: string }
  customSchema?: {
    enabled: boolean
    jsonld?: string
    validationResult?: any
  }
}

export default function SchemaEditor() {
  const [documents, setDocuments] = useState<DocumentItem[]>([])
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null)
  const [customSchema, setCustomSchema] = useState('')
  const [isEnabled, setIsEnabled] = useState(false)
  const [validationResult, setValidationResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setSaving] = useState(false)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    setIsLoading(true)
    try {
      const query = groq`*[_type in ["blogPost", "product", "author", "faq", "event"]] {
        _id,
        _type,
        title,
        name,
        slug,
        customSchema {
          enabled,
          jsonld,
          validationResult
        }
      } | order(_updatedAt desc)`

      const data = await client.fetch<DocumentItem[]>(query)
      setDocuments(data)
    } catch (error) {
      console.error('Failed to fetch documents:', error)
    }
    setIsLoading(false)
  }

  const handleDocumentSelect = (doc: DocumentItem) => {
    setSelectedDoc(doc)
    setCustomSchema(doc.customSchema?.jsonld || '')
    setIsEnabled(doc.customSchema?.enabled || false)
    setValidationResult(doc.customSchema?.validationResult || null)
  }

  const validateSchema = () => {
    if (!customSchema.trim()) {
      setValidationResult(null)
      return
    }

    try {
      const parsedSchema = JSON.parse(customSchema)
      const result = schemaValidator.validate(parsedSchema)
      setValidationResult({
        ...result,
        lastValidated: new Date().toISOString()
      })
    } catch (error) {
      setValidationResult({
        valid: false,
        errors: ['Invalid JSON format'],
        warnings: [],
        score: 0,
        lastValidated: new Date().toISOString()
      })
    }
  }

  const saveSchema = async () => {
    if (!selectedDoc) return

    setSaving(true)
    try {
      const updatedDoc = {
        ...selectedDoc,
        customSchema: {
          enabled: isEnabled,
          jsonld: customSchema,
          validationResult: validationResult
        }
      }

      await client.patch(selectedDoc._id)
        .set({
          customSchema: updatedDoc.customSchema
        })
        .commit()

      // 更新後のドキュメント一覧を再取得
      await fetchDocuments()

      alert('保存しました')
    } catch (error) {
      console.error('Failed to save schema:', error)
      alert('保存に失敗しました')
    }
    setSaving(false)
  }

  const generateDefaultSchema = () => {
    if (!selectedDoc) return

    let defaultSchema = {
      "@context": "https://schema.org",
      "@type": "Article"
    }

    switch (selectedDoc._type) {
      case 'blogPost':
        defaultSchema = {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": selectedDoc.title || "記事のタイトル",
          "description": "記事の説明",
          "author": {
            "@type": "Person",
            "name": "著者名"
          },
          "datePublished": new Date().toISOString().split('T')[0],
          "image": "https://example.com/image.jpg"
        }
        break
      case 'product':
        defaultSchema = {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": selectedDoc.name || selectedDoc.title || "商品名",
          "description": "商品の説明",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "JPY"
          }
        }
        break
      case 'faq':
        defaultSchema = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [{
            "@type": "Question",
            "name": "質問",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "回答"
            }
          }]
        }
        break
    }

    setCustomSchema(JSON.stringify(defaultSchema, null, 2))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Schema.org カスタムエディター</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ドキュメント一覧 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">ドキュメント一覧</h2>
            {isLoading ? (
              <div>読み込み中...</div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {documents.map((doc) => (
                  <div
                    key={doc._id}
                    className={`p-3 rounded cursor-pointer border transition-colors ${
                      selectedDoc?._id === doc._id
                        ? 'bg-blue-100 border-blue-300'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => handleDocumentSelect(doc)}
                  >
                    <div className="font-medium truncate">
                      {doc.title || doc.name || doc._id}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center justify-between">
                      <span>{doc._type}</span>
                      {doc.customSchema?.enabled && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          カスタム
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* エディター */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            {selectedDoc ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">
                    {selectedDoc.title || selectedDoc.name || selectedDoc._id}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={(e) => setIsEnabled(e.target.checked)}
                        className="mr-2"
                      />
                      カスタムスキーマを使用
                    </label>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex space-x-2 mb-2">
                    <button
                      onClick={generateDefaultSchema}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      デフォルトを生成
                    </button>
                    <button
                      onClick={validateSchema}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      検証
                    </button>
                    <button
                      onClick={saveSchema}
                      disabled={isSaving}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                    >
                      {isSaving ? '保存中...' : '保存'}
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    JSON-LD Schema
                  </label>
                  <textarea
                    value={customSchema}
                    onChange={(e) => setCustomSchema(e.target.value)}
                    className="w-full h-64 p-3 border border-gray-300 rounded font-mono text-sm"
                    placeholder="JSON-LD形式でSchema.orgデータを記述してください"
                    disabled={!isEnabled}
                  />
                </div>

                {/* 検証結果 */}
                {validationResult && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-2">検証結果</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className={`p-3 rounded ${validationResult.valid ? 'bg-green-100' : 'bg-red-100'}`}>
                        <div className="font-medium">
                          {validationResult.valid ? '✓ 有効' : '✗ 無効'}
                        </div>
                      </div>
                      <div className="p-3 bg-blue-100 rounded">
                        <div className="font-medium">スコア: {validationResult.score}/100</div>
                      </div>
                    </div>

                    {validationResult.errors?.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-red-800 mb-2">エラー</h4>
                        <ul className="space-y-1">
                          {validationResult.errors.map((error: string, index: number) => (
                            <li key={index} className="text-red-700 text-sm">
                              • {error}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {validationResult.warnings?.length > 0 && (
                      <div>
                        <h4 className="font-medium text-yellow-800 mb-2">警告</h4>
                        <ul className="space-y-1">
                          {validationResult.warnings.map((warning: string, index: number) => (
                            <li key={index} className="text-yellow-700 text-sm">
                              • {warning}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-gray-500 py-12">
                左のリストからドキュメントを選択してください
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}