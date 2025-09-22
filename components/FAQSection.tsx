'use client'

import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

interface FAQItem {
  _id: string
  question: string
  answer: string
  category?: string
}

interface FAQSectionProps {
  faqs: FAQItem[]
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  if (!faqs || faqs.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-noto-serif font-bold text-center text-gray-900 mb-12">
          よくある質問
        </h2>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq._id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleItem(faq._id)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                <ChevronDownIcon
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openItems.includes(faq._id) ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openItems.includes(faq._id) && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}