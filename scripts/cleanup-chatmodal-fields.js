/**
 * ChatModalドキュメントから古いフィールドを削除するマイグレーションスクリプト
 *
 * 削除するフィールド:
 * - placeholder (inputPlaceholderに統合)
 * - quickSuggestions (削除)
 * - subtitle (faqSectionSubtitleに統合)
 * - title (faqSectionTitleに統合)
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'e4aqw590',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN || 'skmH5807aTZkc80e9wXtUGh6YGxvS9fmTcsxwG0vDPy9XPJ3lTpX7wYmAXl5SKy1HEOllZf3NDEg1ULmn',
  useCdn: false,
})

async function cleanupChatModalFields() {
  console.log('🔍 ChatModalドキュメントを検索中...')

  // 全てのchatModalドキュメントを取得
  const documents = await client.fetch('*[_type == "chatModal"]')

  console.log(`📄 ${documents.length}件のドキュメントが見つかりました`)

  for (const doc of documents) {
    console.log(`\n処理中: ${doc._id}`)

    const fieldsToRemove = []

    // 削除が必要なフィールドを確認
    if ('placeholder' in doc) fieldsToRemove.push('placeholder')
    if ('quickSuggestions' in doc) fieldsToRemove.push('quickSuggestions')
    if ('subtitle' in doc) fieldsToRemove.push('subtitle')
    if ('title' in doc) fieldsToRemove.push('title')

    if (fieldsToRemove.length === 0) {
      console.log('  ✅ 削除するフィールドはありません')
      continue
    }

    console.log(`  🗑️  削除するフィールド: ${fieldsToRemove.join(', ')}`)

    try {
      // フィールドをunset
      await client
        .patch(doc._id)
        .unset(fieldsToRemove)
        .commit()

      console.log('  ✅ 削除完了')
    } catch (error) {
      console.error(`  ❌ エラー: ${error.message}`)
    }
  }

  console.log('\n✨ マイグレーション完了')
}

cleanupChatModalFields()
  .catch((error) => {
    console.error('❌ マイグレーション失敗:', error)
    process.exit(1)
  })
