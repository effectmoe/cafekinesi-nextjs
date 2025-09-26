import { NextResponse } from 'next/server'
import { publicClient } from '@/lib/sanity.client'
import { generateSchemaOrg, generateBreadcrumbSchema } from '@/lib/schemaOrgGenerator'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug') || 'marker-test-post2'

    // ブログ記事を取得
    const query = `*[_type == "blogPost" && slug.current == "${slug}"][0] {
      _id,
      _type,
      _updatedAt,
      title,
      slug,
      excerpt,
      tldr,
      mainImage,
      content,
      keyPoint,
      summary,
      faq,
      category,
      tags,
      publishedAt,
      featured,
      contentOrder,
      author-> {
        name,
        image,
        bio
      },
      seo {
        title,
        description,
        keywords,
        ogImage,
        schema
      }
    }`

    const post = await publicClient.fetch(query)

    if (!post) {
      return NextResponse.json({
        success: false,
        error: 'Post not found',
        slug
      }, { status: 404 })
    }

    // Schema.orgデータを生成
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cafekinesi.com'
    const siteName = 'Cafe Kinesi'

    const schemaOrgData = generateSchemaOrg({ post, siteUrl, siteName })
    const breadcrumbSchema = generateBreadcrumbSchema(post, siteUrl, siteName)

    // Schema.orgの設定情報を取得
    const schemaSettings = post.seo?.schema || null

    return NextResponse.json({
      success: true,
      slug,
      postTitle: post.title,
      schemaSettings: {
        enabled: schemaSettings?.enabled || false,
        type: schemaSettings?.type || 'BlogPosting',
        hasCustomSchema: !!schemaSettings?.customSchema,
        additionalFields: schemaSettings ? Object.keys(schemaSettings).filter(key =>
          !['enabled', 'type', 'customSchema'].includes(key) && schemaSettings[key]
        ) : []
      },
      generatedSchemas: {
        mainSchema: schemaOrgData,
        breadcrumbSchema: breadcrumbSchema
      },
      htmlOutput: {
        mainSchema: schemaOrgData ? `<script type="application/ld+json">${JSON.stringify(schemaOrgData, null, 2)}</script>` : null,
        breadcrumbSchema: breadcrumbSchema ? `<script type="application/ld+json">${JSON.stringify(breadcrumbSchema, null, 2)}</script>` : null
      }
    })
  } catch (error: any) {
    console.error('Schema.org debug error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error',
      stack: error.stack
    }, { status: 500 })
  }
}