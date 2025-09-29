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

async function fixKinesi1() {
  try {
    console.log('🔧 カフェキネシⅠのドキュメントを修正します...\n')

    // 1. 既存のドラフトを削除
    console.log('1. 既存のドラフトを削除中...')
    try {
      await client.delete('drafts.jUz16pLtxN4AoU647Fk4lb')
      console.log('   ✅ ドラフトを削除しました')
    } catch (e) {
      console.log('   ⚠️  ドラフトが存在しないか、既に削除されています')
    }

    // 2. 既存のドキュメントを削除
    console.log('\n2. 既存のドキュメントを削除中...')
    try {
      await client.delete('jUz16pLtxN4AoU647Fk4lb')
      console.log('   ✅ ドキュメントを削除しました')
    } catch (e) {
      console.log('   ⚠️  ドキュメントが存在しないか、既に削除されています')
    }

    // 3. 新しいドキュメントとして作成（新しいIDが自動生成される）
    console.log('\n3. 新しいドキュメントを作成中...')

    const sanityData = {
      _type: 'course',
      courseId: 'kinesi1',  // 元のIDに戻す
      title: kinesi1DetailData.title,
      subtitle: kinesi1DetailData.subtitle,
      description: kinesi1DetailData.description,
      features: kinesi1DetailData.features,
      backgroundClass: kinesi1DetailData.backgroundClass,
      recommendations: kinesi1DetailData.recommendations || [],
      effects: kinesi1DetailData.effects || [],
      order: kinesi1DetailData.order,
      isActive: kinesi1DetailData.isActive,

      // 詳細セクション
      sections: kinesi1DetailData.sections?.map(section => ({
        _type: 'section',
        _key: section.id,
        id: section.id,
        title: section.title,
        content: section.content
      })) || [],

      // インストラクター情報
      instructorInfo: kinesi1DetailData.instructorInfo ? {
        name: kinesi1DetailData.instructorInfo.name,
        bio: kinesi1DetailData.instructorInfo.bio,
        profileUrl: kinesi1DetailData.instructorInfo.profileUrl
      } : undefined,
    }

    const result = await client.create(sanityData)
    console.log('   ✅ 新しいドキュメントを作成しました')
    console.log('   新しいID:', result._id)

    console.log('\n' + '='.repeat(60))
    console.log('✅ カフェキネシⅠのドキュメントが正常に再作成されました！')
    console.log('='.repeat(60))

    console.log('\n📝 次のステップ:')
    console.log('1. Sanity Studioをリフレッシュ（Cmd/Ctrl + R）')
    console.log('2. カフェキネシⅠを開いて編集')
    console.log('3. 変更を加えてPublishボタンが有効になることを確認')
    console.log('\nSanity Studio: http://localhost:3333/')

  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error)
    if (error instanceof Error) {
      console.error('エラーメッセージ:', error.message)
    }
  }
}

// スクリプトを実行
fixKinesi1()