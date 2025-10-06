import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'

// 環境変数を読み込み
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'e4aqw590',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
})

async function checkCards() {
  console.log('🔍 Checking current card data in Sanity...\n')

  try {
    // 現在のホームページデータを取得
    const query = '*[_id == "homepage"][0]'
    const homepage = await client.fetch(query)

    if (!homepage) {
      console.log('❌ Homepage document not found')
      return
    }

    console.log('📍 Current cards in Sanity:')
    homepage.categoryCards?.forEach((card: any, index: number) => {
      console.log(`\n${index + 1}. ${card.titleJa} (${card.titleEn})`)
      console.log(`   Link: ${card.link}`)
      console.log(`   Active: ${card.isActive !== false ? '✅' : '❌'}`)
      console.log(`   Color: ${card.colorScheme}`)
      console.log(`   Display Order: ${card.displayOrder}`)
    })

  } catch (error) {
    console.error('❌ Error checking cards:', error)
  }
}

// スクリプトを実行
checkCards()
