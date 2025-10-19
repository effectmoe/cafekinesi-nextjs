import React from 'react'
import {Card, Stack, Heading, Text, Box, Grid, Badge} from '@sanity/ui'
import {schemaTypes} from '../schemas/index'

export function SchemaMapDashboard() {
  // schemas/index.tsから直接取得
  const documentTypes = schemaTypes?.filter(type => type?.type === 'document') || []

  // 非推奨スキーマの定義（手動管理が必要）
  const deprecatedSchemas = [
    {name: 'service', reason: 'フロントエンド未実装'},
    {name: 'person', reason: 'instructorと重複'},
    {name: 'organization', reason: '将来用に保持'},
    {name: 'aiContent', reason: 'AI検索最適化用（将来）'},
    {name: 'news', reason: 'フロントエンドページ未実装'},
    {name: 'menuItem', reason: 'カフェメニュー機能未実装'},
    {name: 'shopInfo', reason: '店舗情報ページ未実装'},
    {name: 'category', reason: 'menuItemの参照先（未使用）'},
  ]
  const deprecatedNames = deprecatedSchemas.map(s => s.name)

  // AI検索対応スキーマ（手動管理が必要）
  const aiSearchEnabled = ['blogPost', 'course', 'instructor', 'event']

  // カテゴリ定義リスト（カテゴリに含まれるスキーマ名）
  const categoryDefinitions = {
    page: ['homepage', 'aboutPage', 'page', 'schoolPage', 'schoolPageContent', 'instructorPage', 'profilePage'],
    content: ['blogPost', 'author', 'course', 'instructor', 'event', 'category'],
    settings: ['siteSettings', 'chatModal', 'faq', 'faqCategory', 'faqCard', 'chatConfiguration', 'menuItem', 'shopInfo'],
    aiRag: ['ragConfiguration', 'aiGuardrails', 'aiProviderSettings', 'knowledgeBase'],
    other: ['representative'],
    aiFirst: ['person', 'service', 'organization', 'aiContent'],
  }

  // 全カテゴリに含まれるスキーマ名のリスト
  const allCategorizedNames = Object.values(categoryDefinitions).flat()

  // カテゴリ別に分類
  const pageSchemas = documentTypes.filter(type => categoryDefinitions.page.includes(type.name))
  const contentSchemas = documentTypes.filter(type => categoryDefinitions.content.includes(type.name))
  const settingsSchemas = documentTypes.filter(type => categoryDefinitions.settings.includes(type.name))
  const aiRagSchemas = documentTypes.filter(type => categoryDefinitions.aiRag.includes(type.name))
  const otherSchemas = documentTypes.filter(type => categoryDefinitions.other.includes(type.name))
  const aiFirstSchemas = documentTypes.filter(type => categoryDefinitions.aiFirst.includes(type.name))

  // カテゴリに含まれていないスキーマを自動検出（未分類スキーマ）
  const uncategorizedSchemas = documentTypes.filter(type =>
    !allCategorizedNames.includes(type.name) && type.name !== 'schemaMap'
  )

  // 使用中のスキーマ数を自動計算
  const activeCount = documentTypes.filter(type =>
    type && type.name && !deprecatedNames.includes(type.name)
  ).length

  const schemaGroups = [
    {
      title: '📄 ページ管理',
      schemas: pageSchemas
    },
    {
      title: '📝 コンテンツ',
      schemas: contentSchemas
    },
    {
      title: '⚙️ 設定',
      schemas: settingsSchemas
    },
    {
      title: '🤖 AI/RAG',
      schemas: aiRagSchemas
    },
    {
      title: '👤 その他',
      schemas: otherSchemas
    },
    {
      title: '🤖 AI-First',
      schemas: aiFirstSchemas
    }
  ]

  return (
    <Box padding={4}>
      <Stack space={4}>
        <Card padding={4} radius={2} shadow={1} tone="primary">
          <Stack space={3}>
            <Heading as="h1" size={2}>📊 Sanity スキーママップ</Heading>
            <Text size={1}>
              このマップは、各Sanityスキーマがフロントエンドのどこで使用されているかを示します。
            </Text>
            <Grid columns={3} gap={3}>
              <Card padding={3} radius={2} tone="positive">
                <Stack space={2}>
                  <Text weight="bold" size={2}>{documentTypes.length}個</Text>
                  <Text size={1}>全ドキュメントタイプ</Text>
                </Stack>
              </Card>
              <Card padding={3} radius={2} tone="default">
                <Stack space={2}>
                  <Text weight="bold" size={2}>{activeCount}個</Text>
                  <Text size={1}>使用中</Text>
                </Stack>
              </Card>
              <Card padding={3} radius={2} tone="caution">
                <Stack space={2}>
                  <Text weight="bold" size={2}>{deprecatedSchemas.length}個</Text>
                  <Text size={1}>非推奨</Text>
                </Stack>
              </Card>
            </Grid>
          </Stack>
        </Card>

        {schemaGroups.map((group, index) => {
          if (group.schemas.length === 0) return null

          return (
            <Card key={index} padding={4} radius={2} shadow={1}>
              <Stack space={3}>
                <Heading as="h2" size={1}>{group.title}</Heading>
                <Stack space={2}>
                  {group.schemas.map((schemaType, schemaIndex) => (
                    <Card key={schemaIndex} padding={3} radius={2} tone="default" border>
                      <Stack space={2}>
                        <Box>
                          <Text weight="bold" size={1}>
                            {schemaType.title || schemaType.name}
                            {aiSearchEnabled.includes(schemaType.name) && (
                              <Badge tone="primary" marginLeft={2} fontSize={0}>
                                🤖 AI検索対応
                              </Badge>
                            )}
                          </Text>
                        </Box>
                        <Text size={1} muted>
                          スキーマ名: {schemaType.name}
                        </Text>
                        {schemaType.description && (
                          <Text size={1} muted>
                            {schemaType.description}
                          </Text>
                        )}
                      </Stack>
                    </Card>
                  ))}
                </Stack>
              </Stack>
            </Card>
          )
        })}

        <Card padding={4} radius={2} shadow={1} tone="caution">
          <Stack space={3}>
            <Heading as="h2" size={1}>⚠️ 非推奨化されたスキーマ（{deprecatedSchemas.length}個）</Heading>
            <Text size={1}>
              以下のスキーマは非推奨化され、Sanity Studioから非表示になっています。
            </Text>
            <Stack space={2}>
              {deprecatedSchemas.map((schema, index) => (
                <Card key={index} padding={3} radius={2} tone="default" border>
                  <Stack space={1}>
                    <Text weight="bold" size={1}>
                      {schema.name}
                    </Text>
                    <Text size={1} muted>
                      理由: {schema.reason}
                    </Text>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Stack>
        </Card>

        {uncategorizedSchemas.length > 0 && (
          <Card padding={4} radius={2} shadow={1} tone="critical">
            <Stack space={3}>
              <Heading as="h2" size={1}>⚠️ 未分類スキーマ（{uncategorizedSchemas.length}個）</Heading>
              <Text size={1}>
                以下のスキーマはどのカテゴリにも含まれていません。SchemaMapDashboard.tsxのcategoryDefinitionsに追加してください。
              </Text>
              <Stack space={2}>
                {uncategorizedSchemas.map((schema, index) => (
                  <Card key={index} padding={3} radius={2} tone="default" border>
                    <Stack space={1}>
                      <Text weight="bold" size={1}>
                        {schema.title || schema.name}
                      </Text>
                      <Text size={1} muted>
                        スキーマ名: {schema.name}
                      </Text>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Stack>
          </Card>
        )}

        <Card padding={4} radius={2} shadow={1} tone="primary">
          <Stack space={3}>
            <Heading as="h2" size={1}>📚 スキーマ統計</Heading>
            <Stack space={2}>
              <Text size={1}>
                • <strong>全ドキュメントタイプ</strong>: {documentTypes.length}個
              </Text>
              <Text size={1}>
                • <strong>使用中</strong>: {activeCount}個
              </Text>
              <Text size={1}>
                • <strong>非推奨</strong>: {deprecatedSchemas.length}個
              </Text>
              <Text size={1}>
                • <strong>AI検索対応</strong>: {aiSearchEnabled.length}個
              </Text>
              {uncategorizedSchemas.length > 0 && (
                <Text size={1} style={{color: 'red'}}>
                  • <strong>⚠️ 未分類</strong>: {uncategorizedSchemas.length}個
                </Text>
              )}
            </Stack>
          </Stack>
        </Card>

        <Card padding={4} radius={2} shadow={1} tone="default">
          <Stack space={3}>
            <Heading as="h2" size={1}>📚 ドキュメント</Heading>
            <Text size={1}>
              より詳細な情報は以下のドキュメントを参照してください：
            </Text>
            <Stack space={2}>
              <Text size={1}>
                • <strong>SCHEMA_MAP.md</strong>: スキーマとページの完全な対応表
              </Text>
              <Text size={1}>
                • <strong>deskStructure.ts</strong>: Sanity Studioの表示構造
              </Text>
              <Text size={1}>
                • <strong>schemas/index.ts</strong>: 全スキーマの登録ファイル
              </Text>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Box>
  )
}
