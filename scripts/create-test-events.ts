import { createClient } from '@sanity/client'

// スクリプト専用のSanityクライアント
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'e4aqw590',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
})

async function createTestEvents() {
  console.log('🎯 テストイベントを作成します...')

  // 10月のイベントを3件作成
  const events = [
    {
      _type: 'event',
      title: 'ピーチタッチ基礎講座',
      slug: {
        _type: 'slug',
        current: 'peach-touch-basic-2025-10-15'
      },
      startDate: '2025-10-15T10:00:00.000Z',
      endDate: '2025-10-15T12:00:00.000Z',
      location: 'オンライン',
      description: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'ピーチタッチの基礎を学ぶ講座です。初心者の方でも安心してご参加いただけます。'
            }
          ]
        }
      ],
      status: 'open',
      category: 'course',
      capacity: 5,
      currentParticipants: 2,
      fee: 5000,
      useForAI: true,
    },
    {
      _type: 'event',
      title: 'チャクラキネシ実践',
      slug: {
        _type: 'slug',
        current: 'chakra-kinesi-practice-2025-10-20'
      },
      startDate: '2025-10-20T14:00:00.000Z',
      endDate: '2025-10-20T16:00:00.000Z',
      location: '東京都渋谷区',
      description: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'チャクラキネシの実践的なテクニックを学びます。'
            }
          ]
        }
      ],
      status: 'open',
      category: 'workshop',
      capacity: 10,
      currentParticipants: 3,
      fee: 8000,
      useForAI: true,
    },
    {
      _type: 'event',
      title: 'ハッピーオーラス入門',
      slug: {
        _type: 'slug',
        current: 'happy-auras-intro-2025-10-25'
      },
      startDate: '2025-10-25T10:00:00.000Z',
      endDate: '2025-10-25T12:00:00.000Z',
      location: 'オンライン',
      description: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'オーラリーディングの基礎を学ぶ入門講座です。'
            }
          ]
        }
      ],
      status: 'full',
      category: 'information',
      capacity: 8,
      currentParticipants: 8,
      fee: 3000,
      useForAI: true,
    }
  ]

  try {
    for (const event of events) {
      console.log(`\n📝 作成中: ${event.title}`)
      const result = await writeClient.create(event)
      console.log(`✅ 作成完了: ${result._id}`)
    }

    console.log('\n🎉 すべてのテストイベントの作成が完了しました！')
    console.log('\n📅 作成されたイベント:')
    events.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title} - ${new Date(event.startDate).toLocaleDateString('ja-JP')} (${event.status === 'open' ? '受付中' : '満席'})`)
    })
  } catch (error) {
    console.error('❌ エラーが発生しました:', error)
  }
}

createTestEvents()
