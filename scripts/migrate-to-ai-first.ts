#!/usr/bin/env npx tsx

import { createClient } from '@sanity/client'
import { config } from 'dotenv'

config({ path: '.env.local' })

const client = createClient({
  projectId: 'e4aqw590',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
})

/**
 * AI-Firstマイグレーションスクリプト
 * 既存のデータからPersonエンティティを自動生成
 */

async function migrateToAIFirst() {
  console.log('🚀 AI-First構造への移行開始...')

  const persons: any[] = []

  // 1. ProfilePage（代表者）からPerson作成
  console.log('\n📍 代表者情報を取得中...')
  const profile = await client.fetch(`*[_type == "profilePage"][0]`)

  if (profile?.profileSection) {
    const representativePerson = {
      _id: 'person-yukari-hoshi',
      _type: 'person',
      name: profile.profileSection.name || '星 ユカリ',
      roles: ['representative', 'founder', 'instructor'],
      primaryRole: '代表者・創業者',

      // AI検索最適化
      aiSearchKeywords: [
        '代表', '代表者', '創業者', '創始者', 'founder', 'CEO',
        '星', 'ユカリ', '星ユカリ', 'yukari', 'hoshi',
        'カフェキネシ代表', 'カフェキネシ創業者',
        'どんな人', '誰が作った', '設立者'
      ],

      aiContext: {
        commonQuestions: [
          '代表者はどんな人ですか？',
          '創業者について教えて',
          'カフェキネシは誰が作ったの？',
          '星ユカリさんについて'
        ],
        responseTemplate: 'Cafe Kinesiの代表者は星ユカリさんです。2010年にカフェキネシを創業し、誰もがセラピストになれる世界を目指しています。'
      },

      aiPriority: 10, // 最高優先度

      profile: {
        birthName: profile.profileSection.nameReading || 'ヨシカワ ユカリ',
        location: profile.profileSection.location || '長野県茅野市在住',
        specialties: ['キネシオロジー', 'アロマテラピー', 'カフェキネシ', 'ピーチタッチ'],
        qualifications: [
          'キネシオロジーセラピスト',
          'アロマテラピスト',
          'Little Tree セミナー主催者'
        ],
        philosophy: '必要なのはあなたの愛とあなたの手。誰もがセラピストになれる世界を創りたい。',
        message: 'カフェキネシは2010年から始まった私の夢の結晶です。'
      },

      activities: profile.activitiesItems?.map((item: any) => ({
        title: item.title,
        description: '',
        isActive: true
      })) || [],

      isActive: true
    }

    persons.push(representativePerson)
    console.log('✅ 代表者Person作成: 星ユカリ')
  }

  // 2. Instructor（インストラクター）からPerson作成
  console.log('\n📍 インストラクター情報を取得中...')
  const instructors = await client.fetch(`*[_type == "instructor"]`)

  for (const instructor of instructors) {
    const instructorPerson = {
      _id: `person-instructor-${instructor._id}`,
      _type: 'person',
      name: instructor.name,
      roles: ['instructor'],
      primaryRole: 'インストラクター',

      // AI検索最適化
      aiSearchKeywords: [
        'インストラクター', '講師', '先生',
        instructor.name,
        ...(instructor.specialties || [])
      ],

      aiContext: {
        commonQuestions: [
          `${instructor.name}さんについて教えて`,
          `${instructor.location}のインストラクターは？`
        ],
        responseTemplate: `${instructor.name}さんは、${instructor.location || ''}で活動するCafe Kinesiインストラクターです。`
      },

      aiPriority: 5,

      profile: {
        location: instructor.location,
        specialties: instructor.specialties,
        qualifications: [],
        biography: instructor.experience,
        philosophy: '',
        message: instructor.description
      },

      isActive: true
    }

    persons.push(instructorPerson)
    console.log(`✅ インストラクターPerson作成: ${instructor.name}`)
  }

  // 3. Author（著者）からPerson作成
  console.log('\n📍 著者情報を取得中...')
  const authors = await client.fetch(`*[_type == "author"]`)

  for (const author of authors) {
    // Tony以外の著者のみ（Tonyは重複を避ける）
    if (!author.name?.includes('Tony')) {
      const authorPerson = {
        _id: `person-author-${author._id}`,
        _type: 'person',
        name: author.name,
        roles: ['author'],
        primaryRole: '著者',

        aiSearchKeywords: [
          '著者', 'ライター',
          author.name
        ],

        aiPriority: 3,

        profile: {
          biography: author.bio
        },

        isActive: true
      }

      persons.push(authorPerson)
      console.log(`✅ 著者Person作成: ${author.name}`)
    }
  }

  // 4. Cafe Kinesi組織エンティティを作成
  console.log('\n📍 組織情報を作成中...')
  const organization = {
    _id: 'organization-cafe-kinesi',
    _type: 'organization',
    name: 'Cafe Kinesi',
    tagline: 'だれでもどこでも簡単にできるキネシオロジーとアロマを使った健康法',
    established: '2010年',

    aiSearchKeywords: [
      'カフェキネシ', 'Cafe Kinesi', 'cafekinesi',
      '会社', '組織', 'どんな会社', 'どんな組織'
    ],

    aiElevatorPitch: 'カフェキネシは、誰でも2時間でインストラクターになれる、キネシオロジーとアロマを使った世界最速のセラピーです。',

    mission: '誰もがセラピストになれる世界を創る',
    vision: '世界中の人々がストレスから解放され、自分らしく生きられる社会',
    values: [
      'シンプルで効果的',
      '楽しみながらできる',
      '誰でもできる'
    ],

    history: [
      { year: '2010年2月', event: 'カフェキネシの取り組み開始' },
      { year: '2011年2月', event: '正式発表' }
    ],

    achievements: [
      '世界中にインストラクター展開',
      '2時間でインストラクター養成',
      '5つのシリーズ展開'
    ],

    isActive: true
  }

  // 結果を表示
  console.log('\n========== 移行サマリー ==========')
  console.log(`✅ Person エンティティ: ${persons.length}件`)
  console.log(`✅ Organization エンティティ: 1件`)
  console.log('\n移行データ:')
  persons.forEach(p => {
    console.log(`  - ${p.name} (${p.primaryRole}) 優先度: ${p.aiPriority}`)
  })

  // 実際のデータ作成
  console.log('\n🔥 実際のデータを作成中...')

  // Personデータを作成
  for (const person of persons) {
    try {
      await client.create(person)
      console.log(`✅ Created: ${person.name}`)
    } catch (error) {
      console.error(`❌ Failed: ${person.name}`, error)
    }
  }

  // Organizationを作成
  try {
    await client.create(organization)
    console.log(`✅ Created: Cafe Kinesi Organization`)
  } catch (error) {
    console.error(`❌ Failed: Organization`, error)
  }

  console.log('\n========== 次のステップ ==========')
  console.log('1. npx sanity deploy でスキーマをデプロイ')
  console.log('2. Sanity Studioで新しいPersonエンティティを確認')
  console.log('3. 手動で確認後、このスクリプトのコメントを解除して実行')
  console.log('4. 既存のprofilePage、instructor、authorは段階的に廃止')
}

// 実行
migrateToAIFirst()
  .then(() => {
    console.log('\n✨ 移行準備完了')
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ エラー:', error)
    process.exit(1)
  })