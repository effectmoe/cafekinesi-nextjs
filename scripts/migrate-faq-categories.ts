/**
 * FAQのcategoryフィールドを文字列からreferenceに移行するスクリプト
 *
 * 使用方法:
 * SANITY_API_TOKEN=your_token npx tsx scripts/migrate-faq-categories.ts
 */

import {createClient} from '@sanity/client'

// カテゴリーの文字列値からドキュメントIDへのマッピング
const categoryMapping: Record<string, string> = {
  'kinesi': 'faqCategory-kinesi',
  'beginner': 'faqCategory-beginner',
  'course': 'faqCategory-course',
  'price': 'faqCategory-price',
  'cancel': 'faqCategory-cancel',
  'instructor': 'faqCategory-instructor',
  'session': 'faqCategory-session',
  'booking': 'faqCategory-booking',
  'venue': 'faqCategory-venue',
  'other': 'faqCategory-other',
}

// Write tokenを環境変数から取得
const SANITY_WRITE_TOKEN = process.env.SANITY_API_TOKEN

if (!SANITY_WRITE_TOKEN) {
  console.error('❌ エラー: SANITY_API_TOKENが設定されていません')
  console.log('使用方法: SANITY_API_TOKEN=your_token npx tsx scripts/migrate-faq-categories.ts')
  process.exit(1)
}

const client = createClient({
  projectId: 'e4aqw590',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: SANITY_WRITE_TOKEN,
})

async function migrateFAQCategories() {
  console.log('📋 FAQのcategoryフィールドを移行中...\n')

  // 1. すべてのFAQを取得
  const faqs = await client.fetch(`*[_type == "faq"]{_id, _rev, question, category}`)

  console.log(`見つかったFAQ: ${faqs.length}件\n`)

  // 2. 各FAQのcategoryを更新
  const transaction = client.transaction()
  let updatedCount = 0
  let skippedCount = 0

  for (const faq of faqs) {
    // categoryが既にreferenceの場合はスキップ
    if (typeof faq.category === 'object' && faq.category._ref) {
      console.log(`⏭️  スキップ: "${faq.question}" (既にreference)`)
      skippedCount++
      continue
    }

    // categoryが文字列の場合は変換
    if (typeof faq.category === 'string') {
      const categoryId = categoryMapping[faq.category]

      if (!categoryId) {
        console.log(`⚠️  警告: "${faq.question}" のカテゴリー "${faq.category}" はマッピングにありません`)
        skippedCount++
        continue
      }

      transaction.patch(faq._id, {
        set: {
          category: {
            _type: 'reference',
            _ref: categoryId
          }
        }
      })

      console.log(`✅ 更新: "${faq.question}" → ${categoryId}`)
      updatedCount++
    }
  }

  // 3. トランザクションをコミット
  if (updatedCount > 0) {
    await transaction.commit()
    console.log(`\n🎉 ${updatedCount}件のFAQを更新しました！`)
  } else {
    console.log('\n✨ 更新が必要なFAQはありませんでした。')
  }

  if (skippedCount > 0) {
    console.log(`⏭️  ${skippedCount}件のFAQはスキップされました。`)
  }
}

migrateFAQCategories()
  .then(() => {
    console.log('\n✅ 移行完了！')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ エラーが発生しました:', error)
    process.exit(1)
  })
