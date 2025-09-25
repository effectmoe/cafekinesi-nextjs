import { createClient } from 'next-sanity'
import { groq } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

// 公式ドキュメント推奨の設定（シンプルに）
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'e4aqw590',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // Server Componentsでは必ずfalse（公式推奨）
  stega: {
    enabled: process.env.NODE_ENV === 'development',
    studioUrl: 'http://localhost:3333',
  },
})

// ドラフト用クライアント
export function getClient(preview?: boolean) {
  if (preview) {
    return client.withConfig({
      useCdn: false,
      perspective: 'previewDrafts',
      token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
    })
  }
  return client
}

// 画像URLビルダー
const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// groqをエクスポート（公式推奨）
export { groq }