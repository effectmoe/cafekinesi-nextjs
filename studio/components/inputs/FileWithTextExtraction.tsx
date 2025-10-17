import { FileInputProps, useDocumentOperation, useFormValue } from 'sanity'
import { FileInput } from 'sanity'
import { useEffect, useRef } from 'react'

const PROJECT_ID = 'e4aqw590'
const DATASET = 'production'
// Next.js API URL (Sanity Studio is on port 3333, Next.js is on 3000/3002)
const NEXTJS_API_URL = typeof window !== 'undefined'
  ? window.location.hostname === 'localhost'
    ? 'http://localhost:3002'  // Changed from 3000 to 3002
    : 'https://cafekinesi-nextjs.vercel.app'
  : 'http://localhost:3002'

export function FileWithTextExtraction(props: FileInputProps) {
  const { value } = props
  const documentId = useFormValue(['_id']) as string
  const documentType = useFormValue(['_type']) as string
  const extractedText = useFormValue(['extractedText']) as string | undefined

  // draft ID を published ID に変換（useDocumentOperation は draft ID を受け付けない）
  const publishedId = documentId?.replace(/^drafts\./, '') || documentId
  const { patch } = useDocumentOperation(publishedId, documentType)
  const lastProcessedRef = useRef<string>('')
  const isProcessingRef = useRef<boolean>(false)

  // Extract text when file is uploaded
  useEffect(() => {
    const extractText = async () => {
      // Debug logging
      console.log('🔍 [Debug] Current state:', {
        hasAssetRef: !!value?.asset?._ref,
        assetRef: value?.asset?._ref?.substring(0, 20) + '...',
        lastProcessed: lastProcessedRef.current?.substring(0, 20) + '...',
        hasExtractedText: !!extractedText,
        extractedTextLength: extractedText?.length || 0,
        extractedTextPreview: extractedText ? extractedText.substring(0, 50) + '...' : 'null/undefined',
        isProcessing: isProcessingRef.current
      })

      if (!value?.asset?._ref) {
        console.log('⚠️  No asset ref found')
        return
      }

      // Prevent concurrent processing
      if (isProcessingRef.current) {
        console.log('🚫 Already processing, skipping...')
        return
      }

      // Check if this is a different file
      const isSameFile = lastProcessedRef.current === value.asset._ref
      const hasExtractedText = extractedText && extractedText.trim().length > 10

      console.log('🔍 [Check] isSameFile:', isSameFile, '| hasExtractedText:', hasExtractedText)

      // If same file AND has valid extracted text, skip
      if (isSameFile && hasExtractedText) {
        console.log('⏭️  File already processed:', value.asset._ref)
        console.log('   📊 Extracted text length:', extractedText?.length)
        return
      }

      // If same file but no valid text, re-process
      if (isSameFile && !hasExtractedText) {
        console.log('🔄 Re-processing file (extractedText is empty or too short)')
        console.log('   📊 Current length:', extractedText?.length || 0)
      }

      console.log('🚀 Starting text extraction...')

      // Mark as processing BEFORE starting
      isProcessingRef.current = true
      lastProcessedRef.current = value.asset._ref

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
        console.log('🔧 Attempting to patch document...')
        console.log('📝 Document ID:', documentId)
        console.log('📝 Published ID:', publishedId)
        console.log('📝 Document Type:', documentType)
        console.log('📝 Patch function available:', !!patch)
        console.log('📝 Data to patch:', {
          extractedText: extractedTextContent.substring(0, 100) + '...',
          fileType,
          fileSize,
          lastProcessed: new Date().toISOString()
        })

        if (!patch) {
          console.error('❌ Patch function is not available!')
          return
        }

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

        console.log('✅ Text extracted successfully and patch executed:', { fileSize, fileType })
      } catch (error) {
        console.error('❌ Text extraction error:', error)
        // Reset on error to allow retry
        lastProcessedRef.current = ''
      } finally {
        // Always reset processing flag
        isProcessingRef.current = false
        console.log('🏁 Processing complete')
      }
    }

    extractText()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.asset?._ref])  // extractedTextを削除 - 手動編集時に再実行されないようにする

  // Render the default file input
  return <FileInput {...props} />
}
