/**
 * プレースホルダー画像をschoolPageに追加
 * Unsplash Source APIを使用
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@sanity/client'

config({ path: resolve(process.cwd(), '.env.local') })

const client = createClient({
  projectId: 'e4aqw590',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

// Unsplash Source API - 無料のプレースホルダー画像
const IMAGES = {
  selectionGuide: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=800&fit=crop', // 勉強・学習
  step1: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop', // 少人数クラス
  step2: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop', // 実践セッション
  step3: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop', // プロフェッショナル
  step4: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop', // コミュニティ
  certification: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=1200&h=800&fit=crop', // 認定証
}

async function uploadImageFromUrl(imageUrl: string, filename: string) {
  try {
    console.log(`   📥 画像をダウンロード中: ${filename}...`)

    // 画像をダウンロード
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Sanityにアップロード
    const asset = await client.assets.upload('image', buffer, {
      filename: filename,
      contentType: 'image/jpeg',
    })

    console.log(`   ✅ アップロード完了: ${asset._id}`)
    return asset._id

  } catch (error) {
    console.error(`   ❌ エラー: ${filename}`, error)
    return null
  }
}

async function main() {
  console.log('🎨 プレースホルダー画像を追加中...\n')

  try {
    // 画像をアップロード
    console.log('📸 Step 1/6: 講座の選び方画像をアップロード')
    const selectionGuideImageId = await uploadImageFromUrl(
      IMAGES.selectionGuide,
      'selection-guide.jpg'
    )

    console.log('\n📸 Step 2/6: ステップ1画像をアップロード')
    const step1ImageId = await uploadImageFromUrl(IMAGES.step1, 'learning-step1.jpg')

    console.log('\n📸 Step 3/6: ステップ2画像をアップロード')
    const step2ImageId = await uploadImageFromUrl(IMAGES.step2, 'learning-step2.jpg')

    console.log('\n📸 Step 4/6: ステップ3画像をアップロード')
    const step3ImageId = await uploadImageFromUrl(IMAGES.step3, 'learning-step3.jpg')

    console.log('\n📸 Step 5/6: ステップ4画像をアップロード')
    const step4ImageId = await uploadImageFromUrl(IMAGES.step4, 'learning-step4.jpg')

    console.log('\n📸 Step 6/6: 資格・認定画像をアップロード')
    const certificationImageId = await uploadImageFromUrl(
      IMAGES.certification,
      'certification.jpg'
    )

    // schoolPageドキュメントを取得
    console.log('\n📝 schoolPageドキュメントを更新中...')
    const schoolPage = await client.fetch(`*[_type == "schoolPage"][0]`)

    if (!schoolPage) {
      console.log('❌ schoolPageが見つかりません')
      return
    }

    // 画像参照を追加
    const updates: any = {}

    if (selectionGuideImageId) {
      updates['selectionGuide.image'] = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: selectionGuideImageId,
        },
        alt: '講座の選び方ガイド',
      }
    }

    if (step1ImageId && schoolPage.learningFlow?.steps?.[0]) {
      updates['learningFlow.steps[0].image'] = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: step1ImageId,
        },
        alt: 'ステップ1: 基礎講座で土台を作る',
      }
    }

    if (step2ImageId && schoolPage.learningFlow?.steps?.[1]) {
      updates['learningFlow.steps[1].image'] = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: step2ImageId,
        },
        alt: 'ステップ2: 応用講座でスキルを深める',
      }
    }

    if (step3ImageId && schoolPage.learningFlow?.steps?.[2]) {
      updates['learningFlow.steps[2].image'] = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: step3ImageId,
        },
        alt: 'ステップ3: 発展講座でプロフェッショナルへ',
      }
    }

    if (step4ImageId && schoolPage.learningFlow?.steps?.[3]) {
      updates['learningFlow.steps[3].image'] = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: step4ImageId,
        },
        alt: 'ステップ4: 継続的な学びとコミュニティ',
      }
    }

    if (certificationImageId) {
      updates['certification.image'] = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: certificationImageId,
        },
        alt: '資格・認定について',
      }
    }

    // 更新を実行
    await client.patch(schoolPage._id).set(updates).commit()

    console.log('\n✅ すべての画像の追加が完了しました！')
    console.log('\n📊 追加された画像:')
    console.log(`   ✅ 講座の選び方ガイド: ${selectionGuideImageId ? '成功' : '失敗'}`)
    console.log(`   ✅ ステップ1: ${step1ImageId ? '成功' : '失敗'}`)
    console.log(`   ✅ ステップ2: ${step2ImageId ? '成功' : '失敗'}`)
    console.log(`   ✅ ステップ3: ${step3ImageId ? '成功' : '失敗'}`)
    console.log(`   ✅ ステップ4: ${step4ImageId ? '成功' : '失敗'}`)
    console.log(`   ✅ 資格・認定: ${certificationImageId ? '成功' : '失敗'}`)
    console.log('\n🎉 スクールページのピラーコンテンツが完成しました！')

  } catch (error) {
    console.error('❌ エラーが発生しました:', error)
    process.exit(1)
  }
}

main()
