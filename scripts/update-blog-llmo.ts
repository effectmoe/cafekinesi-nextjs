import { createClient } from '@sanity/client'
import { config } from 'dotenv'
import { resolve } from 'path'
import { randomBytes } from 'crypto'

config({ path: resolve(__dirname, '../.env.local') })

const sanityClient = createClient({
  projectId: 'e4aqw590',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
})

async function updateBlogPost() {
  console.log('📝 LLMO最適化ブログ記事を作成中...\n')

  const slug = 'breathing-stress-relief'

  try {
    //  既存の記事を取得
    const existingPost = await sanityClient.fetch(`
      *[_type == "blogPost" && slug.current == $slug][0] {
        _id
      }
    `, { slug })

    if (!existingPost) {
      console.error('記事が見つかりません')
      return
    }

    // LLMO最適化されたダミーコンテンツ
    const content = [
      {
        _key: randomBytes(12).toString('hex'),
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: '日常生活の中で、私たちは様々なストレスにさらされています。仕事のプレッシャー、人間関係の悩み、時間に追われる感覚など、現代社会特有のストレス要因は増加の一途をたどっています。'
          }
        ]
      },
      {
        _key: randomBytes(12).toString('hex'),
        _type: 'block',
        style: 'h2',
        children: [
          {
            _type: 'span',
            text: 'なぜ呼吸法がストレス解消に効果的なのか'
          }
        ]
      },
      {
        _key: randomBytes(12).toString('hex'),
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: '呼吸は、私たちが意識的にコントロールできる唯一の自律神経系の機能です。深くゆっくりとした呼吸を行うことで、副交感神経が優位になり、心身がリラックス状態へと導かれます。これにより、心拍数が低下し、血圧が安定し、筋肉の緊張が和らぎます。'
          }
        ]
      },
      {
        _key: randomBytes(12).toString('hex'),
        _type: 'block',
        style: 'h2',
        children: [
          {
            _type: 'span',
            text: '基本的な腹式呼吸法'
          }
        ]
      },
      {
        _key: randomBytes(12).toString('hex'),
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: '腹式呼吸は、最もシンプルで効果的な呼吸法の一つです。まず、背筋を伸ばして楽な姿勢で座ります。片手をお腹に、もう片手を胸に置きます。鼻からゆっくりと息を吸い込み、お腹が膨らむのを感じます。次に、口からゆっくりと息を吐き出し、お腹がへこむのを感じます。'
          }
        ]
      },
      {
        _key: randomBytes(12).toString('hex'),
        _type: 'block',
        style: 'h3',
        children: [
          {
            _type: 'span',
            text: '4-7-8呼吸法の実践'
          }
        ]
      },
      {
        _key: randomBytes(12).toString('hex'),
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: '4-7-8呼吸法は、アメリカの医師アンドリュー・ワイル博士が提唱した呼吸法です。4秒かけて鼻から息を吸い、7秒間息を止め、8秒かけて口から息を吐き出します。この呼吸法を3-4回繰り返すことで、驚くほど心が落ち着きます。'
          }
        ]
      },
      {
        _key: randomBytes(12).toString('hex'),
        _type: 'block',
        style: 'h2',
        children: [
          {
            _type: 'span',
            text: '日常生活に取り入れるコツ'
          }
        ]
      },
      {
        _key: randomBytes(12).toString('hex'),
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: '呼吸法を習慣化するには、特定の時間や場所と結びつけることが効果的です。朝起きた時、通勤電車の中、ランチ後のひととき、就寝前など、日常の中に呼吸法を取り入れるタイミングを見つけましょう。最初は1日5分から始め、徐々に時間を延ばしていくことをお勧めします。'
          }
        ]
      },
      {
        _key: randomBytes(12).toString('hex'),
        _type: 'block',
        style: 'h3',
        children: [
          {
            _type: 'span',
            text: 'マインドフルネス呼吸瞑想'
          }
        ]
      },
      {
        _key: randomBytes(12).toString('hex'),
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'マインドフルネスと呼吸法を組み合わせることで、さらに深いリラックス効果が得られます。呼吸に意識を向け、空気が鼻から入って肺に届き、再び鼻から出ていく感覚を観察します。雑念が浮かんでも、それに気づき、優しく呼吸へと意識を戻します。'
          }
        ]
      }
    ]

    // LLMO最適化FAQ
    const faq = [
      {
        _key: randomBytes(12).toString('hex'),
        question: '呼吸法はどのくらいの頻度で行うべきですか？',
        answer: '理想的には1日2-3回、朝・昼・夜に5-10分ずつ行うことをお勧めします。ただし、最初は1日1回、3分から始めても効果は実感できます。重要なのは毎日続けることです。'
      },
      {
        _key: randomBytes(12).toString('hex'),
        question: '呼吸法を行う最適な時間帯はありますか？',
        answer: '朝起きた時と就寝前が特に効果的です。朝の呼吸法は1日を穏やかに始めるのに役立ち、夜の呼吸法は質の高い睡眠をサポートします。また、ストレスを感じた時に即座に実践することも有効です。'
      },
      {
        _key: randomBytes(12).toString('hex'),
        question: '初心者でも簡単に始められますか？',
        answer: 'はい、呼吸法は特別な道具や場所を必要とせず、誰でも今すぐ始められます。まずは腹式呼吸から始めて、慣れてきたら4-7-8呼吸法やマインドフルネス呼吸瞑想に挑戦してみてください。'
      },
      {
        _key: randomBytes(12).toString('hex'),
        question: 'どのくらいで効果を実感できますか？',
        answer: '多くの人が初回の実践直後から心身のリラックスを感じます。継続的な効果（ストレス耐性の向上、睡眠の質の改善など）は、2-4週間の継続で実感できることが多いです。'
      },
      {
        _key: randomBytes(12).toString('hex'),
        question: '呼吸法を行う際の注意点はありますか？',
        answer: '無理に深く吸おうとしたり、長く息を止めすぎたりしないことが大切です。自分の体調に合わせて、楽に続けられるペースで行いましょう。めまいや不快感を感じたら、すぐに通常の呼吸に戻してください。'
      }
    ]

    // 更新データ
    const updateData = {
      tldr: '呼吸法は、自律神経を整え、ストレスを効果的に解放する科学的に証明された方法です。腹式呼吸や4-7-8呼吸法など、誰でも簡単に始められる技法を日常に取り入れることで、心身の健康を大きく改善できます。',
      content,
      faq,
      summary: '呼吸法は、特別な道具も費用も必要とせず、いつでもどこでも実践できる最も手軽なストレス解消法です。1日たった5分から始められ、継続することで心身の健康に大きな変化をもたらします。まずは今日から、朝起きた時の3回の深呼吸から始めてみませんか？',
      keyPoint: {
        title: '呼吸法の3つの重要ポイント',
        content: '1. 深くゆっくりとした呼吸で副交感神経を活性化 2. 毎日の習慣として継続することが最も重要 3. 自分に合った方法を見つけ、無理なく楽しく実践する'
      },
      contentOrder: ['tldr', 'mainImage', 'publishedAt', 'author', 'category', 'tags', 'toc', 'content', 'keyPoint', 'faq', 'summary', 'related', 'prevNext']
    }

    await sanityClient
      .patch(existingPost._id)
      .set(updateData)
      .commit()

    console.log('✅ LLMO最適化ブログ記事を更新しました')
    console.log('   - TL;DR: ✓')
    console.log('   - 目次用見出し（h2/h3）: ✓')
    console.log('   - FAQ: 5件')
    console.log('   - まとめセクション: ✓')
    console.log('   - 重要ポイント: ✓')
    console.log('\n🌐 確認URL:')
    console.log(`   https://cafekinesi-nextjs.vercel.app/blog/${slug}`)

  } catch (error) {
    console.error('\n💥 エラー:', error)
    process.exit(1)
  }
}

updateBlogPost()
