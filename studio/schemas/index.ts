// ドキュメントスキーマ
import blogPost from './documents/blogPost'
import author from './documents/author'
import category from './documents/category'
import event from './documents/event'
import news from './documents/news'
import menuItem from './documents/menuItem'
import shopInfo from './documents/shopInfo'
import page from './documents/page'
import homepage from './documents/homepage'
import siteSettings from './documents/siteSettings'
import course from './documents/course'
import schoolPage from './documents/schoolPage'
import { faq } from './faq'

// オブジェクトスキーマ
import seo from './objects/seo'
import schemaOrg from './objects/schemaOrg'
import hero from './objects/hero'
import cta from './objects/cta'
import feature from './objects/feature'
import testimonial from './objects/testimonial'
import categoryCard from './objects/categoryCard'
import socialLink from './objects/socialLink'

// コンポーネントスキーマ
import customImage from './components/customImage'
import portableText from './components/portableText'
import videoEmbed from './components/videoEmbed'
import socialEmbed from './components/socialEmbed'
import codeBlock from './components/codeBlock'

export const schemaTypes = [
  // ドキュメント
  blogPost,
  author,
  category,
  event,
  news,
  menuItem,
  shopInfo,
  page,
  homepage,
  siteSettings,
  course,
  schoolPage,
  faq,

  // オブジェクト
  seo,
  schemaOrg,
  hero,
  cta,
  feature,
  testimonial,
  categoryCard,
  socialLink,

  // コンポーネント
  customImage,
  portableText,
  videoEmbed,
  socialEmbed,
  codeBlock
]