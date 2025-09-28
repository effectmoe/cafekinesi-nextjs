interface CourseCTAProps {
  title?: string
  description?: string
  primaryButton?: {
    text: string
    link?: string
  }
  secondaryButton?: {
    text: string
    link?: string
  }
}

export default function CourseCTA({
  title = 'まずは体験してみませんか？',
  description = 'カフェキネシオロジーの魅力を実際に体験していただける、体験講座を定期的に開催しています。お気軽にご参加ください。',
  primaryButton = { text: '体験講座のご案内' },
  secondaryButton = { text: 'お問い合わせ' }
}: CourseCTAProps) {
  return (
    <section className="w-full bg-gray-50 py-16 border-t">
      <div className="max-w-screen-xl mx-auto px-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {title}
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-gray-900 text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors">
            {primaryButton.text}
          </button>
          <button className="border border-gray-300 px-8 py-3 font-medium hover:bg-gray-100 transition-colors">
            {secondaryButton.text}
          </button>
        </div>
      </div>
    </section>
  )
}