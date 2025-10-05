import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const INSTRUCTORS_QUERY = `
  *[_type == "instructor" && isActive == true] | order(order asc) {
    _id,
    name,
    slug,
    title,
    image {
      asset->,
      alt
    },
    bio,
    region,
    specialties,
    order,
    isActive,
    featured
  }
`

async function checkPageData() {
  try {
    const data = await client.fetch(INSTRUCTORS_QUERY)

    console.log('全インストラクターデータ:')
    console.log(JSON.stringify(data, null, 2))

    // 北海道でフィルター
    const hokkaido = data.filter((i: any) => i.region === '北海道')

    console.log('\n\n北海道のインストラクター（フィルター後）:')
    hokkaido.forEach((i: any) => {
      console.log(`\nName: ${i.name}`)
      console.log(`Slug: ${JSON.stringify(i.slug)}`)
      console.log(`Region: ${i.region}`)
    })
  } catch (error) {
    console.error('Error:', error)
  }
}

checkPageData()
