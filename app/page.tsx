import BlogCard from '@/components/BlogCard'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialLinks from '@/components/SocialLinks'
import FAQSection from '@/components/FAQSection'
import { sanityFetch, urlForImage } from '@/lib/sanity.fetch'
import { HOMEPAGE_QUERY, RECENT_POSTS_QUERY } from '@/lib/queries'
import { Homepage, Post } from '@/types/homepage.types'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

const FAQ_QUERY = `*[_type == "faq"] | order(order asc) {
  _id,
  question,
  answer,
  category
}`

async function getFAQs() {
  try {
    const draft = await draftMode()
    const isPreview = draft.isEnabled

    const data = await sanityFetch({
      query: FAQ_QUERY,
      preview: isPreview,
      tags: ['faq']
    })
    return data
  } catch (error) {
    console.error('Failed to fetch FAQs:', error)
    return []
  }
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const homepage = await sanityFetch<Homepage>({
      query: HOMEPAGE_QUERY,
      tags: ['homepage'],
    })

    return {
      title: homepage?.title || 'Cafe Kinesi - 心と身体を整える空間',
      description: 'アロマテラピーとキネシオロジーが融合した新しい体験',
    }
  } catch (error) {
    return {
      title: 'Cafe Kinesi - 心と身体を整える空間',
      description: 'アロマテラピーとキネシオロジーが融合した新しい体験',
    }
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function HomePage() {
  const draft = await draftMode()
  const isPreview = draft.isEnabled

  try {
    // Sanityからホームページデータ取得
    const homepage = await sanityFetch<Homepage>({
      query: HOMEPAGE_QUERY,
      preview: isPreview,
      tags: ['homepage'],
    })

    if (!homepage) {
      console.error('Homepage data not found')
      // フォールバック用の静的コンテンツを表示
      return (
        <div className="min-h-screen bg-white">
          <Header />
          <main className="relative">
            <div className="w-full max-w-screen-xl mx-auto px-6 py-12">
              <div className="text-center">
                <h1 className="text-2xl font-medium mb-4">Cafe Kinesi</h1>
                <p className="text-gray-600">ホームページ設定が見つかりません。Sanity Studioでデータを作成してください。</p>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      )
    }

    // ブログ記事取得
    const posts = await sanityFetch<Post[]>({
      query: RECENT_POSTS_QUERY,
      params: { limit: homepage.blogSection?.displayCount || 9 },
      preview: isPreview,
      tags: ['post'],
    })

    // FAQs取得
    const faqs = await getFAQs()

    // アクティブなソーシャルリンクのみフィルタリング
    const activeSocialLinks = homepage.socialLinks?.filter(link => link.isActive) || []

    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="relative">
          {/* カテゴリーカードグリッド - 既存のデザインを完全維持 */}
          <div className="w-full max-w-screen-xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {homepage.categoryCards?.map((card, index) => {
                // Sanityの画像を使用、ない場合はローカル画像にフォールバック
                const fallbackImageMap: { [key: string]: string } = {
                  'カフェキネシについて': '/images/about.webp',
                  'スクール': '/images/school.webp',
                  'インストラクター': '/images/instructor.webp',
                  'ブログ': '/images/blog.webp',
                  'アロマ': '/images/aroma.webp',
                  'メンバー': '/images/member.webp'
                }

                // Sanityの画像があれば使用、なければフォールバック
                const imageSrc = card.image
                  ? urlForImage(card.image)?.url() || fallbackImageMap[card.titleJa] || '/images/placeholder.svg'
                  : fallbackImageMap[card.titleJa] || '/images/placeholder.svg'

                return card.isActive ? (
                  <Link key={index} className="album-link" href={card.link}>
                    <div className={`album-card ${card.colorScheme} p-8 rounded-none aspect-square`}>
                      <div className="aspect-square relative mb-6 pointer-events-none">
                        <Image
                          alt={card.image?.alt || card.titleJa || ''}
                          src={imageSrc}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="space-y-1 pointer-events-none">
                        <h3 className="album-title">{card.titleJa || ''}</h3>
                        <p className="album-title opacity-80">{card.titleEn || ''}</p>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div key={index} className={`album-card ${card.colorScheme} p-8 rounded-none aspect-square`}>
                    <div className="aspect-square relative mb-6">
                      <Image
                        alt={card.image?.alt || card.titleJa || ''}
                        src={imageSrc}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="album-title">{card.titleJa || ''}</h3>
                      <p className="album-title opacity-80">{card.titleEn || ''}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* View Allボタン - 既存デザイン維持 */}
            {homepage.viewAllButton?.show && (
              <div className="flex justify-center mt-12">
                <button className="view-all-button">
                  {homepage.viewAllButton.text}
                </button>
              </div>
            )}
          </div>

          {/* ブログセクション - 既存のデザインを完全維持 */}
          <section className="w-full max-w-screen-xl mx-auto px-6 py-16">
            <div className="text-center mb-12">
              <h2 className="font-noto-serif text-sm font-medium text-[hsl(var(--text-primary))] tracking-[0.2em] uppercase mb-2">
                {homepage.blogSection?.sectionTitle || 'ブログ'}
              </h2>
              <div className="w-12 h-px bg-[hsl(var(--border))] mx-auto"></div>
            </div>

            {posts?.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {posts.map((post) => (
                    <BlogCard
                      key={post._id}
                      image={urlForImage(post.mainImage)?.url() || '/images/blog-1.webp'}
                      title={post.title}
                      excerpt={post.excerpt}
                      date={new Date(post.publishedAt).toLocaleDateString('ja-JP')}
                      author={post.author}
                      slug={post.slug}
                    />
                  ))}
                </div>

                {homepage.blogSection?.showAllButton && (
                  <div className="text-center mt-12">
                    <p className="text-sm text-[hsl(var(--text-secondary))] mb-4">
                      ※ 最新の{homepage.blogSection.displayCount}件を表示しています
                    </p>
                    <Link
                      href="/blog"
                      className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-[hsl(var(--text-primary))] border border-[hsl(var(--border))] rounded-full hover:bg-[hsl(var(--background-secondary))] transition-colors"
                    >
                      すべての記事を見る
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-[hsl(var(--text-secondary))]">
                  {homepage.blogSection?.noPostsMessage || '記事がまだありません'}
                </p>
              </div>
            )}
          </section>

          {/* FAQセクション */}
          <FAQSection faqs={faqs} />

          {/* ソーシャルリンク - 既存の右側固定デザインを維持 */}
          <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-10 hidden lg:block">
            <div className="flex flex-col gap-8">
              {activeSocialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  className="social-vertical hover:opacity-70 transition-opacity"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.displayText || link.platform}
                </a>
              ))}
            </div>
          </div>

          {/* モバイル用ソーシャルリンク - 既存デザイン維持 */}
          <div className="lg:hidden bg-gray-50 border-t border-gray-200">
            <div className="max-w-screen-2xl mx-auto px-6 py-4">
              <div className="flex justify-center gap-6 flex-wrap">
                {activeSocialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    className="text-xs font-medium tracking-wide uppercase text-gray-600 hover:opacity-70 transition-opacity"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.displayText || link.platform}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </main>
        <SocialLinks />
        <Footer />
      </div>
    )
  } catch (error) {
    console.error('Error loading homepage:', error)
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="relative">
          <div className="w-full max-w-screen-xl mx-auto px-6 py-12">
            <div className="text-center">
              <h1 className="text-2xl font-medium mb-4">Cafe Kinesi</h1>
              <p className="text-gray-600">データの読み込みに失敗しました。</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }
}