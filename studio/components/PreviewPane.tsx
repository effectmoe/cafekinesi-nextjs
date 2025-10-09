import React from 'react'
import { Button, Card, Flex, Text, Box } from '@sanity/ui'
import { EyeOpenIcon } from '@sanity/icons'
import { DocumentPaneContext, DocumentPaneNode } from 'sanity/structure'

export function PreviewPane(props: DocumentPaneNode) {
  const { options } = props
  const documentId = options.id
  const documentType = options.type

  const handlePreview = () => {
    // 開発環境か本番環境かを判定
    const baseUrl = window.location.hostname === 'localhost'
      ? 'http://localhost:3000'
      : 'https://cafekinesi.com'

    // ドキュメントタイプに応じたパスを生成
    let previewPath = '/'

    // aboutPageの場合はトップページの#about-sectionにリダイレクト
    if (documentType === 'aboutPage') {
      previewPath = '/#about-section'
    }

    // chatModalの場合はホームページ（チャットモーダルが表示される）
    if (documentType === 'chatModal') {
      previewPath = '/'
    }

    // siteSettingsの場合はホームページ
    if (documentType === 'siteSettings') {
      previewPath = '/'
    }

    // IDからドキュメントを取得する必要があるため、
    // 一旦ドラフトモードのAPIエンドポイントに誘導
    const url = `${baseUrl}/api/draft?preview=true&id=${documentId}&type=${documentType}&redirect=${encodeURIComponent(previewPath)}`

    window.open(url, '_blank')
  }

  return (
    <Card padding={4}>
      <Flex direction="column" gap={3}>
        <Text size={2} weight="semibold">
          プレビュー
        </Text>
        <Text size={1} muted>
          このドキュメントをプレビューモードで表示します
        </Text>
        <Box marginTop={2}>
          <Button
            icon={EyeOpenIcon}
            onClick={handlePreview}
            text="プレビューを開く"
            tone="primary"
          />
        </Box>
      </Flex>
    </Card>
  )
}