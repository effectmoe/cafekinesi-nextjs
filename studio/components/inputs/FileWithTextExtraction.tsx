import { FileInputProps, useDocumentOperation, useFormValue } from 'sanity'
import { FileInput } from 'sanity'
import { useEffect, useRef } from 'react'

const PROJECT_ID = 'e4aqw590'
const DATASET = 'production'

export function FileWithTextExtraction(props: FileInputProps) {
  const { value } = props
  const documentId = useFormValue(['_id']) as string
  const documentType = useFormValue(['_type']) as string
  const extractedText = useFormValue(['extractedText']) as string | undefined

  // draft ID の場合、published ID に変換
  const publishedId = documentId?.replace(/^drafts\./, '') || documentId
  const { patch } = useDocumentOperation(publishedId, documentType)
  const lastProcessedRef = useRef<string>('')

  // Extract text when file is uploaded
  useEffect(() => {
    const extractText = async () => {
      if (!value?.asset?._ref) {
        return
      }

      // Check if we've already processed this file
      if (lastProcessedRef.current === value.asset._ref) {
        return
      }

      // Check if text has already been extracted
      if (extractedText) {
        lastProcessedRef.current = value.asset._ref
        return
      }

      try {
        // Extract file details
        const assetRef = value.asset._ref
        const assetId = assetRef
          .replace('file-', '')
          .replace('-txt', '.txt')
          .replace('-md', '.md')
          .replace('-pdf', '.pdf')

        const fileUrl = `https://cdn.sanity.io/files/${PROJECT_ID}/${DATASET}/${assetId}`

        // Fetch file content
        const response = await fetch(fileUrl)
        if (!response.ok) {
          console.error('Failed to fetch file:', response.statusText)
          return
        }

        let extractedTextContent = ''
        const contentType = response.headers.get('content-type') || ''

        if (
          contentType.includes('text') ||
          assetId.endsWith('.txt') ||
          assetId.endsWith('.md')
        ) {
          // Text file
          extractedTextContent = await response.text()
        } else if (contentType.includes('pdf') || assetId.endsWith('.pdf')) {
          // PDF not supported yet
          console.warn('PDF text extraction not yet supported')
          return
        } else {
          console.warn('Unsupported file type:', contentType)
          return
        }

        // Get file size
        const fileSize = extractedTextContent.length

        // Determine file type
        let fileType = 'text'
        if (assetId.endsWith('.md')) {
          fileType = 'markdown'
        } else if (assetId.endsWith('.pdf')) {
          fileType = 'pdf'
        }

        // Update the document fields using patch
        patch.execute([
          {
            set: {
              extractedText: extractedTextContent,
              fileType,
              fileSize,
              lastProcessed: new Date().toISOString()
            }
          }
        ])

        lastProcessedRef.current = value.asset._ref
        console.log('✅ Text extracted successfully:', { fileSize, fileType })
      } catch (error) {
        console.error('❌ Text extraction error:', error)
      }
    }

    extractText()
  }, [value?.asset?._ref, extractedText, patch])

  // Render the default file input
  return <FileInput {...props} />
}
