import { client, groq, publicClient, previewClient } from '@/lib/sanity.client'
import { draftMode } from 'next/headers'
import { PageBuilder } from '@/components/PageBuilder'
import { notFound } from 'next/navigation'
import type { Page } from '@/types/sanity.types'

// 動的レンダリングを強制
export const dynamic = 'force-dynamic'

const PAGE_QUERY = groq`*[_type == "page" && slug.current == $slug][0] {
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

const ALL_PAGES_QUERY = groq`*[_type == "page"] {
  slug
}`

async function getPage(slug: string) {
  const draft = await draftMode()
  const isPreview = draft.isEnabled

  // プレビューモード時はpreviewClient、通常時はpublicClientを使用
  const selectedClient = isPreview ? previewClient : publicClient

  console.log(`Fetching page: ${slug}, preview: ${isPreview}`)

  return selectedClient.fetch<Page>(PAGE_QUERY, { slug })
}

async function getAllPages() {
  return client.fetch<{ slug: { current: string } }[]>(ALL_PAGES_QUERY)
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