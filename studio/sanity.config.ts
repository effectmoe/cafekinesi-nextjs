import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from 'sanity/presentation'
import {schemaTypes} from './schemas'
import {structure} from './structure/deskStructure'
import {PreviewAction} from './actions/PreviewAction'

export default defineConfig({
  name: 'default',
  title: 'cafekinesi',

  projectId: 'e4aqw590',
  dataset: 'production',

  plugins: [
    structureTool({
      structure
    }),
    visionTool(),
    presentationTool({
      previewUrl: {
        origin: process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000',
        draftMode: {
          enable: '/api/draft',
        },
      },
      resolve: {
        mainDocuments: [
          {
            route: '/',
            filter: '_type == "homepage"',
          },
          {
            route: '/:slug',
            filter: '_type == "page" && slug.current == $slug',
          },
          {
            route: '/blog/:slug',
            filter: '_type == "blogPost" && slug.current == $slug',
          },
        ],
      },
    })
  ],

  schema: {
    types: schemaTypes,
  },

  // ドキュメントアクションの設定 - プレビューボタンを追加
  document: {
    actions: (prev, context) => {
      // プレビューアクションを既存のアクションに追加
      const actions = [...prev]

      // Publishボタンの直前にPreviewボタンを挿入
      const publishIndex = actions.findIndex(
        (action) => action.name === 'publish'
      )

      if (publishIndex > -1) {
        actions.splice(publishIndex, 0, PreviewAction)
      } else {
        // Publishボタンが見つからない場合は最後に追加
        actions.push(PreviewAction)
      }

      return actions
    },
  },

  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:3333',
      'http://localhost:5173',
      'http://localhost:8080',
      'http://localhost:8081',
      'http://localhost:8082',
      'https://cafekinesi-99dc5473.vercel.app',
      'https://cafekinesi-nextjs.vercel.app',
      'https://cafekinesi.sanity.studio',
      'https://*.vercel.app'
    ],
    credentials: true
  }
})