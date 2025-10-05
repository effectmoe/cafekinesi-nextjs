export default function InstructorServicesSection() {
  const services = [
    {
      id: 1,
      title: '個別セッション',
      description: 'マンツーマンであなたのニーズに合わせたキネシオロジーセッションやカフェキネシ施術を提供します。初心者の方でも安心して受けられます。',
    },
    {
      id: 2,
      title: 'グループワークショップ',
      description: '少人数グループでカフェキネシの体験やワークショップを開催。仲間と一緒に楽しく学べる講座です。',
    },
    {
      id: 3,
      title: '出張セッション',
      description: '企業や施設への出張セッションも可能。リラックスできる場所でセッションを受けられます。',
    },
  ]

  return (
    <section className="w-full bg-gray-50 py-16 md:py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
          提供サービス
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg p-6 md:p-8 shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                {service.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
