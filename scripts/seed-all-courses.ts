import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import {
  kinesi1DetailData,
  peachTouchDetailData,
  chakraKinesiDetailData
} from '../components/school/detail/CourseDetailData'

// 環境変数を読み込み
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_WRITE_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// すべてのコースデータをマッピング
const allCourses = [
  kinesi1DetailData,
  peachTouchDetailData,
  chakraKinesiDetailData
]

async function seedAllCourses() {
  try {
    console.log('🚀 すべてのコースをSanityに同期開始...\n')

    for (const courseData of allCourses) {
      console.log(`\n📋 処理中: ${courseData.title} (${courseData.courseId})`)

      // 既存のデータを確認
      const existingData = await client.fetch(
        `*[_type == "course" && courseId == $courseId][0]`,
        { courseId: courseData.courseId }
      )

      // Sanity用のデータ形式に変換
      const sanityData = {
        _type: 'course',
        courseId: courseData.courseId,
        title: courseData.title,
        subtitle: courseData.subtitle,
        description: courseData.description,
        features: courseData.features,
        backgroundClass: courseData.backgroundClass,
        recommendations: courseData.recommendations || [],
        effects: courseData.effects || [],
        order: courseData.order,
        isActive: courseData.isActive,

        // 詳細セクション
        sections: courseData.sections?.map(section => ({
          _type: 'section',
          _key: section.id,
          id: section.id,
          title: section.title,
          content: section.content
        })) || [],

        // インストラクター情報
        instructorInfo: courseData.instructorInfo ? {
          name: courseData.instructorInfo.name,
          bio: courseData.instructorInfo.bio,
          profileUrl: courseData.instructorInfo.profileUrl
        } : undefined,

        // 価格情報（存在する場合）
        price: courseData.price ? {
          amount: courseData.price.amount,
          unit: courseData.price.unit || '円',
          note: courseData.price.note
        } : undefined,

        // 講座時間（存在する場合）
        duration: courseData.duration ? {
          hours: courseData.duration.hours,
          sessions: courseData.duration.sessions,
          note: courseData.duration.note
        } : undefined,
      }

      let result
      if (existingData) {
        // 既存データを更新
        console.log('  → 既存データを更新中...')
        result = await client
          .patch(existingData._id)
          .set(sanityData)
          .commit()
        console.log('  ✅ 更新完了:', result._id)
      } else {
        // 新規作成
        console.log('  → 新規データを作成中...')
        result = await client.create(sanityData)
        console.log('  ✅ 作成完了:', result._id)
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log('🎉 すべてのコースの同期が完了しました！')
    console.log('='.repeat(60))

    console.log('\n📝 同期されたコース:')
    allCourses.forEach((course, index) => {
      console.log(`  ${index + 1}. ${course.title} (${course.courseId})`)
    })

    console.log('\n🔗 確認方法:')
    console.log('1. Sanity Studio: http://localhost:3333/')
    console.log('2. WEBページ:')
    console.log('   - http://localhost:3000/school/kinesi1')
    console.log('   - http://localhost:3000/school/peach-touch')
    console.log('   - http://localhost:3000/school/chakra-kinesi')

    console.log('\n💡 次のステップ:')
    console.log('1. Sanity Studioで画像をアップロード')
    console.log('2. 関連講座の参照を設定')
    console.log('3. SEO設定を追加')

  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error)
    if (error instanceof Error) {
      console.error('エラーメッセージ:', error.message)
      console.error('\nヒント:')
      console.error('1. SANITY_WRITE_TOKENが設定されているか確認')
      console.error('2. Sanityプロジェクトの設定が正しいか確認')
      console.error('3. ネットワーク接続を確認')
    }
  }
}

// スクリプトを実行
seedAllCourses()