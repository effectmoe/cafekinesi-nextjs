#!/usr/bin/env tsx

/**
 * 著者データにPhase 2のダミーデータを追加するスクリプト
 *
 * 使用方法:
 * npx tsx scripts/update-author-phase2-data.ts
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

async function updateAuthorPhase2Data() {
  console.log('\n🔍 既存の著者を検索中...\n')

  try {
    // 既存の著者を全て取得
    const authors = await sanityClient.fetch(
      `*[_type == "author"] {
        _id,
        name,
        slug
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

    // Phase 2 ダミーデータ
    const phase2Data = {
      // 資格・認定証
      credentials: [
        {
          _type: 'credential',
          _key: Math.random().toString(36).substr(2, 9),
          title: '国際キネシオロジー協会認定インストラクター',
          issuer: '国際キネシオロジー協会',
          year: 2010,
          url: 'https://cafekinesi.com'
        },
        {
          _type: 'credential',
          _key: Math.random().toString(36).substr(2, 9),
          title: 'タッチフォーヘルス公式インストラクター',
          issuer: 'タッチフォーヘルス国際協会',
          year: 2012
        },
        {
          _type: 'credential',
          _key: Math.random().toString(36).substr(2, 9),
          title: 'ピーチタッチ認定マスター',
          issuer: '日本キネシオロジー協会',
          year: 2015,
          url: 'https://cafekinesi.com'
        },
        {
          _type: 'credential',
          _key: Math.random().toString(36).substr(2, 9),
          title: 'エネルギーヒーリング認定セラピスト',
          issuer: '日本ヒーリング協会',
          year: 2013
        }
      ],

      // 受賞歴
      awards: [
        {
          _type: 'award',
          _key: Math.random().toString(36).substr(2, 9),
          title: '2020年度 ベストセラピスト賞',
          organization: '日本キネシオロジー協会',
          year: 2020,
          description: '年間最優秀セラピストとして、受講生満足度・活動実績・社会貢献の3部門で高評価を獲得しました。'
        },
        {
          _type: 'award',
          _key: Math.random().toString(36).substr(2, 9),
          title: '指導者功労賞',
          organization: 'タッチフォーヘルス国際協会',
          year: 2018,
          description: '1,000名以上の受講生を指導し、多くの認定セラピストを輩出した功績が認められました。'
        }
      ],

      // 活動実績
      achievements: {
        yearsOfExperience: 15,
        seminarsHeld: 150,
        studentsTotal: 1000,
        satisfactionRate: 98,
        certificationsIssued: 500
      },

      // お客様の声
      testimonials: [
        {
          _type: 'testimonial',
          _key: Math.random().toString(36).substr(2, 9),
          name: '山田 花子',
          role: '会社員',
          content: 'キネシオロジーを学んで人生が変わりました。先生の丁寧な指導のおかげで、初心者の私でも無理なく学べました。今では家族や友人にもセッションができるようになり、とても感謝しています。',
          rating: 5,
          date: '2024-09-15'
        },
        {
          _type: 'testimonial',
          _key: Math.random().toString(36).substr(2, 9),
          name: '佐藤 太郎',
          role: 'セラピスト',
          content: 'プロのセラピストとして活動していますが、キネシオロジーを学ぶことでクライアントへのアプローチの幅が広がりました。先生の実践的な指導は本当に役立っています。',
          rating: 5,
          date: '2024-08-20'
        },
        {
          _type: 'testimonial',
          _key: Math.random().toString(36).substr(2, 9),
          name: '鈴木 美咲',
          role: '主婦',
          content: '子育ての悩みを抱えていましたが、キネシオロジーを学んだことで自分自身の心のバランスが取れるようになりました。家族にも良い変化が現れています。',
          rating: 5,
          date: '2024-07-10'
        },
        {
          _type: 'testimonial',
          _key: Math.random().toString(36).substr(2, 9),
          name: '田中 健一',
          role: '自営業',
          content: '仕事のストレスで体調を崩していましたが、キネシオロジーのセッションを受けてから徐々に改善しています。セルフケアの方法も教えていただき、日常的に活用しています。',
          rating: 4,
          date: '2024-06-25'
        },
        {
          _type: 'testimonial',
          _key: Math.random().toString(36).substr(2, 9),
          name: '高橋 由美',
          role: '看護師',
          content: '医療の現場で働いていますが、西洋医学とは異なるアプローチに興味を持ちました。キネシオロジーは科学的な側面もあり、とても興味深いです。患者さんのケアにも活かせています。',
          rating: 5,
          date: '2024-05-30'
        },
        {
          _type: 'testimonial',
          _key: Math.random().toString(36).substr(2, 9),
          name: '伊藤 真理子',
          role: 'ヨガインストラクター',
          content: 'ヨガとキネシオロジーの組み合わせは最強です！両方のアプローチを取り入れることで、生徒さんにより深いケアを提供できるようになりました。',
          rating: 5,
          date: '2024-04-18'
        }
      ],

      // メディア掲載
      mediaFeatures: [
        {
          _type: 'mediaFeature',
          _key: Math.random().toString(36).substr(2, 9),
          title: '心と体のバランスを整えるキネシオロジーの魅力',
          mediaName: '健康雑誌「ナチュラルライフ」',
          date: '2024-03-01',
          type: 'magazine'
        },
        {
          _type: 'mediaFeature',
          _key: Math.random().toString(36).substr(2, 9),
          title: 'ストレス社会を生き抜く新しいセラピー',
          mediaName: 'NHK「あさイチ」',
          date: '2023-11-15',
          type: 'tv',
          url: 'https://www.nhk.or.jp/asaichi/'
        },
        {
          _type: 'mediaFeature',
          _key: Math.random().toString(36).substr(2, 9),
          title: 'キネシオロジーで叶える心身の健康',
          mediaName: 'ウェルネスオンライン',
          date: '2023-08-20',
          type: 'web',
          url: 'https://cafekinesi.com'
        },
        {
          _type: 'mediaFeature',
          _key: Math.random().toString(36).substr(2, 9),
          title: '代替療法の最前線 - キネシオロジーの可能性',
          mediaName: '朝日新聞',
          date: '2023-05-10',
          type: 'newspaper'
        }
      ],

      // 経歴タイムライン
      careerTimeline: [
        {
          _type: 'timelineItem',
          _key: Math.random().toString(36).substr(2, 9),
          year: 2025,
          title: 'オンライン講座プラットフォームを開設',
          description: '全国どこからでも受講できるオンライン講座を本格スタート。より多くの方にキネシオロジーを届けられるようになりました。'
        },
        {
          _type: 'timelineItem',
          _key: Math.random().toString(36).substr(2, 9),
          year: 2020,
          title: 'ベストセラピスト賞を受賞',
          description: '日本キネシオロジー協会より、年間最優秀セラピストとして表彰されました。'
        },
        {
          _type: 'timelineItem',
          _key: Math.random().toString(36).substr(2, 9),
          year: 2018,
          title: '指導者功労賞を受賞',
          description: 'タッチフォーヘルス国際協会より、1,000名以上の受講生を指導した功績が認められました。'
        },
        {
          _type: 'timelineItem',
          _key: Math.random().toString(36).substr(2, 9),
          year: 2015,
          title: 'ピーチタッチ認定マスター取得',
          description: '日本キネシオロジー協会の最上位資格を取得。より高度な技術を習得しました。'
        },
        {
          _type: 'timelineItem',
          _key: Math.random().toString(36).substr(2, 9),
          year: 2012,
          title: 'タッチフォーヘルス公式インストラクター認定',
          description: 'タッチフォーヘルス国際協会の公式インストラクターとして認定されました。'
        },
        {
          _type: 'timelineItem',
          _key: Math.random().toString(36).substr(2, 9),
          year: 2010,
          title: '国際キネシオロジー協会認定インストラクター取得',
          description: 'キネシオロジー講師として独立。本格的に指導活動をスタートしました。'
        },
        {
          _type: 'timelineItem',
          _key: Math.random().toString(36).substr(2, 9),
          year: 2008,
          title: 'キネシオロジーと出会う',
          description: '自身の心身の不調をきっかけにキネシオロジーに出会い、その効果に感動。本格的に学び始めました。'
        }
      ]
    }

    console.log('📝 以下のPhase 2ダミーデータを追加します:\n')
    console.log(`資格・認定証: ${phase2Data.credentials.length}件`)
    console.log(`受賞歴: ${phase2Data.awards.length}件`)
    console.log(`活動実績: 5項目`)
    console.log(`お客様の声: ${phase2Data.testimonials.length}件`)
    console.log(`メディア掲載: ${phase2Data.mediaFeatures.length}件`)
    console.log(`経歴タイムライン: ${phase2Data.careerTimeline.length}件\n`)

    // 確認メッセージ
    console.log('⚠️  この操作は本番データベースを更新します。')
    console.log('📌 対象著者:', targetAuthor.name)
    console.log('📌 ID:', targetAuthor._id)
    console.log('')
    console.log('🔧 データを更新中...\n')

    // データを更新
    await sanityClient
      .patch(targetAuthor._id)
      .set(phase2Data)
      .commit()

    console.log('━'.repeat(60))
    console.log('✅ Phase 2ダミーデータの追加が完了しました！')
    console.log('━'.repeat(60))
    console.log('\n📌 次のステップ:')
    console.log(`   1. 著者ページにアクセス: https://cafekinesi-nextjs.vercel.app/author/${targetAuthor.slug?.current}`)
    console.log('   2. 活動実績セクションが表示されているか確認')
    console.log('   3. 資格・認定証セクションが表示されているか確認')
    console.log('   4. 経歴タイムラインが表示されているか確認')
    console.log('   5. 受賞歴セクションが表示されているか確認')
    console.log('   6. お客様の声セクションが表示されているか確認')
    console.log('   7. メディア掲載セクションが表示されているか確認')
    console.log('')
    console.log('💡 Sanity Studioでも確認できます:')
    console.log('   https://cafekinesi.sanity.studio')
    console.log('')

  } catch (error) {
    console.error('❌ エラーが発生しました:', error)
  }
}

// スクリプト実行
updateAuthorPhase2Data()
