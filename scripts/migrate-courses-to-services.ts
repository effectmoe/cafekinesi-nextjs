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
 * 講座データをAI-First Serviceエンティティに移行
 */
async function migrateCourses() {
  console.log('📚 講座データをAI-First Serviceエンティティに移行開始...\n')

  try {
    // 1. 全講座を取得
    const courses = await client.fetch(`*[_type == "course"] {
      _id,
      title,
      courseId,
      description,
      price,
      duration,
      isActive,
      slug
    }`)

    console.log(`📋 取得した講座: ${courses.length}件`)

    const services: any[] = []

    // 2. 各講座をServiceエンティティに変換
    for (const course of courses) {
      // AI検索キーワードを生成
      const aiSearchKeywords = [
        '講座',
        'コース',
        'どんな講座',
        'どのような講座',
        'カフェキネシ講座',
        course.title,
        course.courseId || '',
        // 講座別の特有キーワード
        ...(course.title.includes('カフェキネシⅠ') ? ['基礎', '入門', '初心者', 'カフェキネシ1'] : []),
        ...(course.title.includes('チャクラ') ? ['チャクラ', 'chakra', 'バランス'] : []),
        ...(course.title.includes('ピーチタッチ') ? ['ピーチタッチ', 'セルフケア', '自分で'] : []),
        ...(course.title.includes('HELP') ? ['HELP', 'ヘルプ', 'セルフケア'] : []),
        ...(course.title.includes('TAO') ? ['TAO', 'タオ', '五行', '日本人'] : []),
        ...(course.title.includes('ハッピーオーラ') ? ['ハッピーオーラ', 'オーラ', 'エネルギー'] : [])
      ].filter(Boolean) // 空文字列を除去

      // よくある質問を生成
      const aiFAQ = [
        {
          question: `${course.title}とはどのような講座ですか？`,
          answer: course.description || `${course.title}について詳しくはお問い合わせください。`
        },
        {
          question: `${course.title}の料金はいくらですか？`,
          answer: course.price ? `${course.price}円です。` : '料金についてはお問い合わせください。'
        },
        {
          question: `${course.title}の期間はどのくらいですか？`,
          answer: course.duration || '期間についてはお問い合わせください。'
        }
      ]

      // Serviceエンティティとして作成
      const service = {
        _id: `service-${course.courseId || course._id.replace('drafts.', '')}`,
        _type: 'service',
        name: course.title,
        serviceType: 'course',
        category: 'cafekinesi',

        // AI検索最適化
        aiSearchKeywords,
        aiQuickAnswer: course.description ? course.description.substring(0, 100) : `${course.title}について詳しくご案内いたします。`,
        aiFAQ,

        // 詳細情報
        description: course.description ? [
          {
            _type: 'block',
            style: 'normal',
            children: [{ _type: 'span', text: course.description }]
          }
        ] : [],

        targetAudience: getTargetAudience(course.title),
        benefits: getBenefits(course.title),

        pricing: {
          price: course.price ? parseFloat(course.price.replace(/[^0-9]/g, '')) : null,
          currency: 'JPY',
          unit: 'コース',
          notes: course.price ? '' : '料金はお問い合わせください'
        },

        duration: parseDuration(course.duration),

        schedule: {
          frequency: '定期開催',
          isOnline: true,
          location: 'オンライン・対面'
        },

        // メタデータ
        slug: course.slug || {
          _type: 'slug',
          current: course.courseId || course.title.toLowerCase().replace(/\s+/g, '-')
        },
        isActive: course.isActive !== false,
        popularity: getPopularity(course.title)
      }

      services.push(service)
      console.log(`  ✅ ${course.title} → Service変換完了`)
    }

    // 3. Serviceエンティティを一括作成
    console.log('\n💾 Serviceエンティティを作成中...')
    for (const service of services) {
      try {
        await client.createOrReplace(service)
        console.log(`  ✅ 作成: ${service.name}`)
      } catch (error) {
        console.error(`  ❌ 失敗: ${service.name}`, error)
      }
    }

    console.log('\n📊 移行完了サマリー:')
    console.log(`  📚 対象講座: ${courses.length}件`)
    console.log(`  🎓 作成サービス: ${services.length}件`)

    // 4. AI検索キーワードの統計
    const allKeywords = services.flatMap(s => s.aiSearchKeywords)
    const uniqueKeywords = [...new Set(allKeywords)]
    console.log(`  🔍 AI検索キーワード: ${uniqueKeywords.length}種類`)

    console.log('\n✨ 講座データのAI-First移行が完了しました！')
    console.log('\n次のステップ:')
    console.log('1. ベクトルデータベースにServiceデータを同期')
    console.log('2. AIチャットボットの回答品質をテスト')

  } catch (error) {
    console.error('❌ 移行エラー:', error)
  }
}

// ヘルパー関数
function getTargetAudience(title: string): string {
  if (title.includes('カフェキネシⅠ')) return '初心者・セラピストを目指す方'
  if (title.includes('チャクラ')) return 'より深いスキルを求める方'
  if (title.includes('ピーチタッチ')) return 'セルフケアを学びたい方'
  if (title.includes('HELP')) return 'セルフケアに興味のある方'
  if (title.includes('TAO')) return '東洋思想に興味のある方'
  if (title.includes('ハッピーオーラ')) return 'エネルギーワークに興味のある方'
  return 'キネシオロジーに興味のある方'
}

function getBenefits(title: string): string[] {
  const commonBenefits = ['ストレス軽減', '心身のバランス向上', '実践的スキル習得']

  if (title.includes('カフェキネシⅠ')) return [...commonBenefits, 'セラピストとしての基礎', '人を癒すスキル']
  if (title.includes('チャクラ')) return [...commonBenefits, 'チャクラバランス', 'エネルギー調整']
  if (title.includes('ピーチタッチ')) return [...commonBenefits, 'セルフケア能力', '日常でのケア']
  if (title.includes('HELP')) return [...commonBenefits, '自己肯定感向上', 'インナーチャイルド癒し']
  if (title.includes('TAO')) return [...commonBenefits, '五行理論の理解', '日本人の精神性']
  if (title.includes('ハッピーオーラ')) return [...commonBenefits, 'オーラの輝き', 'エネルギーの活性化']

  return commonBenefits
}

function parseDuration(duration: string | null): any {
  if (!duration) return { hours: 2, minutes: 0, sessions: 1 }

  // 時間を解析（簡易版）
  const hours = duration.match(/(\d+)時間/) ? parseInt(duration.match(/(\d+)時間/)![1]) : 2
  return { hours, minutes: 0, sessions: 1 }
}

function getPopularity(title: string): number {
  // 講座の人気度を設定（推定）
  if (title.includes('カフェキネシⅠ')) return 85
  if (title.includes('チャクラ')) return 75
  if (title.includes('ピーチタッチ')) return 80
  if (title.includes('HELP')) return 70
  if (title.includes('TAO')) return 65
  if (title.includes('ハッピーオーラ')) return 60
  return 50
}

// 実行
migrateCourses()