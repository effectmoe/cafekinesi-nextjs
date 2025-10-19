// AI-Firstスキーマ（最優先）
// 注意: 以下のスキーマは未使用のため非推奨化（2025-10-19）
// 将来的に必要になったら復元可能
// import person from './ai-first/person'
// import service from './ai-first/service'
// import organization from './ai-first/organization'
// import aiContent from './ai-first/aiContent'

// ドキュメントスキーマ
import blogPost from './documents/blogPost'
import author from './documents/author'
// import category from './documents/category' // 未使用（menuItemの参照先だが、menuItem自体が未使用）（2025-10-19）
import event from './documents/event'
// import news from './documents/news' // 未使用（フロントエンドページ未実装）（2025-10-19）
// import menuItem from './documents/menuItem' // 未使用（カフェメニュー機能未実装）（2025-10-19）
// import shopInfo from './documents/shopInfo' // 未使用（店舗情報ページ未実装）（2025-10-19）
import page from './documents/page'
import homepage from './documents/homepage'
import siteSettings from './documents/siteSettings'
import course from './documents/course'
import schoolPage from './documents/schoolPage'
import schoolPageContent from './documents/schoolPageContent'
import instructor from './documents/instructor'
import instructorPage from './documents/instructorPage'
import profilePage from './documents/profilePage'
import aboutPage from './documents/aboutPage'
import representative from './representative'
import { faq } from './faq'
import { faqCategory } from './faqCategory'
import faqCard from './documents/faqCard'
import chatModal from './documents/chatModal'
import siteConfig from './documents/siteConfig'

// AI/RAGスキーマ
import chatConfiguration from './chat/chatConfiguration'
import aiGuardrails from './ai/aiGuardrails'
import aiProviderSettings from './ai/aiProviderSettings'
import ragConfiguration from './rag/ragConfiguration'
import { knowledgeBase } from './rag/knowledgeBase'

// オブジェクトスキーマ
import seo from './objects/seo'
import schemaOrg from './objects/schemaOrg'
import hero from './objects/hero'
import cta from './objects/cta'
import feature from './objects/feature'
import testimonial from './objects/testimonial'
import categoryCard from './objects/categoryCard'
import socialLink from './objects/socialLink'
import navigationMenu from './objects/navigationMenu'
import table from './objects/table'
import infoBox from './objects/infoBox'
import comparisonTable from './objects/comparisonTable'
import internalLink from './objects/internalLink'
import externalReference from './objects/externalReference'

// コンポーネントスキーマ
import customImage from './components/customImage'
import portableText from './components/portableText'
import videoEmbed from './components/videoEmbed'
import socialEmbed from './components/socialEmbed'
import codeBlock from './components/codeBlock'

export const schemaTypes = [
  // AI-First エンティティ（最優先）
  // 注意: 未使用のため非推奨化（2025-10-19）
  // person,
  // service,
  // organization,
  // aiContent,

  // ドキュメント
  blogPost,
  author,
  // category, // 未使用（2025-10-19）
  event,
  // news, // 未使用（2025-10-19）
  // menuItem, // 未使用（2025-10-19）
  // shopInfo, // 未使用（2025-10-19）
  page,
  homepage,
  siteSettings,
  course,
  schoolPage,
  schoolPageContent,
  instructor,
  instructorPage,
  profilePage,
  aboutPage,
  representative,
  faq,
  faqCategory,
  faqCard,
  chatModal,
  siteConfig,

  // AI/RAG設定
  chatConfiguration,
  aiGuardrails,
  aiProviderSettings,
  ragConfiguration,
  knowledgeBase,

  // オブジェクト
  seo,
  schemaOrg,
  hero,
  cta,
  feature,
  testimonial,
  categoryCard,
  socialLink,
  navigationMenu,
  table,
  infoBox,
  comparisonTable,
  internalLink,
  externalReference,

  // コンポーネント
  customImage,
  portableText,
  videoEmbed,
  socialEmbed,
  codeBlock
]