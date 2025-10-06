import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function checkAboutPageData() {
  console.log('📝 Aboutページデータを確認中...\n')

  try {
    const aboutPage = await client.fetch(`*[_type == "aboutPage"][0]{
      _id,
      title,
      isActive,
      heroSection,
      "tocCount": count(tableOfContents),
      "sectionCount": count(sections)
    }`)

    if (!aboutPage) {
      console.log('❌ Aboutページデータが見つかりません')
      return
    }

    console.log('✅ Aboutページデータが存在します:')
    console.log(JSON.stringify(aboutPage, null, 2))
  } catch (error) {
    console.error('❌ エラー:', error)
  }
}

checkAboutPageData()
