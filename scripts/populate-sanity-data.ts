import { createClient } from '@sanity/client'

const token = process.env.SANITY_API_TOKEN

if (!token) {
  console.error('❌ SANITY_API_TOKENが設定されていません')
  console.log('\n📝 トークンの取得方法:')
  console.log('1. https://www.sanity.io/manage にアクセス')
  console.log('2. プロジェクト "Cafe Kinesi" を選択')
  console.log('3. API → Tokens → Add API token')
  console.log('4. 名前: "Data Import", 権限: "Editor" で作成')
  console.log('5. 生成されたトークンを以下のように実行:')
  console.log('   SANITY_API_TOKEN=your_token_here npm run populate-sanity')
  process.exit(1)
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'e4aqw590',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

async function populateHomepageNavigationMenu() {
  console.log('📝 ハンバーガーメニューデータを投入中...')

  // 既存のhomepageドキュメントを取得
  const homepage = await client.fetch(`*[_type == "homepage"][0]`)

  if (!homepage) {
    console.error('❌ ホームページドキュメントが見つかりません')
    return
  }

  // ハンバーガーメニューの既存データ
  const navigationMenu = [
    { label: "カフェキネシについて", link: "/#about-section", order: 1, isActive: true },
    { label: "スクール", link: "/school", order: 2, isActive: true },
    { label: "インストラクター", link: "/instructor", order: 3, isActive: true },
    { label: "ブログ", link: "/blog", order: 4, isActive: true },
    { label: "アロマ", link: "/#aroma", order: 5, isActive: true },
    { label: "メンバー", link: "#", order: 6, isActive: true }
  ]

  // ホームページを更新
  await client
    .patch(homepage._id)
    .set({ navigationMenu })
    .commit()

  console.log('✅ ハンバーガーメニューデータを投入完了')
}

async function populateAboutPage() {
  console.log('📝 Aboutページデータを投入中...')

  const aboutPageData = {
    _type: 'aboutPage',
    _id: 'aboutPage',
    title: 'カフェキネシについて',
    heroSection: {
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: 'image-placeholder'
        },
        alt: 'カフェキネシの世界へようこそ'
      },
      title: 'カフェキネシのページにようこそ',
      subtitle: 'だれでもどこでも簡単にできるキネシオロジーとアロマを使った健康法'
    },
    tableOfContents: [
      { text: "1. カフェキネシとは", link: "#what-is-cafekinesi" },
      { text: "2. カフェキネシの歴史", link: "#history" },
      { text: "3. カフェキネシの特長", link: "#features" },
      { text: "4. カフェキネシの動画を見る", link: "#video" },
      { text: "5. カフェキネシの夢", link: "#dream" },
      { text: "6. カフェキネシ講座を受講する", link: "#course" },
      { text: "7. 公認インストラクターを探す", link: "#instructors" },
      { text: "8. アロマを購入する", link: "#aroma" }
    ],
    sections: [
      // Section 1: What is Cafe Kinesi
      {
        id: 'what-is-cafekinesi',
        title: 'カフェキネシとは',
        layout: 'image-left',
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: 'image-placeholder'
          },
          alt: 'カフェキネシセラピー'
        },
        content: [
          {
            _type: 'block',
            style: 'normal',
            children: [
              { _type: 'span', text: 'カフェキネシとは「カフェで出来るキネシオロジー」です。', marks: ['strong'] }
            ]
          },
          {
            _type: 'block',
            style: 'normal',
            children: [
              { _type: 'span', text: 'だれでもどこでも簡単にできるキネシオロジーとアロマを使った健康法です。' }
            ]
          },
          {
            _type: 'block',
            style: 'normal',
            children: [
              { _type: 'span', text: '誰でもどこでもその場でストレスが取れる、キネシアロマを使った世界最速のキネシセラピーです。' }
            ]
          },
          {
            _type: 'block',
            style: 'normal',
            children: [
              { _type: 'span', text: '世界初、最高に便利で簡単なキネシオロジー。' }
            ]
          }
        ],
        highlightBox: {
          show: true,
          content: [
            {
              _type: 'block',
              style: 'normal',
              children: [
                { _type: 'span', text: 'セラピストでなくても大丈夫。必要なのはあなたの愛とあなたの手。' }
              ]
            },
            {
              _type: 'block',
              style: 'normal',
              children: [
                { _type: 'span', text: 'カフェキネシはまだ発表されたばかりのセラピースタイルです。わずか2時間でカフェキネシを使ってセラピーが出来るようになります。またカフェキネシを教えることが出来るようになります。' }
              ]
            },
            {
              _type: 'block',
              style: 'normal',
              children: [
                { _type: 'span', text: 'セラピーをしながら世界へ「カフェキネシ」を伝えませんか？', marks: ['strong'] }
              ]
            }
          ]
        }
      },
      // Section 2: History
      {
        id: 'history',
        title: 'カフェキネシの歴史',
        layout: 'image-right',
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: 'image-placeholder'
          },
          alt: 'リトルトリー'
        },
        content: [
          {
            _type: 'block',
            style: 'normal',
            children: [
              { _type: 'span', text: 'キネシオロジーというセラピーをもっとフェア（公平）に簡単に楽しみながら出来るようにならないかな？' }
            ]
          },
          {
            _type: 'block',
            style: 'normal',
            children: [
              { _type: 'span', text: 'シンプルだけど、効果があるようなものを作れないかな？' }
            ]
          },
          {
            _type: 'block',
            style: 'normal',
            children: [
              { _type: 'span', text: 'そんな事を思って、2010年2月にカフェキネシの取り組みをはじめました。', marks: ['strong'] }
            ]
          },
          {
            _type: 'block',
            style: 'normal',
            children: [
              { _type: 'span', text: '使いやすさと、数々の臨床を重ねて発表になったのは2011年2月。' }
            ]
          },
          {
            _type: 'block',
            style: 'normal',
            children: [
              { _type: 'span', text: 'どこでも誰でもすぐにセラピストになれるカフェキネシオロジーとアロマの力で、どんどん身近なストレスを取っていくことが出来ます。' }
            ]
          },
          {
            _type: 'block',
            style: 'normal',
            children: [
              { _type: 'span', text: 'ひとつのストレスの解決まで、約3分。', marks: ['strong'] }
            ]
          },
          {
            _type: 'block',
            style: 'normal',
            children: [
              { _type: 'span', text: 'ストレスって毎日あるけど、毎日セラピー行けないものね。友達とカフェでおしゃべりしながら、アロマの香りでストレス取りしましょ♪' }
            ]
          }
        ]
      },
      // Section 3: Features
      {
        id: 'features',
        title: 'カフェキネシの特長',
        layout: 'cards',
        cards: [
          {
            number: 1,
            title: '初心者でも２時間あればインストラクターになれる！',
            description: '初心者でも約２時間の講座をうけたらインストラクター登録可能です。２つのタイプから自分に合うインストラクター登録ができるので負担もかかりません！',
            bgColor: 'bg-[hsl(var(--brand-teal))]'
          },
          {
            number: 2,
            title: '潜在意識を呼び起こすアロマでストレスやトラウマを取り除く',
            description: '一つ一つ思いがこめられているアロマは自然の植物のエキスで作成されています。あなたの潜在意識が目を覚まし、あなたがあなたらしく生きられるようにサポートします。',
            bgColor: 'bg-[hsl(var(--brand-purple))]'
          },
          {
            number: 3,
            title: '必要なのはたった３つ。手とアロマ、そしてあなたの愛',
            description: 'カフェキネシでは、たくさんの物が必要というわけではありません。手とアロマ、そしてあなたの愛があれば、苦しみや悲しみを吹き飛ばし、夢や愛を広げるお手伝いができます。',
            bgColor: 'bg-[hsl(var(--brand-blue-gray))]'
          },
          {
            number: 4,
            title: 'どこでもできるので、お家でサロンができちゃいます。',
            description: 'カフェキネシは現在５シリーズあり、すべて２時間程度でインストラクターになれます。公認インストラクターになると、アドバンス版の講座も開催できるようになります。',
            bgColor: 'bg-[hsl(var(--brand-beige))]'
          },
          {
            number: 5,
            title: '世界中にインストラクターがいるので、近くで学べます。',
            description: '日本国内はもちろん、アメリカ、ヨーロッパ、アジアなど世界中にインストラクターがいますので、お近くのインストラクターを探すことができます。',
            bgColor: 'custom',
            customBgColor: 'hsl(180_25%_35%)'
          },
          {
            number: 6,
            title: '国境を越えたセラピー。世界中で通じるセラピーが学べます。',
            description: 'セラピーの原理は世界中どこでも変わりません。言葉が通じなくても、キネシオロジーは世界共通です。世界中どこでも通じるセラピーを身につけることができます。',
            bgColor: 'custom',
            customBgColor: 'hsl(260_20%_65%)'
          }
        ]
      }
    ],
    isActive: true,
    seo: {
      title: 'カフェキネシについて | Cafe Kinesi',
      description: 'カフェキネシとは「カフェで出来るキネシオロジー」です。だれでもどこでも簡単にできるキネシオロジーとアロマを使った健康法について詳しくご紹介します。',
      keywords: 'カフェキネシ, キネシオロジー, アロマテラピー, ストレス解消, セラピー'
    }
  }

  try {
    // createOrReplaceを使用して既存データがあれば上書き
    await client.createOrReplace(aboutPageData)
    console.log('✅ Aboutページデータを投入完了')
  } catch (error) {
    console.error('❌ Aboutページデータ投入エラー:', error)
  }
}

async function main() {
  console.log('🚀 Sanityデータ投入を開始...\n')

  try {
    await populateHomepageNavigationMenu()
    console.log('')
    await populateAboutPage()
    console.log('\n✨ すべてのデータ投入が完了しました！')
  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error)
    process.exit(1)
  }
}

main()
