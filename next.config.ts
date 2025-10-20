import type { NextConfig } from "next";
import withPWA from '@ducanh2912/next-pwa';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // パフォーマンス最適化
  compress: true,
  poweredByHeader: false,
  // 実験的機能（パフォーマンス向上）
  experimental: {
    optimizePackageImports: ['@sanity/client', '@sanity/image-url', '@portabletext/react'],
    webVitalsAttribution: ['CLS', 'LCP', 'FCP', 'FID', 'TTFB', 'INP'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.sanity.io https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://staticxx.facebook.com https://www.instagram.com https://*.cdninstagram.com https://www.youtube.com",
              "style-src 'self' 'unsafe-inline' https://www.facebook.com",
              "img-src 'self' data: blob: https://cdn.sanity.io https://www.google-analytics.com https://scontent.cdninstagram.com https://*.cdninstagram.com https://*.fbcdn.net https://i.ytimg.com https://external.cdninstagram.com",
              "font-src 'self' data:",
              "connect-src 'self' https://cdn.sanity.io https://*.sanity.io https://www.google-analytics.com https://*.algolia.net https://*.algolianet.com https://www.instagram.com https://*.instagram.com https://www.facebook.com https://*.facebook.com https://graph.instagram.com",
              "media-src 'self' https://cdn.sanity.io https://*.cdninstagram.com",
              "frame-src 'self' https://www.facebook.com https://*.facebook.com https://www.instagram.com https://www.youtube.com https://www.youtube-nocookie.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
              "upgrade-insecure-requests"
            ].join('; ')
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  webpack: (config, { isServer }) => {
    // pdf-parseはサーバーサイド（Node.js）でのみ使用
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'pdf-parse': 'commonjs pdf-parse',
        'pdfjs-dist': 'commonjs pdfjs-dist',
      });
    }
    return config;
  },
};

// PWA設定でラップ
export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  // オフラインフォールバック
  fallbacks: {
    document: '/offline',
  },
  // キャッシュ戦略
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/cdn\.sanity\.io\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'sanity-images',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /^https:\/\/.*\.sanity\.io\/.*$/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'sanity-data',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\.(?:jpg|jpeg|png|gif|webp|svg)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-images',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      urlPattern: /\.(?:js|css)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
  ],
})(nextConfig);
