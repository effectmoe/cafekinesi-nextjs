'use client';

import { useRef, useState, Suspense } from 'react';
import FAQSection from './FAQSection';
import InlineChatModal from './InlineChatModal';
import { FAQCard, ChatModalSettings } from '@/types/chat.types';
import Link from 'next/link';
import { Card } from "@/components/ui/card";
import { Calendar } from 'lucide-react';

interface ChatSectionWrapperProps {
  faqCards: FAQCard[];
  chatSettings?: ChatModalSettings;
}

export function ChatSectionWrapper({ faqCards, chatSettings }: ChatSectionWrapperProps) {
  const chatSectionRef = useRef<HTMLDivElement>(null);
  const [questionToSend, setQuestionToSend] = useState<string | null>(null);

  const handleQuestionClick = async (question: string) => {
    console.log('🔵 質問カードクリック（Wrapper）:', question);

    // 1. チャットエリアまでスムーズスクロール
    console.log('🔵 スクロール開始');
    chatSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    // 2. スクロールアニメーション完了を待つ（500ms）
    await new Promise(resolve => setTimeout(resolve, 500));

    // 3. 質問を自動送信（InlineChatModalに渡す）
    console.log('🔵 質問送信セット:', question);
    setQuestionToSend(question);
  };

  const handleQuestionSent = () => {
    console.log('✅ 質問送信完了、状態をリセット');
    setQuestionToSend(null);
  };

  return (
    <>
      {/* FAQセクション - 新デザイン */}
      <FAQSection
        faqs={faqCards}
        title={chatSettings?.faqSectionTitle}
        subtitle={chatSettings?.faqSectionSubtitle}
        onQuestionClick={handleQuestionClick}
      />

      {/* AI Chat Section - インラインチャットモーダル */}
      {chatSettings?.isActive !== false && (
        <div ref={chatSectionRef}>
          <Suspense fallback={
            <div className="w-full py-6 px-6 bg-[hsl(35,25%,95%)]">
              <div className="max-w-5xl mx-auto">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4" />
                  <div className="h-96 bg-gray-100 rounded-3xl" />
                </div>
              </div>
            </div>
          }>
            <InlineChatModal
              settings={chatSettings}
              autoSendQuestion={questionToSend}
              onQuestionSent={handleQuestionSent}
            />
          </Suspense>
        </div>
      )}

      {/* カレンダーボタン - チャットモーダルの下 */}
      {chatSettings?.calendarButtonEnabled && (
        <section className="w-full pt-6 pb-12 px-6 bg-[hsl(35,25%,95%)]">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-center">
              <Link href={chatSettings.calendarButtonUrl || '/calendar'} className="w-full md:w-auto">
                <Card className="group p-5 bg-[hsl(180,15%,88%)] hover:shadow-lg transition-all duration-200 cursor-pointer border border-border/30 rounded-2xl hover:-translate-y-0.5 active:scale-95">
                  <div className="flex flex-col md:flex-row items-center justify-center text-center md:text-left gap-3 md:gap-4">
                    <div className="text-[hsl(35,45%,45%)] opacity-70 group-hover:opacity-100 transition-opacity">
                      <Calendar className="w-8 h-8" strokeWidth={1.5} />
                    </div>
                    <p className="text-sm font-medium text-text-primary">
                      {chatSettings.calendarButtonText || 'イベントの予定を見る'}
                    </p>
                  </div>
                </Card>
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
