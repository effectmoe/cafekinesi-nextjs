import React from 'react'
import {Card, Stack, Heading, Text, Box, Grid, Badge} from '@sanity/ui'

export function SchemaMapDashboard() {
  const schemaGroups = [
    {
      title: '📄 ページ管理',
      schemas: [
        {name: 'homepage', title: 'ホームページ', usage: '/', status: '✅'},
        {name: 'aboutPage', title: 'カフェキネシについて', usage: '/', status: '✅'},
        {name: 'page', title: 'ページ', usage: '/[slug]', status: '✅'},
        {name: 'schoolPage', title: 'スクールページ設定', usage: '/school', status: '✅'},
        {name: 'instructorPage', title: 'インストラクターページ設定', usage: '/instructor', status: '✅'},
        {name: 'profilePage', title: 'プロフィールページ', usage: '/profile', status: '✅'},
      ]
    },
    {
      title: '📝 コンテンツ',
      schemas: [
        {name: 'blogPost', title: 'ブログ記事', usage: '/blog, /blog/[slug]', status: '✅', aiSearch: true},
        {name: 'author', title: '著者', usage: '/author/[slug], /blog/*', status: '✅'},
        {name: 'course', title: '講座', usage: '/school, /school/[courseId]', status: '✅', aiSearch: true},
        {name: 'instructor', title: 'インストラクター', usage: '/instructor, /instructor/[prefecture]/[slug]', status: '✅', aiSearch: true},
        {name: 'event', title: 'イベント', usage: '/events/[slug], /calendar', status: '✅', aiSearch: true},
      ]
    },
    {
      title: '⚙️ 設定',
      schemas: [
        {name: 'siteSettings', title: 'サイト設定', usage: '全ページ', status: '✅'},
        {name: 'chatModal', title: 'チャットモーダル設定', usage: '/', status: '✅'},
        {name: 'faqCard', title: 'FAQ質問カード', usage: '/ (チャットモーダル)', status: '✅'},
        {name: 'chatConfiguration', title: 'チャット設定', usage: '/api/chat/rag', status: '✅'},
      ]
    },
    {
      title: '🤖 AI/RAG',
      schemas: [
        {name: 'ragConfiguration', title: 'RAG設定', usage: '/api/chat/rag', status: '✅'},
        {name: 'aiGuardrails', title: 'AIガードレール設定', usage: '/api/chat/rag', status: '✅'},
        {name: 'aiProviderSettings', title: 'AIプロバイダー設定', usage: '/api/chat/rag', status: '✅'},
        {name: 'knowledgeBase', title: 'ナレッジベース', usage: 'RAG', status: '✅'},
      ]
    },
    {
      title: '👤 その他',
      schemas: [
        {name: 'representative', title: '代表者', usage: 'API（DB同期）', status: '✅'},
      ]
    }
  ]

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
                  <Text weight="bold" size={2}>20個</Text>
                  <Text size={1}>使用中のスキーマ</Text>
                </Stack>
              </Card>
              <Card padding={3} radius={2} tone="caution">
                <Stack space={2}>
                  <Text weight="bold" size={2}>8個</Text>
                  <Text size={1}>非推奨化</Text>
                </Stack>
              </Card>
              <Card padding={3} radius={2} tone="primary">
                <Stack space={2}>
                  <Text weight="bold" size={2}>4個</Text>
                  <Text size={1}>AI検索対応</Text>
                </Stack>
              </Card>
            </Grid>
          </Stack>
        </Card>

        {schemaGroups.map((group, index) => (
          <Card key={index} padding={4} radius={2} shadow={1}>
            <Stack space={3}>
              <Heading as="h2" size={1}>{group.title}</Heading>
              <Stack space={2}>
                {group.schemas.map((schema, schemaIndex) => (
                  <Card key={schemaIndex} padding={3} radius={2} tone="default" border>
                    <Stack space={2}>
                      <Box>
                        <Text weight="bold" size={1}>
                          {schema.title}
                          {schema.aiSearch && (
                            <Badge tone="primary" marginLeft={2} fontSize={0}>
                              🤖 AI検索対応
                            </Badge>
                          )}
                        </Text>
                      </Box>
                      <Text size={1} muted>
                        <strong>スキーマ名:</strong> <code>{schema.name}</code>
                      </Text>
                      <Text size={1} muted>
                        <strong>使用箇所:</strong> {schema.usage}
                      </Text>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Stack>
          </Card>
        ))}

        <Card padding={4} radius={2} shadow={1} tone="caution">
          <Stack space={3}>
            <Heading as="h2" size={1}>⚠️ 非推奨化されたスキーマ（8個）</Heading>
            <Text size={1}>
              以下のスキーマは非推奨化され、Sanity Studioから非表示になっています。
            </Text>
            <Stack space={2}>
              {deprecatedSchemas.map((schema, index) => (
                <Card key={index} padding={3} radius={2} tone="default" border>
                  <Stack space={1}>
                    <Text weight="bold" size={1}>
                      <code>{schema.name}</code>
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

        <Card padding={4} radius={2} shadow={1} tone="primary">
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
                • <strong>SCHEMA_ANALYSIS.md</strong>: 自動生成された分析レポート
              </Text>
              <Text size={1}>
                • <strong>npm run analyze:schemas</strong>: 最新のレポートを生成
              </Text>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Box>
  )
}
