// FAQ型定義

// FAQカテゴリー型
export interface FAQCategory {
  _id: string
  _type: 'faqCategory'
  title: string
  slug: {
    _type: 'slug'
    current: string
  }
  description?: string
  order: number
}

// FAQ型（Sanityから取得した生のデータ）
export interface FAQ {
  _id: string
  _type: 'faq'
  question: string
  answer: string
  category: {
    _ref: string
    _type: 'reference'
  }
  order: number
}

// FAQ型（カテゴリー情報をpopulateした後）
export interface FAQWithCategory extends Omit<FAQ, 'category'> {
  category: FAQCategory
}

// 後方互換性のため残しておく（非推奨）
// @deprecated カテゴリーはSanityドキュメントから動的に取得してください
export const CATEGORY_LABELS: Record<string, string> = {
  kinesi: 'キネシオロジーについて',
  beginner: '初心者向け',
  course: '講座について',
  price: '料金・支払い',
  cancel: 'キャンセル・変更',
  instructor: 'インストラクターについて',
  session: 'セッションについて',
  booking: '予約・申込について',
  venue: '会場・アクセスについて',
  other: 'その他',
}
