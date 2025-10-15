#!/usr/bin/env tsx

/**
 * 著者データにダミーデータを追加するスクリプト
 *
 * 使用方法:
 * npx tsx scripts/update-author-dummy-data.ts
 */

import { createClient } from '@sanity/client'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '../.env.local') })

const sanityClient = createClient({
  projectId: 'e4aqw590',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
})

async function updateAuthorDummyData() {
  console.log('\n🔍 既存の著者を検索中...\n')

  try {
    // 既存の著者を全て取得
    const authors = await sanityClient.fetch(
      `*[_type == "author"] {
        _id,
        name,
        slug,
        bio,
        bioLong,
        specialties,
        location,
        socialLinks,
        faq
      }`
    )

    if (authors.length === 0) {
      console.log('❌ 著者が見つかりませんでした。')
      return
    }

    console.log(`📊 見つかった著者: ${authors.length}名\n`)

    // 最初の著者にダミーデータを追加
    const targetAuthor = authors[0]
    console.log(`✅ 対象著者: ${targetAuthor.name}`)
    console.log(`   ID: ${targetAuthor._id}`)
    console.log(`   Slug: ${targetAuthor.slug?.current || 'なし'}\n`)

    // ダミーデータ
    const dummyData = {
      bioLong: `キネシオロジーと出会って15年。多くの方々の心身の健康をサポートしてきました。

キネシオロジーは筋肉反射テストを使い、身体が持つ自然治癒力を高める療法です。ストレス解放や感情のバランス調整に効果があり、初心者の方でも安心して学べます。

これまでに1,000名以上の受講生を指導し、多くの方が講師として独立されています。一人ひとりのペースに合わせた丁寧な指導を心がけています。

「癒やしの力を、すべての人に」をモットーに、日々活動しています。`,

      specialties: [
        'キネシオロジー',
        'ヒーリング',
        'ストレス解放',
        '筋肉反射テスト',
        'エネルギーワーク'
      ],

      location: '東京都',

      socialLinks: {
        website: 'https://cafekinesi.com',
        facebook: 'https://www.facebook.com/cafekinesi',
        instagram: 'https://www.instagram.com/cafekinesi',
        twitter: 'https://twitter.com/cafekinesi',
        youtube: 'https://www.youtube.com/@cafekinesi'
      },

      faq: [
        {
          _type: 'faqItem',
          _key: Math.random().toString(36).substr(2, 9),
          question: 'どのような講座を担当していますか？',
          answer: 'カフェキネシⅠ（基礎講座）、ピーチタッチ（応用講座）などを担当しています。初心者の方から経験者まで、幅広くサポートしています。講座は少人数制で、一人ひとりに合わせた丁寧な指導を心がけています。'
        },
        {
          _type: 'faqItem',
          _key: Math.random().toString(36).substr(2, 9),
          question: '初心者でも受講できますか？',
          answer: 'はい、もちろんです。カフェキネシⅠは初心者向けの基礎講座です。これまでの知識や経験は一切不要で、ゼロから丁寧に指導します。受講生の90%以上が未経験からスタートしています。'
        },
        {
          _type: 'faqItem',
          _key: Math.random().toString(36).substr(2, 9),
          question: 'オンライン受講は可能ですか？',
          answer: '一部の講座はオンライン対応しています。Zoomを使用したリアルタイムレッスンで、対面講座と同じクオリティの指導を提供しています。詳しくはお問い合わせください。'
        },
        {
          _type: 'faqItem',
          _key: Math.random().toString(36).substr(2, 9),
          question: '講座の受講期間はどのくらいですか？',
          answer: '講座によって異なりますが、カフェキネシⅠは全6回、1回3時間、約2〜3ヶ月で修了します。ご自身のペースに合わせて受講スケジュールを調整できます。'
        },
        {
          _type: 'faqItem',
          _key: Math.random().toString(36).substr(2, 9),
          question: '受講後のサポートはありますか？',
          answer: '受講修了後も、フォローアップセッションや復習会を定期的に開催しています。また、卒業生コミュニティでの情報交換や、質問はいつでも受け付けています。'
        },
        {
          _type: 'faqItem',
          _key: Math.random().toString(36).substr(2, 9),
          question: '資格取得は可能ですか？',
          answer: 'カフェキネシⅠ〜Ⅲを修了すると、認定セラピストとして活動できます。さらに上級コースを修了すれば、インストラクター資格も取得可能です。'
        },
        {
          _type: 'faqItem',
          _key: Math.random().toString(36).substr(2, 9),
          question: 'どのような方が受講していますか？',
          answer: '会社員、主婦、医療関係者、セラピスト、教育関係者など、様々なバックグラウンドの方が受講されています。年齢層は20代〜60代まで幅広く、共通しているのは「人の役に立ちたい」という想いです。'
        }
      ]
    }

    console.log('📝 以下のダミーデータを追加します:\n')
    console.log(`詳細プロフィール: ${dummyData.bioLong.substring(0, 50)}...`)
    console.log(`専門分野: ${dummyData.specialties.join(', ')}`)
    console.log(`活動拠点: ${dummyData.location}`)
    console.log(`SNSリンク: ${Object.keys(dummyData.socialLinks).length}個`)
    console.log(`FAQ: ${dummyData.faq.length}件\n`)

    // 確認メッセージ
    console.log('⚠️  この操作は本番データベースを更新します。')
    console.log('📌 対象著者:', targetAuthor.name)
    console.log('📌 ID:', targetAuthor._id)
    console.log('')
    console.log('🔧 データを更新中...\n')

    // データを更新
    await sanityClient
      .patch(targetAuthor._id)
      .set(dummyData)
      .commit()

    console.log('━'.repeat(60))
    console.log('✅ ダミーデータの追加が完了しました！')
    console.log('━'.repeat(60))
    console.log('\n📌 次のステップ:')
    console.log(`   1. 著者ページにアクセス: https://cafekinesi.com/author/${targetAuthor.slug?.current}`)
    console.log('   2. プロフィール詳細セクションが表示されているか確認')
    console.log('   3. 専門分野タグが表示されているか確認')
    console.log('   4. SNSリンクが表示されているか確認')
    console.log('   5. FAQセクションが表示されているか確認')
    console.log('')
    console.log('💡 Sanity Studioでも確認できます:')
    console.log('   https://cafekinesi.sanity.studio')
    console.log('')

  } catch (error) {
    console.error('❌ エラーが発生しました:', error)
  }
}

// スクリプト実行
updateAuthorDummyData()
