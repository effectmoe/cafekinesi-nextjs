import { SanityImage } from '@/components/SanityImage'
import type { TestimonialSection } from '@/types/sanity.types'

interface TestimonialProps extends TestimonialSection {}

export function Testimonial({
  title = 'お客様の声',
  subtitle,
  testimonials = [],
  layout = 'slider',
  showRating = true,
  backgroundColor = 'gray'
}: TestimonialProps) {
  const backgroundClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    primary: 'bg-[hsl(var(--primary))] text-white',
    transparent: ''
  }

  const layoutClasses = {
    slider: 'flex overflow-x-auto gap-6 pb-4',
    'grid-3': 'grid grid-cols-1 md:grid-cols-3 gap-8',
    'grid-2': 'grid grid-cols-1 md:grid-cols-2 gap-8',
    vertical: 'flex flex-col gap-8'
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-yellow-400 ${i < rating ? 'opacity-100' : 'opacity-30'}`}
      >
        ★
      </span>
    ))
  }

  return (
    <section className={`py-16 ${backgroundClasses[backgroundColor]}`}>
      <div className="w-full max-w-screen-xl mx-auto px-6">
        {/* セクションヘッダー */}
        <div className="text-center mb-12">
          {subtitle && (
            <p className="text-sm font-medium tracking-[0.2em] uppercase mb-4 opacity-70">
              {subtitle}
            </p>
          )}

          <h2 className="text-3xl md:text-4xl font-noto-serif mb-6">
            {title}
          </h2>
        </div>

        {/* お客様の声一覧 */}
        {testimonials.length > 0 && (
          <div className={layoutClasses[layout]}>
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`
                  ${layout === 'slider' ? 'flex-shrink-0 w-80' : ''}
                  ${testimonial.featured ? 'md:col-span-2 ring-2 ring-[hsl(var(--primary))]' : ''}
                  bg-white rounded-lg shadow-sm p-6 border border-gray-100
                `}
              >
                {/* 評価 */}
                {showRating && testimonial.rating && (
                  <div className="flex items-center mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                )}

                {/* 引用文 */}
                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>

                {/* 著者情報 */}
                <div className="flex items-center">
                  {testimonial.avatar && (
                    <div className="mr-4">
                      <SanityImage
                        image={testimonial.avatar}
                        alt={testimonial.avatar.alt || testimonial.author}
                        className="w-12 h-12 object-cover rounded-full"
                        width={48}
                        height={48}
                      />
                    </div>
                  )}

                  <div>
                    <div className="font-medium text-gray-900">
                      {testimonial.author}
                    </div>
                    {(testimonial.position || testimonial.company) && (
                      <div className="text-sm text-gray-600">
                        {testimonial.position}
                        {testimonial.position && testimonial.company && ' · '}
                        {testimonial.company}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* スライダーナビゲーション */}
        {layout === 'slider' && testimonials.length > 3 && (
          <div className="flex justify-center mt-8">
            <p className="text-sm text-gray-500">← スクロールして他の声を見る →</p>
          </div>
        )}
      </div>
    </section>
  )
}