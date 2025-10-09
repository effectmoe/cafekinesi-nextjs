import { NextRequest, NextResponse } from 'next/server';
import { SessionManager } from '@/lib/chat/session-manager';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, sessionId } = body;

    if (action === 'start') {
      // クライアントIPを取得
      const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                       request.headers.get('x-real-ip') ||
                       'unknown';

      // 新しいセッションを作成
      const newSessionId = await SessionManager.createSession(clientIp);

      return NextResponse.json({
        sessionId: newSessionId,
        message: 'Session started successfully'
      });
    }

    if (action === 'end' && sessionId) {
      // セッションを終了
      await SessionManager.deleteSession(sessionId);

      return NextResponse.json({
        message: 'Session ended successfully'
      });
    }

    if (action === 'status' && sessionId) {
      // セッションの状態を確認
      const session = await SessionManager.getSession(sessionId);

      if (!session) {
        return NextResponse.json(
          { error: 'Session not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        sessionId: session.id,
        messageCount: session.messages.length,
        startedAt: session.startedAt,
        lastActivityAt: session.lastActivityAt,
        userEmail: session.userEmail
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Session API Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // セッション統計情報
    const sessionCount = await SessionManager.getSessionCount();

    return NextResponse.json({
      activeSessions: sessionCount,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Session API Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
