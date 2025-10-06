'use client';

import { Message } from '@/lib/chat/session-manager';
import { User, Bot } from 'lucide-react';
import { TypingIndicator } from './TypingIndicator';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function ChatMessages({ messages, isLoading, messagesEndRef }: ChatMessagesProps) {
  return (
    <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white to-amber-50/30">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <Bot className="w-16 h-16 mx-auto mb-4 text-amber-500 opacity-50" />
          <p className="text-lg">まだメッセージがありません</p>
          <p className="text-sm mt-2">下のボタンをクリックするか、メッセージを入力してください</p>
        </div>
      ) : (
        <>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}

              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-md ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                    : 'bg-white text-gray-800 border border-amber-200'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(msg.timestamp).toLocaleTimeString('ja-JP', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {msg.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start animate-fade-in">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white rounded-2xl px-4 py-3 border border-amber-200 shadow-md">
                <TypingIndicator />
              </div>
            </div>
          )}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
