import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from 'sanity/presentation'
import {schemaTypes} from './schemas'
import {structure} from './structure/deskStructure'

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
        origin: 'https://cafekinesi-nextjs.vercel.app',
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