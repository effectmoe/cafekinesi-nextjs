import { createClient, type QueryParams } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { getSanityConfig } from './sanity.config'

// Sanity設定を取得（環境変数の問題を回避）
const config = getSanityConfig()

export const projectId = config.projectId
export const dataset = config.dataset
export const apiVersion = config.apiVersion

// サーバーサイドでのデバッグ出力
if (typeof window === 'undefined') {
  console.log('[Sanity Config] Using configuration:', {
    projectId,
    dataset,
    apiVersion,
    hasToken: !!config.apiToken
  })
}

// Sanityクライアントの作成
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: config.useCdn,
  perspective: 'published',
})

// プレビュー用クライアント
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'previewDrafts',
  token: config.apiToken,
})

// 画像URLビルダー
const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// Next.js App Router用のsanityFetch関数（公式推奨パターン）
export async function sanityFetch<QueryString extends string>(
  query: QueryString,
  params: QueryParams = {},
  options: {
    revalidate?: number | false
    tags?: string[]
  } = {}
) {
  // デフォルトのrevalidateを60秒に設定
  const { revalidate = 60, tags = [] } = options

  try {
    console.log('[sanityFetch] Starting fetch with:', {
      queryPreview: query.substring(0, 100),
      paramsKeys: Object.keys(params),
      revalidate,
      tags
    })

    // ビルド時とランタイムで異なるキャッシュ戦略を使用
    const isBuilding = process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL;

    const result = await client.fetch(query, params, {
      cache: isBuilding ? undefined : 'no-store',
      next: {
        revalidate: isBuilding ? 60 : false,
        tags,
      },
    })

    console.log('[sanityFetch] Fetch completed:', {
      hasResult: !!result,
      resultType: Array.isArray(result) ? `Array(${result.length})` : typeof result,
      resultKeys: result && typeof result === 'object' && !Array.isArray(result) ? Object.keys(result) : null
    })

    return result
  } catch (error) {
    console.error('[sanityFetch] ERROR:', error)
    console.error('[sanityFetch] Query was:', query)
    console.error('[sanityFetch] Params were:', params)
    throw error
  }
}