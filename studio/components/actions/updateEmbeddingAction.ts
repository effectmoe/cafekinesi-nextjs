import { DocumentActionComponent } from 'sanity'
import { DatabaseIcon } from '@sanity/icons'
import { useCallback } from 'react'

export const updateEmbeddingAction: DocumentActionComponent = (props) => {
  const { type, draft, published, id } = props

  if (type !== 'knowledgeBase') {
    return null
  }

  // 常にpublishedドキュメントを使用（存在する場合）
  const doc = published || draft
  const isDraft = !published && !!draft

  // draft ID の場合、published ID に変換
  const publishedId = id.replace(/^drafts\./, '')

  const handleUpdate = useCallback(async () => {
    if (!doc?.extractedText) {
      alert('抽出されたテキストがありません。先にファイルをアップロードしてください。')
      return
    }

    // 未公開の変更がある場合は警告
    if (isDraft) {
      alert('⚠️ このドキュメントは未公開です。\n\n先に「パブリッシュ」してから、エンベディングを更新してください。')
      return
    }

    // draftがある場合（公開済みだが編集中）も警告
    if (draft) {
      const proceedWithDraft = confirm(
        '⚠️ 未公開の変更があります。\n\n現在公開されているバージョンでエンベディングを更新しますか？\n\n最新の変更を反映したい場合は、先に「パブリッシュ」してください。'
      )
      if (!proceedWithDraft) {
        return
      }
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

      // publishedドキュメントのみを送信（draftは含めない）
      console.log('📤 Sending embedding update:', {
        _id: publishedId,
        _type: type,
        title: doc.title,
        hasExtractedText: !!doc.extractedText,
        extractedTextLength: doc.extractedText?.length || 0
      })

      const response = await fetch(`${baseUrl}/api/webhooks/sanity-sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: publishedId,
          _type: type,
          title: doc.title,
          extractedText: doc.extractedText,
          category: doc.category,
          tags: doc.tags,
          isActive: doc.isActive,
          priority: doc.priority
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
  }, [doc, publishedId, type, isDraft, draft])

  return {
    label: 'エンベディングを更新',
    icon: DatabaseIcon,
    disabled: !doc?.extractedText,
    tone: 'positive',
    onHandle: handleUpdate
  }
}
