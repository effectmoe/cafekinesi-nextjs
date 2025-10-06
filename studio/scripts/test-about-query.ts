import { getCliClient } from 'sanity/cli'

const client = getCliClient()

// page.tsxで使用しているのと同じクエリ
const ABOUT_PAGE_QUERY = `
  *[_type == "aboutPage"][0] {
    _id,
    title,
    heroSection {
      image {
        asset-> {
          _id,
          url
        },
        alt
      },
      title,
      subtitle
    },
    tableOfContents[] {
      text,
      link
    },
    sections[] {
      id,
      title,
      layout,
      image {
        asset-> {
          _id,
          url
        },
        alt
      },
      content,
      highlightBox {
        show,
        content
      },
      cards[] {
        number,
        title,
        description,
        bgColor,
        customBgColor
      }
    },
    seo {
      title,
      description,
      keywords,
      ogImage {
        asset->
      }
    },
    isActive
  }
`

async function testQuery() {
  console.log('📝 GROQクエリをテスト中...\n')

  try {
    const data = await client.fetch(ABOUT_PAGE_QUERY)

    console.log('✅ クエリ結果:')
    console.log(JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('❌ クエリエラー:', error)
  }
}

testQuery()
