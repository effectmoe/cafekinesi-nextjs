'use client'

import { Hero } from './sections/Hero'
import { Feature } from './sections/Feature'
import { CTA } from './sections/CTA'
import { Testimonial } from './sections/Testimonial'
import type { PageSection } from '@/types/sanity.types'

const components = {
  types: {
    hero: ({ value }: { value: any }) => <Hero {...value} />,
    feature: ({ value }: { value: any }) => <Feature {...value} />,
    featuresSection: ({ value }: { value: any }) => <Feature {...value} />,
    cta: ({ value }: { value: any }) => <CTA {...value} />,
    testimonial: ({ value }: { value: any }) => <Testimonial {...value} />
  }
}

interface PageBuilderProps {
  sections?: PageSection[]
}

export function PageBuilder({ sections }: PageBuilderProps) {
  if (!sections || sections.length === 0) {
    return null
  }

  return (
    <div className="page-builder">
      {sections.map((section, index) => {
        const Component = components.types[section._type as keyof typeof components.types]
        if (!Component) {
          console.warn(`Unknown section type: ${section._type}`)
          return null
        }
        return <Component key={section._key || index} value={section} />
      })}
    </div>
  )
}