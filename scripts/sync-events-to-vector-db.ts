import { config } from 'dotenv'
import { createClient } from '@sanity/client'
import { upsertDocumentEmbedding, getVectorDBStats } from '../lib/db/document-vector-operations'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

// .env.localファイルを明示的に読み込み
config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: false,
})

/**
 * eventドキュメントをAI埋め込み用テキストに変換
 */
function eventToEmbeddingContent(event: any): string {
  const parts: string[] = []

  // 基本情報
  if (event.title) parts.push(`イベント名: ${event.title}`)

  // 日時情報
  if (event.startDate) {
    const startDate = new Date(event.startDate)
    const endDate = event.endDate ? new Date(event.endDate) : startDate
    parts.push(`開催日時: ${format(startDate, 'yyyy年M月d日 (E) HH:mm', { locale: ja })}〜${format(endDate, 'yyyy年M月d日 (E) HH:mm', { locale: ja })}`)
  }

  // 場所
  if (event.location) parts.push(`開催場所: ${event.location}`)

  // 講師
  if (event.instructor?.name) parts.push(`講師: ${event.instructor.name}`)

  // カテゴリー
  if (event.category) {
    const categoryLabel = event.category === 'course' ? '講座' :
      event.category === 'session' ? 'セッション' :
      event.category === 'information' ? '説明会' :
      event.category === 'workshop' ? 'ワークショップ' : 'その他'
    parts.push(`カテゴリ: ${categoryLabel}`)
  }

  // ステータス
  if (event.status) {
    const statusLabel = event.status === 'open' ? '受付中' :
      event.status === 'full' ? '満席' :
      event.status === 'closed' ? '終了' :
      event.status === 'cancelled' ? 'キャンセル' : event.status
    parts.push(`ステータス: ${statusLabel}`)
  }

  // 定員・空き状況
  if (event.capacity !== undefined) {
    const currentParticipants = event.currentParticipants || 0
    const availableSeats = event.capacity - currentParticipants
    parts.push(`定員: ${event.capacity}名（残り${availableSeats}席）`)
  }

  // 参加費
  if (event.fee !== undefined) {
    parts.push(`参加費: ${event.fee === 0 ? '無料' : `¥${event.fee.toLocaleString()}`}`)
  }

  // 説明（Portable Textから抽出）
  if (event.description) {
    const descriptionText = extractPortableTextContent(event.description)
    if (descriptionText) parts.push(`説明: ${descriptionText}`)
  }

  // AI検索用テキスト（既に生成されている場合）
  if (event.aiSearchText) parts.push(event.aiSearchText)

  // タグ
  if (event.tags && event.tags.length > 0) {
    parts.push(`タグ: ${event.tags.join(', ')}`)
  }

  return parts.join('\n')
}

/**
 * Portable Textからプレーンテキストを抽出
 */
function extractPortableTextContent(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return ''

  return blocks
    .filter(block => block._type === 'block')
    .map(block => {
      if (block.children && Array.isArray(block.children)) {
        return block.children
          .filter((child: any) => child._type === 'span')
          .map((child: any) => child.text)
          .join('')
      }
      return ''
    })
    .join(' ')
    .trim()
}

async function syncEventsToVectorDB() {
  console.log('🚀 Syncing events to Vector DB...\n')

  try {
    // 1. eventドキュメントを取得（useForAI === true のもののみ）
    console.log('📅 Fetching events from Sanity...')
    const events = await client.fetch(`
      *[_type == "event" && useForAI == true] | order(startDate) {
        _id,
        title,
        slug,
        description,
        startDate,
        endDate,
        location,
        capacity,
        currentParticipants,
        fee,
        status,
        category,
        instructor-> {
          name
        },
        tags,
        aiSearchText
      }
    `)

    console.log(`✅ Found ${events.length} active events (useForAI=true)\n`)

    if (events.length === 0) {
      console.log('⚠️  No events found. Make sure:')
      console.log('  1. You have created event documents in Sanity')
      console.log('  2. useForAI field is set to true')
      console.log('  3. endDate is in the future\n')
      return
    }

    // 2. 各eventをベクトルDBに同期
    for (const event of events) {
      const content = eventToEmbeddingContent(event)
      const url = `/events/${event.slug?.current}`

      await upsertDocumentEmbedding(
        event._id,
        'event',
        event.title,
        content,
        url,
        {
          startDate: event.startDate,
          endDate: event.endDate,
          location: event.location,
          category: event.category,
          status: event.status,
          tags: event.tags || [],
          availableSeats: event.capacity && event.currentParticipants !== undefined
            ? event.capacity - event.currentParticipants
            : null
        }
      )

      console.log(`  ✅ ${event.title} (${format(new Date(event.startDate), 'M/d', { locale: ja })})`)
    }

    console.log(`\n✅ Successfully synced ${events.length} events\n`)

    // 3. 統計情報表示
    const stats = await getVectorDBStats('event')
    console.log('📊 Event Vector DB Stats:')
    console.log(`  Total events: ${stats.total_count}`)
    console.log(`  Last updated: ${stats.last_updated}\n`)

    console.log('💡 Next steps:')
    console.log('  1. Test event search: "今月開催されるイベントを教えてください"')
    console.log('  2. Test available events: "空きがあるイベントを教えてください"')
    console.log('  3. Verify AI chat can answer event-related questions\n')

  } catch (error) {
    console.error('\n❌ Sync failed:', error)
    throw error
  }
}

async function main() {
  console.log('='.repeat(60))
  console.log('🎯 Syncing Event Content to Vector DB')
  console.log('='.repeat(60))
  console.log('')

  try {
    await syncEventsToVectorDB()

    // 全体統計
    const totalStats = await getVectorDBStats()
    console.log('📊 Total Vector DB Stats:')
    console.log(`  Total documents: ${totalStats.total_count}`)
    console.log(`  Document types: ${totalStats.type_count}`)
    console.log(`  Last updated: ${totalStats.last_updated}`)

    console.log('\n🎉 Event sync completed successfully!\n')

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Sync failed:', error)
    process.exit(1)
  }
}

main()
