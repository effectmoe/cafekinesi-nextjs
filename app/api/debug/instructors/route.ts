import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: NextRequest) {
  try {
    // データベースから全インストラクターを取得
    const { rows } = await sql`
      SELECT
        id,
        content,
        metadata,
        source,
        SUBSTRING(content, 1, 200) as content_preview
      FROM embeddings
      WHERE metadata::text LIKE '%instructor%'
      ORDER BY source
    `;

    return NextResponse.json({
      total: rows.length,
      instructors: rows.map(row => ({
        id: row.id,
        source: row.source,
        metadata: row.metadata,
        preview: row.content_preview
      }))
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch instructors' }, { status: 500 });
  }
}