import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

const projectId = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'e4aqw590').trim()
const dataset = (process.env.NEXT_PUBLIC_SANITY_DATASET || 'production').trim()
const apiVersion = (process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01').trim()

// Validate projectId format - must be non-empty
if (!projectId || projectId.trim() === '') {
  throw new Error(`Sanity project ID is required but got: ${projectId}`)
}

export const client = createClient({
  projectId: projectId.trim(),
  dataset: dataset.trim(),
  apiVersion: apiVersion.trim(),
  useCdn: true, // 本番環境ではCDNを有効にして画像配信を安定化
  perspective: 'published',
})

export const previewClient = createClient({
  projectId: projectId.trim(),
  dataset: dataset.trim(),
  apiVersion: apiVersion.trim(),
  useCdn: false,
  perspective: 'previewDrafts',
  token: process.env.SANITY_API_TOKEN,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// Re-export sanityFetch from next-sanity for consistency with existing code
export async function sanityFetch<T = any>(
  query: string,
  params: Record<string, any> = {},
  options: { next?: NextFetchRequestConfig } = {}
): Promise<T> {
  try {
    console.log('[Sanity Client] Fetching with config:', {
      projectId: projectId,
      dataset: dataset,
      apiVersion: apiVersion,
      query: query.substring(0, 100) + '...'
    })

    const result = await client.fetch<T>(query, params, {
      next: options.next || { revalidate: 60 }, // デフォルト1分キャッシュ
    })

    if (!result) {
      console.log('[Sanity Client] Query returned no results')
    }

    return result
  } catch (error) {
    console.error('[Sanity Client] Fetch error:', error)
    throw error
  }
}

// 型定義を追加
interface NextFetchRequestConfig {
  revalidate?: number | false
  tags?: string[]
}