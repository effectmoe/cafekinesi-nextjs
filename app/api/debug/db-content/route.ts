import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: NextRequest) {
  try {
    const happyEvent = await sql`
      SELECT id, type, title, content, metadata
      FROM document_embeddings
      WHERE title = 'ハッピーオーラス入門'
      LIMIT 1;
    `;

    if (happyEvent.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'イベントが見つかりません'
      });
    }

    const event = happyEvent.rows[0];

    return NextResponse.json({
      success: true,
      id: event.id,
      type: event.type,
      title: event.title,
      content: event.content,
      metadata: event.metadata
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
