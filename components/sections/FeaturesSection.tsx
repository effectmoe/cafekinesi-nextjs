'use client'

interface Feature {
  _key: string
  _type: string
  title?: string
  description?: string
  icon?: string
}

interface FeaturesSectionProps {
  _key?: string
  _type?: string
  title?: string
  features?: Feature[]
}

export function FeaturesSection({ title, features }: FeaturesSectionProps) {
  if (!features || features.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature._key} className="text-center">
              {feature.icon && (
                <div className="text-4xl mb-4">{feature.icon}</div>
              )}
              {feature.title && (
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              )}
              {feature.description && (
                <p className="text-gray-600">{feature.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}