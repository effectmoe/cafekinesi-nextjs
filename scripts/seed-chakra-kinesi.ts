import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { chakraKinesiDetailData } from '../components/school/detail/CourseDetailData'

// 環境変数を読み込み
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_WRITE_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function seedChakraKinesiData() {
  try {
    // まず既存のチャクラキネシデータを確認
    const existingData = await client.fetch(
      `*[_type == "course" && courseId == "chakra-kinesi"][0]`
    )

    // Sanity用のデータ形式に変換
    const sanityData = {
      _type: 'course',
      courseId: chakraKinesiDetailData.courseId,
      title: chakraKinesiDetailData.title,
      subtitle: chakraKinesiDetailData.subtitle,
      description: chakraKinesiDetailData.description,
      features: chakraKinesiDetailData.features,
      // 画像は後で手動でアップロード（またはプログラムで処理）
      backgroundClass: chakraKinesiDetailData.backgroundClass,
      recommendations: chakraKinesiDetailData.recommendations || [],
      effects: chakraKinesiDetailData.effects || [],
      order: chakraKinesiDetailData.order,
      isActive: chakraKinesiDetailData.isActive,

      // 詳細ページ用のフィールド
      sections: chakraKinesiDetailData.sections?.map(section => ({
        _type: 'section',
        _key: section.id,
        id: section.id,
        title: section.title,
        content: section.content
      })) || [],

      instructorInfo: chakraKinesiDetailData.instructorInfo ? {
        name: chakraKinesiDetailData.instructorInfo.name,
        bio: chakraKinesiDetailData.instructorInfo.bio,
        profileUrl: chakraKinesiDetailData.instructorInfo.profileUrl
      } : undefined,

      // 関連講座はIDのリストで、後でSanity Studioで参照を設定
    }

    let result
    if (existingData) {
      // 既存データを更新
      console.log('既存のチャクラキネシデータを更新します...')
      result = await client
        .patch(existingData._id)
        .set(sanityData)
        .commit()
      console.log('✅ チャクラキネシデータを更新しました:', result._id)
    } else {
      // 新規作成
      console.log('新規チャクラキネシデータを作成します...')
      result = await client.create(sanityData)
      console.log('✅ チャクラキネシデータを作成しました:', result._id)
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
seedChakraKinesiData()