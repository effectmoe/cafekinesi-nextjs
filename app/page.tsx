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
export const fetchCache = 'force-no-store'

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

                return card.isActive !== false ? (
                  <Link
                    key={index}
                    className="album-link"
                    href={card.titleJa === 'カフェキネシについて' ? '#about-section' : card.link}
                  >
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

          {/* About Section - カフェキネシについて */}
          <section id="about-section" className="w-full max-w-screen-xl mx-auto px-6 py-16">
            {/* Hero Section */}
            <div className="relative mb-16">
              <div className="aspect-[2/1] md:aspect-[3/1] overflow-hidden rounded-lg mb-8">
                <Image
                  src="/images/cafekinesi-hero.jpg"
                  alt="カフェキネシの世界へようこそ"
                  width={1200}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <h2 className="font-noto-serif text-3xl md:text-5xl font-medium text-[hsl(var(--text-primary))] mb-6">
                  カフェキネシのページにようこそ
                </h2>
                <p className="text-lg text-[hsl(var(--text-secondary))] leading-relaxed max-w-3xl mx-auto">
                  だれでもどこでも簡単にできるキネシオロジーとアロマを使った健康法
                </p>
              </div>
            </div>

            {/* Table of Contents */}
            <div className="mb-16 bg-[hsl(var(--brand-light-gray))] rounded-lg p-8">
              <h3 className="font-noto-serif text-2xl font-medium text-[hsl(var(--text-primary))] mb-6 text-center">
                目次
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {[
                  "1. カフェキネシとは",
                  "2. カフェキネシの歴史",
                  "3. カフェキネシの特長",
                  "4. カフェキネシの動画を見る",
                  "5. カフェキネシの夢",
                  "6. カフェキネシ講座を受講する",
                  "7. 公認インストラクターを探す",
                  "8. アロマを購入する"
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 hover:bg-white/50 rounded transition-colors cursor-pointer"
                  >
                    <span className="w-2 h-2 bg-[hsl(var(--brand-teal))] rounded-full flex-shrink-0"></span>
                    <span className="text-[hsl(var(--text-secondary))] text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 1: What is Cafe Kinesi */}
            <div className="mb-16" id="what-is-cafekinesi">
              <h3 className="font-noto-serif text-3xl font-medium text-[hsl(var(--text-primary))] mb-8 text-center">
                カフェキネシとは
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center mb-8">
                <div className="lg:col-span-2">
                  <Image
                    src="/images/cafekinesi-therapy-session.jpg"
                    alt="カフェキネシセラピー"
                    width={600}
                    height={450}
                    className="w-full aspect-[4/3] object-cover rounded-lg"
                  />
                </div>
                <div className="lg:col-span-3">
                  <div className="space-y-4 text-[hsl(var(--text-secondary))] leading-relaxed">
                    <p className="text-xl font-medium text-[hsl(var(--text-primary))]">
                      カフェキネシとは「カフェで出来るキネシオロジー」です。
                    </p>
                    <p className="text-lg">
                      だれでもどこでも簡単にできるキネシオロジーとアロマを使った健康法です。
                    </p>
                    <p>
                      誰でもどこでもその場でストレスが取れる、
                      <span className="font-noto-serif font-medium text-[hsl(var(--text-primary))]">キネシアロマ</span>
                      を使った世界最速のキネシセラピーです。
                    </p>
                    <p>
                      世界初、最高に便利で簡単なキネシオロジー。
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[hsl(var(--brand-beige))] to-white rounded-lg p-8 md:p-10">
                <div className="max-w-3xl mx-auto text-center space-y-4">
                  <p className="text-lg text-[hsl(var(--text-secondary))] leading-relaxed">
                    セラピストでなくても大丈夫。必要なのはあなたの愛とあなたの手。
                  </p>
                  <p className="text-[hsl(var(--text-secondary))] leading-relaxed">
                    カフェキネシはまだ発表されたばかりのセラピースタイルです。
                    わずか2時間でカフェキネシを使ってセラピーが出来るようになります。
                    またカフェキネシを教えることが出来るようになります。
                  </p>
                  <p className="text-lg font-medium text-[hsl(var(--text-primary))]">
                    セラピーをしながら世界へ「カフェキネシ」を伝えませんか？
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: History */}
            <div className="mb-16" id="history">
              <h3 className="font-noto-serif text-3xl font-medium text-[hsl(var(--text-primary))] mb-8 text-center">
                カフェキネシの歴史
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
                <div className="lg:col-span-3">
                  <div className="space-y-4 text-[hsl(var(--text-secondary))] leading-relaxed">
                    <p>
                      キネシオロジーというセラピーを
                      もっとフェア（公平）に簡単に楽しみながら出来るようにならないかな？
                    </p>
                    <p>
                      シンプルだけど、効果があるようなものを作れないかな？
                    </p>
                    <p>
                      そんな事を思って、<strong className="text-[hsl(var(--text-primary))]">2010年2月</strong>にカフェキネシの取り組みをはじめました。
                    </p>
                    <p>
                      使いやすさと、数々の臨床を重ねて発表になったのは2011年2月。
                    </p>
                    <p>
                      どこでも誰でもすぐにセラピストになれるカフェキネシオロジーとアロマの力で、
                      どんどん身近なストレスを取っていくことが出来ます。
                    </p>
                    <p className="text-lg font-medium text-[hsl(var(--text-primary))]">
                      ひとつのストレスの解決まで、約3分。
                    </p>
                    <p>
                      ストレスって毎日あるけど、毎日セラピー行けないものね。
                      友達とカフェでおしゃべりしながら、アロマの香りでストレス取りしましょ♪
                    </p>
                  </div>
                </div>
                <div className="lg:col-span-2">
                  <Image
                    src="/images/cafekinesi-littletree-sign.jpg"
                    alt="リトルトリー"
                    width={600}
                    height={450}
                    className="w-full aspect-[4/3] object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Features */}
            <div className="mb-16" id="features">
              <h3 className="font-noto-serif text-3xl font-medium text-[hsl(var(--text-primary))] mb-8 text-center">
                カフェキネシの特長
              </h3>
              <div className="space-y-6">
                <div className="bg-white border border-[hsl(var(--border))] rounded-lg p-6 md:p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-[hsl(var(--brand-teal))] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-noto-serif text-xl font-medium text-[hsl(var(--text-primary))] mb-3">
                        初心者でも２時間あればインストラクターになれる！
                      </h4>
                      <p className="text-[hsl(var(--text-secondary))] leading-relaxed">
                        初心者でも約２時間の講座をうけたらインストラクター登録可能です。
                        ２つのタイプから自分に合うインストラクター登録ができるので負担もかかりません！
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-[hsl(var(--border))] rounded-lg p-6 md:p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-[hsl(var(--brand-purple))] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-noto-serif text-xl font-medium text-[hsl(var(--text-primary))] mb-3">
                        潜在意識を呼び起こすアロマでストレスやトラウマを取り除く
                      </h4>
                      <p className="text-[hsl(var(--text-secondary))] leading-relaxed">
                        一つ一つ思いがこめられているアロマは自然の植物のエキスで作成されています。
                        あなたの潜在意識が目を覚まし、あなたがあなたらしく生きられるようにサポートします。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-[hsl(var(--border))] rounded-lg p-6 md:p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-[hsl(var(--brand-blue-gray))] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-noto-serif text-xl font-medium text-[hsl(var(--text-primary))] mb-3">
                        必要なのはたった３つ。手とアロマ、そしてあなたの愛
                      </h4>
                      <p className="text-[hsl(var(--text-secondary))] leading-relaxed">
                        カフェキネシでは、たくさんの物が必要というわけではありません。
                        手とアロマ、そしてあなたの愛があれば、苦しみや悲しみを吹き飛ばし、
                        夢や愛を広げるお手伝いができます。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-[hsl(var(--border))] rounded-lg p-6 md:p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-[hsl(var(--brand-beige))] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-[hsl(var(--text-primary))] font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-noto-serif text-xl font-medium text-[hsl(var(--text-primary))] mb-3">
                        どこでもできるので、お家でサロンができちゃいます。
                      </h4>
                      <p className="text-[hsl(var(--text-secondary))] leading-relaxed">
                        カフェキネシは現在５シリーズあり、すべて２時間程度でインストラクターになれます。
                        公認インストラクターになると、アドバンス版の講座も開催できるようになります。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-[hsl(var(--border))] rounded-lg p-6 md:p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-[hsl(180_25%_35%)] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold">5</span>
                    </div>
                    <div>
                      <h4 className="font-noto-serif text-xl font-medium text-[hsl(var(--text-primary))] mb-3">
                        世界中にインストラクターがいるので、近くで学べます。
                      </h4>
                      <p className="text-[hsl(var(--text-secondary))] leading-relaxed">
                        日本国内はもちろん、アメリカ、ヨーロッパ、アジアなど世界中にインストラクターがいますので、
                        お近くのインストラクターを探すことができます。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-[hsl(var(--border))] rounded-lg p-6 md:p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-[hsl(260_20%_65%)] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold">6</span>
                    </div>
                    <div>
                      <h4 className="font-noto-serif text-xl font-medium text-[hsl(var(--text-primary))] mb-3">
                        国境を越えたセラピー。世界中で通じるセラピーが学べます。
                      </h4>
                      <p className="text-[hsl(var(--text-secondary))] leading-relaxed">
                        人種、文化、環境、言葉に関係なく、効果のあるセラピーです。
                        目の前の方々の心を少しでも軽くするお手伝いができます。
                        世の中のみなさんが平和と愛であふれた日々を過ごせますように。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Video */}
            <div className="mb-16" id="video">
              <h3 className="font-noto-serif text-3xl font-medium text-[hsl(var(--text-primary))] mb-8 text-center">
                カフェキネシの動画を見る
              </h3>
              <div className="bg-gradient-to-r from-[hsl(var(--brand-light-gray))] to-white rounded-lg p-8 md:p-12">
                <div className="max-w-3xl mx-auto text-center space-y-6">
                  <Image
                    src="/images/cafekinesi-cafe-scene.jpg"
                    alt="カフェキネシの動画"
                    width={900}
                    height={506}
                    className="w-full aspect-video object-cover rounded-lg mb-6"
                  />
                  <p className="text-[hsl(var(--text-secondary))] leading-relaxed">
                    カフェキネシの実演をご覧いただけます。
                  </p>
                  <button className="view-all-button">
                    YouTube チャンネルを見る →
                  </button>
                </div>
              </div>
            </div>

            {/* Section 5: Dream */}
            <div className="mb-16" id="dream">
              <h3 className="font-noto-serif text-3xl font-medium text-[hsl(var(--text-primary))] mb-8 text-center">
                カフェキネシの夢
              </h3>
              <div className="bg-gradient-to-br from-[hsl(var(--brand-beige))] via-[hsl(var(--brand-light-gray))] to-[hsl(var(--brand-purple))] rounded-lg p-8 md:p-12">
                <div className="max-w-4xl mx-auto space-y-6 text-[hsl(var(--text-primary))] leading-relaxed">
                  <p className="text-xl font-medium text-center">
                    カフェキネシの夢は世界ノーベル平和賞受賞です
                  </p>
                  <p className="text-center">
                    世界一シンプルなキネシオロジーを使ってより多くの人の苦しみと悲しみを吹き飛ばし、
                    大きな夢をかなえて幸せになるお手伝いをしていくことです。
                  </p>
                  <p>
                    今までカフェで悩みや愚痴をこぼして過ごした時間がカフェキネシで夢と喜びを
                    分かち合う時間に変わっていきます。
                  </p>
                  <p>
                    そしてカフェで語り合う目の前の人から平和と喜びが広がり、
                    戦争や天災で苦しむ方々の心を少しでも軽くしてあげる事が出来るようになります。
                  </p>
                  <p className="text-lg font-medium text-center">
                    どのカフェでもカフェキネシをしている姿が見える、そんな世の中になった時
                    自然と平和が地球に広がっていく事でしょう・・・
                  </p>
                </div>
              </div>
            </div>

            {/* Section 6: Take Course */}
            <div className="mb-16" id="course">
              <h3 className="font-noto-serif text-3xl font-medium text-[hsl(var(--text-primary))] mb-8 text-center">
                カフェキネシ講座を受講する
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <Image
                    src="/images/cafekinesi-instructor.jpg"
                    alt="カフェキネシ講座"
                    width={600}
                    height={450}
                    className="w-full aspect-[4/3] object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-4">
                  <p className="text-[hsl(var(--text-secondary))] leading-relaxed">
                    カフェキネシの講座はお近くにお住まいのインストラクターから受講できます。
                  </p>
                  <p className="text-[hsl(var(--text-secondary))] leading-relaxed">
                    カフェキネシシリーズのどれでも受講された方のことを「カフェキネシラバーズ」と呼んでいます。
                  </p>
                  <p className="text-[hsl(var(--text-secondary))] leading-relaxed">
                    ２時間半の講座を受講し、インストラクター登録をすると、ご自身で講座を開くこともできます。
                  </p>
                  <div className="pt-4">
                    <Link href="/school">
                      <button className="view-all-button w-full md:w-auto">
                        講座一覧を見る →
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 7: Find Instructor */}
            <div className="mb-16" id="instructor">
              <h3 className="font-noto-serif text-3xl font-medium text-[hsl(var(--text-primary))] mb-8 text-center">
                公認インストラクターを探す
              </h3>
              <div className="bg-[hsl(var(--brand-light-gray))] rounded-lg p-8 md:p-12 text-center">
                <p className="text-[hsl(var(--text-secondary))] leading-relaxed mb-6">
                  お近くの地域のインストラクターをご紹介します。
                </p>
                <p className="text-[hsl(var(--text-secondary))] leading-relaxed mb-8">
                  カフェキネシ、ピーチタッチ、チャクラキネシ、キネシオロジースタンダード、
                  ナビゲーションセミナーを教えているキネシオロジーインストラクターの一覧です。
                </p>
                <button className="view-all-button">
                  インストラクター一覧を見る →
                </button>
              </div>
            </div>

            {/* Section 8: Buy Aroma */}
            <div className="mb-16" id="aroma">
              <h3 className="font-noto-serif text-3xl font-medium text-[hsl(var(--text-primary))] mb-8 text-center">
                アロマを購入する
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <p className="text-[hsl(var(--text-secondary))] leading-relaxed">
                    カフェキネシに使うアロマを購入したいかたはこちらからどうぞ。
                  </p>
                  <p className="text-[hsl(var(--text-secondary))] leading-relaxed">
                    リトルトリーストアでは、あなたの心と身体のバランスを整え、
                    幸せにしてくれるアロマやハーブティーを取り揃えています。
                  </p>
                  <div className="pt-4">
                    <button className="view-all-button w-full md:w-auto">
                      オンラインストアへ →
                    </button>
                  </div>
                </div>
                <div>
                  <Image
                    src="/images/cafekinesi-aroma-bottles.jpg"
                    alt="アロマボトル"
                    width={600}
                    height={600}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center bg-gradient-to-r from-[hsl(var(--brand-beige))] via-white to-[hsl(var(--brand-light-gray))] rounded-lg p-8 md:p-12">
              <h3 className="font-noto-serif text-2xl font-medium text-[hsl(var(--text-primary))] mb-4">
                カフェキネシの世界へようこそ
              </h3>
              <p className="text-[hsl(var(--text-secondary))] mb-6 leading-relaxed max-w-2xl mx-auto">
                誰でもどこでも簡単にできるキネシオロジーとアロマを使った健康法で、
                心と身体を整える新しいセラピーを体験してみませんか？
              </p>
              <Link href="/school">
                <button className="view-all-button">
                  講座を見る →
                </button>
              </Link>
            </div>
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