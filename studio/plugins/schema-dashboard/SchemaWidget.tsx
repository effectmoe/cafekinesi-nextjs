import React, { useState, useEffect } from 'react'
import { Card, Stack, Text, Box, Button, Spinner, Badge, Flex } from '@sanity/ui'
import { useClient } from 'sanity'
import { schemaValidator } from '../../../lib/schema-validator'
import { schemaGenerator } from '../../../lib/schema-generator'

export function SchemaWidget() {
  const client = useClient()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [errors, setErrors] = useState<any[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000) // 30秒ごとに更新
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const query = `{
        "total": count(*[defined(title) || defined(name)]),
        "documents": *[defined(title) || defined(name)] | order(_updatedAt desc) [0...50] {
          _id,
          _type,
          title,
          name,
          slug,
          _updatedAt,
          mainImage,
          image,
          excerpt,
          description,
          publishedAt,
          author->,
          category,
          tags
        }
      }`

      const data = await client.fetch(query)

      // 統計を計算
      const typeCount: Record<string, number> = {}
      const validationResults: any[] = []
      let validCount = 0
      let totalScore = 0

      data.documents.forEach((doc: any) => {
        // 型統計
        typeCount[doc._type] = (typeCount[doc._type] || 0) + 1

        // スキーマ生成と検証
        try {
          const generatedSchema = schemaGenerator.generate(doc)
          const validation = schemaValidator.validate(generatedSchema)

          if (validation.valid) {
            validCount++
          } else if (validation.errors.length > 0) {
            validationResults.push({
              id: doc._id,
              title: doc.title || doc.name,
              type: doc._type,
              errors: validation.errors,
              warnings: validation.warnings,
              score: validation.score
            })
          }

          totalScore += validation.score
        } catch (error) {
          validationResults.push({
            id: doc._id,
            title: doc.title || doc.name,
            type: doc._type,
            errors: ['Schema generation failed: ' + (error as Error).message],
            warnings: [],
            score: 0
          })
        }
      })

      setStats({
        total: data.total,
        types: typeCount,
        valid: validCount,
        avgScore: data.documents.length > 0 ? Math.round(totalScore / data.documents.length) : 0,
        documents: data.documents.slice(0, 5) // 最新5件のみ表示
      })

      setErrors(validationResults.slice(0, 3)) // エラー上位3件
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to fetch schema data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !stats) {
    return (
      <Card padding={4} style={{ minHeight: 200 }}>
        <Flex align="center" justify="center" style={{ height: 150 }}>
          <Spinner />
        </Flex>
      </Card>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'positive'
    if (score >= 70) return 'caution'
    return 'critical'
  }

  return (
    <Card padding={4}>
      <Stack space={4}>
        <Flex justify="space-between" align="center">
          <Text size={2} weight="semibold">
            📊 Schema.org Status
          </Text>
          <Button
            text="Refresh"
            mode="ghost"
            tone="primary"
            onClick={fetchData}
            disabled={loading}
          />
        </Flex>

        <Box>
          <Stack space={3}>
            {/* 基本統計 */}
            <Flex gap={3} wrap="wrap">
              <Box>
                <Text size={1} muted>Total Documents</Text>
                <Text size={3} weight="bold">{stats?.total || 0}</Text>
              </Box>
              <Box>
                <Text size={1} muted>Valid Schemas</Text>
                <Text size={3} weight="bold" style={{ color: 'var(--card-positive-fg-color)' }}>
                  {stats?.valid || 0}
                </Text>
              </Box>
              <Box>
                <Text size={1} muted>Avg Score</Text>
                <Badge
                  tone={getScoreColor(stats?.avgScore || 0)}
                  text={`${stats?.avgScore || 0}%`}
                />
              </Box>
            </Flex>

            {/* ドキュメントタイプ別 */}
            <Box>
              <Text size={1} muted style={{ marginBottom: 8, display: 'block' }}>
                Document Types
              </Text>
              <Flex gap={2} wrap="wrap">
                {stats?.types && Object.entries(stats.types).map(([type, count]) => (
                  <Badge
                    key={type}
                    mode="outline"
                    text={`${type}: ${count}`}
                  />
                ))}
              </Flex>
            </Box>

            {/* エラー表示 */}
            {errors.length > 0 && (
              <Box>
                <Text size={1} muted style={{ marginBottom: 8, display: 'block' }}>
                  Validation Issues ({errors.length})
                </Text>
                <Stack space={2}>
                  {errors.map((error, index) => (
                    <Card
                      key={error.id}
                      padding={2}
                      tone="critical"
                      border
                    >
                      <Stack space={1}>
                        <Text size={0} weight="medium">
                          {error.title} ({error.type})
                        </Text>
                        <Text size={0} muted>
                          Score: {error.score}% • {error.errors.length} errors
                        </Text>
                      </Stack>
                    </Card>
                  ))}
                </Stack>
              </Box>
            )}

            {/* 最終更新 */}
            <Box>
              <Text size={0} muted>
                Last updated: {lastUpdate.toLocaleTimeString()}
              </Text>
            </Box>

            {/* 外部ダッシュボードリンク */}
            <Button
              text="Open Full Dashboard"
              tone="primary"
              onClick={() => window.open('/admin/schema-dashboard', '_blank')}
            />
          </Stack>
        </Box>
      </Stack>
    </Card>
  )
}