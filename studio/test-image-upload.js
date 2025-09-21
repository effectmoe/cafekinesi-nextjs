import {createClient} from '@sanity/client'
import fs from 'fs'

const client = createClient({
  projectId: 'e4aqw590',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: 'skmH5807aTZkc80e9wXtUGh6YGxvS9fmTcsxwG0vDPy9XPJ3lTpX7wYmAXl5SKy1HEOllZf3NDEg1ULmn'
})

// 画像をアップロードしてテスト記事を更新
async function uploadAndTest() {
  try {
    // blog-7.webp画像をアップロード
    const imagePath = '../src/assets/blog-7.webp'

    if (!fs.existsSync(imagePath)) {
      console.log('画像ファイルが見つかりません:', imagePath)
      return
    }

    console.log('画像をアップロード中...')
    const imageAsset = await client.assets.upload('image', fs.createReadStream(imagePath), {
      filename: 'blog-7.webp'
    })

    console.log('画像アップロード成功:', imageAsset._id)

    // テスト記事に画像を追加
    const updatedPost = await client
      .patch('XAQEqtwWGfwaiZX4sDipwF') // マーカーテスト記事のID
      .set({
        mainImage: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset._id
          }
        }
      })
      .commit()

    console.log('記事更新成功:', updatedPost._id)
    console.log('画像付きテスト記事: http://localhost:8083/blog/marker-test-post')

  } catch (error) {
    console.error('エラー:', error)
  }
}

uploadAndTest()