-- Migration: Create document_embeddings table for RAG system
-- Purpose: Enable AI chat with vector search functionality
-- Dependencies: pgvector extension (must be enabled first)

-- Step 1: Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Step 2: Create document_embeddings table
CREATE TABLE IF NOT EXISTS document_embeddings (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  url TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  embedding vector(1536),  -- DeepSeek embeddings are 1536 dimensions
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create indexes for performance

-- Index for type filtering (used in hybrid search)
CREATE INDEX IF NOT EXISTS idx_document_embeddings_type
  ON document_embeddings(type);

-- Index for updated_at (for data freshness queries)
CREATE INDEX IF NOT EXISTS idx_document_embeddings_updated_at
  ON document_embeddings(updated_at DESC);

-- Index for full-text search on content (used in hybrid search)
CREATE INDEX IF NOT EXISTS idx_document_embeddings_content_gin
  ON document_embeddings USING gin(to_tsvector('japanese', content));

-- Index for full-text search on title (used in hybrid search)
CREATE INDEX IF NOT EXISTS idx_document_embeddings_title_gin
  ON document_embeddings USING gin(to_tsvector('japanese', title));

-- Vector similarity search index (IVFFlat for better performance)
-- Lists: 100 is a good starting point for small-medium datasets
-- Increase to 1000+ for larger datasets (>1M rows)
CREATE INDEX IF NOT EXISTS idx_document_embeddings_embedding_ivfflat
  ON document_embeddings
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Alternative: HNSW index (better recall, slower inserts)
-- Uncomment if you prefer HNSW over IVFFlat:
-- CREATE INDEX IF NOT EXISTS idx_document_embeddings_embedding_hnsw
--   ON document_embeddings
--   USING hnsw (embedding vector_cosine_ops)
--   WITH (m = 16, ef_construction = 64);

-- Step 4: Add comments for documentation
COMMENT ON TABLE document_embeddings IS 'Stores document embeddings for RAG (Retrieval Augmented Generation) system';
COMMENT ON COLUMN document_embeddings.id IS 'Unique identifier for the document (e.g., blog-{slug}, faq-{id})';
COMMENT ON COLUMN document_embeddings.type IS 'Document type (e.g., blog, faq, course, event)';
COMMENT ON COLUMN document_embeddings.title IS 'Document title';
COMMENT ON COLUMN document_embeddings.content IS 'Full text content for search and display';
COMMENT ON COLUMN document_embeddings.url IS 'URL path for the document';
COMMENT ON COLUMN document_embeddings.metadata IS 'Additional metadata in JSON format (e.g., tags, category, publishedAt)';
COMMENT ON COLUMN document_embeddings.embedding IS 'Vector embedding (1536 dimensions from DeepSeek)';
COMMENT ON COLUMN document_embeddings.updated_at IS 'Last update timestamp for cache invalidation';

-- Step 5: Create a function for automatic updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 6: Create trigger to automatically update updated_at
CREATE TRIGGER update_document_embeddings_updated_at
  BEFORE UPDATE ON document_embeddings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Step 7: Grant permissions (adjust role name as needed)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON document_embeddings TO your_app_user;
