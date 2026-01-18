import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'
import { client } from '@/lib/sanity.client'
import { REGISTRATION_PAGE_QUERY } from '@/lib/queries'
import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'

// ISR設定: 1時間ごとに再生成
export const revalidate = 3600

// 型定義
interface RegistrationSection {
  id?: string
  title: string
  content?: PortableTextBlock[]
  button?: {
    show: boolean
    text?: string
    url?: string
    isExternal?: boolean
    bgColor?: 'dark' | 'primary' | 'secondary' | 'accent' | 'custom'
    customBgColor?: string
    textColor?: 'white' | 'black' | 'custom'
    customTextColor?: string
  }
}

// ボタンの背景色を取得するヘルパー関数
function getButtonBgColor(bgColor?: string, customBgColor?: string): string {
  switch (bgColor) {
    case 'primary':
      return '#22c55e' // 緑
    case 'secondary':
      return '#3b82f6' // 青
    case 'accent':
      return '#f97316' // オレンジ
    case 'custom':
      return customBgColor || 'hsl(var(--text-primary))'
    case 'dark':
    default:
      return 'hsl(var(--text-primary))' // ダークグレー（デフォルト）
  }
}

// ボタンのテキスト色を取得するヘルパー関数
function getButtonTextColor(textColor?: string, customTextColor?: string): string {
  switch (textColor) {
    case 'black':
      return '#1f2937'
    case 'custom':
      return customTextColor || '#ffffff'
    case 'white':
    default:
      return '#ffffff'
  }
}

interface RegistrationPageData {
  _id: string
  title: string
  titleEn?: string
  showTableOfContents?: boolean
  sections?: RegistrationSection[]
  seo?: {
    title?: string
    description?: string
    keywords?: string
  }
  isActive: boolean
}

// メタデータを動的に生成
export async function generateMetadata(): Promise<Metadata> {
  const data = await client.fetch<RegistrationPageData>(REGISTRATION_PAGE_QUERY)

  if (!data) {
    return {
      title: 'カフェキネシ登録のご案内 | Cafe Kinesi',
      description: 'カフェキネシオロジーへの会員登録方法のご案内です。',
    }
  }

  return {
    title: data.seo?.title || 'カフェキネシ登録のご案内 | Cafe Kinesi',
    description: data.seo?.description || 'カフェキネシオロジーへの会員登録方法のご案内です。',
    keywords: data.seo?.keywords || 'カフェキネシ, 登録, 会員, キネシオロジー',
  }
}

// PortableText用のカスタムコンポーネント
const portableTextComponents = {
  marks: {
    link: ({ children, value }: { children: React.ReactNode; value?: { href?: string; isExternal?: boolean } }) => {
      const href = value?.href || '#'
      const isExternal = value?.isExternal

      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[hsl(var(--text-primary))] underline hover:opacity-70 transition-opacity"
          >
            {children}
          </a>
        )
      }

      return (
        <Link href={href} className="text-[hsl(var(--text-primary))] underline hover:opacity-70 transition-opacity">
          {children}
        </Link>
      )
    },
    strong: ({ children }: { children: React.ReactNode }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }: { children: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
  },
  block: {
    normal: ({ children }: { children: React.ReactNode }) => (
      <p className="text-[hsl(var(--text-secondary))] leading-relaxed mb-4">{children}</p>
    ),
  },
}

export default async function RegistrationPage() {
  const data = await client.fetch<RegistrationPageData>(REGISTRATION_PAGE_QUERY)

  // Sanityにデータがない場合はフォールバック表示
  if (!data) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="relative">
          <section className="w-full bg-gradient-to-b from-[#f8f6f3] to-white py-16 md:py-24">
            <div className="max-w-screen-xl mx-auto px-6 text-center">
              <h1 className="font-noto-serif text-3xl md:text-4xl font-medium text-[hsl(var(--text-primary))] mb-4">
                カフェキネシ登録のご案内
              </h1>
              <p className="text-sm tracking-[0.2em] text-[hsl(var(--text-secondary))] uppercase">
                REGISTRATION
              </p>
            </div>
          </section>
          <section className="w-full max-w-screen-md mx-auto px-6 py-16 text-center">
            <p className="text-[hsl(var(--text-secondary))]">
              コンテンツを準備中です。
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-[hsl(var(--text-primary))] hover:opacity-70 transition-opacity mt-8"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              トップページに戻る
            </Link>
          </section>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="relative">
        {/* ヒーローセクション */}
        <section className="w-full bg-gradient-to-b from-[#f8f6f3] to-white py-16 md:py-24">
          <div className="max-w-screen-xl mx-auto px-6 text-center">
            <h1 className="font-noto-serif text-3xl md:text-4xl font-medium text-[hsl(var(--text-primary))] mb-4">
              {data.title}
            </h1>
            {data.titleEn && (
              <p className="text-sm tracking-[0.2em] text-[hsl(var(--text-secondary))] uppercase">
                {data.titleEn}
              </p>
            )}
          </div>
        </section>

        {/* メインコンテンツ */}
        <section className="w-full max-w-screen-md mx-auto px-6 py-16">
          {/* 目次 */}
          {data.showTableOfContents && data.sections && data.sections.length > 0 && (
            <nav className="mb-12 p-6 bg-[#f8f6f3] rounded-lg">
              <h2 className="text-lg font-medium text-[hsl(var(--text-primary))] mb-4">目次</h2>
              <ul className="space-y-2">
                {data.sections.map((section, index) => (
                  <li key={section.id || index}>
                    <a
                      href={`#${section.id || `section-${index}`}`}
                      className="text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] transition-colors"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* セクション */}
          {data.sections && data.sections.map((section, index) => (
            <div
              key={section.id || index}
              id={section.id || `section-${index}`}
              className="mb-12 scroll-mt-24"
            >
              <h2 className="text-xl font-medium text-[hsl(var(--text-primary))] mb-6">
                {section.title}
              </h2>

              {section.content && (
                <div className="prose prose-gray max-w-none">
                  <PortableText
                    value={section.content}
                    components={portableTextComponents}
                  />
                </div>
              )}

              {section.button?.show && section.button.url && (
                <div className="mt-6">
                  {section.button.isExternal ? (
                    <a
                      href={section.button.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-full hover:opacity-90 transition-opacity text-lg font-medium"
                      style={{
                        backgroundColor: getButtonBgColor(section.button.bgColor, section.button.customBgColor),
                        color: getButtonTextColor(section.button.textColor, section.button.customTextColor)
                      }}
                    >
                      {section.button.text || 'リンクを開く'}
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  ) : (
                    <Link
                      href={section.button.url}
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-full hover:opacity-90 transition-opacity text-lg font-medium"
                      style={{
                        backgroundColor: getButtonBgColor(section.button.bgColor, section.button.customBgColor),
                        color: getButtonTextColor(section.button.textColor, section.button.customTextColor)
                      }}
                    >
                      {section.button.text || 'リンクを開く'}
                    </Link>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* 区切り線 */}
          <div className="w-16 h-px bg-[hsl(var(--border))] mx-auto mb-12"></div>

          {/* お問い合わせ */}
          <div className="text-center">
            <p className="text-[hsl(var(--text-secondary))] mb-4">
              ご不明な点がございましたら、お気軽にお問い合わせください。
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-[hsl(var(--text-primary))] hover:opacity-70 transition-opacity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              トップページに戻る
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
