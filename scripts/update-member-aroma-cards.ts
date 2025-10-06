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

async function updateCards() {
  console.log('🔧 Updating member and aroma cards...\n')

  try {
    // 現在のホームページデータを取得
    const query = '*[_id == "homepage"][0]'
    const homepage = await client.fetch(query)

    if (!homepage) {
      console.log('❌ Homepage document not found')
      return
    }

    // カードのリンクとタイトルを更新
    const updatedCards = homepage.categoryCards?.map((card: any) => {
      if (card.titleJa === 'メンバー') {
        console.log(`  🔄 Updating メンバー card:`)
        console.log(`     Old link: ${card.link}`)
        console.log(`     New link: https://instructor.cafekineshi.com/members/`)
        return {
          ...card,
          link: 'https://instructor.cafekineshi.com/members/'
        }
      }
      if (card.titleJa === 'アロマ') {
        console.log(`  🔄 Updating アロマ card:`)
        console.log(`     Old titleJa: ${card.titleJa}`)
        console.log(`     New titleJa: アロマ購入`)
        console.log(`     Old link: ${card.link}`)
        console.log(`     New link: https://www.littletree-store.jp/`)
        return {
          ...card,
          titleJa: 'アロマ購入',
          link: 'https://www.littletree-store.jp/'
        }
      }
      return card
    })

    // 更新前の状態を表示
    console.log('\n📍 Current cards:')
    homepage.categoryCards?.forEach((card: any) => {
      console.log(`  ${card.titleJa}: ${card.link}`)
    })

    console.log('\n📍 Updated cards:')
    updatedCards?.forEach((card: any) => {
      console.log(`  ${card.titleJa}: ${card.link}`)
    })

    // ホームページドキュメントを更新
    console.log('\n📝 Updating homepage document...')
    const result = await client
      .patch('homepage')
      .set({ categoryCards: updatedCards })
      .commit()

    console.log('✅ Homepage cards updated successfully!')

    // 更新後の確認
    console.log('\n🔍 Verifying update...')
    const updatedHomepage = await client.fetch(query)
    console.log('\n📍 Final cards:')
    updatedHomepage.categoryCards?.forEach((card: any) => {
      console.log(`  ${card.titleJa}: ${card.link} - Active: ${card.isActive !== false ? '✅' : '❌'}`)
    })

  } catch (error) {
    console.error('❌ Error updating homepage:', error)
  }
}

// スクリプトを実行
updateCards()
