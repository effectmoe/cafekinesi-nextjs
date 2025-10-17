import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: NextRequest) {
  try {
    // データベース接続確認
    const happyEvents = await sql`
      SELECT id, type, title, metadata->>'status' as status
      FROM document_embeddings
      WHERE title LIKE '%ハッピー%'
      ORDER BY updated_at DESC
      LIMIT 5;
    `;

    const allEvents = await sql`
      SELECT COUNT(*) as count
      FROM document_embeddings
      WHERE type = 'event';
    `;

    return NextResponse.json({
      success: true,
      happyEvents: happyEvents.rows,
      totalEvents: allEvents.rows[0].count,
      dbUrl: process.env.POSTGRES_URL ? 'Set' : 'Not Set',
      dbHost: process.env.POSTGRES_HOST || 'Not Set'
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      dbUrl: process.env.POSTGRES_URL ? 'Set' : 'Not Set'
    }, { status: 500 });
  }
}
