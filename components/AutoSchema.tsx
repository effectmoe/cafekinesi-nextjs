import { FC } from 'react'
import JsonLd from './JsonLd'
import { schemaGenerator } from '@/lib/schema-generator'
import { SanityDocument } from '@/types/schema.types'

interface AutoSchemaProps {
  document: SanityDocument
  additionalSchemas?: any[]
}

const AutoSchema: FC<AutoSchemaProps> = ({ document, additionalSchemas = [] }) => {
  if (!document) {
    return null
  }

  try {
    const mainSchema = schemaGenerator.generate(document)

    if (!mainSchema && additionalSchemas.length === 0) {
      return null
    }

    // メインスキーマと追加スキーマを結合
    const schemas = []

    if (mainSchema) {
      schemas.push(mainSchema)
    }

    if (additionalSchemas.length > 0) {
      schemas.push(...additionalSchemas)
    }

    return (
      <>
        {schemas.map((schema, index) => (
          <JsonLd key={index} data={schema} />
        ))}
      </>
    )
  } catch (error) {
    console.error('Error generating auto schema:', error)
    return null
  }
}

export default AutoSchema