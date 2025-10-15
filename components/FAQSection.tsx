'use client';

import { Card } from "@/components/ui/card";
import * as LucideIcons from "lucide-react";
import { FAQCard } from "@/types/chat.types";

interface FAQSectionProps {
  faqs?: FAQCard[]
  title?: string
  subtitle?: string
  onQuestionClick?: (question: string) => Promise<void>
}

const FAQSection = ({ faqs, title, subtitle, onQuestionClick }: FAQSectionProps) => {
  // デフォルト値（Sanityデータがない場合）
  const defaultFaqs: FAQCard[] = [
    {
      _id: '1',
      title: "営業時間を教えて",
      icon: 'Clock',
      bgColor: "bg-[hsl(35,22%,91%)]",
      iconColor: "text-[hsl(35,45%,45%)]",
      order: 0,
      isActive: true
    },
    {
      _id: '2',
      title: "アクセス方法は？",
      icon: 'Navigation',
      bgColor: "bg-[hsl(210,20%,88%)]",
      iconColor: "text-[hsl(35,45%,45%)]",
      order: 1,
      isActive: true
    },
    {
      _id: '3',
      title: "おすすめメニュー",
      icon: 'Coffee',
      bgColor: "bg-[hsl(260,15%,88%)]",
      iconColor: "text-[hsl(35,45%,45%)]",
      order: 2,
      isActive: true
    },
    {
      _id: '4',
      title: "予約について",
      icon: 'CalendarCheck',
      bgColor: "bg-[hsl(0,0%,91%)]",
      iconColor: "text-[hsl(35,45%,45%)]",
      order: 3,
      isActive: true
    },
  ];

  const displayFaqs = faqs && faqs.length > 0 ? faqs : defaultFaqs;

  // タイトルとサブタイトルが空白かどうかをチェック
  const hasTitle = title && title.trim().length > 0;
  const hasSubtitle = subtitle && subtitle.trim().length > 0;
  const hasAnyText = hasTitle || hasSubtitle;

  return (
    <section className="w-full pt-12 pb-6 px-6 bg-[hsl(35,25%,95%)]">
      <div className="max-w-5xl mx-auto">
        {/* タイトルまたはサブタイトルがある場合のみテキストセクションを表示 */}
        {hasAnyText && (
          <div className="text-center py-12">
            {hasTitle && (
              <h2 className="text-xl md:text-3xl lg:text-4xl font-medium text-text-primary mb-3 tracking-tight">
                {title}
              </h2>
            )}
            {hasSubtitle && (
              <p className="text-text-secondary text-base">
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {displayFaqs.map((faq) => {
            // Lucideアイコンを動的に取得
            const IconComponent = (LucideIcons as any)[faq.icon] || LucideIcons.HelpCircle;

            return (
              <Card
                key={faq._id}
                className={`group p-5 ${faq.bgColor} hover:shadow-lg transition-all duration-200 cursor-pointer border border-border/30 rounded-2xl hover:-translate-y-0.5 active:scale-95`}
                onClick={() => {
                  console.log('🟢 FAQ Card clicked:', faq.title);
                  if (onQuestionClick) {
                    onQuestionClick(faq.title);
                  }
                }}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className={`${faq.iconColor} opacity-70 group-hover:opacity-100 transition-opacity`}>
                    <IconComponent className="w-8 h-8" strokeWidth={1.5} />
                  </div>
                  <p className="text-sm font-medium text-text-primary">
                    {faq.title}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
