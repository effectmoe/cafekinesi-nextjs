import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import * as dotenv from 'dotenv'

// 環境変数を読み込み
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'e4aqw590',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
})

// 画像をアップロードする関数
async function uploadImage(imagePath: string, alt: string): Promise<any> {
  const fullPath = path.join(process.cwd(), 'public', imagePath)

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️ Image not found: ${fullPath}`)
    return null
  }

  try {
    const imageBuffer = fs.readFileSync(fullPath)
    const uploadedImage = await client.assets.upload('image', imageBuffer, {
      filename: path.basename(imagePath)
    })

    console.log(`✅ Uploaded image: ${imagePath}`)
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: uploadedImage._id
      },
      alt: alt
    }
  } catch (error) {
    console.error(`❌ Failed to upload image: ${imagePath}`, error)
    return null
  }
}

async function updateHomepageImages() {
  console.log('🌱 Updating homepage with images...')

  try {
    // 画像をアップロード
    console.log('📷 Uploading images...')
    const aboutImage = await uploadImage('images/about.webp', 'カフェキネシについて')
    const schoolImage = await uploadImage('images/school.webp', 'スクール')
    const instructorImage = await uploadImage('images/instructor.webp', 'インストラクター')
    const blogImage = await uploadImage('images/blog.webp', 'ブログ')
    const aromaImage = await uploadImage('images/aroma.webp', 'アロマ')
    const memberImage = await uploadImage('images/member.webp', 'メンバー')

    // ホームページデータを更新（createOrReplaceを使用）
    const homepageData = {
      _id: 'homepage',
      _type: 'homepage',
      title: 'Cafe Kinesi',
      categoryCards: [
        {
          _key: 'card-1',
          _type: 'categoryCard',
          titleJa: 'カフェキネシについて',
          titleEn: 'About Cafe Kinesi',
          image: aboutImage,
          colorScheme: 'album-beige',
          link: '/about',
          displayOrder: 1
        },
        {
          _key: 'card-2',
          _type: 'categoryCard',
          titleJa: 'スクール',
          titleEn: 'School',
          image: schoolImage,
          colorScheme: 'album-blue-gray',
          link: '/school',
          displayOrder: 2
        },
        {
          _key: 'card-3',
          _type: 'categoryCard',
          titleJa: 'インストラクター',
          titleEn: 'Instructor',
          image: instructorImage,
          colorScheme: 'album-light-gray',
          link: '#',
          displayOrder: 3
        },
        {
          _key: 'card-4',
          _type: 'categoryCard',
          titleJa: 'ブログ',
          titleEn: 'Blog',
          image: blogImage,
          colorScheme: 'album-purple',
          link: '/blog',
          displayOrder: 4
        },
        {
          _key: 'card-5',
          _type: 'categoryCard',
          titleJa: 'アロマ',
          titleEn: 'Aroma',
          image: aromaImage,
          colorScheme: 'album-teal',
          link: '#',
          displayOrder: 5
        },
        {
          _key: 'card-6',
          _type: 'categoryCard',
          titleJa: 'メンバー',
          titleEn: 'Member',
          image: memberImage,
          colorScheme: 'album-pink', // 6番目の独自色
          link: '#',
          displayOrder: 6
        }
      ],
      blogSection: {
        _type: 'blogSection',
        title: '最新の記事',
        showLatestPosts: true,
        numberOfPosts: 3
      },
      socialLinks: [
        {
          _key: 'facebook',
          _type: 'socialLink',
          platform: 'facebook',
          url: 'https://www.facebook.com/cafekinesi',
          label: 'Facebook'
        },
        {
          _key: 'instagram',
          _type: 'socialLink',
          platform: 'instagram',
          url: 'https://www.instagram.com/cafekinesi',
          label: 'Instagram'
        }
      ],
      viewAllButton: {
        _type: 'viewAllButton',
        text: 'View All',
        link: '/blog'
      },
      seo: {
        _type: 'seo',
        title: 'Cafe Kinesi - 心と体を癒すアロマテラピーカフェ',
        description: 'アロマテラピーとキネシオロジーが融合した癒しの空間。オーガニック食材を使用したカフェメニューもご用意。',
        keywords: 'アロマテラピー, キネシオロジー, オーガニックカフェ, 癒し, リラクゼーション'
      }
    }

    // ホームページドキュメントを更新
    console.log('📝 Updating homepage document...')
    const result = await client.createOrReplace(homepageData)
    console.log('✅ Homepage updated with images:', result._id)

  } catch (error) {
    console.error('❌ Error updating homepage:', error)
    if (error instanceof Error && 'response' in error) {
      console.error('Response:', (error as any).response)
    }
  }
}

// スクリプトを実行
updateHomepageImages()