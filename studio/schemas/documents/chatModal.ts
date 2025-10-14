import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'chatModal',
  title: 'チャットモーダル設定',
  type: 'document',
  // シングルトン設定
  __experimental_singleton: true,
  fields: [
    defineField({
      name: 'headerTitle',
      title: 'ヘッダータイトル',
      type: 'string',
      description: 'チャットモーダルのヘッダーに表示されるタイトル',
      initialValue: 'AIチャットアシスタント',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'headerSubtitle',
      title: 'ヘッダーサブタイトル',
      type: 'string',
      description: 'ヘッダーに表示されるサブタイトル',
      initialValue: '24時間いつでもお答えします',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'inputPlaceholder',
      title: '入力フィールドのプレースホルダー',
      type: 'string',
      description: 'メッセージ入力欄に表示されるプレースホルダー',
      initialValue: 'メッセージを入力...',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'footerMessage',
      title: 'フッターメッセージ',
      type: 'string',
      description: '入力エリアの下に表示されるメッセージ',
      initialValue: 'セキュア接続・プライバシー保護・会話は保存されません',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'welcomeMessage',
      title: '初期メッセージ',
      type: 'text',
      description: 'チャット開始時にAIが表示する最初のメッセージ',
      initialValue: 'こんにちは！Cafe Kinesiへようこそ☕ カフェについて何でもお尋ねください。',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'sampleMessages',
      title: 'サンプルメッセージ',
      type: 'array',
      description: 'チャット履歴に表示されるサンプルメッセージ（デモ用）',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'role',
              title: '送信者',
              type: 'string',
              options: {
                list: [
                  {title: 'ユーザー', value: 'user'},
                  {title: 'アシスタント', value: 'assistant'}
                ]
              },
              validation: Rule => Rule.required()
            },
            {
              name: 'content',
              title: 'メッセージ内容',
              type: 'text',
              validation: Rule => Rule.required()
            },
            {
              name: 'time',
              title: '表示時刻',
              type: 'string',
              description: '例: 03:07',
              validation: Rule => Rule.required()
            }
          ],
          preview: {
            select: {
              role: 'role',
              content: 'content',
              time: 'time'
            },
            prepare({role, content, time}) {
              return {
                title: `${role === 'user' ? '👤' : '🤖'} ${content.slice(0, 50)}...`,
                subtitle: time
              }
            }
          }
        }
      ]
    }),
    defineField({
      name: 'faqSectionTitle',
      title: 'FAQセクションタイトル',
      type: 'string',
      description: 'FAQセクションの見出し（空白の場合は非表示）',
      initialValue: 'Cafe Kinesi へようこそ'
    }),
    defineField({
      name: 'faqSectionSubtitle',
      title: 'FAQセクションサブタイトル',
      type: 'string',
      description: 'FAQセクションの説明文（空白の場合は非表示）',
      initialValue: '何かお探しですか？AIアシスタントがお答えします'
    }),
    defineField({
      name: 'calendarButtonEnabled',
      title: 'イベントカレンダーボタンを表示',
      type: 'boolean',
      description: 'チャットモーダル下部に「イベントの予定を見る」ボタンを表示するかどうか',
      initialValue: true
    }),
    defineField({
      name: 'calendarButtonText',
      title: 'カレンダーボタンのテキスト',
      type: 'string',
      description: 'ボタンに表示するテキスト',
      initialValue: 'イベントの予定を見る',
      hidden: ({document}) => !document?.calendarButtonEnabled
    }),
    defineField({
      name: 'calendarButtonUrl',
      title: 'カレンダーボタンのリンク先',
      type: 'string',
      description: 'ボタンをクリックした時の遷移先URL',
      initialValue: '/calendar',
      validation: Rule => Rule.custom((value) => {
        if (!value) return true;
        if (!value.startsWith('/')) {
          return 'URLは/から始まる必要があります（例: /calendar）';
        }
        return true;
      }),
      hidden: ({document}) => !document?.calendarButtonEnabled
    }),
    defineField({
      name: 'isActive',
      title: '有効',
      type: 'boolean',
      description: 'チャットモーダルを表示するかどうか',
      initialValue: true
    })
  ],
  preview: {
    select: {
      title: 'headerTitle',
      subtitle: 'headerSubtitle',
      isActive: 'isActive'
    },
    prepare({title, subtitle, isActive}) {
      return {
        title: title,
        subtitle: `${subtitle} ${isActive ? '✅' : '❌'}`
      }
    }
  }
})
