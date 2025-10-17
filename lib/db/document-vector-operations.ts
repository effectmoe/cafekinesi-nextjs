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
 * クエリから重要なキーワードを動的に抽出
 */
function extractKeywords(query: string): string[] {
  // 助詞や疑問詞などの不要な単語を除外
  const stopWords = [
    'の', 'は', 'を', 'が', 'に', 'へ', 'と', 'から', 'で', 'や',
    'か', 'ですか', 'ください', 'ます', 'です', 'だ', 'である',
    'でき', 'し', 'れ', 'られ', 'なり', 'あり',
    '可能', '教えて', '知りたい', 'したい', 'する', 'いる', 'ある',
    '何', 'いつ', 'どこ', 'だれ', '誰', 'どう', 'なぜ', 'どの',
    '？', '?', '！', '!', '、', '。', '。'
  ];

  // 助詞で分割するための正規表現（の、は、を、が、に、へ、と、から、で、や）
  const particlePattern = /[のはをがにへとからでや]/g;

  // まず助詞で分割
  let segments = query.split(particlePattern);

  // 各セグメントから単語を抽出
  let words: string[] = [];
  for (const segment of segments) {
    // 2文字以上の連続する文字列を抽出
    const extracted = segment.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAFa-zA-Z0-9ー]+/g) || [];
    words.push(...extracted);
  }

  // ストップワードを除外し、2文字以上のキーワードを抽出
  const keywords = words
    .filter(word => word.length >= 2)
    .filter(word => !stopWords.includes(word));

  // 重複を削除してソート（長い順）
  return Array.from(new Set(keywords)).sort((a, b) => b.length - a.length);
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

    // キーワードを動的に抽出
    const keywords = extractKeywords(query);
    console.log(`🔑 抽出されたキーワード: ${keywords.join(', ')}`)

    // 1. クエリをベクトル化
    const { embedding: queryEmbedding } = await deepseekEmbedder.embed(query)

    // 2. ハイブリッド検索実行
    let results

    // キーワードベースの検索条件を構築
    if (keywords.length === 0) {
      keywords.push(query); // キーワードが抽出できない場合は元のクエリを使用
    }

    // 最も関連性の高いキーワードを使用（長いキーワードほど重要）
    const primaryKeyword = keywords.sort((a, b) => b.length - a.length)[0];
    console.log(`🎯 主要キーワード: "${primaryKeyword}"`);

    if (type) {
      // 主要キーワードで検索
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
            type,
            title,
            content,
            url,
            metadata,
            -- 主要キーワードでのLIKE検索
            (CASE
              WHEN content LIKE '%' || ${primaryKeyword} || '%' THEN 1.0
              WHEN title LIKE '%' || ${primaryKeyword} || '%' THEN 0.8
              ELSE 0.0
            END)::double precision as text_score,
            ROW_NUMBER() OVER (
              ORDER BY (
                CASE
                  WHEN content LIKE '%' || ${primaryKeyword} || '%' THEN 1.0
                  WHEN title LIKE '%' || ${primaryKeyword} || '%' THEN 0.8
                  ELSE 0.0
                END
              ) DESC
            ) as text_rank
          FROM document_embeddings
          WHERE (content LIKE '%' || ${primaryKeyword} || '%' OR title LIKE '%' || ${primaryKeyword} || '%')
            AND type = ${type}
        )
        SELECT
          COALESCE(v.id, t.id) as id,
          COALESCE(v.type, t.type) as type,
          COALESCE(v.title, t.title) as title,
          COALESCE(v.content, t.content) as content,
          COALESCE(v.url, t.url) as url,
          COALESCE(v.metadata, t.metadata) as metadata,
          COALESCE(v.vector_score, 0) as vector_score,
          COALESCE(t.text_score, 0) as text_score,
          (COALESCE(v.vector_score, 0) * ${vectorWeight} + COALESCE(t.text_score, 0) * ${textWeight}) as combined_score,
          v.vector_rank,
          t.text_rank
        FROM vector_search v
        FULL OUTER JOIN text_search t ON v.id = t.id
        ORDER BY combined_score DESC
        LIMIT ${topK};
      `
    } else {
      // type指定なしの場合も主要キーワードで検索
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
            type,
            title,
            content,
            url,
            metadata,
            -- 主要キーワードでのLIKE検索
            (CASE
              WHEN content LIKE '%' || ${primaryKeyword} || '%' THEN 1.0
              WHEN title LIKE '%' || ${primaryKeyword} || '%' THEN 0.8
              ELSE 0.0
            END)::double precision as text_score,
            ROW_NUMBER() OVER (
              ORDER BY (
                CASE
                  WHEN content LIKE '%' || ${primaryKeyword} || '%' THEN 1.0
                  WHEN title LIKE '%' || ${primaryKeyword} || '%' THEN 0.8
                  ELSE 0.0
                END
              ) DESC
            ) as text_rank
          FROM document_embeddings
          WHERE (content LIKE '%' || ${primaryKeyword} || '%' OR title LIKE '%' || ${primaryKeyword} || '%')
        )
        SELECT
          COALESCE(v.id, t.id) as id,
          COALESCE(v.type, t.type) as type,
          COALESCE(v.title, t.title) as title,
          COALESCE(v.content, t.content) as content,
          COALESCE(v.url, t.url) as url,
          COALESCE(v.metadata, t.metadata) as metadata,
          COALESCE(v.vector_score, 0) as vector_score,
          COALESCE(t.text_score, 0) as text_score,
          (COALESCE(v.vector_score, 0) * ${vectorWeight} + COALESCE(t.text_score, 0) * ${textWeight}) as combined_score,
          v.vector_rank,
          t.text_rank
        FROM vector_search v
        FULL OUTER JOIN text_search t ON v.id = t.id
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
