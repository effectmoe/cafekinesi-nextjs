'use client';

import { useState, FormEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, isLoading, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || disabled) return;

    const message = input.trim();
    setInput('');
    await onSendMessage(message);
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-amber-200 bg-white p-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={disabled ? '接続中...' : 'メッセージを入力...'}
          disabled={disabled || isLoading}
          className="flex-1 px-4 py-3 border border-amber-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          maxLength={500}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading || disabled}
          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Send className="w-5 h-5" />
          <span className="font-medium">送信</span>
        </button>
      </div>
      {input.length > 0 && (
        <p className="text-xs text-gray-500 mt-2 text-right">
          {input.length}/500文字
        </p>
      )}
    </form>
  );
}
