#!/usr/bin/env npx tsx

import { createClient } from '@sanity/client'
import { VercelVectorStore } from '../lib/vector/vercel-vector-store'
import { config } from 'dotenv'

config({ path: '.env.local' })

const client = createClient({
  projectId: 'e4aqw590',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
})

/**
 * AI-Firstデータをベクトルデータベースに同期
 */
async function syncAIFirstToVector() {
  console.log('🔄 AI-Firstデータをベクトルデータベースに同期開始...')

  // ベクトルストア初期化
  const vectorStore = new VercelVectorStore()
  await vectorStore.initialize()

  const documents: any[] = []

  // 1. Person エンティティを同期
  console.log('\n👤 Personエンティティを取得中...')
  const persons = await client.fetch(`*[_type == "person"] {
    _id,
    _type,
    _updatedAt,
    name,
    roles,
    primaryRole,
    aiSearchKeywords,
    aiContext,
    aiPriority,
    profile {
      birthName,
      location,
      specialties,
      qualifications,
      biography,
      philosophy,
      message
    },
    activities,
    relatedOrganization-> {
      name,
      tagline
    },
    isActive
  }`)

  console.log(`📋 取得したPerson: ${persons.length}件`)

  // Personデータをベクトル用ドキュメントに変換
  for (const person of persons) {
    if (!person.isActive) continue

    // AI最適化されたコンテンツ作成
    const specialtiesText = person.profile?.specialties?.join(', ') || ''
    const qualificationsText = person.profile?.qualifications?.join(', ') || ''
    const activitiesText = person.activities?.map((a: any) => a.title).join(', ') || ''
    const keywordsText = person.aiSearchKeywords?.join(', ') || ''
    const rolesText = person.roles?.join(', ') || ''

    // AI文脈を含む詳細なコンテンツ
    let content = `
【${person.primaryRole || person.roles?.[0] || '人物'}】${person.name}

◆ 基本情報
名前: ${person.name}
役割: ${rolesText}
主要な役割: ${person.primaryRole || ''}
所在地: ${person.profile?.location || ''}

◆ 専門・資格
専門分野: ${specialtiesText}
資格: ${qualificationsText}

◆ 活動内容
現在の活動: ${activitiesText}

◆ 人物詳細
${person.profile?.biography ? `経歴: ${person.profile.biography}` : ''}
${person.profile?.philosophy ? `理念・哲学: ${person.profile.philosophy}` : ''}
${person.profile?.message ? `メッセージ: ${person.profile.message}` : ''}

◆ 組織との関係
${person.relatedOrganization ? `所属: ${person.relatedOrganization.name}` : ''}

◆ AI検索キーワード
${keywordsText}

◆ よくある質問への回答準備
${person.aiContext?.commonQuestions?.map((q: string) => `Q: ${q}`).join('\n') || ''}
${person.aiContext?.responseTemplate || ''}
`.trim()

    // 代表者・創業者の場合は特別な処理
    if (person.roles?.includes('representative') || person.roles?.includes('founder')) {
      content += `

【重要】この人物はCafe Kinesiの代表者・創業者です。
「代表者はどんな人ですか？」「創業者について教えて」などの質問には、この人物について回答してください。

Cafe Kinesiの代表者は${person.name}さんです。
${person.profile?.location ? `${person.profile.location}を拠点に活動しています。` : ''}
${person.profile?.philosophy || ''}
${person.profile?.message || ''}
`
    }

    const document = {
      content,
      metadata: {
        id: person._id,
        type: 'person',
        name: person.name,
        roles: person.roles,
        primaryRole: person.primaryRole,
        location: person.profile?.location,
        specialties: person.profile?.specialties,
        aiPriority: person.aiPriority || 5,
        aiKeywords: person.aiSearchKeywords,
        updatedAt: person._updatedAt,
        isRepresentative: person.roles?.includes('representative') || false,
        isFounder: person.roles?.includes('founder') || false,
        isInstructor: person.roles?.includes('instructor') || false
      },
      source: 'ai-first-person'
    }

    documents.push(document)
    console.log(`  ✅ ${person.name} (${person.primaryRole}) - 優先度: ${person.aiPriority}`)
  }

  // 2. Organization エンティティを同期
  console.log('\n🏢 Organizationエンティティを取得中...')
  const organizations = await client.fetch(`*[_type == "organization"] {
    _id,
    _type,
    _updatedAt,
    name,
    tagline,
    established,
    aiSearchKeywords,
    aiElevatorPitch,
    mission,
    vision,
    values,
    history,
    achievements,
    contact,
    founder-> {
      name,
      primaryRole
    },
    representatives[]-> {
      name,
      primaryRole
    },
    isActive
  }`)

  console.log(`📋 取得したOrganization: ${organizations.length}件`)

  // Organizationデータをベクトル用ドキュメントに変換
  for (const org of organizations) {
    if (!org.isActive) continue

    const valuesText = org.values?.join(', ') || ''
    const achievementsText = org.achievements?.join(', ') || ''
    const historyText = org.history?.map((h: any) => `${h.year}: ${h.event}`).join('\n') || ''
    const keywordsText = org.aiSearchKeywords?.join(', ') || ''
    const representativesText = org.representatives?.map((r: any) => `${r.name} (${r.primaryRole})`).join(', ') || ''

    const content = `
【組織情報】${org.name}

◆ 基本情報
組織名: ${org.name}
タグライン: ${org.tagline || ''}
設立: ${org.established || ''}

◆ AIエレベーターピッチ
${org.aiElevatorPitch || ''}

◆ 理念・ビジョン
ミッション: ${org.mission || ''}
ビジョン: ${org.vision || ''}
価値観: ${valuesText}

◆ 組織の歴史
${historyText}

◆ 実績
${achievementsText}

◆ 組織構成
創業者: ${org.founder?.name ? `${org.founder.name} (${org.founder.primaryRole})` : ''}
代表者: ${representativesText}

◆ 連絡先
${org.contact?.address ? `住所: ${org.contact.address}` : ''}
${org.contact?.phone ? `電話: ${org.contact.phone}` : ''}
${org.contact?.email ? `メール: ${org.contact.email}` : ''}
${org.contact?.website ? `ウェブサイト: ${org.contact.website}` : ''}

◆ AI検索キーワード
${keywordsText}

【重要】「会社について」「どんな組織？」「カフェキネシとは」などの質問には、この組織情報を使って回答してください。
`.trim()

    const document = {
      content,
      metadata: {
        id: org._id,
        type: 'organization',
        name: org.name,
        tagline: org.tagline,
        established: org.established,
        aiKeywords: org.aiSearchKeywords,
        updatedAt: org._updatedAt
      },
      source: 'ai-first-organization'
    }

    documents.push(document)
    console.log(`  ✅ ${org.name} (${org.tagline})`)
  }

  // 3. Service エンティティを同期
  console.log('\n🎓 Serviceエンティティを取得中...')
  const services = await client.fetch(`*[_type == "service"] {
    _id,
    _type,
    _updatedAt,
    name,
    serviceType,
    category,
    aiSearchKeywords,
    aiQuickAnswer,
    aiFAQ,
    description,
    targetAudience,
    benefits,
    pricing {
      price,
      currency,
      unit,
      notes
    },
    duration {
      hours,
      minutes,
      sessions
    },
    schedule {
      frequency,
      nextDate,
      isOnline,
      location
    },
    instructor-> {
      name,
      primaryRole,
      "profile": profile {
        location,
        specialties
      }
    },
    isActive,
    popularity
  }`)

  console.log(`📋 取得したService: ${services.length}件`)

  // Serviceデータをベクトル用ドキュメントに変換
  for (const service of services) {
    if (!service.isActive) continue

    const benefitsText = service.benefits?.join(', ') || ''
    const keywordsText = service.aiSearchKeywords?.join(', ') || ''
    const faqText = service.aiFAQ?.map((faq: any) => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n') || ''

    // 料金情報
    const priceText = service.pricing?.price
      ? `${service.pricing.price}${service.pricing.currency || 'JPY'}${service.pricing.unit ? '/' + service.pricing.unit : ''}`
      : '料金はお問い合わせください'

    // 所要時間
    const durationText = service.duration
      ? `${service.duration.hours || 0}時間${service.duration.minutes || 0}分${service.duration.sessions ? ` (${service.duration.sessions}回)` : ''}`
      : ''

    const content = `
【${service.serviceType}】${service.name}

◆ サービス基本情報
サービス名: ${service.name}
種別: ${service.serviceType}
カテゴリー: ${service.category || ''}

◆ AIクイック回答
${service.aiQuickAnswer || ''}

◆ 詳細情報
対象者: ${service.targetAudience || ''}
得られる効果: ${benefitsText}
料金: ${priceText}
${service.pricing?.notes ? `料金補足: ${service.pricing.notes}` : ''}
所要時間: ${durationText}

◆ スケジュール・開催情報
${service.schedule?.frequency ? `開催頻度: ${service.schedule.frequency}` : ''}
${service.schedule?.location ? `開催場所: ${service.schedule.location}` : ''}
${service.schedule?.isOnline ? 'オンライン対応: あり' : ''}
${service.schedule?.nextDate ? `次回開催: ${service.schedule.nextDate}` : ''}

◆ 担当インストラクター
${service.instructor ? `${service.instructor.name} (${service.instructor.primaryRole})` : ''}
${service.instructor?.profile?.location ? `活動地域: ${service.instructor.profile.location}` : ''}
${service.instructor?.profile?.specialties ? `専門分野: ${service.instructor.profile.specialties.join(', ')}` : ''}

◆ よくある質問
${faqText}

◆ AI検索キーワード
${keywordsText}

【重要】「どんな講座がある？」「料金は？」「コースについて教えて」などの質問には、このサービス情報を使って回答してください。
人気度: ${service.popularity}/100
`.trim()

    const document = {
      content,
      metadata: {
        id: service._id,
        type: 'service',
        name: service.name,
        serviceType: service.serviceType,
        category: service.category,
        price: service.pricing?.price,
        currency: service.pricing?.currency || 'JPY',
        aiKeywords: service.aiSearchKeywords,
        popularity: service.popularity || 50,
        instructor: service.instructor?.name,
        updatedAt: service._updatedAt
      },
      source: 'ai-first-service'
    }

    documents.push(document)
    console.log(`  ✅ ${service.name} (${service.serviceType}) - 人気度: ${service.popularity}`)
  }

  // 4. ベクトルデータベースに一括追加
  console.log('\n💾 ベクトルデータベースに同期中...')
  if (documents.length > 0) {
    await vectorStore.addDocuments(documents)
    console.log(`✅ ${documents.length}件のAI-Firstドキュメントを同期完了`)
  } else {
    console.log('⚠️  同期するドキュメントがありませんでした')
  }

  // 5. 統計情報表示
  console.log('\n📊 同期サマリー:')
  const personCount = documents.filter(d => d.metadata.type === 'person').length
  const orgCount = documents.filter(d => d.metadata.type === 'organization').length
  const serviceCount = documents.filter(d => d.metadata.type === 'service').length

  console.log(`  👤 Person: ${personCount}件`)
  console.log(`  🏢 Organization: ${orgCount}件`)
  console.log(`  🎓 Service: ${serviceCount}件`)
  console.log(`  📋 合計: ${documents.length}件`)

  // 6. 優先度別統計
  const priorityStats = documents
    .filter(d => d.metadata.type === 'person')
    .reduce((acc: any, d) => {
      const priority = d.metadata.aiPriority || 5
      acc[priority] = (acc[priority] || 0) + 1
      return acc
    }, {})

  console.log('\n🎯 Person優先度別統計:')
  Object.entries(priorityStats)
    .sort(([a], [b]) => Number(b) - Number(a))
    .forEach(([priority, count]) => {
      console.log(`  優先度 ${priority}: ${count}件`)
    })

  // 7. ベクトルデータベース統計
  const stats = await vectorStore.getStats()
  console.log('\n📈 ベクトルデータベース統計:')
  console.log(`  総ドキュメント数: ${stats.total_documents}`)
  console.log(`  データソース数: ${stats.sources}`)
  console.log(`  最終更新: ${stats.last_update}`)

  console.log('\n✨ AI-Firstデータの同期が完了しました！')
  console.log('\n次のステップ:')
  console.log('1. AIチャットボットで「代表者はどんな人ですか？」をテスト')
  console.log('2. 新しいAI検索キーワードの効果を確認')
  console.log('3. 必要に応じてAI優先度やキーワードを調整')
}

// 実行
syncAIFirstToVector()
  .then(() => {
    console.log('\n🎉 同期処理完了')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ 同期エラー:', error)
    process.exit(1)
  })