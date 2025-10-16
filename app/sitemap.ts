import { MetadataRoute } from 'next'
import { publicClient } from '@/lib/sanity.client'
import { groq } from 'next-sanity'

// 講座一覧を取得するクエリ
const COURSES_SITEMAP_QUERY = groq`
  *[_type == "course" && isActive == true] {
    courseId,
    _updatedAt,
    lastUpdated
  }
`

// ブログ記事一覧を取得するクエリ
const BLOG_POSTS_SITEMAP_QUERY = groq`
  *[_type == "blogPost"] | order(publishedAt desc) {
    "slug": slug.current,
    publishedAt,
    _updatedAt
  }
`

// インストラクター一覧を取得するクエリ
const INSTRUCTORS_SITEMAP_QUERY = groq`
  *[_type == "instructor" && isActive == true] {
    "slug": slug.current,
    _updatedAt
  }
`

// Aboutページの更新日時を取得
const ABOUT_PAGE_QUERY = groq`
  *[_type == "aboutPage" && isActive == true][0] {
    _updatedAt
  }
`

// Profileページの更新日時を取得
const PROFILE_PAGE_QUERY = groq`
  *[_type == "profilePage" && isActive == true][0] {
    _updatedAt
  }
`

// Homepageの更新日時を取得
const HOMEPAGE_QUERY = groq`
  *[_type == "homepage"][0] {
    _updatedAt
  }
`

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cafekinesi-nextjs.vercel.app'

  try {
    // Sanityから各種データを並列取得
    const [courses, blogPosts, instructors, aboutPage, profilePage, homepage] = await Promise.all([
      publicClient.fetch(COURSES_SITEMAP_QUERY).catch(() => []),
      publicClient.fetch(BLOG_POSTS_SITEMAP_QUERY).catch(() => []),
      publicClient.fetch(INSTRUCTORS_SITEMAP_QUERY).catch(() => []),
      publicClient.fetch(ABOUT_PAGE_QUERY).catch(() => null),
      publicClient.fetch(PROFILE_PAGE_QUERY).catch(() => null),
      publicClient.fetch(HOMEPAGE_QUERY).catch(() => null),
    ])

    // 静的ページ（Sanityの更新日時を反映）
    const staticPages: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: homepage?._updatedAt ? new Date(homepage._updatedAt) : new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: aboutPage?._updatedAt ? new Date(aboutPage._updatedAt) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/profile`,
        lastModified: profilePage?._updatedAt ? new Date(profilePage._updatedAt) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/school`,
        lastModified: new Date(), // 講座一覧は動的なので現在日時
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(), // ブログ一覧は動的なので現在日時
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/instructor`,
        lastModified: new Date(), // インストラクター一覧は動的なので現在日時
        changeFrequency: 'weekly',
        priority: 0.8,
      },
    ]

    // 動的な講座ページ
    const coursePages: MetadataRoute.Sitemap = courses.map((course: any) => ({
      url: `${baseUrl}/school/${course.courseId}`,
      lastModified: new Date(course.lastUpdated || course._updatedAt || Date.now()),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

    // 動的なブログページ
    const blogPages: MetadataRoute.Sitemap = blogPosts.map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post._updatedAt || post.publishedAt || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // 動的なインストラクターページ
    const instructorPages: MetadataRoute.Sitemap = instructors.map((instructor: any) => ({
      url: `${baseUrl}/instructor/${instructor.slug}`,
      lastModified: new Date(instructor._updatedAt || Date.now()),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    // 全てのページを結合して返す
    return [
      ...staticPages,
      ...coursePages,
      ...blogPages,
      ...instructorPages,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)

    // エラー時は最低限の静的ページのみ返す
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/school`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/instructor`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
    ]
  }
}
