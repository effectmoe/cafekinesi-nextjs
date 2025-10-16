import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'e4aqw590',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

async function updateDomain(newDomain: string) {
  try {
    console.log(`🌐 独自ドメインを ${newDomain} に更新します...\n`)

    // siteConfigドキュメントを取得
    const siteConfig = await client.fetch(`*[_type == "siteConfig"][0]`)

    if (!siteConfig) {
      console.error('❌ siteConfig ドキュメントが見つかりません')
      return
    }

    const oldDomain = siteConfig.baseUrl || 'https://cafekinesi-nextjs.vercel.app'
    console.log(`現在のドメイン: ${oldDomain}`)
    console.log(`新しいドメイン: ${newDomain}\n`)

    // llms.txtの内容を一括置換
    const updatedLlmsContent = siteConfig.llmsContent?.replace(
      new RegExp(oldDomain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
      newDomain
    )

    // siteConfigドキュメントを更新
    await client
      .patch(siteConfig._id)
      .set({
        baseUrl: newDomain,
        llmsContent: updatedLlmsContent,
      })
      .commit()

    console.log('✅ Sanity siteConfig の更新に成功しました！\n')
    console.log('更新内容:')
    console.log(`   baseUrl: ${oldDomain} → ${newDomain}`)
    console.log(`   llmsContent: ${oldDomain} を ${newDomain} に置換\n`)
    console.log('次のステップ:')
    console.log('1. Vercel環境変数 NEXT_PUBLIC_SITE_URL を更新')
    console.log('2. Vercelで再デプロイ')
    console.log('3. robots.txt, llms.txt, sitemap.xml を確認')
  } catch (error) {
    console.error('❌ エラーが発生しました:', error)
    throw error
  }
}

// コマンドライン引数から新ドメインを取得
const newDomain = process.argv[2]

if (!newDomain) {
  console.error('使用方法: npx tsx scripts/update-domain.ts <新しいドメイン>')
  console.error('例: npx tsx scripts/update-domain.ts https://cafekinesi.com')
  process.exit(1)
}

// httpsスキーマチェック
if (!newDomain.startsWith('http://') && !newDomain.startsWith('https://')) {
  console.error('❌ ドメインは http:// または https:// で始まる必要があります')
  process.exit(1)
}

updateDomain(newDomain)
  .then(() => {
    console.log('\n✨ スクリプトが正常に完了しました')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 スクリプトがエラーで終了しました:', error)
    process.exit(1)
  })
