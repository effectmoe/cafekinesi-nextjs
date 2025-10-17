import { sql } from '@vercel/postgres'
import { deepseekEmbedder } from '@/lib/embeddings/deepseek-embedder'

/**
 * ドキュメントをベクトルDBに挿入・更新
 */
export async function upsertDocumentEmbedding(
  id: string,
  type: string,
  title: string,
  content: string,
  url: string,
  metadata: Record<string, any> = {}
) {
  try {
    console.log(`📝 Upserting document: ${id} (${type})`)

    // 1. DeepSeekでベクトル化
    const { embedding } = await deepseekEmbedder.embed(content)

    // 2. document_embeddingsテーブルに保存
    await sql`
      INSERT INTO document_embeddings (id, type, title, content, url, embedding, metadata)
      VALUES (
        ${id},
        ${type},
        ${title},
        ${content},
        ${url},
        ${JSON.stringify(embedding)}::vector,
        ${JSON.stringify(metadata)}::jsonb
      )
      ON CONFLICT (id)
      DO UPDATE SET
        type = EXCLUDED.type,
        title = EXCLUDED.title,
        content = EXCLUDED.content,
        url = EXCLUDED.url,
        embedding = EXCLUDED.embedding,
        metadata = EXCLUDED.metadata,
        updated_at = CURRENT_TIMESTAMP;
    `

    console.log(`✅ Document ${id} upserted successfully`)
    return { success: true, id }

  } catch (error) {
    console.error(`❌ Failed to upsert document ${id}:`, error)
    throw error
  }
}

/**
 * ドキュメントをベクトルDBから削除
 */
export async function deleteDocumentEmbedding(id: string) {
  try {
    await sql`DELETE FROM document_embeddings WHERE id = ${id};`
    console.log(`✅ Document ${id} deleted from vector DB`)
    return { success: true, id }
  } catch (error) {
    console.error(`❌ Failed to delete document ${id}:`, error)
    throw error
  }
}

/**
 * ベクトル検索（コサイン類似度）
 */
export async function vectorSearch(
  query: string,
  options: {
    topK?: number
    threshold?: number
    type?: string
  } = {}
) {
  const { topK = 10, threshold = 0.3, type } = options

  try {
    console.log(`🔍 Vector search: "${query}" (topK: ${topK}, threshold: ${threshold})`)

    // 1. クエリをベクトル化
    const { embedding: queryEmbedding } = await deepseekEmbedder.embed(query)

    // 2. ベクトル検索実行
    let results
    if (type) {
      results = await sql`
        SELECT
          id,
          type,
          title,
          content,
          url,
          metadata,
          1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as similarity
        FROM document_embeddings
        WHERE type = ${type}
          AND 1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) > ${threshold}
        ORDER BY embedding <=> ${JSON.stringify(queryEmbedding)}::vector
        LIMIT ${topK};
      `
    } else {
      results = await sql`
        SELECT
          id,
          type,
          title,
          content,
          url,
          metadata,
          1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as similarity
        FROM document_embeddings
        WHERE 1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) > ${threshold}
        ORDER BY embedding <=> ${JSON.stringify(queryEmbedding)}::vector
        LIMIT ${topK};
      `
    }

    console.log(`✅ Found ${results.rows.length} results`)
    return results.rows

  } catch (error) {
    console.error('❌ Vector search failed:', error)
    throw error
  }
}

/**
 * ハイブリッド検索（ベクトル検索 + 全文検索）
 */
export async function hybridSearch(
  query: string,
  options: {
    topK?: number
    threshold?: number
    vectorWeight?: number
    textWeight?: number
    type?: string
  } = {}
) {
  const {
    topK = 10,
    threshold = 0.2,
    vectorWeight = 0.7,
    textWeight = 0.3,
    type
  } = options

  try {
    console.log(`🔍 Hybrid search: "${query}"`)

    // 1. クエリをベクトル化
    const { embedding: queryEmbedding } = await deepseekEmbedder.embed(query)

    // 2. ハイブリッド検索実行
    let results

    if (type) {
      results = await sql`
        WITH vector_search AS (
          SELECT
            id,
            type,
            title,
            content,
            url,
            metadata,
            1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as vector_score,
            ROW_NUMBER() OVER (ORDER BY embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as vector_rank
          FROM document_embeddings
          WHERE 1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) > ${threshold}
            AND type = ${type}
        ),
        text_search AS (
          SELECT
            id,
            -- 日本語対応: LIKE検索でキーワードマッチング
            (CASE
              WHEN content LIKE '%' || ${query} || '%' THEN 1.0
              WHEN title LIKE '%' || ${query} || '%' THEN 0.8
              ELSE 0.0
            END)::double precision as text_score,
            ROW_NUMBER() OVER (
              ORDER BY (
                CASE
                  WHEN content LIKE '%' || ${query} || '%' THEN 1.0
                  WHEN title LIKE '%' || ${query} || '%' THEN 0.8
                  ELSE 0.0
                END
              ) DESC
            ) as text_rank
          FROM document_embeddings
          WHERE (content LIKE '%' || ${query} || '%' OR title LIKE '%' || ${query} || '%')
            AND type = ${type}
        )
        SELECT
          v.id,
          v.type,
          v.title,
          v.content,
          v.url,
          v.metadata,
          v.vector_score,
          COALESCE(t.text_score, 0) as text_score,
          (v.vector_score * ${vectorWeight} + COALESCE(t.text_score, 0) * ${textWeight}) as combined_score,
          v.vector_rank,
          t.text_rank
        FROM vector_search v
        LEFT JOIN text_search t ON v.id = t.id
        ORDER BY combined_score DESC
        LIMIT ${topK};
      `
    } else {
      results = await sql`
        WITH vector_search AS (
          SELECT
            id,
            type,
            title,
            content,
            url,
            metadata,
            1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as vector_score,
            ROW_NUMBER() OVER (ORDER BY embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as vector_rank
          FROM document_embeddings
          WHERE 1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) > ${threshold}
        ),
        text_search AS (
          SELECT
            id,
            -- 日本語対応: LIKE検索でキーワードマッチング
            (CASE
              WHEN content LIKE '%' || ${query} || '%' THEN 1.0
              WHEN title LIKE '%' || ${query} || '%' THEN 0.8
              ELSE 0.0
            END)::double precision as text_score,
            ROW_NUMBER() OVER (
              ORDER BY (
                CASE
                  WHEN content LIKE '%' || ${query} || '%' THEN 1.0
                  WHEN title LIKE '%' || ${query} || '%' THEN 0.8
                  ELSE 0.0
                END
              ) DESC
            ) as text_rank
          FROM document_embeddings
          WHERE (content LIKE '%' || ${query} || '%' OR title LIKE '%' || ${query} || '%')
        )
        SELECT
          v.id,
          v.type,
          v.title,
          v.content,
          v.url,
          v.metadata,
          v.vector_score,
          COALESCE(t.text_score, 0) as text_score,
          (v.vector_score * ${vectorWeight} + COALESCE(t.text_score, 0) * ${textWeight}) as combined_score,
          v.vector_rank,
          t.text_rank
        FROM vector_search v
        LEFT JOIN text_search t ON v.id = t.id
        ORDER BY combined_score DESC
        LIMIT ${topK};
      `
    }

    console.log(`✅ Hybrid search found ${results.rows.length} results`)
    return results.rows

  } catch (error) {
    console.error('❌ Hybrid search failed:', error)
    throw error
  }
}

/**
 * ベクトルDB統計情報取得
 */
export async function getVectorDBStats(type?: string) {
  try {
    let stats

    if (type) {
      stats = await sql`
        SELECT
          COUNT(*) as total_count,
          COUNT(DISTINCT type) as type_count,
          MAX(updated_at) as last_updated
        FROM document_embeddings
        WHERE type = ${type};
      `
    } else {
      stats = await sql`
        SELECT
          COUNT(*) as total_count,
          COUNT(DISTINCT type) as type_count,
          MAX(updated_at) as last_updated
        FROM document_embeddings;
      `
    }

    return stats.rows[0]
  } catch (error) {
    console.error('❌ Failed to get vector DB stats:', error)
    throw error
  }
}
