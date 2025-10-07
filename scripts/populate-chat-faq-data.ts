import { createClient } from '@sanity/client'

const token = process.env.SANITY_API_TOKEN

if (!token) {
  console.error('❌ SANITY_API_TOKENが設定されていません')
  console.log('\n📝 トークンの取得方法:')
  console.log('1. https://www.sanity.io/manage にアクセス')
  console.log('2. プロジェクト "Cafe Kinesi" を選択')
  console.log('3. API → Tokens → Add API token')
  console.log('4. 名前: "Data Import", 権限: "Editor" で作成')
  console.log('5. 生成されたトークンを以下のように実行:')
  console.log('   SANITY_API_TOKEN=your_token_here npm run populate-chat-faq')
  process.exit(1)
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'e4aqw590',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

async function populateFAQCards() {
  console.log('📝 FAQカードデータを投入中...')

  const faqCardsData = [
    {
      _type: 'faqCard',
      _id: 'faq-1',
      title: '営業時間を教えて',
      icon: 'Clock',
      bgColor: 'bg-[hsl(35,22%,91%)]',
      iconColor: 'text-[hsl(35,45%,45%)]',
      order: 0,
      isActive: true
    },
    {
      _type: 'faqCard',
      _id: 'faq-2',
      title: 'アクセス方法は？',
      icon: 'Navigation',
      bgColor: 'bg-[hsl(210,20%,88%)]',
      iconColor: 'text-[hsl(35,45%,45%)]',
      order: 1,
      isActive: true
    },
    {
      _type: 'faqCard',
      _id: 'faq-3',
      title: 'おすすめメニュー',
      icon: 'Coffee',
      bgColor: 'bg-[hsl(260,15%,88%)]',
      iconColor: 'text-[hsl(35,45%,45%)]',
      order: 2,
      isActive: true
    },
    {
      _type: 'faqCard',
      _id: 'faq-4',
      title: '予約について',
      icon: 'CalendarCheck',
      bgColor: 'bg-[hsl(0,0%,91%)]',
      iconColor: 'text-[hsl(35,45%,45%)]',
      order: 3,
      isActive: true
    }
  ]

  try {
    // 各FAQカードを作成または更新
    for (const faqCard of faqCardsData) {
      await client.createOrReplace(faqCard)
      console.log(`✅ FAQカード "${faqCard.title}" を投入完了`)
    }
    console.log('✅ すべてのFAQカードデータを投入完了')
  } catch (error) {
    console.error('❌ FAQカードデータ投入エラー:', error)
  }
}

async function populateChatConfiguration() {
  console.log('📝 チャット設定データを投入中...')

  const chatConfigData = {
    _type: 'chatConfiguration',
    _id: 'chatConfiguration',
    title: 'Cafe Kinesi へようこそ',
    subtitle: '何かお探しですか？AIアシスタントがお答えします',
    headerTitle: 'AIチャットアシスタント',
    headerSubtitle: '24時間いつでもお答えします',
    inputPlaceholder: 'メッセージを入力...',
    footerMessage: 'セキュア接続・プライバシー保護・会話は保存されません',
    welcomeMessage: 'こんにちは！Cafe Kinesiへようこそ☕ カフェについて何でもお尋ねください。',
    quickQuestions: [
      {
        _key: 'quick1',
        text: '営業時間を教えて',
        order: 0,
        isActive: true
      },
      {
        _key: 'quick2',
        text: 'アクセス方法は？',
        order: 1,
        isActive: true
      },
      {
        _key: 'quick3',
        text: 'おすすめメニュー',
        order: 2,
        isActive: true
      },
      {
        _key: 'quick4',
        text: '予約について',
        order: 3,
        isActive: true
      }
    ],
    colorScheme: {
      primary: 'hsl(35,45%,45%)',
      secondary: 'hsl(35,25%,95%)',
      accent: 'hsl(260,30%,70%)',
      background: 'hsl(35,25%,95%)'
    },
    isActive: true
  }

  try {
    await client.createOrReplace(chatConfigData)
    console.log('✅ チャット設定データを投入完了')
  } catch (error) {
    console.error('❌ チャット設定データ投入エラー:', error)
  }
}

async function main() {
  console.log('🚀 チャット・FAQ データ投入を開始...\n')

  try {
    await populateFAQCards()
    console.log('')
    await populateChatConfiguration()
    console.log('\n✨ すべてのチャット・FAQデータ投入が完了しました！')
  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error)
    process.exit(1)
  }
}

main()