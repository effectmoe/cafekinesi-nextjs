// FAQ質問カードの型定義
export interface FAQCard {
  _id: string
  title: string
  icon: string
  bgColor: string
  iconColor: string
  order: number
  isActive: boolean
}

// チャットモーダル設定の型定義
export interface ChatModalSettings {
  _id: string
  headerTitle: string
  headerSubtitle: string
  inputPlaceholder: string
  footerMessage: string
  welcomeMessage: string
  sampleMessages: SampleMessage[]
  faqSectionTitle: string
  faqSectionSubtitle: string
  isActive: boolean
}

// サンプルメッセージの型定義
export interface SampleMessage {
  role: 'user' | 'assistant'
  content: string
  time: string
}
