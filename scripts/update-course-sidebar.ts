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

// サンプル: ハッピーオーラ講座のサイドバー設定
const happyAuraSidebarData = {
  showContactButton: true,
  contactButtonText: 'お問い合わせ・お申し込み',
  contactButtonLink: '/contact',
  customSections: [
    {
      _type: 'customSection',
      _key: 'categories',
      title: 'カテゴリー',
      items: [
        { _type: 'item', _key: 'cat1', text: 'クチカフェ', link: '' },
        { _type: 'item', _key: 'cat2', text: 'チャクラキネシ', link: '' },
        { _type: 'item', _key: 'cat3', text: 'カフェキネシアドバンス', link: '' },
        { _type: 'item', _key: 'cat4', text: 'カフェキネシ', link: '' },
        { _type: 'item', _key: 'cat5', text: 'お知らせ', link: '' },
        { _type: 'item', _key: 'cat6', text: '動画', link: '' },
      ]
    }
  ]
}

async function updateCourseSidebar() {
  try {
    console.log('🚀 講座のサイドバー設定を更新開始...\\n')

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

    console.log('⏳ サイドバー設定を更新中...\\n')

    // サイドバー設定を更新
    await client
      .patch(course._id)
      .set({ sidebar: happyAuraSidebarData })
      .commit()

    console.log('='.repeat(60))
    console.log('✅ サイドバー設定の更新完了！')
    console.log('='.repeat(60))

    console.log('\\n📝 更新内容:')
    console.log('  - お問い合わせボタン: 表示')
    console.log(`  - ボタンテキスト: ${happyAuraSidebarData.contactButtonText}`)
    console.log(`  - リンク先: ${happyAuraSidebarData.contactButtonLink}`)
    console.log(`  - カスタムセクション: ${happyAuraSidebarData.customSections.length}個`)
    happyAuraSidebarData.customSections.forEach(section => {
      console.log(`    - ${section.title}: ${section.items.length}アイテム`)
    })

    console.log('\\n🔗 確認方法:')
    console.log('1. Sanity Studio: http://localhost:3333/')
    console.log('2. 「講座」→「カフェキネシⅥ ハッピーオーラ」を開く')
    console.log('3. 「サイドバー設定」タブを確認')
    console.log('4. WEBページ: http://localhost:3000/school/happy-aura')
    console.log('   または: https://cafekinesi-nextjs.vercel.app/school/happy-aura')

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
updateCourseSidebar()
