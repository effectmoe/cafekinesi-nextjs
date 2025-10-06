'use client';

import { Card } from "@/components/ui/card";
import { Clock, Navigation, Coffee, CalendarCheck } from "lucide-react";

const FAQSection = () => {
  const faqs = [
    {
      title: "営業時間を教えて",
      icon: Clock,
      bgColor: "bg-[hsl(35,22%,91%)]",
      iconColor: "text-[hsl(35,45%,45%)]",
    },
    {
      title: "アクセス方法は？",
      icon: Navigation,
      bgColor: "bg-[hsl(210,20%,88%)]",
      iconColor: "text-[hsl(35,45%,45%)]",
    },
    {
      title: "おすすめメニュー",
      icon: Coffee,
      bgColor: "bg-[hsl(260,15%,88%)]",
      iconColor: "text-[hsl(35,45%,45%)]",
    },
    {
      title: "予約について",
      icon: CalendarCheck,
      bgColor: "bg-[hsl(0,0%,91%)]",
      iconColor: "text-[hsl(35,45%,45%)]",
    },
  ];

  return (
    <section className="w-full py-6 px-6 bg-[hsl(35,25%,95%)]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-medium text-text-primary mb-3 tracking-tight">
            Cafe Kinesi へようこそ
          </h2>
          <p className="text-text-secondary text-base">
            何かお探しですか？AIアシスタントがお答えします
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
          {faqs.map((faq, index) => {
            const Icon = faq.icon;
            return (
              <Card
                key={index}
                className={`group p-5 ${faq.bgColor} hover:shadow-lg transition-all duration-200 cursor-pointer border border-border/30 rounded-2xl hover:-translate-y-0.5`}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className={`${faq.iconColor} opacity-70 group-hover:opacity-100 transition-opacity`}>
                    <Icon className="w-8 h-8" strokeWidth={1.5} />
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
