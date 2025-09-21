import { sanityFetch } from '@/lib/sanity.client'
import { PageBuilder } from '@/components/PageBuilder'
import { notFound } from 'next/navigation'
import type { Page } from '@/types/sanity.types'

const PAGE_QUERY = `*[_type == "page" && slug.current == $slug][0] {
  _id,
  _type,
  title,
  slug,
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

const ALL_PAGES_QUERY = `*[_type == "page"] {
  slug
}`

async function getPage(slug: string) {
  return sanityFetch<Page>(PAGE_QUERY, { slug })
}

async function getAllPages() {
  return sanityFetch<{ slug: { current: string } }[]>(ALL_PAGES_QUERY)
}

export async function generateStaticParams() {
  const pages = await getAllPages()
  return pages.map((page) => ({
    slug: page.slug.current,
  }))
}

export default async function DynamicPage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = await params
  const page = await getPage(slug)

  if (!page) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <PageBuilder sections={page.sections} />
    </main>
  )
}

export const revalidate = 60