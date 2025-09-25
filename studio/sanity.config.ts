import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from 'sanity/presentation'
import {contentModelGraph} from 'sanity-plugin-content-model-graph'
import {schemaTypes} from './schemas'
import {structure} from './structure/deskStructure'
import {previewPlugin} from './plugins/previewPlugin'

export default defineConfig({
  name: 'default',
  title: 'cafekinesi',

  projectId: 'e4aqw590',
  dataset: 'production',

  plugins: (() => {
    const basePlugins = [
      structureTool({
        structure
      }),
      contentModelGraph({
        exclude: ['system.*', 'sanity.*'],
        maxDepth: 4,
        style: {
          node: {
            base: {
              fill: '#667eea',
              stroke: '#764ba2',
            },
            hover: {
              fill: '#764ba2',
              stroke: '#667eea',
            },
          },
          edge: {
            stroke: '#667eea',
            strokeWidth: 2,
          },
        },
      }),
      previewPlugin({
        baseUrl: typeof window !== 'undefined' && window.location.hostname.includes('sanity.studio')
          ? 'https://cafekinesi-nextjs.vercel.app'
          : process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000',
        previewSecret: process.env.SANITY_STUDIO_PREVIEW_SECRET,
        enabledTypes: ['blogPost', 'page', 'homepage', 'album'],
        previewMode: 'tab'
      }),
    ]

    // 開発環境のみのプラグイン
    if (process.env.NODE_ENV === 'development') {
      basePlugins.push(visionTool())
    }

    // Presentation機能は必要時のみ追加
    basePlugins.push(presentationTool({
      previewUrl: {
        origin: typeof window !== 'undefined' && window.location.hostname.includes('sanity.studio')
          ? 'https://cafekinesi-nextjs.vercel.app'
          : process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000',
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
          {
            route: '/albums/:slug',
            filter: '_type == "album" && slug.current == $slug',
          },
        ],
        locations: {
          blogPost: {
            select: {
              title: 'title',
              slug: 'slug.current',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled',
                  href: `/blog/${doc?.slug}`,
                },
              ],
            }),
          },
          page: {
            select: {
              title: 'title',
              slug: 'slug.current',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled',
                  href: `/${doc?.slug}`,
                },
              ],
            }),
          },
          homepage: {
            select: {
              title: 'title',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Homepage',
                  href: '/',
                },
              ],
            }),
          },
          album: {
            select: {
              title: 'title',
              slug: 'slug.current',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled Album',
                  href: `/albums/${doc?.slug}`,
                },
              ],
            }),
          },
        },
      },
    }))

    return basePlugins
  })(),

  schema: {
    types: schemaTypes,
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
  },

  // API設定
  api: {
    projectId: 'e4aqw590',
    dataset: 'production'
  }
})