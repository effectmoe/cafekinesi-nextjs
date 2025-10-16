import { MetadataRoute } from 'next'
import { publicClient } from '@/lib/sanity.client'
import { groq } from 'next-sanity'

// siteConfigからrobots設定を取得
const ROBOTS_CONFIG_QUERY = groq`
  *[_type == "siteConfig"][0] {
    baseUrl,
    robotsRules
  }
`

// デフォルトのrobots設定（Sanityにデータがない場合のフォールバック）
const DEFAULT_ROBOTS_RULES: MetadataRoute.Robots['rules'] = [
  // General bots
  {
    userAgent: '*',
    allow: '/',
    disallow: ['/api/', '/admin/', '/_next/', '/private/'],
  },
  // OpenAI GPT Bot
  {
    userAgent: 'GPTBot',
    allow: '/',
    crawlDelay: 1,
  },
  // ChatGPT User Agent
  {
    userAgent: 'ChatGPT-User',
    allow: '/',
  },
  // Anthropic Claude
  {
    userAgent: 'Claude-Web',
    allow: '/',
    crawlDelay: 1,
  },
  {
    userAgent: 'ClaudeBot',
    allow: '/',
    crawlDelay: 1,
  },
  // Google Bard / Gemini
  {
    userAgent: 'Google-Extended',
    allow: '/',
  },
  // Bing AI
  {
    userAgent: 'Bingbot',
    allow: '/',
  },
  // Perplexity AI
  {
    userAgent: 'PerplexityBot',
    allow: '/',
    crawlDelay: 1,
  },
  // Meta AI
  {
    userAgent: 'FacebookBot',
    allow: '/',
  },
]

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://cafekinesi-nextjs.vercel.app').replace(/[\r\n]+/g, '')

  try {
    const siteConfig = await publicClient.fetch(ROBOTS_CONFIG_QUERY)

    // Sanityからrobots設定を取得できた場合
    if (siteConfig && siteConfig.robotsRules && siteConfig.robotsRules.length > 0) {
      // Sanityの設定をMetadataRoute.Robots形式に変換
      const rules = siteConfig.robotsRules.map((rule: any) => ({
        userAgent: rule.userAgent,
        allow: rule.allow || undefined,
        disallow: rule.disallow || undefined,
        crawlDelay: rule.crawlDelay || undefined,
      }))

      return {
        rules,
        sitemap: `${siteConfig.baseUrl || baseUrl}/sitemap.xml`,
        host: (siteConfig.baseUrl || baseUrl).replace(/^https?:\/\//, ''),
      }
    }

    // Sanityにデータがない場合はデフォルト設定を使用
    return {
      rules: DEFAULT_ROBOTS_RULES,
      sitemap: `${baseUrl}/sitemap.xml`,
      host: baseUrl.replace(/^https?:\/\//, ''),
    }
  } catch (error) {
    console.error('Error fetching robots config from Sanity:', error)

    // エラー時はデフォルト設定を使用
    return {
      rules: DEFAULT_ROBOTS_RULES,
      sitemap: `${baseUrl}/sitemap.xml`,
      host: baseUrl.replace(/^https?:\/\//, ''),
    }
  }
}
