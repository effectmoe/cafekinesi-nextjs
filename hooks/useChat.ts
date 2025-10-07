import { useState, useCallback, useEffect, useRef } from 'react';
import { Message } from '@/lib/chat/session-manager';

export interface UseChatReturn {
  sessionId: string | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  startSession: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  clearError: () => void;
  clearMessages: () => void;
}

export function useChat(): UseChatReturn {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // セッション開始
  const startSession = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('/api/chat/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' })
      });

      if (!response.ok) {
        throw new Error('セッションの開始に失敗しました');
      }

      const data = await response.json();
      setSessionId(data.sessionId);

      // 初期メッセージ
      setMessages([{
        role: 'assistant',
        content: 'こんにちは！Cafe Kinesiへようこそ☕ カフェについて何でもお尋ねください。',
        timestamp: new Date()
      }]);
    } catch (err) {
      console.error('Failed to start session:', err);
      setError('セッションの開始に失敗しました。リロードしてお試しください。');
    }
  }, []);

  // メッセージ送信
  const sendMessage = useCallback(async (content: string) => {
    if (!sessionId || !content.trim() || isLoading) return;

    // 前のリクエストをキャンセル
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 新しいAbortController作成
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // ユーザーメッセージを即座に追加
    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat/rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: content
        }),
        signal: abortController.signal
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'メッセージの送信に失敗しました');
      }

      const data = await response.json();

      // AI応答を追加（RAG機能付きメタデータも含む）
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        sources: data.sources,
        confidence: data.confidence,
        provider: data.provider,
        searchResults: data.searchResults,
        webResults: data.webResults
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Request was cancelled');
        return;
      }

      console.error('Failed to send message:', err);

      // エラーメッセージ
      const errorMessage: Message = {
        role: 'assistant',
        content: '申し訳ございません。エラーが発生しました。もう一度お試しください。',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      setError(err.message || 'メッセージの送信に失敗しました');
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [sessionId, isLoading]);

  // エラーをクリア
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // メッセージをクリア
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // ページ離脱時のクリーンアップ
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (sessionId) {
        navigator.sendBeacon('/api/chat/session',
          JSON.stringify({ action: 'end', sessionId })
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // アンマウント時にリクエストをキャンセル
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [sessionId]);

  return {
    sessionId,
    messages,
    isLoading,
    error,
    startSession,
    sendMessage,
    clearError,
    clearMessages
  };
}
