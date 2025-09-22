import { createClient } from 'next-sanity'

// 環境変数を直接読み込む（NEXT_PUBLICプレフィックス付き）
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'e4aqw590'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'
const useCdn = false

// デバッグ出力
console.log('[sanity.simple] Creating client with:', {
  projectId,
  dataset,
  apiVersion,
  useCdn
})

// シンプルなクライアント作成
export const simpleClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  perspective: 'published',
})

// シンプルなfetch関数
export async function simpleFetch<T = any>(query: string): Promise<T> {
  try {
    console.log('[simpleFetch] Executing query')
    const result = await simpleClient.fetch<T>(query)
    console.log('[simpleFetch] Success, got result:', Array.isArray(result) ? `Array(${result.length})` : typeof result)
    return result
  } catch (error) {
    console.error('[simpleFetch] Error:', error)
    throw error
  }
}