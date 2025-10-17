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
  const manuallyEdited = useFormValue(['manuallyEdited']) as boolean | undefined

  // draft ID を published ID に変換（useDocumentOperation は draft ID を受け付けない）
  const publishedId = documentId?.replace(/^drafts\./, '') || documentId
  const { patch } = useDocumentOperation(publishedId, documentType)
  const lastProcessedRef = useRef<string>('')
  const isProcessingRef = useRef<boolean>(false)
  const previousExtractedTextRef = useRef<string>('')

  // 手動編集を検出
  useEffect(() => {
    if (extractedText && previousExtractedTextRef.current) {
      // extractedTextが変更された（手動編集された）
      if (extractedText !== previousExtractedTextRef.current) {
        console.log('✏️ Manual edit detected, setting manuallyEdited flag')
        if (patch) {
          patch.execute([{ set: { manuallyEdited: true } }])
        }
      }
    }
    previousExtractedTextRef.current = extractedText || ''
  }, [extractedText, patch])

  // Extract text when file is uploaded
  useEffect(() => {
    const extractText = async () => {
      console.log('🔄 useEffect triggered', {
        hasAsset: !!value?.asset?._ref,
        assetRef: value?.asset?._ref?.substring(0, 30) + '...',
        lastProcessed: lastProcessedRef.current?.substring(0, 30) + '...',
        hasExtractedText: !!extractedText,
        extractedTextLength: extractedText?.length || 0,
        manuallyEdited
      })

      if (!value?.asset?._ref) {
        return
      }

      // 手動編集されたドキュメントはスキップ（手動編集を最優先で保護）
      if (manuallyEdited) {
        console.log('🚫 Document was manually edited, skipping auto-extraction')
        return
      }

      // Prevent concurrent processing
      if (isProcessingRef.current) {
        console.log('⏸️  Already processing, skipping')
        return
      }

      // Check if this is a different file
      const isSameFile = lastProcessedRef.current === value.asset._ref

      // 【重要】同じファイルで、extractedTextが既に存在する場合はスキップ（手動編集を保護）
      // 新しいファイルの場合は、extractedTextが存在していても抽出を実行
      if (isSameFile && extractedText && extractedText.trim().length > 10) {
        console.log('✅ Same file with existing text, skipping to preserve edits')
        return
      }

      // 新しいファイルまたはextractedTextが空の場合は抽出を続行
      if (!isSameFile) {
        console.log('🆕 New file detected, extracting text...')
        // 新しいファイルの場合、manuallyEditedフラグをリセット
        if (manuallyEdited && patch) {
          patch.execute([{ unset: ['manuallyEdited'] }])
        }
      } else {
        console.log('📝 Same file but no text, extracting...')
      }

      // Mark as processing BEFORE starting
      isProcessingRef.current = true
      lastProcessedRef.current = value.asset._ref

      try {
        // Extract file details
        const assetRef = value.asset._ref

        // assetRef format: file-{hash}-{ext}
        // Convert to: {hash}.{ext}
        const parts = assetRef.split('-')

        const extension = parts[parts.length - 1] // Get last part (extension)
        const hash = parts.slice(1, -1).join('-') // Get middle parts (hash)
        const assetId = `${hash}.${extension}`

        const fileUrl = `https://cdn.sanity.io/files/${PROJECT_ID}/${DATASET}/${assetId}`

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

            const { text } = await apiResponse.json()
            extractedTextContent = text
          } catch (error) {
            console.error('PDF extraction failed:', error)
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
        if (!patch) {
          console.error('Patch function is not available')
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
      } catch (error) {
        console.error('Text extraction error:', error)
        // Reset on error to allow retry
        lastProcessedRef.current = ''
      } finally {
        // Always reset processing flag
        isProcessingRef.current = false
      }
    }

    extractText()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.asset?._ref])  // ファイル参照が変わったときのみ実行

  // Render the default file input
  return <FileInput {...props} />
}
