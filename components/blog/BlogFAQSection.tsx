'use client'

import { useState } from 'react'

interface FAQ {
  question: string
  answer: string
  _key?: string
}

interface BlogFAQSectionProps {
  faqs: FAQ[]
}

export default function BlogFAQSection({ faqs }: BlogFAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (!faqs || faqs.length === 0) {
    return null
  }

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-8 mb-8" id="faq">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">よくある質問</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={faq._key || index} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex justify-between items-start text-left py-3 hover:text-[#8B5A3C] transition-colors"
              aria-expanded={openIndex === index}
            >
              <span className="font-semibold text-gray-900 pr-4">
                Q. {faq.question}
              </span>
              <svg
                className={`w-5 h-5 flex-shrink-0 transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === index && (
              <div className="pt-2 pb-3 text-gray-600 leading-relaxed">
                <span className="font-medium text-[#8B5A3C]">A. </span>
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
