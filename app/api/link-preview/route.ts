import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkPreviewBot/1.0)',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`)
    }

    const html = await response.text()

    // OGタイトルを抽出
    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["'][^>]*>/i)
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)

    // OG画像を抽出
    const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i)

    // OG説明を抽出
    const ogDescriptionMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["'][^>]*>/i)
    const descriptionMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i)

    // ファビコンを抽出
    const faviconMatch = html.match(/<link[^>]*rel=["'](?:icon|shortcut icon)["'][^>]*href=["']([^"']+)["'][^>]*>/i)
    let favicon = faviconMatch?.[1] || null

    // 相対URLの場合は絶対URLに変換
    if (favicon && !favicon.startsWith('http')) {
      const urlObj = new URL(url)
      if (favicon.startsWith('//')) {
        favicon = `https:${favicon}`
      } else if (favicon.startsWith('/')) {
        favicon = `${urlObj.protocol}//${urlObj.host}${favicon}`
      } else {
        favicon = `${urlObj.protocol}//${urlObj.host}/${favicon}`
      }
    }

    // ファビコンが見つからない場合はデフォルトのfavicon.icoを試す
    if (!favicon) {
      const urlObj = new URL(url)
      favicon = `${urlObj.protocol}//${urlObj.host}/favicon.ico`
    }

    const title = ogTitleMatch?.[1] || titleMatch?.[1] || new URL(url).hostname
    const image = ogImageMatch?.[1] || null
    const description = ogDescriptionMatch?.[1] || descriptionMatch?.[1] || null

    return NextResponse.json({
      title,
      image,
      description,
      favicon,
      url,
    })
  } catch (error) {
    console.error('Link preview error:', error)
    const urlObj = new URL(url)
    return NextResponse.json(
      {
        title: urlObj.hostname,
        image: null,
        description: null,
        favicon: `${urlObj.protocol}//${urlObj.host}/favicon.ico`,
        url,
      },
      { status: 200 } // エラーでもフォールバック値を返す
    )
  }
}
