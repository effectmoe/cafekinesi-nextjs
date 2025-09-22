import 'server-only'
import { createClient } from '@sanity/client'

// Server-only Sanity client with secure token
export const sanityServerClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'e4aqw590',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // Server Componentsでは常にfalse
  token: process.env.SANITY_TOKEN || process.env.NEXT_PUBLIC_SANITY_API_TOKEN, // 徐々に移行
  perspective: 'published',
})

// Fetch wrapper with proper error handling
export async function sanityServerFetch<T = any>(query: string): Promise<T | null> {
  try {
    const result = await sanityServerClient.fetch<T>(query)
    return result
  } catch (error) {
    console.error('[sanityServerFetch] Error:', error)
    return null
  }
}