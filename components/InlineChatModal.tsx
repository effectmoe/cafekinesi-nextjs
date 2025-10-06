'use client';

import { Sparkles, Send, Image as ImageIcon, Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useRef, useEffect } from "react";
import { useChat } from '@/hooks/useChat';

const InlineChatModal = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    if (!sessionId) {
      startSession();
    }
  }, [sessionId, startSession]);

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
              AIチャットアシスタント
            </h3>
            <p className="text-xs text-text-secondary">
              24時間いつでもお答えします
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isFullscreenView && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-text-secondary hover:text-text-primary"
              title="全画面表示"
              onClick={() => setIsFullscreen(true)}
            >
              <Maximize2 className="h-4 w-4" />
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
      <div className={`p-6 space-y-4 overflow-y-auto bg-gradient-to-b from-white to-[hsl(35,25%,98%)] chat-messages ${isFullscreenView ? 'flex-1' : 'max-h-[400px] min-h-[300px]'}`}>
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
        <div className="flex items-center gap-3">
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
            className="h-12 w-12 text-text-secondary hover:text-text-primary hover:bg-[hsl(35,25%,95%)] rounded-xl"
            title="画像を添付"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <ImageIcon className="h-5 w-5" />
          </Button>
          <input
            type="text"
            placeholder="メッセージを入力..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading || !sessionId}
            className="flex-1 px-4 py-3 bg-[hsl(35,25%,97%)] border border-border/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[hsl(35,30%,75%)] text-sm text-text-primary placeholder:text-text-muted disabled:opacity-50"
          />
          <Button
            size="icon"
            className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[hsl(260,30%,75%)] to-[hsl(260,30%,65%)] hover:from-[hsl(260,30%,70%)] hover:to-[hsl(260,30%,60%)] shadow-md hover:shadow-lg transition-all duration-300"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading || !sessionId}
          >
            <Send className="h-5 w-5 text-white" />
          </Button>
        </div>
        <p className="text-xs text-center text-text-muted mt-3 flex items-center justify-center gap-2">
          <span className={`inline-block w-2 h-2 rounded-full ${sessionId ? 'bg-green-500' : 'bg-gray-400'}`}></span>
          セキュア接続・プライバシー保護・会話は保存されません
        </p>
      </div>
    </div>
  );

  return (
    <>
      <section className="w-full py-0 px-6 mb-6 bg-[hsl(35,25%,95%)]">
        <div className="max-w-5xl mx-auto">
          {chatContent(false)}
        </div>
      </section>

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] h-[95vh] p-0 bg-transparent border-0">
          {chatContent(true)}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InlineChatModal;
