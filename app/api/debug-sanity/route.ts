export const dynamic = 'force-dynamic'

export async function GET() {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL_REGION: process.env.VERCEL_REGION,
    },
    sanity: {
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      hasToken: !!process.env.SANITY_TOKEN,
    }
  }

  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'e4aqw590'
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
    const apiVersion = '2024-01-01'

    const query = encodeURIComponent('*[_type == "blogPost"][0...1]')
    const url = `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}?query=${query}`

    console.log('[Debug API] Fetching from:', url)

    const response = await fetch(url, { cache: 'no-store' })
    const data = await response.json()

    return Response.json({
      success: true,
      debug: debugInfo,
      sanityResponse: {
        status: response.status,
        dataCount: data?.result?.length || 0,
        firstPost: data?.result?.[0]?.title || 'No data'
      },
      fullUrl: url
    })
  } catch (error) {
    return Response.json({
      success: false,
      debug: debugInfo,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}