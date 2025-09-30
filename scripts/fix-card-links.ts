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

async function fixCardLinks() {
  console.log('🔧 Fixing card links in homepage...\n')

  try {
    // 現在のホームページデータを取得
    const query = '*[_id == "homepage"][0]'
    const homepage = await client.fetch(query)

    if (!homepage) {
      console.log('❌ Homepage document not found')
      return
    }

    // カードのリンクを更新
    const updatedCards = homepage.categoryCards?.map((card: any) => {
      // #リンクを適切なURLに置き換え
      if (card.link === '#') {
        switch (card.titleJa) {
          case 'インストラクター':
            return { ...card, link: '/instructor' }
          case 'アロマ':
            return { ...card, link: '/aroma' }
          case 'メンバー':
            return { ...card, link: '/member' }
          default:
            return card
        }
      }
      return card
    })

    // 更新前の状態を表示
    console.log('📍 Current links:')
    homepage.categoryCards?.forEach((card: any) => {
      console.log(`  ${card.titleJa}: ${card.link}`)
    })

    console.log('\n📍 Updated links:')
    updatedCards?.forEach((card: any) => {
      console.log(`  ${card.titleJa}: ${card.link}`)
    })

    // ホームページドキュメントを更新
    console.log('\n📝 Updating homepage document...')
    const result = await client
      .patch('homepage')
      .set({ categoryCards: updatedCards })
      .commit()

    console.log('✅ Homepage links updated successfully!')

    // 更新後の確認
    console.log('\n🔍 Verifying update...')
    const updatedHomepage = await client.fetch(query)
    console.log('\n📍 Final links:')
    updatedHomepage.categoryCards?.forEach((card: any) => {
      console.log(`  ${card.titleJa}: ${card.link} - Active: ${card.isActive !== false ? '✅' : '❌'}`)
    })

  } catch (error) {
    console.error('❌ Error updating homepage:', error)
  }
}

// スクリプトを実行
fixCardLinks()