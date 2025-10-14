import { getCliClient } from 'sanity/cli'

const client = getCliClient()

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
            text: 'ピーチタッチの基礎を学ぶ講座です。初心者の方でも安心してご参加いただけます。',
            marks: []
          }
        ],
        markDefs: [],
        style: 'normal'
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
            text: 'チャクラキネシの実践的なテクニックを学びます。経験者向けの内容です。',
            marks: []
          }
        ],
        markDefs: [],
        style: 'normal'
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
            text: 'オーラリーディングの基礎を学ぶ入門講座です。',
            marks: []
          }
        ],
        markDefs: [],
        style: 'normal'
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

async function createEvents() {
  console.log('🎯 テストイベントを作成します...\n')

  for (const event of events) {
    try {
      console.log(`📝 作成中: ${event.title}`)
      const result = await client.create(event)
      console.log(`✅ 作成完了: ${result._id}`)
    } catch (error) {
      console.error(`❌ エラー: ${event.title}`, error.message)
    }
  }

  console.log('\n🎉 すべてのテストイベントの作成が完了しました！')
  console.log('📅 カレンダーページで確認してください: https://www.cafekinesi.com/calendar')
}

createEvents()
