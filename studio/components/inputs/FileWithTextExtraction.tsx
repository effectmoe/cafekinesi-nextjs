import { FileInputProps, useDocumentOperation, useFormValue } from 'sanity'
import { FileInput } from 'sanity'
import { useEffect, useRef } from 'react'

const PROJECT_ID = 'e4aqw590'
const DATASET = 'production'
// Next.js API URL (Sanity Studio is on port 3333, Next.js is on 3000)
const NEXTJS_API_URL = typeof window !== 'undefined'
  ? window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://cafekinesi-nextjs.vercel.app'
  : 'http://localhost:3000'

export function FileWithTextExtraction(props: FileInputProps) {
  const { value } = props
  const documentId = useFormValue(['_id']) as string
  const documentType = useFormValue(['_type']) as string
  const extractedText = useFormValue(['extractedText']) as string | undefined

  // draft ID を published ID に変換（useDocumentOperation は draft ID を受け付けない）
  const publishedId = documentId?.replace(/^drafts\./, '') || documentId
  const { patch } = useDocumentOperation(publishedId, documentType)
  const lastProcessedRef = useRef<string>('')

  // Extract text when file is uploaded
  useEffect(() => {
    const extractText = async () => {
      if (!value?.asset?._ref) {
        console.log('⚠️  No asset ref found')
        return
      }

      // Check if we've already processed this file
      if (lastProcessedRef.current === value.asset._ref) {
        console.log('⏭️  File already processed:', value.asset._ref)
        return
      }

      console.log('🚀 Starting text extraction...')

      try {
        // Extract file details
        const assetRef = value.asset._ref
        console.log('📎 Asset ref:', assetRef)

        // assetRef format: file-{hash}-{ext}
        // Convert to: {hash}.{ext}
        const parts = assetRef.split('-')
        console.log('📦 Parts:', parts)

        const extension = parts[parts.length - 1] // Get last part (extension)
        const hash = parts.slice(1, -1).join('-') // Get middle parts (hash)
        const assetId = `${hash}.${extension}`

        const fileUrl = `https://cdn.sanity.io/files/${PROJECT_ID}/${DATASET}/${assetId}`

        console.log('🔍 Fetching file:', fileUrl)

        // Fetch file content
        const response = await fetch(fileUrl)
        if (!response.ok) {
          console.error('Failed to fetch file:', response.statusText, fileUrl)
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
          // PDF - extract using API
          console.log('📄 Extracting text from PDF via API...')

          try {
            const apiResponse = await fetch(`${NEXTJS_API_URL}/api/extract-pdf-text`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ fileUrl })
            })

            if (!apiResponse.ok) {
              console.error('Failed to extract PDF text:', apiResponse.statusText)
              return
            }

            const { text, metadata } = await apiResponse.json()
            extractedTextContent = text
            console.log(`✅ PDF text extracted: ${metadata.pages} pages, ${metadata.textLength} characters`)
          } catch (error) {
            console.error('❌ PDF extraction failed:', error)
            return
          }
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
  }, [value?.asset?._ref, patch])

  // Render the default file input
  return <FileInput {...props} />
}
