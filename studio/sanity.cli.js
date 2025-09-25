import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'e4aqw590',
    dataset: 'production'
  },
  deployment: {
    appId: 't93oer6ecn1jvet1zpemf6y4',
  },
  // Vite設定による最適化
  vite: (viteConfig) => ({
    ...viteConfig,

    build: {
      ...viteConfig.build,
      target: 'es2018',
      sourcemap: false, // 本番環境では無効化
      minify: true,
      rollupOptions: {
        ...viteConfig.build?.rollupOptions,
        output: {
          ...viteConfig.build?.rollupOptions?.output,
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