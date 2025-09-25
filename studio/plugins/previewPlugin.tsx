import { definePlugin } from 'sanity'
import { route } from 'sanity/router'
import { useEffect } from 'react'

interface PreviewPluginOptions {
  previewUrl?: string
}

export const previewPlugin = definePlugin<PreviewPluginOptions>((options = {}) => {
  const { previewUrl = 'https://cafekinesi-nextjs.vercel.app' } = options

  return {
    name: 'preview-plugin',

    document: {
      actions: (prev, context) => {
        const PreviewAction = () => {
          const { document } = context

          if (!document.draft && !document.published) {
            return null
          }

          const doc = document.draft || document.published

          // プレビュー可能なドキュメントタイプ
          const previewableTypes = ['blogPost', 'page', 'homepage', 'album']
          if (!doc || !previewableTypes.includes(doc._type)) {
            return null
          }

          const handlePreview = () => {
            const slug = doc.slug?.current || ''
            let path = '/'

            switch (doc._type) {
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

            const url = `${previewUrl}/api/draft?preview=true&redirect=${encodeURIComponent(path)}`
            window.open(url, '_blank')
          }

          return {
            label: 'プレビュー',
            onHandle: handlePreview,
          }
        }

        return [PreviewAction(), ...prev].filter(Boolean)
      },
    },
  }
})