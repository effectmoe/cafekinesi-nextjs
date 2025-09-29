import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { kinesi1DetailData } from '../components/school/detail/CourseDetailData'

// 環境変数を読み込み
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_WRITE_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function seedKinesi1Data() {
  try {
    // まず既存のカフェキネシⅠデータを確認
    const existingData = await client.fetch(
      `*[_type == "course" && courseId == "kinesi1"][0]`
    )

    // Sanity用のデータ形式に変換
    const sanityData = {
      _type: 'course',
      courseId: kinesi1DetailData.courseId,
      title: kinesi1DetailData.title,
      subtitle: kinesi1DetailData.subtitle,
      description: kinesi1DetailData.description,
      features: kinesi1DetailData.features,
      // 画像は後で手動でアップロード（またはプログラムで処理）
      backgroundClass: kinesi1DetailData.backgroundClass,
      recommendations: kinesi1DetailData.recommendations || [],
      effects: kinesi1DetailData.effects || [],
      order: kinesi1DetailData.order,
      isActive: kinesi1DetailData.isActive,

      // 詳細ページ用のフィールド
      sections: kinesi1DetailData.sections?.map(section => ({
        _type: 'section',
        _key: section.id,
        id: section.id,
        title: section.title,
        content: section.content
      })) || [],

      instructorInfo: kinesi1DetailData.instructorInfo ? {
        name: kinesi1DetailData.instructorInfo.name,
        bio: kinesi1DetailData.instructorInfo.bio,
        profileUrl: kinesi1DetailData.instructorInfo.profileUrl
      } : undefined,

      // 関連講座はIDのリストで、後でSanity Studioで参照を設定
    }

    let result
    if (existingData) {
      // 既存データを更新
      console.log('既存のカフェキネシⅠデータを更新します...')
      result = await client
        .patch(existingData._id)
        .set(sanityData)
        .commit()
      console.log('✅ カフェキネシⅠデータを更新しました:', result._id)
    } else {
      // 新規作成
      console.log('新規カフェキネシⅠデータを作成します...')
      result = await client.create(sanityData)
      console.log('✅ カフェキネシⅠデータを作成しました:', result._id)
    }

    console.log('\n📝 次のステップ:')
    console.log('1. Sanity Studioで画像をアップロード')
    console.log('2. 関連講座の参照を設定')
    console.log('3. SEO設定を追加')
    console.log('\nSanity Studioを開く: npx sanity dev')

  } catch (error) {
    console.error('❌ エラーが発生しました:', error)
    if (error instanceof Error) {
      console.error('エラーメッセージ:', error.message)
    }
  }
}

// スクリプトを実行
seedKinesi1Data()