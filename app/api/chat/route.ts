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

// Sanityから最新のインストラクター情報を直接取得
async function fetchInstructors() {
  try {
    console.log('[Chat API] Fetching instructors from Sanity...');
    const instructors = await publicClient.fetch(`
      *[_type == "instructor"] {
        _id,
        name,
        location,
        specialties,
        experience,
        description,
        slug
      }
    `);

    console.log(`[Chat API] Found ${instructors.length} instructors in Sanity`);
    return instructors;
  } catch (error) {
    console.error('[Chat API] Failed to fetch instructors:', error);
    return [];
  }
}

// インストラクター関連の質問かどうか判定
function isInstructorQuery(message: string): boolean {
  const keywords = [
    'インストラクター', '講師', '先生', '教える',
    '誰', 'だれ', 'どんな人', '他に', 'ほか',
    'AKO', 'LuLu', 'Harmony', '煌めき'
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

    // インストラクター関連の質問の場合は、Sanityから最新情報を取得
    if (isInstructorQuery(message)) {
      console.log('[Chat API] Instructor query detected, fetching from Sanity...');
      const instructors = await fetchInstructors();

      if (instructors.length > 0) {
        // インストラクター情報を整形してコンテキストに追加
        const instructorContext = instructors.map((inst: any) =>
          `インストラクター: ${inst.name || 'Unknown'}
専門分野: ${inst.specialties?.join(', ') || '情報なし'}
活動地域: ${inst.location || '情報なし'}
経歴: ${inst.experience || '情報なし'}
紹介: ${inst.description || ''}
`
        ).join('\n---\n');

        context.ragContext = `
Cafe Kinesiには以下のインストラクターが在籍しています：

${instructorContext}

質問: ${message}

上記のインストラクター情報を基に、質問に対して具体的で親切な回答をしてください。
インストラクターの名前、専門分野、活動地域などを含めて詳しく紹介してください。
`;
        context.searchResults = instructors;
        console.log(`[Chat API] Added ${instructors.length} instructors to context`);
      }
    } else {
      // インストラクター以外の質問の場合はRAGエンジンを使用
      console.log('[Chat API] Non-instructor query, using RAG engine...');
      const ragEngine = new RAGEngine();
      await ragEngine.initialize();

      const ragData = await ragEngine.generateAugmentedResponse(message, {
        vectorSearch: {
          topK: 20,
          threshold: 0.15
        }
      });

      console.log(`[Chat API] RAG search completed. Found ${ragData.searchResults?.length || 0} results`);
      context.ragContext = ragData.prompt;
      context.searchResults = ragData.searchResults;
    }

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