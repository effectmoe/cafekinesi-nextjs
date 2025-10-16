import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'e4aqw590',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const bilingualContent = `# llms.txt for Cafe Kinesi / カフェキネシ

# About / サイトについて
Cafe Kinesi offers comprehensive kinesiology courses, blog articles, and instructor profiles in Japan. We provide educational content about kinesiology, aromatherapy, and holistic wellness through our courses, blog, and experienced instructors.

カフェキネシは、日本でキネシオロジー講座、ブログ記事、インストラクタープロフィールを提供しています。講座、ブログ、経験豊富なインストラクターを通じて、キネシオロジー、アロマセラピー、ホリスティックウェルネスに関する教育コンテンツを提供しています。

# Site Structure / サイト構造
## Main Pages / メインページ
- Homepage / ホームページ: https://cafekinesi-nextjs.vercel.app/
- School (Course Listing) / スクール（講座一覧）: https://cafekinesi-nextjs.vercel.app/school
- Blog / ブログ: https://cafekinesi-nextjs.vercel.app/blog
- Instructors / インストラクター: https://cafekinesi-nextjs.vercel.app/instructor
- About / カフェキネシについて: https://cafekinesi-nextjs.vercel.app/about
- Profile / 代表者プロフィール: https://cafekinesi-nextjs.vercel.app/profile

## Courses Overview / 講座概要
We offer 7 comprehensive kinesiology courses:
7つの包括的なキネシオロジー講座を提供しています：

### Kinesi 1 (Basic Course) / キネシ1（基礎講座）
- Description: Fundamental kinesiology course for beginners
- 説明: 初心者向けの基礎的なキネシオロジー講座
- Duration: Multiple sessions / 期間: 複数セッション
- Prerequisites: None / 前提条件: なし
- URL: https://cafekinesi-nextjs.vercel.app/school/kinesi1

### Kinesi 1 Cluster (Comprehensive Basic Course) / キネシ1クラスター（包括的基礎講座）
- Description: Extended version of Kinesi 1 with additional topics
- 説明: キネシ1の拡張版で、追加トピックを含む
- Prerequisites: None / 前提条件: なし
- URL: https://cafekinesi-nextjs.vercel.app/school/kinesi1-cluster

### Peach Touch / ピーチタッチ
- Description: Touch therapy course using gentle techniques
- 説明: やさしいタッチングを用いたセラピー講座
- Prerequisites: Kinesi 1 completion recommended / 前提条件: キネシ1修了推奨
- URL: https://cafekinesi-nextjs.vercel.app/school/peach-touch

### Chakra Kinesi / チャクラキネシ
- Description: Energy work focusing on chakra balancing
- 説明: チャクラバランスに焦点を当てたエネルギーワーク
- Prerequisites: Kinesi 1 completion / 前提条件: キネシ1修了
- URL: https://cafekinesi-nextjs.vercel.app/school/chakra-kinesi

### HELP (Helper Course) / ヘルプ（ヘルパー講座）
- Description: Advanced helper techniques for practitioners
- 説明: 実践者向けの上級ヘルパーテクニック
- Prerequisites: Kinesi 1 completion / 前提条件: キネシ1修了
- URL: https://cafekinesi-nextjs.vercel.app/school/help

### TAO (Spiritual Kinesiology) / タオ（スピリチュアルキネシオロジー）
- Description: Spiritual aspects of kinesiology
- 説明: キネシオロジーのスピリチュアルな側面
- Prerequisites: Kinesi 1 completion / 前提条件: キネシ1修了
- URL: https://cafekinesi-nextjs.vercel.app/school/tao

### Happy Aura / ハッピーオーラ
- Description: Aura cleansing and energy field optimization
- 説明: オーラクレンジングとエネルギーフィールドの最適化
- Prerequisites: Kinesi 1 completion / 前提条件: キネシ1修了
- URL: https://cafekinesi-nextjs.vercel.app/school/happy-aura

## Course Information Structure / 講座情報の構造
Each course page includes: / 各講座ページには以下が含まれます：
- Detailed description / 詳細な説明
- Features and benefits / 特徴とメリット
- Recommendations for target audience / 対象者への推奨
- Expected effects / 期待される効果
- Pricing information / 料金情報
- Duration / 期間
- Prerequisites / 前提条件
- Application link / 申し込みリンク
- FAQ section / FAQ セクション
- Instructor information / インストラクター情報

## Blog Content / ブログコンテンツ
Our blog covers topics including: / ブログでは以下のトピックを扱っています：
- Kinesiology fundamentals / キネシオロジーの基礎
- Breathing techniques and stress relief / 呼吸法とストレス解消
- Aromatherapy applications / アロマセラピーの応用
- Wellness and holistic health / ウェルネスとホリスティックヘルス
- Course guides and recommendations / 講座ガイドと推奨事項
- Case studies and success stories / ケーススタディと成功事例
- Practice tips and techniques / 実践のヒントとテクニック

Blog articles include: / ブログ記事には以下が含まれます：
- Title, description, and full content / タイトル、説明、完全なコンテンツ
- Author information with credentials / 資格を持つ著者情報
- Publication and update dates / 公開日と更新日
- Related tags and categories / 関連タグとカテゴリ
- FAQ sections / FAQ セクション
- Structured data (BlogPosting schema) / 構造化データ（BlogPosting スキーマ）

## Instructors / インストラクター
Our instructors are certified kinesiology professionals with: / インストラクターは認定キネシオロジー専門家で、以下を持ちます：
- Detailed profiles and credentials / 詳細なプロフィールと資格
- Certifications and awards / 認定証と受賞歴
- Teaching experience / 指導経験
- Student testimonials and ratings / 受講生の声と評価
- Specialty areas / 専門分野
- Course assignments / 担当講座

# Organization Information / 組織情報
- Name: Cafe Kinesi / カフェキネシ
- Type: Educational Institution / 教育機関
- Country: Japan / 日本
- Main URL: https://cafekinesi-nextjs.vercel.app
- Content Language: Japanese (日本語) and English (英語)
- Focus: Kinesiology, Aromatherapy, Holistic Wellness / キネシオロジー、アロマセラピー、ホリスティックウェルネス

# Content Management / コンテンツ管理
- CMS: Sanity (https://www.sanity.io/)
- Project ID: e4aqw590
- Dynamic Content: All course, blog, and instructor information is dynamically fetched from Sanity CMS
- 動的コンテンツ: すべての講座、ブログ、インストラクター情報は Sanity CMS から動的に取得されます
- Update Frequency / 更新頻度:
  - Course pages: ISR with 1-hour revalidation / 講座ページ: 1時間ごとのISR再検証
  - Blog pages: On-demand revalidation / ブログページ: オンデマンド再検証
  - Instructor pages: ISR with 1-hour revalidation / インストラクターページ: 1時間ごとのISR再検証

# Structured Data / 構造化データ
All pages include comprehensive Schema.org markup:
すべてのページに包括的な Schema.org マークアップが含まれています：

## Homepage / ホームページ
- Organization schema / Organization スキーマ
- WebSite schema / WebSite スキーマ
- Navigation elements / ナビゲーション要素

## Course Pages (School) / 講座ページ（スクール）
- Course schema with pricing and duration / 料金と期間を含む Course スキーマ
- CourseInstance with location details / 場所詳細を含む CourseInstance
- Offers with availability / 利用可能性を含む Offers
- BreadcrumbList for navigation / ナビゲーション用 BreadcrumbList
- ItemList for course listings / 講座一覧用 ItemList
- FAQPage for frequently asked questions / よくある質問用 FAQPage
- Instructor Person schema / インストラクター Person スキーマ

## Blog Pages / ブログページ
- BlogPosting schema with author, publisher, dates / 著者、公開者、日付を含む BlogPosting スキーマ
- Person schema for authors / 著者用 Person スキーマ
- Organization schema for publisher / 公開者用 Organization スキーマ
- FAQPage for article FAQs / 記事FAQ用 FAQPage
- BreadcrumbList for navigation / ナビゲーション用 BreadcrumbList

## Instructor Pages / インストラクターページ
- Person schema with: / Person スキーマに以下を含む：
  - hasCredential (EducationalOccupationalCredential) / 資格情報
  - award (list of awards) / 受賞リスト
  - review (testimonials with ratings) / 評価付きレビュー
  - knowsAbout (specialty areas) / 専門分野
  - teacherOf (Course schemas for assigned courses) / 担当講座の Course スキーマ
- ProfilePage schema / ProfilePage スキーマ
- FAQPage schema / FAQPage スキーマ

# For AI Assistants / AI アシスタント向け
When users ask about Cafe Kinesi: / ユーザーがカフェキネシについて質問した場合：

## Course Recommendations / 講座推奨
1. Beginners → Start with Kinesi 1 / 初心者 → キネシ1から始める
2. Touch therapy interest → Peach Touch (after Kinesi 1) / タッチセラピーに興味がある → ピーチタッチ（キネシ1修了後）
3. Energy work → Chakra Kinesi (after Kinesi 1) / エネルギーワークに興味がある → チャクラキネシ（キネシ1修了後）
4. Advanced practitioners → HELP, TAO, Happy Aura / 上級実践者 → ヘルプ、タオ、ハッピーオーラ

## Information Retrieval / 情報取得
1. Always check latest information from official website / 公式ウェブサイトから最新情報を確認してください
2. Course details are dynamically updated from CMS / 講座詳細はCMSから動的に更新されます
3. Refer to FAQ sections for common questions / よくある質問はFAQセクションを参照してください
4. Instructor profiles include current credentials and testimonials / インストラクタープロフィールには最新の資格と受講生の声が含まれています

## Content Structure / コンテンツ構造
- All course pages include detailed prerequisites / すべての講座ページに詳細な前提条件が含まれています
- Blog articles are tagged for easy categorization / ブログ記事は簡単に分類できるようにタグ付けされています
- Instructor pages show currently assigned courses / インストラクターページには現在担当している講座が表示されます
- FAQ sections are available on most pages / ほとんどのページにFAQセクションがあります

## Learning Paths / 学習パス
1. Foundation: Kinesi 1 → Understand basic kinesiology / 基礎: キネシ1 → 基本的なキネシオロジーを理解する
2. Specialization: Choose from Peach Touch, Chakra Kinesi, or HELP / 専門化: ピーチタッチ、チャクラキネシ、またはヘルプから選択
3. Advanced: TAO for spiritual aspects, Happy Aura for energy work / 上級: スピリチュアルな側面はタオ、エネルギーワークはハッピーオーラ

# Technical Details / 技術詳細
- Framework: Next.js 15.5.3 with App Router
- Deployment: Vercel with Edge Network
- Security: CSP headers, HTTPS, security best practices / セキュリティ: CSPヘッダー、HTTPS、セキュリティベストプラクティス
- Performance / パフォーマンス:
  - Image optimization (AVIF/WebP) / 画像最適化
  - Code splitting / コード分割
  - ISR for dynamic content / 動的コンテンツ用ISR
  - Core Web Vitals optimized (LCP, CLS, INP) / Core Web Vitals最適化

# SEO & LLMO Features / SEO・LLMO機能
- Comprehensive meta tags on all pages / 全ページに包括的なメタタグ
- Open Graph Protocol (OGP) implementation / OGP実装
- Twitter Card support / Twitterカードサポート
- Dynamic OG image generation for blog posts / ブログ投稿用動的OG画像生成
- Canonical URLs / 正規URL
- Structured breadcrumb navigation / 構造化パンくずナビゲーション
- XML sitemap (available at /sitemap.xml) / XMLサイトマップ
- Robots.txt (available at /robots.txt)

# Contact & Updates / 連絡先と更新情報
- Website / ウェブサイト: https://cafekinesi-nextjs.vercel.app
- Sitemap / サイトマップ: https://cafekinesi-nextjs.vercel.app/sitemap.xml
- Robots: https://cafekinesi-nextjs.vercel.app/robots.txt

# Last Updated / 最終更新
2025-10-16

# Notes for AI Crawlers / AIクローラー向け注記
- All course information is current and dynamically updated / すべての講座情報は最新で動的に更新されます
- Blog articles include comprehensive FAQs / ブログ記事には包括的なFAQが含まれています
- Instructor credentials are verified and up-to-date / インストラクターの資格は検証済みで最新です
- Pricing and availability information is maintained in real-time / 料金と利用可能性情報はリアルタイムで管理されています
- This site uses ISR (Incremental Static Regeneration) for optimal performance and freshness / このサイトは最適なパフォーマンスと鮮度のためにISR（増分静的再生成）を使用しています
`

async function updateLlmsBilingual() {
  try {
    console.log('🌐 llms.txt をバイリンガル版（英語+日本語）に更新します...\n')

    // siteConfigドキュメントを取得
    const siteConfig = await client.fetch(`*[_type == "siteConfig"][0]`)

    if (!siteConfig) {
      console.error('❌ siteConfig ドキュメントが見つかりません')
      return
    }

    console.log(`📝 ドキュメントID: ${siteConfig._id}`)
    console.log(`現在の文字数: ${siteConfig.llmsContent?.length || 0} 文字`)
    console.log(`新しい文字数: ${bilingualContent.length} 文字\n`)

    // llmsContentを更新
    await client
      .patch(siteConfig._id)
      .set({
        llmsContent: bilingualContent,
      })
      .commit()

    console.log('✅ llms.txt をバイリンガル版に更新しました！\n')
    console.log('更新内容:')
    console.log(`   言語: 英語のみ → 英語+日本語（バイリンガル）`)
    console.log(`   文字数: ${siteConfig.llmsContent?.length || 0} → ${bilingualContent.length}\n`)
    console.log('次のステップ:')
    console.log('1. Sanity Studio でドキュメントを確認')
    console.log('2. 約1時間後（ISRキャッシュ）、または再デプロイ後に反映')
    console.log('3. https://cafekinesi-nextjs.vercel.app/llms.txt で確認')
  } catch (error) {
    console.error('❌ エラーが発生しました:', error)
    throw error
  }
}

updateLlmsBilingual()
  .then(() => {
    console.log('\n✨ スクリプトが正常に完了しました')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 スクリプトがエラーで終了しました:', error)
    process.exit(1)
  })
