import { NextRequest, NextResponse } from 'next/server';
import { exportLogsToNotion } from '@/lib/notion/export';

// Node.js runtimeを使用（Notion APIとioredisはNode.js専用）
export const runtime = 'nodejs';

/**
 * NotionエクスポートAPI
 * GET /api/notion/export-logs?date=2025-10-09
 */
export async function GET(request: NextRequest) {
  try {
    // 日付パラメータ（デフォルト: 前日）
    const searchParams = request.nextUrl.searchParams;
    const dateParam = searchParams.get('date');

    const date = dateParam ||
      new Date(Date.now() - 86400000).toISOString().split('T')[0]; // 前日

    console.log(`Starting export for ${date}...`);

    // Notionにエクスポート
    const results = await exportLogsToNotion(date);

    return NextResponse.json({
      success: true,
      date,
      results,
      message: `Exported ${results.success} logs successfully`
    });

  } catch (error) {
    console.error('Export logs error:', error);

    return NextResponse.json(
      {
        error: 'ログのエクスポートに失敗しました',
        details: error instanceof Error ? error.message : '不明なエラー'
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS - CORS対応
 */
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
