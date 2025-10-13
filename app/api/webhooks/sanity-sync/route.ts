import { NextRequest, NextResponse } from 'next/server';
import { syncSingleDocument } from '@/lib/db/sync-single-document';

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
        { status: 400 }
      );
    }

    if (documentType !== 'knowledgeBase') {
      console.log(`⏭️  Skipping document type: ${documentType}`);
      return NextResponse.json({
        message: `Document type ${documentType} is not processed`,
        skipped: true
      });
    }

    console.log(`🔄 Processing knowledgeBase document: ${documentId}`);

    await syncSingleDocument(documentId, documentType);

    console.log('✅ Webhook processing completed');

    return NextResponse.json({
      success: true,
      message: 'Embedding updated successfully',
      documentId,
      documentType
    });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);

    return NextResponse.json(
      {
        error: 'Webhook processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Sanity Sync Webhook Endpoint',
    status: 'active',
    endpoint: '/api/webhooks/sanity-sync',
    supportedTypes: ['knowledgeBase'],
    usage: 'Configure this endpoint in Sanity webhooks settings'
  });
}
