import { config } from 'dotenv'
import { schemaGenerator } from '../lib/schema-generator'
import { createClient } from '@sanity/client'

// .env.localファイルを明示的に読み込み
config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: false,
})

async function testSchemaGenerator() {
  console.log('🧪 Testing Schema.org Generator...\n')

  try {
    // 1. 講座データを取得
    console.log('📚 Fetching course data...')
    const courses = await client.fetch('*[_type == "course" && isActive == true][0...2]')

    if (courses.length === 0) {
      console.log('⚠️  No active courses found')
    } else {
      console.log(`✅ Found ${courses.length} courses\n`)

      courses.forEach((course: any, index: number) => {
        console.log(`\n${'='.repeat(60)}`)
        console.log(`📖 Course ${index + 1}: ${course.title}`)
        console.log('='.repeat(60))

        const schema = schemaGenerator.generate(course)
        console.log('\n✅ Generated Schema.org:')
        console.log(JSON.stringify(schema, null, 2))
      })
    }

    // 2. インストラクターデータを取得
    console.log('\n\n👥 Fetching instructor data...')
    const instructors = await client.fetch('*[_type == "instructor" && isActive == true][0...2]')

    if (instructors.length === 0) {
      console.log('⚠️  No active instructors found')
    } else {
      console.log(`✅ Found ${instructors.length} instructors\n`)

      instructors.forEach((instructor: any, index: number) => {
        console.log(`\n${'='.repeat(60)}`)
        console.log(`👤 Instructor ${index + 1}: ${instructor.name}`)
        console.log('='.repeat(60))

        const schema = schemaGenerator.generate(instructor)
        console.log('\n✅ Generated Schema.org:')
        console.log(JSON.stringify(schema, null, 2))
      })
    }

    console.log('\n\n🎉 Schema.org Generator test completed!')
    console.log('\n💡 Next steps:')
    console.log('  1. Verify Schema.org output at https://validator.schema.org/')
    console.log('  2. Implement Webhook to auto-generate structuredData field')
    console.log('  3. Sync to Vector DB with DeepSeek embeddings')

  } catch (error) {
    console.error('\n❌ Test failed:', error)
    throw error
  }
}

testSchemaGenerator()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
