import { NextRequest, NextResponse } from 'next/server';
import { ContentSynchronizer } from '@/lib/rag/content-synchronizer';

/**
 * イベントデータ同期API
 *
 * セキュリティ: SYNC_SECRET環境変数による認証
 * 使用方法: POST /api/sync/events
 * Headers: { "x-sync-secret": "YOUR_SECRET" }
 */
export async function POST(request: NextRequest) {
  try {
    // セキュリティチェック
    const syncSecret = request.headers.get('x-sync-secret');
    const expectedSecret = process.env.SYNC_SECRET;

    if (!expectedSecret) {
      return NextResponse.json(
        { error: 'SYNC_SECRET not configured' },
        { status: 500 }
      );
    }

    if (syncSecret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🚀 イベントデータ同期API呼び出し開始');

    // ContentSynchronizer初期化
    const synchronizer = new ContentSynchronizer();
    await synchronizer.initialize();

    // Sanityコンテンツ同期
    await synchronizer.syncSanityContent();

    console.log('✅ イベントデータ同期完了');

    return NextResponse.json({
      success: true,
      message: 'イベントデータの同期が完了しました',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ 同期エラー:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'イベントデータの同期に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET リクエストでステータス確認
export async function GET(request: NextRequest) {
  const syncSecret = request.headers.get('x-sync-secret');
  const expectedSecret = process.env.SYNC_SECRET;

  if (!expectedSecret || syncSecret !== expectedSecret) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    status: 'ready',
    message: 'Sync API is ready. Send POST request to sync data.',
    timestamp: new Date().toISOString()
  });
}
