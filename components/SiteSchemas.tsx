import { FC } from 'react'
import JsonLd from './JsonLd'
import { Organization, WebSite, BreadcrumbList, WithContext } from 'schema-dts'

interface SiteSchemasProps {
  currentPage?: {
    title: string
    url: string
    breadcrumbs?: Array<{ name: string; url: string }>
  }
}

const SiteSchemas: FC<SiteSchemasProps> = ({ currentPage }) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cafekinesi-nextjs.vercel.app'
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Cafe Kinesi'

  // 組織Schema
  const organizationSchema: WithContext<Organization> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/logo.jpeg`,
      width: 400,
      height: 400
    },
    sameAs: [
      // SNSリンクがあれば追加
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      url: `${siteUrl}/contact`
    },
    description: 'アロマテラピーとキネシオロジーの融合空間、癒しの可能性を秘めたオーガニックカフェ',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'JP'
    }
  }

  // WebSiteSchema
  const websiteSchema: WithContext<WebSite> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    description: 'アロマテラピーとキネシオロジーの融合空間、癒しの可能性を秘めたオーガニックカフェメニュー',
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.jpeg`
      }
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }

  // パンくずリストSchema
  let breadcrumbSchema: WithContext<BreadcrumbList> | null = null

  if (currentPage?.breadcrumbs && currentPage.breadcrumbs.length > 0) {
    breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: currentPage.breadcrumbs.map((breadcrumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: breadcrumb.name,
        item: breadcrumb.url.startsWith('http') ? breadcrumb.url : `${siteUrl}${breadcrumb.url}`
      }))
    }
  }

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
    </>
  )
}

export default SiteSchemas