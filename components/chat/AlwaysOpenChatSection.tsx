'use client';

import { useRef, useEffect, useState } from 'react';
import { Sparkles, MessageCircle, Loader2 } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import {
  useChatConfiguration,
  useAIGuardrails,
  useRAGConfiguration
} from '@/hooks/useSanityConfig';
import { QuickQuestionButtons } from './QuickQuestionButtons';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function AlwaysOpenChatSection() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSectionRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Sanity設定フック
  const { config: chatConfig, loading: chatConfigLoading } = useChatConfiguration();
  const { guardrails, loading: guardrailsLoading } = useAIGuardrails();
  const { ragConfig, loading: ragConfigLoading } = useRAGConfiguration();

  const {
    sessionId,
    messages,
    isLoading,
    error,
    startSession,
    sendMessage,
    clearError
  } = useChat();

  // セッション初期化
  useEffect(() => {
    const initSession = async () => {
      if (!sessionId && !isInitialized) {
        setIsInitialized(true);
        await startSession();
      }
    };
    initSession();
  }, [sessionId, isInitialized, startSession]);

  // 自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // エラー表示
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // 質問カードクリック時のハンドラー（スムーズスクロール + 自動送信）
  const handleQuestionClick = async (question: string) => {
    // 1. チャットエリアまでスムーズスクロール
    chatSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    // 2. スクロールアニメーション完了を待つ（500ms）
    await new Promise(resolve => setTimeout(resolve, 500));

    // 3. 質問を自動送信
    await sendMessage(question);
  };

  return (
    <div className="container mx-auto px-4 max-w-5xl relative z-10">
      {/* アイキャッチヘッダー */}
      <div className="text-center mb-10 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-amber-500 text-white rounded-full mb-4">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span className="text-sm font-medium">
            {chatConfig?.config?.chatUI?.title || 'AI チャットで簡単検索'}
          </span>
          <Sparkles className="w-4 h-4 animate-pulse" />
        </div>

        <h2 className="text-4xl font-serif text-gray-800 mb-3">
          Cafe Kinesi へようこそ
        </h2>
        <p className="text-gray-600 text-lg italic">
          {chatConfig?.config?.chatUI?.welcomeMessage || '何かお探しですか？AIアシスタントがお答えします'}
        </p>
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* よくある質問ボタン */}
      <QuickQuestionButtons
        onQuestionClick={handleQuestionClick}
        isLoading={isLoading}
      />

      {/* メインチャットインターフェース（常時オープン） */}
      <div
        ref={chatSectionRef}
        className={cn(
        "bg-white rounded-3xl shadow-2xl",
        "border-3 border-amber-200",
        "overflow-hidden",
        "min-h-[650px]",
        "relative",
        "transition-all duration-300"
      )}>
        {/* チャットヘッダー */}
        <div
          className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-white"
          style={{
            background: chatConfig?.config?.chatUI?.primaryColor
              ? `linear-gradient(to right, ${chatConfig.config.chatUI.primaryColor}, ${chatConfig.config.chatUI.primaryColor}dd)`
              : undefined
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {chatConfig?.config?.chatUI?.title || 'AIチャットアシスタント'}
                </h3>
                <p className="text-xs opacity-90">24時間いつでもお答えします</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* RAG設定状態表示 */}
              {ragConfig && (
                <div className="text-xs opacity-90 mr-2">
                  RAG: {ragConfig.vectorSearch?.enabled ? 'ON' : 'OFF'} |
                  Web: {ragConfig.webSearch?.enabled ? 'ON' : 'OFF'}
                </div>
              )}
              {sessionId ? (
                <>
                  <span className="inline-flex h-3 w-3 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm">オンライン</span>
                </>
              ) : (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">接続中...</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 会話表示エリア（常時表示） */}
        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
        />

        {/* 入力エリア（常時アクティブ） */}
        <ChatInput
          onSendMessage={sendMessage}
          isLoading={isLoading}
          disabled={!sessionId}
        />
      </div>

      {/* プライバシー通知 */}
      <div className="text-center mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
        <div className="w-2 h-2 bg-green-400 rounded-full" />
        <span>セキュア接続・プライバシー保護・会話は保存されません</span>
      </div>

      {/* 背景装飾 */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-200 rounded-full blur-3xl opacity-30 animate-pulse-soft pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-200 rounded-full blur-3xl opacity-30 animate-pulse-soft pointer-events-none" style={{ animationDelay: '1s' }} />
    </div>
  );
}
