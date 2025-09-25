import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/sanity.client'
import { schemaGenerator } from '@/lib/schema-generator'
import { schemaValidator } from '@/lib/schema-validator'
import { SchemaStats } from '@/types/schema.types'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const type = searchParams.get('type')

  switch (action) {
    case 'stats':
      return getStats(type)
    case 'errors':
      return getErrors(type)
    case 'export':
      return exportAll(type)
    case 'health':
      return healthCheck()
    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }
}

async function healthCheck() {
  try {
    // Sanity接続テスト
    const testQuery = '*[_type == "blogPost"][0...1]{_id, title}'
    await client.fetch(testQuery)

    // スキーマ生成テスト
    const testDoc = {
      _id: 'test',
      _type: 'blogPost',
      title: 'Test Article',
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString()
    }

    const testSchema = schemaGenerator.generate(testDoc)
    const testValidation = schemaValidator.validate(testSchema)

    return NextResponse.json({
      success: true,
      status: 'healthy',
      services: {
        sanity: 'connected',
        schemaGenerator: 'working',
        validator: 'working'
      },
      testResults: {
        schemaGenerated: !!testSchema,
        validationScore: testValidation.score
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

async function getStats(type?: string | null): Promise<NextResponse> {
  try {
    const typeFilter = type && type !== 'all' ? `_type == "${type}"` : 'defined(title) || defined(name)'
    const query = `*[${typeFilter}][0...200]{
      _id,
      _type,
      title,
      name,
      slug,
      excerpt,
      description,
      publishedAt,
      mainImage,
      image,
      author->,
      category,
      tags,
      content,
      seo
    }`

    const documents = await client.fetch(query)

    let validCount = 0
    let errorCount = 0
    let totalScore = 0
    const typeCount: Record<string, number> = {}
    const scoreDistribution = { excellent: 0, good: 0, fair: 0, poor: 0 }
    const recentErrors: Array<{ id: string; title: string; type: string; errors: string[] }> = []

    documents.forEach((doc: any) => {
      // 型統計
      typeCount[doc._type] = (typeCount[doc._type] || 0) + 1

      try {
        const schema = schemaGenerator.generate(doc)
        const validation = schemaValidator.validate(schema)

        if (validation.valid) {
          validCount++
        } else {
          errorCount++
          if (recentErrors.length < 10) {
            recentErrors.push({
              id: doc._id,
              title: doc.title || doc.name,
              type: doc._type,
              errors: validation.errors
            })
          }
        }

        totalScore += validation.score

        // スコア分布
        if (validation.score >= 90) scoreDistribution.excellent++
        else if (validation.score >= 70) scoreDistribution.good++
        else if (validation.score >= 50) scoreDistribution.fair++
        else scoreDistribution.poor++
      } catch (error) {
        errorCount++
        if (recentErrors.length < 10) {
          recentErrors.push({
            id: doc._id,
            title: doc.title || doc.name,
            type: doc._type,
            errors: ['Schema generation failed']
          })
        }
      }
    })

    const stats: SchemaStats & {
      scoreDistribution: typeof scoreDistribution
      recentErrors: typeof recentErrors
      timestamp: string
    } = {
      total: documents.length,
      valid: validCount,
      errors: errorCount,
      avgScore: documents.length > 0 ? Math.round(totalScore / documents.length) : 0,
      byType: typeCount,
      scoreDistribution,
      recentErrors,
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({
      error: 'Failed to fetch statistics',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

async function getErrors(type?: string | null): Promise<NextResponse> {
  try {
    const typeFilter = type && type !== 'all' ? `_type == "${type}"` : 'defined(title) || defined(name)'
    const query = `*[${typeFilter}][0...100]{
      _id,
      _type,
      title,
      name,
      slug,
      excerpt,
      description,
      publishedAt,
      mainImage,
      image,
      author->,
      category,
      tags,
      content,
      seo
    }`

    const documents = await client.fetch(query)
    const errors: any[] = []

    documents.forEach((doc: any) => {
      try {
        const schema = schemaGenerator.generate(doc)
        const validation = schemaValidator.validate(schema)

        if (!validation.valid || validation.warnings.length > 0) {
          errors.push({
            id: doc._id,
            title: doc.title || doc.name,
            type: doc._type,
            url: doc.slug?.current,
            errors: validation.errors,
            warnings: validation.warnings,
            score: validation.score,
            schema: schema
          })
        }
      } catch (error) {
        errors.push({
          id: doc._id,
          title: doc.title || doc.name,
          type: doc._type,
          errors: ['Schema generation failed: ' + (error as Error).message],
          warnings: [],
          score: 0,
          schema: null
        })
      }
    })

    // エラーの深刻度でソート
    errors.sort((a, b) => {
      if (a.errors.length !== b.errors.length) {
        return b.errors.length - a.errors.length
      }
      return a.score - b.score
    })

    return NextResponse.json({
      errors,
      summary: {
        totalErrors: errors.length,
        criticalErrors: errors.filter(e => e.score < 50).length,
        warningsOnly: errors.filter(e => e.errors.length === 0 && e.warnings.length > 0).length
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Errors fetch error:', error)
    return NextResponse.json({
      error: 'Failed to fetch errors',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

async function exportAll(type?: string | null): Promise<NextResponse> {
  try {
    const typeFilter = type && type !== 'all' ? `_type == "${type}"` : 'defined(title) || defined(name)'
    const query = `*[${typeFilter}]{
      _id,
      _type,
      title,
      name,
      slug,
      excerpt,
      description,
      publishedAt,
      mainImage,
      image,
      author->,
      category,
      tags,
      content,
      seo
    }`

    const documents = await client.fetch(query)

    const exportData = documents.map((doc: any) => {
      try {
        const schema = schemaGenerator.generate(doc)
        const validation = schemaValidator.validate(schema)

        return {
          id: doc._id,
          type: doc._type,
          title: doc.title || doc.name,
          url: doc.slug?.current,
          schema,
          validation,
          metadata: {
            publishedAt: doc.publishedAt,
            category: doc.category,
            tags: doc.tags,
            hasImage: !!(doc.mainImage || doc.image),
            wordCount: doc.content ? doc.content.reduce((count: number, block: any) => {
              if (block._type === 'block' && block.children) {
                return count + block.children.reduce((text: string, child: any) => text + (child.text || ''), '').length
              }
              return count
            }, 0) : 0
          }
        }
      } catch (error) {
        return {
          id: doc._id,
          type: doc._type,
          title: doc.title || doc.name,
          url: doc.slug?.current,
          schema: null,
          validation: {
            valid: false,
            errors: ['Schema generation failed: ' + (error as Error).message],
            warnings: [],
            score: 0
          },
          metadata: null
        }
      }
    })

    const fileName = `schema-export-${type || 'all'}-${new Date().toISOString().split('T')[0]}.json`

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${fileName}"`
      }
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({
      error: 'Failed to export data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}