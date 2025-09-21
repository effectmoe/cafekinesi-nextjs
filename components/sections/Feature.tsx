import { SanityImage } from '@/components/SanityImage'
import type { FeatureSection } from '@/types/sanity.types'

interface FeatureProps extends FeatureSection {}

export function Feature({
  title,
  subtitle,
  description,
  image,
  icon,
  features = [],
  layout = 'grid-3',
  alignment = 'center',
  backgroundColor = 'transparent'
}: FeatureProps) {
  const backgroundClasses = {
    transparent: '',
    white: 'bg-white',
    gray: 'bg-gray-50',
    primary: 'bg-[hsl(var(--primary))] text-white'
  }

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }

  const layoutClasses = {
    'grid-3': 'grid-cols-1 md:grid-cols-3',
    'grid-2': 'grid-cols-1 md:grid-cols-2',
    'grid-4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    'split': 'md:flex-row',
    'vertical': 'flex-col'
  }

  return (
    <section className={`py-16 ${backgroundClasses[backgroundColor]}`}>
      <div className="w-full max-w-screen-xl mx-auto px-6">
        {/* セクションヘッダー */}
        <div className={`mb-12 ${alignmentClasses[alignment]}`}>
          {subtitle && (
            <p className="text-sm font-medium tracking-[0.2em] uppercase mb-4 opacity-70">
              {subtitle}
            </p>
          )}

          <h2 className="text-3xl md:text-4xl font-noto-serif mb-6">
            {title}
          </h2>

          {description && (
            <p className="text-lg opacity-90 max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* メイン画像 */}
        {image && layout === 'split' && (
          <div className="mb-12">
            <SanityImage
              image={image}
              alt={image.alt || title}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}

        {/* 機能一覧 */}
        {features.length > 0 && (
          <div className={`grid gap-8 ${layout === 'split' ? 'md:flex' : `grid ${layoutClasses[layout]}`}`}>
            {features.map((feature, index) => (
              <div key={index} className={`${alignmentClasses[alignment]}`}>
                {/* アイコンまたは画像 */}
                {feature.image ? (
                  <div className="mb-4">
                    <SanityImage
                      image={feature.image}
                      alt={feature.image.alt || feature.title}
                      className="w-16 h-16 object-cover rounded-lg mx-auto"
                      width={64}
                      height={64}
                    />
                  </div>
                ) : feature.icon ? (
                  <div className="mb-4">
                    <span className="text-3xl">{feature.icon}</span>
                  </div>
                ) : null}

                <h3 className="text-xl font-medium mb-3">
                  {feature.title}
                </h3>

                {feature.description && (
                  <p className="text-sm opacity-80 leading-relaxed">
                    {feature.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}