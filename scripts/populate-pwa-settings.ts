import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'e4aqw590',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
});

async function populatePWASettings() {
  console.log('🚀 PWA設定をSanityに登録します...');

  try {
    // 既存のPWA設定を確認
    const existingSettings = await client.fetch('*[_type == "pwaSettings"][0]');

    if (existingSettings) {
      console.log('⚠️  既にPWA設定が存在します。');
      console.log('Sanityダッシュボードで直接編集してください。');
      console.log('https://cafekinesi.sanity.studio/structure/pwaSettings');
      return;
    }

    // デフォルトのPWA設定を作成
    const pwaSettings = {
      _type: 'pwaSettings',
      _id: 'pwaSettings', // シングルトンとして固定ID
      basicSettings: {
        name: 'カフェキネシ',
        shortName: 'カフェキネシ',
        description:
          'カフェキネシオロジーは、誰でも気軽に学べるヒーリング技術です。キネシオロジーの基礎から応用まで、段階的に学べる講座を全国で開講中。',
        startUrl: '/',
      },
      designSettings: {
        themeColor: '#8B7355',
        backgroundColor: '#ffffff',
        displayMode: 'standalone',
      },
      icons: {
        // アイコンは既にpublic/pwa-icon-*.pngが存在するため、
        // Sanityにアップロードする必要はありません
        // 必要に応じてSanityダッシュボードから画像をアップロードできます
      },
      shortcuts: [
        {
          _key: 'calendar',
          name: 'イベント一覧',
          shortName: 'イベント',
          description: '開催予定のイベントを確認',
          url: '/calendar',
        },
        {
          _key: 'faq',
          name: 'FAQ',
          shortName: 'FAQ',
          description: 'よくある質問',
          url: '/faq',
        },
      ],
      advancedSettings: {
        categories: ['education', 'lifestyle', 'health'],
        lang: 'ja',
        dir: 'ltr',
        scope: '/',
      },
    };

    // Sanityに作成
    const result = await client.create(pwaSettings);

    console.log('✅ PWA設定を正常に作成しました！');
    console.log('📱 Sanityダッシュボードで編集できます：');
    console.log('https://cafekinesi.sanity.studio/structure/pwaSettings');
    console.log('\n設定内容:');
    console.log(`- アプリ名: ${pwaSettings.basicSettings.name}`);
    console.log(`- 短縮名: ${pwaSettings.basicSettings.shortName}`);
    console.log(`- テーマカラー: ${pwaSettings.designSettings.themeColor}`);
    console.log(`- 表示モード: ${pwaSettings.designSettings.displayMode}`);
    console.log(`- ショートカット数: ${pwaSettings.shortcuts.length}個`);
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

populatePWASettings();
