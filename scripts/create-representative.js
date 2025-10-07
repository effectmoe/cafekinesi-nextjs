#!/usr/bin/env node

const { createClient } = require('@sanity/client')
require('dotenv').config({ path: '.env.local' })

const client = createClient({
  projectId: 'e4aqw590',
  dataset: 'production',
  apiVersion: '2023-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

async function createRepresentative() {
  console.log('代表者データを作成中...')

  const representativeData = {
    _id: 'representative-yukari-hoshi',
    _type: 'representative',
    name: '星 ユカリ',
    englishName: 'Yukari Hoshi',
    birthName: '吉川 由香里',
    title: 'カフェキネシ創業者',
    location: '長野県茅野市',
    biography: [
      {
        _type: 'block',
        _key: 'bio1',
        children: [
          {
            _type: 'span',
            _key: 'span1',
            text: 'カフェキネシ創業者。キネシオロジーとアロマテラピーを融合させた独自のセラピー手法を開発。',
            marks: []
          }
        ],
        style: 'normal'
      },
      {
        _type: 'block',
        _key: 'bio2',
        children: [
          {
            _type: 'span',
            _key: 'span2',
            text: '20代からハーブ栽培を独学で学び、アフリカへの旅を経て地球と自然への深い理解を得る。',
            marks: []
          }
        ],
        style: 'normal'
      },
      {
        _type: 'block',
        _key: 'bio3',
        children: [
          {
            _type: 'span',
            _key: 'span3',
            text: 'ホンマドクターの下でキネシオロジーを学び、ブラッシュフィーリングやフラワーエッセンスなど様々なヒーリング手法を習得。',
            marks: []
          }
        ],
        style: 'normal'
      }
    ],
    qualifications: [
      'キネシオロジーセラピスト',
      'アロマテラピスト',
      'Little Tree セミナー主催者',
      'Peach Touch インストラクター'
    ],
    services: [
      'Little Tree セミナー開催',
      'カフェキネシ講座',
      'ピーチタッチ講座',
      'キネシオロジーセッション',
      '個人カウンセリング'
    ],
    philosophy: '「必要なのはあなたの愛とあなたの手」という理念のもと、誰もがセラピストになれる世界を目指しています。シンプルで効果的、そして楽しみながらできるセラピーを通じて、世界中の人々がストレスから解放される社会を創りたいと考えています。',
    message: 'カフェキネシは、2010年から始まった私の夢の結晶です。キネシオロジーをもっとフェアに、簡単に、楽しくできるようにしたい。その思いから生まれました。わずか2時間の講座で、あなたも大切な人を癒せるようになります。一緒に優しい世界を創っていきませんか？',
    slug: {
      _type: 'slug',
      current: 'yukari-hoshi'
    },
    publishedAt: new Date().toISOString()
  }

  try {
    // 既存のドキュメントをチェック
    const existing = await client.fetch(`*[_type == "representative" && _id == $id][0]`, {
      id: representativeData._id
    })

    let result
    if (existing) {
      // 更新
      result = await client
        .patch(representativeData._id)
        .set(representativeData)
        .commit()
      console.log('✅ 代表者データを更新しました')
    } else {
      // 新規作成
      result = await client.create(representativeData)
      console.log('✅ 代表者データを作成しました')
    }

    console.log('代表者:', result.name)
    console.log('役職:', result.title)
    console.log('所在地:', result.location)

    return result
  } catch (error) {
    console.error('❌ エラー:', error)
    throw error
  }
}

// 実行
if (require.main === module) {
  createRepresentative()
    .then(() => {
      console.log('✨ 完了しました')
      process.exit(0)
    })
    .catch((error) => {
      console.error('エラー:', error)
      process.exit(1)
    })
}

module.exports = { createRepresentative }