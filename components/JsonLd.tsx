import { FC } from 'react'
import { Thing, WithContext } from 'schema-dts'

interface JsonLdProps {
  data: WithContext<Thing> | WithContext<Thing>[] | null
}

const JsonLd: FC<JsonLdProps> = ({ data }) => {
  if (!data) return null

  let jsonLdString: string

  try {
    jsonLdString = JSON.stringify(data, null, process.env.NODE_ENV === 'development' ? 2 : 0)
  } catch (error) {
    console.error('Error serializing JSON-LD data:', error)
    return null
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdString }}
    />
  )
}

export default JsonLd