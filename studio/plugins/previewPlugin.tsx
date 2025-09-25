import { definePlugin, DocumentActionComponent, DocumentActionProps } from 'sanity'
import { EyeOpenIcon } from '@sanity/icons'

export interface PreviewPluginConfig {
  baseUrl?: string
  previewSecret?: string
  urlPatterns?: {
    [documentType: string]: (document: any) => string
  }
  enabledTypes?: string[]
  previewMode?: 'iframe' | 'popup' | 'tab'
}

export const previewPlugin = definePlugin<PreviewPluginConfig>((config = {}) => {
  const {
    baseUrl = 'https://cafekinesi-nextjs.vercel.app',
    previewSecret,
    urlPatterns = {},
    enabledTypes = ['blogPost', 'page', 'homepage', 'album'],
    previewMode = 'tab'
  } = config

  // デフォルトのURLパターン
  const defaultUrlPatterns: { [key: string]: (doc: any) => string } = {
    blogPost: (doc) => `/blog/${doc.slug?.current || ''}`,
    page: (doc) => doc.slug?.current === 'home' ? '/' : `/${doc.slug?.current || ''}`,
    homepage: () => '/',
    album: (doc) => `/albums/${doc.slug?.current || ''}`
  }

  const finalUrlPatterns = { ...defaultUrlPatterns, ...urlPatterns }

  return {
    name: 'preview-plugin',

    document: {
      // Document Actionsの追加
      actions: (prev, context) => {
        const { schemaType } = context

        // 特定のドキュメントタイプでのみ有効化
        if (enabledTypes.length > 0 && !enabledTypes.includes(schemaType)) {
          return prev
        }

        // カスタムプレビューアクション
        const PreviewAction: DocumentActionComponent = (props: DocumentActionProps) => {
          const { draft, published, type } = props
          const doc = draft || published

          // プレビューURL生成
          const getPreviewUrl = () => {
            if (!doc || !doc._type) return null

            const pattern = finalUrlPatterns[doc._type]
            if (!pattern) return null

            try {
              const path = pattern(doc)
              const effectiveBaseUrl = typeof window !== 'undefined' && window.location.hostname.includes('sanity.studio')
                ? 'https://cafekinesi-nextjs.vercel.app'
                : baseUrl

              // Draft APIエンドポイントを使用
              const url = new URL('/api/draft', effectiveBaseUrl)
              url.searchParams.set('preview', 'true')
              url.searchParams.set('redirect', path)

              if (previewSecret) {
                url.searchParams.set('secret', previewSecret)
              }

              url.searchParams.set('type', doc._type)
              url.searchParams.set('id', doc._id)
              url.searchParams.set('isDraft', draft ? 'true' : 'false')

              return url.toString()
            } catch (error) {
              console.error('プレビューURL生成エラー:', error)
              return null
            }
          }

          const previewUrl = getPreviewUrl()

          const handlePreview = () => {
            if (!previewUrl) return

            switch (previewMode) {
              case 'popup':
                window.open(
                  previewUrl,
                  'preview',
                  'width=1200,height=800,scrollbars=yes,resizable=yes'
                )
                break
              case 'tab':
              default:
                window.open(previewUrl, '_blank', 'noopener,noreferrer')
                break
            }
          }

          if (!previewUrl) return null

          return {
            label: 'プレビュー',
            icon: EyeOpenIcon,
            tone: 'primary',
            onHandle: handlePreview,
            shortcut: 'Ctrl+Alt+P',
            disabled: !doc,
            title: `${doc?._type || 'ドキュメント'}をプレビュー`
          }
        }

        return [...prev, PreviewAction]
      },

      // Production URLの自動生成
      productionUrl: async (prev, { document }) => {
        const pattern = finalUrlPatterns[document._type]
        if (!pattern) return prev

        try {
          const path = pattern(document)
          const effectiveBaseUrl = typeof window !== 'undefined' && window.location.hostname.includes('sanity.studio')
            ? 'https://cafekinesi-nextjs.vercel.app'
            : baseUrl

          const url = new URL(path, effectiveBaseUrl)

          if (previewSecret) {
            url.searchParams.set('preview', previewSecret)
            url.searchParams.set('type', document._type)
            url.searchParams.set('id', document._id)
          }

          return url.toString()
        } catch (error) {
          console.error('Production URL生成エラー:', error)
          return prev
        }
      }
    }
  }
})