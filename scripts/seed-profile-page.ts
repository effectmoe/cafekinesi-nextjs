import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_WRITE_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function uploadImage(imagePath: string) {
  console.log(`📸 Uploading image: ${imagePath}`)

  try {
    const imageBuffer = fs.readFileSync(imagePath)
    const asset = await client.assets.upload('image', imageBuffer, {
      filename: path.basename(imagePath),
    })

    console.log(`✅ Image uploaded: ${asset._id}`)
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    }
  } catch (error) {
    console.error(`❌ Failed to upload image:`, error)
    return null
  }
}

async function seedProfilePage() {
  console.log('🌱 Seeding profile page data...\n')

  try {
    // 画像をアップロード
    const imagePath = '/Users/tonychustudio/Desktop/hoshiyukari-DodUAT3u.jpg'
    const profilePhoto = await uploadImage(imagePath)

    if (!profilePhoto) {
      throw new Error('Failed to upload profile photo')
    }

    // プロフィールページデータ
    const profilePageData = {
      _type: 'profilePage',
      _id: 'profilePage',
      title: 'プロフィール',
      profileSection: {
        photo: profilePhoto,
        name: '星 ユカリ',
        nameReading: 'ヨシカワ ユカリ',
        location: '長野県茅野市在住',
      },
      historyTitle: 'これまでの歩み',
      historyItems: [
        {
          text: '初任給でした事は、イルカとクジラの保護団体へ寄付をした事',
          order: 1,
        },
        {
          text: '20代で独学でハーブを畑や庭やベランダに溢れるほど栽培する',
          order: 2,
        },
        {
          text: 'アロマテラピーにも興味を持つ',
          order: 3,
        },
        {
          text: 'リトルトリーというネイティブアメリカンの本を読み',
          order: 4,
        },
        {
          text: '自然と共に暮らす喜びに共鳴し、アフリカの旅で地球の重さを感じるようになる',
          order: 5,
        },
        {
          text: '日本の禅を学び、グリーンピースの活動をしていた隣人のフランス人の友人から、',
          order: 6,
        },
        {
          text: 'ハーブ・アロマ・精神世界・フェルデンクライスなどを一緒に遊びながら教わる',
          order: 7,
        },
        {
          text: 'その後、豊科ハーバルノートの飯嶋エリコさんに出逢い',
          order: 8,
        },
        {
          text: '豊科に通い続けて、アロマテラピーやハーブ植物への愛、ボランティア活動などを学ぶ',
          order: 9,
        },
        {
          text: '水処刑施設たったの２つの大好きな事を組み合わせたらキャッシュ好きな大人好きになる',
          order: 10,
        },
        {
          text: '仕事は大好きな営業職に従事し、天職だと思い居場所だと感じます',
          order: 11,
        },
        {
          text: 'メイク・ア・ウィッシュというボランティア活動を知り',
          order: 12,
        },
        {
          text: 'こども病院へ、イルミネーションを行け',
          order: 13,
        },
        {
          text: '仕事もやりがいと感じるようになってどこそこやったところ何らかの形でドクター本間のキネシオロジーに出逢う',
          order: 14,
        },
        {
          text: 'その後、ブラッシビーリングやフラワーエッセンスに出逢い、ヒーリングの世界を知る',
          order: 15,
        },
        {
          text: 'ジュン・シー先生のセミナーに参加し、ドクター本間のキネシオロジーのセッションを受けて施術になる',
          order: 16,
        },
        {
          text: '純文やマッサージの勉強を積んで、アスレチックトレーナーの勉強提案をする',
          order: 17,
        },
        {
          text: '現役市町村、農民党市町の勉強を通じ、ドクター本間を訪ねる',
          order: 18,
        },
        {
          text: 'その後、ドクター本間のDEEPばかり参加し最後頃にプロフェッショナルズビーチサイザヤや徴候検をつくる',
          order: 19,
        },
        {
          text: '周波不周波の勉強を通り、その感情嫌 リトルトリーを発見',
          order: 20,
        },
        {
          text: '助成でアロマテラピーを伝える裏題材がいた私、先生の伝える画を知り出しましたが紺野',
          order: 21,
        },
        {
          text: 'ロサンゼルスで開催されたタッチフォーヘルスのマスター先生の手で、',
          order: 22,
        },
        {
          text: 'シルビア・レイチェルさんのセッションを受け、最新紙を経は黙になる',
          order: 23,
        },
        {
          text: '現在リトルトリーセミナーの主催、カフェキネシやピーチタッチの講師として活動しています。',
          order: 24,
        },
        {
          text: 'キネシオロジーのセッション、リトルトリーのプロで昔の問題、古紋や実効実効なども行われているています',
          order: 25,
        },
      ],
      activitiesTitle: '現在の活動',
      activitiesDescription: 'リトルトリーセミナーの主催、カフェキネシやピーチタッチの講師として活動しています。',
      activitiesItems: [
        { title: 'リトルトリーセミナー主催', order: 1 },
        { title: 'カフェキネシ講座', order: 2 },
        { title: 'ピーチタッチ講座', order: 3 },
        { title: 'リトルトリー講習室', order: 4 },
        { title: '純文マッサージ講座', order: 5 },
        { title: 'キネシオロジーセッション', order: 6 },
        { title: 'リトルトリーのプロで昔の問題', order: 7 },
        { title: '中倫や実効実効', order: 8 },
      ],
      seo: {
        title: 'プロフィール | Cafe Kinesi',
        description: 'カフェキネシ創始者 星 ユカリのプロフィールをご紹介します。',
        keywords: 'カフェキネシ, 星ユカリ, プロフィール, キネシオロジー',
      },
      isActive: true,
    }

    console.log('📝 Creating profile page document...')

    // 既存のドキュメントがあれば削除
    const existing = await client.fetch('*[_id == "profilePage"][0]')
    if (existing) {
      console.log('🗑️  Deleting existing profile page...')
      await client.delete('profilePage')
    }

    // 新しいドキュメントを作成
    const result = await client.create(profilePageData)

    console.log('✅ Profile page created successfully!')
    console.log(`   Document ID: ${result._id}`)
    console.log(`   Title: ${result.title}`)
    console.log(`   Name: ${result.profileSection.name}`)
    console.log(`   History items: ${result.historyItems.length}`)
    console.log(`   Activity items: ${result.activitiesItems.length}`)

  } catch (error) {
    console.error('❌ Error seeding profile page:', error)
  }
}

seedProfilePage()
