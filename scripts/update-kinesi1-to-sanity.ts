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

async function updateKinesi1ToSanity() {
  try {
    const documentId = 'jUz16pLtxN4AoU647Fk4lb'
    
    console.log('🔄 WEBページのkinesi1データをSanityに同期します...')
    console.log('Document ID:', documentId)
    
    // WEBページのデータをSanity形式に変換
    const sanityData = {
      courseId: kinesi1DetailData.courseId,
      title: kinesi1DetailData.title,
      subtitle: kinesi1DetailData.subtitle,
      description: kinesi1DetailData.description,
      features: kinesi1DetailData.features,
      backgroundClass: kinesi1DetailData.backgroundClass,
      recommendations: kinesi1DetailData.recommendations,
      effects: kinesi1DetailData.effects,
      order: kinesi1DetailData.order,
      isActive: kinesi1DetailData.isActive,
      
      // 詳細セクションを更新
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
      
      // 価格情報（WEBページのデータにある場合）
      price: kinesi1DetailData.price ? {
        amount: kinesi1DetailData.price.amount,
        unit: kinesi1DetailData.price.unit || '円',
        note: kinesi1DetailData.price.note
      } : undefined,
      
      // 講座時間（WEBページのデータにある場合）
      duration: kinesi1DetailData.duration ? {
        hours: kinesi1DetailData.duration.hours,
        sessions: kinesi1DetailData.duration.sessions,
        note: kinesi1DetailData.duration.note
      } : undefined,
    }
    
    console.log('\n📝 更新するデータ:')
    console.log('- タイトル:', sanityData.title)
    console.log('- サブタイトル:', sanityData.subtitle)
    console.log('- セクション数:', sanityData.sections.length)
    console.log('- 特徴数:', sanityData.features.length)
    console.log('- おすすめ対象数:', sanityData.recommendations?.length || 0)
    console.log('- 効果数:', sanityData.effects?.length || 0)
    
    // 既存のドキュメントを更新
    const result = await client
      .patch(documentId)
      .set(sanityData)
      .commit()
    
    console.log('\n✅ Sanityドキュメントの更新が完了しました!')
    console.log('Document ID:', result._id)
    console.log('更新日時:', result._updatedAt)
    
    console.log('\n🎉 WEBページ → Sanity の同期が成功しました!')
    console.log('\n次のステップ:')
    console.log('1. Sanity Studioで更新内容を確認: npx sanity dev')
    console.log('2. 画像などのメディアファイルは必要に応じて手動でアップロード')
    console.log('3. 関連講座の参照は必要に応じて設定')
    
  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error)
    if (error instanceof Error) {
      console.error('エラーメッセージ:', error.message)
      console.error('\nヒント:')
      console.error('1. Document IDが正しいか確認してください')
      console.error('2. SANITY_WRITE_TOKENが設定されているか確認してください')
      console.error('3. Sanityプロジェクトの設定が正しいか確認してください')
    }
  }
}

// スクリプトを実行
updateKinesi1ToSanity()