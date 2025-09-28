import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'

const client = createClient({
  projectId: 'e4aqw590',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN || process.env.NEXT_PUBLIC_SANITY_API_TOKEN
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

async function seedHomepage() {
  console.log('🌱 Seeding homepage data...')

  try {
    // 画像をアップロード
    console.log('📷 Uploading images...')
    const aboutImage = await uploadImage('images/about.webp', 'カフェキネシについて')
    const schoolImage = await uploadImage('images/school.webp', 'スクール')
    const instructorImage = await uploadImage('images/instructor.webp', 'インストラクター')
    const blogImage = await uploadImage('images/blog.webp', 'ブログ')
    const aromaImage = await uploadImage('images/aroma.webp', 'アロマ')
    const memberImage = await uploadImage('images/member.webp', 'メンバー')

    // 既存のホームページドキュメントを削除
    console.log('🗑️ Removing existing homepage documents...')
    await client.delete({ query: '*[_type == "homepage"]' })

    // ホームページデータを作成
    const homepageData = {
      _type: 'homepage',
      title: 'カフェキネシ - Cafe Kinesi',
      categoryCards: [
        {
          _type: 'categoryCard',
          titleJa: 'カフェキネシについて',
          titleEn: 'About Cafe Kinesi',
          image: aboutImage,
          colorScheme: 'album-beige',
          link: '/about',
          isActive: true,
          order: 1
        },
        {
          _type: 'categoryCard',
          titleJa: 'スクール',
          titleEn: 'School',
          image: schoolImage,
          colorScheme: 'album-blue-gray',
          link: '/school',
          isActive: false,
          order: 2
        },
        {
          _type: 'categoryCard',
          titleJa: 'インストラクター',
          titleEn: 'Instructor',
          image: instructorImage,
          colorScheme: 'album-light-gray',
          link: '/instructor',
          isActive: false,
          order: 3
        },
        {
          _type: 'categoryCard',
          titleJa: 'ブログ',
          titleEn: 'Blog',
          image: blogImage,
          colorScheme: 'album-purple',
          link: '/blog',
          isActive: true,
          order: 4
        },
        {
          _type: 'categoryCard',
          titleJa: 'アロマ',
          titleEn: 'Aroma',
          image: aromaImage,
          colorScheme: 'album-teal',
          link: '/aroma',
          isActive: false,
          order: 5
        },
        {
          _type: 'categoryCard',
          titleJa: 'メンバー',
          titleEn: 'Member',
          image: memberImage,
          colorScheme: 'album-light-gray',
          link: '/member',
          isActive: false,
          order: 6
        }
      ].filter(card => card.image !== null), // 画像のアップロードに失敗したカードは除外
      blogSection: {
        _type: 'object',
        sectionTitle: 'ブログ',
        displayCount: 9,
        showAllButton: true,
        noPostsMessage: '記事がまだありません'
      },
      socialLinks: [
        {
          _type: 'socialLink',
          platform: 'Facebook',
          url: 'https://facebook.com/cafekinesi',
          displayText: 'Facebook',
          isActive: true,
          order: 1
        },
        {
          _type: 'socialLink',
          platform: 'Instagram',
          url: 'https://instagram.com/cafekinesi',
          displayText: 'Instagram',
          isActive: true,
          order: 2
        },
        {
          _type: 'socialLink',
          platform: 'Twitter',
          url: 'https://twitter.com/cafekinesi',
          displayText: 'Twitter',
          isActive: true,
          order: 3
        },
        {
          _type: 'socialLink',
          platform: 'YouTube',
          url: 'https://youtube.com/cafekinesi',
          displayText: 'YouTube',
          isActive: true,
          order: 4
        },
        {
          _type: 'socialLink',
          platform: 'Bandcamp',
          url: 'https://bandcamp.com/cafekinesi',
          displayText: 'Bandcamp',
          isActive: true,
          order: 5
        }
      ],
      viewAllButton: {
        _type: 'object',
        show: true,
        text: 'View All →',
        link: '#'
      }
    }

    // 新しいホームページドキュメントを作成
    console.log('📝 Creating homepage document...')
    const result = await client.create(homepageData)
    console.log('✅ Homepage created:', result._id)

  } catch (error) {
    console.error('❌ Error seeding homepage:', error)
  }
}

// スクリプトを実行
if (require.main === module) {
  seedHomepage()
}