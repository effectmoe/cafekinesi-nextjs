// サンプルデータスクリプト
// Sanity Studio UI で手動作成する際の参考データ

export const sampleHomepage = {
  _type: 'homepage',
  title: 'Cafe Kinesi - ホーム',
  hero: {
    title: 'Welcome to Cafe Kinesi',
    subtitle: 'あなたの心と体に優しいカフェ',
    description: '美味しいコーヒーと心地よい空間で、日常の疲れを癒しませんか。',
    backgroundType: 'image',
    // backgroundImage は Studio UI で追加
    textAlignment: 'center',
    buttonText: 'メニューを見る',
    buttonLink: '/menu'
  },
  aboutSection: {
    title: 'About Us',
    subtitle: '私たちについて',
    description: 'Cafe Kinesiは、心と体の健康を大切にするカフェです。厳選されたコーヒー豆と、手作りのスイーツで、お客様に最高のひとときを提供します。',
    // image は Studio UI で追加
  },
  servicesSection: {
    title: 'Our Services',
    subtitle: 'サービス',
    features: [
      {
        title: 'スペシャルティコーヒー',
        description: '世界各地から厳選したコーヒー豆を丁寧に焙煎',
        icon: '☕'
      },
      {
        title: 'ヘルシーメニュー',
        description: '栄養バランスを考えた美味しい食事',
        icon: '🥗'
      },
      {
        title: 'リラックス空間',
        description: '心地よい音楽と落ち着いた雰囲気',
        icon: '🌿'
      }
    ]
  },
  seo: {
    title: 'Cafe Kinesi - ホーム',
    description: 'Cafe Kinesiは心と体に優しいカフェです。スペシャルティコーヒーとヘルシーメニューで、日常の疲れを癒します。',
    keywords: ['カフェ', 'コーヒー', 'ヘルシー', 'リラックス', 'cafe kinesi']
  }
}

export const samplePage = {
  _type: 'page',
  title: 'メニュー',
  slug: { current: 'menu' },
  pageBuilder: [
    {
      _type: 'hero',
      title: 'Our Menu',
      subtitle: 'メニュー',
      description: 'こだわりのメニューをご紹介します',
      backgroundType: 'color',
      backgroundColor: 'primary',
      textAlignment: 'center'
    },
    {
      _type: 'feature',
      title: 'ドリンクメニュー',
      subtitle: 'DRINKS',
      layout: 'grid-2',
      features: [
        {
          title: 'ブレンドコーヒー',
          description: '当店自慢のブレンドコーヒー',
          icon: '☕'
        },
        {
          title: 'エスプレッソ',
          description: '濃厚なエスプレッソ',
          icon: '☕'
        }
      ]
    }
  ],
  seo: {
    title: 'メニュー | Cafe Kinesi',
    description: 'Cafe Kinesiのメニューをご紹介。こだわりのコーヒーと美味しいフードメニューをお楽しみください。'
  }
}

export const sampleSiteSettings = {
  _type: 'siteSettings',
  siteName: 'Cafe Kinesi',
  siteDescription: '心と体に優しいカフェ',
  siteUrl: 'https://cafekinesi-99dc5473.vercel.app',
  navigation: [
    { title: 'ホーム', link: '/' },
    { title: 'メニュー', link: '/menu' },
    { title: 'アバウト', link: '/about' },
    { title: 'ブログ', link: '/blog' }
  ],
  footer: {
    copyright: '© 2024 Cafe Kinesi. All rights reserved.',
    links: [
      { title: 'プライバシーポリシー', link: '/privacy' },
      { title: 'お問い合わせ', link: '/contact' }
    ]
  },
  seo: {
    title: 'Cafe Kinesi',
    description: '心と体に優しいカフェ。スペシャルティコーヒーとヘルシーメニューでリラックスした時間をお過ごしください。',
    keywords: ['カフェ', 'コーヒー', 'ヘルシー', 'リラックス']
  }
}