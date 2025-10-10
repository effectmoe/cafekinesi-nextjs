'use client';

import { Coffee, Clock, MapPin, Calendar } from 'lucide-react';
import { useState } from 'react';

interface QuickQuestionButtonsProps {
  onQuestionClick: (question: string) => Promise<void>;
  isLoading: boolean;
}

const quickQuestions = [
  {
    icon: Clock,
    text: '営業時間を教えて',
    question: '営業時間を教えてください'
  },
  {
    icon: MapPin,
    text: 'アクセス方法は?',
    question: 'アクセス方法を教えてください'
  },
  {
    icon: Coffee,
    text: 'おすすめメニュー',
    question: 'おすすめのメニューを教えてください'
  },
  {
    icon: Calendar,
    text: '予約について',
    question: '予約方法を教えてください'
  }
];

export function QuickQuestionButtons({ onQuestionClick, isLoading }: QuickQuestionButtonsProps) {
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);

  const handleClick = async (question: string, index: number) => {
    console.log('🟢 QuickQuestionButton クリック:', { question, index });
    setClickedIndex(index);

    try {
      await onQuestionClick(question);
      console.log('🟢 onQuestionClick 完了');
    } catch (error) {
      console.error('🔴 onQuestionClick エラー:', error);
    }

    // アニメーション完了後にリセット
    setTimeout(() => setClickedIndex(null), 1000);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      {quickQuestions.map((item, index) => (
        <button
          key={item.text}
          onClick={() => handleClick(item.question, index)}
          disabled={isLoading}
          className="group flex flex-col items-center gap-2 p-4 bg-white rounded-xl border-2 border-amber-200 hover:border-amber-400 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          <div className={`p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-all duration-300 ${
            clickedIndex === index ? 'bg-amber-300 scale-110 animate-pulse' : ''
          }`}>
            <item.icon className="w-6 h-6 text-amber-600" />
          </div>
          <span className="text-sm font-medium text-gray-700">{item.text}</span>
        </button>
      ))}
    </div>
  );
}
