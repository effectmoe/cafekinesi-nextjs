import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'e4aqw590',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

async function updateProfileSection() {
  try {
    console.log('🔄 代表者プロフィールセクションを更新中...')

    // aboutPageドキュメントを取得
    const aboutPage = await client.fetch('*[_type == "aboutPage"][0]')

    if (!aboutPage) {
      console.error('❌ aboutPageが見つかりません')
      process.exit(1)
    }

    console.log('✅ aboutPageを取得しました')
    console.log('📋 現在のセクション数:', aboutPage.sections?.length || 0)

    // 代表者プロフィールセクションを探す
    const profileSectionIndex = aboutPage.sections?.findIndex((s: any) => s._key === '7cbd1582e067')

    if (profileSectionIndex === -1) {
      console.error('❌ 代表者プロフィールセクションが見つかりません')
      process.exit(1)
    }

    console.log('✅ 代表者プロフィールセクションを見つけました (index:', profileSectionIndex, ')')

    // レイアウトを text-only に変更し、ボタンを追加
    const result = await client
      .patch(aboutPage._id)
      .set({
        [`sections[${profileSectionIndex}].layout`]: 'text-only',
        [`sections[${profileSectionIndex}].button`]: {
          show: true,
          text: '代表者プロフィールを見る',
          link: 'https://cafekinesi-nextjs.vercel.app/profile'
        }
      })
      .commit()

    console.log('✅ Sanityデータの更新が完了しました！')
    console.log('📝 更新されたドキュメントID:', result._id)
    console.log('🎯 レイアウト: link-cards → text-only')
    console.log('🔗 ボタンリンク:', 'https://cafekinesi-nextjs.vercel.app/profile')

  } catch (error) {
    console.error('❌ エラーが発生しました:', error)
    process.exit(1)
  }
}

updateProfileSection()
