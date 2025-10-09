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
    enabledTypes = ['blogPost', 'page', 'homepage', 'album', 'course', 'chatModal', 'siteSettings'],
    previewMode = 'tab'
  } = config

  // デフォルトのURLパターン
  const defaultUrlPatterns: { [key: string]: (doc: any) => string } = {
    blogPost: (doc) => `/blog/${doc.slug?.current || ''}`,
    page: (doc) => doc.slug?.current === 'home' ? '/' : `/${doc.slug?.current || ''}`,
    homepage: () => '/',
    aboutPage: () => '/#about-section',
    album: (doc) => `/albums/${doc.slug?.current || ''}`,
    course: (doc) => `/school/${doc.courseId || ''}`,
    schoolPage: () => '/school',
    instructorPage: () => '/instructor',
    chatModal: () => '/',
    siteSettings: () => '/',
    instructor: (doc) => {
      // 都道府県名からスラッグへのマッピング
      const prefectureToSlug: { [key: string]: string } = {
        '北海道': 'hokkaido',
        '青森県': 'aomori',
        '岩手県': 'iwate',
        '宮城県': 'miyagi',
        '秋田県': 'akita',
        '山形県': 'yamagata',
        '福島県': 'fukushima',
        '茨城県': 'ibaraki',
        '栃木県': 'tochigi',
        '群馬県': 'gunma',
        '埼玉県': 'saitama',
        '千葉県': 'chiba',
        '東京都': 'tokyo',
        '神奈川県': 'kanagawa',
        '新潟県': 'niigata',
        '富山県': 'toyama',
        '石川県': 'ishikawa',
        '福井県': 'fukui',
        '山梨県': 'yamanashi',
        '長野県': 'nagano',
        '岐阜県': 'gifu',
        '静岡県': 'shizuoka',
        '愛知県': 'aichi',
        '三重県': 'mie',
        '滋賀県': 'shiga',
        '京都府': 'kyoto',
        '大阪府': 'osaka',
        '兵庫県': 'hyogo',
        '奈良県': 'nara',
        '和歌山県': 'wakayama',
        '鳥取県': 'tottori',
        '島根県': 'shimane',
        '岡山県': 'okayama',
        '広島県': 'hiroshima',
        '山口県': 'yamaguchi',
        '徳島県': 'tokushima',
        '香川県': 'kagawa',
        '愛媛県': 'ehime',
        '高知県': 'kochi',
        '福岡県': 'fukuoka',
        '佐賀県': 'saga',
        '長崎県': 'nagasaki',
        '熊本県': 'kumamoto',
        '大分県': 'oita',
        '宮崎県': 'miyazaki',
        '鹿児島県': 'kagoshima',
        '沖縄県': 'okinawa',
      }
      const prefectureSlug = doc.region ? prefectureToSlug[doc.region] || 'hokkaido' : 'hokkaido'
      return `/instructor/${prefectureSlug}/${doc.slug?.current || ''}`
    }
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
      }
    }
  }
})