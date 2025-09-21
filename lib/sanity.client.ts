import { createClient, type QueryParams } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION!

// Validate projectId format - must be non-empty
if (!projectId || projectId.trim() === '') {
  throw new Error(`Sanity project ID is required but got: ${projectId}`)
}

export const client = createClient({
  projectId: projectId.trim(),
  dataset: dataset.trim(),
  apiVersion: apiVersion.trim(),
  useCdn: process.env.NEXT_PUBLIC_SANITY_USE_CDN === 'true',
  perspective: 'published',
  stega: {
    enabled: false,
    studioUrl: '/studio',
  },
})

export const previewClient = createClient({
  projectId: projectId.trim(),
  dataset: dataset.trim(),
  apiVersion: apiVersion.trim(),
  useCdn: false,
  perspective: 'previewDrafts',
  token: process.env.SANITY_API_TOKEN,
  stega: {
    enabled: true,
    studioUrl: '/studio',
  },
})

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

export async function sanityFetch<T = any>(
  query: string,
  params: QueryParams = {},
  preview = false
): Promise<T> {
  const selectedClient = preview ? previewClient : client

  try {
    console.log('[Sanity Client] Fetching with config:', {
      projectId: projectId,
      dataset: dataset,
      apiVersion: apiVersion,
      query: query.substring(0, 100) + '...'
    })

    const result = await selectedClient.fetch<T>(query, params)

    if (!result) {
      console.log('[Sanity Client] Query returned no results')
    }

    return result
  } catch (error) {
    console.error('[Sanity Client] Fetch error:', error)
    throw error
  }
}