interface Feature {
  _key: string
  icon: string
  title: string
  description: string
}

interface FeaturesSectionProps {
  title: string
  features: Feature[]
}

export default function FeaturesSection({ title, features }: FeaturesSectionProps) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-screen-xl mx-auto px-6">
        <h2 className="text-3xl font-noto-serif font-bold text-center text-gray-900 mb-12">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature._key} className="text-center">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}