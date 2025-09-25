import { EyeOpenIcon } from '@sanity/icons'
import type { DocumentActionComponent, DocumentActionProps } from 'sanity'

export const PreviewAction: DocumentActionComponent = (
  props: DocumentActionProps
) => {
  const { draft, published, type } = props

  // ドラフトが存在する場合はドラフトを、なければ公開済みを使用
  const doc = draft || published

  // プレビュー可能なドキュメントタイプを設定
  const previewableTypes = ['blogPost', 'page', 'homepage', 'album']
  if (!previewableTypes.includes(type)) {
    return null
  }

  const handlePreview = () => {
    if (!doc) return

    // プレビューURLの生成
    // 開発環境と本番環境を判定
    const isDevelopment = window.location.hostname === 'localhost'
    const baseUrl = isDevelopment
      ? 'http://localhost:3000'
      : 'https://cafekinesi-nextjs.vercel.app'

    const previewUrl = generatePreviewUrl(doc, baseUrl)

    // 新しいタブでプレビューを開く
    window.open(previewUrl, '_blank')
  }

  const generatePreviewUrl = (document: any, baseUrl: string) => {
    const slug = document.slug?.current || ''

    // URLパラメータの構築
    const params = new URLSearchParams({
      preview: 'true',
      slug: slug,
      type: document._type,
      id: document._id,
    })

    // ドキュメントタイプに応じたパスの生成
    let path = '/'
    switch (document._type) {
      case 'blogPost':
        path = `/blog/${slug}`
        break
      case 'page':
        path = `/${slug}`
        break
      case 'homepage':
        path = '/'
        break
      case 'album':
        path = `/albums/${slug}`
        break
    }

    // api/draftエンドポイントを使用
    return `${baseUrl}/api/draft?${params}&redirect=${encodeURIComponent(path)}`
  }

  return {
    label: 'Preview',
    icon: EyeOpenIcon,
    tone: draft ? 'primary' : 'default',
    disabled: !doc,
    onHandle: handlePreview,
  }
}