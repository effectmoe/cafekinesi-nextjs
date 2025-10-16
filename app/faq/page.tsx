import { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialLinks from '@/components/SocialLinks'

// ISR設定（30分ごとに再生成）
export const revalidate = 1800

// FAQ データ構造
interface FAQ {
  id: string
  category: string
  question: string
  answer: string
}

// FAQ データ
const faqs: FAQ[] = [
  // カテゴリ1: キネシオロジーについて
  {
    id: 'kinesi-001',
    category: 'キネシオロジーについて',
    question: 'キネシオロジーとは何ですか？',
    answer: 'キネシオロジーは、筋肉反射テスト（筋肉の反応）を用いて、心身のバランスを整える技法です。東洋医学の経絡理論とカイロプラクティックの知識を融合させ、身体・心・エネルギーの調和を目指します。ストレス、感情、身体の不調など、様々な問題に対して、身体が持つ自然治癒力を引き出すサポートをします。',
  },
  {
    id: 'kinesi-002',
    category: 'キネシオロジーについて',
    question: 'どんな効果がありますか？',
    answer: 'キネシオロジーは、ストレスの軽減、感情のバランス調整、身体の不調改善、学習能力の向上、目標達成のサポートなど、幅広い効果が期待できます。身体・心・エネルギーの3つの側面から総合的にアプローチすることで、根本的な問題解決を目指します。',
  },
  {
    id: 'kinesi-003',
    category: 'キネシオロジーについて',
    question: '医療行為ですか？',
    answer: 'いいえ、キネシオロジーは医療行為ではありません。代替療法・補完療法の一つとして位置づけられています。病気の診断や治療を目的とするものではなく、心身のバランスを整え、自然治癒力を高めることを目的としています。医療的な問題がある場合は、必ず医療機関を受診してください。',
  },
  {
    id: 'kinesi-004',
    category: 'キネシオロジーについて',
    question: '科学的根拠はありますか？',
    answer: 'キネシオロジーの効果については、多くの実践者からの報告や臨床研究がありますが、科学的なエビデンスは発展途上の段階です。筋肉反射テストの再現性や効果のメカニズムについては、さらなる研究が進められています。',
  },
  {
    id: 'kinesi-005',
    category: 'キネシオロジーについて',
    question: 'タッチフォーヘルスとの違いは？',
    answer: 'タッチフォーヘルスは、キネシオロジーの技法の一つです。キネシオロジーという大きな分野の中に、タッチフォーヘルス、ブレインジム、ピーチタッチなど、様々な技法が存在します。タッチフォーヘルスは、東洋医学の経絡とカイロプラクティックを組み合わせた基礎的な技法として広く知られています。',
  },

  // カテゴリ2: 初心者向け
  {
    id: 'beginner-001',
    category: '初心者向け',
    question: '初めてでも受講できますか？',
    answer: 'はい、もちろんです。Cafe Kinesiでは、初心者の方向けの講座を多数ご用意しています。基礎から丁寧に指導しますので、キネシオロジーの知識が全くない方でも安心して学んでいただけます。',
  },
  {
    id: 'beginner-002',
    category: '初心者向け',
    question: '何から始めればいいですか？',
    answer: '初心者の方には、まず「タッチフォーヘルス レベル1」の受講をおすすめしています。これはキネシオロジーの基礎を学ぶ講座で、筋肉反射テストの方法や基本的な調整法を実践的に学べます。その後、興味に応じて様々な講座に進むことができます。',
  },
  {
    id: 'beginner-003',
    category: '初心者向け',
    question: '医療や身体の知識がなくても大丈夫ですか？',
    answer: 'はい、大丈夫です。講座では、必要な基礎知識から丁寧に説明します。専門的な医療知識がなくても、誰でも理解できるよう工夫されたカリキュラムになっています。実際に、様々な職業・バックグラウンドの方が受講されています。',
  },
  {
    id: 'beginner-004',
    category: '初心者向け',
    question: 'どのくらいの期間で習得できますか？',
    answer: '基礎的な技法は、数日間の講座で学ぶことができます。ただし、実践を重ねてスキルを磨いていくには、継続的な学習と練習が大切です。タッチフォーヘルス レベル1〜4を修了するには、通常6ヶ月〜1年程度かかります。',
  },
  {
    id: 'beginner-005',
    category: '初心者向け',
    question: '年齢制限はありますか？',
    answer: '特に年齢制限はありません。18歳以上の方であれば、どなたでも受講いただけます。実際に、20代から70代まで幅広い年齢層の方が学んでいます。',
  },

  // カテゴリ3: 講座について
  {
    id: 'course-001',
    category: '講座について',
    question: 'どんな講座がありますか？',
    answer: 'Cafe Kinesiでは、タッチフォーヘルス、ブレインジム、ピーチタッチ、健康キネシオロジー、発達キネシオロジーなど、多岐にわたる講座を提供しています。初心者向けから上級者向けまで、段階的に学べるプログラムが揃っています。詳しくは講座一覧ページをご覧ください。',
  },
  {
    id: 'course-002',
    category: '講座について',
    question: '講座の期間はどのくらいですか？',
    answer: '講座により異なりますが、基礎的な講座は2〜3日間、上級講座は4〜5日間が一般的です。週末開催や連続開催など、様々なスケジュールをご用意していますので、ご都合に合わせて選択いただけます。',
  },
  {
    id: 'course-003',
    category: '講座について',
    question: 'オンライン受講は可能ですか？',
    answer: '一部の講座はオンラインで受講可能です。ただし、実技を伴う講座については、対面での受講を推奨しています。詳細は各講座ページをご確認ください。',
  },
  {
    id: 'course-004',
    category: '講座について',
    question: '資格は取得できますか？',
    answer: 'はい、各講座を修了すると修了証が発行されます。タッチフォーヘルス レベル1〜4を修了すると、国際キネシオロジー大学（IKC）の公式認定資格が取得できます。この資格により、プロとしてセッションを提供することができます。',
  },
  {
    id: 'course-005',
    category: '講座について',
    question: '講座の再受講は可能ですか？',
    answer: 'はい、可能です。一度受講した講座を再受講することで、理解を深めたり、新たな気づきを得ることができます。再受講の場合、受講料の割引が適用される場合があります。詳しくはお問い合わせください。',
  },
  {
    id: 'course-006',
    category: '講座について',
    question: '遠方からでも参加できますか？',
    answer: 'はい、全国各地から受講される方がいらっしゃいます。宿泊が必要な場合は、会場近くの宿泊施設をご案内することも可能です。また、交通アクセスの良い会場を選んでいますので、遠方の方でも参加しやすくなっています。',
  },

  // カテゴリ4: 料金・支払い
  {
    id: 'price-001',
    category: '料金・支払い',
    question: '受講料はどのくらいですか？',
    answer: '講座により異なりますが、基礎講座は30,000円〜50,000円程度、上級講座は60,000円〜100,000円程度です。詳細な料金は各講座ページをご確認ください。早期申込割引や複数講座同時申込割引などもご用意しています。',
  },
  {
    id: 'price-002',
    category: '料金・支払い',
    question: '支払い方法は何がありますか？',
    answer: '銀行振込、クレジットカード決済に対応しています。分割払いをご希望の場合は、事前にご相談ください。',
  },
  {
    id: 'price-003',
    category: '料金・支払い',
    question: '受講料に含まれるものは何ですか？',
    answer: '受講料には、講座受講費、テキスト代、修了証発行費が含まれます。一部の講座では、実習用の教材も含まれます。交通費・宿泊費は含まれませんので、ご了承ください。',
  },
  {
    id: 'price-004',
    category: '料金・支払い',
    question: '割引制度はありますか？',
    answer: 'はい、早期申込割引、複数講座同時申込割引、再受講割引などをご用意しています。また、学生割引が適用される講座もあります。詳しくは各講座ページをご確認ください。',
  },
  {
    id: 'price-005',
    category: '料金・支払い',
    question: '領収書は発行されますか？',
    answer: 'はい、ご希望の方には領収書を発行いたします。お申込み時、または受講当日にお申し出ください。',
  },

  // カテゴリ5: キャンセル・変更
  {
    id: 'cancel-001',
    category: 'キャンセル・変更',
    question: 'キャンセルはできますか？',
    answer: 'はい、可能です。ただし、キャンセル料が発生する場合があります。講座開催日の14日前まで：無料、7日前まで：受講料の30%、3日前まで：50%、前日・当日：100%のキャンセル料が発生します。',
  },
  {
    id: 'cancel-002',
    category: 'キャンセル・変更',
    question: '日程変更はできますか？',
    answer: 'はい、可能です。同じ講座の別日程に空きがある場合、無料で日程変更していただけます。ただし、開催日の3日前までにご連絡ください。',
  },
  {
    id: 'cancel-003',
    category: 'キャンセル・変更',
    question: '講座が中止になった場合は？',
    answer: '最小催行人数に満たない場合や、やむを得ない事情により講座が中止になる場合があります。その場合、受講料は全額返金いたします。また、別日程への振替も可能です。',
  },
  {
    id: 'cancel-004',
    category: 'キャンセル・変更',
    question: '途中で参加できなくなった場合は？',
    answer: '講座開始後のキャンセルは原則として返金対象外となります。ただし、やむを得ない事情がある場合は、別日程への振替や、一部返金などを個別にご相談させていただきます。',
  },

  // カテゴリ6: インストラクターについて
  {
    id: 'instructor-001',
    category: 'インストラクターについて',
    question: 'どんなインストラクターが教えていますか？',
    answer: 'Cafe Kinesiでは、国際キネシオロジー大学（IKC）の公式認定を受けた経験豊富なインストラクターが指導しています。それぞれが専門分野を持ち、豊富な実践経験と教育経験を活かした質の高い講座を提供しています。',
  },
  {
    id: 'instructor-002',
    category: 'インストラクターについて',
    question: '創始者はどんな人ですか？',
    answer: 'Cafe Kinesiは、星 ユカリが創設しました。キネシオロジーの第一人者として、全国で講座やセッションを提供しています。タッチフォーヘルス、ブレインジム、ピーチタッチなど、幅広い専門知識を持ち、多くのインストラクターを育成してきました。詳しくはプロフィールページをご覧ください。',
  },
  {
    id: 'instructor-003',
    category: 'インストラクターについて',
    question: 'インストラクターは選べますか？',
    answer: '講座により、複数のインストラクターが開催している場合があります。その場合、インストラクターを選んで受講することができます。各インストラクターのプロフィールをご確認の上、お選びください。',
  },
  {
    id: 'instructor-004',
    category: 'インストラクターについて',
    question: '個人セッションも受けられますか？',
    answer: 'はい、一部のインストラクターは個人セッションも提供しています。講座とは別に、個別のニーズに応じたセッションを受けることができます。詳しくは各インストラクターのページをご確認ください。',
  },

  // カテゴリ7: セッションについて
  {
    id: 'session-001',
    category: 'セッションについて',
    question: '個人セッションとは何ですか？',
    answer: '個人セッションは、キネシオロジーの技法を用いて、個人の心身のバランスを整えるサービスです。筋肉反射テストを通じて、身体が必要としている調整を見つけ出し、適切なアプローチで問題解決をサポートします。',
  },
  {
    id: 'session-002',
    category: 'セッションについて',
    question: 'セッションの時間はどのくらいですか？',
    answer: '通常、60分〜90分です。初回は問診に時間がかかるため、90分〜120分程度かかる場合があります。',
  },
  {
    id: 'session-003',
    category: 'セッションについて',
    question: 'セッション料金はいくらですか？',
    answer: 'インストラクターにより異なりますが、通常60分で10,000円〜15,000円程度です。詳細は各インストラクターのページをご確認ください。',
  },
  {
    id: 'session-004',
    category: 'セッションについて',
    question: '何回くらい受ければいいですか？',
    answer: '個人差がありますが、多くの方は1回のセッションで変化を感じられます。ただし、根本的な問題解決のためには、数回のセッションを重ねることをおすすめしています。',
  },
  {
    id: 'session-005',
    category: 'セッションについて',
    question: '子供でも受けられますか？',
    answer: 'はい、お子様でもセッションを受けることができます。発達の問題、学習の困難、感情のバランスなど、様々な問題に対応しています。保護者の方の同席をお願いしています。',
  },

  // カテゴリ8: 予約・申込について
  {
    id: 'booking-001',
    category: '予約・申込について',
    question: '講座の申し込み方法は？',
    answer: '各講座ページの申し込みフォームからお申し込みいただけます。また、お電話やメールでも受け付けています。お申し込み後、詳細なご案内をメールでお送りします。',
  },
  {
    id: 'booking-002',
    category: '予約・申込について',
    question: '申し込み後の流れは？',
    answer: 'お申し込み後、確認メールが届きます。その後、受講料のお支払いをお願いします。お支払い確認後、受講票をお送りします。講座当日は、受講票をご持参ください。',
  },
  {
    id: 'booking-003',
    category: '予約・申込について',
    question: '定員はありますか？',
    answer: 'はい、各講座には定員があります。通常、10名〜20名程度です。定員に達した場合は、キャンセル待ちを承ります。',
  },
  {
    id: 'booking-004',
    category: '予約・申込について',
    question: '最小催行人数はありますか？',
    answer: 'はい、講座により異なりますが、通常4名〜6名です。最小催行人数に満たない場合、講座が中止になることがあります。その場合は、開催日の1週間前までにご連絡します。',
  },
  {
    id: 'booking-005',
    category: '予約・申込について',
    question: '複数人で申し込みたいのですが',
    answer: '複数人での同時申し込みも可能です。お申し込みフォームで人数を選択してください。グループ割引が適用される場合があります。',
  },

  // カテゴリ9: 会場・アクセスについて
  {
    id: 'venue-001',
    category: '会場・アクセスについて',
    question: '講座はどこで開催されますか？',
    answer: '全国各地で講座を開催しています。主な開催地は、東京、大阪、名古屋、福岡などです。各講座ページで開催地をご確認ください。',
  },
  {
    id: 'venue-002',
    category: '会場・アクセスについて',
    question: '駐車場はありますか？',
    answer: '会場により異なります。駐車場がある会場もありますが、公共交通機関でのご来場をおすすめしています。詳しくは各講座の開催情報をご確認ください。',
  },
  {
    id: 'venue-003',
    category: '会場・アクセスについて',
    question: '昼食は用意されますか？',
    answer: '基本的に昼食はご自身でご用意ください。会場周辺には飲食店やコンビニがあります。一部の講座では、お弁当の手配も可能です。',
  },
  {
    id: 'venue-004',
    category: '会場・アクセスについて',
    question: '宿泊施設の紹介はありますか？',
    answer: 'はい、遠方からお越しの方には、会場近くの宿泊施設をご案内できます。お申し込み時にお知らせください。',
  },

  // カテゴリ10: その他
  {
    id: 'other-001',
    category: 'その他',
    question: '見学はできますか？',
    answer: '講座の見学は、基本的には受け付けていません。ただし、講座説明会や体験会を開催することがありますので、そちらにご参加ください。',
  },
  {
    id: 'other-002',
    category: 'その他',
    question: '持ち物は何が必要ですか？',
    answer: '筆記用具とノートをご持参ください。動きやすい服装でお越しください。実技を行う講座では、着替えをご用意いただく場合があります。詳しくは各講座の案内をご確認ください。',
  },
  {
    id: 'other-003',
    category: 'その他',
    question: '修了証はいつもらえますか？',
    answer: '講座最終日に、修了証をお渡しします。全日程に出席し、課題を提出した方に発行されます。',
  },
  {
    id: 'other-004',
    category: 'その他',
    question: 'アフターフォローはありますか？',
    answer: 'はい、講座修了後も、メーリングリストやFacebookグループなどで情報交換やフォローアップを行っています。また、練習会や復習会なども定期的に開催しています。',
  },
  {
    id: 'other-005',
    category: 'その他',
    question: 'インストラクターになりたいのですが',
    answer: 'インストラクター養成プログラムをご用意しています。まずは各技法の基礎講座を修了し、必要な資格を取得してください。その後、インストラクター養成コースを受講いただけます。詳しくはお問い合わせください。',
  },
  {
    id: 'other-006',
    category: 'その他',
    question: 'ボランティア活動はしていますか？',
    answer: 'はい、Cafe Kinesiでは、学校や福祉施設などでのボランティアセッションや講座を行っています。また、災害支援活動にも参加しています。ボランティアに興味のある方は、お問い合わせください。',
  },
  {
    id: 'other-007',
    category: 'その他',
    question: '企業研修は可能ですか？',
    answer: 'はい、企業や団体向けの研修プログラムも提供しています。ストレスマネジメント、チームビルディング、リーダーシップ開発など、ニーズに応じてカスタマイズできます。お気軽にご相談ください。',
  },
]

// カテゴリ一覧を取得
const categories = Array.from(new Set(faqs.map((faq) => faq.category)))

// メタデータ生成
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cafekinesi.com'
  const pageUrl = `${baseUrl}/faq`

  const title = 'よくある質問（FAQ） | Cafe Kinesi'
  const description = 'カフェキネシに関するよくある質問をまとめました。キネシオロジー、講座、料金、申し込み方法など、50件以上のQ&Aで疑問を解決します。初めての方もお気軽にご覧ください。'
  const keywords = 'カフェキネシ, よくある質問, FAQ, キネシオロジー, 講座, 料金, 申し込み, 初心者, インストラクター, セッション'
  const ogImageUrl = `${baseUrl}/og-image.jpg`

  return {
    title,
    description,
    keywords,

    // SEOメタデータ
    authors: [{ name: 'Cafe Kinesi' }],
    creator: 'Cafe Kinesi',
    publisher: 'Cafe Kinesi',

    // Open Graph (OGP)
    openGraph: {
      type: 'website',
      locale: 'ja_JP',
      url: pageUrl,
      siteName: 'Cafe Kinesi',
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      creator: '@cafekinesi',
      site: '@cafekinesi',
    },

    // Canonical URL（重複コンテンツ対策）
    alternates: {
      canonical: pageUrl,
    },

    // robots制御（検索エンジン向け指示）
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default function FAQPage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cafekinesi.com'
  const pageUrl = `${baseUrl}/faq`

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'ホーム',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'よくある質問',
        item: pageUrl,
      },
    ],
  }

  // FAQPage Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org JSON-LD (BreadcrumbList) */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* Schema.org JSON-LD (FAQPage) */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <Header />

      <main className="relative pt-20">
        {/* パンくずナビゲーション */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-[#8B5A3C] transition-colors">
              ホーム
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-900 font-medium">よくある質問</span>
          </nav>
        </div>

        {/* ページタイトル */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">
            よくある質問（FAQ）
          </h1>
          <p className="text-center text-gray-600 max-w-3xl mx-auto">
            カフェキネシに関するよくある質問をまとめました。
            <br />
            ご不明な点がございましたら、お気軽にお問い合わせください。
          </p>
        </div>

        {/* FAQ コンテンツ */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* カテゴリごとに表示 */}
          {categories.map((category, categoryIndex) => (
            <div key={category} className="mb-12">
              {/* カテゴリタイトル */}
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-[#8B5A3C]">
                {category}
              </h2>

              {/* FAQアコーディオン */}
              <div className="space-y-4">
                {faqs
                  .filter((faq) => faq.category === category)
                  .map((faq, index) => (
                    <details
                      key={faq.id}
                      className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                    >
                      <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex items-start gap-4 flex-1">
                          <span className="flex-shrink-0 w-8 h-8 bg-[#8B5A3C] text-white rounded-full flex items-center justify-center text-sm font-bold">
                            Q
                          </span>
                          <h3 className="text-lg font-medium text-gray-900 flex-1 pr-4">
                            {faq.question}
                          </h3>
                        </div>
                        <svg
                          className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </summary>
                      <div className="px-6 pb-6 pt-4">
                        <div className="flex items-start gap-4 pl-12">
                          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {faq.answer}
                          </div>
                        </div>
                      </div>
                    </details>
                  ))}
              </div>
            </div>
          ))}

          {/* 問い合わせ誘導 */}
          <div className="mt-16 bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              解決しない疑問がありますか？
            </h2>
            <p className="text-gray-600 mb-6">
              上記以外のご質問やご不明な点がございましたら、
              <br />
              お気軽にお問い合わせください。
            </p>
            <Link
              href="/#contact"
              className="inline-block bg-[#8B5A3C] text-white px-8 py-3 rounded-lg hover:bg-[#6D4830] transition-colors font-medium"
            >
              お問い合わせはこちら
            </Link>
          </div>
        </div>
      </main>

      <SocialLinks />
      <Footer />
    </div>
  )
}
