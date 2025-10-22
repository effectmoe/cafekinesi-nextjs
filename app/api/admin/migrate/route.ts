import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

/**
 * Admin API: Database Migration Endpoint
 *
 * Purpose: Execute database migrations for document_embeddings table
 *
 * Security: Only accessible with admin secret key
 *
 * Usage:
 *   POST /api/admin/migrate
 *   Headers: { "x-admin-secret": "your_admin_secret" }
 *   Body: { "action": "create_table" | "verify" | "drop_table" }
 */

export const runtime = 'nodejs';

// Admin authentication
function verifyAdminSecret(request: NextRequest): boolean {
  const adminSecret = request.headers.get('x-admin-secret');
  const expectedSecret = process.env.ADMIN_SECRET;

  if (!expectedSecret) {
    throw new Error('ADMIN_SECRET is not configured');
  }

  return adminSecret === expectedSecret;
}

// Migration: Create document_embeddings table
async function createTable() {
  console.log('📦 Creating document_embeddings table...');

  // Step 1: Enable pgvector extension
  await sql`CREATE EXTENSION IF NOT EXISTS vector`;
  console.log('✅ pgvector extension enabled');

  // Step 2: Create document_embeddings table
  await sql`
    CREATE TABLE IF NOT EXISTS document_embeddings (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      url TEXT NOT NULL,
      metadata JSONB DEFAULT '{}'::jsonb,
      embedding vector(384),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;
  console.log('✅ document_embeddings table created');

  // Step 3: Create indexes
  await sql`
    CREATE INDEX IF NOT EXISTS idx_document_embeddings_type
      ON document_embeddings(type)
  `;
  console.log('✅ Index: idx_document_embeddings_type');

  await sql`
    CREATE INDEX IF NOT EXISTS idx_document_embeddings_updated_at
      ON document_embeddings(updated_at DESC)
  `;
  console.log('✅ Index: idx_document_embeddings_updated_at');

  await sql`
    CREATE INDEX IF NOT EXISTS idx_document_embeddings_embedding_ivfflat
      ON document_embeddings
      USING ivfflat (embedding vector_cosine_ops)
      WITH (lists = 100)
  `;
  console.log('✅ Index: idx_document_embeddings_embedding_ivfflat');

  // Step 4: Create function for automatic updated_at
  await sql`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ language 'plpgsql'
  `;
  console.log('✅ Function: update_updated_at_column');

  // Step 5: Create trigger
  await sql`
    DROP TRIGGER IF EXISTS update_document_embeddings_updated_at ON document_embeddings
  `;
  await sql`
    CREATE TRIGGER update_document_embeddings_updated_at
      BEFORE UPDATE ON document_embeddings
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column()
  `;
  console.log('✅ Trigger: update_document_embeddings_updated_at');

  return {
    success: true,
    message: 'document_embeddings table created successfully with all indexes and triggers'
  };
}

// Migration: Verify table existence
async function verifyTable() {
  console.log('🔍 Verifying document_embeddings table...');

  // Check table existence
  const tableResult = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'document_embeddings'
  `;

  if (tableResult.rows.length === 0) {
    return {
      success: false,
      message: 'document_embeddings table does not exist'
    };
  }

  // Check pgvector extension
  const extensionResult = await sql`
    SELECT * FROM pg_extension WHERE extname = 'vector'
  `;

  // Check indexes
  const indexResult = await sql`
    SELECT indexname
    FROM pg_indexes
    WHERE tablename = 'document_embeddings'
  `;

  // Count documents
  const countResult = await sql`
    SELECT COUNT(*) as count FROM document_embeddings
  `;

  return {
    success: true,
    message: 'document_embeddings table exists and is properly configured',
    details: {
      table_exists: true,
      pgvector_enabled: extensionResult.rows.length > 0,
      indexes: indexResult.rows.map(r => r.indexname),
      document_count: parseInt(countResult.rows[0].count)
    }
  };
}

// Migration: Drop table (DANGEROUS!)
async function dropTable() {
  console.log('⚠️  Dropping document_embeddings table...');

  await sql`DROP TABLE IF EXISTS document_embeddings CASCADE`;

  return {
    success: true,
    message: 'document_embeddings table dropped successfully'
  };
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    if (!verifyAdminSecret(request)) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid admin secret' },
        { status: 401 }
      );
    }

    const { action } = await request.json();

    let result;

    switch (action) {
      case 'create_table':
        result = await createTable();
        break;

      case 'verify':
        result = await verifyTable();
        break;

      case 'drop_table':
        result = await dropTable();
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: create_table, verify, or drop_table' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Migration API Error:', error);
    return NextResponse.json(
      {
        error: 'Migration failed',
        details: error instanceof Error ? error.message : '不明なエラー'
      },
      { status: 500 }
    );
  }
}
