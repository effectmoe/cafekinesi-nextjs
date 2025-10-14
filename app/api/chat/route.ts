import { NextRequest, NextResponse } from 'next/server';
import { AIProviderFactory } from '@/lib/ai/factory';
import { SessionManager } from '@/lib/chat/session-manager';
import { RateLimiter } from '@/lib/chat/rate-limiter';
import { publicClient } from '@/lib/sanity.client';
import { RAGEngine } from '@/lib/rag/rag-engine';

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

// [削除] Sanityからの直接取得は不要になりました
// 全てのデータはデータベース（RAGエンジン）から取得します

// インストラクター関連の質問かどうか判定
function isInstructorQuery(message: string): boolean {
  const keywords = [
    'インストラクター', '講師', '先生', '教える',
    'AKO', 'LuLu', 'Harmony', '煌めき'
  ];

  const lowerMessage = message.toLowerCase();
  return keywords.some(keyword =>
    lowerMessage.includes(keyword.toLowerCase())
  );
}

// 代表者関連の質問かどうか判定
function isRepresentativeQuery(message: string): boolean {
  const keywords = [
    '代表', '創業者', '創始者', '設立者', 'founder',
    '星', 'ユカリ', 'ゆかり', 'yukari',
    'プロフィール', 'profile', '経歴',
    'どんな人', '誰', 'だれ', 'どなた'
  ];

  const lowerMessage = message.toLowerCase();
  // 代表者の文脈でのみ反応
  return keywords.some(keyword =>
    lowerMessage.includes(keyword.toLowerCase())
  ) && !isInstructorQuery(message);
}

// イベント関連の質問かどうか判定
function isEventQuery(message: string): boolean {
  const keywords = [
    'イベント', 'event', 'セッション', 'session',
    '講座', '体験会', 'ワークショップ', 'workshop',
    '説明会', '開催', 'スケジュール', 'schedule',
    '予定', '申込', '参加', '予約'
  ];

  const lowerMessage = message.toLowerCase();
  return keywords.some(keyword =>
    lowerMessage.includes(keyword.toLowerCase())
  );
}

export async function POST(request: NextRequest) {
  try {
    console.log('[Chat API] === Request Start ===');

    const body = await request.json();
    console.log('[Chat API] Request body:', JSON.stringify(body, null, 2));

    const { message, sessionId } = body;

    if (!sessionId || !message) {
      console.log('[Chat API] Missing sessionId or message');
      return NextResponse.json(
        { error: 'セッションIDとメッセージが必要です' },
        { status: 400 }
      );
    }

    // レート制限チェック
    if (!rateLimiter.isAllowed(sessionId, 30)) {
      console.log('[Chat API] Rate limit exceeded for session:', sessionId);
      return NextResponse.json(
        { error: 'リクエストが多すぎます。しばらく待ってから再度お試しください。' },
        { status: 429 }
      );
    }

    // セッション取得
    const session = SessionManager.getSession(sessionId);
    if (!session) {
      console.log('[Chat API] Session not found:', sessionId);
      return NextResponse.json(
        { error: 'セッションが見つかりません' },
        { status: 404 }
      );
    }

    console.log('[Chat API] Session found, message count:', session.messages.length);

    // ユーザーメッセージを追加
    SessionManager.addMessage(sessionId, {
      role: 'user',
      content: message
    });

    // カフェ情報を取得
    console.log('[Chat API] Fetching cafe info...');
    const cafeInfo = await fetchCafeInfo();

    // コンテキストを構築
    let context: any = {
      messages: session.messages,
      cafeInfo,
      sessionId
    };

    // 全ての質問に対してRAGエンジン（データベース）を使用
    console.log('[Chat API] Using RAG engine to fetch from database...');
    const ragEngine = new RAGEngine();
    await ragEngine.initialize();

    // 質問タイプに応じた検索設定を使用
    let searchConfig;
    if (isInstructorQuery(message)) {
      // インストラクター質問は多めに取得
      searchConfig = {
        vectorSearch: {
          topK: 50,
          threshold: 0.05 // より低い閾値で幅広く取得
        }
      };
    } else if (isEventQuery(message)) {
      // イベント質問も低い閾値で確実に取得
      searchConfig = {
        vectorSearch: {
          topK: 30,
          threshold: 0.05 // より低い閾値で幅広く取得
        }
      };
    } else {
      // その他の質問はデフォルト設定
      searchConfig = {
        vectorSearch: {
          topK: 20,
          threshold: 0.15
        }
      };
    }

    const ragData = await ragEngine.generateAugmentedResponse(message, searchConfig);

    console.log(`[Chat API] RAG search completed. Found ${ragData.searchResults?.length || 0} results`);

    // インストラクター質問の場合は詳細ログ出力
    if (isInstructorQuery(message) && ragData.searchResults?.length > 0) {
      console.log('[Chat API] Instructor data retrieved from database:');
      ragData.searchResults.forEach((result: any, idx: number) => {
        if (result.metadata?.type === 'instructor') {
          console.log(`  ${idx + 1}. ${result.metadata.name} (${result.metadata.location})`);
        }
      });
    }

    // イベント質問の場合は詳細ログ出力
    if (isEventQuery(message) && ragData.searchResults?.length > 0) {
      console.log('[Chat API] Event data retrieved from database:');
      ragData.searchResults.forEach((result: any, idx: number) => {
        if (result.metadata?.type === 'event') {
          console.log(`  ${idx + 1}. ${result.metadata.title}`);
        }
      });
    }

    context.ragContext = ragData.prompt;
    context.searchResults = ragData.searchResults;

    // AIプロバイダーを選択
    console.log('[Chat API] Creating AI provider...');
    const aiProvider = AIProviderFactory.create();
    console.log(`[Chat API] Using AI Provider: ${aiProvider.name}`);

    // AI応答生成
    console.log('[Chat API] Generating AI response...');
    const response = await aiProvider.generateResponse(message, context);
    console.log('[Chat API] AI response generated, length:', response.length);

    // 応答を履歴に追加
    SessionManager.addMessage(sessionId, {
      role: 'assistant',
      content: response
    });

    console.log('[Chat API] === Request Success ===');
    return NextResponse.json({
      response,
      provider: aiProvider.name,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Chat API] === ERROR ===');
    console.error('[Chat API] Error type:', error instanceof Error ? 'Error' : typeof error);
    console.error('[Chat API] Error message:', error instanceof Error ? error.message : String(error));
    console.error('[Chat API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    return NextResponse.json(
      {
        error: 'エラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}