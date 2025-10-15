import OpenAI from 'openai'
import { createClient } from '@sanity/client'
import { config } from 'dotenv'
import { resolve } from 'path'
import * as fs from 'fs'
import * as path from 'path'

// 環境変数を読み込む
config({ path: resolve(__dirname, '../.env.local') })

// OpenAI クライアント
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Sanity クライアント
const sanityClient = createClient({
  projectId: 'e4aqw590',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
})

// 画像プロンプト定義
const imagePrompts = [
  {
    name: 'hero-image',
    prompt: 'A serene and professional scene of a Japanese therapy session using kinesiology muscle testing. A therapist gently testing a client\'s arm muscle response in a bright, peaceful room with natural light. The atmosphere is calm and healing. Professional photography style, soft lighting, modern Japanese aesthetic.',
    description: 'カフェキネシⅠのヒーロー画像 - セラピーセッション'
  },
  {
    name: 'muscle-testing',
    prompt: 'Close-up professional photograph of hands performing kinesiology muscle testing on an arm. Gentle, precise hand placement demonstrating the muscle reflex test technique. Clean white background, educational style, clear and detailed.',
    description: '筋肉反射テストのクローズアップ画像'
  },
  {
    name: 'classroom-scene',
    prompt: 'A small group of 6-8 Japanese students in a bright, modern classroom practicing kinesiology techniques together. Students are paired up, learning muscle testing on each other. The instructor is guiding them warmly. Natural light, comfortable learning environment.',
    description: '少人数制の講座風景'
  },
  {
    name: 'certification',
    prompt: 'An elegant Japanese-style certificate for Cafe Kinesiology Level 1 completion, displayed on a beautiful wooden desk with soft natural lighting. The certificate has traditional Japanese design elements with modern touches. Professional and prestigious appearance.',
    description: '修了証書のイメージ'
  },
  {
    name: 'energy-work',
    prompt: 'Abstract artistic representation of energy flow and chakras in the human body. Soft, glowing energy points along the body\'s meridian system. Peaceful colors (blues, purples, greens), spiritual and healing atmosphere. Modern minimalist Japanese art style.',
    description: 'エネルギーワーク・チャクラのイメージ'
  }
]

async function generateImage(imageConfig: typeof imagePrompts[0]) {
  console.log(`\n🎨 画像生成中: ${imageConfig.description}`)
  console.log(`📝 プロンプト: ${imageConfig.prompt.substring(0, 100)}...`)

  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: imageConfig.prompt,
      n: 1,
      size: '1792x1024', // Wide format for hero images
      quality: 'hd',
      style: 'natural'
    })

    const imageUrl = response.data[0].url
    if (!imageUrl) {
      throw new Error('画像URLが取得できませんでした')
    }

    console.log(`✅ 画像生成成功: ${imageUrl}`)
    return imageUrl
  } catch (error) {
    console.error(`❌ 画像生成エラー (${imageConfig.name}):`, error)
    throw error
  }
}

async function downloadImage(url: string, filename: string): Promise<string> {
  console.log(`📥 画像をダウンロード中: ${filename}`)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`画像ダウンロード失敗: ${response.statusText}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const outputDir = path.join(__dirname, '../public/generated-images')

  // ディレクトリが存在しない場合は作成
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const filepath = path.join(outputDir, filename)
  fs.writeFileSync(filepath, buffer)

  console.log(`✅ ダウンロード完了: ${filepath}`)
  return filepath
}

async function uploadToSanity(filepath: string, filename: string): Promise<string> {
  console.log(`☁️  Sanityにアップロード中: ${filename}`)

  try {
    const imageBuffer = fs.readFileSync(filepath)

    const asset = await sanityClient.assets.upload('image', imageBuffer, {
      filename: filename,
    })

    console.log(`✅ Sanityアップロード成功: ${asset._id}`)
    return asset._id
  } catch (error) {
    console.error(`❌ Sanityアップロードエラー:`, error)
    throw error
  }
}

async function main() {
  console.log('🚀 カフェキネシⅠ クラスターページ用画像生成開始\n')
  console.log(`📊 生成画像数: ${imagePrompts.length}枚`)
  console.log('⏳ 処理には数分かかる場合があります...\n')

  const results: Array<{
    name: string
    description: string
    imageUrl: string
    localPath: string
    sanityAssetId?: string
  }> = []

  for (const imageConfig of imagePrompts) {
    try {
      // 1. AI画像生成
      const imageUrl = await generateImage(imageConfig)

      // 2. ローカルにダウンロード
      const filename = `${imageConfig.name}.png`
      const localPath = await downloadImage(imageUrl, filename)

      // 3. Sanityにアップロード（オプション）
      let sanityAssetId: string | undefined
      try {
        sanityAssetId = await uploadToSanity(localPath, filename)
      } catch (uploadError) {
        console.warn(`⚠️  Sanityアップロードをスキップしました: ${imageConfig.name}`)
      }

      results.push({
        name: imageConfig.name,
        description: imageConfig.description,
        imageUrl,
        localPath,
        sanityAssetId
      })

      // API レート制限を避けるため、少し待機
      console.log('⏸️  次の画像生成まで5秒待機...\n')
      await new Promise(resolve => setTimeout(resolve, 5000))

    } catch (error) {
      console.error(`❌ エラー (${imageConfig.name}):`, error)
    }
  }

  // 結果サマリー
  console.log('\n' + '='.repeat(60))
  console.log('📋 生成結果サマリー')
  console.log('='.repeat(60))

  results.forEach((result, index) => {
    console.log(`\n${index + 1}. ${result.description}`)
    console.log(`   名前: ${result.name}`)
    console.log(`   ローカル: ${result.localPath}`)
    if (result.sanityAssetId) {
      console.log(`   Sanity ID: ${result.sanityAssetId}`)
    }
  })

  console.log('\n' + '='.repeat(60))
  console.log(`✅ 完了: ${results.length}/${imagePrompts.length}枚の画像を生成しました`)
  console.log('='.repeat(60))

  // 結果をJSONファイルに保存
  const resultFilePath = path.join(__dirname, '../public/generated-images/results.json')
  fs.writeFileSync(resultFilePath, JSON.stringify(results, null, 2))
  console.log(`\n💾 結果を保存: ${resultFilePath}`)

  console.log('\n次のステップ:')
  console.log('1. 生成された画像を確認: /public/generated-images/')
  console.log('2. Sanity Studioで画像を確認')
  console.log('3. scripts/update-cluster-images.ts を実行してクラスターページに画像を追加')
}

// スクリプト実行
main()
  .then(() => {
    console.log('\n🎉 すべての処理が完了しました！')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 処理が失敗しました:', error)
    process.exit(1)
  })
