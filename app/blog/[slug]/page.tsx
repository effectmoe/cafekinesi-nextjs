import { client, groq, urlFor } from '@/lib/sanity.client'

// 動的レンダリングを強制（Next.js 15ではこれだけで十分）
export const dynamic = 'force-dynamic'
import { SanityImage } from '@/components/SanityImage'
import { notFound } from 'next/navigation'
import type { BlogPost } from '@/types/sanity.types'
import { PortableText } from '@portabletext/react'

const POST_QUERY = groq`*[_type == "blogPost" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  excerpt,
  mainImage,
  content,
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

const ALL_POSTS_QUERY = groq`*[_type == "blogPost"] {
  slug
}`

async function getPost(slug: string) {
  return client.fetch<BlogPost>(POST_QUERY, { slug })
}

async function getAllPosts() {
  return client.fetch<{ slug: { current: string } }[]>(ALL_POSTS_QUERY)
}

// generateStaticParamsを削除して完全に動的レンダリングに
// export async function generateStaticParams() {
//   const posts = await getAllPosts()
//   return posts.map((post) => ({
//     slug: post.slug.current,
//   }))
// }

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="container mx-auto px-4 py-16 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        {post.publishedAt && (
          <time className="text-gray-600">
            {new Date(post.publishedAt).toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        )}

        {post.author && (
          <div className="flex items-center gap-4 mt-6">
            {post.author.image && (
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <SanityImage
                  image={post.author.image}
                  alt={post.author.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <p className="font-medium">{post.author.name}</p>
            </div>
          </div>
        )}
      </header>

      {post.mainImage && (
        <div className="mb-8 rounded-lg overflow-hidden">
          <SanityImage
            image={post.mainImage}
            alt={post.title}
            width={1200}
            height={630}
            className="w-full h-auto"
            priority
          />
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
                    <img
                      src={urlFor(value).width(800).height(450).url()}
                      alt={value.alt || ''}
                      className="w-full h-auto rounded-lg my-8"
                    />
                  )
                }
              }
            }}
          />
        </div>
      )}
    </article>
  )
}

// export const revalidate = 60 // 上部で定義済み