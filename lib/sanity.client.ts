import { createClient, type QueryParams } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

// 環境変数の取得と検証
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'e4aqw590'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

// サーバーサイドでのデバッグ出力
if (typeof window === 'undefined') {
  console.log('[Sanity Config] Initializing with:', {
    projectId,
    dataset,
    apiVersion,
    hasToken: !!process.env.NEXT_PUBLIC_SANITY_API_TOKEN
  })
}

// Sanityクライアントの作成
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
})

// プレビュー用クライアント
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'previewDrafts',
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
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

    const result = await client.fetch(query, params, {
      cache: revalidate === false ? 'no-store' : 'force-cache',
      next: {
        revalidate: tags.length ? false : revalidate,
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