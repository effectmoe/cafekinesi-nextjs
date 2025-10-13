import { NextRequest, NextResponse } from 'next/server';
import { syncSingleDocument } from '@/lib/db/sync-single-document';
import { sql } from '@vercel/postgres';

// CORS設定
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// OPTIONSリクエスト（プリフライト）
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 Sanity Webhook received');

    const payload = await request.json();
    console.log('📦 Webhook payload:', JSON.stringify(payload, null, 2));

    const documentType = payload._type;
    const documentId = payload._id;

    if (!documentType || !documentId) {
      return NextResponse.json(
        { error: 'Invalid payload: missing _type or _id' },
        { status: 400, headers: corsHeaders }
      );
    }

    // サポートするドキュメントタイプ
    const supportedTypes = ['knowledgeBase', 'blogPost', 'course', 'instructor', 'faq'];

    if (!supportedTypes.includes(documentType)) {
      console.log(`⏭️  Skipping document type: ${documentType}`);
      return NextResponse.json({
        message: `Document type ${documentType} is not processed`,
        skipped: true
      }, { headers: corsHeaders });
    }

    console.log(`🔄 Processing ${documentType} document: ${documentId}`);

    await syncSingleDocument(documentId, documentType);

    console.log('✅ Webhook processing completed');

    return NextResponse.json({
      success: true,
      message: 'Embedding updated successfully',
      documentId,
      documentType
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);

    return NextResponse.json(
      {
        error: 'Webhook processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check if debug query parameter is set
    const url = new URL(request.url);
    if (url.searchParams.get('debug') === 'true') {
      const typeFilter = url.searchParams.get('type');

      let result;
      if (typeFilter) {
        result = await sql`
          SELECT id, type, title,
                 LEFT(content, 300) as content_preview,
                 updated_at
          FROM document_embeddings
          WHERE type = ${typeFilter}
          ORDER BY updated_at DESC;
        `;
      } else {
        result = await sql`
          SELECT id, type, title,
                 LEFT(content, 300) as content_preview,
                 updated_at
          FROM document_embeddings
          ORDER BY updated_at DESC;
        `;
      }

      return NextResponse.json({
        message: 'Vector DB Contents',
        count: result.rows.length,
        typeFilter: typeFilter || 'all',
        documents: result.rows
      }, { headers: corsHeaders });
    }

    return NextResponse.json({
      message: 'Sanity Sync Webhook Endpoint',
      status: 'active',
      endpoint: '/api/webhooks/sanity-sync',
      supportedTypes: ['knowledgeBase', 'blogPost', 'course', 'instructor', 'faq'],
      usage: 'Configure this endpoint in Sanity webhooks settings',
      debug: 'Add ?debug=true to see vector DB contents. Optionally filter by ?type=knowledgeBase'
    }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to fetch vector DB contents',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500, headers: corsHeaders });
  }
}
