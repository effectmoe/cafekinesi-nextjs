import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { peachTouchDetailData } from '../components/school/detail/CourseDetailData'

// 環境変数を読み込み
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_WRITE_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function seedPeachTouchData() {
  try {
    // まず既存のピーチタッチデータを確認
    const existingData = await client.fetch(
      `*[_type == "course" && courseId == "peach-touch"][0]`
    )

    // Sanity用のデータ形式に変換
    const sanityData = {
      _type: 'course',
      courseId: peachTouchDetailData.courseId,
      title: peachTouchDetailData.title,
      subtitle: peachTouchDetailData.subtitle,
      description: peachTouchDetailData.description,
      features: peachTouchDetailData.features,
      // 画像は後で手動でアップロード（またはプログラムで処理）
      backgroundClass: peachTouchDetailData.backgroundClass,
      recommendations: peachTouchDetailData.recommendations || [],
      effects: peachTouchDetailData.effects || [],
      order: peachTouchDetailData.order,
      isActive: peachTouchDetailData.isActive,

      // 詳細ページ用のフィールド
      sections: peachTouchDetailData.sections?.map(section => ({
        _type: 'section',
        _key: section.id,
        id: section.id,
        title: section.title,
        content: section.content
      })) || [],

      instructorInfo: peachTouchDetailData.instructorInfo ? {
        name: peachTouchDetailData.instructorInfo.name,
        bio: peachTouchDetailData.instructorInfo.bio,
        profileUrl: peachTouchDetailData.instructorInfo.profileUrl
      } : undefined,

      // 関連講座はIDのリストで、後でSanity Studioで参照を設定
    }

    let result
    if (existingData) {
      // 既存データを更新
      console.log('既存のピーチタッチデータを更新します...')
      result = await client
        .patch(existingData._id)
        .set(sanityData)
        .commit()
      console.log('✅ ピーチタッチデータを更新しました:', result._id)
    } else {
      // 新規作成
      console.log('新規ピーチタッチデータを作成します...')
      result = await client.create(sanityData)
      console.log('✅ ピーチタッチデータを作成しました:', result._id)
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
seedPeachTouchData()