import { DocumentActionComponent } from 'sanity'
import { DatabaseIcon } from '@sanity/icons'
import { useCallback } from 'react'

export const updateEmbeddingAction: DocumentActionComponent = (props) => {
  const { type, draft, published, id } = props

  if (type !== 'knowledgeBase') {
    return null
  }

  const doc = draft || published

  const handleUpdate = useCallback(async () => {
    if (!doc?.extractedText) {
      alert('抽出されたテキストがありません。先にファイルをアップロードしてください。')
      return
    }

    const confirmed = confirm(
      `「${doc.title}」のエンベディングを更新しますか？\n\nこれにより、AIが最新の情報を参照できるようになります。`
    )

    if (!confirmed) {
      return
    }

    try {
      const baseUrl = typeof window !== 'undefined' && window.location.hostname.includes('sanity.studio')
        ? 'https://cafekinesi-nextjs.vercel.app'
        : 'http://localhost:3000'

      const response = await fetch(`${baseUrl}/api/webhooks/sanity-sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: id,
          _type: type,
          ...doc
        })
      })

      const result = await response.json()

      if (response.ok) {
        alert(`✅ エンベディングの更新が完了しました！\n\nAIが最新の情報を参照できるようになりました。`)
      } else {
        throw new Error(result.details || 'Unknown error')
      }
    } catch (error) {
      console.error('Embedding update error:', error)
      alert(`❌ エラーが発生しました: ${error instanceof Error ? error.message : '不明なエラー'}`)
    }
  }, [doc, id, type])

  return {
    label: 'エンベディングを更新',
    icon: DatabaseIcon,
    disabled: !doc?.extractedText,
    tone: 'positive',
    onHandle: handleUpdate
  }
}
