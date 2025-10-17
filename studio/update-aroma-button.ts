import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'e4aqw590',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

async function updateAromaButton() {
  try {
    console.log('🔄 Sanityデータを更新中...')

    // aboutPageドキュメントを取得
    const aboutPage = await client.fetch('*[_type == "aboutPage"][0]')

    if (!aboutPage) {
      console.error('❌ aboutPageが見つかりません')
      process.exit(1)
    }

    console.log('✅ aboutPageを取得しました')
    console.log('📋 現在のセクション数:', aboutPage.sections?.length || 0)

    // section8を探す
    const section8Index = aboutPage.sections?.findIndex((s: any) => s._key === 'section8')

    if (section8Index === -1) {
      console.error('❌ section8が見つかりません')
      process.exit(1)
    }

    console.log('✅ section8を見つけました (index:', section8Index, ')')

    // section8にボタン設定を追加し、highlightBoxを非表示にする
    const result = await client
      .patch(aboutPage._id)
      .set({
        [`sections[${section8Index}].button`]: {
          show: true,
          text: 'ぜひオンラインストアをご覧ください',
          link: 'https://littletree-cafe-kinesi.com/'
        },
        [`sections[${section8Index}].highlightBox.show`]: false
      })
      .commit()

    console.log('✅ Sanityデータの更新が完了しました！')
    console.log('📝 更新されたドキュメントID:', result._id)
    console.log('🔗 ボタンリンク: https://littletree-cafe-kinesi.com/')

  } catch (error) {
    console.error('❌ エラーが発生しました:', error)
    process.exit(1)
  }
}

updateAromaButton()
