'use client';

import { useState, FormEvent, useEffect } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { isWebView, getWebViewWarning } from '@/lib/voice/webview-detector';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, isLoading, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');

  // 音声入力フック
  const {
    isRecording,
    isSupported,
    interimTranscript,
    error: voiceError,
    startRecording,
    stopRecording,
    clearError,
  } = useVoiceInput({
    onResult: (text) => {
      // 音声入力結果を入力フィールドに追加
      setInput((prev) => {
        const newText = prev ? `${prev} ${text}` : text;
        return newText.slice(0, 500); // 最大文字数制限
      });
    },
    onError: (error) => {
      console.error('Voice input error:', error);
    },
    autoCorrect: true,
    autoPunctuation: true,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || disabled) return;

    const message = input.trim();
    setInput('');
    await onSendMessage(message);
  };

  // ショートカットキー（Ctrl+M）で音声入力を開始
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+M または Cmd+M で音声入力トグル
      if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        if (isSupported && !disabled && !isLoading) {
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
  }, [isRecording, isSupported, disabled, isLoading, startRecording, stopRecording]);

  return (
    <form onSubmit={handleSubmit} className="border-t border-amber-200 bg-white p-4">
      {/* エラー表示 */}
      {voiceError && (
        <div className="mb-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
          {voiceError === 'not-allowed' && (
            <div>
              <p className="font-semibold mb-1">マイクの使用が許可されていません</p>
              <p className="text-xs mb-2">
                ブラウザのアドレスバー左側の🔒または🛈アイコンをクリック →「サイトの設定」→「マイク」を「許可」に変更してください
              </p>
              {isWebView() && (
                <p className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                  ⚠️ {getWebViewWarning()}
                </p>
              )}
            </div>
          )}
          {voiceError === 'no-speech' && '音声が検出されませんでした。もう一度お試しください。'}
          {voiceError === 'network' && 'ネットワークエラーが発生しました。'}
          {voiceError === 'not-supported' && (
            <div>
              <p className="font-semibold mb-1">お使いのブラウザは音声入力に対応していません</p>
              <p className="text-xs">
                Chrome、Edge、Safariなどの最新ブラウザをご利用ください。
                {isWebView() && 'LINEなどのSNSアプリ内ブラウザではご利用いただけません。'}
              </p>
            </div>
          )}
          {!['not-allowed', 'no-speech', 'network', 'not-supported'].includes(voiceError) && '音声入力でエラーが発生しました。'}
          <button
            type="button"
            onClick={clearError}
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

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={disabled ? '接続中...' : 'メッセージを入力...'}
            disabled={disabled || isLoading}
            className={`w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all ${
              isRecording ? 'border-red-300 bg-red-50' : 'border-amber-200'
            }`}
            maxLength={500}
            aria-label="チャットメッセージ入力"
          />
          {/* 録音中インジケーター */}
          {isRecording && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-75"></span>
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-150"></span>
            </div>
          )}
        </div>

        {/* 音声入力ボタン */}
        {isSupported && (
          <div className="relative group">
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={disabled || isLoading}
              className={`p-3 rounded-full transition-all duration-200 shadow-md hover:shadow-lg ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 text-white ring-4 ring-red-200'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-amber-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label={isRecording ? '音声入力を停止' : '音声入力を開始'}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            {/* ショートカットヒント */}
            {!isRecording && (
              <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                Ctrl+M / Cmd+M
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={!input.trim() || isLoading || disabled}
          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl active:scale-95"
          aria-label="メッセージを送信"
        >
          <Send className="w-5 h-5" />
          <span className="font-medium">送信</span>
        </button>
      </div>

      {/* 文字数カウンター */}
      {input.length > 0 && (
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-500">
            {input.length}/500文字
          </p>
        </div>
      )}
    </form>
  );
}
