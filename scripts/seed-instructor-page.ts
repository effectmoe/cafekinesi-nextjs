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

// インストラクターページの初期データ
const instructorPageData = {
  _type: 'instructorPage',
  _id: 'instructorPage', // singleton
  title: 'インストラクターを探す',
  heroSection: {
    title: 'インストラクターを探す',
    description: 'お近くのカフェキネシインストラクターを見つけましょう'
  },
  aboutSection: {
    title: 'カフェキネシインストラクターとは',
    description: [
      {
        _type: 'block',
        _key: 'block1',
        children: [
          {
            _type: 'span',
            _key: 'span1',
            text: 'カフェキネシインストラクターは、キネシオロジーやセラピーを教える資格を持った認定講師です。心と身体の健康をサポートし、一人ひとりに合わせたセッションやワークショップを開催しています。',
            marks: []
          }
        ],
        markDefs: [],
        style: 'normal'
      },
      {
        _type: 'block',
        _key: 'block2',
        children: [
          {
            _type: 'span',
            _key: 'span2',
            text: '全国各地で活動するインストラクターが、あなたのためにマンツーマンセッションやグループワークショップを開催していますので、地域から最適なインストラクターを選び、初心者の方でもセッションやワークショップに参加して楽しめます。',
            marks: []
          }
        ],
        markDefs: [],
        style: 'normal'
      }
    ]
  },
  servicesSection: {
    title: '提供サービス',
    services: [
      {
        _key: 'service1',
        title: '個別セッション',
        description: 'マンツーマンであなたのニーズに合わせたキネシオロジーセッションやカフェキネシ施術を提供します。初心者の方でも安心して受けられます。'
      },
      {
        _key: 'service2',
        title: 'グループワークショップ',
        description: '少人数グループでカフェキネシの体験やワークショップを開催。仲間と一緒に楽しく学べる講座です。'
      },
      {
        _key: 'service3',
        title: '出張セッション',
        description: '企業や施設への出張セッションも可能。リラックスできる場所でセッションを受けられます。'
      }
    ]
  },
  mapSection: {
    title: '都道府県から探す',
    description: '全国各地にカフェキネシインストラクターがいます。お住まいの地域を選択してください。'
  },
  seo: {
    title: 'インストラクターを探す | Cafe Kinesi',
    description: 'お近くのカフェキネシインストラクターを見つけましょう。キネシオロジーやセラピーを教える経験豊富な認定インストラクターが全国にいます。',
    keywords: 'カフェキネシ, インストラクター, 講師, キネシオロジー, セラピー, 認定講師'
  },
  isActive: true
}

async function seedInstructorPage() {
  try {
    console.log('🚀 インストラクターページデータの投入開始...\n')

    // 既存のinstructorPageドキュメントを確認
    const existing = await client.fetch('*[_type == "instructorPage"][0]')

    if (existing) {
      console.log('⚠️  既にinstructorPageドキュメントが存在します')
      console.log('既存データ:', JSON.stringify(existing, null, 2))
      console.log('\n上書きしますか？ (このスクリプトは強制上書きします)')
      console.log('⏳ 5秒後に上書きします... (Ctrl+C で中止)\n')
      await new Promise(resolve => setTimeout(resolve, 5000))
    }

    console.log('📝 instructorPageドキュメントを作成/更新中...\n')

    // createOrReplaceで作成または更新
    await client.createOrReplace(instructorPageData)

    console.log('=' .repeat(60))
    console.log('✅ インストラクターページデータの投入完了！')
    console.log('='.repeat(60))

    console.log('\n📋 作成されたデータ:')
    console.log('  - Document ID: instructorPage')
    console.log('  - タイトル:', instructorPageData.title)
    console.log('  - ヒーローセクション:', instructorPageData.heroSection.title)
    console.log('  - Aboutセクション:', instructorPageData.aboutSection.title)
    console.log('  - サービス数:', instructorPageData.servicesSection.services.length)
    console.log('  - アクティブ:', instructorPageData.isActive)

    console.log('\n🔗 確認方法:')
    console.log('1. Sanity Studio: http://localhost:3333/')
    console.log('2. 「インストラクターページ設定」を開いて内容を確認')
    console.log('3. WEBページ: https://cafekinesi-nextjs.vercel.app/instructor')
    console.log('\n💡 次のステップ:')
    console.log('1. Sanity Studioでコンテンツを編集')
    console.log('   - ヒーローセクションの背景画像を設定')
    console.log('   - Aboutセクションの画像を設定')
    console.log('   - サービス内容をカスタマイズ')
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
seedInstructorPage()
