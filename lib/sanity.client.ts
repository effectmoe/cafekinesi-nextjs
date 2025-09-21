import { createClient, type QueryParams } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'e4aqw590'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

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
  return selectedClient.fetch<T>(query, params)
}