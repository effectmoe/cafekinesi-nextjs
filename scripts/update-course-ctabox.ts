import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'

// 環境変数を読み込み
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_WRITE_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// サンプル: ハッピーオーラ講座のCTAボックス設定
const happyAuraCTABoxData = {
  title: 'この講座について',
  subtitle: '詳細情報やお申込みはこちら',
  primaryButtonText: '詳細を見る',
  primaryButtonLink: '', // 空の場合は /school/{courseId} にフォールバック
  secondaryButtonText: '講座詳細・お申込み →',
  secondaryButtonLink: 'https://example.com/apply/happy-aura', // 外部申込フォームのURL（サンプル）
}

async function updateCourseCTABox() {
  try {
    console.log('🚀 講座のCTAボックス設定を更新開始...\\n')

    // happy-aura講座を取得
    const course = await client.fetch(
      `*[_type == "course" && courseId == "happy-aura"][0]{ _id, title, courseId }`
    )

    if (!course) {
      console.log('❌ happy-aura講座が見つかりません')
      return
    }

    console.log(`📋 対象講座: ${course.title} (${course.courseId})`)
    console.log(`   Document ID: ${course._id}\\n`)

    console.log('⏳ CTAボックス設定を更新中...\\n')

    // CTAボックス設定を更新
    await client
      .patch(course._id)
      .set({ ctaBox: happyAuraCTABoxData })
      .commit()

    console.log('='.repeat(60))
    console.log('✅ CTAボックス設定の更新完了！')
    console.log('='.repeat(60))

    console.log('\\n📝 更新内容:')
    console.log(`  - タイトル: ${happyAuraCTABoxData.title}`)
    console.log(`  - サブタイトル: ${happyAuraCTABoxData.subtitle}`)
    console.log(`  - メインボタン: ${happyAuraCTABoxData.primaryButtonText}`)
    console.log(`  - サブボタン: ${happyAuraCTABoxData.secondaryButtonText}`)
    if (happyAuraCTABoxData.secondaryButtonLink) {
      console.log(`  - サブボタンリンク: ${happyAuraCTABoxData.secondaryButtonLink}`)
    }

    console.log('\\n🔗 確認方法:')
    console.log('1. Sanity Studio: http://localhost:3333/')
    console.log('2. 「講座」→「カフェキネシⅥ ハッピーオーラ」を開く')
    console.log('3. 「CTA設定」タブを確認')
    console.log('4. WEBページ: http://localhost:3000/school')
    console.log('   または: https://cafekinesi-nextjs.vercel.app/school')
    console.log('   → 「この講座について」ボックスの内容が変わります')

    console.log('\\n💡 他の講座にも同じ設定を適用する場合:')
    console.log('   このスクリプトのcourseIdを変更して再実行してください')

  } catch (error) {
    console.error('\\n❌ エラーが発生しました:', error)
    if (error instanceof Error) {
      console.error('エラーメッセージ:', error.message)
    }
  }
}

// スクリプトを実行
updateCourseCTABox()
