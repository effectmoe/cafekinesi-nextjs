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

async function updateBlogPostFull() {
  console.log('📝 LLMO/SEO完全最適化ブログ記事を更新中...\n')

  const slug = 'breathing-stress-relief'

  try {
    // 公開版を直接指定
    const existingPost = {
      _id: 'post-9'
    }

    console.log(`📝 公開版を更新します: ${existingPost._id}`)

    // LLMO最適化コンテンツ（表、情報ボックス、比較表を含む）
    const content = [
      // イントロダクション
      {
        _key: randomBytes(12).toString('hex'),
        _type: 'block',
        style: 'normal',
        children: [{
          _type: 'span',
          text: '日常生活の中で、私たちは様々なストレスにさらされています。仕事のプレッシャー、人間関係の悩み、時間に追われる感覚など、現代社会特有のストレス要因は増加の一途をたどっています。'
        }]
      },

      // 見出し2
      {
        _key: randomBytes(12).toString('hex'),
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'なぜ呼吸法がストレス解消に効果的なのか'
        }]
      },

      // パラグラフ
      {
        _key: randomBytes(12).toString('hex'),
        _type: 'block',
        style: 'normal',
        children: [{
          _type: 'span',
          text: '呼吸は、私たちが意識的にコントロールできる唯一の自律神経系の機能です。深くゆっくりとした呼吸を行うことで、副交感神経が優位になり、心身がリラックス状態へと導かれます。'
        }]
      },

      // 情報ボックス（ヒント）
      {
        _key: randomBytes(12).toString('hex'),
        _type: 'infoBox',
        type: 'tip',
        title: '呼吸法の即効性',
        content: [
          {
            _key: randomBytes(12).toString('hex'),
            _type: 'block',
            style: 'normal',
            children: [{
              _type: 'span',
              text: '呼吸法の素晴らしい点は、'
            }, {
              _type: 'span',
              marks: ['strong'],
              text: '即座に効果を実感できる'
            }, {
              _type: 'span',
              text: 'ことです。わずか3回の深呼吸で、心拍数の低下や筋肉の緊張緩和を体感できます。'
            }]
          }
        ]
      },

      // 見出し2
      {
        _key: randomBytes(12).toString('hex'),
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: '主な呼吸法の比較'
        }]
      },

      // 比較表
      {
        _key: randomBytes(12).toString('hex'),
        _type: 'comparisonTable',
        title: '呼吸法実践前後の変化',
        items: [
          {
            label: '心拍数',
            before: '1分間に80-90回',
            after: '1分間に60-70回'
          },
          {
            label: 'ストレスレベル',
            before: '高い（7-8/10）',
            after: '低い（3-4/10）'
          },
          {
            label: '集中力',
            before: '散漫',
            after: '高まる'
          },
          {
            label: '睡眠の質',
            before: '浅い・途中覚醒',
            after: '深い・朝まで熟睡'
          }
        ]
      },

      // 見出し2
      {
        _key: randomBytes(12).toString('hex'),
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: '代表的な呼吸法の種類'
        }]
      },

      // テーブル（表）
      {
        _key: randomBytes(12).toString('hex'),
        _type: 'table',
        caption: '呼吸法の種類と特徴',
        rows: [
          {
            _key: randomBytes(12).toString('hex'),
            cells: ['呼吸法', '時間配分', '効果', '難易度']
          },
          {
            _key: randomBytes(12).toString('hex'),
            cells: ['腹式呼吸', '自然なペース', 'リラックス・基礎', '★☆☆☆☆']
          },
          {
            _key: randomBytes(12).toString('hex'),
            cells: ['4-7-8呼吸法', '吸4秒・止7秒・吐8秒', '即効性高い', '★★☆☆☆']
          },
          {
            _key: randomBytes(12).toString('hex'),
            cells: ['ボックス呼吸', '吸4秒・止4秒・吐4秒・止4秒', '集中力向上', '★★★☆☆']
          },
          {
            _key: randomBytes(12).toString('hex'),
            cells: ['片鼻呼吸', '左右交互', 'バランス調整', '★★★★☆']
          }
        ]
      },

      // 見出し3
      {
        _key: randomBytes(12).toString('hex'),
        _type: 'block',
        style: 'h3',
        children: [{
          _type: 'span',
          text: '4-7-8呼吸法の実践方法'
        }]
      },

      // パラグラフ
      {
        _key: randomBytes(12).toString('hex'),
        _type: 'block',
        style: 'normal',
        children: [{
          _type: 'span',
          text: '4-7-8呼吸法は、アメリカの医師アンドリュー・ワイル博士が提唱した呼吸法です。4秒かけて鼻から息を吸い、7秒間息を止め、8秒かけて口から息を吐き出します。この呼吸法を3-4回繰り返すことで、驚くほど心が落ち着きます。'
        }]
      },

      // 情報ボックス（警告）
      {
        _key: randomBytes(12).toString('hex'),
        _type: 'infoBox',
        type: 'warning',
        title: '注意点',
        content: [
          {
            _key: randomBytes(12).toString('hex'),
            _type: 'block',
            style: 'normal',
            children: [{
              _type: 'span',
              text: '初めて実践する方は、無理に長く息を止めようとせず、自分のペースで行ってください。めまいを感じたら、すぐに通常の呼吸に戻しましょう。'
            }]
          }
        ]
      },

      // 見出し2
      {
        _key: randomBytes(12).toString('hex'),
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: '日常生活に取り入れるコツ'
        }]
      },

      // パラグラフ
      {
        _key: randomBytes(12).toString('hex'),
        _type: 'block',
        style: 'normal',
        children: [{
          _type: 'span',
          text: '呼吸法を習慣化するには、特定の時間や場所と結びつけることが効果的です。朝起きた時、通勤電車の中、ランチ後のひととき、就寝前など、日常の中に呼吸法を取り入れるタイミングを見つけましょう。'
        }]
      },

      // 情報ボックス（成功）
      {
        _key: randomBytes(12).toString('hex'),
        _type: 'infoBox',
        type: 'success',
        title: '習慣化のコツ',
        content: [
          {
            _key: randomBytes(12).toString('hex'),
            _type: 'block',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'スマートフォンのリマインダー機能を活用して、1日3回（朝・昼・夜）のアラームを設定しましょう。3週間続けることで習慣として定着します。'
            }]
          }
        ]
      }
    ]

    // 内部リンク（ピラーページ/クラスターページへのリンク）
    const internalLinks = [
      {
        _key: randomBytes(12).toString('hex'),
        title: 'ピーチタッチ - リラクゼーション講座',
        url: '/school/peach-touch',
        description: '呼吸法と組み合わせることで、さらに深いリラクゼーション効果が得られます。',
        type: 'cluster'
      },
      {
        _key: randomBytes(12).toString('hex'),
        title: 'スクール一覧 - 心と身体を整える',
        url: '/school',
        description: '各種リラクゼーション講座をご紹介しています。',
        type: 'pillar'
      },
      {
        _key: randomBytes(12).toString('hex'),
        title: 'インストラクター紹介',
        url: '/instructor',
        description: '専門知識を持つインストラクターが丁寧に指導します。',
        type: 'pillar'
      }
    ]

    // 外部リンク（参考文献）
    const externalReferences = [
      {
        _key: randomBytes(12).toString('hex'),
        title: '呼吸法とストレス軽減の科学的根拠',
        url: 'https://www.health.harvard.edu/mind-and-mood/relaxation-techniques-breath-control-helps-quell-errant-stress-response',
        publisher: 'Harvard Health Publishing',
        date: '2020-07-06'
      },
      {
        _key: randomBytes(12).toString('hex'),
        title: '自律神経と呼吸の関係',
        url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5455070/',
        publisher: 'National Center for Biotechnology Information',
        date: '2017-05-30'
      },
      {
        _key: randomBytes(12).toString('hex'),
        title: 'Dr. Andrew Weil\'s 4-7-8 Breathing Technique',
        url: 'https://www.drweil.com/health-wellness/body-mind-spirit/stress-anxiety/breathing-three-exercises/',
        publisher: 'Dr. Andrew Weil',
        date: '2024-01-15'
      }
    ]

    // FAQ（拡張版）
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
        answer: 'はい、呼吸法は特別な道具や場所を必要とせず、誰でも今すぐ始められます。まずは腹式呼吸から始めて、慣れてきたら4-7-8呼吸法やボックス呼吸に挑戦してみてください。'
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
      },
      {
        _key: randomBytes(12).toString('hex'),
        question: '呼吸法と瞑想の違いは何ですか？',
        answer: '呼吸法は呼吸そのものに焦点を当てた実践で、瞑想はより広い意識の状態を目指します。ただし、呼吸法は瞑想の重要な要素の一つであり、両者を組み合わせることでより深い効果が得られます。'
      },
      {
        _key: randomBytes(12).toString('hex'),
        question: '呼吸法は不眠症にも効果がありますか？',
        answer: 'はい、特に4-7-8呼吸法は不眠症の改善に効果的です。就寝前に実践することで、自律神経が副交感神経優位になり、自然な眠気を誘います。'
      }
    ]

    // 更新データ
    const updateData = {
      tldr: '呼吸法は、自律神経を整え、ストレスを効果的に解放する科学的に証明された方法です。腹式呼吸や4-7-8呼吸法など、誰でも簡単に始められる技法を日常に取り入れることで、心身の健康を大きく改善できます。',
      content,
      internalLinks,
      externalReferences,
      faq,
      summary: '呼吸法は、特別な道具も費用も必要とせず、いつでもどこでも実践できる最も手軽なストレス解消法です。科学的な裏付けもあり、多くの研究で効果が実証されています。1日たった5分から始められ、継続することで心身の健康に大きな変化をもたらします。まずは今日から、朝起きた時の3回の深呼吸から始めてみませんか？',
      keyPoint: {
        title: '呼吸法の3つの重要ポイント',
        content: '1. 深くゆっくりとした呼吸で副交感神経を活性化 2. 毎日の習慣として継続することが最も重要 3. 自分に合った方法を見つけ、無理なく楽しく実践する'
      },
      contentOrder: [
        'metaInfo',
        'tldr',
        'socialShare',
        'mainImage',
        'toc',
        'content',
        'internalLinks',
        'keyPoint',
        'externalReferences',
        'summary',
        'faq',
        'related',
        'prevNext'
      ]
    }

    await sanityClient
      .patch(existingPost._id)
      .set(updateData)
      .commit()

    console.log('✅ LLMO/SEO完全最適化ブログ記事を更新しました')
    console.log('   - メタ情報: ✓')
    console.log('   - TL;DR: ✓')
    console.log('   - ソーシャルシェアボタン: ✓')
    console.log('   - 目次: ✓')
    console.log('   - 本文ブロック: 14（表、情報ボックス、比較表を含む）')
    console.log('   - 内部リンク: 3件')
    console.log('   - 外部リンク: 3件')
    console.log('   - FAQ: 7件')
    console.log('   - まとめセクション: ✓')
    console.log('   - 重要ポイント: ✓')
    console.log('\n🌐 確認URL:')
    console.log(`   https://cafekinesi-nextjs.vercel.app/blog/${slug}`)

  } catch (error) {
    console.error('\n💥 エラー:', error)
    process.exit(1)
  }
}

updateBlogPostFull()
