import { sql } from '@vercel/postgres'

/**
 * OpenAI Embeddings用のdocument_embeddingsテーブルを初期化
 * 既存のembeddingsテーブル（all-MiniLM-L6-v2用）とは別に作成
 */
export async function initDocumentEmbeddingsTable() {
  try {
    console.log('🔄 Initializing document_embeddings table for OpenAI...')

    // 1. pgvector拡張を有効化（既に有効な場合はスキップ）
    await sql`CREATE EXTENSION IF NOT EXISTS vector;`
    console.log('✅ pgvector extension enabled')

    // 2. ベクトル埋め込みテーブル作成（multilingual-e5-small用: 384次元）
    await sql`
      CREATE TABLE IF NOT EXISTS document_embeddings (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        url TEXT,
        embedding vector(384),
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `
    console.log('✅ document_embeddings table created (384 dimensions for multilingual-e5-small)')

    // 3. ベクトル類似度検索用インデックス作成（HNSW）
    await sql`
      CREATE INDEX IF NOT EXISTS document_embedding_idx
      ON document_embeddings
      USING hnsw (embedding vector_cosine_ops)
      WITH (m = 16, ef_construction = 64);
    `
    console.log('✅ HNSW index created for vector similarity search')

    // 4. 全文検索用インデックス作成（simple辞書使用）
    await sql`
      CREATE INDEX IF NOT EXISTS document_content_search_idx
      ON document_embeddings
      USING GIN (to_tsvector('simple', content));
    `
    console.log('✅ Full-text search index created (simple dictionary)')

    // 5. メタデータ検索用インデックス
    await sql`
      CREATE INDEX IF NOT EXISTS document_metadata_idx
      ON document_embeddings
      USING GIN (metadata);
    `
    console.log('✅ Metadata index created')

    // 6. 型（type）フィールドのインデックス
    await sql`
      CREATE INDEX IF NOT EXISTS document_type_idx
      ON document_embeddings (type);
    `
    console.log('✅ Type index created')

    // 7. 更新日時トリガー作成（関数）
    try {
      await sql`
        CREATE OR REPLACE FUNCTION update_document_embeddings_timestamp()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `
      console.log('✅ Timestamp function created')
    } catch (error: any) {
      if (!error.message?.includes('already exists')) {
        console.warn('⚠️  Timestamp function creation warning:', error.message)
      }
    }

    // 8. トリガー作成
    try {
      await sql`DROP TRIGGER IF EXISTS document_embeddings_timestamp_trigger ON document_embeddings;`
    } catch (error) {
      // Ignore if trigger doesn't exist
    }

    await sql`
      CREATE TRIGGER document_embeddings_timestamp_trigger
      BEFORE UPDATE ON document_embeddings
      FOR EACH ROW
      EXECUTE FUNCTION update_document_embeddings_timestamp();
    `
    console.log('✅ Timestamp trigger created')

    console.log('🎉 document_embeddings table initialized successfully!')
    return { success: true }

  } catch (error) {
    console.error('❌ Failed to initialize document_embeddings table:', error)
    throw error
  }
}

/**
 * document_embeddingsテーブルの統計情報を取得
 */
export async function getDocumentEmbeddingsStats() {
  try {
    const result = await sql`
      SELECT
        COUNT(*) as total_count,
        COUNT(DISTINCT type) as type_count,
        MAX(updated_at) as last_updated,
        pg_size_pretty(pg_total_relation_size('document_embeddings')) as table_size
      FROM document_embeddings;
    `
    return result.rows[0]
  } catch (error) {
    console.error('❌ Failed to get stats:', error)
    return null
  }
}

/**
 * document_embeddingsテーブルを削除（開発用）
 */
export async function dropDocumentEmbeddingsTable() {
  try {
    await sql`DROP TABLE IF EXISTS document_embeddings CASCADE;`
    console.log('✅ document_embeddings table dropped')
  } catch (error) {
    console.error('❌ Failed to drop table:', error)
    throw error
  }
}
