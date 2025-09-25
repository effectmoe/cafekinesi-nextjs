import { client, groq, urlFor, publicClient, previewClient } from '@/lib/sanity.client'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import type { BlogPost } from '@/types/sanity.types'
import { PortableText } from '@portabletext/react'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import SiteSchemas from '@/components/SiteSchemas'
import AutoSchema from '@/components/AutoSchema'

export const dynamic = 'force-dynamic'

const POST_QUERY = groq`*[_type == "blogPost" && slug.current == $slug][0] {
  _id,
  _type,
  title,
  slug,
  excerpt,
  mainImage,
  content,
  category,
  tags,
  publishedAt,
  author-> {
    name,
    image,
    bio
  },
  seo {
    title,
    description,
    keywords,
    ogImage
  }
}`

async function getPost(slug: string) {
  const draft = await draftMode()
  const isPreview = draft.isEnabled
  const selectedClient = isPreview ? previewClient : publicClient

  try {
    const result = await selectedClient.fetch<BlogPost>(POST_QUERY, { slug }, {
      cache: isPreview ? 'no-store' : 'force-cache'
    } as any)
    return result
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error)
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  try {
    const post = await publicClient.fetch<BlogPost>(POST_QUERY, { slug })

    if (!post) {
      return {
        title: 'Not Found',
        description: 'The page you are looking for does not exist.',
      }
    }

    return {
      title: post.seo?.title || post.title || 'Cafe Kinesi Blog',
      description: post.seo?.description || post.excerpt || '',
      keywords: post.seo?.keywords || post.tags?.join(', ') || '',
    }
  } catch (error) {
    return {
      title: 'Cafe Kinesi Blog',
      description: '心と身体を整えるブログ',
    }
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  const breadcrumbs = [
    { name: 'ホーム', url: '/' },
    { name: 'ブログ', url: '/blog' },
    { name: post.title, url: `/blog/${slug}` }
  ]

  return (
    <>
      <SiteSchemas
        currentPage={{
          title: post.title,
          url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://cafekinesi-nextjs.vercel.app'}/blog/${slug}`,
          breadcrumbs
        }}
      />
      <AutoSchema document={post} />

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow max-w-4xl mx-auto px-4 py-8">
          <article>
            <header className="mb-8">
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
              {post.publishedAt && (
                <time className="text-gray-600">
                  {new Date(post.publishedAt).toLocaleDateString('ja-JP')}
                </time>
              )}
            </header>

            {post.mainImage && (
              <div className="mb-8">
                <img
                  src={urlFor(post.mainImage).width(800).height(400).url()}
                  alt={post.title}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}

            {post.excerpt && (
              <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                <p className="text-lg text-blue-900">{post.excerpt}</p>
              </div>
            )}

            {post.content && (
              <div className="prose prose-lg max-w-none">
                <PortableText
                  value={post.content}
                  components={{
                    types: {
                      image: ({value}: any) => {
                        if (!value?.asset?._ref) {
                          return null
                        }
                        return (
                          <div className="my-8">
                            <img
                              src={urlFor(value).width(800).url()}
                              alt={value.alt || ''}
                              className="w-full rounded-lg"
                            />
                            {value.caption && (
                              <p className="text-sm text-gray-600 mt-2 text-center">
                                {value.caption}
                              </p>
                            )}
                          </div>
                        )
                      }
                    }
                  }}
                />
              </div>
            )}
          </article>
        </main>
      </div>
    </>
  )
}