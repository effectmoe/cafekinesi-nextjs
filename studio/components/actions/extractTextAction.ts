import { DocumentActionComponent } from 'sanity'
import { DocumentTextIcon } from '@sanity/icons'

const PROJECT_ID = 'e4aqw590'
const DATASET = 'production'

export const extractTextAction: DocumentActionComponent = (context) => {
  const { draft, published, type } = context

  // Only show this action for knowledgeBase documents
  if (type !== 'knowledgeBase') {
    return null
  }

  const doc = draft || published

  return {
    label: 'テキストを抽出',
    icon: DocumentTextIcon,
    disabled: !doc?.file,
    tone: 'primary',
    onHandle: async () => {
      if (!doc?.file) {
        alert('ファイルがアップロードされていません')
        return
      }

      try {
        // Get the file URL from Sanity
        const fileAsset = doc.file.asset
        if (!fileAsset || !fileAsset._ref) {
          alert('ファイルアセットが見つかりません')
          return
        }

        // Extract file details
        const assetId = fileAsset._ref.replace('file-', '').replace('-txt', '.txt').replace('-md', '.md').replace('-pdf', '.pdf')
        const fileUrl = `https://cdn.sanity.io/files/${PROJECT_ID}/${DATASET}/${assetId}`

        // Fetch file content
        const response = await fetch(fileUrl)
        if (!response.ok) {
          throw new Error('ファイルの取得に失敗しました')
        }

        let extractedText = ''
        const contentType = response.headers.get('content-type') || ''

        if (contentType.includes('text') || assetId.endsWith('.txt') || assetId.endsWith('.md')) {
          // Text file
          extractedText = await response.text()
        } else if (contentType.includes('pdf') || assetId.endsWith('.pdf')) {
          // PDF file - for now, show a message
          alert('PDF からのテキスト抽出は現在サポートされていません。.txt または .md ファイルをご使用ください。')
          return
        } else {
          alert('サポートされていないファイル形式です')
          return
        }

        // Copy to clipboard
        try {
          await navigator.clipboard.writeText(extractedText)
          alert(`テキストの抽出が完了しました！\n\n文字数: ${extractedText.length}\n\nテキストをクリップボードにコピーしました。\n「抽出されたテキスト」フィールドに貼り付けてください。`)
        } catch (clipboardError) {
          // Fallback: show the text in a prompt
          console.error('Clipboard error:', clipboardError)
          const shouldCopy = confirm(`テキストの抽出が完了しました！\n\n文字数: ${extractedText.length}\n\nクリップボードへのコピーに失敗しました。\nOKを押すとテキストが表示されます。`)

          if (shouldCopy) {
            // Create a textarea element to allow manual copy
            const textarea = document.createElement('textarea')
            textarea.value = extractedText
            textarea.style.position = 'fixed'
            textarea.style.top = '50%'
            textarea.style.left = '50%'
            textarea.style.transform = 'translate(-50%, -50%)'
            textarea.style.width = '80%'
            textarea.style.height = '80%'
            textarea.style.zIndex = '9999'
            textarea.style.padding = '20px'
            textarea.style.fontSize = '14px'
            textarea.style.fontFamily = 'monospace'
            document.body.appendChild(textarea)
            textarea.select()

            // Add a close button
            const closeBtn = document.createElement('button')
            closeBtn.textContent = '閉じる'
            closeBtn.style.position = 'fixed'
            closeBtn.style.top = '10px'
            closeBtn.style.right = '10px'
            closeBtn.style.zIndex = '10000'
            closeBtn.style.padding = '10px 20px'
            closeBtn.style.fontSize = '16px'
            closeBtn.style.cursor = 'pointer'
            closeBtn.onclick = () => {
              document.body.removeChild(textarea)
              document.body.removeChild(closeBtn)
              document.body.removeChild(overlay)
            }

            // Add overlay
            const overlay = document.createElement('div')
            overlay.style.position = 'fixed'
            overlay.style.top = '0'
            overlay.style.left = '0'
            overlay.style.width = '100%'
            overlay.style.height = '100%'
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
            overlay.style.zIndex = '9998'

            document.body.appendChild(overlay)
            document.body.appendChild(closeBtn)
          }
        }
      } catch (error) {
        console.error('Text extraction error:', error)
        alert(`エラーが発生しました: ${error instanceof Error ? error.message : '不明なエラー'}`)
      }
    }
  }
}
