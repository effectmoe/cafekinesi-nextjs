import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'e4aqw590',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

async function addProfileContent() {
  try {
    console.log('🔄 代表者プロフィールセクションにコンテンツを追加中...')

    // aboutPageドキュメントを取得
    const aboutPage = await client.fetch('*[_type == "aboutPage"][0]')

    if (!aboutPage) {
      console.error('❌ aboutPageが見つかりません')
      process.exit(1)
    }

    // 代表者プロフィールセクションを探す
    const profileSectionIndex = aboutPage.sections?.findIndex((s: any) => s._key === '7cbd1582e067')

    if (profileSectionIndex === -1) {
      console.error('❌ 代表者プロフィールセクションが見つかりません')
      process.exit(1)
    }

    console.log('✅ 代表者プロフィールセクションを見つけました')

    // コンテンツを追加
    const result = await client
      .patch(aboutPage._id)
      .set({
        [`sections[${profileSectionIndex}].content`]: [
          {
            _type: 'block',
            _key: 'profile1',
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: 'profilespan1',
                text: 'カフェキネシ創業者　星 ユカリのこれまでの歩みをご紹介します。',
                marks: []
              }
            ]
          }
        ]
      })
      .commit()

    console.log('✅ コンテンツの追加が完了しました！')
    console.log('📝 更新されたドキュメントID:', result._id)

  } catch (error) {
    console.error('❌ エラーが発生しました:', error)
    process.exit(1)
  }
}

addProfileContent()
