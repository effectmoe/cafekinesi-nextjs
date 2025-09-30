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

async function activateAllCards() {
  console.log('🔧 Activating all cards in homepage...\n')

  try {
    // 現在のホームページデータを取得
    const query = '*[_id == "homepage"][0]'
    const homepage = await client.fetch(query)

    if (!homepage) {
      console.log('❌ Homepage document not found')
      return
    }

    // すべてのカードをアクティブにし、リンクを確認
    const updatedCards = homepage.categoryCards?.map((card: any) => {
      // isActiveを明示的にtrueに設定
      const updatedCard = {
        ...card,
        isActive: true  // 明示的にtrueに設定
      }

      // リンクの修正も同時に行う
      if (card.link === '#') {
        switch (card.titleJa) {
          case 'インストラクター':
            updatedCard.link = '/instructor'
            break
          case 'アロマ':
            updatedCard.link = '/aroma'
            break
          case 'メンバー':
            updatedCard.link = '/member'
            break
        }
      }

      return updatedCard
    })

    // 更新前の状態を表示
    console.log('📍 Current cards status:')
    homepage.categoryCards?.forEach((card: any) => {
      console.log(`  ${card.titleJa}: isActive=${card.isActive}, link=${card.link}`)
    })

    console.log('\n📍 Updated cards status:')
    updatedCards?.forEach((card: any) => {
      console.log(`  ${card.titleJa}: isActive=${card.isActive}, link=${card.link}`)
    })

    // ホームページドキュメントを更新
    console.log('\n📝 Updating homepage document...')
    const result = await client
      .patch('homepage')
      .set({ categoryCards: updatedCards })
      .commit()

    console.log('✅ All cards activated successfully!')

    // 更新後の確認
    console.log('\n🔍 Verifying update...')
    const updatedHomepage = await client.fetch(query)
    console.log('\n📍 Final cards status:')
    updatedHomepage.categoryCards?.forEach((card: any) => {
      console.log(`  ${card.titleJa}: isActive=${card.isActive} ✅, link=${card.link}`)
    })

  } catch (error) {
    console.error('❌ Error updating homepage:', error)
  }
}

// スクリプトを実行
activateAllCards()