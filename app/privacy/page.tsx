import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialLinks from '@/components/SocialLinks'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'プライバシーポリシー | Cafe Kinesi',
  description: 'Cafe Kinesi（カフェキネシオロジー）のプライバシーポリシーページです。個人情報の取り扱いについてご説明します。',
  openGraph: {
    title: 'プライバシーポリシー | Cafe Kinesi',
    description: 'Cafe Kinesiの個人情報保護方針について',
    type: 'website',
    url: 'https://cafekinesi.com/privacy',
  },
  alternates: {
    canonical: 'https://cafekinesi.com/privacy',
  },
}

// ISR設定（1日ごとに再生成）
export const revalidate = 86400

export default function PrivacyPage() {
  // Schema.org: BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'ホーム',
        item: 'https://cafekinesi.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'プライバシーポリシー',
        item: 'https://cafekinesi.com/privacy',
      },
    ],
  }

  return (
    <>
      {/* 構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="relative">
          {/* ヒーローセクション */}
          <section className="bg-gradient-to-br from-[#8B5A3C]/10 via-orange-50 to-white py-16 md:py-24">
            <div className="max-w-screen-xl mx-auto px-6">
              <nav aria-label="パンくずリスト" className="mb-6">
                <ol className="flex items-center gap-2 text-sm text-gray-600" itemScope itemType="https://schema.org/BreadcrumbList">
                  <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    <Link href="/" className="hover:text-[#8B5A3C] transition-colors" itemProp="item">
                      <span itemProp="name">ホーム</span>
                    </Link>
                    <meta itemProp="position" content="1" />
                  </li>
                  <li className="text-gray-400">/</li>
                  <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    <span className="text-gray-900 font-medium" itemProp="name">プライバシーポリシー</span>
                    <meta itemProp="position" content="2" />
                  </li>
                </ol>
              </nav>

              <h1 className="font-noto-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                プライバシーポリシー
              </h1>

              <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
                Cafe Kinesi（カフェキネシオロジー）は、お客様の個人情報保護を重要な責務と考え、以下の方針に基づき適切に取り扱います。
              </p>
            </div>
          </section>

          {/* プライバシーポリシー本文 */}
          <section className="max-w-4xl mx-auto px-6 py-16">
            <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 space-y-10">

              {/* 1. 事業者情報 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#8B5A3C]">
                  1. 事業者情報
                </h2>
                <div className="text-gray-700 leading-relaxed space-y-2">
                  <p><strong>事業者名：</strong>Cafe Kinesi（カフェキネシオロジー）</p>
                  <p><strong>運営責任者：</strong>岡崎 倫江</p>
                  <p><strong>お問い合わせ：</strong><Link href="/#chat" className="text-[#8B5A3C] hover:underline">AIチャット</Link>よりお問い合わせください</p>
                </div>
              </div>

              {/* 2. 個人情報の取得 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#8B5A3C]">
                  2. 個人情報の取得
                </h2>
                <div className="text-gray-700 leading-relaxed space-y-3">
                  <p>当サイトでは、以下の場合に個人情報を取得することがあります。</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>講座のお申し込み時</li>
                    <li>お問い合わせフォームからのご連絡時</li>
                    <li>メールマガジンの購読登録時</li>
                    <li>イベント参加のお申し込み時</li>
                    <li>その他、当サイトが提供するサービスのご利用時</li>
                  </ul>
                  <p className="mt-3">
                    取得する個人情報は、お名前、メールアドレス、電話番号、住所などです。
                  </p>
                </div>
              </div>

              {/* 3. 個人情報の利用目的 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#8B5A3C]">
                  3. 個人情報の利用目的
                </h2>
                <div className="text-gray-700 leading-relaxed space-y-3">
                  <p>取得した個人情報は、以下の目的で利用いたします。</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>講座・イベントのご案内、お申し込み対応</li>
                    <li>お問い合わせへの回答</li>
                    <li>メールマガジンの配信</li>
                    <li>サービス向上のための統計データ作成</li>
                    <li>キャンペーン・新サービスのご案内</li>
                    <li>本人確認および決済処理</li>
                  </ul>
                </div>
              </div>

              {/* 4. 個人情報の第三者提供 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#8B5A3C]">
                  4. 個人情報の第三者提供
                </h2>
                <div className="text-gray-700 leading-relaxed space-y-3">
                  <p>
                    当サイトは、お客様の個人情報を、以下の場合を除き第三者に提供することはありません。
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>お客様の同意がある場合</li>
                    <li>法令に基づく場合</li>
                    <li>人の生命、身体または財産の保護のために必要がある場合</li>
                    <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合</li>
                  </ul>
                </div>
              </div>

              {/* 5. Cookieの使用について */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#8B5A3C]">
                  5. Cookieの使用について
                </h2>
                <div className="text-gray-700 leading-relaxed space-y-3">
                  <p>
                    当サイトでは、サービスの利便性向上やサイト改善のため、Cookieを使用しています。
                    Cookieとは、ウェブサイトがお客様のコンピュータに一時的にデータを保存する仕組みです。
                  </p>
                  <p>
                    Cookieは、ブラウザの設定により無効化することが可能ですが、
                    一部のサービスが正常に機能しない場合があります。
                  </p>
                </div>
              </div>

              {/* 6. アクセス解析ツールについて */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#8B5A3C]">
                  6. アクセス解析ツールについて
                </h2>
                <div className="text-gray-700 leading-relaxed space-y-3">
                  <p>
                    当サイトでは、Google Analyticsを使用してアクセス解析を行っています。
                    Google Analyticsは、Cookieを使用して訪問者の情報を収集します。
                  </p>
                  <p>
                    収集される情報は匿名で収集されており、個人を特定するものではありません。
                    この機能はCookieを無効にすることで収集を拒否することができます。
                  </p>
                  <p>
                    詳しくは<a href="https://policies.google.com/technologies/partner-sites?hl=ja" target="_blank" rel="noopener noreferrer" className="text-[#8B5A3C] hover:underline">Googleのプライバシーポリシー</a>をご確認ください。
                  </p>
                </div>
              </div>

              {/* 7. 個人情報の安全管理 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#8B5A3C]">
                  7. 個人情報の安全管理
                </h2>
                <div className="text-gray-700 leading-relaxed space-y-3">
                  <p>
                    当サイトは、個人情報の紛失、破壊、改ざん、漏洩などのリスクに対して、
                    適切な安全管理措置を講じています。
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>SSL/TLS暗号化通信の使用</li>
                    <li>アクセス制限の実施</li>
                    <li>セキュリティソフトウェアの導入</li>
                    <li>定期的なバックアップの実施</li>
                  </ul>
                </div>
              </div>

              {/* 8. 個人情報の開示・訂正・削除 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#8B5A3C]">
                  8. 個人情報の開示・訂正・削除
                </h2>
                <div className="text-gray-700 leading-relaxed space-y-3">
                  <p>
                    お客様ご本人から、個人情報の開示、訂正、削除等のご請求があった場合は、
                    本人確認を行った上で、合理的な期間内に対応いたします。
                  </p>
                  <p>
                    ご請求は、<Link href="/#chat" className="text-[#8B5A3C] hover:underline">AIチャット</Link>よりお問い合わせください。
                  </p>
                </div>
              </div>

              {/* 9. 外部サービスの利用 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#8B5A3C]">
                  9. 外部サービスの利用
                </h2>
                <div className="text-gray-700 leading-relaxed space-y-3">
                  <p>当サイトでは、以下の外部サービスを利用しています。</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Google Analytics（アクセス解析）</li>
                    <li>Vercel（ホスティング）</li>
                    <li>Sanity CMS（コンテンツ管理）</li>
                  </ul>
                  <p>
                    これらのサービスにおける個人情報の取り扱いについては、
                    各サービス提供者のプライバシーポリシーをご確認ください。
                  </p>
                </div>
              </div>

              {/* 10. プライバシーポリシーの変更 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#8B5A3C]">
                  10. プライバシーポリシーの変更
                </h2>
                <div className="text-gray-700 leading-relaxed space-y-3">
                  <p>
                    当サイトは、法令の変更や事業内容の変更等により、
                    本プライバシーポリシーを予告なく変更することがあります。
                  </p>
                  <p>
                    変更後のプライバシーポリシーは、本ページに掲載した時点から効力を生じるものとします。
                  </p>
                </div>
              </div>

              {/* 11. お問い合わせ */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#8B5A3C]">
                  11. お問い合わせ
                </h2>
                <div className="text-gray-700 leading-relaxed space-y-3">
                  <p>
                    本プライバシーポリシーに関するお問い合わせは、
                    <Link href="/#chat" className="text-[#8B5A3C] hover:underline">AIチャット</Link>よりお願いいたします。
                  </p>
                </div>
              </div>

              {/* 制定日・改定日 */}
              <div className="pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-600">制定日：2025年1月1日</p>
                <p className="text-sm text-gray-600">最終改定日：2025年10月18日</p>
              </div>
            </div>
          </section>

          {/* CTAセクション */}
          <section className="bg-[#8B5A3C] text-white py-16">
            <div className="max-w-screen-xl mx-auto px-6 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                ご不明な点はございますか？
              </h2>
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
                プライバシーポリシーに関するご質問や、個人情報の取り扱いについて
                ご不明な点がございましたら、お気軽にお問い合わせください。
              </p>
              <Link
                href="/#chat"
                className="inline-block bg-white text-[#8B5A3C] px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                AIチャットでお問い合わせ
              </Link>
            </div>
          </section>
        </main>

        <SocialLinks />
        <Footer />
      </div>
    </>
  )
}
