import { Helmet } from 'react-helmet-async'
import { urlFor } from '@/lib/sanity.client'
import { useSiteSettings } from '@/hooks/useSanityData'
import type { SeoSettings } from '@/types/sanity.types'

interface SEOProps {
  seo?: SeoSettings
  pageName?: string
  pageDescription?: string
  pageType?: 'website' | 'article' | 'profile' | 'book'
  breadcrumbs?: Array<{ name: string; url: string }>
  publishedTime?: string
  modifiedTime?: string
  author?: string
}

export function SEO({
  seo,
  pageName,
  pageDescription,
  pageType = 'website',
  breadcrumbs = [],
  publishedTime,
  modifiedTime,
  author
}: SEOProps) {
  const { data: siteSettings } = useSiteSettings()

  // フォールバック値の設定
  const title = seo?.title || pageName || 'ページ'
  const siteName = siteSettings?.siteName || 'Cafe Kinesi'
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`

  const description = seo?.description || pageDescription || siteSettings?.siteDescription || ''
  const keywords = seo?.keywords?.join(', ') || ''

  // OG設定
  const ogTitle = seo?.ogTitle || title
  const ogDescription = seo?.ogDescription || description
  const ogImageUrl = seo?.ogImage ? urlFor(seo.ogImage).width(1200).height(630).url() : undefined

  // サイトURL
  const siteUrl = siteSettings?.siteUrl || 'https://cafekinesi-99dc5473.vercel.app'
  const currentUrl = typeof window !== 'undefined' ? window.location.href : siteUrl

  // JSON-LD 構造化データの生成
  const generateJsonLd = () => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': pageType === 'article' ? 'Article' : 'WebPage',
      name: title,
      description: description,
      url: currentUrl,
      publisher: {
        '@type': 'Organization',
        name: siteName,
        url: siteUrl
      }
    }

    // 記事の場合の追加データ
    if (pageType === 'article') {
      return {
        ...baseData,
        '@type': 'Article',
        headline: title,
        ...(author && { author: { '@type': 'Person', name: author } }),
        ...(publishedTime && { datePublished: publishedTime }),
        ...(modifiedTime && { dateModified: modifiedTime }),
        ...(ogImageUrl && { image: ogImageUrl })
      }
    }

    // パンくずリストの追加
    if (breadcrumbs.length > 0) {
      const breadcrumbList = {
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: `${siteUrl}${crumb.url}`
        }))
      }

      return [baseData, breadcrumbList]
    }

    return baseData
  }

  return (
    <Helmet>
      {/* 基本メタデータ */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* SEO設定 */}
      {seo?.noindex ? (
        <meta name="robots" content="noindex,nofollow" />
      ) : (
        <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
      )}

      {/* Open Graph */}
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:type" content={pageType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="ja_JP" />
      {ogImageUrl && <meta property="og:image" content={ogImageUrl} />}
      {ogImageUrl && <meta property="og:image:width" content="1200" />}
      {ogImageUrl && <meta property="og:image:height" content="630" />}
      {ogImageUrl && <meta property="og:image:alt" content={seo?.ogImage?.alt || title} />}

      {/* 記事の場合の追加Open Graph */}
      {pageType === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {pageType === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {pageType === 'article' && author && (
        <meta property="article:author" content={author} />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      {ogImageUrl && <meta name="twitter:image" content={ogImageUrl} />}
      <meta name="twitter:site" content="@cafekinesi" />

      {/* パフォーマンス最適化 */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#ffffff" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//cdn.sanity.io" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />

      {/* Preconnect */}
      <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />

      {/* JSON-LD構造化データ */}
      <script type="application/ld+json">
        {JSON.stringify(generateJsonLd(), null, 0)}
      </script>
    </Helmet>
  )
}