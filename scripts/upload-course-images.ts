import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

// 環境変数を読み込み
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_WRITE_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// 講座IDと画像ファイル名のマッピング
const courseImageMapping = {
  'kinesi1': 'kinesi1.webp',
  'peach-touch': 'peach-touch.webp',
  'chakra-kinesi': 'chakra.webp',
  'help': 'help.webp',
  'tao': 'tao.webp',
  'happy-aura': 'happy-aura.webp'
}

// 講座タイトルのマッピング（alt text用）
const courseTitleMapping = {
  'kinesi1': 'カフェキネシⅠ ハンドアウト',
  'peach-touch': 'カフェキネシⅡ ピーチタッチ ハンドアウト',
  'chakra-kinesi': 'カフェキネシⅢ チャクラキネシ',
  'help': 'カフェキネシⅣ HELP',
  'tao': 'カフェキネシⅤ TAO',
  'happy-aura': 'カフェキネシⅥ ハッピーオーラ'
}

async function uploadCourseImages() {
  try {
    console.log('🚀 講座画像をSanityにアップロード開始...\n')

    const imagesDir = path.join(process.cwd(), 'public', 'images', 'school')

    for (const [courseId, imageName] of Object.entries(courseImageMapping)) {
      console.log(`\n📋 処理中: ${courseId} (${imageName})`)

      // 画像ファイルのパス
      const imagePath = path.join(imagesDir, imageName)

      if (!fs.existsSync(imagePath)) {
        console.log(`  ⚠️  画像ファイルが見つかりません: ${imagePath}`)
        continue
      }

      // Sanityから講座データを取得
      const existingCourse = await client.fetch(
        `*[_type == "course" && courseId == $courseId][0]`,
        { courseId }
      )

      if (!existingCourse) {
        console.log(`  ⚠️  講座データが見つかりません: ${courseId}`)
        continue
      }

      // 既に画像が設定されている場合はスキップ
      if (existingCourse.image?.asset?._ref) {
        console.log(`  ℹ️  画像は既に設定されています`)
        continue
      }

      // 画像をアップロード
      console.log('  → 画像をアップロード中...')
      const imageBuffer = fs.readFileSync(imagePath)
      const uploadedImage = await client.assets.upload('image', imageBuffer, {
        filename: imageName,
        contentType: 'image/webp'
      })

      console.log(`  ✅ 画像アップロード完了: ${uploadedImage._id}`)

      // 講座データに画像を設定
      console.log('  → 講座データに画像を設定中...')
      await client
        .patch(existingCourse._id)
        .set({
          image: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: uploadedImage._id
            },
            alt: courseTitleMapping[courseId as keyof typeof courseTitleMapping]
          }
        })
        .commit()

      console.log('  ✅ 講座データ更新完了')
    }

    console.log('\n' + '='.repeat(60))
    console.log('🎉 すべての講座画像のアップロードが完了しました！')
    console.log('='.repeat(60))

    console.log('\n🔗 確認方法:')
    console.log('1. Sanity Studio: http://localhost:3333/')
    console.log('2. WEBページ: https://cafekinesi-nextjs.vercel.app/school')

  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error)
    if (error instanceof Error) {
      console.error('エラーメッセージ:', error.message)
      console.error('\nヒント:')
      console.error('1. SANITY_WRITE_TOKENが設定されているか確認')
      console.error('2. 画像ファイルが存在するか確認')
      console.error('3. ネットワーク接続を確認')
    }
  }
}

// スクリプトを実行
uploadCourseImages()