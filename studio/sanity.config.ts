import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from 'sanity/presentation'
import {assist} from '@sanity/assist'
import contentModelGraph from 'sanity-plugin-content-model-graph'
import {schemaTypes} from './schemas'
import {structure} from './structure/deskStructure'
import {previewPlugin} from './plugins/previewPlugin'
import { type UserConfig } from 'vite'
import {updateEmbeddingAction} from './components/actions/updateEmbeddingAction'
import {jaJPLocale} from '@sanity/locale-ja-jp'

export default defineConfig({
  name: 'default',
  title: 'cafekinesi',

  projectId: 'e4aqw590',
  dataset: 'production',

  // 国際化設定 - 日本語をデフォルトに
  i18n: {
    bundles: [jaJPLocale],
  },

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
        enabledTypes: ['blogPost', 'page', 'homepage', 'aboutPage', 'album', 'course', 'instructor', 'schoolPage', 'instructorPage', 'chatModal', 'siteSettings'],
        previewMode: 'tab'
      }),
      assist({
        // AI Assist機能の設定
        // - 画像のalt textの自動生成
        // - キーワードの提案
        // - コンテンツの最適化支援
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
            route: '/#about-section',
            filter: '_type == "aboutPage"',
          },
          {
            route: '/school',
            filter: '_type == "schoolPage"',
          },
          {
            route: '/instructor',
            filter: '_type == "instructorPage"',
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
          {
            route: '/school/:courseId',
            filter: '_type == "course" && courseId == $courseId',
          },
          {
            route: '/instructor/:prefecture/:slug',
            filter: '_type == "instructor" && slug.current == $slug',
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
                  href: doc?.slug ? `/blog/${doc.slug}` : '/blog',
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
                  href: doc?.slug ? `/${doc.slug}` : '/',
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
          aboutPage: {
            select: {
              title: 'title',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'カフェキネシについて',
                  href: '/#about-section',
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
                  href: doc?.slug ? `/albums/${doc.slug}` : '/albums',
                },
              ],
            }),
          },
          course: {
            select: {
              title: 'title',
              courseId: 'courseId',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled Course',
                  href: doc?.courseId ? `/school/${doc.courseId}` : '/school',
                },
              ],
            }),
          },
          instructor: {
            select: {
              name: 'name',
              slug: 'slug.current',
              region: 'region',
            },
            resolve: (doc) => {
              // 都道府県名からスラッグへのマッピング
              const prefectureToSlug: Record<string, string> = {
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

              const prefectureSlug = doc?.region ? prefectureToSlug[doc.region] || 'hokkaido' : 'hokkaido'

              return {
                locations: [
                  {
                    title: doc?.name || 'Untitled Instructor',
                    href: doc?.slug ? `/instructor/${prefectureSlug}/${doc.slug}` : '/instructor',
                  },
                ],
              }
            },
          },
          schoolPage: {
            select: {
              title: 'title',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'スクールページ',
                  href: '/school',
                },
              ],
            }),
          },
          instructorPage: {
            select: {
              title: 'title',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'インストラクターページ',
                  href: '/instructor',
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

  document: {
    // ドキュメントアクションを有効化（削除、複製など）
    actions: (prev, context) => {
      // Add update embedding action for knowledgeBase documents
      if (context.schemaType === 'knowledgeBase') {
        return [...prev, updateEmbeddingAction]
      }
      return prev
    },
  },


  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:3333',
      'http://localhost:3335',
      'http://localhost:5173',
      'http://localhost:8080',
      'http://localhost:8081',
      'http://localhost:8082',
      'https://cafekinesi-99dc5473.vercel.app',
      'https://cafekinesi-nextjs.vercel.app',
      'https://cafekinesi.sanity.studio',
      'https://*.vercel.app',
      // ネットワークエラー対策: 追加ドメイン
      'https://effectmoes-projects.vercel.app',
      'https://cafekinesi-nextjs-8c0jqpu8y-effectmoes-projects.vercel.app'
    ],
    credentials: true,
    // ネットワークエラー対策: より寛容な設定
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization']
  },

  // API設定
  api: {
    projectId: 'e4aqw590',
    dataset: 'production'
  },

  // Vite最適化設定（パフォーマンス向上）
  vite: (viteConfig: UserConfig): UserConfig => ({
    ...viteConfig,

    build: {
      target: 'es2018',
      sourcemap: false, // 本番環境では無効化
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'sanity-vendor': ['@sanity/ui', '@sanity/icons'],
          }
        }
      }
    },

    optimizeDeps: {
      include: ['react', 'react-dom', '@sanity/ui', '@sanity/icons'],
    },

    // styled-components speedy mode有効化
    define: {
      'process.env.SC_DISABLE_SPEEDY': JSON.stringify('false')
    }
  })
})