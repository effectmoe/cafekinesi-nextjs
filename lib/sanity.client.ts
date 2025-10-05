import { createClient } from 'next-sanity'
import { groq } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

// パフォーマンス最適化されたクライアント設定
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'e4aqw590',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production', // 本番ではCDNを使用
  stega: {
    enabled: process.env.NODE_ENV === 'development',
    studioUrl: 'http://localhost:3333',
  },
})

// 公開コンテンツ用（高速、キャッシュ有効）
export const publicClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'e4aqw590',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: false, // 一時的にCDNキャッシュを無効化
  perspective: 'published',
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN || process.env.SANITY_API_READ_TOKEN,
})

// プレビュー用（最新データ、キャッシュ無効）
export const previewClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'e4aqw590',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: false, // ⭐ 重要：ドラフト取得時は必ずfalse
  perspective: 'raw', // raw perspectiveはドラフトと公開済み両方を取得
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN || process.env.SANITY_API_READ_TOKEN,
  ignoreBrowserTokenWarning: true
})

// ドラフト用クライアント
export function getClient(preview?: boolean) {
  if (preview) {
    return client.withConfig({
      useCdn: false,
      perspective: 'raw',
      token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN || process.env.SANITY_API_READ_TOKEN,
    })
  }
  return client
}

// 最適化された画像URLビルダー
const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
    .auto('format')        // WebP/AVIF自動変換
    .quality(75)           // 品質とサイズのバランス
    .fit('max')            // アップスケーリング防止
}

// groqをエクスポート（公式推奨）
export { groq }