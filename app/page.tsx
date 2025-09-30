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
                  src="/images/hidden-content-hero.webp"
                  alt="カフェキネシの空間"
                  width={1200}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <h2 className="font-noto-serif text-3xl md:text-4xl font-medium text-[hsl(var(--text-primary))] mb-6">
                  カフェキネシについて
                </h2>
                <p className="text-lg text-[hsl(var(--text-secondary))] leading-relaxed max-w-3xl mx-auto">
                  心と身体を整えるキネシオロジーとアロマを使った健康法です。
                  <br className="hidden md:block" />
                  誰でもどこでも簡単にできる、新しいセラピーの世界へお越しください。
                </p>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="mb-16 bg-white border border-[hsl(var(--border))] rounded-lg p-8">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium text-[hsl(var(--text-primary))]">目次</span>
                <span className="text-sm text-[hsl(var(--text-secondary))]">非表示</span>
              </div>
              <div className="space-y-2">
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
                  <div key={index} className="text-[hsl(var(--text-secondary))] text-sm hover:text-[hsl(var(--text-primary))] transition-colors cursor-pointer py-1">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* About Section with Image */}
            <div className="mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
                <div className="lg:col-span-2">
                  <Image
                    src="/images/kinesi-therapy.webp"
                    alt="キネシオロジーセラピー"
                    width={600}
                    height={450}
                    className="w-full aspect-[4/3] object-cover rounded-lg"
                  />
                </div>
                <div className="lg:col-span-3">
                  <h2 className="font-noto-serif text-2xl font-medium text-[hsl(var(--text-primary))] mb-6">
                    カフェキネシとは
                  </h2>
                  <div className="space-y-4 text-[hsl(var(--text-secondary))] leading-relaxed">
                    <p>
                      カフェキネシとは「カフェで出来るキネシオロジー」です。<br />
                      だれでもどこでも簡単にできるキネシオロジーとアロマを使った健康法です。
                    </p>
                    <p>
                      誰でもどこでもその場でストレスが取れる、<br />
                      <span className="font-medium text-[hsl(var(--text-primary))]">キネシアロマ</span>を使った世界最速のキネシセラピーです。
                    </p>
                    <p>
                      世界初、最高に便利で簡単なキネシオロジー。
                    </p>
                    <p>
                      キネシオロジーって何だろうと思われる方はこちらをご覧ください。
                    </p>
                    <p>
                      セラピストでなくても大丈夫。必要なのはあなたの愛とあなたの手。
                    </p>
                    <p>
                      カフェキネシはまだ発表されたばかりのセラピースタイルです。
                    </p>
                    <p>
                      わずか2時間でカフェキネシを使ってセラピーが出来るようになります。<br />
                      またカフェキネシを教えることが出来るようになります。
                    </p>
                    <p>
                      セラピーをしながら世界へ「カフェキネシ」を伝えませんか？
                    </p>
                  </div>
                </div>
              </div>
            </div>


            {/* History Section */}
            <div className="mb-16">
              <h2 className="font-noto-serif text-2xl font-medium text-[hsl(var(--text-primary))] mb-8">
                カフェキネシの歴史
              </h2>
              <div className="space-y-4 text-[hsl(var(--text-secondary))] leading-relaxed">
                <p>
                  キネシオロジーというセラピーを<br />
                  もっとフェア（公平）に簡単に身近から出来るようにならないか？<br />
                  シンプルだけど、効果的なものを作れないかな？
                </p>
                <p>
                  そんな事を思って、2010年2月にカフェキネシの取り組みをはじめました。
                </p>
                <p>
                  使いやすさと、数々の臨床を重ねて完成になったのは2011年2月。
                </p>
                <p>
                  どこでも誰でもすぐにセラピストになれるカフェキネシオロジーとアロマの力で、<br />
                  どんどん身近なストレスを取っていくことが出来ます。
                </p>
                <p>
                  ひとつのストレスの解決まで、約3分。
                </p>
                <p>
                  ストレスって毎日あるけど、毎日セラピー行けないもんね。<br />
                  友達とカフェでおしゃべりしながら、アロマの香りでストレス取りしましょ♪
                </p>
              </div>
            </div>

            {/* Features Section */}
            <div className="mb-16">
              <h2 className="font-noto-serif text-2xl font-medium text-[hsl(var(--text-primary))] mb-8">
                カフェキネシの特長
              </h2>
              <div className="space-y-6">
                <div className="space-y-4 text-[hsl(var(--text-secondary))] leading-relaxed">
                  <div>
                    <h3 className="font-medium text-[hsl(var(--text-primary))] mb-2">
                      1. <span className="text-orange-500">初心者でも2時間弱あればインストラクターになれる！</span>
                    </h3>
                    <p>
                      初心者でも約2時間の講座をうけたらインストラクター登録可能です。<br />
                      2つのタイプから自分に合うインストラクター登録ができるので負担もかかりません！
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-[hsl(var(--text-primary))] mb-2">
                      2. <span className="text-orange-500">適正量調を呼び起こすアロマでストレスやトラウマを取り除く</span>
                    </h3>
                    <p>
                      一つ一つ思いがこめられているアロマは自然の植物のエキスで作成されています。<br />
                      あなたの適正量をあなたの香りであなたしく生きられるようにサポートします。
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-[hsl(var(--text-primary))] mb-2">
                      3. <span className="text-orange-500">必要なのはたった3つ、手とアロマ、そしてあなたの愛</span>
                    </h3>
                    <p>
                      カフェキネシでは、たくさんの物が必要というわけではありません。<br />
                      手とアロマ、そしてあなたの愛があれば、苦しみや悲しみを吹き飛ばし、<br />
                      夢や愛を広げるお手伝いができます。
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-[hsl(var(--text-primary))] mb-2">
                      4. <span className="text-orange-500">どこでもできるので、お家でサロンができちゃいます。</span>
                    </h3>
                    <p>
                      カフェキネシは複雑なシリーズあり、すべて2時間程度でインストラクターになれます。<br />
                      公認インストラクターになると、アドバンス版の講座も開催できるようになります。
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-[hsl(var(--text-primary))] mb-2">
                      5. <span className="text-orange-500">世界中にインストラクターがいます。</span>
                    </h3>
                    <p>
                      日本国内はもちろん、アメリカ、ヨーロッパ、アジアなど世界中にインストラクターがいます<br />
                      ので、お近くのインストラクターを探すことができます。
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-[hsl(var(--text-primary))] mb-2">
                      6. <span className="text-orange-500">国境を越えたセラピー、世界中で通じるセラピーが学べます。</span>
                    </h3>
                    <p>
                      人種、文化、環境、言葉に関係なく、効果のあるセラピーです。<br />
                      目の前の方々の心を少しでも軽くするお手伝いができます。<br />
                      世の中のみなさんが平和と愛であふれた日々を過ごせますように。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dream Section */}
            <div className="mb-16">
              <h2 className="font-noto-serif text-2xl font-medium text-[hsl(var(--text-primary))] mb-8 text-center">
                カフェキネシの夢
              </h2>
              <div className="text-center space-y-6 text-[hsl(var(--text-secondary))] leading-relaxed max-w-4xl mx-auto">
                <p className="text-xl font-medium text-[hsl(var(--text-primary))]">
                  カフェキネシの夢は世界ノーベル平和賞受賞です。
                </p>
                <p className="text-lg">
                  世界一シンプルなキネシオロジーを使って1秒多くの人の苦しみと悲しみを取き去れし、<br />
                  大きな夢を叶えて幸せになるお手伝いをしていく事です。<br />
                  そして、カフェで飲みや会話をこえして過ごした時間が<br />
                  カフェキネシで繋と喜びを分からうち時間にかわっていきます。<br />
                  そして、カフェで過ぎち３日後の人から幸せと喜びの広がり<br />
                  嘲争や天災やあらゆの心を少してもなをしくあたる事ができるようになります。<br />
                  どのカフェでもカフェキネシをしている姿が見える、そんな世界中になった時<br />
                  自然と平和が地球中に広がっていく事でしょう・・・
                </p>
              </div>
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