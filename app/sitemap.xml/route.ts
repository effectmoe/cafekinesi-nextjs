import { NextResponse } from 'next/server'
import { publicClient } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

// Sanity画像URLビルダー
const builder = imageUrlBuilder(publicClient)

function urlForImage(source: any) {
  // Sanity画像データが既に展開されている場合は直接URLを使用
  if (source?.asset?.url) {
    return source.asset.url
  }
  // asset._refがある場合はビルダーを使用
  if (source?.asset?._ref) {
    return builder.image(source).url()
  }
  return null
}

// 講座一覧を取得するクエリ（画像情報を含む）
const COURSES_SITEMAP_QUERY = groq`
  *[_type == "course" && isActive == true] {
    courseId,
    title,
    _updatedAt,
    lastUpdated,
    image {
      asset->,
      alt
    }
  }
`

// ブログ記事一覧を取得するクエリ（画像情報を含む）
const BLOG_POSTS_SITEMAP_QUERY = groq`
  *[_type == "blogPost"] | order(publishedAt desc) {
    "slug": slug.current,
    title,
    publishedAt,
    _updatedAt,
    mainImage {
      asset->,
      alt
    },
    ogImage {
      asset->,
      alt
    }
  }
`

// インストラクター一覧を取得するクエリ（画像情報を含む）
const INSTRUCTORS_SITEMAP_QUERY = groq`
  *[_type == "instructor" && isActive == true] {
    "slug": slug.current,
    name,
    _updatedAt,
    image {
      asset->,
      alt
    }
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

// XML エスケープ関数
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// キャッシュ設定: 1時間ごとに再検証
export const revalidate = 3600

export async function GET() {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://cafekinesi-nextjs.vercel.app').replace(/[\r\n]+/g, '')

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

    // XML開始
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
    xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'

    // 静的ページ
    const staticPages = [
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
      {
        url: `${baseUrl}/faq`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
    ]

    // 静的ページを追加
    staticPages.forEach((page) => {
      xml += '  <url>\n'
      xml += `    <loc>${escapeXml(page.url)}</loc>\n`
      xml += `    <lastmod>${page.lastModified.toISOString()}</lastmod>\n`
      xml += `    <changefreq>${page.changeFrequency}</changefreq>\n`
      xml += `    <priority>${page.priority}</priority>\n`
      xml += '  </url>\n'
    })

    // 講座ページ（画像情報を含む）
    courses.forEach((course: any) => {
      xml += '  <url>\n'
      xml += `    <loc>${escapeXml(`${baseUrl}/school/${course.courseId}`)}</loc>\n`
      xml += `    <lastmod>${new Date(course.lastUpdated || course._updatedAt || Date.now()).toISOString()}</lastmod>\n`
      xml += `    <changefreq>monthly</changefreq>\n`
      xml += `    <priority>0.8</priority>\n`

      // 講座画像
      const imageUrl = urlForImage(course.image)
      if (imageUrl) {
        xml += '    <image:image>\n'
        xml += `      <image:loc>${escapeXml(imageUrl)}</image:loc>\n`
        const imageTitle = course.image?.alt || course.title || '講座画像'
        xml += `      <image:title>${escapeXml(imageTitle)}</image:title>\n`
        xml += '    </image:image>\n'
      }

      xml += '  </url>\n'
    })

    // ブログページ（画像情報を含む）
    blogPosts.forEach((post: any) => {
      xml += '  <url>\n'
      xml += `    <loc>${escapeXml(`${baseUrl}/blog/${post.slug}`)}</loc>\n`
      xml += `    <lastmod>${new Date(post._updatedAt || post.publishedAt || Date.now()).toISOString()}</lastmod>\n`
      xml += `    <changefreq>weekly</changefreq>\n`
      xml += `    <priority>0.7</priority>\n`

      // メイン画像
      const mainImageUrl = urlForImage(post.mainImage)
      if (mainImageUrl) {
        xml += '    <image:image>\n'
        xml += `      <image:loc>${escapeXml(mainImageUrl)}</image:loc>\n`
        const imageTitle = post.mainImage?.alt || post.title || 'ブログ記事画像'
        xml += `      <image:title>${escapeXml(imageTitle)}</image:title>\n`
        xml += '    </image:image>\n'
      }

      // OG画像（メイン画像と異なる場合）
      const ogImageUrl = urlForImage(post.ogImage)
      if (ogImageUrl && ogImageUrl !== mainImageUrl) {
        xml += '    <image:image>\n'
        xml += `      <image:loc>${escapeXml(ogImageUrl)}</image:loc>\n`
        const ogImageTitle = post.ogImage?.alt || `${post.title} - OG画像`
        xml += `      <image:title>${escapeXml(ogImageTitle)}</image:title>\n`
        xml += '    </image:image>\n'
      }

      xml += '  </url>\n'
    })

    // インストラクターページ（画像情報を含む）
    instructors.forEach((instructor: any) => {
      xml += '  <url>\n'
      xml += `    <loc>${escapeXml(`${baseUrl}/instructor/${instructor.slug}`)}</loc>\n`
      xml += `    <lastmod>${new Date(instructor._updatedAt || Date.now()).toISOString()}</lastmod>\n`
      xml += `    <changefreq>monthly</changefreq>\n`
      xml += `    <priority>0.7</priority>\n`

      // プロフィール画像
      const imageUrl = urlForImage(instructor.image)
      if (imageUrl) {
        xml += '    <image:image>\n'
        xml += `      <image:loc>${escapeXml(imageUrl)}</image:loc>\n`
        const imageTitle = instructor.image?.alt || `${instructor.name} - プロフィール写真`
        xml += `      <image:title>${escapeXml(imageTitle)}</image:title>\n`
        xml += '    </image:image>\n'
      }

      xml += '  </url>\n'
    })

    // XML終了
    xml += '</urlset>\n'

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)

    // エラー時は最小限のsitemapを返す
    let fallbackXml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    fallbackXml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    fallbackXml += '  <url>\n'
    fallbackXml += `    <loc>${escapeXml(baseUrl)}</loc>\n`
    fallbackXml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`
    fallbackXml += '    <changefreq>daily</changefreq>\n'
    fallbackXml += '    <priority>1.0</priority>\n'
    fallbackXml += '  </url>\n'
    fallbackXml += '</urlset>\n'

    return new NextResponse(fallbackXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  }
}
