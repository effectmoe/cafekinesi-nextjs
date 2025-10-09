'use client';

import { Sparkles, Send, Image as ImageIcon, Maximize2, X, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useRef, useEffect } from "react";
import { useChat } from '@/hooks/useChat';
import { ChatModalSettings } from '@/types/chat.types';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { isWebView, getWebViewWarning } from '@/lib/voice/webview-detector';

interface InlineChatModalProps {
  settings?: ChatModalSettings
}

const InlineChatModal = ({ settings }: InlineChatModalProps) => {
  // デフォルト値（Sanityデータがない場合）
  const headerTitle = settings?.headerTitle || 'AIチャットアシスタント';
  const headerSubtitle = settings?.headerSubtitle || '24時間いつでもお答えします';
  const inputPlaceholder = settings?.inputPlaceholder || 'メッセージを入力...';
  const footerMessage = settings?.footerMessage || 'セキュア接続・プライバシー保護・会話は保存されません';
  const welcomeMessage = settings?.welcomeMessage || 'こんにちは！Cafe Kinesiへようこそ☕ カフェについて何でもお尋ねください。';
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const {
    sessionId,
    messages,
    isLoading,
    error,
    startSession,
    sendMessage,
    clearError
  } = useChat();

  // 音声入力フック
  const {
    isRecording,
    isSupported,
    interimTranscript,
    error: voiceError,
    startRecording,
    stopRecording,
    clearError: clearVoiceError,
  } = useVoiceInput({
    onResult: (text) => {
      // 音声入力結果を入力フィールドに追加
      setInputValue((prev) => {
        const newText = prev ? `${prev} ${text}` : text;
        return newText.slice(0, 500);
      });
    },
    onError: (error) => {
      console.error('Voice input error:', error);
    },
    autoCorrect: true,
    autoPunctuation: true,
  });

  // セッション初期化
  useEffect(() => {
    if (!sessionId) {
      startSession();
    }
  }, [sessionId, startSession]);

  // キーボードショートカット（Ctrl+M）
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        if (isSupported && !isLoading) {
          if (isRecording) {
            stopRecording();
          } else {
            startRecording();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRecording, isSupported, isLoading, startRecording, stopRecording]);

  // 自動スクロール（コンテナ内だけスクロール、ページ全体はスクロールしない）
  useEffect(() => {
    // 少し遅延させて確実にスクロール
    const timer = setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  // エラー表示
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue.trim();
    setInputValue('');
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const chatContent = (isFullscreenView: boolean) => (
    <div className={`relative bg-white border-2 border-[hsl(35,30%,85%)] rounded-3xl shadow-xl overflow-hidden ${isFullscreenView ? 'h-full flex flex-col' : ''}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[hsl(35,22%,91%)] to-[hsl(210,20%,88%)] px-6 py-4 flex items-center justify-between border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary text-sm">
              {headerTitle}
            </h3>
            <p className="text-xs text-text-secondary">
              {headerSubtitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* 拡大ボタン（通常時）と閉じるボタン（フルスクリーン時）の切り替え */}
          {!isFullscreenView ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-text-secondary hover:text-text-primary"
              title="全画面表示"
              onClick={() => setIsFullscreen(true)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-text-secondary hover:text-text-primary hover:bg-red-50"
              title="全画面を閉じる"
              onClick={() => setIsFullscreen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${sessionId ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-xs text-text-secondary">
              {sessionId ? 'オンライン' : '接続中...'}
            </span>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-6 py-2 bg-red-50 border-b border-red-200">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* Chat Messages */}
      <div ref={chatContainerRef} className={`p-6 space-y-4 overflow-y-auto bg-gradient-to-b from-white to-[hsl(35,25%,98%)] chat-messages ${isFullscreenView ? 'flex-1' : 'max-h-[400px] min-h-[300px]'}`}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                message.role === "user"
                  ? "bg-gradient-to-br from-[hsl(260,30%,80%)] to-[hsl(260,30%,70%)] text-white shadow-md"
                  : "bg-white border border-border shadow-sm"
              }`}
            >
              {message.role === "assistant" && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                  </div>
                </div>
              )}
              <p className={`text-sm whitespace-pre-line leading-relaxed ${
                message.role === "user" ? "text-white" : "text-text-primary"
              }`}>
                {message.content}
              </p>
              <p className={`text-xs mt-2 ${
                message.role === "user" ? "text-white/80" : "text-text-muted"
              }`}>
                {new Date(message.timestamp).toLocaleTimeString('ja-JP', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-border shadow-sm rounded-2xl px-5 py-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-amber-600 animate-pulse" />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-border/30">
        {/* 音声エラー表示 */}
        {voiceError && (
          <div className="mb-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
            {voiceError === 'not-allowed' && (
              <div>
                <p className="font-semibold mb-1">マイクの使用が許可されていません</p>
                <p className="text-xs mb-2">
                  ブラウザのアドレスバー左側の🔒または🛈アイコンをタップ →「サイトの設定」→「マイク」を「許可」に変更してください
                </p>
                {isWebView() && (
                  <p className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                    ⚠️ {getWebViewWarning()}
                  </p>
                )}
              </div>
            )}
            {voiceError === 'no-speech' && '音声が検出されませんでした'}
            {voiceError === 'network' && 'ネットワークエラーが発生しました'}
            {voiceError === 'not-supported' && (
              <div>
                <p className="font-semibold mb-1">お使いのブラウザは音声入力に対応していません</p>
                <p className="text-xs">
                  Chrome、Edge、Safariなどの最新ブラウザをご利用ください。
                  {isWebView() && 'LINEなどのSNSアプリ内ブラウザではご利用いただけません。'}
                </p>
              </div>
            )}
            {!['not-allowed', 'no-speech', 'network', 'not-supported'].includes(voiceError) && '音声入力でエラーが発生しました'}
            <button
              type="button"
              onClick={clearVoiceError}
              className="ml-2 underline hover:no-underline"
            >
              閉じる
            </button>
          </div>
        )}

        {/* 音声認識中の途中結果表示 */}
        {isRecording && interimTranscript && (
          <div className="mb-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700 italic">
            認識中: {interimTranscript}...
          </div>
        )}

        {selectedImage && (
          <div className="mb-3 relative inline-block">
            <img
              src={selectedImage}
              alt="Selected"
              className="max-h-32 rounded-lg border border-border"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white shadow-md hover:bg-red-50"
              onClick={removeImage}
            >
              <X className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        )}
        <div className="space-y-2">
          {/* 上段：ツールボタン（モバイル） */}
          <div className="flex items-center gap-2 md:hidden">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-text-secondary hover:text-text-primary hover:bg-[hsl(35,25%,95%)] rounded-xl"
              title="画像を添付"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>

            {/* 音声入力ボタン（モバイル） */}
            {isSupported && (
              <div className="relative group">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-10 w-10 rounded-xl transition-all duration-200 ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600 text-white ring-4 ring-red-200'
                      : 'text-text-secondary hover:text-text-primary hover:bg-[hsl(35,25%,95%)]'
                  }`}
                  title={isRecording ? '音声入力を停止 (Ctrl+M)' : '音声入力を開始 (Ctrl+M)'}
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isLoading}
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              </div>
            )}

            <span className="text-xs text-gray-500 flex-1">
              {isRecording ? '録音中...' : isSupported ? '音声入力可能' : ''}
            </span>
          </div>

          {/* 下段：入力フィールドと送信ボタン */}
          <div className="flex items-center gap-2">
            {/* デスクトップ用ボタン */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden md:block"
            />
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex h-12 w-12 text-text-secondary hover:text-text-primary hover:bg-[hsl(35,25%,95%)] rounded-xl"
              title="画像を添付"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <ImageIcon className="h-5 w-5" />
            </Button>

            {/* 音声入力ボタン（デスクトップ） */}
            {isSupported && (
              <div className="hidden md:block relative group">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-12 w-12 rounded-xl transition-all duration-200 ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600 text-white ring-4 ring-red-200'
                      : 'text-text-secondary hover:text-text-primary hover:bg-[hsl(35,25%,95%)]'
                  }`}
                  title={isRecording ? '音声入力を停止 (Ctrl+M)' : '音声入力を開始 (Ctrl+M)'}
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isLoading}
                >
                  {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                {/* ツールチップ */}
                {!isRecording && (
                  <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    Ctrl+M / Cmd+M
                  </div>
                )}
              </div>
            )}

            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={inputPlaceholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading || !sessionId}
                className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-[hsl(35,30%,75%)] text-sm text-text-primary placeholder:text-text-muted disabled:opacity-50 transition-all ${
                  isRecording ? 'bg-red-50 border-red-300' : 'bg-[hsl(35,25%,97%)] border-border/50'
                }`}
              />
              {/* 録音中インジケーター（デスクトップのみ） */}
              {isRecording && (
                <div className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-75"></span>
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-150"></span>
                </div>
              )}
            </div>

            <Button
              size="icon"
              className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[hsl(260,30%,75%)] to-[hsl(260,30%,65%)] hover:from-[hsl(260,30%,70%)] hover:to-[hsl(260,30%,60%)] shadow-md hover:shadow-lg transition-all duration-300 flex-shrink-0"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading || !sessionId}
            >
              <Send className="h-5 w-5 text-white" />
            </Button>
          </div>
        </div>
        <div className="mt-3">
          <p className="text-xs text-center text-text-muted flex items-center justify-center gap-2">
            <span className={`inline-block w-2 h-2 rounded-full ${sessionId ? 'bg-green-500' : 'bg-gray-400'}`}></span>
            {footerMessage}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <section className="w-full pt-0 pb-12 px-6 bg-[hsl(35,25%,95%)]">
        <div className="max-w-5xl mx-auto">
          {chatContent(false)}
        </div>
      </section>

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent hideClose className="!max-w-[95vw] w-[95vw] h-[95vh] !max-h-[95vh] !p-0 !gap-0 bg-transparent !border-0 !shadow-none !outline-none">
          {chatContent(true)}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InlineChatModal;
