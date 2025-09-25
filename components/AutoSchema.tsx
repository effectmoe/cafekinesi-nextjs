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
    // カスタムスキーマがある場合はそれを優先
    const customSchema = (document as any).customSchema
    if (customSchema?.enabled && customSchema?.jsonld) {
      try {
        const parsedSchema = JSON.parse(customSchema.jsonld)
        return <JsonLd data={parsedSchema} />
      } catch (error) {
        console.error('Error parsing custom schema:', error)
        // カスタムスキーマの解析に失敗した場合は自動生成にフォールバック
      }
    }

    // 自動生成スキーマを使用
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