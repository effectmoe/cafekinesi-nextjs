import {defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'
import {FileWithTextExtraction} from '../../components/inputs/FileWithTextExtraction'

export const knowledgeBase = defineType({
  name: 'knowledgeBase',
  title: 'ナレッジベース（AI学習用ドキュメント）',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'タイトル',
      type: 'string',
      validation: Rule => Rule.required(),
      description: '管理用のタイトル（ユーザーには表示されません）'
    }),
    defineField({
      name: 'description',
      title: '説明',
      type: 'text',
      description: 'このドキュメントの内容の概要'
    }),
    defineField({
      name: 'file',
      title: 'ファイル',
      type: 'file',
      validation: Rule => Rule.required(),
      description: 'PDF、Markdown(.md)、またはテキストファイル(.txt)をアップロード。アップロード後、自動的にテキストが抽出されます。',
      options: {
        accept: '.pdf,.md,.txt'
      },
      components: {
        input: FileWithTextExtraction
      }
    }),
    defineField({
      name: 'category',
      title: 'カテゴリー',
      type: 'string',
      options: {
        list: [
          {title: '📋 社内マニュアル', value: 'manual'},
          {title: '📚 技術ドキュメント', value: 'technical'},
          {title: '❓ FAQ下書き', value: 'faq'},
          {title: '📝 ポリシー・規約', value: 'policy'},
          {title: '🔧 トラブルシューティング', value: 'troubleshooting'},
          {title: '📊 レポート・分析', value: 'report'},
          {title: '💰 料金情報', value: 'pricing'},
          {title: '📍 店舗・アクセス情報', value: 'location'},
          {title: '👥 スタッフ情報', value: 'staff'},
          {title: '🎓 講座情報', value: 'course'},
          {title: '🏷️ その他', value: 'other'}
        ]
      },
      initialValue: 'other'
    }),
    defineField({
      name: 'tags',
      title: 'タグ',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags'
      },
      description: '検索用のタグ（例: 料金, 予約, アクセス）'
    }),
    defineField({
      name: 'useForAI',
      title: 'AI学習に使用',
      type: 'boolean',
      initialValue: true,
      description: 'オフにすると、AIがこのドキュメントを参照しなくなります'
    }),
    defineField({
      name: 'priority',
      title: '優先度',
      type: 'number',
      initialValue: 5,
      validation: Rule => Rule.min(1).max(10),
      description: '1（低）〜 10（高）。高いほどAIの回答に影響しやすくなります'
    }),
    defineField({
      name: 'extractedText',
      title: '抽出されたテキスト',
      type: 'text',
      description: 'ファイルから抽出されたテキスト。手動で編集可能です。編集すると、以降の自動抽出がスキップされます。'
    }),
    defineField({
      name: 'manuallyEdited',
      title: '手動編集フラグ',
      type: 'boolean',
      hidden: true, // UIには表示しない
      initialValue: false,
      description: 'extractedTextが手動編集された場合にtrueになります（内部使用）'
    }),
    defineField({
      name: 'fileType',
      title: 'ファイルタイプ',
      type: 'string',
      options: {
        list: [
          {title: 'テキスト', value: 'text'},
          {title: 'Markdown', value: 'markdown'},
          {title: 'PDF', value: 'pdf'}
        ]
      },
      description: 'ファイルの種類を選択してください'
    }),
    defineField({
      name: 'fileSize',
      title: 'ファイルサイズ（文字数）',
      type: 'number',
      description: '抽出されたテキストの文字数'
    }),
    defineField({
      name: 'lastProcessed',
      title: '最終処理日時',
      type: 'datetime',
      description: '最後にエンベディングが生成された日時'
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      description: 'description',
      useForAI: 'useForAI'
    },
    prepare({title, subtitle, description, useForAI}) {
      return {
        title: `${useForAI ? '✅' : '⏸️'} ${title}`,
        subtitle: subtitle ? subtitle.replace(/[^a-z]/gi, '') : 'その他',
        description: description
      }
    }
  },
  orderings: [
    {
      title: '優先度が高い順',
      name: 'priorityDesc',
      by: [
        {field: 'priority', direction: 'desc'},
        {field: 'title', direction: 'asc'}
      ]
    },
    {
      title: '最終更新日時',
      name: 'lastProcessedDesc',
      by: [{field: 'lastProcessed', direction: 'desc'}]
    }
  ]
})
