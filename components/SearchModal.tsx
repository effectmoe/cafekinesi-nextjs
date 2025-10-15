'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Search as SearchIcon, FileText, GraduationCap, User, FileIcon } from 'lucide-react'
import { liteClient as algoliasearch } from 'algoliasearch/lite'
import {
  InstantSearch,
  useSearchBox,
  Hits,
  Highlight,
  Configure,
  Index
} from 'react-instantsearch'
import Link from 'next/link'
import Image from 'next/image'

// Algoliaクライアントの初期化
const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || 'temp',
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || 'temp'
)

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

// 検索結果のアイコンを取得
function getTypeIcon(type: string) {
  switch (type) {
    case 'blog':
      return <FileText size={20} className="text-blue-500" />
    case 'course':
      return <GraduationCap size={20} className="text-green-500" />
    case 'instructor':
      return <User size={20} className="text-purple-500" />
    case 'page':
      return <FileIcon size={20} className="text-gray-500" />
    default:
      return <FileIcon size={20} className="text-gray-500" />
  }
}

// 検索結果の日本語ラベルを取得
function getTypeLabel(type: string) {
  switch (type) {
    case 'blog':
      return 'ブログ'
    case 'course':
      return 'コース'
    case 'instructor':
      return 'インストラクター'
    case 'page':
      return 'ページ'
    default:
      return type
  }
}

// 検索結果アイテムコンポーネント
function Hit({ hit }: { hit: any }) {
  return (
    <Link
      href={hit.url}
      className="block p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
      onClick={() => {
        // モーダルを閉じる処理は親コンポーネントで行う
      }}
    >
      <div className="flex items-start gap-3">
        {/* アイコン */}
        <div className="mt-1 flex-shrink-0">
          {getTypeIcon(hit.type)}
        </div>

        {/* コンテンツ */}
        <div className="flex-1 min-w-0">
          {/* タイトル */}
          <h3 className="text-base font-medium text-gray-900 mb-1 truncate">
            <Highlight attribute="title" hit={hit} />
          </h3>

          {/* 説明文 */}
          {hit.excerpt && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {hit.excerpt}
            </p>
          )}

          {/* メタ情報 */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="px-2 py-0.5 bg-gray-100 rounded">
              {getTypeLabel(hit.type)}
            </span>
            {hit.category && (
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded">
                {hit.category}
              </span>
            )}
          </div>
        </div>

        {/* サムネイル画像 */}
        {hit.image && (
          <div className="flex-shrink-0 w-16 h-16 relative rounded overflow-hidden">
            <Image
              src={hit.image}
              alt={hit.title}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
        )}
      </div>
    </Link>
  )
}

// 検索結果が空の場合
function NoResults() {
  return (
    <div className="p-8 text-center">
      <SearchIcon size={48} className="mx-auto text-gray-300 mb-4" />
      <p className="text-gray-600 mb-2">検索結果が見つかりませんでした</p>
      <p className="text-sm text-gray-500">
        別のキーワードで検索してみてください
      </p>
    </div>
  )
}

// カスタム検索ボックス
function CustomSearchBox({ onClose }: { onClose: () => void }) {
  const { query, refine } = useSearchBox()

  return (
    <div className="relative">
      <input
        type="search"
        value={query}
        onChange={(e) => refine(e.target.value)}
        placeholder="検索キーワードを入力..."
        className="w-full px-4 py-4 pr-12 text-lg border-none focus:outline-none bg-transparent"
        autoFocus
      />
      <button
        onClick={onClose}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors z-10"
        aria-label="閉じる"
      >
        <X size={20} className="text-gray-500" />
      </button>
    </div>
  )
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  // 環境変数チェック
  const isAlgoliaConfigured =
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID &&
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID !== 'temp' &&
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY &&
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY !== 'temp'

  // Escキーでモーダルを閉じる
  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // bodyのスクロールを無効化
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleEscape])

  if (!isOpen) return null

  // Algolia未設定の場合
  if (!isAlgoliaConfigured) {
    return (
      <div className="fixed inset-0 z-50">
        <div
          className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative h-full flex items-start justify-center pt-[10vh] px-4">
          <div
            className="bg-white rounded-lg shadow-2xl w-full max-w-2xl p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <SearchIcon size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                検索機能の設定が必要です
              </h3>
              <p className="text-gray-600 mb-4">
                Algoliaの環境変数が設定されていません。
              </p>
              <p className="text-sm text-gray-500 mb-6">
                設定方法は <code className="bg-gray-100 px-2 py-1 rounded">docs/ALGOLIA_SETUP.md</code> をご確認ください。
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* オーバーレイ */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* モーダルコンテンツ */}
      <div className="relative h-full flex items-start justify-center pt-[10vh] px-4">
        <div
          className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <InstantSearch
            searchClient={searchClient}
            indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'cafekinesi_content'}
          >
            {/* 検索ボックス */}
            <div className="border-b border-gray-200">
              <CustomSearchBox onClose={onClose} />
            </div>

            {/* 検索設定 */}
            <Configure hitsPerPage={10} />

            {/* 検索結果 */}
            <div className="overflow-y-auto flex-1 min-h-[300px]">
              <Hits
                hitComponent={({ hit }) => (
                  <div onClick={onClose}>
                    <Hit hit={hit} />
                  </div>
                )}
                classNames={{
                  root: 'w-full h-full',
                  list: 'divide-y divide-gray-100',
                  item: 'p-0',
                  emptyRoot: 'h-full flex items-center justify-center'
                }}
              />
            </div>

            {/* ヘルプテキスト */}
            <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 text-xs text-gray-500 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">
                    ↑
                  </kbd>
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">
                    ↓
                  </kbd>
                  <span className="ml-1">移動</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">
                    Enter
                  </kbd>
                  <span className="ml-1">選択</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">
                    Esc
                  </kbd>
                  <span className="ml-1">閉じる</span>
                </span>
              </div>
              <span className="text-gray-400">
                Powered by Algolia
              </span>
            </div>
          </InstantSearch>
        </div>
      </div>
    </div>
  )
}
