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

// アメリカのインストラクター
const americaInstructor = {
  _type: 'instructor',
  _id: 'instructor-america-hsk',
  name: 'HSK Kinesiology',
  slug: { _type: 'slug', current: 'hsk-kinesiology' },
  title: 'BESTカイロプラクティック',
  bio: 'カフェキネシⅠ、カフェキネシⅡピーチタッチ、カフェキネシⅢチャクラキネシを始め、ナビゲーションセミナーやキネシオロジースタンダードもロサンゼルスにて開催しております。またDEEP2ミは1年を通して定期的に開催しており、キネシングアプログラムはいつでもお申し込み可能です。',
  profileDetails: [
    {
      _type: 'block',
      _key: 'block1',
      children: [
        {
          _type: 'span',
          _key: 'span1',
          text: 'ぜひ環境を一度変えてみて、ロサンゼルスのお天気や観光地を楽しみながら、キネシオロジーを学びながら自分を癒しませんか？',
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
          text: '詳細についてはサイトの方からご覧下さい。その質問のある方は遠慮なくkinesi@hskservice.comまたはお問い合わせフォームからご連絡下さい。',
          marks: []
        }
      ],
      markDefs: [],
      style: 'normal'
    }
  ],
  region: 'アメリカ',
  specialties: ['カフェキネシⅠ', 'ピーチタッチ', 'チャクラキネシ', 'HELP', 'TAO', 'ナビゲーター', 'キネシスタンダード'],
  email: 'kinesi@hskservice.com',
  website: 'http://www.kinesi.us/',
  order: 1000,
  isActive: true,
  featured: false,
}

// ヨーロッパのインストラクター
const europeInstructor = {
  _type: 'instructor',
  _id: 'instructor-europe-harmony-light',
  name: 'Harmony Light',
  slug: { _type: 'slug', current: 'harmony-light' },
  title: 'ハーモニー・ライト',
  bio: '心と体にハーモニーを取り戻し、あなたが持つ本来の光を輝かせたら、どんなに幸せな気持ちになることでしょう。自然豊かなスイスのチューリッヒとの衛星都市、ヴィンタートゥールという街でセラピーをしています。',
  profileDetails: [
    {
      _type: 'block',
      _key: 'block1',
      children: [
        {
          _type: 'span',
          _key: 'span1',
          text: 'スイス連邦チューリッヒ県ヴィンタートゥール（Winterthur）市を拠点に活動しています。',
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
          text: 'リトル・トリーのアロマをはじめ、音叉、タッチフォーヘルスなど、あなたにあった手法で心を少しずつ解放するお手伝いをいたします。遠方の方にはスカイプでもセッションもいたしております。',
          marks: []
        }
      ],
      markDefs: [],
      style: 'normal'
    }
  ],
  region: 'ヨーロッパ',
  specialties: ['カフェキネシ', 'ピーチタッチ', 'チャクラキネシ'],
  website: 'https://harmonylight.ch/',
  order: 1001,
  isActive: true,
  featured: false,
}

async function seedOverseasInstructors() {
  try {
    console.log('🌏 海外インストラクターデータの投入開始...\n')

    // アメリカのインストラクターを登録
    console.log('🇺🇸 アメリカのインストラクターを登録中...')
    await client.createOrReplace(americaInstructor)
    console.log('✅ HSK Kinesiology を登録しました\n')

    // ヨーロッパのインストラクターを登録
    console.log('🇪🇺 ヨーロッパのインストラクターを登録中...')
    await client.createOrReplace(europeInstructor)
    console.log('✅ Harmony Light を登録しました\n')

    console.log('=' .repeat(60))
    console.log('✅ 海外インストラクターデータの投入完了！')
    console.log('='.repeat(60))

    console.log('\n📋 登録されたインストラクター:')
    console.log('  🇺🇸 アメリカ: HSK Kinesiology (BESTカイロプラクティック)')
    console.log('  🇪🇺 ヨーロッパ: Harmony Light (ハーモニー・ライト)')

    console.log('\n🔗 確認方法:')
    console.log('1. Sanity Studio: https://cafekinesi.sanity.studio/')
    console.log('2. 「インストラクター」から登録内容を確認')
    console.log('3. WEBページ: https://cafekinesi-nextjs.vercel.app/instructor')
    console.log('   「🌏 海外から選ぶ」タブをクリックして確認')

    console.log('\n💡 次のステップ:')
    console.log('1. Sanity Studioで画像を追加')
    console.log('2. 必要に応じて内容を編集')
    console.log('3. 「Publish」をクリックして公開')

  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error)
    if (error instanceof Error) {
      console.error('エラーメッセージ:', error.message)
    }
  }
}

// スクリプトを実行
seedOverseasInstructors()
