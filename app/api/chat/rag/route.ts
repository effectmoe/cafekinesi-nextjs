import { NextRequest, NextResponse } from 'next/server';
import { RAGEngine } from '@/lib/rag/rag-engine';
import { publicClient } from '@/lib/sanity.client';
import { AIProviderFactory } from '@/lib/ai/factory';
import { createChatLog } from '@/lib/notion/export';

export async function POST(request: NextRequest) {
  const startTime = performance.now();

  try {
    const { message, sessionId, debug } = await request.json();

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'メッセージとセッションIDが必要です' },
        { status: 400 }
      );
    }

    console.log(`🤖 RAG Chat API - Session: ${sessionId}, Message: ${message.substring(0, 50)}...`);

    // クライアントIPを取得
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                     request.headers.get('x-real-ip') ||
                     'unknown';

    // Sanityから設定取得
    const [ragConfig, guardrails, providerSettings] = await Promise.all([
      publicClient.fetch('*[_type == "ragConfiguration" && active == true][0]'),
      publicClient.fetch('*[_type == "aiGuardrails" && active == true][0]'),
      publicClient.fetch('*[_type == "aiProviderSettings" && active == true][0]')
    ]);

    console.log('📊 設定取得完了:', {
      ragConfig: !!ragConfig,
      guardrails: !!guardrails,
      providerSettings: !!providerSettings
    });

    // RAGエンジン初期化
    const ragEngine = new RAGEngine();
    await ragEngine.initialize();

    // RAG処理（拡張プロンプト生成）
    const augmentedData = await ragEngine.generateAugmentedResponse(
      message,
      ragConfig || {}
    );

    // AIプロバイダー取得（Sanity設定から）
    const aiProvider = AIProviderFactory.create(
      providerSettings?.provider || 'deepseek'
    );

    // システムプロンプト構築（ガードレール適用）
    const systemPrompt = guardrails?.systemPrompt ||
      'あなたはCafe Kinesiの親切なAIアシスタントです。ウェルネス、瞑想、ヨガ、アロマテラピーに関する質問に丁寧にお答えします。';

    // AIに渡すメッセージ構造
    const messageContext = {
      messages: [
        { role: 'user' as const, content: message }
      ],
      cafeInfo: null, // カフェ情報は必要に応じて追加
      sessionId
    };

    // AI応答生成（既存のAIプロバイダーインターフェースを使用）
    const response = await aiProvider.generateResponse(
      augmentedData.prompt,
      messageContext
    );

    console.log('✅ AI応答生成完了');

    // 処理時間を計算
    const processingTime = (performance.now() - startTime) / 1000; // 秒

    // チャットログを作成（Vercel KVに保存）
    await createChatLog(
      sessionId,
      message,
      response,
      processingTime,
      clientIp
    );

    const responseData: any = {
      response,
      sources: augmentedData.sources,
      confidence: augmentedData.confidence,
      provider: providerSettings?.provider || 'deepseek',
      searchResults: augmentedData.searchResults?.length || 0,
      webResults: augmentedData.webResults?.length || 0
    };

    // デバッグ情報を追加
    if (debug) {
      responseData.debug = {
        searchResultsCount: augmentedData.searchResults?.length || 0,
        confidence: augmentedData.confidence,
        searchResults: augmentedData.searchResults,
        context: augmentedData.prompt,
        topResults: augmentedData.searchResults?.slice(0, 3).map((r: any) => ({
          score: r.combined_score || r.vector_score,
          title: r.metadata?.title || r.metadata?.type || 'Unknown',
          content: r.content.substring(0, 200)
        }))
      };
    }

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('❌ RAG API Error:', error);

    return NextResponse.json(
      {
        error: 'エラーが発生しました。しばらく後にもう一度お試しください。',
        details: error instanceof Error ? error.message : '不明なエラー'
      },
      { status: 500 }
    );
  }
}

// CORS対応
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}