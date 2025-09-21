import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'e4aqw590',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const homepageData = {
  _id: 'homepage',
  _type: 'homepage',
  title: 'Cafe Kinesi',
  sections: [
    {
      _key: 'hero-section',
      _type: 'hero',
      heading: '心と体を癒す空間へようこそ',
      subheading: 'アロマテラピーとキネシオロジーが融合した新しい体験',
      backgroundImage: null, // 後で画像を追加可能
      cta: {
        _type: 'cta',
        text: '詳しく見る',
        link: '/about',
      },
    },
    {
      _key: 'features-section',
      _type: 'featuresSection',
      title: '私たちの特徴',
      features: [
        {
          _key: 'feature-1',
          _type: 'feature',
          title: 'アロマテラピー',
          description: '厳選された精油を使用した本格的なアロマセラピー',
          icon: '🌿',
        },
        {
          _key: 'feature-2',
          _type: 'feature',
          title: 'キネシオロジー',
          description: '身体の声を聴く、筋肉反射テスト',
          icon: '💪',
        },
        {
          _key: 'feature-3',
          _type: 'feature',
          title: 'オーガニックカフェ',
          description: '体に優しい有機食材を使用したメニュー',
          icon: '☕',
        },
      ],
    },
  ],
  seo: {
    _type: 'seo',
    title: 'Cafe Kinesi - 心と体を癒すアロマテラピーカフェ',
    description: 'アロマテラピーとキネシオロジーが融合した癒しの空間。オーガニック食材を使用したカフェメニューもご用意。',
    keywords: 'アロマテラピー, キネシオロジー, オーガニックカフェ, 癒し, リラクゼーション',
  },
}

async function createHomepage() {
  try {
    console.log('🚀 ホームページドキュメントを作成中...')

    // 既存のホームページドキュメントを確認
    const existing = await client.getDocument('homepage')

    if (existing) {
      console.log('⚠️ ホームページドキュメントは既に存在しています')
      console.log('📝 既存のドキュメントID:', existing._id)
      return
    }

    // 新規作成
    const result = await client.createOrReplace(homepageData)
    console.log('✅ ホームページドキュメントを作成しました！')
    console.log('📝 ドキュメントID:', result._id)
    console.log('🌐 サイトをリロードして確認してください:')
    console.log('   - ローカル: http://localhost:3002')
    console.log('   - 本番: https://cafekinesi-nextjs-gbhkmm5yu-effectmoes-projects.vercel.app')
  } catch (error) {
    if (error.message?.includes('token')) {
      console.error('❌ エラー: Sanity API トークンが必要です')
      console.log('\n以下の手順でトークンを作成してください:')
      console.log('1. https://www.sanity.io/manage にアクセス')
      console.log('2. プロジェクト "cafekinesi" を選択')
      console.log('3. API → Tokens → Add API token')
      console.log('4. Name: "Create Homepage", Permissions: Editor')
      console.log('5. トークンをコピー')
      console.log('6. 以下のコマンドを実行:')
      console.log('   SANITY_API_TOKEN="your-token-here" node scripts/create-homepage-data.mjs')
    } else {
      console.error('❌ エラー:', error.message)
    }
  }
}

createHomepage()