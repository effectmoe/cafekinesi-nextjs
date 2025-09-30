import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'

// 環境変数を読み込み
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_WRITE_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// スクールページの初期データ
const schoolPageData = {
  _type: 'schoolPage',
  _id: 'schoolPage', // singleton
  title: 'スクール',
  heroSection: {
    title: 'スクール',
    description: 'カフェキネシオロジーは、どなたでも気軽に始められるヒーリング技術です。基礎から応用まで、段階的に学べる6つの講座をご用意しています。あなたのペースで、楽しみながら技術を身につけていきましょう。'
  },
  courseListTitle: '講座一覧',
  ctaSection: {
    title: 'まずは体験してみませんか？',
    description: 'カフェキネシオロジーの魅力を実際に体験していただける、体験講座を定期的に開催しています。お気軽にご参加ください。',
    primaryButton: {
      text: '体験講座のご案内',
      link: '/contact'
    },
    secondaryButton: {
      text: 'お問い合わせ',
      link: '/contact'
    }
  },
  // featuredCoursesは空配列（全講座を表示）
  featuredCourses: [],
  seo: {
    title: 'スクール | Cafe Kinesi',
    description: 'カフェキネシオロジーの各講座をご紹介します。どなたでも気軽に始められる講座から、専門的な技術まで幅広く学べます。',
    keywords: 'キネシオロジー, スクール, 講座, ヒーリング, セラピー, カフェキネシ'
  },
  isActive: true
}

async function seedSchoolPage() {
  try {
    console.log('🚀 スクールページデータの投入開始...\n')

    // 既存のschoolPageドキュメントを確認
    const existing = await client.fetch('*[_type == "schoolPage"][0]')

    if (existing) {
      console.log('⚠️  既にschoolPageドキュメントが存在します')
      console.log('既存データ:', JSON.stringify(existing, null, 2))
      console.log('\n上書きしますか？ (このスクリプトは強制上書きします)')
      console.log('⏳ 5秒後に上書きします... (Ctrl+C で中止)\n')
      await new Promise(resolve => setTimeout(resolve, 5000))
    }

    console.log('📝 schoolPageドキュメントを作成/更新中...\n')

    // createOrReplaceで作成または更新
    await client.createOrReplace(schoolPageData)

    console.log('=' .repeat(60))
    console.log('✅ スクールページデータの投入完了！')
    console.log('='.repeat(60))

    console.log('\n📋 作成されたデータ:')
    console.log('  - Document ID: schoolPage')
    console.log('  - タイトル:', schoolPageData.title)
    console.log('  - ヒーローセクション:', schoolPageData.heroSection.title)
    console.log('  - CTAセクション:', schoolPageData.ctaSection.title)
    console.log('  - アクティブ:', schoolPageData.isActive)

    console.log('\n🔗 確認方法:')
    console.log('1. Sanity Studio: http://localhost:3333/')
    console.log('2. 「スクールページ設定」を開いて内容を確認')
    console.log('3. WEBページ: https://cafekinesi-nextjs.vercel.app/school')
    console.log('\n💡 次のステップ:')
    console.log('1. Sanity Studioでコンテンツを編集')
    console.log('2. 「Publish」をクリックして公開')
    console.log('3. Webhookが自動的にISRキャッシュをクリア')
    console.log('4. 約30秒後にWEBページに反映')

  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error)
    if (error instanceof Error) {
      console.error('エラーメッセージ:', error.message)
      console.error('\nヒント:')
      console.error('1. SANITY_WRITE_TOKENが設定されているか確認')
      console.error('2. .env.localファイルが存在するか確認')
      console.error('3. ネットワーク接続を確認')
    }
  }
}

// スクリプトを実行
seedSchoolPage()