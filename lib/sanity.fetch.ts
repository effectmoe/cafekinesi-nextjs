import { client, publicClient, previewClient } from './sanity.client'
import { groq } from 'next-sanity'

// Sanityデータフェッチング用ヘルパー関数
export async function sanityFetch<T = any>({
  query,
  params = {},
  tags = [],
  preview = false,
}: {
  query: string
  params?: Record<string, any>
  tags?: string[]
  preview?: boolean
}): Promise<T> {
  const selectedClient = preview ? previewClient : publicClient

  try {
    const data = await selectedClient.fetch<T>(query, params, {
      cache: preview ? 'no-store' : 'force-cache',
      next: { tags }
    } as any)
    return data
  } catch (error) {
    console.error('Sanity fetch error:', error)
    throw error
  }
}

// 画像URL生成ヘルパー
import { urlFor } from './sanity.client'

export function urlForImage(source: any) {
  if (!source) return null
  return urlFor(source)
}

export { groq }