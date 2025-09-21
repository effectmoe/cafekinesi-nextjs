import { sanityFetch } from '@/lib/sanity.client'
import { PageBuilder } from '@/components/PageBuilder'
import { generateSEOMetadata, generateJSONLD } from '@/components/SEO'
import type { Homepage } from '@/types/sanity.types'
import type { Metadata } from 'next'
import Script from 'next/script'

const HOMEPAGE_QUERY = `*[_type == "homepage"][0] {
  _id,
  _type,
  title,
  sections[] {
    _key,
    _type,
    ...
  },
  seo {
    title,
    description,
    keywords,
    ogImage
  }
}`

async function getHomepage() {
  return sanityFetch<Homepage>(HOMEPAGE_QUERY)
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomepage()

  if (!page?.seo) {
    return generateSEOMetadata()
  }

  return generateSEOMetadata({
    title: page.seo.title || 'Cafe Kinesi',
    description: page.seo.description,
    keywords: page.seo.keywords,
    ogImage: page.seo.ogImage,
    type: 'website',
  })
}

export default async function HomePage() {
  const page = await getHomepage()

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>ホームページコンテンツが見つかりません</p>
      </div>
    )
  }

  const jsonLd = generateJSONLD({
    type: 'WebPage',
    title: page.seo?.title || 'Cafe Kinesi',
    description: page.seo?.description,
    url: 'https://cafekinesi.com',
  })

  return (
    <>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen">
        <PageBuilder sections={page.sections} />
      </main>
    </>
  )
}

export const revalidate = 60
