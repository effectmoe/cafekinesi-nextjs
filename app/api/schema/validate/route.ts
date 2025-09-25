import { NextRequest, NextResponse } from 'next/server'
import { schemaValidator } from '@/lib/schema-validator'

export async function POST(request: NextRequest) {
  try {
    const { schema } = await request.json()

    if (!schema) {
      return NextResponse.json({
        success: false,
        error: 'Schema is required'
      }, { status: 400 })
    }

    const validation = schemaValidator.validate(schema)

    return NextResponse.json({
      success: true,
      validation
    })
  } catch (error) {
    console.error('Schema validation error:', error)

    return NextResponse.json({
      success: false,
      error: 'Validation failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({
      success: false,
      error: 'URL parameter is required'
    }, { status: 400 })
  }

  try {
    // URLからスキーマを抽出（簡易版）
    const response = await fetch(url)
    const html = await response.text()

    const schemaMatches = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/gs)

    if (!schemaMatches) {
      return NextResponse.json({
        success: false,
        error: 'No schema found at the URL'
      }, { status: 404 })
    }

    const schemas = schemaMatches.map(match => {
      const jsonContent = match.replace(/<script type="application\/ld\+json">/, '').replace(/<\/script>/, '')
      try {
        return JSON.parse(jsonContent)
      } catch {
        return null
      }
    }).filter(Boolean)

    const validations = schemas.map(schema => schemaValidator.validate(schema))

    return NextResponse.json({
      success: true,
      schemas,
      validations
    })
  } catch (error) {
    console.error('URL validation error:', error)

    return NextResponse.json({
      success: false,
      error: 'Failed to validate URL',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}