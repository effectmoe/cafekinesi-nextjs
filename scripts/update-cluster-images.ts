import { createClient } from '@sanity/client'
import { config } from 'dotenv'
import { resolve } from 'path'
import * as fs from 'fs'
import * as path from 'path'

// 環境変数を読み込む
config({ path: resolve(__dirname, '../.env.local') })

// Sanity クライアント
const sanityClient = createClient({
  projectId: 'e4aqw590',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
})

const CLUSTER_PAGE_ID = '62639a78-3cd2-43df-b7e7-0bf59c2ec20f'

async function updateClusterPageImages() {
  console.log('🚀 クラスターページに画像を追加中...\n')

  try {
    // results.jsonを読み込む
    const resultsPath = path.join(__dirname, '../public/generated-images/results.json')

    if (!fs.existsSync(resultsPath)) {
      throw new Error('results.json が見つかりません。先に generate-cluster-images.ts を実行してください。')
    }

    const results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'))
    console.log(`📊 ${results.length}枚の画像情報を読み込みました`)

    // ヒーロー画像を特定
    const heroImage = results.find((r: any) => r.name === 'hero-image')
    if (!heroImage || !heroImage.sanityAssetId) {
      throw new Error('ヒーロー画像が見つかりません')
    }

    // ギャラリー画像を特定
    const galleryImages = results
      .filter((r: any) => r.name !== 'hero-image' && r.sanityAssetId)
      .map((r: any) => ({
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: r.sanityAssetId
        },
        alt: r.description
      }))

    console.log(`🖼️  ヒーロー画像: ${heroImage.description}`)
    console.log(`🖼️  ギャラリー画像: ${galleryImages.length}枚`)

    // クラスターページを更新
    const updateData = {
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: heroImage.sanityAssetId
        },
        alt: heroImage.description
      },
      gallery: galleryImages
    }

    console.log('\n⏳ Sanityに反映中...')

    await sanityClient
      .patch(CLUSTER_PAGE_ID)
      .set(updateData)
      .commit()

    console.log('✅ クラスターページの更新に成功しました！')
    console.log(`\n🔗 Sanity Studio: https://cafekinesi.sanity.studio/structure/course;kinesi1-cluster`)
    console.log('\n📸 追加した画像:')
    console.log(`   - ヒーロー画像: ${heroImage.description}`)
    galleryImages.forEach((img, index) => {
      console.log(`   - ギャラリー ${index + 1}: ${img.alt}`)
    })

  } catch (error) {
    console.error('❌ エラーが発生しました:', error)
    throw error
  }
}

// スクリプト実行
updateClusterPageImages()
  .then(() => {
    console.log('\n🎉 すべての処理が完了しました！')
    console.log('\n次のステップ:')
    console.log('1. Sanity Studioで画像を確認')
    console.log('2. Vercelにデプロイして本番環境で確認')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 処理が失敗しました:', error)
    process.exit(1)
  })
