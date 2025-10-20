import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'chatModal',
  title: 'チャットモーダル設定',
  type: 'document',
  icon: () => '💬',
  description: '📍 使用箇所: / (トップページ) | ステータス: ✅ 使用中 | チャットモーダルの設定',
  // シングルトン設定
  __experimental_singleton: true,
  fields: [
    defineField({
      name: 'headerTitle',
      title: 'ヘッダータイトル',
      type: 'string',
      description: '🔴 必須 | チャットモーダルのヘッダーに表示されるタイトル',
      placeholder: '【必須】ヘッダータイトルを入力',
      initialValue: 'AIチャットアシスタント',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'headerSubtitle',
      title: 'ヘッダーサブタイトル',
      type: 'string',
      description: '🔴 必須 | ヘッダーに表示されるサブタイトル',
      placeholder: '【必須】サブタイトルを入力',
      initialValue: '24時間いつでもお答えします',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'inputPlaceholder',
      title: '入力フィールドのプレースホルダー',
      type: 'string',
      description: '🔴 必須 | メッセージ入力欄に表示されるプレースホルダー',
      placeholder: '【必須】プレースホルダーを入力',
      initialValue: 'メッセージを入力...',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'footerMessage',
      title: 'フッターメッセージ',
      type: 'string',
      description: '🔴 必須 | 入力エリアの下に表示されるメッセージ',
      placeholder: '【必須】フッターメッセージを入力',
      initialValue: 'セキュア接続・プライバシー保護・会話は保存されません',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'welcomeMessage',
      title: '初期メッセージ',
      type: 'text',
      description: '🔴 必須 | チャット開始時にAIが表示する最初のメッセージ',
      placeholder: '【必須】初期メッセージを入力',
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
              description: '🔴 必須',
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
              description: '🔴 必須',
              placeholder: '【必須】メッセージ内容を入力',
              validation: Rule => Rule.required()
            },
            {
              name: 'time',
              title: '表示時刻',
              type: 'string',
              description: '🔴 必須 | 例: 03:07',
              placeholder: '【必須】表示時刻を入力（例: 03:07）',
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
      name: 'contactFormButtonEnabled',
      title: 'お問い合わせフォームボタンを表示',
      type: 'boolean',
      description: 'チャットモーダル下部に「フォームから問い合わせる」ボタンを表示するかどうか',
      initialValue: true
    }),
    defineField({
      name: 'contactFormButtonText',
      title: 'お問い合わせボタンのテキスト',
      type: 'string',
      description: 'ボタンに表示するテキスト',
      initialValue: 'フォームから問い合わせる',
      hidden: ({document}) => !document?.contactFormButtonEnabled
    }),
    defineField({
      name: 'contactFormButtonUrl',
      title: 'お問い合わせボタンのリンク先',
      type: 'string',
      description: 'ボタンをクリックした時の遷移先URL（外部URLも可）',
      initialValue: 'https://effectmoe.notion.site/28fb802cb0c680b6823bdb7c1d0a1651?pvs=105',
      validation: Rule => Rule.custom((value) => {
        if (!value) return true;
        // 外部URLまたは内部URLの両方を許可
        if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/')) {
          return true;
        }
        return 'URLはhttps://または/から始まる必要があります';
      }),
      hidden: ({document}) => !document?.contactFormButtonEnabled
    }),
    defineField({
      name: 'contactFormButtonIcon',
      title: 'お問い合わせボタンのアイコン（プリセット）',
      type: 'string',
      description: 'プリセットアイコンを選択、またはカスタム画像を使用する場合は下のフィールドでアップロード',
      options: {
        list: [
          {title: 'なし', value: 'none'},
          {title: '⏰ 時計 (Clock)', value: 'Clock'},
          {title: '🧭 ナビゲーション (Navigation)', value: 'Navigation'},
          {title: '☕ コーヒー (Coffee)', value: 'Coffee'},
          {title: '📅 カレンダー (Calendar)', value: 'Calendar'},
          {title: '📅 カレンダーチェック (CalendarCheck)', value: 'CalendarCheck'},
          {title: '📍 マップピン (MapPin)', value: 'MapPin'},
          {title: '📞 電話 (Phone)', value: 'Phone'},
          {title: '✉️ メール (Mail)', value: 'Mail'},
          {title: 'ℹ️ 情報 (Info)', value: 'Info'},
          {title: '❓ ヘルプ (HelpCircle)', value: 'HelpCircle'},
          {title: '🏠 ホーム (Home)', value: 'Home'},
          {title: '💬 メッセージ (MessageSquare)', value: 'MessageSquare'},
          {title: '📝 フォーム (FileText)', value: 'FileText'},
          {title: '🔗 外部リンク (ExternalLink)', value: 'ExternalLink'},
          {title: '📤 送信 (Send)', value: 'Send'}
        ]
      },
      initialValue: 'none',
      hidden: ({document}) => !document?.contactFormButtonEnabled
    }),
    defineField({
      name: 'contactFormButtonCustomIcon',
      title: 'お問い合わせボタンのアイコン（カスタム画像）',
      type: 'image',
      description: '任意の画像をアップロード。設定するとプリセットアイコンより優先されます。推奨サイズ: 32x32px（透過PNG推奨）',
      options: {
        hotspot: true
      },
      hidden: ({document}) => !document?.contactFormButtonEnabled
    }),
    defineField({
      name: 'contactFormButtonBgColor',
      title: 'お問い合わせボタンの背景色（プリセット）',
      type: 'string',
      description: 'プリセットから選択、またはカスタム色を使用する場合は下のフィールドで設定',
      options: {
        list: [
          {title: '🌊 水色（イベントボタンと同じ）', value: 'hsl(180,15%,88%)'},
          {title: '🟣 パープル（FAQボタンと同じ）', value: 'hsl(260,15%,88%)'},
          {title: '🟤 ベージュ（FAQカードで使用）', value: 'hsl(35,22%,91%)'},
          {title: '🔵 ブルー（FAQカードで使用）', value: 'hsl(210,20%,88%)'},
          {title: '🟢 グリーン（FAQカードで使用）', value: 'hsl(120,15%,88%)'},
          {title: '🟡 イエロー（FAQカードで使用）', value: 'hsl(45,25%,88%)'},
          {title: '⚪ グレー（FAQカードで使用）', value: 'hsl(0,0%,91%)'}
        ]
      },
      initialValue: 'hsl(180,15%,88%)',
      hidden: ({document}) => !document?.contactFormButtonEnabled
    }),
    defineField({
      name: 'contactFormButtonCustomBgColor',
      title: 'お問い合わせボタンの背景色（カスタム）',
      type: 'string',
      description: '任意のカラーコードを入力（例: #FF5733, rgb(255,87,51), hsl(9,100%,60%)）。設定するとプリセットより優先されます。',
      placeholder: '例: #FF5733 または hsl(180,50%,70%)',
      validation: Rule => Rule.custom((value) => {
        if (!value) return true;
        // HEX, RGB, RGBA, HSL, HSLA形式をサポート
        const colorRegex = /^(#[0-9A-Fa-f]{3,8}|rgb\(|rgba\(|hsl\(|hsla\()/;
        if (colorRegex.test(value)) {
          return true;
        }
        return 'カラーコードの形式が正しくありません（例: #FF5733, rgb(255,87,51), hsl(9,100%,60%)）';
      }),
      hidden: ({document}) => !document?.contactFormButtonEnabled
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
