import { NextRequest, NextResponse } from 'next/server';
import { AIProviderFactory } from '@/lib/ai/factory';
import { SessionManager } from '@/lib/chat/session-manager';
import { RateLimiter } from '@/lib/chat/rate-limiter';
import { publicClient } from '@/lib/sanity.client';

// レート制限インスタンス
const rateLimiter = new RateLimiter();

// カフェ情報を取得する関数
async function fetchCafeInfo() {
  try {
    const aboutPage = await publicClient.fetch(`
      *[_type == "aboutPage"][0] {
        title,
        heroSection {
          title,
          subtitle
        }
      }
    `);

    return {
      name: 'Cafe Kinesi',
      description: aboutPage?.heroSection?.subtitle || 'だれでもどこでも簡単にできるキネシオロジーとアロマを使った健康法',
      info: {
        concept: 'カフェキネシは、キネシオロジーとアロマを使った簡単な健康法を提供しています',
        features: [
          '初心者でも2時間あればインストラクターになれる',
          'オンラインで受講可能',
          '世界中にインストラクターがいる'
        ]
      }
    };
  } catch (error) {
    console.error('Failed to fetch cafe info:', error);
    return {
      name: 'Cafe Kinesi',
      description: 'だれでもどこでも簡単にできるキネシオロジーとアロマを使った健康法',
      info: {
        concept: 'カフェキネシは、キネシオロジーとアロマを使った簡単な健康法を提供しています'
      }
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json();

    if (!sessionId || !message) {
      return NextResponse.json(
        { error: 'セッションIDとメッセージが必要です' },
        { status: 400 }
      );
    }

    // レート制限チェック
    if (!rateLimiter.isAllowed(sessionId, 30)) {
      return NextResponse.json(
        { error: 'リクエストが多すぎます。しばらく待ってから再度お試しください。' },
        { status: 429 }
      );
    }

    // セッション取得
    const session = SessionManager.getSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'セッションが見つかりません' },
        { status: 404 }
      );
    }

    // ユーザーメッセージを追加
    SessionManager.addMessage(sessionId, {
      role: 'user',
      content: message
    });

    // カフェ情報を取得
    const cafeInfo = await fetchCafeInfo();

    // AIプロバイダーを選択
    const aiProvider = AIProviderFactory.create();
    console.log(`[Chat API] Using AI Provider: ${aiProvider.name}`);

    // コンテキストを構築
    const context = {
      messages: session.messages,
      cafeInfo,
      sessionId
    };

    // AI応答生成
    const response = await aiProvider.generateResponse(message, context);

    // 応答を履歴に追加
    SessionManager.addMessage(sessionId, {
      role: 'assistant',
      content: response
    });

    return NextResponse.json({
      response,
      provider: aiProvider.name,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Chat API] Error:', error);
    return NextResponse.json(
      {
        error: 'エラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
