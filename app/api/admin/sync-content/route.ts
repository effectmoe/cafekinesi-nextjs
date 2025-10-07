import { NextRequest, NextResponse } from 'next/server';
import { ContentSynchronizer } from '@/lib/rag/content-synchronizer';

export async function POST(request: NextRequest) {
  try {
    // 認証チェック（簡易版）
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.SANITY_REVALIDATE_SECRET;

    if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🔄 コンテンツ同期開始...');

    const synchronizer = new ContentSynchronizer();
    await synchronizer.initialize();

    // Sanityコンテンツ同期
    await synchronizer.syncSanityContent();

    // 統計情報を取得
    const stats = await synchronizer['vectorStore'].getStats();

    console.log('✅ 同期完了');

    return NextResponse.json({
      success: true,
      message: 'Content synchronized successfully',
      stats: {
        totalDocuments: stats.total_documents,
        sources: stats.sources,
        lastUpdate: stats.last_update
      }
    });
  } catch (error) {
    console.error('同期エラー:', error);

    return NextResponse.json(
      {
        error: 'Synchronization failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST method to trigger synchronization',
    required: 'Authorization header with Bearer token'
  });
}