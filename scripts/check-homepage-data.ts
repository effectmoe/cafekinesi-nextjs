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

async function checkHomepageData() {
  console.log('🔍 Checking homepage data in Sanity...\n')

  try {
    // ホームページデータを取得
    const query = '*[_id == "homepage"][0]'
    const homepage = await client.fetch(query)

    if (!homepage) {
      console.log('❌ Homepage document not found')
      return
    }

    console.log('📋 Homepage Document Summary:')
    console.log('  ID:', homepage._id)
    console.log('  Title:', homepage.title)
    console.log('  Cards:', homepage.categoryCards?.length || 0)

    console.log('\n📍 Category Cards Details:')
    homepage.categoryCards?.forEach((card: any, index: number) => {
      console.log(`\n  Card ${index + 1}:`)
      console.log('    Title (JP):', card.titleJa || card.titleJp)
      console.log('    Title (EN):', card.titleEn)
      console.log('    Color Scheme:', card.colorScheme)
      console.log('    Link:', card.link)
      console.log('    Is Active:', card.isActive !== false ? '✅ Active' : '❌ Inactive')
      console.log('    Display Order:', card.displayOrder)
      console.log('    Has Image:', !!card.image)
    })

    // 6番目のカードを特別にチェック
    const sixthCard = homepage.categoryCards?.[5]
    if (sixthCard) {
      console.log('\n🎯 6th Card (Member) Special Check:')
      console.log('  Color Scheme:', sixthCard.colorScheme)
      console.log('  Expected: album-pink')
      console.log('  Match:', sixthCard.colorScheme === 'album-pink' ? '✅' : '❌')
    }

  } catch (error) {
    console.error('❌ Error fetching homepage:', error)
  }
}

// スクリプトを実行
checkHomepageData()