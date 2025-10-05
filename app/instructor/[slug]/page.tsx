import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { publicClient, previewClient } from '@/lib/sanity.client'
import { INSTRUCTOR_DETAIL_QUERY, INSTRUCTORS_QUERY } from '@/lib/queries'
import type { Instructor } from '@/lib/types/instructor'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialLinks from '@/components/SocialLinks'
import InstructorDetail from '@/components/instructor/InstructorDetail'

async function getInstructor(slug: string): Promise<Instructor | null> {
  try {
    const draft = await draftMode()
    const isPreview = draft.isEnabled
    const selectedClient = isPreview ? previewClient : publicClient

    const data = await selectedClient.fetch(
      INSTRUCTOR_DETAIL_QUERY,
      { slug },
      {
        cache: isPreview ? 'no-store' : 'force-cache'
      } as any
    )

    return data
  } catch (error) {
    console.error('Failed to fetch instructor:', error)
    return null
  }
}

export async function generateStaticParams() {
  try {
    const instructors = await publicClient.fetch<Instructor[]>(INSTRUCTORS_QUERY)
    return instructors.map((instructor) => ({
      slug: instructor.slug.current,
    }))
  } catch (error) {
    console.error('Failed to generate static params:', error)
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const instructor = await getInstructor(slug)

  if (!instructor) {
    return {
      title: 'インストラクターが見つかりません | Cafe Kinesi',
    }
  }

  const title = instructor.seo?.title || `${instructor.name} | インストラクター紹介 | Cafe Kinesi`
  const description = instructor.seo?.description || instructor.bio

  return {
    title,
    description,
    keywords: instructor.seo?.keywords || `${instructor.name}, カフェキネシ, インストラクター, キネシオロジー`,
    openGraph: {
      title,
      description,
      images: instructor.seo?.ogImage
        ? [instructor.seo.ogImage.asset.url]
        : instructor.image
        ? [instructor.image.asset.url]
        : ['/og-image.jpg'],
    },
  }
}

// ISR設定（30分ごとに再生成）
export const revalidate = 1800

export default async function InstructorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const instructor = await getInstructor(slug)

  if (!instructor) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="relative">
        <InstructorDetail instructor={instructor} />
      </main>
      <SocialLinks />
      <Footer />
    </div>
  )
}
