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

async function checkInstructors() {
  try {
    const instructors = await client.fetch(
      `*[_type == "instructor" && region == "北海道"] | order(order asc) {
        _id,
        name,
        "slug": slug.current,
        region,
        order
      }`
    )

    console.log('北海道のインストラクター:')
    console.log(JSON.stringify(instructors, null, 2))
  } catch (error) {
    console.error('Error:', error)
  }
}

checkInstructors()
