import { NextResponse } from 'next/server'
import { client, publicClient, previewClient } from '@/lib/sanity.client'
import { draftMode } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug') || 'marker-test-post2'
    const testPreview = searchParams.get('testPreview') === 'true'

    const draft = await draftMode()
    const isPreview = draft.isEnabled || testPreview

    // 各クライアントでデータを取得
    const queries = {
      // 通常のクエリ（完全なデータ）
      published: `*[_type == "blogPost" && slug.current == "${slug}"][0] {
        _id,
        _type,
        title,
        slug,
        excerpt,
        tldr,
        mainImage,
        gallery,
        additionalImages,
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
        "status": "published"
      }`,

      // ドラフトを含むクエリ
      withDrafts: `*[_type == "blogPost" && slug.current == "${slug}"] {
        _id,
        title,
        slug,
        "isDraft": _id in path("drafts.*")
      }`,

      // ドラフトのみを取得
      draftsOnly: `*[_type == "blogPost" && slug.current == "${slug}" && _id in path("drafts.*")] {
        _id,
        title,
        slug
      }`,

      // すべてのドラフト
      allDrafts: `*[_id in path("drafts.*") && _type == "blogPost"][0...10] {
        _id,
        title,
        slug
      }`
    }

    const results: any = {}

    // publicClientでの結果
    results.publicClient = {
      published: await publicClient.fetch(queries.published),
      withDrafts: await publicClient.fetch(queries.withDrafts),
      config: {
        perspective: publicClient.config().perspective,
        useCdn: publicClient.config().useCdn,
        hasToken: !!publicClient.config().token
      }
    }

    // previewClientでの結果
    results.previewClient = {
      published: await previewClient.fetch(queries.published),
      withDrafts: await previewClient.fetch(queries.withDrafts),
      draftsOnly: await previewClient.fetch(queries.draftsOnly),
      allDrafts: await previewClient.fetch(queries.allDrafts),
      config: {
        perspective: previewClient.config().perspective,
        useCdn: previewClient.config().useCdn,
        hasToken: !!previewClient.config().token,
        apiVersion: previewClient.config().apiVersion
      }
    }

    // 現在使用中のクライアント
    const activeClient = isPreview ? previewClient : publicClient
    results.activeClient = {
      name: isPreview ? 'previewClient' : 'publicClient',
      result: await activeClient.fetch(queries.withDrafts)
    }

    return NextResponse.json({
      success: true,
      slug,
      isPreview,
      draftModeEnabled: draft.isEnabled,
      results,
      environment: {
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
        hasToken: !!(process.env.NEXT_PUBLIC_SANITY_API_TOKEN || process.env.SANITY_API_READ_TOKEN),
        nodeEnv: process.env.NODE_ENV
      }
    })
  } catch (error: any) {
    console.error('Sanity debug error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error',
      stack: error.stack
    }, { status: 500 })
  }
}