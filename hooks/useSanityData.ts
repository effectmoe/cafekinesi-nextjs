import { useQuery } from '@tanstack/react-query'
import { sanityFetcher, sanityPreviewFetcher } from '@/lib/sanity.client'
import type {
  PageQueryResult,
  HomepageQueryResult,
  SiteSettingsQueryResult,
  BlogPostsQueryResult,
  BlogPostQueryResult
} from '@/types/sanity.types'

// プレビューモードかどうかを判定
const isPreviewMode = () => {
  if (typeof window === 'undefined') return false
  return window.location.search.includes('preview=true') ||
         window.parent !== window || // iframe内で動作している
         window.location.pathname.includes('/studio')
}

// ページデータを取得
export function usePageData(slug: string) {
  const preview = isPreviewMode()

  return useQuery<PageQueryResult>({
    queryKey: ['page', slug, { preview }],
    queryFn: () => {
      const query = `
        *[_type == "page" && slug.current == $slug][0]{
          _id,
          title,
          slug,
          pageBuilder[]{
            ...,
            _type == "reference" => @->{...}
          },
          seo
        }
      `
      const fetcher = preview ? sanityPreviewFetcher : sanityFetcher
      return fetcher(query, { slug })
    },
    staleTime: preview ? 0 : 60 * 1000, // プレビューモードでは常に最新、通常は1分
  })
}

// ホームページデータを取得
export function useHomepageData() {
  const preview = isPreviewMode()

  return useQuery<HomepageQueryResult>({
    queryKey: ['homepage', { preview }],
    queryFn: () => {
      const query = `
        *[_type == "homepage"][0]{
          _id,
          title,
          hero,
          aboutSection,
          servicesSection,
          blogSection,
          cta,
          seo
        }
      `
      const fetcher = preview ? sanityPreviewFetcher : sanityFetcher
      return fetcher(query)
    },
    staleTime: preview ? 0 : 5 * 60 * 1000, // プレビューモードでは常に最新、通常は5分
  })
}

// サイト設定を取得
export function useSiteSettings() {
  const preview = isPreviewMode()

  return useQuery<SiteSettingsQueryResult>({
    queryKey: ['siteSettings', { preview }],
    queryFn: () => {
      const query = `
        *[_type == "siteSettings"][0]{
          ...,
          navigation[]{
            ...,
            subItems[]{...}
          },
          footer{
            ...,
            links[]{...},
            socialMedia[]{...}
          }
        }
      `
      const fetcher = preview ? sanityPreviewFetcher : sanityFetcher
      return fetcher(query)
    },
    staleTime: preview ? 0 : 5 * 60 * 1000, // プレビューモードでは常に最新、通常は5分
  })
}

// 汎用のSanityデータフェッチングフック（既存のインターフェースを維持）
export function useSanityData<T = any>(
  query: string,
  params: Record<string, any> = {},
  options: {
    staleTime?: number
    enabled?: boolean
  } = {}
) {
  const preview = isPreviewMode()
  const { staleTime = 60 * 1000, enabled = true } = options

  return useQuery<T>({
    queryKey: ['sanityData', query, params, { preview }],
    queryFn: () => {
      const fetcher = preview ? sanityPreviewFetcher : sanityFetcher
      return fetcher(query, params)
    },
    staleTime: preview ? 0 : staleTime,
    enabled,
  })
}