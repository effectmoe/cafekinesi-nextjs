/**
 * ChatModalドキュメントの現在の状態を確認
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'e4aqw590',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skmH5807aTZkc80e9wXtUGh6YGxvS9fmTcsxwG0vDPy9XPJ3lTpX7wYmAXl5SKy1HEOllZf3NDEg1ULmn',
  useCdn: false,
})

async function checkChatModal() {
  console.log('📄 ChatModalドキュメントを確認中...\n')

  const docs = await client.fetch('*[_type == "chatModal"]')

  for (const doc of docs) {
    console.log('='.repeat(50))
    console.log('ドキュメントID:', doc._id)
    console.log('タイプ:', doc._type)
    console.log('\n【現在のフィールド】')
    console.log('- faqSectionTitle:', doc.faqSectionTitle)
    console.log('- faqSectionSubtitle:', doc.faqSectionSubtitle)
    console.log('- headerTitle:', doc.headerTitle)
    console.log('- headerSubtitle:', doc.headerSubtitle)
    console.log('- inputPlaceholder:', doc.inputPlaceholder)
    console.log('- footerMessage:', doc.footerMessage)
    console.log('- welcomeMessage:', doc.welcomeMessage)
    console.log('- isActive:', doc.isActive)

    console.log('\n【削除されたはずのフィールド（あれば問題）】')
    if ('placeholder' in doc) console.log('❌ placeholder:', doc.placeholder)
    if ('quickSuggestions' in doc) console.log('❌ quickSuggestions:', doc.quickSuggestions)
    if ('subtitle' in doc) console.log('❌ subtitle:', doc.subtitle)
    if ('title' in doc) console.log('❌ title:', doc.title)

    if (!('placeholder' in doc) && !('quickSuggestions' in doc) && !('subtitle' in doc) && !('title' in doc)) {
      console.log('✅ すべての古いフィールドが削除されています')
    }
    console.log('='.repeat(50))
    console.log()
  }
}

checkChatModal().catch(console.error)
